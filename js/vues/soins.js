'use strict';
/*
 * Les soins : la liste par catégories, et la fiche d'un soin — explication
 * selon la MTC, protocole de points (avec vignettes), variantes, conseils,
 * aliments, et ce qui doit faire consulter.
 */
(function (racine) {

  const { h, icone, riche, enLigne, normaliser } = Outils;
  const C = racine.Communs;
  const Vues = racine.Vues = racine.Vues || {};

  function puceAliment(id) {
    const a = MTC.aliment(id);
    if (!a) return null;
    return h('a', { class: 'puce n-' + a.nature, href: '#/aliment/' + id }, h('span', { class: 'pastille' }), a.nom);
  }
  racine.Communs.puceAliment = puceAliment;

  Vues.soins = function () {
    const champ = h('input', { type: 'search', placeholder: 'Un mal, un symptôme : tête, sommeil, dos…', 'aria-label': 'Chercher un soin', enterkeyhint: 'search' });
    const zone = h('div');
    const index = MTC.soins.map((s) => ({ s, texte: normaliser([s.nom, s.resume, Outils.brut(s.mtc), (s.formes || []).map((f) => f.nom + ' ' + f.signes).join(' ')].join(' ')) }));
    function dessiner() {
      zone.textContent = '';
      const mots = normaliser(champ.value).split(' ').filter(Boolean);
      let total = 0;
      for (const cat of MTC.categoriesSoins) {
        const liste = index.filter((x) => x.s.categorie === cat.id && (!mots.length || mots.every((m) => x.texte.includes(m))));
        if (!liste.length) continue;
        total += liste.length;
        zone.appendChild(h('h2', { class: 'titre-section' }, h('span', { class: 'item-han' }, cat.hanzi), cat.nom));
        zone.appendChild(h('ul', { class: 'liste' }, liste.map((x) => C.itemLien('#/soin/' + x.s.id, x.s.nom, x.s.resume,
          h('span', { class: 'cachet', 'aria-hidden': 'true' }, x.s.embleme)))));
      }
      if (!total) zone.appendChild(h('p', { class: 'discret' }, 'Aucun soin ne correspond. Essayez un autre mot, ou cherchez dans tout le contenu avec la loupe.'));
    }
    champ.addEventListener('input', dessiner);
    dessiner();
    const noeud = h('div', null,
      h('div', { class: 'salut' }, h('h2', null, 'Soulager avec les doigts'),
        h('p', { class: 'discret' }, 'Choisissez un mal : vous trouverez les points, une séance guidée pas à pas, les conseils de vie et d’alimentation, et les signes qui doivent faire consulter.')),
      h('div', { class: 'recherche-champ' }, icone('recherche'), champ),
      h('div', { class: 'alerte petit' }, icone('alerte'), h('p', null, 'La digipuncture accompagne, elle ne remplace pas un avis médical. Pendant la grossesse, certains points sont à éviter : chaque fiche le signale.')),
      zone);
    return { titre: 'Soins', noeud };
  };

  Vues.soin = function (id) {
    const s = MTC.soin(id);
    if (!s) return null;
    Carnet.noterVisite('s:' + id);
    const cle = 's:' + id;
    const duree = s.points.reduce((t, e) => t + (e.duree || 60) * (C.estMedian(e.id) ? 1 : 2), 0);
    const pointsGrossesse = s.points.filter((e) => (MTC.point(e.id) || {}).grossesse).map((e) => e.id);

    const protocole = h('ol', { class: 'protocole' });
    for (const e of s.points) {
      const p = MTC.point(e.id);
      if (!p) continue;
      const m = Planche.meridienDe(e.id) || 'EX';
      protocole.appendChild(h('li', { class: 'm-' + m },
        h('span', { class: 'rang', 'aria-hidden': 'true' }),
        h('div', { class: 'item-corps' },
          h('a', { class: 'etape-titre', href: '#/point/' + e.id }, C.code(e.id), ' ', p.nom, ' ', h('span', { class: 'item-han' }, p.hanzi),
            p.grossesse ? h('span', { class: 'drapeau-grossesse', title: 'À éviter pendant la grossesse' }, icone('alerte')) : null),
          h('div', { class: 'etape-texte' }, e.note ? enLigne(e.note) : p.sens, ' · ', Outils.duree(e.duree || p.duree) + (C.estMedian(e.id) ? '' : ' par côté'))),
        h('button', { type: 'button', class: 'bouton-icone', 'aria-label': 'Voir ' + p.nom + ' sur le schéma', onclick: () => C.apercuPoint(e.id) }, icone('cercle'))));
    }

    // Une planche qui montre tous les points du protocole sur le corps
    const vuesCorps = [];
    for (const vue of ['face', 'dos']) {
      const pl = Corps.planche(vue);
      const ids = s.points.map((e) => e.id).filter((x) => pl.points[x]);
      if (!ids.length) continue;
      const meridiens = Array.from(new Set(ids.map((x) => Planche.meridienDe(x)).filter(Boolean)));
      vuesCorps.push({ id: 'corps-' + vue, nb: ids.length, options: { meridiens, attenues: meridiens, points: ids, etiquettes: true, surPoint: C.apercuPoint } });
    }
    vuesCorps.sort((a, b) => b.nb - a.nb);
    const cadre = vuesCorps.length ? C.cadrePlanche({ vues: vuesCorps, taille: 'moyenne' }) : null;

    const formes = (s.formes || []).length ? C.section('Selon la forme, en MTC', 'taiji',
      h('p', { class: 'discret petit' }, 'La médecine chinoise distingue plusieurs formes d’un même mal. Ouvrez celle qui vous ressemble : elle ajoute ses points.'),
      h('div', { class: 'formes' }, s.formes.map((f, i) => h('details', { class: 'forme' },
        h('summary', null, f.nom),
        h('p', null, enLigne(f.signes)),
        h('div', { class: 'puces' }, f.points.map((pid) => (MTC.point(pid) ? h('a', { class: 'puce m-' + (Planche.meridienDe(pid) || 'EX'), href: '#/point/' + pid }, h('span', { class: 'pastille' }), Notation.code(pid) + ' ' + MTC.point(pid).nom) : null))),
        f.conseil ? h('p', { class: 'petit' }, enLigne(f.conseil)) : null,
        h('a', { class: 'bouton-secondaire', href: '#/seance/' + id + '?forme=' + i }, icone('lecture'), 'Séance pour cette forme'))))) : null;

    const plus = (s.aliments && s.aliments.plus) || [];
    const moins = (s.aliments && s.aliments.moins) || [];
    const aliments = plus.length || moins.length ? C.section('À table', 'bol',
      h('div', { class: 'deux-colonnes' },
        plus.length ? h('div', null, h('p', { class: 'colonne-titre plus' }, icone('coche'), 'À favoriser'), h('div', { class: 'puces' }, plus.map(puceAliment))) : null,
        moins.length ? h('div', null, h('p', { class: 'colonne-titre moins' }, icone('fermer'), 'À modérer'), h('div', { class: 'puces' }, moins.map(puceAliment))) : null)) : null;

    const noeud = h('div', null,
      C.entete({ cachet: s.embleme, titre: s.nom, sousTitre: s.resume, surtitre: h('span', null, (MTC.categoriesSoins.find((c) => c.id === s.categorie) || {}).nom) }),
      h('div', { class: 'actions-fiche' }, C.boutonFavori(cle, s.nom), C.boutonNote(cle, s.nom)),
      h('a', { class: 'bouton-principal bouton-large', href: '#/seance/' + id }, icone('lecture'), 'Commencer la séance guidée', h('span', { class: 'discret' }, ' · ' + Math.round(duree / 60) + ' min')),
      pointsGrossesse.length ? h('div', { class: 'alerte petit' }, icone('alerte'), h('p', null, 'Pendant la grossesse, évitez ', pointsGrossesse.map((x, i) => [i ? ', ' : '', Notation.code(x)]), '.')) : null,
      C.section('Ce qu’en dit la médecine chinoise', 'livre', riche(s.mtc)),
      C.section('Les points', 'main', protocole, cadre ? cadre.element : null),
      formes,
      s.conseils && s.conseils.length ? C.section('Au quotidien', 'feuille', h('ul', { class: 'liste-texte' }, s.conseils.map((c) => h('li', null, enLigne(c))))) : null,
      aliments,
      h('section', { class: 'section' }, h('div', { class: 'alerte' }, icone('alerte'), h('div', null, h('p', null, h('strong', null, 'Quand consulter')), riche(s.consulter)))));
    return { titre: s.nom, noeud };
  };

})(window);
