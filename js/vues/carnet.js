'use strict';
/*
 * Mon carnet : favoris, notes, séances réalisées, constitution. Tout reste
 * sur l'appareil ; une sauvegarde peut être exportée depuis les réglages.
 */
(function (racine) {

  const { h, icone } = Outils;
  const C = racine.Communs;
  const Vues = racine.Vues = racine.Vues || {};

  const TYPES = [['s', 'Soins'], ['pt', 'Points'], ['m', 'Méridiens'], ['p', 'Principes'], ['a', 'Aliments'], ['r', 'Recettes']];

  Vues.carnet = function () {
    const favoris = Carnet.favoris();
    const notes = Carnet.notes();
    const historique = Carnet.historique();
    const profil = Carnet.profil();

    const blocFavoris = h('div');
    if (!favoris.length) blocFavoris.appendChild(h('p', { class: 'discret' }, 'Touchez l’étoile « Favori » sur un point, un soin, un aliment… pour le retrouver ici.'));
    for (const [t, nom] of TYPES) {
      const items = favoris.filter((f) => f.startsWith(t + ':')).map((f) => C.lienCarnet(f)).filter(Boolean);
      if (!items.length) continue;
      blocFavoris.appendChild(h('p', { class: 'resultats-groupe' }, nom));
      blocFavoris.appendChild(h('ul', { class: 'liste' }, items));
    }

    const cles = Object.keys(notes).sort((a, b) => (notes[a].date < notes[b].date ? 1 : -1));
    const blocNotes = cles.length ? h('ul', { class: 'liste' }, cles.map((cle) => {
      const lien = C.lienCarnet(cle);
      if (!lien) return null;
      const extrait = notes[cle].texte.length > 140 ? notes[cle].texte.slice(0, 140) + '…' : notes[cle].texte;
      const a = lien.querySelector('a');
      const sous = a.querySelector('.item-sous');
      if (sous) sous.textContent = '« ' + extrait + ' »';
      return lien;
    })) : h('p', { class: 'discret' }, 'Vos notes personnelles (ressentis, conseils reçus…) apparaîtront ici.');

    let blocSeances;
    if (historique.length) {
      const total = historique.reduce((t, x) => t + x.duree, 0);
      const jours = new Set(historique.map((x) => x.date.slice(0, 10)));
      // série de jours consécutifs jusqu'à aujourd'hui ou hier
      let serie = 0;
      const d = new Date();
      for (let k = 0; k < 365; k += 1) {
        const j = new Date(d.getTime() - k * 86400000).toISOString().slice(0, 10);
        if (jours.has(j)) serie += 1; else if (k > 0) break;
      }
      blocSeances = h('div', null,
        h('div', { class: 'tuiles' },
          h('div', { class: 'tuile' }, h('span', { class: 'tuile-titre' }, String(historique.length)), h('span', { class: 'tuile-sous' }, 'séances')),
          h('div', { class: 'tuile' }, h('span', { class: 'tuile-titre' }, Outils.duree(total)), h('span', { class: 'tuile-sous' }, 'de massage')),
          h('div', { class: 'tuile' }, h('span', { class: 'tuile-titre' }, serie + ' j'), h('span', { class: 'tuile-sous' }, 'jours d’affilée'))),
        h('ul', { class: 'liste' }, historique.slice(0, 15).map((x) => {
          const s = MTC.soin(x.soin);
          const date = new Date(x.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }) + ' · ' + new Date(x.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
          return s ? C.itemLien('#/soin/' + s.id, s.nom, date + ' · ' + Outils.duree(x.duree), h('span', { class: 'cachet' }, s.embleme)) : null;
        })));
    } else {
      blocSeances = h('p', { class: 'discret' }, 'Les séances guidées que vous terminez sont notées ici.');
    }

    const noeud = h('div', null,
      h('div', { class: 'salut' }, h('h2', null, 'Mon carnet'), h('p', { class: 'discret' }, 'Vos favoris, vos notes, vos séances. Tout reste sur ce téléphone.')),
      C.section('Ma constitution', 'profil', profil && MTC.constitution(profil.resultat)
        ? h('ul', { class: 'liste' }, C.itemLien('#/constitution/' + profil.resultat, MTC.constitution(profil.resultat).nom, 'Questionnaire du ' + new Date(profil.date).toLocaleDateString('fr-FR'), h('span', { class: 'cachet' }, MTC.constitution(profil.resultat).hanzi)))
        : h('a', { class: 'bouton-secondaire', href: '#/constitution' }, 'Faire le questionnaire')),
      C.section('Favoris', 'etoile', blocFavoris),
      C.section('Mes notes', 'note', blocNotes),
      C.section('Mes séances', 'chrono', blocSeances),
      h('p', { class: 'discret petit' }, 'Pour garder ces données en changeant de téléphone : ', h('a', { class: 'renvoi', href: '#/reglages' }, 'Réglages › Sauvegarde'), '.'));
    return { titre: 'Mon carnet', noeud };
  };

})(window);
