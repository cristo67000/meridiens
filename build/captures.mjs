/*
 * Captures d'écran sur un téléphone simulé, par Chrome sans affichage piloté
 * en CDP : pour relire l'interface page par page.
 *
 *   node build/captures.mjs <dossier> [route1 route2 …] [--sombre] [--large] [--plein]
 *
 * Le serveur de développement doit tourner (port 8230), ou l'on passe
 * --serveur pour en démarrer un temporaire sur le port 8231.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const args = process.argv.slice(2);
const dossier = args.find((a) => !a.startsWith('--') && !a.startsWith('#')) || 'captures';
const routes = args.filter((a) => a.startsWith('#'));
const sombre = args.includes('--sombre');
const large = args.includes('--large');
const plein = args.includes('--plein');
const avecServeur = args.includes('--serveur');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT_CDP = 9371;
let base = 'http://127.0.0.1:8230/index.html?sans-sw';
let serveur = null;
if (avecServeur) {
  const { demarrerServeur } = await import('./serveur_local.mjs');
  serveur = await demarrerServeur(8231);
  base = 'http://127.0.0.1:8231/index.html?sans-sw';
}

const profil = fs.mkdtempSync(path.join(os.tmpdir(), 'meridiens-cdp-'));
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=' + PORT_CDP,
  '--user-data-dir=' + profil, '--no-first-run', '--no-default-browser-check', 'about:blank'], { stdio: 'ignore' });

async function attendre(ms) { return new Promise((r) => setTimeout(r, ms)); }
let cible = null;
for (let i = 0; i < 50 && !cible; i += 1) {
  try {
    const l = await (await fetch('http://127.0.0.1:' + PORT_CDP + '/json/list')).json();
    cible = l.find((t) => t.type === 'page');
  } catch (e) { await attendre(200); }
}
if (!cible) { console.error('Chrome ne répond pas'); process.exit(1); }

const ws = new WebSocket(cible.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let n = 0;
const attente = new Map();
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && attente.has(m.id)) { attente.get(m.id)(m); attente.delete(m.id); }
});
function cdp(method, params) {
  n += 1;
  const id = n;
  ws.send(JSON.stringify({ id, method, params: params || {} }));
  return new Promise((r) => attente.set(id, r));
}

const largeur = large ? 1200 : 390;
const hauteur = large ? 900 : 844;
await cdp('Emulation.setDeviceMetricsOverride', { width: largeur, height: hauteur, deviceScaleFactor: large ? 1 : 2, mobile: !large });
// --ua=samsung | --ua=chrome : se faire passer pour un téléphone Android
const UA = {
  samsung: 'Mozilla/5.0 (Linux; Android 15; SM-A266B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/28.0 Chrome/130.0.0.0 Mobile Safari/537.36',
  chrome: 'Mozilla/5.0 (Linux; Android 15; SM-A266B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36',
};
const choixUa = (args.find((a) => a.startsWith('--ua=')) || '').slice(5);
if (UA[choixUa]) await cdp('Emulation.setUserAgentOverride', { userAgent: UA[choixUa], platform: 'Linux armv8l' });
if (sombre) await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });
await cdp('Page.enable');
await cdp('Runtime.enable');

fs.mkdirSync(dossier, { recursive: true });
const liste = routes.length ? routes : ['#/'];
// première visite : marquer l'avertissement comme vu
await cdp('Page.navigate', { url: base + '#/' });
await attendre(1200);
await cdp('Runtime.evaluate', { expression: "localStorage.setItem('meridiens.reglages', JSON.stringify({avertissementVu:true}))" });

let k = 0;
for (const entree of liste) {
  k += 1;
  // « #/route|code » : le code est exécuté dans la page avant la capture
  const [r, code] = entree.split('|');
  await cdp('Page.navigate', { url: base + '&k=' + k + r });
  await attendre(1600);
  if (code) { await cdp('Runtime.evaluate', { expression: code }); await attendre(1800); }
  const erreurs = await cdp('Runtime.evaluate', { expression: "document.querySelector('#scene') ? document.querySelector('#scene').innerText.slice(0, 60) : 'pas de scène'", returnByValue: true });
  let clip;
  if (plein) {
    const h = await cdp('Runtime.evaluate', { expression: 'document.documentElement.scrollHeight', returnByValue: true });
    clip = { x: 0, y: 0, width: largeur, height: Math.min(h.result.result ? h.result.result.value : h.result.value, 9000), scale: 1 };
  }
  const img = await cdp('Page.captureScreenshot', Object.assign({ format: 'png', captureBeyondViewport: !!plein }, clip ? { clip } : {}));
  const nom = String(k).padStart(2, '0') + '-' + r.replace(/[#/?=&]+/g, '_').replace(/^_|_$/g, '') + (sombre ? '-sombre' : '') + '.png';
  fs.writeFileSync(path.join(dossier, nom || 'accueil.png'), Buffer.from(img.result.data, 'base64'));
  console.log(nom, '·', (erreurs.result.result || {}).value);
}

ws.close();
chrome.kill();
if (serveur) await serveur.arreter();
setTimeout(() => { try { fs.rmSync(profil, { recursive: true, force: true }); } catch (e) { /* profil verrouillé */ } process.exit(0); }, 600);
