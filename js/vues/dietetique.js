'use strict';
/*
 * La diététique chinoise : principes (natures, saveurs, cuissons), saisons,
 * constitutions et questionnaire, catalogue des aliments, recettes.
 */
(function (racine) {

  const { h, icone, riche, enLigne, normaliser } = Outils;
  const C = racine.Communs;
  const Vues = racine.Vues = racine.Vues || {};

  const NOMS_NATURES = { chaud: 'Chaud', tiede: 'Tiède', neutre: 'Neutre', frais: 'Frais', froid: 'Froid' };
  const ORDRE_NATURES = ['froid', 'frais', 'neutre', 'tiede', 'chaud'];
  const nature = (n) => h('span', { class: 'nature n-' + n }, NOMS_NATURES[n]);

  function jauge(n) {
    return h('div', null,
      h('div', { class: 'jauge-nature n-' + n, 'aria-hidden': 'true' }, ORDRE_NATURES.map((x) => h('span', { class: x === n ? 'active' : '' }))),
      h('div', { class: 'jauge-legende', 'aria-hidden': 'true' }, h('span', null, 'froid'), h('span', null, 'neutre'), h('span', null, 'chaud')));
  }

  const nomOrgane = (m) => { const me = MTC.meridien(m); return me ? me.nom : m; };

  function itemAliment(a) {
    return C.itemLien('#/aliment/' + a.id, a.nom, [nature(a.nature), ' · ', a.saveurs.map((s) => s).join(', ') || '—'], h('span', { class: 'pastille-nature n-' + a.nature, 'aria-hidden': 'true' }));
  }

  // ── Accueil de la diététique ─────────────────────────────────────────────
  Vues.dietetique = function () {
    const saison = MTC.saisonDuJour();
    const profil = Carnet.profil();
    const choisie = h('div', { class: 'panneau-detail', 'aria-live': 'polite' });
    const thermo = h('div', { class: 'thermometre', role: 'group', 'aria-label': 'Les cinq natures' });
    function choisirNature(id) {
      const n = MTC.natures.find((x) => x.id === id);
      for (const b of thermo.children) b.setAttribute('aria-pressed', b.dataset.id === id ? 'true' : 'false');
      choisie.textContent = '';
      choisie.appendChild(h('h4', null, n.nom));
      choisie.appendChild(h('p', null, n.texte));
      const ex = MTC.aliments.filter((a) => a.nature === id && a.cat !== 'moderer').slice(0, 10);
      choisie.appendChild(h('div', { class: 'puces' }, ex.map((a) => C.puceAliment(a.id))));
      choisie.appendChild(h('a', { class: 'renvoi petit', href: '#/aliments?nature=' + id }, 'Tous les aliments ' + n.nom.toLowerCase() + 's'));
    }
    for (const id of ORDRE_NATURES) {
      thermo.appendChild(h('button', { type: 'button', class: 'n-' + id, 'data-id': id, onclick: () => choisirNature(id) }, icone('thermo'), NOMS_NATURES[id]));
    }
    choisirNature('neutre');

    const saveurs = h('div', { class: 'grille-meridiens' }, MTC.saveurs.filter((s) => s.element).map((s) => h('div', { class: 'carte-meridien el-' + s.element },
      h('div', { class: 'ligne1' }, h('span', { class: 'nom' }, s.nom)),
      h('div', { class: 'meta' }, MTC.elements[s.element].nom + ' · ' + nomOrgane(s.organe)),
      h('div', { class: 'meta' }, s.texte))));

    const cuissons = h('div', { class: 'cadre-tableau' }, h('table', { class: 'tableau' },
      h('tbody', null, MTC.cuissons.map(([mode, n, t]) => h('tr', null, h('td', null, h('strong', null, mode), h('br'), nature(n)), h('td', null, t))))));

    const noeud = h('div', null,
      h('div', { class: 'salut' }, h('h2', null, 'Se nourrir selon la MTC'),
        h('p', { class: 'discret' }, 'En Chine, l’aliment est le premier remède. Chacun a une nature (il réchauffe ou rafraîchit), une ou plusieurs saveurs, et se dirige vers certains organes.')),
      saison ? h('a', { class: 'carte carte-saison el-' + saison.element, href: '#/saison/' + saison.id, style: null },
        h('span', { class: 'fond-han', 'aria-hidden': 'true' }, saison.hanzi),
        h('div', { class: 'surtitre discret petit' }, 'En ce moment'),
        h('p', { class: 'carte-titre' }, saison.nom + ' — ' + MTC.elements[saison.element].nom + ', ' + nomOrgane(saison.organe)),
        h('p', null, saison.resume),
        h('span', { class: 'renvoi' }, 'Que manger en cette saison ?')) : null,
      h('div', { class: 'tuiles' },
        h('a', { class: 'tuile', href: '#/aliments' }, icone('feuille'), h('span', { class: 'tuile-titre' }, 'Les aliments'), h('span', { class: 'tuile-sous' }, MTC.aliments.length + ' aliments, nature et saveur')),
        h('a', { class: 'tuile', href: '#/recettes' }, icone('recette'), h('span', { class: 'tuile-titre' }, 'Recettes'), h('span', { class: 'tuile-sous' }, MTC.recettes.length + ' recettes simples')),
        h('a', { class: 'tuile', href: profil ? '#/constitution/' + profil.resultat : '#/constitution' }, icone('profil'), h('span', { class: 'tuile-titre' }, profil ? 'Ma constitution' : 'Ma constitution ?'), h('span', { class: 'tuile-sous' }, profil ? MTC.constitution(profil.resultat).nom : 'Questionnaire en 27 questions'))),
      C.section('Les cinq natures', 'thermo', h('p', { class: 'discret petit' }, 'Touchez une nature pour en voir les effets et des exemples.'), thermo, choisie),
      C.section('Les cinq saveurs', 'bol', h('p', null, riche('Chaque saveur a son action et va vers l’organe de son élément. Une alimentation équilibrée les réunit toutes, sans excès d’aucune. On y ajoute la saveur **fade** (insipide), qui draine l’humidité.')), saveurs),
      C.section('La cuisson change la nature', 'recette', h('p', null, 'Un même aliment rafraîchit davantage cru, réchauffe davantage rôti. On peut ainsi « réchauffer » un légume frais en le faisant mijoter avec du gingembre.'), cuissons),
      C.section('Les règles d’or', 'coche', h('ul', { class: 'liste-texte' }, MTC.reglesDOr.map((r) => h('li', null, enLigne(r))))),
      C.section('Les saisons', 'saison', h('ul', { class: 'liste' }, MTC.saisons.map((s) => C.itemLien('#/saison/' + s.id, s.nom, s.resume, h('span', { class: 'cachet couleur el-' + s.element, 'aria-hidden': 'true' }, s.hanzi))))));
    return { titre: 'Diététique', noeud };
  };

  // ── Les aliments ─────────────────────────────────────────────────────────
  Vues.aliments = function (q) {
    let filtreNature = (q && q.get('nature')) || '';
    let filtreCat = (q && q.get('cat')) || '';
    let filtreSaveur = (q && q.get('saveur')) || '';
    const champ = h('input', { type: 'search', placeholder: 'Chercher un aliment, un effet…', 'aria-label': 'Chercher un aliment', enterkeyhint: 'search' });
    const liste = h('ul', { class: 'liste' });
    const compte = h('p', { class: 'discret petit' });
    const pN = h('div', { class: 'defile-x', role: 'group', 'aria-label': 'Nature' });
    const pS = h('div', { class: 'defile-x', role: 'group', 'aria-label': 'Saveur' });
    const pC = h('div', { class: 'defile-x', role: 'group', 'aria-label': 'Catégorie' });
    const index = MTC.aliments.map((a) => ({ a, texte: normaliser([a.nom, a.actions, a.bon, a.attention, a.saveurs.join(' '), a.organes.map(nomOrgane).join(' ')].join(' ')) }));
    function filtrer() {
      const mots = normaliser(champ.value).split(' ').filter(Boolean);
      liste.textContent = '';
      let n = 0;
      for (const cat of MTC.categoriesAliments) {
        const items = index.filter((x) => x.a.cat === cat.id
          && (!filtreNature || x.a.nature === filtreNature)
          && (!filtreCat || x.a.cat === filtreCat)
          && (!filtreSaveur || x.a.saveurs.includes(filtreSaveur))
          && (!mots.length || mots.every((m) => x.texte.includes(m))));
        if (!items.length) continue;
        liste.appendChild(h('li', { class: 'liste-groupe' }, h('span', null, cat.nom)));
        for (const x of items) { liste.appendChild(itemAliment(x.a)); n += 1; }
      }
      compte.textContent = n + ' aliment' + (n > 1 ? 's' : '');
      if (!n) liste.appendChild(h('li', null, h('p', { class: 'item discret' }, 'Aucun aliment ne correspond.')));
      for (const b of pN.children) b.setAttribute('aria-pressed', b.dataset.id === filtreNature ? 'true' : 'false');
      for (const b of pS.children) b.setAttribute('aria-pressed', b.dataset.id === filtreSaveur ? 'true' : 'false');
      for (const b of pC.children) b.setAttribute('aria-pressed', b.dataset.id === filtreCat ? 'true' : 'false');
    }
    pN.appendChild(h('button', { type: 'button', class: 'puce', 'data-id': '', onclick: () => { filtreNature = ''; filtrer(); } }, 'Toutes natures'));
    for (const id of ORDRE_NATURES) pN.appendChild(h('button', { type: 'button', class: 'puce n-' + id, 'data-id': id, onclick: () => { filtreNature = filtreNature === id ? '' : id; filtrer(); } }, h('span', { class: 'pastille' }), NOMS_NATURES[id]));
    pS.appendChild(h('button', { type: 'button', class: 'puce', 'data-id': '', onclick: () => { filtreSaveur = ''; filtrer(); } }, 'Toutes saveurs'));
    for (const s of MTC.saveurs) pS.appendChild(h('button', { type: 'button', class: 'puce', 'data-id': s.id, onclick: () => { filtreSaveur = filtreSaveur === s.id ? '' : s.id; filtrer(); } }, s.nom));
    pC.appendChild(h('button', { type: 'button', class: 'puce', 'data-id': '', onclick: () => { filtreCat = ''; filtrer(); } }, 'Tout'));
    for (const c of MTC.categoriesAliments) pC.appendChild(h('button', { type: 'button', class: 'puce', 'data-id': c.id, onclick: () => { filtreCat = filtreCat === c.id ? '' : c.id; filtrer(); } }, c.nom));
    champ.addEventListener('input', filtrer);
    filtrer();
    return { titre: 'Les aliments', noeud: h('div', null, h('div', { class: 'recherche-champ' }, icone('recherche'), champ), pN, pS, pC, compte, liste) };
  };

  Vues.aliment = function (id) {
    const a = MTC.aliment(id);
    if (!a) return null;
    Carnet.noterVisite('a:' + id);
    const recettes = MTC.recettes.filter((r) => r.aliments.includes(id));
    const soins = { plus: MTC.soins.filter((s) => s.aliments && s.aliments.plus.includes(id)), moins: MTC.soins.filter((s) => s.aliments && s.aliments.moins.includes(id)) };
    const saisons = MTC.saisons.filter((s) => s.favoriser.includes(id));
    const consts = MTC.constitutions.filter((c) => c.plus.includes(id));
    const cat = MTC.categoriesAliments.find((c) => c.id === a.cat);
    const noeud = h('div', { class: 'n-' + a.nature },
      C.entete({ titre: a.nom, surtitre: [h('span', null, cat ? cat.nom : ''), nature(a.nature)], sousTitre: a.saveurs.length ? 'Saveur ' + a.saveurs.join(', ') : null }),
      h('div', { class: 'actions-fiche' }, C.boutonFavori('a:' + id, a.nom), C.boutonNote('a:' + id, a.nom)),
      h('div', { class: 'carte' }, jauge(a.nature),
        h('dl', { class: 'definition' },
          h('dt', null, 'Nature'), h('dd', null, NOMS_NATURES[a.nature]),
          h('dt', null, 'Saveur'), h('dd', null, a.saveurs.join(', ') || '—'),
          h('dt', null, 'Organes'), h('dd', null, a.organes.length ? a.organes.map((m, i) => [i ? ', ' : '', h('a', { class: 'renvoi', href: '#/meridien/' + m }, nomOrgane(m))]) : '—'))),
      C.section('Ses actions', 'feuille', h('p', null, enLigne(a.actions))),
      a.bon ? C.section('Quand il aide', 'coche', h('p', null, enLigne(a.bon))) : null,
      a.attention ? h('div', { class: 'alerte' }, icone('alerte'), h('p', null, enLigne(a.attention))) : null,
      saisons.length ? C.section('De saison', 'saison', h('div', { class: 'puces' }, saisons.map((s) => h('a', { class: 'puce el-' + s.element, href: '#/saison/' + s.id }, h('span', { class: 'pastille' }), s.nom)))) : null,
      consts.length ? C.section('Pour les constitutions', 'profil', h('div', { class: 'puces' }, consts.map((c) => h('a', { class: 'puce', href: '#/constitution/' + c.id }, c.nom)))) : null,
      soins.plus.length ? C.section('Conseillé dans les soins', 'main', h('div', { class: 'puces' }, soins.plus.map((s) => h('a', { class: 'puce', href: '#/soin/' + s.id }, s.nom)))) : null,
      soins.moins.length ? C.section('À modérer en cas de', 'alerte', h('div', { class: 'puces' }, soins.moins.map((s) => h('a', { class: 'puce', href: '#/soin/' + s.id }, s.nom)))) : null,
      recettes.length ? C.section('Dans les recettes', 'recette', h('ul', { class: 'liste' }, recettes.map((r) => C.itemLien('#/recette/' + r.id, r.nom, r.pour)))) : null);
    return { titre: a.nom, noeud };
  };

  // ── Saisons ──────────────────────────────────────────────────────────────
  Vues.saison = function (id) {
    const s = MTC.saison(id);
    if (!s) return null;
    const noeud = h('div', { class: 'el-' + s.element },
      C.entete({ cachet: s.hanzi, cachetClasse: 'couleur el-' + s.element, titre: s.nom, sousTitre: s.periode, surtitre: h('span', null, MTC.elements[s.element].nom + ' · ' + nomOrgane(s.organe) + ' · ' + s.climat) }),
      h('p', null, riche(s.texte)),
      C.section('À privilégier', 'coche', h('div', { class: 'puces' }, s.favoriser.map(C.puceAliment))),
      C.section('À modérer', 'alerte', h('div', { class: 'puces' }, s.moderer.map(C.puceAliment))),
      C.section('Hygiène de vie', 'feuille', h('ul', { class: 'liste-texte' }, s.gestes.map((g) => h('li', null, enLigne(g))))),
      C.section('Les points de la saison', 'main', h('ul', { class: 'liste' }, s.points.map((p) => C.itemPoint(p)))),
      s.recettes.length ? C.section('Recettes de saison', 'recette', h('ul', { class: 'liste' }, s.recettes.map((r) => MTC.recette(r)).filter(Boolean).map((r) => C.itemLien('#/recette/' + r.id, r.nom, r.pour)))) : null,
      h('div', { class: 'puces' }, MTC.saisons.filter((x) => x.id !== id).map((x) => h('a', { class: 'puce el-' + x.element, href: '#/saison/' + x.id }, h('span', { class: 'pastille' }), x.nom))));
    return { titre: s.nom, noeud };
  };

  // ── Constitution : questionnaire et résultat ─────────────────────────────
  function calculer(reponses) {
    const sommes = {};
    const nombres = {};
    MTC.questionnaire.forEach((q, i) => {
      const v = reponses[i];
      if (v == null) return;
      sommes[q.c] = (sommes[q.c] || 0) + v;
      nombres[q.c] = (nombres[q.c] || 0) + 1;
    });
    const scores = {};
    for (const c of Object.keys(sommes)) scores[c] = Math.round((sommes[c] / (4 * nombres[c])) * 100);
    const autres = Object.entries(scores).filter(([c]) => c !== 'equilibree').sort((a, b) => b[1] - a[1]);
    let resultat = 'equilibree';
    if (autres.length && autres[0][1] >= 40) resultat = autres[0][0];
    else if ((scores.equilibree || 0) < 60 && autres.length && autres[0][1] >= 30) resultat = autres[0][0];
    const tendances = autres.filter(([c, v]) => c !== resultat && v >= 40).map(([c]) => c);
    return { scores, resultat, tendances };
  }

  Vues.questionnaire = function () {
    const reponses = new Array(MTC.questionnaire.length).fill(null);
    const progression = h('p', { class: 'discret petit' });
    const bouton = h('button', { type: 'button', class: 'bouton-principal bouton-large', disabled: true, onclick: () => {
      const r = calculer(reponses);
      Carnet.ecrireProfil({ date: new Date().toISOString(), resultat: r.resultat, scores: r.scores, tendances: r.tendances });
      location.hash = '#/constitution/' + r.resultat + '?resultat=1';
    } }, 'Voir ma constitution');
    function maj() {
      const n = reponses.filter((x) => x != null).length;
      progression.textContent = n + ' / ' + reponses.length + ' réponses';
      bouton.disabled = n < reponses.length;
    }
    const questions = MTC.questionnaire.map((q, i) => {
      const echelle = h('div', { class: 'echelle-reponse', role: 'radiogroup', 'aria-label': q.texte });
      MTC.reponses.forEach((lib, v) => {
        echelle.appendChild(h('button', { type: 'button', role: 'radio', 'aria-checked': 'false', 'aria-pressed': 'false', onclick: (e) => {
          reponses[i] = v;
          for (const b of echelle.children) { b.setAttribute('aria-pressed', 'false'); b.setAttribute('aria-checked', 'false'); }
          e.currentTarget.setAttribute('aria-pressed', 'true');
          e.currentTarget.setAttribute('aria-checked', 'true');
          maj();
        } }, lib));
      });
      return h('div', { class: 'question' }, h('p', null, (i + 1) + '. ' + q.texte), echelle);
    });
    maj();
    const noeud = h('div', null,
      h('div', { class: 'salut' }, h('h2', null, 'Quelle est votre constitution ?'),
        h('p', { class: 'discret' }, 'La médecine chinoise décrit neuf grands « terrains ». Répondez en pensant à l’année écoulée, en général — pas à un épisode passager. Vos réponses restent sur votre téléphone.')),
      questions, progression, bouton,
      h('p', { class: 'discret petit' }, 'Inspiré de la classification des neuf constitutions de Wang Qi (Chine, 2009). Un résultat indicatif, pas un diagnostic.'));
    return { titre: 'Ma constitution', noeud };
  };

  Vues.constitution = function (id, q) {
    const c = MTC.constitution(id);
    if (!c) return null;
    const profil = Carnet.profil();
    const estResultat = profil && profil.resultat === id;
    let barres = null;
    if (estResultat && profil.scores) {
      const lignes = MTC.constitutions.map((x) => [x, profil.scores[x.id] || 0]).sort((a, b) => b[1] - a[1]);
      barres = h('div', { class: 'barres' }, lignes.map(([x, v]) => {
        const piste = h('span');
        piste.style.setProperty('width', v + '%');
        return h('a', { class: 'barre-score' + (x.id === id ? ' principale' : ''), href: '#/constitution/' + x.id }, h('span', null, x.nom), h('span', { class: 'piste' }, piste), h('span', null, v));
      }));
    }
    const noeud = h('div', null,
      C.entete({ cachet: c.hanzi, titre: c.nom, sousTitre: c.resume, surtitre: h('span', null, estResultat ? 'Votre constitution dominante' : 'Constitution') }),
      estResultat && q && q.get('resultat') ? h('div', { class: 'info' }, icone('info'), h('p', null, 'Voici votre profil. Les scores ci-dessous indiquent la part de chaque terrain dans vos réponses ; au-delà de 40, une tendance est nette.')) : null,
      barres ? h('div', { class: 'carte' }, barres) : null,
      estResultat && profil.tendances && profil.tendances.length ? h('p', null, 'Autres tendances : ', profil.tendances.map((t, i) => [i ? ', ' : '', h('a', { class: 'renvoi', href: '#/constitution/' + t }, MTC.constitution(t).nom)])) : null,
      h('p', null, riche(c.texte)),
      C.section('Les signes', 'question', h('ul', { class: 'liste-texte' }, c.signes.map((s) => h('li', null, s)))),
      C.section('À table', 'bol', h('div', { class: 'deux-colonnes' },
        h('div', null, h('p', { class: 'colonne-titre plus' }, icone('coche'), 'À favoriser'), h('div', { class: 'puces' }, c.plus.map(C.puceAliment))),
        c.moins.length ? h('div', null, h('p', { class: 'colonne-titre moins' }, icone('fermer'), 'À modérer'), h('div', { class: 'puces' }, c.moins.map(C.puceAliment))) : null)),
      C.section('Hygiène de vie', 'feuille', h('ul', { class: 'liste-texte' }, c.conseils.map((s) => h('li', null, enLigne(s))))),
      C.section('Points d’entretien', 'main', h('p', { class: 'discret petit' }, 'À masser une à deux minutes chaque jour, de chaque côté.'), h('ul', { class: 'liste' }, c.points.map((p) => C.itemPoint(p)))),
      h('div', { class: 'rangee-boutons' }, h('a', { class: 'bouton-secondaire', href: '#/constitution' }, estResultat ? 'Refaire le questionnaire' : 'Faire le questionnaire')),
      h('p', { class: 'discret petit' }, 'Un résultat indicatif : la plupart des personnes mêlent plusieurs tendances, qui évoluent avec l’âge et le mode de vie.'));
    return { titre: c.nom, noeud };
  };

  // ── Recettes ─────────────────────────────────────────────────────────────
  Vues.recettes = function () {
    const liste = h('ul', { class: 'liste' }, MTC.recettes.map((r) => C.itemLien('#/recette/' + r.id, [r.nom, ' ', h('span', { class: 'item-han' }, r.hanzi)], [nature(r.nature), ' · ', r.temps, ' — ', r.pour], h('span', { class: 'cachet', 'aria-hidden': 'true' }, r.hanzi.slice(0, 2)))));
    return { titre: 'Recettes', noeud: h('div', null, h('div', { class: 'salut' }, h('h2', null, 'Recettes simples'), h('p', { class: 'discret' }, 'Des préparations de la tradition chinoise, faisables avec des ingrédients qu’on trouve en France — certains en épicerie asiatique.')), liste) };
  };

  Vues.recette = function (id) {
    const r = MTC.recette(id);
    if (!r) return null;
    Carnet.noterVisite('r:' + id);
    const noeud = h('div', null,
      C.entete({ cachet: r.hanzi, titre: r.nom, sousTitre: r.pour, surtitre: [nature(r.nature), h('span', null, r.temps)] }),
      h('div', { class: 'actions-fiche' }, C.boutonFavori('r:' + id, r.nom), C.boutonNote('r:' + id, r.nom)),
      C.section('Ingrédients', 'bol', h('ul', { class: 'ingredients' }, r.ingredients.map((x) => h('li', null, x)))),
      C.section('Préparation', 'recette', h('ol', { class: 'liste-texte' }, r.etapes.map((x) => h('li', null, enLigne(x))))),
      r.conseils ? h('div', { class: 'info' }, icone('info'), h('p', null, enLigne(r.conseils))) : null,
      C.section('Les aliments', 'feuille', h('div', { class: 'puces' }, r.aliments.map(C.puceAliment))));
    return { titre: r.nom, noeud };
  };

})(window);
