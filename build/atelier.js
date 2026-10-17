'use strict';
/* Atelier : toutes les planches, tous les tracés, tous les points étiquetés,
 * sur un quadrillage, pour caler les coordonnées à l'œil.
 *   ?p=corps-face,corps-dos   planches à montrer (défaut : toutes)
 *   ?m=P,GI                   méridiens à tracer (défaut : tous)
 *   ?l=900                    largeur d'affichage
 *   ?q=0                      sans quadrillage
 *   ?g=GI4                    montrer les repères de ce point
 */
(function () {
  const params = new URLSearchParams(location.search);
  const choix = params.get('p') ? params.get('p').split(',') : null;
  const merid = params.get('m') === 'aucun' ? [] : params.get('m') ? params.get('m').split(',') : true;
  const sansPoints = params.get('pts') === '0';
  const largeur = params.get('l') || '700';
  const quadrillage = params.get('q') !== '0';
  const guide = params.get('g');
  const theme = params.get('theme');
  if (theme) document.documentElement.dataset.theme = theme;

  const planches = [Corps.planche('face'), Corps.planche('dos')];
  if (window.Regions) for (const id of Regions.liste()) planches.push(Regions.planche(id));

  document.getElementById('barre').textContent = planches.map((p) => p.id).join(' · ');
  const grille = document.getElementById('grille');
  for (const pl of planches) {
    if (choix && !choix.includes(pl.id)) continue;
    const fig = document.createElement('figure');
    fig.className = 'grand';
    fig.style.setProperty('--l', largeur + 'px');
    const cap = document.createElement('figcaption');
    cap.textContent = pl.id + ' — ' + (pl.titre || '');
    fig.appendChild(cap);
    const ids = sansPoints ? [] : Object.keys(pl.points);
    const svg = Planche.dessiner(pl, {
      meridiens: merid, points: ids, etiquettes: true, animer: false,
      actif: guide || null, guides: !!guide,
    });
    if (quadrillage) {
      const NS = 'http://www.w3.org/2000/svg';
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'quadrillage');
      for (let x = 0; x <= pl.largeur; x += 20) {
        const l = document.createElementNS(NS, 'line');
        l.setAttribute('x1', x); l.setAttribute('x2', x); l.setAttribute('y1', 0); l.setAttribute('y2', pl.hauteur);
        g.appendChild(l);
        if (x % 100 === 0) { const t = document.createElementNS(NS, 'text'); t.setAttribute('x', x + 1); t.setAttribute('y', 8); t.textContent = x; g.appendChild(t); }
      }
      for (let y = 0; y <= pl.hauteur; y += 20) {
        const l = document.createElementNS(NS, 'line');
        l.setAttribute('y1', y); l.setAttribute('y2', y); l.setAttribute('x1', 0); l.setAttribute('x2', pl.largeur);
        g.appendChild(l);
        if (y % 100 === 0) { const t = document.createElementNS(NS, 'text'); t.setAttribute('x', 1); t.setAttribute('y', y - 1); t.textContent = y; g.appendChild(t); }
      }
      svg.insertBefore(g, svg.firstChild.nextSibling);
    }
    fig.appendChild(svg);
    grille.appendChild(fig);
    const echelle = parseFloat(largeur) / pl.largeur;
    svg.style.setProperty('--echelle', String(echelle));
  }
})();
