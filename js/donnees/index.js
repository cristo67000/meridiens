'use strict';
/*
 * Les index du contenu : retrouver un point, un méridien, un soin… par son
 * identifiant, et les liens qui vont dans l'autre sens (les soins qui
 * utilisent un point). Construit une fois, au chargement.
 */
(function (racine) {
  const MTC = racine.MTC = racine.MTC || {};

  function indexer(liste) {
    const m = new Map();
    for (const x of liste || []) {
      if (m.has(x.id)) console.warn('identifiant en double : ' + x.id);
      m.set(x.id, x);
    }
    return m;
  }

  const I = {
    points: indexer(MTC.points),
    meridiens: indexer(MTC.meridiens),
    soins: indexer(MTC.soins),
    chapitres: indexer(MTC.chapitres),
    aliments: indexer(MTC.aliments),
    recettes: indexer(MTC.recettes),
    constitutions: indexer(MTC.constitutions),
    saisons: indexer(MTC.saisons),
  };

  MTC.point = (id) => I.points.get(id);
  MTC.meridien = (id) => I.meridiens.get(id);
  MTC.soin = (id) => I.soins.get(id);
  MTC.chapitre = (id) => I.chapitres.get(id);
  MTC.aliment = (id) => I.aliments.get(id);
  MTC.recette = (id) => I.recettes.get(id);
  MTC.constitution = (id) => I.constitutions.get(id);
  MTC.saison = (id) => I.saisons.get(id);

  /* Le méridien d'un point (objet), ou null pour un point hors méridien. */
  MTC.meridienDuPoint = (id) => {
    const m = racine.Planche ? Planche.meridienDe(id) : null;
    return m ? I.meridiens.get(m) : null;
  };

  // Les soins qui utilisent chaque point
  const usages = new Map();
  for (const s of MTC.soins || []) {
    const ids = new Set();
    for (const e of s.points || []) ids.add(e.id);
    for (const f of s.formes || []) for (const p of f.points || []) ids.add(p);
    for (const id of ids) {
      if (!usages.has(id)) usages.set(id, []);
      usages.get(id).push(s);
    }
  }
  MTC.soinsDuPoint = (id) => usages.get(id) || [];

  /* Le méridien actif à une heure donnée (cycle de 24 h, 2 h par méridien). */
  MTC.meridienDeLHeure = (heure) => {
    const h = ((heure % 24) + 24) % 24;
    for (const m of MTC.meridiens) {
      if (!m.heures) continue;
      const [a, b] = m.heures;
      if (a < b ? h >= a && h < b : h >= a || h < b) return m;
    }
    return null;
  };

  /* La saison du moment (calendrier solaire chinois approché) : chaque saison
   * commence vers le début de la saison occidentale moins six semaines
   * (Li Chun, 4 février…), et les 18 derniers jours de chacune
   * appartiennent à la Terre. On retient ici l'usage courant en diététique :
   * printemps, été, fin d'été (Terre), automne, hiver. */
  MTC.saisonDuJour = (date) => {
    const d = date || new Date();
    const m = d.getMonth() + 1;
    const j = d.getDate();
    const v = m * 100 + j;
    if (v >= 204 && v < 505) return MTC.saison('printemps');
    if (v >= 505 && v < 720) return MTC.saison('ete');
    if (v >= 720 && v < 807) return MTC.saison('fin-ete');
    if (v >= 807 && v < 1107) return MTC.saison('automne');
    return MTC.saison('hiver');
  };

  // Contrôle de cohérence (en développement, visible dans la console)
  if (/localhost|127\.0\.0\.1/.test(location.hostname)) {
    const manque = [];
    for (const m of MTC.meridiens || []) for (const p of m.points) if (!I.points.has(p)) manque.push(m.id + '→' + p);
    for (const s of MTC.soins || []) {
      for (const e of s.points || []) if (!I.points.has(e.id)) manque.push(s.id + '→' + e.id);
      for (const a of [].concat((s.aliments && s.aliments.plus) || [], (s.aliments && s.aliments.moins) || [])) if (!I.aliments.has(a)) manque.push(s.id + '→aliment ' + a);
    }
    if (manque.length) console.warn('Renvois sans cible :', manque.join(', '));
  }

})(window);
