/*
 * Épreuves statiques de Méridiens : syntaxe, cohérence du service worker,
 * intégrité du contenu (renvois, positions des points, aliments…).
 *
 *   node build/essais.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RACINE = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const lire = (f) => fs.readFileSync(path.join(RACINE, f), 'utf8');
let echecs = 0;
let reussites = 0;
function verifier(nom, condition, detail) {
  if (condition) { reussites += 1; return; }
  echecs += 1;
  console.log('ÉCHEC  ' + nom + (detail ? ' — ' + detail : ''));
}

// ── Fichiers chargés et service worker ─────────────────────────────────────
const html = lire('index.html');
const css = [...html.matchAll(/href="(css\/[^"]+)"/g)].map((m) => m[1]);
const js = [...html.matchAll(/src="(js\/[^"]+)"/g)].map((m) => m[1]);
const sw = lire('sw.js');
const fichiersSw = [...sw.matchAll(/^ {2}'([^']+)',$/gm)].map((m) => m[1]);
const attendus = ['./', 'index.html', 'manifest.webmanifest', ...css, ...js, 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'];
verifier('le service worker range exactement les fichiers de la page', JSON.stringify(fichiersSw) === JSON.stringify(attendus),
  'en trop : ' + fichiersSw.filter((f) => !attendus.includes(f)).join(', ') + ' ; manquants : ' + attendus.filter((f) => !fichiersSw.includes(f)).join(', '));
for (const f of attendus) if (f !== './') verifier('fichier présent : ' + f, fs.existsSync(path.join(RACINE, f)));
const versionSw = (/const VERSION = '([^']+)'/.exec(sw) || [])[1];
const versionHtml = (/name="application-version" content="([^"]+)"/.exec(html) || [])[1];
verifier('même version dans sw.js et index.html', versionSw && versionSw === versionHtml, versionSw + ' / ' + versionHtml);
const manifeste = JSON.parse(lire('manifest.webmanifest'));
for (const i of manifeste.icons) verifier('icône du manifeste : ' + i.src, fs.existsSync(path.join(RACINE, i.src)));

// ── Syntaxe et caractères de contrôle ──────────────────────────────────────
for (const f of [...js, 'sw.js']) {
  try { execFileSync(process.execPath, ['--check', path.join(RACINE, f)], { stdio: 'pipe' }); verifier('syntaxe ' + f, true); } catch (e) { verifier('syntaxe ' + f, false, String(e.stderr)); }
}
for (const f of [...js, ...css, 'index.html', 'sw.js']) {
  const t = lire(f);
  const mauvais = [...t].filter((c) => c.charCodeAt(0) < 32 && c !== '\n' && c !== '\t' && c !== '\r');
  verifier('pas de caractère de contrôle dans ' + f, !mauvais.length, mauvais.map((c) => c.charCodeAt(0)).join(','));
  verifier('aucun style en ligne dans ' + f, f.endsWith('.css') || !/\sstyle="/.test(t.replace(/style: null/g, '')));
}

// ── Le contenu, chargé comme dans la page ──────────────────────────────────
const fenetre = { location: { hostname: 'essai', search: '' }, console: { warn() {}, log() {} } };
fenetre.window = fenetre;
const ctx = vm.createContext(Object.assign(fenetre, { Math, JSON, Object, Array, Set, Map, String, Number, Error, parseInt, RegExp, Date }));
for (const f of js.filter((x) => /anatomie\/|donnees\//.test(x))) vm.runInContext(lire(f), ctx, { filename: f });
const { MTC, Corps, Regions } = fenetre;

verifier('14 méridiens', MTC.meridiens.length === 14);
verifier('plus de 120 points', MTC.points.length > 120, MTC.points.length);
const idsPoints = new Set(MTC.points.map((p) => p.id));
for (const m of MTC.meridiens) for (const p of m.points) verifier('point du méridien ' + m.id + ' : ' + p, idsPoints.has(p));
for (const p of MTC.points) {
  verifier('nom en NFC : ' + p.id, p.nom === p.nom.normalize('NFC'));
  const vues = Regions.vuesDuPoint(p.id);
  verifier('position du point ' + p.id, vues.length || Corps.positions.face[p.id] || Corps.positions.dos[p.id]);
  for (const champ of ['loc', 'technique', 'sens', 'hanzi']) verifier(p.id + ' a son champ ' + champ, p[champ] && p[champ].length > 0);
  verifier(p.id + ' a des indications', p.indications && p.indications.length > 0);
}
// toutes les planches se construisent, et leurs tracés aussi
for (const r of Regions.liste()) { const pl = Regions.planche(r); verifier('planche ' + r, pl && pl.fond && Object.keys(pl.points).length > 0); }

// renvois [[…]] dans tous les textes
const textes = [];
const parcourir = (o) => { if (typeof o === 'string') textes.push(o); else if (Array.isArray(o)) o.forEach(parcourir); else if (o && typeof o === 'object') Object.values(o).forEach(parcourir); };
parcourir([MTC.meridiens, MTC.points, MTC.chapitres, MTC.soins, MTC.aliments, MTC.saisons, MTC.constitutions, MTC.recettes]);
const cibles = { pt: MTC.point, m: MTC.meridien, s: MTC.soin, p: MTC.chapitre, a: MTC.aliment, r: MTC.recette, c: MTC.constitution };
const HORS = new Set(['horloge', 'soins', 'dietetique', 'meridiens', 'principes', 'points', 'aliments', 'recettes', 'constitution']);
for (const t of textes) {
  for (const m of t.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g)) {
    const cle = m[1].trim();
    const [type, id] = cle.includes(':') ? cle.split(':') : ['pt', cle];
    verifier('renvoi [[' + cle + ']]', type === 'h' ? HORS.has(id) : cibles[type] && cibles[type](id));
  }
  verifier('pas d’apostrophe droite dans le texte : « ' + t.slice(0, 50) + ' »', !/[A-Za-zÀ-ÿ]'[A-Za-zÀ-ÿ]/.test(t));
  verifier('pas de double espace : « ' + t.slice(0, 50) + ' »', !/\S {2,}\S/.test(t));
}
for (const s of MTC.soins) {
  for (const e of s.points) verifier('soin ' + s.id + ' → point ' + e.id, idsPoints.has(e.id));
  for (const f of s.formes || []) for (const p of f.points) verifier('soin ' + s.id + ' (forme) → ' + p, idsPoints.has(p));
  for (const a of [...(s.aliments.plus || []), ...(s.aliments.moins || [])]) verifier('soin ' + s.id + ' → aliment ' + a, MTC.aliment(a));
  verifier('soin ' + s.id + ' dit quand consulter', s.consulter && s.consulter.length > 30);
  verifier('soin ' + s.id + ' : catégorie connue', MTC.categoriesSoins.some((c) => c.id === s.categorie));
}
for (const x of MTC.saisons) for (const a of [...x.favoriser, ...x.moderer]) verifier('saison ' + x.id + ' → ' + a, MTC.aliment(a));
for (const x of MTC.constitutions) for (const a of [...x.plus, ...x.moins]) verifier('constitution ' + x.id + ' → ' + a, MTC.aliment(a));
for (const x of MTC.recettes) for (const a of x.aliments) verifier('recette ' + x.id + ' → ' + a, MTC.aliment(a));
for (const a of MTC.aliments) verifier('nature connue : ' + a.id, ['chaud', 'tiede', 'neutre', 'frais', 'froid'].includes(a.nature));
for (const q of MTC.questionnaire) verifier('question → constitution ' + q.c, MTC.constitution(q.c));

console.log(reussites + ' réussites, ' + echecs + ' échecs');
process.exit(echecs ? 1 : 0);
