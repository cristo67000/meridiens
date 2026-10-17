'use strict';
/*
 * L'accueil : l'heure du méridien, les maux les plus fréquents à portée de
 * doigt, la saison, le point du jour, et ce qu'on a consulté récemment.
 */
(function (racine) {

  const { h, icone, enLigne } = Outils;
  const C = racine.Communs;
  const Vues = racine.Vues = racine.Vues || {};

  const RACCOURCIS = ['cephalee', 'stress', 'insomnie', 'nausees', 'lombalgie', 'digestion', 'rhume', 'regles', 'fatigue', 'torticolis', 'yeux', 'constipation'];
  const POINTS_DU_JOUR = ['E36', 'GI4', 'MC6', 'F3', 'RP6', 'R1', 'VB20', 'Yintang', 'VC6', 'R3', 'C7', 'P7', 'VB21', 'VC17', 'TR5', 'V23', 'VG20', 'IG3', 'RP9', 'GI11', 'Anmian', 'VB34', 'VC12', 'E25', 'TR6', 'V40', 'Taiyang', 'GI20', 'RP10', 'V60'];

  function salutation(d) {
    const heure = d.getHours();
    if (heure < 5) return 'Bonne nuit';
    if (heure < 12) return 'Bonjour';
    if (heure < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }

  Vues.accueil = function () {
    const maintenant = new Date();
    const jour = maintenant.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    const date = jour.charAt(0).toUpperCase() + jour.slice(1);

    // L'heure du méridien
    const horloge = Schemas.horloge({ mini: true });
    const actif = horloge.maj();
    const carteHorloge = actif ? h('a', { class: 'carte carte-horloge m-' + actif.id, href: '#/horloge' },
      horloge.element,
      h('div', null,
        h('div', { class: 'heure' }, 'Heure du méridien · ' + actif.heures[0] + ' h – ' + actif.heures[1] + ' h'),
        h('div', { class: 'nom' }, actif.nom),
        h('p', null, actif.resume.split('. ')[0] + '.'))) : null;

    // Soulager…
    const grille = h('div', { class: 'soulager' }, RACCOURCIS.map((id) => {
      const s = MTC.soin(id);
      return s ? h('a', { href: '#/soin/' + id }, h('span', { class: 'embleme', 'aria-hidden': 'true' }, s.embleme), s.nom) : null;
    }));

    // La saison
    const saison = MTC.saisonDuJour(maintenant);
    const carteSaison = saison ? h('a', { class: 'carte carte-saison el-' + saison.element, href: '#/saison/' + saison.id },
      h('span', { class: 'fond-han', 'aria-hidden': 'true' }, saison.hanzi),
      h('div', { class: 'surtitre discret petit' }, 'Saison du ' + MTC.elements[saison.element].nom),
      h('p', { class: 'carte-titre' }, saison.nom),
      h('p', null, saison.resume),
      h('div', { class: 'puces' }, saison.favoriser.slice(0, 5).map((a) => { const al = MTC.aliment(a); return al ? h('span', { class: 'puce n-' + al.nature }, h('span', { class: 'pastille' }), al.nom) : null; }))) : null;

    // Le point du jour
    const idJour = POINTS_DU_JOUR[Outils.jourDeLAnnee(maintenant) % POINTS_DU_JOUR.length];
    const p = MTC.point(idJour);
    const cartePoint = p ? h('div', { class: 'carte carte-point' },
      h('a', { class: 'vignette', href: '#/point/' + idJour, 'aria-label': 'Voir ' + p.nom }, C.vignettePoint(idJour, { largeurAffichee: 120 })),
      h('div', { class: 'item-corps' },
        h('div', { class: 'surtitre discret petit' }, 'Le point du jour'),
        h('p', { class: 'carte-titre' }, C.code(idJour), ' ', p.nom),
        h('p', { class: 'discret petit' }, '« ' + p.sens + ' »'),
        h('p', { class: 'petit' }, p.indications.slice(0, 3).map(Outils.brut).join(' · ')),
        h('div', { class: 'rangee-boutons' }, h('a', { class: 'bouton-secondaire', href: '#/seance/pt-' + idJour }, icone('chrono'), 'Masser')))) : null;

    // Profil
    const profil = Carnet.profil();
    const carteProfil = profil && MTC.constitution(profil.resultat)
      ? h('a', { class: 'carte item', href: '#/constitution/' + profil.resultat }, h('span', { class: 'cachet' }, MTC.constitution(profil.resultat).hanzi),
        h('div', { class: 'item-corps' }, h('div', { class: 'surtitre discret petit' }, 'Ma constitution'), h('div', { class: 'item-titre' }, MTC.constitution(profil.resultat).nom), h('div', { class: 'item-sous' }, 'Mes aliments et mes points d’entretien')), icone('suite'))
      : h('a', { class: 'carte item', href: '#/constitution' }, h('span', { class: 'cachet' }, '体质'),
        h('div', { class: 'item-corps' }, h('div', { class: 'item-titre' }, 'Découvrir ma constitution'), h('div', { class: 'item-sous' }, '27 questions pour une alimentation et des points sur mesure')), icone('suite'));

    // Récents
    const recents = Carnet.recents().slice(0, 4).map(lienCarnet).filter(Boolean);

    const noeud = h('div', null,
      h('div', { class: 'salut' }, h('div', { class: 'date' }, date), h('h2', null, salutation(maintenant))),
      carteHorloge,
      h('h2', { class: 'titre-section' }, 'Soulager…', h('a', { class: 'lien-tout', href: '#/soins' }, 'Tous les soins')),
      grille,
      carteSaison,
      cartePoint,
      carteProfil,
      recents.length ? h('div', null, h('h2', { class: 'titre-section' }, 'Récemment'), h('ul', { class: 'liste' }, recents)) : null,
      h('h2', { class: 'titre-section' }, 'Découvrir'),
      h('div', { class: 'tuiles' },
        h('a', { class: 'tuile', href: '#/principes' }, icone('taiji'), h('span', { class: 'tuile-titre' }, 'Les principes'), h('span', { class: 'tuile-sous' }, 'Yin-Yang, Qi, cinq éléments, organes'), h('span', { class: 'tuile-han', 'aria-hidden': 'true' }, '道')),
        h('a', { class: 'tuile', href: '#/meridiens' }, icone('corps'), h('span', { class: 'tuile-titre' }, 'Les méridiens'), h('span', { class: 'tuile-sous' }, '14 trajets animés, ' + MTC.points.length + ' points'), h('span', { class: 'tuile-han', 'aria-hidden': 'true' }, '经')),
        h('a', { class: 'tuile', href: '#/soins' }, icone('main'), h('span', { class: 'tuile-titre' }, 'Les soins'), h('span', { class: 'tuile-sous' }, MTC.soins.length + ' maux courants, séances guidées'), h('span', { class: 'tuile-han', 'aria-hidden': 'true' }, '按')),
        h('a', { class: 'tuile', href: '#/dietetique' }, icone('bol'), h('span', { class: 'tuile-titre' }, 'La diététique'), h('span', { class: 'tuile-sous' }, 'Natures, saveurs, saisons, recettes'), h('span', { class: 'tuile-han', 'aria-hidden': 'true' }, '食'))),
      h('p', { class: 'discret petit centre' }, enLigne('Méridiens informe, il ne soigne pas : consultez un médecin pour tout symptôme qui dure ou inquiète. ' ), h('a', { class: 'renvoi', href: '#/apropos' }, 'À propos')));
    return { titre: 'Méridiens', noeud, quitter: () => horloge.arreter() };
  };

  /* Un élément du carnet (favori, récent) en ligne de liste. */
  function lienCarnet(cle) {
    const [type, id] = cle.split(':');
    if (type === 'pt') return MTC.point(id) ? C.itemPoint(id) : null;
    if (type === 'm') { const m = MTC.meridien(id); return m ? C.itemLien('#/meridien/' + id, C.titreMeridien(m), m.resume.split('. ')[0], h('span', { class: 'code plein m-' + id }, Notation.meridien(id))) : null; }
    if (type === 's') { const s = MTC.soin(id); return s ? C.itemLien('#/soin/' + id, s.nom, s.resume, h('span', { class: 'cachet' }, s.embleme)) : null; }
    if (type === 'p') { const c = MTC.chapitre(id); return c ? C.itemLien('#/principes/' + id, c.titre, c.sousTitre, h('span', { class: 'cachet' + (c.hanzi.length > 2 ? ' long' : '') }, c.hanzi)) : null; }
    if (type === 'a') { const a = MTC.aliment(id); return a ? C.itemLien('#/aliment/' + id, a.nom, a.actions, h('span', { class: 'pastille-nature n-' + a.nature })) : null; }
    if (type === 'r') { const r = MTC.recette(id); return r ? C.itemLien('#/recette/' + id, r.nom, r.pour, h('span', { class: 'cachet' }, r.hanzi.slice(0, 2))) : null; }
    return null;
  }
  racine.Communs.lienCarnet = lienCarnet;

})(window);
