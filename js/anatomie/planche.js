'use strict';
/*
 * Dessiner une planche : le fond (silhouette ou vue de détail), puis par-dessus
 * les tracés des méridiens, les points, leurs étiquettes, et pour le point
 * qu'on regarde, ses repères de mesure.
 *
 * Une planche est un objet { largeur, hauteur, fond, points, traces, guides } :
 *   points  { id: [[x, y], …] }      une position par côté du corps
 *   traces  { méridien: [[[x, y], …], …] }
 *   guides  { id: [ … ] }            repères de mesure propres à un point
 * Tout ce qui est interactif passe par des classes : aucun style en ligne
 * (la politique de sécurité de la page l'interdit).
 */
(function (racine) {

  const NS = 'http://www.w3.org/2000/svg';
  const { lisse, longueur } = racine.Geo;

  function el(nom, attributs, texte) {
    const n = document.createElementNS(NS, nom);
    if (attributs) for (const k of Object.keys(attributs)) if (attributs[k] != null) n.setAttribute(k, attributs[k]);
    if (texte != null) n.textContent = texte;
    return n;
  }

  /* Le méridien d'un point : « GI4 » → « GI », « Yintang » → null (point hors méridien). */
  function meridienDe(id) {
    const m = /^(VB|VC|VG|GI|IG|MC|TR|RP|[PECVRF])\d/.exec(id);
    return m ? m[1] : null;
  }

  /*
   * options :
   *   meridiens   méridiens à tracer ; true = tous
   *   animer      le Qi circule (pointillés qui avancent)
   *   points      ids des points à montrer
   *   discrets    ids montrés en petit, sans étiquette
   *   actif       le point mis en avant
   *   etiquettes  true, false, ou un tableau d'ids
   *   cadre       [x, y, l, h] : ne montrer qu'une partie
   *   guides      dessiner les repères de mesure du point actif
   *   surPoint    fonction(id) au toucher d'un point
   *   titre       texte pour les lecteurs d'écran
   */
  function dessiner(planche, options) {
    const o = options || {};
    const cadre = o.cadre || [0, 0, planche.largeur, planche.hauteur];
    const svg = el('svg', {
      viewBox: cadre.join(' '), class: 'planche planche-' + planche.id, role: 'img',
      'aria-label': o.titre || planche.titre || '',
      preserveAspectRatio: 'xMidYMid meet',
    });
    const fond = el('g', { class: 'fond' });
    fond.innerHTML = planche.fond;
    svg.appendChild(fond);

    // Les tracés
    const calqueTraces = el('g', { class: 'traces' });
    const liste = o.meridiens === true ? Object.keys(planche.traces || {}) : (o.meridiens || []);
    for (const m of liste) {
      const sous = (planche.traces || {})[m];
      if (!sous) continue;
      const g = el('g', { class: 'trace m-' + m + (o.attenues && o.attenues.includes(m) ? ' attenue' : '') });
      for (const pts of sous) {
        const d = lisse(pts);
        g.appendChild(el('path', { class: 'trace-fond', d }));
        g.appendChild(el('path', { class: 'trace-ligne', d }));
        if (o.animer) g.appendChild(el('path', { class: 'trace-flux', d }));
      }
      calqueTraces.appendChild(g);
    }
    svg.appendChild(calqueTraces);

    // Les repères de mesure du point actif
    if (o.guides && o.actif && planche.guides && planche.guides[o.actif]) {
      svg.appendChild(dessinerGuides(planche.guides[o.actif], planche));
    }

    // Les points
    const calquePoints = el('g', { class: 'points' });
    const ids = [].concat(o.discrets || [], o.points || []);
    const placees = [];
    const libre = (p) => !o.espacement || placees.every((q) => Math.abs(q[0] - p[0]) > o.espacement * 2.4 || Math.abs(q[1] - p[1]) > o.espacement);
    const vus = new Set();
    for (const id of ids) {
      if (vus.has(id)) continue;
      vus.add(id);
      const positions = (planche.points || {})[id];
      if (!positions) continue;
      const discret = (o.discrets || []).includes(id) && !(o.points || []).includes(id);
      const actif = id === o.actif;
      const m = meridienDe(id) || 'EX';
      const g = el('g', {
        class: 'pt m-' + m + (discret ? ' discret' : '') + (actif ? ' actif' : ''),
        'data-id': id,
      });
      if (o.surPoint) {
        g.setAttribute('tabindex', '0');
        g.setAttribute('role', 'button');
        g.setAttribute('aria-label', o.nomPoint ? o.nomPoint(id) : id);
      }
      positions.forEach((p, i) => {
        if (actif) {
          g.appendChild(el('circle', { class: 'pt-onde', cx: p[0], cy: p[1], r: 6 }));
          g.appendChild(el('circle', { class: 'pt-onde onde-2', cx: p[0], cy: p[1], r: 6 }));
        }
        g.appendChild(el('circle', { class: 'pt-zone', cx: p[0], cy: p[1], r: o.zone || 9 }));
        g.appendChild(el('circle', { class: 'pt-disque', cx: p[0], cy: p[1], r: actif ? 4.6 : (discret ? 2.4 : 3.3) }));
        const montrer = !discret && (o.etiquettes === true || (Array.isArray(o.etiquettes) && o.etiquettes.includes(id)) || actif);
        if (montrer && i === 0 && (actif || libre(p))) {
          placees.push(p);
          const cote = (planche.etiquettes && planche.etiquettes[id]) || (p[0] >= (planche.axe || planche.largeur / 2) ? 'd' : 'g');
          const dx = cote === 'd' ? 6.5 : cote === 'g' ? -6.5 : 0;
          const dy = cote === 'h' ? -8 : cote === 'b' ? 13 : 3.4;
          const t = el('text', {
            class: 'pt-etiquette', x: p[0] + dx, y: p[1] + dy,
            'text-anchor': cote === 'd' ? 'start' : cote === 'g' ? 'end' : 'middle',
          }, o.libelle ? o.libelle(id) : id);
          g.appendChild(t);
        }
      });
      if (o.surPoint) {
        g.addEventListener('click', (e) => { e.stopPropagation(); o.surPoint(id); });
        g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); o.surPoint(id); } });
      }
      calquePoints.appendChild(g);
    }
    svg.appendChild(calquePoints);
    // Le point actif passe devant les autres
    const premier = calquePoints.querySelector('.pt.actif');
    if (premier) calquePoints.appendChild(premier);
    return svg;
  }

  /*
   * Les repères de mesure, pour trouver le point sur soi :
   *   { mesure: [A, B], texte, doigts: n }   une distance en cun, avec n doigts
   *                                          posés en travers si l'on veut
   *   { repere: [x, y], texte, r }           un relief à sentir (os, tendon)
   *   { fleche: [A, B], texte }              un mouvement, une direction
   *   { ligne: [[x, y], …], texte }          une ligne de construction
   */
  function dessinerGuides(guides, planche) {
    const g = el('g', { class: 'guides' });
    const badges = el('g', { class: 'g-badges' });
    let rang = 0;
    let numero = 0;
    for (const gd of guides) {
      rang += 1;
      const sous = el('g', { class: 'guide guide-' + rang });
      let ancre = null;
      if (gd.mesure) {
        const [A, B] = gd.mesure;
        if (gd.doigts) sous.appendChild(doigtsEnTravers(A, B, gd.doigts, gd.cote || 1));
        sous.appendChild(el('path', { class: 'g-mesure', d: 'M' + A[0] + ' ' + A[1] + 'L' + B[0] + ' ' + B[1] }));
        const v = [B[0] - A[0], B[1] - A[1]];
        const l = Math.hypot(v[0], v[1]) || 1;
        for (const P of [A, B]) {
          const n = [-v[1] / l * 4, v[0] / l * 4];
          sous.appendChild(el('path', { class: 'g-taquet', d: 'M' + (P[0] - n[0]) + ' ' + (P[1] - n[1]) + 'L' + (P[0] + n[0]) + ' ' + (P[1] + n[1]) }));
        }
        const c = milieu(A, B);
        const cote = -(gd.cote || 1);
        ancre = [c[0] - v[1] / l * 11 * cote, c[1] + v[0] / l * 11 * cote];
      } else if (gd.repere) {
        const r = gd.r || 7;
        sous.appendChild(el('circle', { class: 'g-repere', cx: gd.repere[0], cy: gd.repere[1], r }));
        ancre = [gd.repere[0] + r * 0.8 + 4, gd.repere[1] - r * 0.8 - 4];
      } else if (gd.fleche) {
        const [A, B] = gd.fleche;
        sous.appendChild(el('path', { class: 'g-fleche', d: 'M' + A[0] + ' ' + A[1] + 'L' + B[0] + ' ' + B[1], 'marker-end': 'url(#g-pointe)' }));
        ancre = [A[0] + 6, A[1] - 8];
      } else if (gd.ligne) {
        sous.appendChild(el('path', { class: 'g-ligne', d: lisse(gd.ligne) }));
        const P = gd.ligne[gd.ligne.length - 1];
        ancre = [P[0] + 6, P[1] - 6];
      }
      if (gd.texte && ancre) {
        numero += 1;
        const b = el('g', { class: 'g-badge guide-' + rang });
        b.appendChild(el('circle', { cx: ancre[0], cy: ancre[1], r: 7 }));
        b.appendChild(el('text', { x: ancre[0], y: ancre[1] + 3.3, 'text-anchor': 'middle' }, String(numero)));
        badges.appendChild(b);
      }
      g.appendChild(sous);
    }
    g.appendChild(badges);
    const defs = el('defs');
    const pointe = el('marker', { id: 'g-pointe', viewBox: '0 0 10 10', refX: '8', refY: '5', markerWidth: '6', markerHeight: '6', orient: 'auto-start-reverse' });
    pointe.appendChild(el('path', { class: 'g-pointe', d: 'M0 0L10 5L0 10Z' }));
    defs.appendChild(pointe);
    g.appendChild(defs);
    return g;
  }

  /* Les textes des repères, dans l'ordre de leurs numéros. */
  function textesGuides(planche, id) {
    const guides = (planche.guides && planche.guides[id]) || [];
    return guides.filter((gd) => gd.texte && (gd.mesure || gd.repere || gd.fleche || gd.ligne)).map((gd) => gd.texte);
  }

  /* Le cadre qui montre un point et ses repères, assez large pour situer. */
  function cadrerPoint(planche, id, rapport) {
    const pts = [].concat(planche.points[id] || []);
    for (const gd of (planche.guides && planche.guides[id]) || []) {
      if (gd.mesure) pts.push(...gd.mesure);
      if (gd.repere) pts.push(gd.repere);
      if (gd.fleche) pts.push(...gd.fleche);
      if (gd.ligne) pts.push(...gd.ligne);
    }
    if (!pts.length) return null;
    let x0 = Math.min(...pts.map((p) => p[0])); let x1 = Math.max(...pts.map((p) => p[0]));
    let y0 = Math.min(...pts.map((p) => p[1])); let y1 = Math.max(...pts.map((p) => p[1]));
    const m = 34;
    x0 -= m; x1 += m; y0 -= m; y1 += m;
    const minL = planche.largeur * 0.66;
    const minH = planche.hauteur * 0.5;
    if (x1 - x0 < minL) { const c = (x0 + x1) / 2; x0 = c - minL / 2; x1 = c + minL / 2; }
    if (y1 - y0 < minH) { const c = (y0 + y1) / 2; y0 = c - minH / 2; y1 = c + minH / 2; }
    if (rapport) {
      const l = x1 - x0; const h = y1 - y0;
      if (l / h < rapport) { const nl = h * rapport; x0 -= (nl - l) / 2; x1 = x0 + nl; } else { const nh = l / rapport; y0 -= (nh - h) / 2; y1 = y0 + nh; }
    }
    // rester dans la planche autant que possible
    const l = x1 - x0; const h = y1 - y0;
    if (l < planche.largeur) { if (x0 < 0) { x0 = 0; } if (x0 + l > planche.largeur) x0 = planche.largeur - l; }
    if (h < planche.hauteur) { if (y0 < 0) { y0 = 0; } if (y0 + h > planche.hauteur) y0 = planche.hauteur - h; }
    return [x0, y0, l, h];
  }

  function milieu(A, B) { return [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]; }

  function etiquette(texte, ou, ancre) {
    const g = el('g', { class: 'g-etiquette' });
    const t = el('text', { x: ou[0], y: ou[1], 'text-anchor': ancre || 'middle', 'dominant-baseline': 'middle' }, texte);
    g.appendChild(t);
    return g;
  }

  /* Des doigts posés à plat entre A et B, perpendiculaires à la mesure : c'est
   * le « cun digital » — un pouce = 1 cun, deux doigts = 1,5 cun, trois = 2,
   * quatre = 3 cun. */
  function doigtsEnTravers(A, B, n, cote) {
    const g = el('g', { class: 'g-doigts' });
    const v = [B[0] - A[0], B[1] - A[1]];
    const l = Math.hypot(v[0], v[1]);
    const u = [v[0] / l, v[1] / l];
    const p = [-u[1] * cote, u[0] * cote];
    const larg = l / n;
    const long = Math.max(26, larg * 2.6);
    for (let k = 0; k < n; k += 1) {
      const c = [A[0] + u[0] * larg * (k + 0.5), A[1] + u[1] * larg * (k + 0.5)];
      const r = larg * 0.46;
      // un doigt posé à plat en travers de la mesure : du côté de la paume (−)
      // vers le bout du doigt (+), arrondi aux deux extrémités
      const debut = [c[0] - p[0] * long * 0.35, c[1] - p[1] * long * 0.35];
      const fin = [c[0] + p[0] * long * 0.65, c[1] + p[1] * long * 0.65];
      const pts = [];
      for (let i = 0; i <= 8; i += 1) {
        const a = Math.PI * i / 8;
        pts.push([fin[0] + u[0] * r * Math.cos(a) + p[0] * r * Math.sin(a), fin[1] + u[1] * r * Math.cos(a) + p[1] * r * Math.sin(a)]);
      }
      for (let i = 0; i <= 8; i += 1) {
        const a = Math.PI + Math.PI * i / 8;
        pts.push([debut[0] + u[0] * r * Math.cos(a) + p[0] * r * Math.sin(a), debut[1] + u[1] * r * Math.cos(a) + p[1] * r * Math.sin(a)]);
      }
      g.appendChild(el('path', { class: 'g-doigt', d: 'M' + pts.map((q) => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join('L') + 'Z' }));
      // l'ongle, près du bout
      const o = [fin[0] - p[0] * r * 0.55, fin[1] - p[1] * r * 0.55];
      const ongle = [];
      for (let i = 0; i < 12; i += 1) {
        const a = 2 * Math.PI * i / 12;
        ongle.push([o[0] + u[0] * r * 0.55 * Math.cos(a) + p[0] * r * 0.8 * Math.sin(a), o[1] + u[1] * r * 0.55 * Math.cos(a) + p[1] * r * 0.8 * Math.sin(a)]);
      }
      g.appendChild(el('path', { class: 'g-ongle', d: 'M' + ongle.map((q) => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join('L') + 'Z' }));
    }
    return g;
  }

  /* Le cadre qui entoure des points, avec une marge, aux proportions voulues. */
  function cadrer(planche, ids, marge, rapport) {
    let x0 = Infinity; let y0 = Infinity; let x1 = -Infinity; let y1 = -Infinity;
    for (const id of ids) {
      for (const p of (planche.points[id] || [])) {
        x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]);
      }
    }
    if (!isFinite(x0)) return null;
    const m = marge || 40;
    x0 -= m; y0 -= m; x1 += m; y1 += m;
    if (rapport) {
      const l = x1 - x0; const h = y1 - y0;
      if (l / h < rapport) { const nl = h * rapport; x0 -= (nl - l) / 2; x1 = x0 + nl; } else { const nh = l / rapport; y0 -= (nh - h) / 2; y1 = y0 + nh; }
    }
    return [x0, y0, x1 - x0, y1 - y0];
  }

  racine.Planche = { dessiner, cadrer, cadrerPoint, textesGuides, meridienDe, longueur };

})(window);
