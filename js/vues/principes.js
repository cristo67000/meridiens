'use strict';
/*
 * Les principes : la liste des chapitres, et chaque chapitre rendu bloc par
 * bloc, avec ses schémas interactifs.
 */
(function (racine) {

  const { h, icone, riche } = Outils;
  const C = racine.Communs;
  const Vues = racine.Vues = racine.Vues || {};

  Vues.principes = function () {
    const liste = h('ul', { class: 'liste' });
    MTC.chapitres.forEach((ch, i) => {
      liste.appendChild(C.itemLien('#/principes/' + ch.id, [h('span', { class: 'discret petit' }, String(i + 1).padStart(2, '0')), ' ', ch.titre], ch.sousTitre,
        h('span', { class: 'cachet' + (ch.hanzi.length > 2 ? ' long' : ''), 'aria-hidden': 'true' }, ch.hanzi)));
    });
    const noeud = h('div', null,
      h('div', { class: 'salut' }, h('h2', null, 'Les grands principes'),
        h('p', { class: 'discret' }, 'Treize chapitres pour comprendre la façon dont la médecine chinoise regarde le corps — avec des schémas à manipuler.')),
      Schemas.figure(h('div', { class: 'deux-colonnes centre' }, Schemas.taiji(), h('div', null,
        h('p', null, riche('Tout part d’une idée : la vie est **mouvement et équilibre**. Le Yin et le Yang, le Qi qui circule, les cinq éléments qui s’engendrent et se contrôlent sont les outils pour décrire ce mouvement.')),
        h('a', { class: 'bouton-secondaire', href: '#/principes/yin-yang' }, 'Commencer', icone('suite'))))),
      liste,
      h('div', { class: 'tuiles' },
        h('a', { class: 'tuile', href: '#/horloge' }, icone('horloge'), h('span', { class: 'tuile-titre' }, 'L’horloge des méridiens'), h('span', { class: 'tuile-sous' }, 'Le Qi au fil des heures')),
        h('a', { class: 'tuile', href: '#/meridiens' }, icone('corps'), h('span', { class: 'tuile-titre' }, 'Les 14 méridiens'), h('span', { class: 'tuile-sous' }, 'Trajets animés et points'))));
    return { titre: 'Principes', noeud };
  };

  const SCHEMAS = {
    taiji: () => Schemas.taiji(),
    etatsYinYang: () => Schemas.etatsYinYang(),
    wuxing: () => Schemas.wuxing(),
    horloge: () => h('div', null, Schemas.horloge({}).element, h('p', { class: 'centre' }, h('a', { class: 'bouton-secondaire', href: '#/horloge' }, icone('horloge'), 'Ouvrir l’horloge'))),
    langue: () => Schemas.langue(),
    pouls: () => Schemas.pouls(),
    mesuresCun: () => Schemas.mesuresCun(),
  };

  function tableau(t) {
    const table = h('table', { class: 'tableau' });
    if (t.tetes) table.appendChild(h('thead', null, h('tr', null, t.tetes.map((x) => h('th', { scope: 'col' }, x)))));
    const corps = h('tbody');
    for (const ligne of t.lignes) corps.appendChild(h('tr', null, ligne.map((x) => h('td', null, Outils.enLigne(x)))));
    table.appendChild(corps);
    return h('div', { class: 'cadre-tableau' }, table);
  }

  function organes() {
    const grille = h('div', { class: 'grille-meridiens' });
    const zang = ['C', 'P', 'RP', 'F', 'R', 'MC'];
    const fu = ['IG', 'GI', 'E', 'VB', 'V', 'TR'];
    const bloc = (ids, titre) => h('div', null, h('h3', { class: 'intertitre' }, titre), h('div', { class: 'grille-meridiens' }, ids.map((id) => {
      const m = MTC.meridien(id);
      return h('a', { class: 'carte-meridien m-' + id, href: '#/meridien/' + id },
        h('div', { class: 'ligne1' }, h('span', { class: 'nom' }, m.nom)),
        h('div', { class: 'meta' }, MTC.elements[m.element].nom + ' · couplé : ' + MTC.meridien(m.couple).nom),
        h('div', { class: 'meta' }, m.fonctions[0].replace(/\[\[[^\]]*\]\]/g, '').split(/[:;.]/)[0]));
    })));
    void grille;
    return h('div', null, bloc(zang, 'Les organes (Zang)'), bloc(fu, 'Les entrailles (Fu)'));
  }

  Vues.chapitre = function (id) {
    const ch = MTC.chapitre(id);
    if (!ch) return null;
    Carnet.noterVisite('p:' + id);
    const i = MTC.chapitres.indexOf(ch);
    const suivant = MTC.chapitres[i + 1];
    const precedent = MTC.chapitres[i - 1];
    const corps = h('div', { class: 'chapitre' });
    for (const b of ch.blocs) {
      if (b.texte) corps.appendChild(riche(b.texte));
      else if (b.schema && SCHEMAS[b.schema]) corps.appendChild(Schemas.figure(SCHEMAS[b.schema](), b.legende));
      else if (b.tableau) { corps.appendChild(tableau(b.tableau)); if (b.legende) corps.appendChild(h('p', { class: 'discret petit centre' }, b.legende)); }
      else if (b.encadre) corps.appendChild(h('div', { class: b.encadre === 'alerte' ? 'alerte' : 'info' }, icone(b.encadre === 'alerte' ? 'alerte' : 'info'), h('div', null, riche(b.texte))));
      else if (b.organes) corps.appendChild(organes());
    }
    const noeud = h('article', null,
      C.entete({ cachet: ch.hanzi, titre: ch.titre, sousTitre: ch.sousTitre, surtitre: h('span', null, 'Chapitre ' + (i + 1) + ' sur ' + MTC.chapitres.length) }),
      h('div', { class: 'actions-fiche' }, C.boutonFavori('p:' + id, ch.titre), C.boutonNote('p:' + id, ch.titre)),
      corps,
      h('div', { class: 'rangee-boutons' },
        precedent ? h('a', { class: 'bouton-secondaire', href: '#/principes/' + precedent.id }, icone('retour'), precedent.titre) : null,
        suivant ? h('a', { class: 'bouton-principal', href: '#/principes/' + suivant.id }, suivant.titre, icone('suite')) : h('a', { class: 'bouton-principal', href: '#/meridiens' }, 'Découvrir les méridiens', icone('suite'))));
    return { titre: ch.titre, noeud };
  };

})(window);
