'use strict';
/*
 * La recherche dans tout le contenu : points, méridiens, soins, chapitres,
 * aliments, recettes, constitutions. Insensible aux accents et aux
 * majuscules ; les correspondances dans le titre passent devant.
 */
(function (racine) {

  const { h, icone, normaliser, brut } = Outils;
  const C = racine.Communs;
  const Vues = racine.Vues = racine.Vues || {};

  let index = null;
  function construire() {
    const L = [];
    const ajouter = (type, cle, titre, sous, corps, rendu) => L.push({ type, cle, titre: normaliser(titre), corps: normaliser(titre + ' ' + sous + ' ' + corps), rendu });
    for (const p of MTC.points) {
      ajouter('Points', 'pt:' + p.id, [p.id, Notation.oms(p.id) || '', p.nom, p.hanzi].join(' '), p.sens, [p.loc, p.indications.map(brut).join(' '), (p.actions || []).join(' ')].join(' '), () => C.itemPoint(p.id));
    }
    for (const m of MTC.meridiens) ajouter('Méridiens', 'm:' + m.id, m.nom + ' ' + m.id + ' ' + (Notation.OMS[m.id] || ''), m.canal, [m.resume, m.fonctions.join(' '), m.signes.join(' ')].join(' '), () => racine.Communs.lienCarnet('m:' + m.id));
    for (const s of MTC.soins) ajouter('Soins', 's:' + s.id, s.nom, s.resume, [brut(s.mtc), (s.formes || []).map((f) => f.nom + ' ' + f.signes).join(' ')].join(' '), () => racine.Communs.lienCarnet('s:' + s.id));
    for (const c of MTC.chapitres) ajouter('Principes', 'p:' + c.id, c.titre, c.sousTitre, c.blocs.map((b) => brut(b.texte || '')).join(' '), () => racine.Communs.lienCarnet('p:' + c.id));
    for (const a of MTC.aliments) ajouter('Aliments', 'a:' + a.id, a.nom, a.actions, [a.bon, a.attention, a.saveurs.join(' ')].join(' '), () => racine.Communs.lienCarnet('a:' + a.id));
    for (const r of MTC.recettes) ajouter('Recettes', 'r:' + r.id, r.nom, r.pour, r.ingredients.join(' '), () => racine.Communs.lienCarnet('r:' + r.id));
    for (const c of MTC.constitutions) ajouter('Constitutions', 'c:' + c.id, c.nom, c.resume, c.signes.join(' '), () => C.itemLien('#/constitution/' + c.id, c.nom, c.resume, h('span', { class: 'cachet' }, c.hanzi)));
    for (const s of MTC.saisons) ajouter('Saisons', 'sa:' + s.id, s.nom, s.resume, brut(s.texte), () => C.itemLien('#/saison/' + s.id, s.nom, s.resume, h('span', { class: 'cachet couleur el-' + s.element }, s.hanzi)));
    return L;
  }

  const SUGGESTIONS = ['mal de tête', 'sommeil', 'nausées', 'stress', 'dos', 'Hegu', 'Zusanli', 'gingembre', 'Foie', 'toux', 'règles', 'yeux'];

  Vues.recherche = function (q) {
    if (!index) index = construire();
    const champ = h('input', { type: 'search', placeholder: 'Un mal, un point, un aliment…', 'aria-label': 'Rechercher', enterkeyhint: 'search', autocomplete: 'off' });
    const resultats = h('div', { 'aria-live': 'polite' });
    function chercher() {
      const requete = normaliser(champ.value);
      resultats.textContent = '';
      if (requete.length < 2) {
        resultats.appendChild(h('p', { class: 'discret' }, 'Quelques idées :'));
        resultats.appendChild(h('div', { class: 'puces' }, SUGGESTIONS.map((s) => h('button', { type: 'button', class: 'puce', onclick: () => { champ.value = s; chercher(); } }, s))));
        return;
      }
      const mots = requete.split(' ').filter(Boolean);
      const trouves = [];
      for (const x of index) {
        if (!mots.every((m) => x.corps.includes(m))) continue;
        let score = 0;
        if (x.titre === requete) score += 100;
        if (x.titre.startsWith(requete)) score += 40;
        if (mots.every((m) => x.titre.includes(m))) score += 25;
        if (x.titre.split(' ').some((w) => w === requete)) score += 30;
        trouves.push([score, x]);
      }
      trouves.sort((a, b) => b[0] - a[0]);
      if (!trouves.length) {
        resultats.appendChild(h('p', { class: 'discret' }, 'Rien trouvé pour « ' + champ.value + ' ». Essayez un mot plus simple.'));
        return;
      }
      const groupes = new Map();
      for (const [, x] of trouves) {
        if (!groupes.has(x.type)) groupes.set(x.type, []);
        groupes.get(x.type).push(x);
      }
      // les groupes dans l'ordre de leur meilleur résultat
      for (const [type, liste] of groupes) {
        resultats.appendChild(h('p', { class: 'resultats-groupe' }, type + ' · ' + liste.length));
        resultats.appendChild(h('ul', { class: 'liste' }, liste.slice(0, 12).map((x) => x.rendu()).filter(Boolean)));
      }
    }
    champ.addEventListener('input', chercher);
    if (q && q.get('q')) champ.value = q.get('q');
    chercher();
    const noeud = h('div', null, h('div', { class: 'recherche-champ' }, icone('recherche'), champ), resultats);
    return { titre: 'Rechercher', noeud, apres: () => champ.focus() };
  };

})(window);
