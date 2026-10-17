'use strict';
/*
 * L'horloge des méridiens. Selon la MTC, le Qi parcourt les douze méridiens
 * en vingt-quatre heures et passe deux heures dans chacun à son maximum :
 * le Poumon de 3 h à 5 h, le Gros Intestin de 5 h à 7 h… L'organe opposé sur
 * le cadran (douze heures plus tard) est alors à son minimum.
 *
 * Le cadran tourne avec l'heure réelle ; toucher un secteur le choisit.
 */
(function (racine) {

  const { s } = Outils;
  const { polaire, secteur } = racine.Schemas;
  const C = 170;

  function angleHeure(h) { return (h / 24) * 360; }

  function horloge(options) {
    const o = options || {};
    const svg = s('svg', { viewBox: '0 0 340 340', class: 'schema horloge' + (o.mini ? ' mini' : ''), role: o.mini ? 'img' : 'group', 'aria-label': 'Horloge des méridiens' });
    // jour et nuit
    svg.appendChild(s('path', { class: 'h-jour', d: secteur(C, C, 98, 104, angleHeure(6), angleHeure(18)) }));
    svg.appendChild(s('path', { class: 'h-nuit', d: secteur(C, C, 98, 104, angleHeure(18), angleHeure(30)) }));
    const secteurs = {};
    for (const m of MTC.meridiens) {
      if (!m.heures) continue;
      const [a, b] = m.heures;
      const a1 = angleHeure(a);
      const a2 = angleHeure(b < a ? b + 24 : b);
      const g = s('g', { class: 'h-secteur m-' + m.id, 'data-id': m.id });
      g.appendChild(s('path', { class: 'h-fond', d: secteur(C, C, 108, 148, a1 + 0.6, a2 - 0.6) }));
      const [tx, ty] = polaire(C, C, 128, (a1 + a2) / 2);
      g.appendChild(s('text', { class: 'h-code', x: tx, y: ty + 5, 'text-anchor': 'middle' }, Notation.meridien(m.id)));
      if (!o.mini) {
        g.setAttribute('tabindex', '0');
        g.setAttribute('role', 'button');
        g.setAttribute('aria-label', m.nom + ', de ' + a + ' h à ' + b + ' h');
        g.addEventListener('click', () => choisir(m.id));
        g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choisir(m.id); } });
      }
      svg.appendChild(g);
      secteurs[m.id] = g;
    }
    if (!o.mini) {
      for (let h = 1; h < 24; h += 2) {
        const [x, y] = polaire(C, C, 159, angleHeure(h));
        svg.appendChild(s('text', { class: 'h-heure', x, y: y + 4, 'text-anchor': 'middle' }, h + ' h'));
      }
      const [sx, sy] = polaire(C, C, 88, angleHeure(12));
      const [lx, ly] = polaire(C, C, 88, angleHeure(0));
      svg.appendChild(s('text', { class: 'h-astre', x: sx, y: sy + 4, 'text-anchor': 'middle' }, 'midi'));
      svg.appendChild(s('text', { class: 'h-astre', x: lx, y: ly + 4, 'text-anchor': 'middle' }, 'minuit'));
    }
    const aiguille = s('g', { class: 'h-aiguille' });
    // l'aiguille ne traverse pas le cadran : elle part du bord du centre
    aiguille.appendChild(s('line', { x1: C, y1: C - (o.mini ? 0 : 74), x2: C, y2: C - 150 }));
    aiguille.appendChild(s('circle', { cx: C, cy: C - 150, r: 5 }));
    if (o.mini) aiguille.appendChild(s('circle', { cx: C, cy: C, r: 6, class: 'h-moyeu' }));
    svg.appendChild(aiguille);
    const centre = s('g', { class: 'h-centre' });
    const tHeure = s('text', { x: C, y: C - 14, 'text-anchor': 'middle', class: 'h-t-heure' });
    const tNom = s('text', { x: C, y: C + 14, 'text-anchor': 'middle', class: 'h-t-nom' });
    const tSous = s('text', { x: C, y: C + 34, 'text-anchor': 'middle', class: 'h-t-sous' });
    centre.appendChild(tHeure); centre.appendChild(tNom); centre.appendChild(tSous);
    if (!o.mini) svg.appendChild(centre);

    let choisi = o.selection || null;
    function choisir(id) {
      choisi = id;
      for (const [k, g] of Object.entries(secteurs)) {
        g.classList.toggle('choisi', k === id);
      }
      if (o.surChoix) o.surChoix(id);
    }

    function maj(date) {
      const d = date || new Date();
      const h = d.getHours() + d.getMinutes() / 60;
      aiguille.setAttribute('transform', 'rotate(' + angleHeure(h).toFixed(2) + ' ' + C + ' ' + C + ')');
      const actif = MTC.meridienDeLHeure(h);
      for (const [k, g] of Object.entries(secteurs)) {
        g.classList.toggle('actif', actif && k === actif.id);
      }
      if (actif && !o.mini) {
        tHeure.textContent = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
        tNom.textContent = actif.nom;
        tSous.textContent = actif.heures[0] + ' h – ' + actif.heures[1] + ' h';
      }
      return actif;
    }
    maj(o.date);
    if (choisi) choisir(choisi);
    let minuterie = null;
    if (!o.fige) minuterie = setInterval(() => { if (document.body.contains(svg)) maj(); else clearInterval(minuterie); }, 30000);
    return { element: svg, maj, choisir, arreter() { clearInterval(minuterie); } };
  }

  racine.Schemas.horloge = horloge;

})(window);
