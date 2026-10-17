'use strict';
/*
 * Le Yin et le Yang : le taiji qui tourne lentement, et les quatre façons
 * dont l'équilibre se rompt — excès de l'un, ou vide de l'autre. Les barres
 * s'animent quand on choisit un état.
 */
(function (racine) {

  const { s, h, riche } = Outils;

  function taiji(options) {
    const o = options || {};
    const R = 100;
    const c = 120;
    const svg = s('svg', { viewBox: '0 0 240 240', class: 'schema taiji' + (o.petit ? ' petit' : ''), role: 'img', 'aria-label': 'Le symbole du Yin et du Yang' });
    const g = s('g', { class: 'taiji-tourne' });
    g.appendChild(s('circle', { cx: c, cy: c, r: R, class: 'taiji-yang' }));
    g.appendChild(s('path', { class: 'taiji-yin', d: 'M' + c + ' ' + (c - R) + 'A' + R + ' ' + R + ' 0 0 1 ' + c + ' ' + (c + R) + 'A' + (R / 2) + ' ' + (R / 2) + ' 0 0 1 ' + c + ' ' + c + 'A' + (R / 2) + ' ' + (R / 2) + ' 0 0 0 ' + c + ' ' + (c - R) + 'Z' }));
    g.appendChild(s('circle', { cx: c, cy: c - R / 2, r: 13, class: 'taiji-yin' }));
    g.appendChild(s('circle', { cx: c, cy: c + R / 2, r: 13, class: 'taiji-yang' }));
    g.appendChild(s('circle', { cx: c, cy: c, r: R, class: 'taiji-bord' }));
    svg.appendChild(g);
    return svg;
  }

  const ETATS = [
    { id: 'equilibre', nom: 'Équilibre', yin: 50, yang: 50,
      texte: 'Le Yin et le Yang se tiennent mutuellement : la chaleur est tempérée par la fraîcheur, l’activité par le repos. C’est la santé — un équilibre **mouvant**, qui oscille au fil des heures et des saisons.' },
    { id: 'plein-yang', nom: 'Excès de Yang', yin: 50, yang: 82,
      texte: 'Le Yang est en trop : **chaleur-plénitude**. Fièvre forte, visage rouge, soif de boissons fraîches, agitation, constipation, langue rouge à enduit jaune, pouls rapide et fort. On rafraîchit, on disperse.' },
    { id: 'plein-yin', nom: 'Excès de Yin', yin: 82, yang: 50,
      texte: 'Le Yin est en trop : **froid-plénitude**. Frissons, douleurs vives améliorées par la chaleur, crampes abdominales, selles liquides, langue pâle à enduit blanc, pouls lent et tendu. On réchauffe, on chasse le froid.' },
    { id: 'vide-yin', nom: 'Vide de Yin', yin: 26, yang: 50,
      texte: 'Le Yin manque : le Yang, devenu relativement fort, produit une **chaleur-vide**. Bouffées de chaleur l’après-midi ou la nuit, sueurs nocturnes, paumes et plantes chaudes, bouche sèche, langue rouge sans enduit, pouls fin et rapide. On nourrit le Yin plutôt que de rafraîchir.' },
    { id: 'vide-yang', nom: 'Vide de Yang', yin: 50, yang: 26,
      texte: 'Le Yang manque : c’est un **froid-vide**. Frilosité, mains et pieds froids, fatigue, envie de chaleur et de se couvrir, urines claires et abondantes, langue pâle et gonflée, pouls faible et lent. On tonifie et on réchauffe doucement.' },
  ];

  /* Les quatre états de déséquilibre, en barres animées. */
  function etats() {
    const s_ = s;
    const svg = s_('svg', { viewBox: '0 0 220 150', class: 'schema barres-yy', role: 'img', 'aria-label': 'Niveau du Yin et du Yang' });
    svg.appendChild(s_('line', { x1: 20, y1: 130, x2: 200, y2: 130, class: 'yy-sol' }));
    svg.appendChild(s_('line', { x1: 20, y1: 65, x2: 200, y2: 65, class: 'yy-norme' }));
    svg.appendChild(s_('text', { x: 200, y: 60, 'text-anchor': 'end', class: 'yy-legende' }, 'niveau normal'));
    const barreYin = s_('rect', { x: 50, y: 0, width: 46, height: 130, rx: 6, class: 'yy-yin' });
    const barreYang = s_('rect', { x: 124, y: 0, width: 46, height: 130, rx: 6, class: 'yy-yang' });
    svg.appendChild(barreYin); svg.appendChild(barreYang);
    svg.appendChild(s_('text', { x: 73, y: 145, 'text-anchor': 'middle', class: 'yy-nom' }, 'Yin'));
    svg.appendChild(s_('text', { x: 147, y: 145, 'text-anchor': 'middle', class: 'yy-nom' }, 'Yang'));
    const texte = h('div', { class: 'panneau-detail', 'aria-live': 'polite' });
    const boutons = h('div', { class: 'puces', role: 'group', 'aria-label': 'Choisir un état' });
    function choisir(e) {
      // hauteur par une mise à l'échelle verticale, ancrée en bas : elle s'anime en CSS
      barreYin.style.setProperty('transform', 'scaleY(' + (e.yin / 100) + ')');
      barreYang.style.setProperty('transform', 'scaleY(' + (e.yang / 100) + ')');
      texte.textContent = '';
      texte.appendChild(h('h4', null, e.nom));
      texte.appendChild(riche(e.texte));
      for (const b of boutons.children) b.setAttribute('aria-pressed', b.dataset.id === e.id ? 'true' : 'false');
    }
    for (const e of ETATS) boutons.appendChild(h('button', { type: 'button', class: 'puce', 'data-id': e.id, onclick: () => choisir(e) }, e.nom));
    const boite = h('div', null, boutons, svg, texte);
    choisir(ETATS[0]);
    return boite;
  }

  racine.Schemas.taiji = taiji;
  racine.Schemas.etatsYinYang = etats;

})(window);
