'use strict';
/*
 * L'application : le routeur et le cadre (barre du haut, onglets, retour).
 *
 * Les adresses sont des ancres (#/point/GI4) : le bouton « retour » du
 * téléphone recule d'un écran, et chaque écran peut se partager ou se
 * mettre en favori. Chaque vue est une fonction (paramètres) → { titre, noeud }.
 */
(function (racine) {

  const { icone } = Outils;
  const V = racine.Vues;

  const ROUTES = [
    [/^$/, 'accueil', 'accueil'],
    [/^principes$/, 'principes', 'principes'],
    [/^principes\/([\w-]+)$/, 'chapitre', 'principes'],
    [/^horloge$/, 'horloge', 'principes'],
    [/^meridiens$/, 'meridiens', 'meridiens'],
    [/^meridien\/(\w+)$/, 'meridien', 'meridiens'],
    [/^points$/, 'points', 'meridiens'],
    [/^point\/([\w-]+)$/, 'point', 'meridiens'],
    [/^soins$/, 'soins', 'soins'],
    [/^soin\/([\w-]+)$/, 'soin', 'soins'],
    [/^seance\/([\w-]+)$/, 'seance', 'soins'],
    [/^dietetique$/, 'dietetique', 'dietetique'],
    [/^aliments$/, 'aliments', 'dietetique'],
    [/^aliment\/([\w-]+)$/, 'aliment', 'dietetique'],
    [/^saison\/([\w-]+)$/, 'saison', 'dietetique'],
    [/^constitution$/, 'questionnaire', 'dietetique'],
    [/^constitution\/([\w-]+)$/, 'constitution', 'dietetique'],
    [/^recettes$/, 'recettes', 'dietetique'],
    [/^recette\/([\w-]+)$/, 'recette', 'dietetique'],
    [/^recherche$/, 'recherche', null],
    [/^carnet$/, 'carnet', null],
    [/^reglages$/, 'reglages', null],
    [/^apropos$/, 'apropos', null],
  ];
  const RACINES = new Set(['', 'principes', 'meridiens', 'soins', 'dietetique']);

  const scene = document.getElementById('scene');
  const titre = document.getElementById('titre');
  const retour = document.getElementById('b-retour');
  const barre = document.getElementById('barre');
  const logo = document.getElementById('logo-barre');

  let vueActive = null;
  const pile = [];
  const defilements = new Map();

  function chemin() {
    return decodeURIComponent(location.hash.replace(/^#\/?/, '')).replace(/\/$/, '');
  }

  function resoudre(ch) {
    const [base] = ch.split('?');
    for (const [motif, vue, onglet] of ROUTES) {
      const m = motif.exec(base);
      if (m) return { vue, onglet, params: m.slice(1) };
    }
    return null;
  }

  function requete() {
    const i = location.hash.indexOf('?');
    return new URLSearchParams(i >= 0 ? location.hash.slice(i + 1) : '');
  }

  function afficher() {
    const ch = chemin();
    // pile de navigation : savoir si l'on recule
    let recul = false;
    if (pile.length >= 2 && pile[pile.length - 2] === ch) { pile.pop(); recul = true; } else if (pile[pile.length - 1] !== ch) pile.push(ch);
    if (pile.length > 60) pile.splice(0, pile.length - 60);

    const route = resoudre(ch);
    if (vueActive && vueActive.quitter) { try { vueActive.quitter(); } catch (e) { /* rien */ } }
    if (racine.Feuille) Feuille.fermer(true);
    document.body.classList.remove('plein-ecran');

    let rendu;
    try {
      if (!route || !V[route.vue]) rendu = introuvable();
      else rendu = V[route.vue](...route.params, requete());
      if (!rendu) rendu = introuvable();
    } catch (erreur) {
      console.error(erreur);
      rendu = erreurVue(erreur);
    }
    vueActive = rendu;
    scene.textContent = '';
    const conteneur = document.createElement('div');
    conteneur.className = 'vue';
    conteneur.appendChild(rendu.noeud);
    scene.appendChild(conteneur);

    titre.textContent = rendu.titre || 'Méridiens';
    document.title = rendu.titre && rendu.titre !== 'Méridiens' ? rendu.titre + ' — Méridiens' : 'Méridiens — médecine chinoise et digipuncture';
    const estRacine = RACINES.has(ch.split('?')[0]);
    retour.hidden = estRacine;
    logo.style.display = estRacine ? '' : 'none';
    if (rendu.pleinEcran) document.body.classList.add('plein-ecran');

    for (const a of document.querySelectorAll('#onglets a')) {
      if (route && a.dataset.onglet === route.onglet) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    }
    for (const id of ['b-recherche', 'b-carnet', 'b-reglages']) {
      const b = document.getElementById(id);
      const cible = b.getAttribute('href').slice(2);
      if (cible === ch) b.setAttribute('aria-pressed', 'true'); else b.removeAttribute('aria-pressed');
    }

    const y = recul ? (defilements.get(ch) || 0) : 0;
    racine.scrollTo(0, y);
    if (rendu.apres) requestAnimationFrame(() => rendu.apres());
  }

  function introuvable() {
    const n = Outils.h('div', { class: 'section' },
      Outils.h('h2', null, 'Page introuvable'),
      Outils.h('p', null, 'Cette adresse ne correspond à aucune page de Méridiens.'),
      Outils.h('a', { class: 'bouton-principal', href: '#/' }, 'Revenir à l’accueil'));
    return { titre: 'Introuvable', noeud: n };
  }
  function erreurVue(erreur) {
    const n = Outils.h('div', { class: 'section' },
      Outils.h('h2', null, 'Un souci d’affichage'),
      Outils.h('p', null, 'Cette page n’a pas pu s’afficher. Vous pouvez revenir en arrière ou à l’accueil.'),
      Outils.h('p', { class: 'discret' }, String(erreur && erreur.message || erreur)),
      Outils.h('a', { class: 'bouton-principal', href: '#/' }, 'Accueil'));
    return { titre: 'Erreur', noeud: n };
  }

  function reculer() {
    if (pile.length >= 2) history.back();
    else {
      const route = resoudre(chemin());
      location.hash = '#/' + (route && route.onglet && route.onglet !== 'accueil' ? route.onglet : '');
    }
  }

  // ── Mise en place ────────────────────────────────────────────────────────
  retour.appendChild(icone('retour'));
  retour.addEventListener('click', reculer);
  document.getElementById('b-recherche').appendChild(icone('recherche'));
  document.getElementById('b-carnet').appendChild(icone('carnet'));
  document.getElementById('b-reglages').appendChild(icone('reglages'));
  for (const a of document.querySelectorAll('#onglets a')) {
    a.insertBefore(icone(a.dataset.icone), a.firstChild);
    // toucher l'onglet actif ramène en haut de la rubrique
    a.addEventListener('click', (e) => {
      const route = resoudre(chemin());
      if (route && route.onglet === a.dataset.onglet && RACINES.has(chemin())) {
        e.preventDefault();
        racine.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  racine.addEventListener('hashchange', () => {
    defilements.set(pile[pile.length - 1], racine.scrollY);
    afficher();
  });
  racine.addEventListener('scroll', () => {
    barre.classList.toggle('ombre', racine.scrollY > 4);
  }, { passive: true });

  racine.App = { reculer, afficher, chemin };

  afficher();

  // L'écran de démarrage s'efface ; l'avertissement s'affiche une fois.
  requestAnimationFrame(() => {
    const d = document.getElementById('demarrage');
    d.classList.add('parti');
    setTimeout(() => d.remove(), 400);
    if (!Reglages.lire('avertissementVu') && V.avertissement) V.avertissement();
  });

  // Service worker (pas sur localhost avec ?sans-sw, pour le développement)
  const sansSw = /[?&]sans-sw/.test(location.search);
  if ('serviceWorker' in navigator && !sansSw && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').then((inscription) => {
      if (racine.MiseAJour) MiseAJour.surveiller(inscription);
    }).catch(() => { /* hors ligne au premier lancement : rien de grave */ });
  }

})(window);
