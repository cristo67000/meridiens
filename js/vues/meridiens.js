'use strict';
/*
 * Les méridiens : vue d'ensemble (les quatorze sur le corps, animés), fiche
 * de chaque méridien, index de tous les points, horloge.
 */
(function (racine) {

  const { h, icone, riche, normaliser } = Outils;
  const C = racine.Communs;
  const Vues = racine.Vues = racine.Vues || {};

  const ELEMENT_NOM = (e) => (e ? MTC.elements[e].nom : '—');

  // ── Liste ────────────────────────────────────────────────────────────────
  Vues.meridiens = function () {
    const tous = MTC.meridiens.map((m) => m.id);
    let choisis = new Set(tous);
    const legende = h('div', { class: 'legende-meridiens', role: 'group', 'aria-label': 'Méridiens affichés' });
    let cadre = null;
    function options() {
      const liste = Array.from(choisis);
      return { meridiens: tous, attenues: tous.filter((m) => !choisis.has(m)), animer: true };
    }
    function redessiner() {
      const i = cadre ? cadre.indice : 0;
      const nouveau = C.cadrePlanche({ vues: vues(), taille: 'haute', initial: i });
      cadre.element.replaceWith(nouveau.element);
      cadre = nouveau;
    }
    function vues() {
      return [
        { id: 'corps-face', options: options() },
        { id: 'corps-dos', options: options() },
      ];
    }
    const btnTous = h('button', { type: 'button', class: 'puce', 'aria-pressed': 'true', onclick: () => { choisis = new Set(tous); majLegende(); redessiner(); } }, 'Tous');
    legende.appendChild(btnTous);
    for (const m of MTC.meridiens) {
      legende.appendChild(h('button', { type: 'button', class: 'puce m-' + m.id, 'data-id': m.id, 'aria-pressed': 'false', onclick: () => {
        choisis = new Set([m.id]);
        majLegende(); redessiner();
      } }, h('span', { class: 'pastille' }), Notation.meridien(m.id)));
    }
    function majLegende() {
      const tousChoisis = choisis.size === tous.length;
      btnTous.setAttribute('aria-pressed', tousChoisis ? 'true' : 'false');
      for (const b of legende.querySelectorAll('[data-id]')) b.setAttribute('aria-pressed', !tousChoisis && choisis.has(b.dataset.id) ? 'true' : 'false');
    }
    cadre = C.cadrePlanche({ vues: vues(), taille: 'haute' });

    const grille = h('div', { class: 'grille-meridiens' });
    for (const m of MTC.meridiens) {
      grille.appendChild(h('a', { class: 'carte-meridien m-' + m.id, href: '#/meridien/' + m.id },
        h('div', { class: 'ligne1' }, h('span', { class: 'code plein m-' + m.id }, Notation.meridien(m.id)), h('span', { class: 'nom' }, m.nom)),
        h('div', { class: 'meta' }, [ELEMENT_NOM(m.element), m.polarite === 'yin' ? 'Yin' : 'Yang', m.heures ? m.heures[0] + ' h – ' + m.heures[1] + ' h' : 'vaisseau'].join(' · ')),
        h('div', { class: 'meta' }, m.nbPoints + ' points'),
        h('span', { class: 'han', 'aria-hidden': 'true' }, m.hanzi.replace(/[手足太少阳阴明厥经]/g, '').slice(0, 2) || m.hanzi.slice(0, 1))));
    }

    const noeud = h('div', null,
      h('p', { class: 'salut discret' }, 'Le Qi circule dans le corps par des canaux, les méridiens (Jing Luo). Douze sont reliés chacun à un organe, deux suivent la ligne médiane. Les points de digipuncture sont des endroits précis de ces canaux où l’on peut agir sur leur énergie.'),
      cadre.element,
      legende,
      h('p', { class: 'discret petit' }, 'Pincez ou touchez deux fois pour agrandir. Les petits traits clairs qui avancent montrent le sens de circulation du Qi.'),
      h('h2', { class: 'titre-section' }, 'Les quatorze méridiens'),
      grille,
      h('div', { class: 'tuiles' },
        h('a', { class: 'tuile', href: '#/points' }, icone('cercle'), h('span', { class: 'tuile-titre' }, 'Index des points'), h('span', { class: 'tuile-sous' }, MTC.points.length + ' points, avec recherche')),
        h('a', { class: 'tuile', href: '#/horloge' }, icone('horloge'), h('span', { class: 'tuile-titre' }, 'L’horloge des méridiens'), h('span', { class: 'tuile-sous' }, 'Le Qi au fil des 24 heures')),
        h('a', { class: 'tuile', href: '#/principes/digipuncture' }, icone('regle'), h('span', { class: 'tuile-titre' }, 'Trouver un point'), h('span', { class: 'tuile-sous' }, 'Le cun, les gestes, les précautions'))));
    return { titre: 'Méridiens', noeud };
  };

  // ── Fiche d'un méridien ──────────────────────────────────────────────────
  Vues.meridien = function (id) {
    const m = MTC.meridien(id);
    if (!m) return null;
    Carnet.noterVisite('m:' + id);
    const principale = Corps.VUE_PRINCIPALE[id];
    const vues = [];
    for (const vue of ['face', 'dos']) {
      const pl = Corps.planche(vue);
      if (!pl.traces[id]) continue;
      vues.push({
        id: 'corps-' + vue,
        options: { meridiens: [id], animer: true, points: m.points.filter((p) => pl.points[p]), etiquettes: true, espacement: 12, surPoint: C.apercuPoint },
      });
    }
    vues.sort((a, b) => (a.id === 'corps-' + principale ? -1 : b.id === 'corps-' + principale ? 1 : 0));
    for (const r of Regions.liste()) {
      const pl = Regions.planche(r);
      if (!pl.traces[id]) continue;
      const pts = C.pointsSur(pl, (p) => Planche.meridienDe(p) === id);
      vues.push({ id: r, options: { meridiens: [id], animer: true, points: pts, etiquettes: true, surPoint: C.apercuPoint } });
    }
    const cadre = C.cadrePlanche({ vues, taille: 'haute' });

    const cle = 'm:' + id;
    const i = MTC.cycle.indexOf(id);
    const precedent = i >= 0 ? MTC.meridien(MTC.cycle[(i + 11) % 12]) : null;
    const suivant = i >= 0 ? MTC.meridien(MTC.cycle[(i + 1) % 12]) : null;
    const couple = MTC.meridien(m.couple);

    const listePoints = h('ul', { class: 'liste' }, m.points.map((p) => C.itemPoint(p)));
    const dl = h('dl', { class: 'definition' });
    const lignes = [
      ['Élément', ELEMENT_NOM(m.element)], ['Polarité', m.polarite === 'yin' ? 'Yin' : 'Yang'], ['Canal', m.canal],
      ['Couplé avec', couple ? h('a', { class: 'renvoi', href: '#/meridien/' + couple.id }, couple.nom) : '—'],
      ['Heure du maximum', m.heures ? m.heures[0] + ' h – ' + m.heures[1] + ' h' : '—'],
      ['Émotion', m.emotion], ['S’ouvre dans', m.ouverture], ['Tissu', m.tissu], ['Nombre de points', String(m.nbPoints)],
    ];
    for (const [k, v] of lignes) { dl.appendChild(h('dt', null, k)); dl.appendChild(h('dd', null, v)); }

    const noeud = h('div', { class: 'm-' + id },
      C.entete({
        cachet: m.hanzi, cachetClasse: 'couleur m-' + id,
        surtitre: [h('span', { class: 'code plein m-' + id }, Notation.meridien(id) + (Notation.OMS[id] && Notation.meridien(id) !== Notation.OMS[id] ? ' · ' + Notation.OMS[id] : (Notation.meridien(id) !== id ? ' · ' + id : ''))),
          h('span', null, [ELEMENT_NOM(m.element), m.polarite === 'yin' ? 'Yin' : 'Yang', m.heures ? m.heures[0] + ' h – ' + m.heures[1] + ' h' : null].filter(Boolean).join(' · '))],
        titre: C.titreMeridien(m), sousTitre: m.pinyin + ' — ' + m.canal,
      }),
      h('div', { class: 'actions-fiche' }, C.boutonFavori(cle, m.nom), C.boutonNote(cle, m.nom)),
      h('p', null, riche(m.resume)),
      cadre.element,
      h('p', { class: 'info' }, icone('info'), h('span', null, h('strong', null, 'Sens du Qi : '), m.sens.toLowerCase() + '. ', 'Touchez un point pour l’aperçu ; les onglets montrent le détail des régions traversées.')),
      C.section('L’organe en médecine chinoise', 'livre', h('ul', { class: 'liste-texte' }, m.fonctions.map((f) => h('li', null, Outils.enLigne(f))))),
      C.section('Le trajet', 'corps', riche(m.trajet)),
      C.section('Quand il est en déséquilibre', 'alerte', h('ul', { class: 'liste-texte' }, m.signes.map((s) => h('li', null, s)))),
      C.section('Correspondances', 'taiji', dl),
      C.section('Les points principaux', 'cercle', listePoints),
      C.section('Prendre soin de ce méridien', 'feuille', riche(m.conseils)),
      precedent ? h('div', { class: 'rangee-boutons' },
        h('a', { class: 'bouton-secondaire', href: '#/meridien/' + precedent.id }, icone('retour'), precedent.nom),
        h('a', { class: 'bouton-secondaire', href: '#/meridien/' + suivant.id }, suivant.nom, icone('suite'))) : null);
    return { titre: m.nom, noeud };
  };

  // ── Index des points ─────────────────────────────────────────────────────
  const ZONES = [
    ['tete', 'Tête et cou', ['visage', 'tete-profil']],
    ['tronc', 'Tronc', ['tronc']],
    ['dos', 'Dos et nuque', ['nuque-dos', 'dos']],
    ['bras', 'Bras et mains', ['main-paume', 'main-dos']],
    ['jambes', 'Jambes et pieds', ['genou', 'jambe-int', 'jambe-ext', 'jambe-arr', 'pied']],
  ];
  function zoneDuPoint(id) {
    const v = Regions.vuesDuPoint(id);
    for (const [z, , vues] of ZONES) if (v.some((x) => vues.includes(x))) return z;
    if (Corps.positions.face[id] || Corps.positions.dos[id]) {
      const y = (Corps.positions.face[id] || Corps.positions.dos[id])[1];
      return y < 180 ? 'tete' : y < 540 ? 'tronc' : 'jambes';
    }
    return null;
  }

  Vues.points = function (q) {
    let filtreZone = (q && q.get('zone')) || '';
    let filtreMeridien = (q && q.get('m')) || '';
    let texte = '';
    const champ = h('input', { type: 'search', placeholder: 'Nom, code, indication…', 'aria-label': 'Chercher un point', enterkeyhint: 'search' });
    const liste = h('ul', { class: 'liste' });
    const compte = h('p', { class: 'discret petit' });
    const puchesZones = h('div', { class: 'defile-x', role: 'group', 'aria-label': 'Région du corps' });
    const pucesM = h('div', { class: 'defile-x', role: 'group', 'aria-label': 'Méridien' });
    const index = MTC.points.map((p) => ({
      p, zone: zoneDuPoint(p.id), m: Planche.meridienDe(p.id) || 'EX',
      texte: normaliser([p.id, Notation.oms(p.id), p.nom, p.sens, p.hanzi, p.indications.map(Outils.brut).join(' '), p.loc].join(' ')),
    }));
    function majPuces() {
      for (const b of puchesZones.children) b.setAttribute('aria-pressed', b.dataset.id === filtreZone ? 'true' : 'false');
      for (const b of pucesM.children) b.setAttribute('aria-pressed', b.dataset.id === filtreMeridien ? 'true' : 'false');
    }
    function filtrer() {
      const mots = normaliser(texte).split(' ').filter(Boolean);
      liste.textContent = '';
      let n = 0;
      const ordre = MTC.meridiens.map((m) => m.id).concat(['EX']);
      const tries = index.slice().sort((a, b) => ordre.indexOf(a.m) - ordre.indexOf(b.m) || (parseInt(a.p.id.replace(/\D/g, ''), 10) || 0) - (parseInt(b.p.id.replace(/\D/g, ''), 10) || 0));
      for (const x of tries) {
        if (filtreZone && x.zone !== filtreZone) continue;
        if (filtreMeridien && x.m !== filtreMeridien) continue;
        if (mots.length && !mots.every((mot) => x.texte.includes(mot))) continue;
        liste.appendChild(C.itemPoint(x.p.id));
        n += 1;
      }
      compte.textContent = n + ' point' + (n > 1 ? 's' : '');
      if (!n) liste.appendChild(h('li', null, h('p', { class: 'item discret' }, 'Aucun point ne correspond.')));
      majPuces();
    }
    puchesZones.appendChild(h('button', { type: 'button', class: 'puce', 'data-id': '', onclick: () => { filtreZone = ''; filtrer(); } }, 'Tout le corps'));
    for (const [id, nom] of ZONES) puchesZones.appendChild(h('button', { type: 'button', class: 'puce', 'data-id': id, onclick: () => { filtreZone = filtreZone === id ? '' : id; filtrer(); } }, nom));
    pucesM.appendChild(h('button', { type: 'button', class: 'puce', 'data-id': '', onclick: () => { filtreMeridien = ''; filtrer(); } }, 'Tous les méridiens'));
    for (const m of MTC.meridiens) pucesM.appendChild(h('button', { type: 'button', class: 'puce m-' + m.id, 'data-id': m.id, onclick: () => { filtreMeridien = filtreMeridien === m.id ? '' : m.id; filtrer(); } }, h('span', { class: 'pastille' }), Notation.meridien(m.id)));
    pucesM.appendChild(h('button', { type: 'button', class: 'puce m-EX', 'data-id': 'EX', onclick: () => { filtreMeridien = filtreMeridien === 'EX' ? '' : 'EX'; filtrer(); } }, h('span', { class: 'pastille' }), 'Hors méridien'));
    champ.addEventListener('input', () => { texte = champ.value; filtrer(); });
    filtrer();
    const noeud = h('div', null,
      h('div', { class: 'recherche-champ' }, icone('recherche'), champ),
      puchesZones, pucesM, compte, liste);
    return { titre: 'Index des points', noeud };
  };

  // ── Horloge ──────────────────────────────────────────────────────────────
  Vues.horloge = function () {
    const detail = h('div', { class: 'panneau-detail', 'aria-live': 'polite' });
    const actif = MTC.meridienDeLHeure(new Date().getHours() + new Date().getMinutes() / 60);
    const horloge = Schemas.horloge({ selection: actif && actif.id, surChoix: montrer });
    function montrer(id) {
      const m = MTC.meridien(id);
      const i = MTC.cycle.indexOf(id);
      const oppose = MTC.meridien(MTC.cycle[(i + 6) % 12]);
      detail.textContent = '';
      detail.className = 'panneau-detail m-' + id;
      detail.appendChild(h('h4', null, m.heures[0] + ' h – ' + m.heures[1] + ' h : ', h('a', { class: 'renvoi', href: '#/meridien/' + id }, m.nom)));
      detail.appendChild(riche(m.resume));
      detail.appendChild(h('p', { class: 'discret' }, 'À l’opposé du cadran (' + oppose.heures[0] + ' h – ' + oppose.heures[1] + ' h), le ' + oppose.nom + ' est au plus bas : c’est la « loi midi-minuit ».'));
      if (m.conseils) detail.appendChild(h('p', { class: 'petit' }, riche(m.conseils).textContent));
    }
    const noeud = h('div', null,
      h('p', { class: 'salut discret' }, 'Selon la médecine chinoise, le Qi accomplit chaque jour le tour des douze méridiens et séjourne deux heures dans chacun, à son maximum. L’aiguille suit l’heure réelle ; touchez un secteur pour le découvrir.'),
      Schemas.figure(h('div', null, horloge.element, detail)),
      C.section('Ce que l’on en fait', 'info', riche('Cette horloge sert surtout de **repère d’hygiène de vie** : petit-déjeuner consistant à l’heure de l’Estomac (7 h – 9 h), sieste ou calme à l’heure du Cœur (11 h – 13 h), coucher avant l’heure de la Vésicule biliaire (23 h). Des réveils toujours à la même heure de la nuit sont parfois lus comme un signe : vers 1 h – 3 h pour le Foie, 3 h – 5 h pour le Poumon.\n\nC’est une notion traditionnelle, à prendre comme une invitation à écouter ses rythmes, pas comme un diagnostic.')));
    return { titre: 'L’horloge des méridiens', noeud };
  };

})(window);
