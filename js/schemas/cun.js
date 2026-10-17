'use strict';
/*
 * Mesurer en cun avec ses propres doigts, et petites animations des gestes
 * (cercles, pression, pincement) affichées avec chaque point.
 */
(function (racine) {

  const { s, h } = Outils;

  const MESURES = [
    { id: 'pouce', titre: '1 cun', sous: 'largeur du pouce', doigts: 1, texte: 'La largeur du pouce, à l’articulation (au niveau du pli). C’est la mesure la plus utilisée pour les petites distances.' },
    { id: 'majeur', titre: '1 cun', sous: 'phalange du majeur', doigts: 0, texte: 'Majeur plié, la distance entre les extrémités des deux plis de sa phalange moyenne, côté pouce.' },
    { id: 'deux', titre: '1,5 cun', sous: 'index + majeur', doigts: 2, texte: 'L’index et le majeur serrés, mesurés au niveau de l’articulation du milieu du majeur.' },
    { id: 'quatre', titre: '3 cun', sous: 'quatre doigts', doigts: 4, texte: 'Les quatre doigts serrés (de l’index à l’auriculaire), au niveau de l’articulation du milieu du majeur. Trois doigts (index, majeur, annulaire) font environ 2 cun.' },
  ];

  function doigtVertical(x, y, l, w, classe) {
    return s('rect', { x: x - w / 2, y, width: w, height: l, rx: w / 2, class: classe || 'c-doigt' });
  }

  function mesures() {
    const svg = s('svg', { viewBox: '0 0 360 170', class: 'schema cun', role: 'group', 'aria-label': 'Mesurer en cun avec les doigts' });
    const panneaux = [];
    MESURES.forEach((m, i) => {
      const x0 = 10 + i * 88;
      const g = s('g', { class: 'c-panneau', tabindex: '0', role: 'button', 'aria-label': m.titre + ', ' + m.sous });
      g.appendChild(s('rect', { x: x0, y: 4, width: 80, height: 162, rx: 12, class: 'c-fond' }));
      const cx = x0 + 40;
      if (m.id === 'pouce') {
        g.appendChild(doigtVertical(cx, 26, 96, 26));
        g.appendChild(s('path', { d: 'M' + (cx - 9) + ' 74h18', class: 'c-pli' }));
        g.appendChild(s('rect', { x: cx - 8, y: 30, width: 16, height: 14, rx: 6, class: 'c-ongle' }));
        g.appendChild(s('path', { d: 'M' + (cx - 13) + ' 74v-8M' + (cx + 13) + ' 74v-8M' + (cx - 13) + ' 70h26', class: 'c-mesure' }));
      } else if (m.id === 'majeur') {
        g.appendChild(s('path', { d: 'M' + (cx - 10) + ' 130V70a10 10 0 0 1 10-10h22', class: 'c-doigt-trait' }));
        g.appendChild(s('path', { d: 'M' + (cx + 10) + ' 130V84h12', class: 'c-doigt-trait' }));
        g.appendChild(s('path', { d: 'M' + (cx - 10) + ' 98h20M' + (cx - 10) + ' 72h0', class: 'c-pli' }));
        g.appendChild(s('path', { d: 'M' + (cx - 18) + ' 72v26M' + (cx - 22) + ' 72h8M' + (cx - 22) + ' 98h8', class: 'c-mesure' }));
      } else {
        const n = m.doigts;
        const w = 15;
        const debut = cx - (n * w) / 2 + w / 2;
        const longueurs = [70, 80, 74, 58];
        for (let k = 0; k < n; k += 1) {
          const l = n === 2 ? [72, 80][k] : longueurs[k];
          g.appendChild(doigtVertical(debut + k * w, 112 - l, l + 30, w - 1.2));
        }
        g.appendChild(s('path', { d: 'M' + (cx - (n * w) / 2) + ' 80h' + (n * w), class: 'c-pli' }));
        g.appendChild(s('path', { d: 'M' + (cx - (n * w) / 2) + ' 84v-10M' + (cx + (n * w) / 2) + ' 84v-10M' + (cx - (n * w) / 2) + ' 79h' + (n * w), class: 'c-mesure' }));
      }
      g.appendChild(s('text', { x: cx, y: 150, 'text-anchor': 'middle', class: 'c-titre' }, m.titre));
      g.appendChild(s('text', { x: cx, y: 162, 'text-anchor': 'middle', class: 'c-sous' }, m.sous));
      g.addEventListener('click', () => choisir(i));
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choisir(i); } });
      svg.appendChild(g);
      panneaux.push(g);
    });
    const texte = h('div', { class: 'panneau-detail', 'aria-live': 'polite' });
    function choisir(i) {
      panneaux.forEach((g, k) => g.classList.toggle('choisi', k === i));
      texte.textContent = '';
      texte.appendChild(h('h4', null, MESURES[i].titre + ' — ' + MESURES[i].sous));
      texte.appendChild(h('p', null, MESURES[i].texte));
    }
    choisir(0);
    return h('div', null, svg, texte);
  }

  /* Le geste, en petite animation : 'cercles', 'pression', 'pincer', 'paume'. */
  function geste(type) {
    const svg = s('svg', { viewBox: '0 0 64 64', class: 'geste', 'aria-hidden': 'true' });
    svg.appendChild(s('circle', { cx: 32, cy: 32, r: 18, class: 't-cercle' }));
    svg.appendChild(s('circle', { cx: 32, cy: 32, r: 3.5, class: 't-centre' }));
    if (type === 'pincer') {
      const g = s('g', { class: 'anim-pression' });
      g.appendChild(s('path', { d: 'M14 20q10 12 0 24', class: 't-pince' }));
      g.appendChild(s('path', { d: 'M50 20q-10 12 0 24', class: 't-pince' }));
      svg.appendChild(g);
    } else if (type === 'pression') {
      svg.appendChild(s('circle', { cx: 32, cy: 32, r: 11, class: 't-doigt anim-pression' }));
    } else if (type === 'paume') {
      svg.appendChild(s('circle', { cx: 32, cy: 32, r: 22, class: 't-paume anim-pression' }));
    } else {
      const g = s('g', { class: 'anim-doigt' });
      g.appendChild(s('circle', { cx: 32, cy: 18, r: 7, class: 't-doigt' }));
      svg.appendChild(g);
    }
    return svg;
  }

  /* Le type de geste d'après le texte de la technique. */
  function typeDeGeste(technique) {
    const t = Outils.normaliser(technique);
    if (/pincez|pincer|ongle/.test(t)) return 'pincer';
    if (/paume pose|main posee|on n.y appuie pas|bouillotte|paume, immobile|posez la paume/.test(t)) return 'paume';
    if (/maintenue|statique/.test(t) && !/cercle/.test(t)) return 'pression';
    return 'cercles';
  }

  racine.Schemas.mesuresCun = mesures;
  racine.Schemas.geste = geste;
  racine.Schemas.typeDeGeste = typeDeGeste;

})(window);
