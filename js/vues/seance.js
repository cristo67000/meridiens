'use strict';
/*
 * La séance guidée : les points d'un soin, l'un après l'autre, en plein écran.
 *
 * Pour chaque point : le schéma de détail qui le montre (avec ses repères),
 * la consigne, un minuteur circulaire. Un point bilatéral se masse d'un côté
 * puis de l'autre : à mi-temps, un son et une vibration invitent à changer de
 * côté. Un guide de respiration (4 s d'inspiration, 6 s d'expiration) aide à
 * se poser. L'écran reste allumé pendant la séance (Wake Lock).
 *
 * Le temps est compté sur l'horloge réelle (performance.now) et non sur des
 * tics : un téléphone qui met la page en veille ne fausse pas le minuteur.
 */
(function (racine) {

  const { h, icone, enLigne } = Outils;
  const C = racine.Communs;
  const Vues = racine.Vues = racine.Vues || {};

  // ── Son : une petite cloche synthétisée ─────────────────────────────────
  let audio = null;
  function cloche(aigu) {
    if (!Reglages.lire('son')) return;
    try {
      if (!audio) audio = new (racine.AudioContext || racine.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume();
      const t = audio.currentTime;
      const sortie = audio.createGain();
      sortie.gain.setValueAtTime(0.0001, t);
      sortie.gain.exponentialRampToValueAtTime(0.22, t + 0.02);
      sortie.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);
      sortie.connect(audio.destination);
      for (const [f, v] of [[aigu ? 880 : 660, 1], [aigu ? 1320 : 990, 0.45], [aigu ? 2200 : 1650, 0.18]]) {
        const o = audio.createOscillator();
        const g = audio.createGain();
        o.type = 'sine';
        o.frequency.value = f;
        g.gain.value = v;
        o.connect(g); g.connect(sortie);
        o.start(t); o.stop(t + 2.3);
      }
    } catch (e) { /* pas de son : tant pis */ }
  }

  // ── Écran allumé ─────────────────────────────────────────────────────────
  let verrou = null;
  async function garderAllume() {
    try { if (navigator.wakeLock && !verrou) { verrou = await navigator.wakeLock.request('screen'); verrou.addEventListener('release', () => { verrou = null; }); } } catch (e) { verrou = null; }
  }
  function libererEcran() { try { if (verrou) verrou.release(); } catch (e) { /* rien */ } verrou = null; }

  /* Les étapes d'une séance, d'après l'adresse. */
  function etapes(id, q) {
    if (id.startsWith('pt-')) {
      const pid = id.slice(3);
      const p = MTC.point(pid);
      return p ? { titre: p.nom, retour: '#/point/' + pid, liste: [{ id: pid, duree: p.duree, note: p.technique }] } : null;
    }
    const s = MTC.soin(id);
    if (!s) return null;
    const i = q && q.get('forme');
    if (i != null && s.formes && s.formes[+i]) {
      const f = s.formes[+i];
      return { titre: s.nom + ' — ' + f.nom, retour: '#/soin/' + id, soin: id,
        liste: f.points.filter((x) => MTC.point(x)).map((x) => ({ id: x, duree: MTC.point(x).duree, note: null })) };
    }
    return { titre: s.nom, retour: '#/soin/' + id, soin: id, liste: s.points.filter((e) => MTC.point(e.id)) };
  }

  Vues.seance = function (id, q) {
    const plan = etapes(id, q);
    if (!plan || !plan.liste.length) return null;
    const RYTHMES = { court: 0.5, normal: 1, long: 1.5 };
    let rythme = 'normal';
    let indice = 0;
    let enCours = false;
    let tempsEcoule = 0;       // secondes écoulées dans l'étape
    let depart = null;          // performance.now() au dernier démarrage
    let minuterie = null;
    let cote = 0;
    let debutSeance = null;
    let tempsTotal = 0;

    const racineVue = h('div', { class: 'seance' });

    function dureeEtape(e) {
      const p = MTC.point(e.id);
      const base = (e.duree || p.duree || Reglages.lire('dureePoint')) * RYTHMES[rythme];
      return Math.max(15, Math.round(base)) * (C.estMedian(e.id) ? 1 : 2);
    }

    // ── Écran d'accueil de la séance ──────────────────────────────────────
    function accueil() {
      racineVue.textContent = '';
      const total = plan.liste.reduce((t, e) => t + dureeEtape(e), 0);
      const dureeTexte = h('span', null, Outils.duree(total));
      const segmente = h('div', { class: 'segmente', role: 'group', 'aria-label': 'Rythme' });
      for (const [k, nom] of [['court', 'Court'], ['normal', 'Normal'], ['long', 'Long']]) {
        segmente.appendChild(h('button', { type: 'button', 'aria-pressed': k === rythme ? 'true' : 'false', onclick: () => {
          rythme = k;
          for (const b of segmente.children) b.setAttribute('aria-pressed', b.textContent === nom ? 'true' : 'false');
          dureeTexte.textContent = Outils.duree(plan.liste.reduce((t, e) => t + dureeEtape(e), 0));
        } }, nom));
      }
      const liste = h('ol', { class: 'protocole' }, plan.liste.map((e) => {
        const p = MTC.point(e.id);
        return h('li', { class: 'm-' + (Planche.meridienDe(e.id) || 'EX') }, h('span', { class: 'rang', 'aria-hidden': 'true' }),
          h('div', { class: 'item-corps' }, h('div', { class: 'etape-titre' }, C.code(e.id), ' ', p.nom), h('div', { class: 'etape-texte' }, p.sens)));
      }));
      racineVue.appendChild(h('div', { class: 'seance-haut' },
        h('button', { type: 'button', class: 'bouton-icone', 'aria-label': 'Quitter la séance', onclick: quitter }, icone('fermer')),
        h('strong', null, 'Séance guidée')));
      racineVue.appendChild(h('div', { class: 'section' },
        h('h2', null, plan.titre),
        h('p', { class: 'discret' }, plan.liste.length + ' point' + (plan.liste.length > 1 ? 's' : '') + ' · environ ', dureeTexte),
        h('div', { class: 'reglage carte' }, h('span', { class: 'libelle' }, 'Rythme'), segmente),
        h('div', { class: 'info' }, icone('info'), h('div', null,
          h('p', null, 'Installez-vous confortablement, respirez lentement. Pour chaque point, le schéma vous montre où appuyer ; le son et la vibration vous indiquent quand changer de côté puis de point.'),
          h('p', null, 'Appuyez fermement mais sans douleur vive. Arrêtez si une gêne inhabituelle apparaît.'))),
        liste,
        h('button', { type: 'button', class: 'bouton-principal bouton-large', onclick: () => { cloche(); commencer(); } }, icone('lecture'), 'Commencer')));
    }

    // ── L'étape en cours ──────────────────────────────────────────────────
    let refs = null;
    function afficherEtape() {
      const e = plan.liste[indice];
      const p = MTC.point(e.id);
      const m = Planche.meridienDe(e.id);
      const vues = C.vuesDuPoint(e.id);
      racineVue.textContent = '';
      const progression = h('div', { class: 'progression', 'aria-hidden': 'true' }, plan.liste.map((x, k) => h('span', { class: k < indice ? 'fait' : k === indice ? 'encours' : '' })));
      const haut = h('div', { class: 'seance-haut' },
        h('button', { type: 'button', class: 'bouton-icone', 'aria-label': 'Quitter la séance', onclick: quitter }, icone('fermer')),
        progression,
        h('span', { class: 'discret petit' }, (indice + 1) + '/' + plan.liste.length));
      const schema = h('div', { class: 'seance-schema' });
      if (vues.length) {
        const v = vues[0];
        const pl = C.planche(v.id);
        const svg = Planche.dessiner(pl, Object.assign({}, v.options, { libelle: C.libellePoint, surPoint: null, discrets: [] }));
        const vis = Visionneuse.creer(svg, { largeur: pl.largeur, hauteur: pl.hauteur, cadre: v.cadre, sansBoutons: true, toujoursDeplacer: true });
        schema.appendChild(vis.element);
      }
      const R = 46;
      const circonference = 2 * Math.PI * R;
      const anneau = Outils.s('circle', { class: 'reste', cx: 56, cy: 56, r: R, 'stroke-dasharray': circonference.toFixed(1), 'stroke-dashoffset': '0' });
      const temps = h('span', { class: 'temps' }, '');
      const bouton = h('button', { type: 'button', 'aria-label': 'Pause', onclick: basculer }, temps, icone('pause'));
      const minuteurEl = h('div', { class: 'minuteur' }, Outils.s('svg', { viewBox: '0 0 112 112', 'aria-hidden': 'true' }, Outils.s('circle', { class: 'fond', cx: 56, cy: 56, r: R }), anneau), bouton);
      const coteEl = h('div', { class: 'seance-cote', 'aria-live': 'polite' });
      const souffle = h('div', { class: 'souffle', 'aria-hidden': 'true' }, h('span', { class: 'bulle' }), h('span', { class: 'texte-souffle' }, ''));
      if (!Reglages.lire('respiration')) souffle.hidden = true;
      const consigne = e.note ? e.note : (p.astuce || p.loc);
      const bas = h('div', { class: 'seance-bas' },
        h('div', { class: 'seance-titre' }, h('span', { class: 'cachet couleur m-' + (m || 'EX') }, p.hanzi),
          h('div', null, h('div', { class: 'surtitre' }, C.code(e.id, 'seul')), h('h2', null, p.nom))),
        coteEl,
        h('p', { class: 'seance-consigne' }, enLigne(consigne)),
        p.grossesse ? h('p', { class: 'drapeau-grossesse' }, icone('alerte'), 'À éviter pendant la grossesse') : null,
        h('div', { class: 'seance-commandes' },
          h('button', { type: 'button', class: 'bouton-rond', 'aria-label': 'Point précédent', disabled: indice === 0 ? true : null, onclick: precedent }, icone('precedent')),
          minuteurEl,
          h('button', { type: 'button', class: 'bouton-rond', 'aria-label': indice === plan.liste.length - 1 ? 'Terminer' : 'Point suivant', onclick: suivant }, icone('suivant'))),
        souffle);
      racineVue.appendChild(haut);
      racineVue.appendChild(schema);
      racineVue.appendChild(bas);
      refs = { anneau, circonference, temps, bouton, coteEl, souffle, duree: dureeEtape(e), bilateral: !C.estMedian(e.id) };
      cote = 0;
      majAffichage();
    }

    function ecoule() {
      return tempsEcoule + (enCours && depart != null ? (performance.now() - depart) / 1000 : 0);
    }

    function majAffichage() {
      if (!refs) return;
      const t = ecoule();
      const reste = Math.max(0, refs.duree - t);
      refs.temps.textContent = Outils.chrono(reste);
      refs.anneau.setAttribute('stroke-dashoffset', (refs.circonference * (t / refs.duree)).toFixed(1));
      if (refs.etatIcone !== enCours) {
        refs.etatIcone = enCours;
        const icoPause = refs.bouton.querySelector('.ico');
        if (icoPause) icoPause.innerHTML = enCours ? ICONES.pause : ICONES.lecture;
        refs.bouton.setAttribute('aria-label', enCours ? 'Pause' : 'Reprendre');
      }
      // côté
      const moitie = refs.duree / 2;
      const nouveauCote = refs.bilateral ? (t < moitie ? 1 : 2) : 0;
      if (nouveauCote !== cote) {
        if (cote === 1 && nouveauCote === 2) { cloche(true); Outils.vibrer([120, 80, 120]); }
        cote = nouveauCote;
        refs.coteEl.textContent = cote === 0 ? 'Sur la ligne médiane' : cote === 1 ? 'Côté gauche' : 'Côté droit — changez de côté';
      }
      // respiration : 4 s d'inspiration, 6 s d'expiration
      if (!refs.souffle.hidden) {
        const phase = (performance.now() / 1000) % 10;
        const inspire = phase < 4;
        refs.souffle.classList.toggle('inspire', inspire && enCours);
        refs.souffle.querySelector('.texte-souffle').textContent = enCours ? (inspire ? 'Inspirez…' : 'Expirez lentement…') : 'En pause';
      }
      if (enCours && t >= refs.duree) finEtape();
    }

    function commencer() {
      if (!debutSeance) debutSeance = performance.now();
      garderAllume();
      afficherEtape();
      demarrer();
    }
    function demarrer() {
      enCours = true;
      depart = performance.now();
      clearInterval(minuterie);
      minuterie = setInterval(majAffichage, 200);
      majAffichage();
    }
    function pause() {
      if (!enCours) return;
      tempsEcoule = ecoule();
      enCours = false;
      depart = null;
      clearInterval(minuterie);
      majAffichage();
    }
    function basculer() { if (enCours) pause(); else demarrer(); }
    function allerA(i) {
      tempsTotal += ecoule();
      indice = i;
      tempsEcoule = 0;
      depart = enCours ? performance.now() : null;
      afficherEtape();
    }
    function precedent() { if (indice > 0) allerA(indice - 1); }
    function suivant() { if (indice < plan.liste.length - 1) allerA(indice + 1); else terminer(); }
    function finEtape() {
      cloche();
      Outils.vibrer(200);
      if (indice < plan.liste.length - 1) allerA(indice + 1); else terminer();
    }

    function terminer() {
      tempsTotal += ecoule();
      clearInterval(minuterie);
      enCours = false;
      libererEcran();
      if (plan.soin) Carnet.noterSeance(plan.soin, tempsTotal, plan.liste.length);
      racineVue.textContent = '';
      racineVue.appendChild(h('div', { class: 'fin-seance' },
        h('span', { class: 'cachet grand' }, '完'),
        h('h2', null, 'Séance terminée'),
        h('p', { class: 'discret' }, plan.liste.length + ' points · ' + Outils.duree(tempsTotal)),
        h('p', null, 'Restez quelques instants assis, respirez calmement, buvez un verre d’eau tiède.'),
        plan.soin ? h('p', { class: 'petit discret' }, 'La séance est notée dans votre carnet.') : null,
        h('div', { class: 'rangee-boutons' },
          h('button', { type: 'button', class: 'bouton-secondaire', onclick: () => { indice = 0; tempsEcoule = 0; tempsTotal = 0; debutSeance = null; accueil(); } }, 'Recommencer'),
          h('a', { class: 'bouton-principal', href: plan.retour }, 'Terminer'))));
    }

    function quitter() {
      clearInterval(minuterie);
      enCours = false;
      libererEcran();
      if (history.length > 1) history.back(); else location.hash = plan.retour;
    }

    function surVisibilite() {
      if (document.visibilityState === 'visible' && enCours) { garderAllume(); majAffichage(); }
    }
    document.addEventListener('visibilitychange', surVisibilite);

    accueil();
    return {
      titre: 'Séance — ' + plan.titre,
      noeud: racineVue,
      pleinEcran: true,
      quitter() {
        clearInterval(minuterie);
        libererEcran();
        document.removeEventListener('visibilitychange', surVisibilite);
      },
    };
  };

})(window);
