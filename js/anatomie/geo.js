'use strict';
/*
 * Géométrie des planches.
 *
 * Toutes les planches (le corps entier comme les vues de détail) se dessinent
 * à partir de quelques axes — le bras, l'avant-bras, un métacarpien — et de
 * points placés le long de ces axes : « à tant de l'origine, à tant du côté ».
 * Placer un point « à 2 cun du pli du poignet, entre les deux tendons » se dit
 * alors comme on le dit en acupuncture, et le point suit si l'axe bouge.
 */
(function (racine) {

  /* Un axe de A vers B : u le long de l'axe, n perpendiculaire (u tourné d'un
   * quart de tour dans le sens inverse des aiguilles, à l'écran). */
  function axe(A, B) {
    const dx = B[0] - A[0];
    const dy = B[1] - A[1];
    const l = Math.hypot(dx, dy);
    const u = [dx / l, dy / l];
    return { A, B, l, u, n: [u[1], -u[0]] };
  }

  /* Le point à s le long de l'axe et à o sur le côté. */
  function sur(ax, s, o) {
    return [ax.A[0] + ax.u[0] * s + ax.n[0] * (o || 0), ax.A[1] + ax.u[1] * s + ax.n[1] * (o || 0)];
  }

  function lerp(a, b, t) {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  }

  /* La direction de l'axe, inclinée de `deg` degrés vers son côté n. */
  function incline(ax, deg) {
    const r = deg * Math.PI / 180;
    const c = Math.cos(r);
    const s = Math.sin(r);
    return [ax.u[0] * c + ax.n[0] * s, ax.u[1] * c + ax.n[1] * s];
  }

  function arrondi(v) { return Math.round(v * 10) / 10; }
  function pt(p) { return arrondi(p[0]) + ' ' + arrondi(p[1]); }

  /* Une courbe lisse qui passe par tous les points (Catmull-Rom). Un point
   * suivi de `true` en troisième valeur fait un angle : la courbe y arrive et
   * en repart sans l'arrondir. */
  function lisse(points, ferme) {
    const n = points.length;
    if (n < 2) return '';
    const P = (i) => (ferme ? points[(i + n) % n] : points[Math.max(0, Math.min(n - 1, i))]);
    let d = 'M' + pt(points[0]);
    const fin = ferme ? n : n - 1;
    for (let i = 0; i < fin; i += 1) {
      const p1 = P(i);
      const p2 = P(i + 1);
      const p0 = p1[2] ? p1 : P(i - 1);
      const p3 = p2[2] ? p2 : P(i + 2);
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += 'C' + pt(c1) + ' ' + pt(c2) + ' ' + pt(p2);
    }
    return d + (ferme ? 'Z' : '');
  }

  function polygone(points) {
    return 'M' + points.map(pt).join('L') + 'Z';
  }

  function ligne(points) {
    return 'M' + points.map(pt).join('L');
  }

  /* Un doigt : un rectangle à bout rond, de la base B dans la direction v. */
  function capsule(B, v, longueur, largeur) {
    const n = [v[1], -v[0]];
    const r = largeur / 2;
    const T = [B[0] + v[0] * (longueur - r), B[1] + v[1] * (longueur - r)];
    const points = [[B[0] + n[0] * r, B[1] + n[1] * r]];
    for (let k = 0; k <= 10; k += 1) {
      const a = Math.PI * k / 10;
      const c = Math.cos(a);
      const s = Math.sin(a);
      points.push([T[0] + n[0] * r * c + v[0] * r * s, T[1] + n[1] * r * c + v[1] * r * s]);
    }
    points.push([B[0] - n[0] * r, B[1] - n[1] * r]);
    return points;
  }

  /* Une ellipse en chemin, éventuellement inclinée. */
  function ellipse(cx, cy, rx, ry, deg) {
    const pts = [];
    const r = (deg || 0) * Math.PI / 180;
    for (let k = 0; k < 24; k += 1) {
      const a = 2 * Math.PI * k / 24;
      const x = rx * Math.cos(a);
      const y = ry * Math.sin(a);
      pts.push([cx + x * Math.cos(r) - y * Math.sin(r), cy + x * Math.sin(r) + y * Math.cos(r)]);
    }
    return lisse(pts, true);
  }

  /* Longueur d'une ligne brisée. */
  function longueur(points) {
    let l = 0;
    for (let i = 1; i < points.length; i += 1) l += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
    return l;
  }

  racine.Geo = { axe, sur, lerp, incline, lisse, polygone, ligne, capsule, ellipse, longueur, arrondi, pt };

})(window);
