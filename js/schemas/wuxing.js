'use strict';
/*
 * Les cinq éléments (Wu Xing). Cinq cercles sur un cercle — le Feu en haut,
 * puis Terre, Métal, Eau, Bois dans le sens des aiguilles d'une montre —, et
 * les flèches de quatre cycles qu'on peut afficher tour à tour :
 *   engendrement (Sheng)   chaque élément nourrit le suivant (la mère et le fils)
 *   contrôle (Ke)          chaque élément tempère celui d'après le suivant
 *   surdomination (Cheng)  le contrôle devient excessif
 *   contre-domination (Wu) l'élément contrôlé se retourne contre son contrôleur
 * Toucher un élément affiche ses correspondances.
 */
(function (racine) {

  const { s, h, riche } = Outils;
  const { polaire } = racine.Schemas;

  const ORDRE = ['feu', 'terre', 'metal', 'eau', 'bois'];
  const CORRESP = {
    bois: { saison: 'Printemps', climat: 'Vent', direction: 'Est', couleur: 'Vert', saveur: 'Acide', zang: 'Foie', fu: 'Vésicule biliaire', orifice: 'Yeux', tissu: 'Tendons, ongles', emotion: 'Colère', son: 'Le cri', mouvement: 'Naissance', ame: 'Hun (âme spirituelle)', cereale: 'Blé', meridiens: ['F', 'VB'],
      texte: 'L’énergie qui pousse et s’étend, comme une jeune pousse au printemps. Le Bois a besoin de souplesse et de liberté : contrarié, il se crispe (colère, tensions).' },
    feu: { saison: 'Été', climat: 'Chaleur', direction: 'Sud', couleur: 'Rouge', saveur: 'Amère', zang: 'Cœur, Maître du Cœur', fu: 'Intestin grêle, Triple Réchauffeur', orifice: 'Langue', tissu: 'Vaisseaux', emotion: 'Joie', son: 'Le rire', mouvement: 'Croissance', ame: 'Shen (esprit)', cereale: 'Millet glutineux', meridiens: ['C', 'IG', 'MC', 'TR'],
      texte: 'L’énergie à son apogée, qui rayonne et réchauffe. Le Feu donne la chaleur des relations et la clarté de l’esprit ; en excès, il agite et empêche de dormir.' },
    terre: { saison: 'Fin d’été (et intersaisons)', climat: 'Humidité', direction: 'Centre', couleur: 'Jaune', saveur: 'Douce', zang: 'Rate', fu: 'Estomac', orifice: 'Bouche, lèvres', tissu: 'Chair, muscles', emotion: 'Réflexion, soucis', son: 'Le chant', mouvement: 'Transformation', ame: 'Yi (pensée)', cereale: 'Millet', meridiens: ['RP', 'E'],
      texte: 'Le centre, qui nourrit et transforme. La Terre est le pivot autour duquel tournent les autres éléments ; affaiblie, elle laisse s’accumuler l’humidité et la rumination.' },
    metal: { saison: 'Automne', climat: 'Sécheresse', direction: 'Ouest', couleur: 'Blanc', saveur: 'Piquante', zang: 'Poumon', fu: 'Gros Intestin', orifice: 'Nez', tissu: 'Peau, poils', emotion: 'Tristesse', son: 'Les pleurs', mouvement: 'Récolte', ame: 'Po (âme corporelle)', cereale: 'Riz', meridiens: ['P', 'GI'],
      texte: 'L’énergie qui se condense et se retire, comme les feuilles qui tombent. Le Métal trie, garde l’essentiel et laisse partir le reste ; il a besoin de souffle et de limites claires.' },
    eau: { saison: 'Hiver', climat: 'Froid', direction: 'Nord', couleur: 'Noir, bleu profond', saveur: 'Salée', zang: 'Rein', fu: 'Vessie', orifice: 'Oreilles', tissu: 'Os, moelle, cheveux', emotion: 'Peur', son: 'Le gémissement', mouvement: 'Conservation', ame: 'Zhi (volonté)', cereale: 'Haricots', meridiens: ['R', 'V'],
      texte: 'L’énergie au repos, mise en réserve comme la graine sous la terre en hiver. L’Eau conserve l’Essence, la racine de toute vie ; elle demande sommeil, chaleur et économie.' },
  };

  const CYCLES = {
    sheng: { nom: 'Engendrement', paires: [['bois', 'feu'], ['feu', 'terre'], ['terre', 'metal'], ['metal', 'eau'], ['eau', 'bois']],
      texte: 'Le Bois nourrit le Feu, le Feu produit la Terre (les cendres), la Terre porte le Métal (les minerais), le Métal enrichit l’Eau (les sources), l’Eau fait croître le Bois. Chaque élément est la **mère** du suivant : pour aider un organe faible, on peut tonifier sa mère.' },
    ke: { nom: 'Contrôle', paires: [['bois', 'terre'], ['terre', 'eau'], ['eau', 'feu'], ['feu', 'metal'], ['metal', 'bois']],
      texte: 'Le Bois retient la Terre (les racines tiennent le sol), la Terre endigue l’Eau, l’Eau éteint le Feu, le Feu fait fondre le Métal, le Métal coupe le Bois. Ce contrôle est sain : il empêche tout élément de s’emballer.' },
    cheng: { nom: 'Surdomination', paires: [['bois', 'terre'], ['terre', 'eau'], ['eau', 'feu'], ['feu', 'metal'], ['metal', 'bois']],
      texte: 'Quand un élément est en excès, son contrôle devient écrasant. Exemple classique : le Foie (Bois) stressé « attaque » la Rate et l’Estomac (Terre) — d’où les maux de ventre dus au stress.' },
    wu: { nom: 'Contre-domination', paires: [['terre', 'bois'], ['eau', 'terre'], ['feu', 'eau'], ['metal', 'feu'], ['bois', 'metal']],
      texte: 'Quand le contrôleur s’affaiblit, l’élément contrôlé se retourne contre lui. Exemple : le Foie (Bois) en excès « insulte » le Poumon (Métal) — toux nerveuse, gorge serrée dans la colère.' },
  };

  function wuxing(options) {
    const o = options || {};
    const C = 160;
    const R = 104;
    const r = 34;
    const svg = s('svg', { viewBox: '0 0 320 320', class: 'schema wuxing', role: 'group', 'aria-label': 'Les cinq éléments' });
    const pos = {};
    ORDRE.forEach((e, i) => { pos[e] = polaire(C, C, R, i * 72); });
    const calqueFleches = s('g', { class: 'wx-fleches' });
    svg.appendChild(s('circle', { cx: C, cy: C, r: R, class: 'wx-orbite' }));
    svg.appendChild(calqueFleches);
    const marque = racine.Schemas.fleche(svg, 'wx-pointe');
    const noeuds = {};
    for (const e of ORDRE) {
      const [x, y] = pos[e];
      const g = s('g', { class: 'wx-element el-' + e, tabindex: '0', role: 'button', 'aria-label': MTC.elements[e].nom });
      g.appendChild(s('circle', { cx: x, cy: y, r, class: 'wx-disque' }));
      g.appendChild(s('text', { x, y: y + 3, 'text-anchor': 'middle', class: 'wx-han han' }, MTC.elements[e].hanzi));
      g.appendChild(s('text', { x, y: y + 20, 'text-anchor': 'middle', class: 'wx-nom' }, MTC.elements[e].nom));
      g.addEventListener('click', () => choisirElement(e));
      g.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); choisirElement(e); } });
      svg.appendChild(g);
      noeuds[e] = g;
    }

    function dessinerCycle(id) {
      calqueFleches.textContent = '';
      calqueFleches.setAttribute('class', 'wx-fleches cycle-' + id);
      for (const [a, b] of CYCLES[id].paires) {
        const A = pos[a];
        const B = pos[b];
        let d;
        if (id === 'sheng') {
          // le long du cercle, d'un élément au suivant
          const ia = ORDRE.indexOf(a) * 72;
          const ib = ORDRE.indexOf(b) * 72;
          const debut = ia + 21;
          const fin = (ib < ia ? ib + 360 : ib) - 21;
          const [x1, y1] = polaire(C, C, R, debut);
          const [x2, y2] = polaire(C, C, R, fin);
          d = 'M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + 'A' + R + ' ' + R + ' 0 0 1 ' + x2.toFixed(1) + ' ' + y2.toFixed(1);
        } else {
          // en étoile, à travers le centre
          const v = [B[0] - A[0], B[1] - A[1]];
          const l = Math.hypot(v[0], v[1]);
          const u = [v[0] / l, v[1] / l];
          const p1 = [A[0] + u[0] * (r + 4), A[1] + u[1] * (r + 4)];
          const p2 = [B[0] - u[0] * (r + 6), B[1] - u[1] * (r + 6)];
          d = 'M' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) + 'L' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
        }
        calqueFleches.appendChild(s('path', { d, class: 'wx-fleche', 'marker-end': marque }));
        calqueFleches.appendChild(s('path', { d, class: 'wx-flux' }));
      }
      for (const b of boutonsCycles.children) b.setAttribute('aria-pressed', b.dataset.id === id ? 'true' : 'false');
      texteCycle.textContent = '';
      texteCycle.appendChild(riche(CYCLES[id].texte));
    }

    const detail = h('div', { class: 'panneau-detail', 'aria-live': 'polite' });
    function choisirElement(e) {
      for (const [k, g] of Object.entries(noeuds)) g.classList.toggle('choisi', k === e);
      const c = CORRESP[e];
      detail.textContent = '';
      detail.className = 'panneau-detail el-' + e;
      detail.appendChild(h('h4', null, MTC.elements[e].nom + ' ', h('span', { class: 'item-han' }, MTC.elements[e].hanzi + ' ' + MTC.elements[e].pinyin)));
      detail.appendChild(riche(c.texte));
      const dl = h('dl', { class: 'definition' });
      const lignes = [['Saison', c.saison], ['Climat', c.climat], ['Direction', c.direction], ['Couleur', c.couleur], ['Saveur', c.saveur],
        ['Organe', c.zang], ['Entraille', c.fu], ['S’ouvre dans', c.orifice], ['Tissu', c.tissu], ['Émotion', c.emotion],
        ['Voix', c.son], ['Mouvement', c.mouvement], ['Aspect psychique', c.ame], ['Céréale', c.cereale]];
      for (const [k, v] of lignes) { dl.appendChild(h('dt', null, k)); dl.appendChild(h('dd', null, v)); }
      detail.appendChild(dl);
      const liens = h('div', { class: 'puces' });
      for (const m of c.meridiens) {
        const me = MTC.meridien(m);
        liens.appendChild(h('a', { class: 'puce m-' + m, href: '#/meridien/' + m }, h('span', { class: 'pastille' }), me.nom));
      }
      detail.appendChild(liens);
      if (o.surElement) o.surElement(e);
    }

    const boutonsCycles = h('div', { class: 'puces', role: 'group', 'aria-label': 'Cycle affiché' });
    for (const [id, c] of Object.entries(CYCLES)) {
      boutonsCycles.appendChild(h('button', { type: 'button', class: 'puce', 'data-id': id, onclick: () => dessinerCycle(id) }, c.nom));
    }
    const texteCycle = h('div', { class: 'texte-cycle' });
    const boite = h('div', { class: 'boite-wuxing' }, boutonsCycles, svg, texteCycle, detail);
    dessinerCycle(o.cycle || 'sheng');
    choisirElement(o.element || 'bois');
    return boite;
  }

  racine.Schemas.wuxing = wuxing;
  racine.Schemas.correspondances = CORRESP;

})(window);
