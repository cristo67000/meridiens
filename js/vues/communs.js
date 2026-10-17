'use strict';
/*
 * Morceaux communs aux vues : l'encadré de planche à onglets, les puces de
 * code, l'aperçu d'un point dans la feuille, les boutons favori et note.
 */
(function (racine) {

  const { h, icone, riche } = Outils;
  const Vues = racine.Vues = racine.Vues || {};

  const LIBELLES_VUES = {
    'corps-face': 'Corps, face', 'corps-dos': 'Corps, dos', visage: 'Visage', 'tete-profil': 'Tête, profil',
    'nuque-dos': 'Nuque', tronc: 'Tronc', dos: 'Dos', 'main-paume': 'Avant-bras, paume', 'main-dos': 'Avant-bras, dos',
    genou: 'Genou', 'jambe-int': 'Jambe, intérieur', 'jambe-ext': 'Jambe, extérieur', 'jambe-arr': 'Jambe, arrière', pied: 'Pied',
  };

  const ARTICLES = { P: 'du', GI: 'du', E: 'de l’', RP: 'de la', C: 'du', IG: 'de l’', V: 'de la', R: 'du', MC: 'du', TR: 'du', VB: 'de la', F: 'du' };
  function titreMeridien(m) {
    if (!ARTICLES[m.id]) return m.nom;
    const a = ARTICLES[m.id];
    return 'Méridien ' + a + (a.endsWith('’') ? '' : ' ') + m.nom;
  }

  /* La planche d'un identifiant : « corps-face » → Corps.planche('face'). */
  function planche(id) {
    if (id === 'corps-face') return Corps.planche('face');
    if (id === 'corps-dos') return Corps.planche('dos');
    return Regions.planche(id);
  }

  /* Le code d'un point, en puce colorée. */
  function code(id, plein) {
    const m = Planche.meridienDe(id);
    const autre = Notation.autre(id);
    const p = MTC.point(id);
    // un point hors méridien n'a pas de numéro : « EX », et son code OMS s'il en a un
    const texte = m ? Notation.code(id) : 'EX';
    const second = m ? autre : (p && p.oms ? p.oms.replace(/^EX-/, '') : null);
    return h('span', { class: 'code m-' + (m || 'EX') + (plein ? ' plein' : ''), title: m ? null : 'Point hors méridien' }, texte,
      second && plein !== 'seul' ? h('span', { class: 'autre' }, ' · ' + second) : null);
  }

  /* Le nom d'un point pour les lecteurs d'écran et les étiquettes. */
  function nomPoint(id) {
    const p = MTC.point(id);
    return p ? Notation.code(id) + ' ' + p.nom : id;
  }
  function libellePoint(id) {
    const m = Planche.meridienDe(id);
    if (m) return Notation.code(id);
    const p = MTC.point(id);
    return p ? p.nom.normalize('NFKD').replace(/\p{M}/gu, '') : id;
  }

  /*
   * L'encadré d'une planche, avec des onglets s'il y en a plusieurs.
   * vues : [{ id, options, cadre? }]
   */
  function cadrePlanche(o) {
    const boite = h('div', { class: 'cadre-schema' });
    const barre = h('div', { class: 'barre-schema onglets-vue', role: 'tablist' });
    const zone = h('div', { class: 'zone-planche' });
    const legende = h('p', { class: 'legende-schema' });
    const reperes = h('ol', { class: 'reperes', 'aria-label': 'Repères pour trouver le point' });
    let vis = null;
    let indice = -1;
    const boutons = [];
    function montrer(i) {
      if (i === indice) return;
      indice = i;
      const v = o.vues[i];
      const pl = planche(v.id);
      const opts = Object.assign({ libelle: libellePoint, nomPoint }, v.options || {});
      const svg = Planche.dessiner(pl, opts);
      if (vis) vis.detruire();
      vis = Visionneuse.creer(svg, { largeur: pl.largeur, hauteur: pl.hauteur, cadre: v.cadre, classe: o.taille || '' });
      zone.textContent = '';
      zone.appendChild(vis.element);
      legende.textContent = v.legende || pl.legende || '';
      legende.hidden = !legende.textContent;
      reperes.textContent = '';
      const textes = opts.guides && opts.actif ? Planche.textesGuides(pl, opts.actif) : [];
      for (const t of textes) reperes.appendChild(h('li', null, t));
      reperes.hidden = !textes.length;
      boutons.forEach((b, k) => b.setAttribute('aria-selected', k === i ? 'true' : 'false'));
      boutons.forEach((b, k) => b.setAttribute('aria-pressed', k === i ? 'true' : 'false'));
      if (o.surChangement) o.surChangement(v, i);
    }
    o.vues.forEach((v, i) => {
      const b = h('button', { type: 'button', class: 'puce', role: 'tab', onclick: () => montrer(i) }, v.libelle || LIBELLES_VUES[v.id] || v.id);
      boutons.push(b);
      barre.appendChild(b);
    });
    if (o.vues.length > 1 || o.barre) boite.appendChild(barre);
    if (o.barre) barre.appendChild(o.barre);
    boite.appendChild(zone);
    boite.appendChild(reperes);
    boite.appendChild(legende);
    montrer(o.initial || 0);
    return { element: boite, montrer, get visionneuse() { return vis; }, get indice() { return indice; } };
  }

  /* Les points de la base qui figurent sur une planche. */
  function pointsSur(pl, filtre) {
    return Object.keys(pl.points).filter((id) => MTC.point(id) && (!filtre || filtre(id)));
  }

  // ── Favori, note ─────────────────────────────────────────────────────────
  function boutonFavori(cle, libelle) {
    const b = h('button', { type: 'button', class: 'bouton-discret' });
    function maj() {
      const f = Carnet.estFavori(cle);
      b.setAttribute('aria-pressed', f ? 'true' : 'false');
      b.textContent = '';
      b.appendChild(icone(f ? 'etoilePleine' : 'etoile'));
      b.appendChild(document.createTextNode(f ? 'Favori' : 'Favori'));
      b.setAttribute('aria-label', (f ? 'Retirer des favoris : ' : 'Ajouter aux favoris : ') + (libelle || ''));
    }
    b.addEventListener('click', () => { Carnet.basculerFavori(cle); maj(); Outils.vibrer(12); });
    maj();
    return b;
  }

  function boutonNote(cle, libelle, surChangement) {
    const b = h('button', { type: 'button', class: 'bouton-discret' });
    function maj() {
      const n = Carnet.note(cle);
      b.setAttribute('aria-pressed', n ? 'true' : 'false');
      b.textContent = '';
      b.appendChild(icone('note'));
      b.appendChild(document.createTextNode(n ? 'Ma note' : 'Note'));
    }
    b.addEventListener('click', () => {
      const n = Carnet.note(cle);
      const zone = h('textarea', { class: 'note', 'aria-label': 'Ma note', placeholder: 'Ce que vous avez ressenti, ce qui vous aide, un conseil reçu…' });
      zone.value = n ? n.texte : '';
      const enregistrer = h('button', { type: 'button', class: 'bouton-principal', onclick: () => {
        Carnet.ecrireNote(cle, zone.value);
        maj();
        if (surChangement) surChangement();
        Feuille.fermer();
      } }, 'Enregistrer');
      const effacer = n ? h('button', { type: 'button', class: 'bouton-secondaire', onclick: () => { Carnet.ecrireNote(cle, ''); maj(); if (surChangement) surChangement(); Feuille.fermer(); } }, 'Effacer') : null;
      Feuille.ouvrir(h('div', null, h('h3', null, 'Ma note — ' + (libelle || '')), zone, h('div', { class: 'rangee-boutons' }, effacer, enregistrer)), { titre: 'Ma note' });
      setTimeout(() => zone.focus(), 320);
    });
    maj();
    return b;
  }

  function boutonPartager(titre, adresse) {
    if (!navigator.share) return null;
    return h('button', { type: 'button', class: 'bouton-discret', onclick: async () => {
      try { await navigator.share({ title: titre, url: adresse }); } catch (e) { /* annulé */ }
    } }, icone('partager'), 'Partager');
  }

  // ── Aperçu d'un point (dans la feuille) ─────────────────────────────────
  function apercuPoint(id) {
    const p = MTC.point(id);
    if (!p) return;
    const m = MTC.meridienDuPoint(id);
    const contenu = h('div', { class: 'apercu-point' },
      h('div', { class: 'entete' },
        h('span', { class: 'cachet couleur m-' + (m ? m.id : 'EX') }, p.hanzi),
        h('div', { class: 'entete-corps' },
          h('div', { class: 'surtitre' }, code(id, true), m ? h('span', null, m.nom) : h('span', null, 'Hors méridien')),
          h('h2', null, p.nom),
          h('p', { class: 'sous-titre' }, p.sens))),
      h('p', null, riche(p.loc)),
      h('ul', { class: 'indications' }, p.indications.slice(0, 4).map((t) => h('li', null, Outils.brut(t)))),
      p.grossesse ? h('p', { class: 'drapeau-grossesse' }, icone('alerte'), 'À éviter pendant la grossesse') : null,
      h('div', { class: 'rangee-boutons' },
        h('button', { type: 'button', class: 'bouton-principal', onclick: () => Feuille.aller('#/point/' + id) }, 'Voir la fiche', icone('suite'))));
    Feuille.ouvrir(contenu, { titre: p.nom });
  }

  /* Une petite vignette statique d'un point sur sa vue de détail. */
  function vignettePoint(id, options) {
    const vues = Regions.vuesDuPoint(id);
    const o = options || {};
    let pl;
    let cadre = null;
    if (vues.length) pl = Regions.planche(vues[0]);
    else {
      pl = Corps.planche(Corps.positions.face[id] ? 'face' : 'dos');
      cadre = Planche.cadrer(pl, [id], 90, 0.8);
    }
    const m = Planche.meridienDe(id);
    const svg = Planche.dessiner(pl, { meridiens: m ? [m] : [], points: [id], actif: id, cadre: cadre || o.cadre, animer: false, etiquettes: false, titre: nomPoint(id) });
    const l = cadre ? cadre[2] : pl.largeur;
    svg.style.setProperty('--echelle', String((o.largeurAffichee || 120) / l));
    return svg;
  }

  /* L'en-tête d'une fiche. */
  /* Un cachet chinois : les caractères en colonnes, de haut en bas et de
   * droite à gauche, en colonnes de hauteur égale (2 × 2, 3 × 2…). */
  function cachet(texte, classe) {
    const c = h('span', { class: 'cachet' + (classe ? ' ' + classe : '') }, texte);
    const n = Array.from(texte).length;
    if (n > 2) c.style.setProperty('--lignes', String(n <= 3 ? n : Math.ceil(n / 2)));
    return c;
  }

  function entete(o) {
    return h('div', { class: 'entete' },
      o.cachet ? cachet(o.cachet, 'grand' + (o.cachetClasse ? ' ' + o.cachetClasse : '')) : null,
      h('div', { class: 'entete-corps' },
        o.surtitre ? h('div', { class: 'surtitre' }, o.surtitre) : null,
        h('h2', null, o.titre),
        o.sousTitre ? h('p', { class: 'sous-titre' }, o.sousTitre) : null));
  }

  function section(titre, nomIcone, ...contenu) {
    return h('section', { class: 'section' }, h('h3', null, nomIcone ? icone(nomIcone) : null, titre), ...contenu);
  }

  function itemLien(href, titre, sous, avant, apres) {
    return h('li', null, h('a', { class: 'item', href }, avant || null,
      h('div', { class: 'item-corps' }, h('div', { class: 'item-titre' }, titre), sous ? h('div', { class: 'item-sous' }, sous) : null),
      apres || icone('suite')));
  }

  /* Le rendu d'un point en ligne de liste. */
  function itemPoint(id, sous) {
    const p = MTC.point(id);
    if (!p) return null;
    return itemLien('#/point/' + id, [code(id), ' ', p.nom, ' ', h('span', { class: 'item-han' }, p.hanzi)],
      sous || p.sens + ' — ' + p.indications.slice(0, 2).map(Outils.brut).join(', ').toLowerCase());
  }

  Object.assign(Vues, {});
  racine.Communs = {
    cadrePlanche, planche, pointsSur, code, nomPoint, libellePoint, boutonFavori, boutonNote, boutonPartager,
    apercuPoint, vignettePoint, entete, cachet, section, itemLien, itemPoint, titreMeridien, LIBELLES_VUES,
  };

})(window);
