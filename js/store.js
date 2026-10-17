'use strict';
/*
 * Ce que l'application retient, sur l'appareil seulement (localStorage) :
 * les réglages, les favoris, les notes, l'historique des séances et le
 * résultat du questionnaire de constitution. Rien ne part ailleurs.
 *
 * Un stockage indisponible (navigation privée, quota) ne doit jamais casser
 * l'application : tout passe par lire/ecrire, qui avalent les erreurs et
 * gardent une copie en mémoire pour la visite en cours.
 */
(function (racine) {

  const PREFIXE = 'meridiens.';
  const memoire = {};

  function lire(cle, defaut) {
    try {
      const v = racine.localStorage.getItem(PREFIXE + cle);
      if (v != null) return JSON.parse(v);
    } catch (e) { /* stockage indisponible */ }
    return cle in memoire ? memoire[cle] : defaut;
  }
  function ecrire(cle, valeur) {
    memoire[cle] = valeur;
    try { racine.localStorage.setItem(PREFIXE + cle, JSON.stringify(valeur)); return true; } catch (e) { return false; }
  }

  // ── Réglages ─────────────────────────────────────────────────────────────
  const DEFAUTS = {
    theme: 'auto',            // auto | clair | sombre
    taille: 1,                // 0.9 · 1 · 1.12 · 1.25
    notation: 'fr',           // fr (GI4) | oms (LI4)
    dureePoint: 60,           // secondes par point dans une séance
    vibrations: true,
    son: true,
    respiration: true,        // guide de respiration pendant les séances
    avertissementVu: false,
  };
  const ecouteurs = [];
  const Reglages = {
    lire(cle) { const r = lire('reglages', {}); return cle in r ? r[cle] : DEFAUTS[cle]; },
    ecrire(cle, valeur) {
      const r = lire('reglages', {});
      r[cle] = valeur;
      ecrire('reglages', r);
      appliquer();
      for (const f of ecouteurs) f(cle, valeur);
    },
    surChangement(f) { ecouteurs.push(f); },
    DEFAUTS,
  };
  function appliquer() {
    const doc = document.documentElement;
    const t = Reglages.lire('theme');
    if (t === 'clair' || t === 'sombre') doc.dataset.theme = t; else delete doc.dataset.theme;
    doc.style.setProperty('--taille', (16 * Reglages.lire('taille')) + 'px');
    const sombre = t === 'sombre' || (t === 'auto' && racine.matchMedia && racine.matchMedia('(prefers-color-scheme: dark)').matches);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', sombre ? '#15120e' : '#f6f0e4');
  }

  // ── Notation des points ──────────────────────────────────────────────────
  const OMS = { P: 'LU', GI: 'LI', E: 'ST', RP: 'SP', C: 'HT', IG: 'SI', V: 'BL', R: 'KI', MC: 'PC', TR: 'TE', VB: 'GB', F: 'LR', VC: 'CV', VG: 'GV' };
  const Notation = {
    oms(id) {
      const m = /^(VB|VC|VG|GI|IG|MC|TR|RP|[PECVRF])(\d+)$/.exec(id);
      return m ? OMS[m[1]] + m[2] : null;
    },
    /* Le code tel qu'on l'affiche, selon le réglage. Un point hors méridien
     * n'a pas de code : on rend son nom. */
    code(id) {
      const oms = Notation.oms(id);
      if (!oms) return id;
      return Reglages.lire('notation') === 'oms' ? oms : id;
    },
    /* Le code « autre » (pour l'afficher en second). */
    autre(id) {
      const oms = Notation.oms(id);
      if (!oms) return null;
      return Reglages.lire('notation') === 'oms' ? id : oms;
    },
    meridien(id) { return Reglages.lire('notation') === 'oms' ? (OMS[id] || id) : id; },
    OMS,
  };

  // ── Carnet : favoris, notes, historique, profil ──────────────────────────
  const Carnet = {
    favoris() { return lire('favoris', []); },
    estFavori(cle) { return Carnet.favoris().includes(cle); },
    basculerFavori(cle) {
      const f = Carnet.favoris();
      const i = f.indexOf(cle);
      if (i >= 0) f.splice(i, 1); else f.unshift(cle);
      ecrire('favoris', f);
      return i < 0;
    },
    note(cle) { return lire('notes', {})[cle] || ''; },
    notes() { return lire('notes', {}); },
    ecrireNote(cle, texte) {
      const n = lire('notes', {});
      if (texte && texte.trim()) n[cle] = { texte: texte.trim(), date: new Date().toISOString() };
      else delete n[cle];
      ecrire('notes', n);
    },
    historique() { return lire('historique', []); },
    noterSeance(idSoin, secondes, points) {
      const h = Carnet.historique();
      h.unshift({ soin: idSoin, date: new Date().toISOString(), duree: Math.round(secondes), points: points || 0 });
      ecrire('historique', h.slice(0, 200));
    },
    viderHistorique() { ecrire('historique', []); },
    profil() { return lire('profil', null); },
    ecrireProfil(p) { ecrire('profil', p); },
    recents() { return lire('recents', []); },
    noterVisite(cle) {
      const r = Carnet.recents().filter((x) => x !== cle);
      r.unshift(cle);
      ecrire('recents', r.slice(0, 12));
    },
    /* Sauvegarde : tout ce que l'appareil garde, en un fichier. */
    exporter() {
      return {
        application: 'Méridiens', format: 1, date: new Date().toISOString(),
        reglages: lire('reglages', {}), favoris: Carnet.favoris(), notes: Carnet.notes(),
        historique: Carnet.historique(), profil: Carnet.profil(),
      };
    },
    importer(donnees) {
      if (!donnees || donnees.application !== 'Méridiens') throw new Error('Ce fichier n’est pas une sauvegarde de Méridiens.');
      const f = new Set(Carnet.favoris());
      for (const x of donnees.favoris || []) f.add(x);
      ecrire('favoris', Array.from(f));
      const n = Object.assign({}, donnees.notes || {}, Carnet.notes());
      ecrire('notes', n);
      const h = (donnees.historique || []).concat(Carnet.historique());
      const vus = new Set();
      ecrire('historique', h.filter((x) => { const k = x.date + x.soin; if (vus.has(k)) return false; vus.add(k); return true; })
        .sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 200));
      if (donnees.profil && !Carnet.profil()) ecrire('profil', donnees.profil);
    },
  };

  racine.Reglages = Reglages;
  racine.Notation = Notation;
  racine.Carnet = Carnet;
  appliquer();
  if (racine.matchMedia) {
    try { racine.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', appliquer); } catch (e) { /* ancien navigateur */ }
  }

})(window);
