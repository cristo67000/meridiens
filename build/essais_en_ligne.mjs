/*
 * Épreuves du site publié (GitHub Pages).
 *
 *   node build/essais_en_ligne.mjs
 *
 * 1. Chaque fichier de la coquille, tel que Pages le sert, est identique à
 *    celui du dernier commit (comparaison d'empreintes SHA-256).
 * 2. Chrome sans affichage ouvre le site : le service worker s'installe et
 *    range la coquille complète (après une sonde de l'API Cache).
 * 3. Chrome est relancé sur le même profil avec le domaine coupé
 *    (--host-resolver-rules) : l'application doit s'ouvrir quand même.
 */
import { spawn, execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SITE = 'https://cristo67000.github.io/meridiens/';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9372;
let echecs = 0;
let reussites = 0;
function verifier(nom, ok, detail) {
  if (ok) { reussites += 1; console.log('ok     ' + nom); } else { echecs += 1; console.log('ÉCHEC  ' + nom + (detail ? ' — ' + detail : '')); }
}
const attendre = (ms) => new Promise((r) => setTimeout(r, ms));
const empreinte = (b) => crypto.createHash('sha256').update(b).digest('hex');

// ── 1. Les fichiers servis ─────────────────────────────────────────────────
const sw = execFileSync('git', ['show', 'HEAD:sw.js'], { cwd: RACINE });
const fichiers = [...String(sw).matchAll(/^ {2}'([^']+)',$/gm)].map((m) => m[1]).filter((f) => f !== './');
let identiques = 0;
for (const f of fichiers) {
  const local = execFileSync('git', ['show', 'HEAD:' + f], { cwd: RACINE, maxBuffer: 1 << 26 });
  const r = await fetch(SITE + f + '?essai=' + Date.now(), { cache: 'no-store' });
  const distant = Buffer.from(await r.arrayBuffer());
  if (r.ok && empreinte(local) === empreinte(distant)) identiques += 1;
  else verifier('servi à l’identique : ' + f, false, 'HTTP ' + r.status);
}
verifier(identiques + '/' + fichiers.length + ' fichiers servis identiques au commit', identiques === fichiers.length);

// ── 2 et 3. Chrome ─────────────────────────────────────────────────────────
const profil = fs.mkdtempSync(path.join(os.tmpdir(), 'meridiens-enligne-'));
async function lancer(coupe) {
  const args = ['--headless=new', '--disable-gpu', '--remote-debugging-port=' + PORT, '--user-data-dir=' + profil, '--no-first-run', '--no-default-browser-check'];
  if (coupe) args.push('--host-resolver-rules=MAP cristo67000.github.io ~NOTFOUND');
  args.push('about:blank');
  const p = spawn(CHROME, args, { stdio: 'ignore' });
  let cible = null;
  for (let i = 0; i < 60 && !cible; i += 1) {
    try { cible = (await (await fetch('http://127.0.0.1:' + PORT + '/json/list')).json()).find((t) => t.type === 'page'); } catch (e) { await attendre(250); }
  }
  const ws = new WebSocket(cible.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  let n = 0;
  const attente = new Map();
  ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && attente.has(m.id)) { attente.get(m.id)(m); attente.delete(m.id); } });
  const cdp = (method, params) => { n += 1; const id = n; ws.send(JSON.stringify({ id, method, params: params || {} })); return new Promise((r) => attente.set(id, r)); };
  const evaluer = async (expression) => ((await cdp('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.result || {}).value;
  return { p, ws, cdp, evaluer };
}
async function arreter(c) {
  c.ws.close();
  c.p.kill();
  await attendre(1500);
}

let c = await lancer(false);
await c.cdp('Page.navigate', { url: SITE });
await attendre(4000);
const sonde = await c.evaluer("(async () => { try { const k = await caches.open('sonde'); await k.put('/sonde', new Response('bonjour')); await caches.delete('sonde'); return 'ok'; } catch (e) { return String(e); } })()");
verifier('l’API Cache fonctionne dans ce Chrome', sonde === 'ok', sonde);
let etat = null;
for (let i = 0; i < 30; i += 1) {
  etat = await c.evaluer("(async () => { const cles = await caches.keys(); const k = cles.find((x) => x.startsWith('meridiens-coquille-')); const n = k ? (await (await caches.open(k)).keys()).length : 0; return { cles, n, controleur: !!navigator.serviceWorker.controller }; })()");
  if (etat && etat.n >= fichiers.length + 1) break;
  await attendre(1000);
}
verifier('le service worker range la coquille complète', etat && etat.n === fichiers.length + 1, JSON.stringify(etat));
await c.cdp('Page.reload');
await attendre(2500);
verifier('la page est contrôlée par le service worker', await c.evaluer('!!navigator.serviceWorker.controller'));
await arreter(c);

c = await lancer(true);
const coupe = await c.evaluer("fetch('https://cristo67000.github.io/meridiens/inexistant-' + Date.now()).then(() => 'joignable', () => 'coupé')");
await c.cdp('Page.navigate', { url: SITE + '#/point/MC6' });
await attendre(3500);
verifier('le domaine est bien coupé', coupe === 'coupé', coupe);
const hors = await c.evaluer("({ titre: document.title, h2: (document.querySelector('#scene h2') || {}).textContent, planche: !!document.querySelector('.planche .pt.actif'), controleur: !!navigator.serviceWorker.controller })");
verifier('hors ligne : la fiche de MC6 s’ouvre avec son schéma', hors && hors.h2 === 'Nèiguān' && hors.planche && hors.controleur, JSON.stringify(hors));
await c.cdp('Page.navigate', { url: SITE + '#/seance/nausees' });
await attendre(1500);
verifier('hors ligne : la séance guidée s’ouvre', /Séance guidée/.test(await c.evaluer("document.querySelector('#scene').innerText")));
await arreter(c);
try { fs.rmSync(profil, { recursive: true, force: true }); } catch (e) { /* profil verrouillé */ }

console.log(reussites + ' réussites, ' + echecs + ' échecs');
process.exit(echecs ? 1 : 0);
