'use strict';
/* Outils communs aux schémas : coordonnées polaires, secteurs d'anneau. */
(function (racine) {

  const Schemas = racine.Schemas = racine.Schemas || {};

  /* Angle en degrés, 0 en haut, dans le sens des aiguilles d'une montre. */
  Schemas.polaire = (cx, cy, r, deg) => {
    const a = (deg - 90) * Math.PI / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };

  /* Un secteur d'anneau entre deux angles et deux rayons. */
  Schemas.secteur = (cx, cy, r1, r2, a1, a2) => {
    const P = Schemas.polaire;
    const grand = (a2 - a1) % 360 > 180 ? 1 : 0;
    const [x1, y1] = P(cx, cy, r2, a1);
    const [x2, y2] = P(cx, cy, r2, a2);
    const [x3, y3] = P(cx, cy, r1, a2);
    const [x4, y4] = P(cx, cy, r1, a1);
    const f = (v) => v.toFixed(2);
    return 'M' + f(x1) + ' ' + f(y1) + 'A' + r2 + ' ' + r2 + ' 0 ' + grand + ' 1 ' + f(x2) + ' ' + f(y2)
      + 'L' + f(x3) + ' ' + f(y3) + 'A' + r1 + ' ' + r1 + ' 0 ' + grand + ' 0 ' + f(x4) + ' ' + f(y4) + 'Z';
  };

  /* Un arc ouvert, pour les flèches des cycles. */
  Schemas.arc = (cx, cy, r, a1, a2) => {
    const P = Schemas.polaire;
    const [x1, y1] = P(cx, cy, r, a1);
    const [x2, y2] = P(cx, cy, r, a2);
    const grand = (a2 - a1) % 360 > 180 ? 1 : 0;
    return 'M' + x1.toFixed(2) + ' ' + y1.toFixed(2) + 'A' + r + ' ' + r + ' 0 ' + grand + ' 1 ' + x2.toFixed(2) + ' ' + y2.toFixed(2);
  };

  /* Une figure encadrée, avec légende. */
  Schemas.figure = (contenu, legende) => Outils.h('figure', { class: 'cadre-figure' }, contenu, legende ? Outils.h('figcaption', null, legende) : null);

  /* Une marque de flèche, propre à chaque schéma (les identifiants doivent
   * être uniques dans la page). */
  let compteur = 0;
  Schemas.fleche = (svg, classe) => {
    compteur += 1;
    const id = 'fl-' + compteur;
    const s = Outils.s;
    const defs = svg.querySelector('defs') || svg.insertBefore(s('defs'), svg.firstChild);
    defs.appendChild(s('marker', { id, viewBox: '0 0 10 10', refX: '7', refY: '5', markerWidth: '7', markerHeight: '7', orient: 'auto-start-reverse' },
      s('path', { d: 'M0 0L10 5L0 10Z', class: classe || 'pointe' })));
    return 'url(#' + id + ')';
  };

})(window);
