'use strict';
/*
 * La fiche d'un point : où il est (schéma de détail avec ses repères de
 * mesure, puis sa place sur le corps entier), comment le trouver, comment
 * le masser, à quoi il sert, et ses précautions.
 */
(function (racine) {

  const { h, icone, riche, enLigne } = Outils;
  const C = racine.Communs;
  const Vues = racine.Vues = racine.Vues || {};

  function vuesDuPoint(id) {
    const m = Planche.meridienDe(id);
    const vues = [];
    for (const r of Regions.vuesDuPoint(id)) {
      const pl = Regions.planche(r);
      const voisins = C.pointsSur(pl, (p) => p !== id);
      vues.push({
        id: r,
        options: {
          meridiens: m ? [m] : [], animer: true, points: [id], discrets: voisins, actif: id, guides: true,
          etiquettes: [id], surPoint: (autre) => { if (autre !== id) location.hash = '#/point/' + autre; },
        },
        cadre: Planche.cadrerPoint(pl, id),
      });
    }
    for (const vue of ['face', 'dos']) {
      const pl = Corps.planche(vue);
      if (!pl.points[id]) continue;
      vues.push({
        id: 'corps-' + vue,
        options: { meridiens: m ? [m] : [], animer: true, points: [id], actif: id, etiquettes: [id] },
        cadre: Planche.cadrer(pl, [id], 150, 0.75),
      });
    }
    return vues;
  }

  /* Un point de la ligne médiane n'existe qu'une fois. */
  function estMedian(id) { return /^(VC|VG)\d/.test(id) || id === 'Yintang' || id === 'Shiqizhui'; }

  Vues.point = function (id) {
    const p = MTC.point(id);
    if (!p) return null;
    Carnet.noterVisite('pt:' + id);
    const m = MTC.meridienDuPoint(id);
    const cle = 'pt:' + id;
    const vues = vuesDuPoint(id);
    const cadre = vues.length ? C.cadrePlanche({ vues, taille: 'haute' }) : null;
    const soins = MTC.soinsDuPoint(id);

    // voisins sur le méridien
    let navigation = null;
    if (m) {
      const i = m.points.indexOf(id);
      const prec = i > 0 ? m.points[i - 1] : null;
      const suiv = i >= 0 && i < m.points.length - 1 ? m.points[i + 1] : null;
      navigation = h('div', { class: 'rangee-boutons' },
        prec ? h('a', { class: 'bouton-secondaire', href: '#/point/' + prec }, icone('retour'), Notation.code(prec) + ' ' + MTC.point(prec).nom) : null,
        suiv ? h('a', { class: 'bouton-secondaire', href: '#/point/' + suiv }, Notation.code(suiv) + ' ' + MTC.point(suiv).nom, icone('suite')) : null);
    }

    const typeGeste = Schemas.typeDeGeste(p.technique);
    const technique = h('div', { class: 'technique' }, Schemas.geste(typeGeste),
      h('div', null, h('p', null, enLigne(p.technique)),
        h('p', { class: 'discret' }, 'Durée : environ ' + Outils.duree(p.duree) + (estMedian(id) ? '' : ' de chaque côté') + ', une à trois fois par jour au besoin.')));

    const noeud = h('div', { class: 'large-2' },
      h('div', { class: 'colle' },
        C.entete({
          cachet: p.hanzi, cachetClasse: 'couleur m-' + (m ? m.id : 'EX'),
          surtitre: [C.code(id, true), m ? h('a', { class: 'renvoi renvoi-meridien m-' + m.id, href: '#/meridien/' + m.id }, m.nom) : h('span', null, 'Point hors méridien' + (p.oms ? ' · ' + p.oms : ''))],
          titre: p.nom, sousTitre: '« ' + p.sens + ' »',
        }),
        h('div', { class: 'actions-fiche' },
          C.boutonFavori(cle, p.nom), C.boutonNote(cle, p.nom),
          h('a', { class: 'bouton-discret', href: '#/seance/pt-' + id }, icone('chrono'), 'Masser')),
        cadre ? cadre.element : null),
      h('div', null,
        p.grossesse ? h('div', { class: 'alerte' }, icone('alerte'), h('div', null, h('p', null, h('strong', null, 'À éviter pendant la grossesse.'), ' La tradition lui prête une action sur l’utérus : ne le massez pas si vous êtes enceinte.'))) : null,
        C.section('Où se trouve-t-il ?', 'cercle', h('p', null, enLigne(p.loc))),
        p.astuce ? C.section('Comment le trouver sur soi', 'regle', h('p', null, enLigne(p.astuce))) : null,
        C.section('Comment le masser', 'main', technique),
        C.section('Pour quoi faire', 'feuille', h('ul', { class: 'indications' }, p.indications.map((t) => h('li', null, enLigne(t))))),
        p.actions && p.actions.length ? C.section('Ses actions selon la MTC', 'taiji', h('ul', { class: 'liste-texte' }, p.actions.map((t) => h('li', null, t)))) : null,
        p.categories && p.categories.length ? C.section('Sa place dans la théorie', 'livre', h('ul', { class: 'liste-texte' }, p.categories.map((t) => h('li', null, t))), h('p', { class: 'petit discret' }, enLigne('Les catégories de points sont expliquées dans [[p:meridiens|le chapitre sur les méridiens]].'))) : null,
        p.note ? h('div', { class: 'info' }, icone('info'), h('p', null, enLigne(p.note))) : null,
        p.precautions ? h('div', { class: 'alerte' }, icone('alerte'), h('p', null, enLigne(p.precautions))) : null,
        soins.length ? C.section('Utilisé dans les soins', 'main', h('ul', { class: 'liste' }, soins.map((s) => C.itemLien('#/soin/' + s.id, s.nom, s.resume)))) : null,
        navigation,
        h('p', { class: 'discret petit' }, 'La digipuncture accompagne, elle ne remplace pas un avis médical. ', h('a', { class: 'renvoi', href: '#/principes/digipuncture' }, 'Précautions générales'), '.')));
    return { titre: (m ? Notation.code(id) + ' · ' : '') + p.nom, noeud };
  };

  racine.Communs.vuesDuPoint = vuesDuPoint;
  racine.Communs.estMedian = estMedian;

})(window);
