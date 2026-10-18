'use strict';
/*
 * Réglages, à propos, et l'avertissement du premier lancement.
 */
(function (racine) {

  const { h, icone, riche } = Outils;
  const C = racine.Communs;
  const Vues = racine.Vues = racine.Vues || {};

  function segmente(cle, options, surChangement) {
    const g = h('div', { class: 'segmente', role: 'group' });
    for (const [valeur, nom] of options) {
      g.appendChild(h('button', { type: 'button', 'aria-pressed': String(Reglages.lire(cle) === valeur), onclick: () => {
        Reglages.ecrire(cle, valeur);
        for (const b of g.children) b.setAttribute('aria-pressed', String(b.dataset.v === String(valeur)));
        if (surChangement) surChangement(valeur);
      }, 'data-v': String(valeur) }, nom));
    }
    return g;
  }
  function interrupteur(cle, libelle, aide) {
    const id = 'r-' + cle;
    const caseACocher = h('input', { type: 'checkbox', class: 'interrupteur', id, role: 'switch' });
    caseACocher.checked = !!Reglages.lire(cle);
    caseACocher.addEventListener('change', () => Reglages.ecrire(cle, caseACocher.checked));
    return h('li', { class: 'reglage' }, h('label', { for: id }, libelle, aide ? h('span', { class: 'discret' }, aide) : null), caseACocher);
  }

  Vues.reglages = function () {
    const etatMaj = h('p', { class: 'discret petit' });
    const version = racine.MiseAJour && MiseAJour.version;
    const installer = h('div');
    const zoneInstaller = h('div');
    if (racine.Installer) { Installer.dessinerInstallation(installer, zoneInstaller); Installer.surChangement(() => Installer.dessinerInstallation(installer, zoneInstaller), installer); }
    installer.appendChild(zoneInstaller);

    const fichier = h('input', { type: 'file', accept: 'application/json,.json', hidden: true });
    const retourSauvegarde = h('p', { class: 'discret petit', 'aria-live': 'polite' });
    fichier.addEventListener('change', async () => {
      const f = fichier.files && fichier.files[0];
      if (!f) return;
      try {
        Carnet.importer(JSON.parse(await f.text()));
        retourSauvegarde.textContent = 'Sauvegarde importée : favoris, notes et séances fusionnés.';
      } catch (e) {
        retourSauvegarde.textContent = 'Import impossible : ' + (e && e.message ? e.message : 'fichier illisible') + '.';
      }
      fichier.value = '';
    });

    const noeud = h('div', null,
      h('div', { class: 'salut' }, h('h2', null, 'Réglages')),
      C.section('Affichage', 'saison', h('ul', { class: 'liste' },
        h('li', { class: 'reglage' }, h('span', { class: 'libelle' }, 'Thème'), segmente('theme', [['auto', 'Auto'], ['clair', 'Clair'], ['sombre', 'Sombre']])),
        h('li', { class: 'reglage' }, h('span', { class: 'libelle' }, 'Taille du texte'), segmente('taille', [[0.9, 'A−'], [1, 'A'], [1.12, 'A+'], [1.25, 'A++']])),
        h('li', { class: 'reglage' }, h('span', { class: 'libelle' }, 'Codes des points', h('span', { class: 'discret' }, 'Française (GI4) ou internationale OMS (LI4)')), segmente('notation', [['fr', 'GI4'], ['oms', 'LI4']])))),
      C.section('Séances guidées', 'chrono', h('ul', { class: 'liste' },
        h('li', { class: 'reglage' }, h('span', { class: 'libelle' }, 'Durée par défaut', h('span', { class: 'discret' }, 'Pour les points sans durée indiquée')), segmente('dureePoint', [[45, '45 s'], [60, '1 min'], [90, '1 min 30']])),
        interrupteur('son', 'Son de cloche', 'Au changement de côté et de point'),
        interrupteur('vibrations', 'Vibrations', 'Sur les téléphones qui le permettent'),
        interrupteur('respiration', 'Guide de respiration', '4 secondes d’inspiration, 6 d’expiration'))),
      C.section('Sauvegarde', 'telecharger', h('p', { class: 'discret petit' }, 'Vos favoris, notes, séances et votre constitution sont gardés sur ce téléphone. Exportez-les dans un fichier pour les retrouver ailleurs.'),
        h('div', { class: 'rangee-boutons' },
          h('button', { type: 'button', class: 'bouton-secondaire', onclick: () => {
            const blob = new Blob([JSON.stringify(Carnet.exporter(), null, 2)], { type: 'application/json' });
            const a = h('a', { href: URL.createObjectURL(blob), download: 'meridiens-sauvegarde-' + new Date().toISOString().slice(0, 10) + '.json' });
            document.body.appendChild(a); a.click(); a.remove();
            setTimeout(() => URL.revokeObjectURL(a.href), 4000);
          } }, icone('telecharger'), 'Exporter'),
          h('button', { type: 'button', class: 'bouton-secondaire', onclick: () => fichier.click() }, icone('ouvrir'), 'Importer')),
        fichier, retourSauvegarde,
        h('button', { type: 'button', class: 'bouton-discret', onclick: (e) => {
          if (e.currentTarget.dataset.confirme) { Carnet.viderHistorique(); e.currentTarget.textContent = 'Historique effacé'; e.currentTarget.disabled = true; return; }
          e.currentTarget.dataset.confirme = '1';
          e.currentTarget.textContent = 'Touchez encore pour confirmer';
        } }, 'Effacer l’historique des séances')),
      C.section('Application', 'info', installer,
        h('ul', { class: 'liste' },
          h('li', { class: 'reglage' }, h('span', { class: 'libelle' }, 'Version', h('span', { class: 'discret' }, version || 'v1.0.1')),
            h('button', { type: 'button', class: 'bouton-discret', onclick: async () => {
              if (!racine.MiseAJour) return;
              etatMaj.textContent = 'Recherche…';
              const r = await MiseAJour.verifier(true);
              etatMaj.textContent = { prete: 'Une mise à jour est prête : touchez « Mettre à jour » en bas de l’écran.', 'en-cours': 'Une mise à jour se télécharge…', 'a-jour': 'Vous avez la dernière version.', echec: 'Pas de réseau pour vérifier.', 'sans-service-worker': 'Vérification impossible ici.' }[r] || '';
            } }, 'Vérifier'))),
        etatMaj,
        racine.Installer ? (() => { const z = h('div'); Installer.dessinerPartage(z); return z; })() : null,
        h('ul', { class: 'liste' }, C.itemLien('#/apropos', 'À propos de Méridiens', 'Sources, confidentialité, avertissement'))));
    return { titre: 'Réglages', noeud };
  };

  Vues.apropos = function () {
    const noeud = h('div', null,
      C.entete({ cachet: '经络', titre: 'Méridiens', sousTitre: 'Médecine traditionnelle chinoise et digipuncture' }),
      h('p', null, riche('Méridiens réunit les grands principes de la médecine traditionnelle chinoise, les quatorze méridiens et **' + MTC.points.length + ' points** de digipuncture sur des schémas animés, **' + MTC.soins.length + ' soins** pour les maux courants avec séances guidées, et la diététique chinoise : **' + MTC.aliments.length + ' aliments**, les saisons, les neuf constitutions et ' + MTC.recettes.length + ' recettes.')),
      C.section('Avertissement', 'alerte', riche('Cette application **informe**, elle ne soigne pas et ne pose aucun diagnostic. La digipuncture peut accompagner une prise en charge médicale, jamais la remplacer. Consultez un médecin pour tout symptôme qui dure, s’aggrave ou vous inquiète ; chaque soin indique les signes qui doivent faire consulter. En urgence : **15** (SAMU) ou **112**.\n\nPendant la grossesse, plusieurs points sont à éviter : ils sont signalés. Demandez toujours conseil à votre sage-femme ou à votre médecin.')),
      C.section('Sources', 'livre', riche('- Localisations des points : *WHO Standard Acupuncture Point Locations in the Western Pacific Region* (Organisation mondiale de la santé, 2008), et nomenclature française usuelle.\n- Théorie : le *Huangdi Neijing* et les manuels d’enseignement de la MTC (Maciocia, *Les principes fondamentaux de la médecine chinoise* ; manuels de l’université de Shanghai).\n- Constitutions : classification des neuf constitutions de Wang Qi (norme de l’Association chinoise de MTC, 2009).\n- Diététique : tables de nature et de saveur des ouvrages chinois de diététique ; elles varient un peu d’un auteur à l’autre.\n\nLes textes et les dessins de l’application sont originaux.')),
      C.section('Confidentialité', 'profil', riche('Méridiens fonctionne **sans compte, sans publicité et sans connexion** une fois installée. Vos favoris, notes, séances et votre constitution restent **sur votre appareil** et ne sont envoyés nulle part. Aucune mesure d’audience.')),
      C.section('Contact', 'note', h('p', null, 'Une erreur, une suggestion ? ', h('a', { class: 'renvoi', href: 'mailto:cristo67apps@gmail.com?subject=M%C3%A9ridiens' }, 'cristo67apps@gmail.com'))));
    return { titre: 'À propos', noeud };
  };

  /* L'avertissement, une fois, au premier lancement. */
  Vues.avertissement = function () {
    const modale = h('div', { class: 'modale', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'titre-avertissement' },
      h('div', { class: 'modale-boite' },
        h('span', { class: 'cachet' }, '经络'),
        h('h2', { id: 'titre-avertissement' }, 'Bienvenue dans Méridiens'),
        h('p', null, 'Découvrez la médecine chinoise, ses méridiens et ses points, et apprenez à vous masser pour soulager les petits maux du quotidien.'),
        h('div', { class: 'alerte' }, icone('alerte'), h('div', null,
          h('p', null, h('strong', null, 'Une information, pas un traitement.'), ' La digipuncture accompagne, elle ne remplace pas un avis médical. Consultez pour tout symptôme qui dure ou inquiète.'),
          h('p', null, h('strong', null, 'Enceinte ?'), ' Certains points sont à éviter : ils sont signalés.'),
          h('p', null, 'En urgence : ', h('strong', null, '15'), ' ou ', h('strong', null, '112'), '.'))),
        h('button', { type: 'button', class: 'bouton-principal bouton-large', onclick: () => { Reglages.ecrire('avertissementVu', true); modale.remove(); } }, 'J’ai compris')));
    document.body.appendChild(modale);
    setTimeout(() => { const b = modale.querySelector('button'); if (b) b.focus(); }, 50);
  };

})(window);
