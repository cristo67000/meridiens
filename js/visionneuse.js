'use strict';
/*
 * La visionneuse : une planche qu'on peut agrandir et déplacer du bout des
 * doigts (pincer, glisser, toucher deux fois), à la molette sur ordinateur,
 * ou avec les boutons + / − / cadre.
 *
 * Le zoom se fait en changeant la viewBox — le dessin reste net à toutes les
 * échelles — et l'échelle d'affichage est confiée au CSS par --echelle, pour
 * que les étiquettes et les points gardent leur taille à l'écran.
 */
(function (racine) {

  const { h, icone } = racine.Outils;

  function creer(svg, options) {
    const o = options || {};
    const largeur = o.largeur;
    const hauteur = o.hauteur;
    const total = [0, 0, largeur, hauteur];
    let initial = (o.cadre || total).slice();
    let vb = initial.slice();

    const scene = h('div', { class: 'visionneuse-scene' });
    scene.appendChild(svg);
    const boutons = h('div', { class: 'visionneuse-boutons' },
      h('button', { type: 'button', class: 'bouton-rond', 'aria-label': 'Agrandir', onclick: () => zoomer(1.6) }, icone('zoomPlus')),
      h('button', { type: 'button', class: 'bouton-rond', 'aria-label': 'Réduire', onclick: () => zoomer(1 / 1.6) }, icone('zoomMoins')),
      h('button', { type: 'button', class: 'bouton-rond', 'aria-label': 'Revenir au cadrage', onclick: () => animer(initial) }, icone('recentrer')));
    const racineEl = h('div', { class: 'visionneuse' + (o.classe ? ' ' + o.classe : '') }, scene, o.sansBoutons ? null : boutons);

    function echelle() {
      const l = scene.clientWidth || 300;
      const ht = scene.clientHeight || 300;
      return Math.min(l / vb[2], ht / vb[3]);
    }
    function appliquer() {
      svg.setAttribute('viewBox', vb.map((v) => v.toFixed(2)).join(' '));
      svg.style.setProperty('--echelle', String(echelle()));
    }

    function borner(v) {
      const minL = largeur / 9;
      let [x, y, l, ht] = v;
      const r = l / ht;
      if (l < minL) { l = minL; ht = l / r; }
      const maxL = largeur * 1.25;
      if (l > maxL) { l = maxL; ht = l / r; }
      // garder une partie du dessin à l'écran
      x = Math.max(-l * 0.5, Math.min(largeur - l * 0.5, x));
      y = Math.max(-ht * 0.5, Math.min(hauteur - ht * 0.5, y));
      return [x, y, l, ht];
    }

    /* Le cadre adapté aux proportions de l'écran, centré sur le cadre voulu. */
    function ajuster(c) {
      const l = scene.clientWidth || 1;
      const ht = scene.clientHeight || 1;
      const r = l / ht;
      let [x, y, w, hh] = c;
      if (w / hh < r) { const nw = hh * r; x -= (nw - w) / 2; w = nw; } else { const nh = w / r; y -= (nh - hh) / 2; hh = nh; }
      return [x, y, w, hh];
    }

    let anim = null;
    function animer(cible, duree) {
      const depart = vb.slice();
      const arrivee = borner(ajuster(cible));
      const t0 = performance.now();
      const d = duree == null ? 380 : duree;
      if (anim) cancelAnimationFrame(anim);
      const pas = (t) => {
        const k = Math.min(1, (t - t0) / d);
        const e = 1 - Math.pow(1 - k, 3);
        vb = depart.map((v, i) => v + (arrivee[i] - v) * e);
        appliquer();
        if (k < 1) anim = requestAnimationFrame(pas); else anim = null;
      };
      if (d === 0 || racine.matchMedia('(prefers-reduced-motion: reduce)').matches) { vb = arrivee; appliquer(); return; }
      anim = requestAnimationFrame(pas);
    }

    function zoomer(facteur, centre) {
      const c = centre || [vb[0] + vb[2] / 2, vb[1] + vb[3] / 2];
      const l = vb[2] / facteur;
      const ht = vb[3] / facteur;
      animer([c[0] - (c[0] - vb[0]) / facteur, c[1] - (c[1] - vb[1]) / facteur, l, ht], 260);
      void ht;
    }

    /* D'un point de l'écran aux coordonnées de la planche. */
    function versPlanche(px, py) {
      const r = scene.getBoundingClientRect();
      const e = echelle();
      const dx = (r.width - vb[2] * e) / 2;
      const dy = (r.height - vb[3] * e) / 2;
      return [vb[0] + (px - r.left - dx) / e, vb[1] + (py - r.top - dy) / e];
    }

    // ── Gestes ─────────────────────────────────────────────────────────────
    const doigts = new Map();
    let depart = null;
    let aBouge = false;
    let dernierToucher = 0;

    scene.addEventListener('pointerdown', (e) => {
      if (e.button && e.button !== 0) return;
      doigts.set(e.pointerId, [e.clientX, e.clientY]);
      try { scene.setPointerCapture(e.pointerId); } catch (x) { /* rien */ }
      aBouge = false;
      depart = { vb: vb.slice(), pts: Array.from(doigts.values()).map((p) => p.slice()) };
    });
    scene.addEventListener('pointermove', (e) => {
      if (!doigts.has(e.pointerId) || !depart) return;
      doigts.set(e.pointerId, [e.clientX, e.clientY]);
      const pts = Array.from(doigts.values());
      const ech = echelle();
      if (pts.length === 1 && depart.pts.length === 1) {
        const dx = pts[0][0] - depart.pts[0][0];
        const dy = pts[0][1] - depart.pts[0][1];
        if (!aBouge && Math.hypot(dx, dy) < 6) return;
        if (!aBouge && vb[2] >= largeur * 0.98 && Math.abs(dy) > Math.abs(dx) && !o.toujoursDeplacer) {
          // planche entière : un glissé vertical fait défiler la page
          depart = null; return;
        }
        aBouge = true;
        vb = borner([depart.vb[0] - dx / ech, depart.vb[1] - dy / ech, depart.vb[2], depart.vb[3]]);
        appliquer();
      } else if (pts.length >= 2 && depart.pts.length >= 2) {
        aBouge = true;
        const d0 = Math.hypot(depart.pts[0][0] - depart.pts[1][0], depart.pts[0][1] - depart.pts[1][1]);
        const d1 = Math.hypot(pts[0][0] - pts[1][0], pts[0][1] - pts[1][1]);
        const f = d1 / (d0 || 1);
        const m0 = [(depart.pts[0][0] + depart.pts[1][0]) / 2, (depart.pts[0][1] + depart.pts[1][1]) / 2];
        const m1 = [(pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2];
        const vbSauve = vb;
        vb = depart.vb;
        const c = versPlanche(m0[0], m0[1]);
        vb = vbSauve;
        const l = depart.vb[2] / f;
        const ht = depart.vb[3] / f;
        const r = scene.getBoundingClientRect();
        const e2 = Math.min(r.width / l, r.height / ht);
        const ox = (r.width - l * e2) / 2;
        const oy = (r.height - ht * e2) / 2;
        vb = borner([c[0] - (m1[0] - r.left - ox) / e2, c[1] - (m1[1] - r.top - oy) / e2, l, ht]);
        appliquer();
      } else {
        depart = { vb: vb.slice(), pts: pts.map((p) => p.slice()) };
      }
    });
    const fin = (e) => {
      doigts.delete(e.pointerId);
      depart = doigts.size ? { vb: vb.slice(), pts: Array.from(doigts.values()).map((p) => p.slice()) } : null;
      if (e.type === 'pointerup' && !aBouge && doigts.size === 0 && e.pointerType === 'touch') {
        const t = Date.now();
        if (t - dernierToucher < 300) { doubleToucher(e.clientX, e.clientY); dernierToucher = 0; } else dernierToucher = t;
      }
    };
    scene.addEventListener('pointerup', fin);
    scene.addEventListener('pointercancel', fin);
    // un glissé ne doit pas « cliquer » un point
    scene.addEventListener('click', (e) => { if (aBouge) { e.stopPropagation(); e.preventDefault(); aBouge = false; } }, true);
    scene.addEventListener('dblclick', (e) => { e.preventDefault(); doubleToucher(e.clientX, e.clientY); });
    scene.addEventListener('wheel', (e) => {
      if (!e.ctrlKey && !o.molette) return;
      e.preventDefault();
      const c = versPlanche(e.clientX, e.clientY);
      const f = Math.exp(-e.deltaY * 0.0022);
      vb = borner([c[0] - (c[0] - vb[0]) / f, c[1] - (c[1] - vb[1]) / f, vb[2] / f, vb[3] / f]);
      appliquer();
    }, { passive: false });

    function doubleToucher(x, y) {
      const c = versPlanche(x, y);
      if (vb[2] < initial[2] * 0.45) animer(initial); else zoomer(2.2, c);
    }

    // L'échelle suit la taille de l'écran
    const obs = racine.ResizeObserver ? new ResizeObserver(() => { vb = borner(ajuster(vb[2] === initial[2] ? initial : vb)); appliquer(); }) : null;
    if (obs) obs.observe(scene);
    requestAnimationFrame(() => { vb = borner(ajuster(initial)); appliquer(); });

    return {
      element: racineEl,
      svg,
      cadrer(c, duree) { initial = c.slice(); animer(c, duree); },
      toutVoir() { initial = total.slice(); animer(total); },
      zoomer,
      remplacer(nouveau) { scene.replaceChild(nouveau, svg); svg = nouveau; appliquer(); },
      detruire() { if (obs) obs.disconnect(); },
    };
  }

  racine.Visionneuse = { creer };

})(window);
