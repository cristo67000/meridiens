'use strict';
/*
 * Service worker de Méridiens.
 *
 * Toute l'application — pages, styles, scripts, données, icônes — tient en
 * un seul bloc rangé dans un cache propre à la version : « cache d'abord »,
 * et hors ligne dès le premier lancement.
 *
 * Une version suivante se prépare dans un autre cache et ne prend la main
 * qu'au feu vert de js/miseajour.js (le bandeau « Mettre à jour ») : une
 * page ne reçoit jamais qu'un jeu complet d'une seule version, et une séance
 * en cours n'est jamais interrompue. L'ancien cache n'est effacé qu'à
 * l'activation de la nouvelle version.
 *
 * ⚠ La liste ci-dessous doit rester celle des fichiers que la page charge :
 * build/essais.mjs compare les deux.
 */

const VERSION = 'v1.0.1';
const COQUILLE = 'meridiens-coquille-' + VERSION;

const FICHIERS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/theme.css',
  'css/planche.css',
  'css/schemas.css',
  'css/app.css',
  'js/icones.js',
  'js/outils.js',
  'js/store.js',
  'js/anatomie/geo.js',
  'js/anatomie/corps.js',
  'js/anatomie/regions.js',
  'js/anatomie/planche.js',
  'js/visionneuse.js',
  'js/donnees/meridiens.js',
  'js/donnees/points.js',
  'js/donnees/principes.js',
  'js/donnees/soins.js',
  'js/donnees/aliments.js',
  'js/donnees/dietetique.js',
  'js/donnees/index.js',
  'js/schemas/schemas.js',
  'js/schemas/horloge.js',
  'js/schemas/taiji.js',
  'js/schemas/wuxing.js',
  'js/schemas/diagnostic.js',
  'js/schemas/cun.js',
  'js/feuille.js',
  'js/vues/communs.js',
  'js/vues/accueil.js',
  'js/vues/principes.js',
  'js/vues/meridiens.js',
  'js/vues/point.js',
  'js/vues/soins.js',
  'js/vues/seance.js',
  'js/vues/dietetique.js',
  'js/vues/recherche.js',
  'js/vues/carnet.js',
  'js/vues/reglages.js',
  'js/miseajour.js',
  'js/installer.js',
  'js/app.js',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
];

/* `cache: 'reload'` court-circuite le cache du navigateur, pas celui du relais
 * de GitHub Pages, qui garde un fichier dix minutes : une adresse que personne
 * n'a encore demandée est forcément fraîche. */
const MARQUE = '?coquille=' + encodeURIComponent(VERSION);

async function installerLaCoquille(cache) {
  const manques = [];
  await Promise.all(FICHIERS.map(async (url) => {
    try {
      const reponse = await fetch(new Request(url + MARQUE, { cache: 'reload' }));
      if (!reponse.ok) { manques.push(url + ' : ' + reponse.status); return; }
      await cache.put(url, reponse);
    } catch (erreur) {
      manques.push(url + ' : ' + (erreur && erreur.message ? erreur.message : erreur));
    }
  }));
  if (manques.length) throw new Error('coquille incomplète — ' + manques.join(', '));
  const page = await cache.match('index.html');
  const html = page ? await page.text() : '';
  if (html.indexOf('name="application-version" content="' + VERSION + '"') === -1) {
    throw new Error('index.html n’est pas de la version ' + VERSION);
  }
}

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(COQUILLE);
    try {
      await installerLaCoquille(cache);
    } catch (erreur) {
      await caches.delete(COQUILLE);
      throw erreur;
    }
    // Pas de skipWaiting() : la nouvelle version attend le feu vert du bandeau.
  })());
});

self.addEventListener('message', (e) => {
  const message = e.data || {};
  if (message.type === 'passer-devant') self.skipWaiting();
  if (message.type === 'version' && e.ports && e.ports[0]) e.ports[0].postMessage({ version: VERSION });
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const nom of await caches.keys()) {
      if (nom.startsWith('meridiens-coquille-') && nom !== COQUILLE) await caches.delete(nom);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  /* Le cache de cette version, et lui seul. Ce qui n'y est pas va au réseau
   * sans rien laisser dans le cache. Une navigation hors ligne, ou un réseau
   * qui répond mal (portail captif, erreur 5xx), retombe sur la page. */
  e.respondWith((async () => {
    const coquille = await caches.open(COQUILLE);
    const enCache = await coquille.match(e.request, { ignoreSearch: true, ignoreVary: true });
    if (enCache) return enCache;
    try {
      const reponse = await fetch(e.request);
      if (!reponse.ok && e.request.mode === 'navigate') {
        const accueil = await coquille.match('index.html');
        if (accueil) return accueil;
      }
      return reponse;
    } catch (erreur) {
      if (e.request.mode === 'navigate') {
        const accueil = await coquille.match('index.html');
        if (accueil) return accueil;
      }
      throw erreur;
    }
  })());
});
