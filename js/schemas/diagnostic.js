'use strict';
/*
 * Deux outils du diagnostic chinois, en schémas qu'on manipule :
 *   la langue   la carte de ses zones (chaque région reflète des organes), et
 *               ce que disent sa couleur, son enduit et sa forme ;
 *   le pouls    les trois positions sous les trois doigts, à chaque poignet,
 *               et les qualités de pouls les plus courantes.
 */
(function (racine) {

  const { s, h, riche } = Outils;
  let compteur = 0;

  // ── La langue ────────────────────────────────────────────────────────────
  const ZONES = {
    racine: { nom: 'La racine', organes: 'Reins, Vessie, intestins', texte: 'Le fond de la langue reflète le Réchauffeur inférieur. Un enduit épais à la racine signale souvent une stagnation dans les intestins ou de l’humidité dans le bas du corps.' },
    cotes: { nom: 'Les bords', organes: 'Foie, Vésicule biliaire', texte: 'Des bords rouges évoquent une chaleur du Foie (stress, irritabilité) ; des bords violacés, une stase de Sang ; des bords ondulés par l’empreinte des dents, un vide de Qi de la Rate.' },
    centre: { nom: 'Le centre', organes: 'Rate, Estomac', texte: 'Le centre correspond au Réchauffeur moyen. Un enduit épais ou une fissure centrale y parlent de la digestion : humidité, faiblesse de l’Estomac, sécheresse.' },
    poumon: { nom: 'L’avant', organes: 'Poumon', texte: 'Juste en arrière de la pointe : le Poumon. Des petits points rouges à cet endroit accompagnent souvent un rhume avec chaleur ou une irritation des voies respiratoires.' },
    pointe: { nom: 'La pointe', organes: 'Cœur', texte: 'La pointe reflète le Cœur et l’Esprit. Une pointe rouge, parfois piquetée, accompagne l’agitation, l’anxiété, les nuits difficiles.' },
  };
  const COULEURS = {
    normal: { nom: 'Rose clair', classe: 'l-rose', texte: 'Rose clair, humide, légèrement brillante, avec un enduit fin et blanc : c’est la langue d’une personne en bonne santé.' },
    pale: { nom: 'Pâle', classe: 'l-pale', texte: 'Pâle : vide de Sang (plutôt sèche) ou vide de Yang (plutôt humide et gonflée). Fatigue, frilosité, teint terne vont souvent avec.' },
    rouge: { nom: 'Rouge', classe: 'l-rouge', texte: 'Rouge : chaleur. Avec un enduit jaune, c’est une chaleur-plénitude ; sans enduit, une chaleur-vide par manque de Yin.' },
    violacee: { nom: 'Violacée', classe: 'l-violacee', texte: 'Violacée : stase du Sang, souvent avec des douleurs fixes et piquantes. Bleu-violet et humide : froid ; rouge-violet et sèche : chaleur.' },
  };
  const ENDUITS = {
    fin: { nom: 'Fin et blanc', classe: 'e-fin', texte: 'Un enduit fin et blanc, à travers lequel on voit la langue : normal. Il naît de l’activité de l’Estomac.' },
    epais: { nom: 'Blanc épais', classe: 'e-epais', texte: 'Épais et blanc : humidité ou mucosités, ou un froid qui stagne. Fréquent après des excès de laitages, de sucre, de cru.' },
    jaune: { nom: 'Jaune', classe: 'e-jaune', texte: 'Jaune : chaleur. Jaune et gras : humidité-chaleur (digestion lourde, peau grasse, urines foncées).' },
    absent: { nom: 'Absent', classe: 'e-absent', texte: 'Pelé, sans enduit, ou par plaques (« langue géographique ») : l’Estomac manque de Yin, les liquides s’épuisent.' },
  };
  const FORMES = {
    normale: { nom: 'Normale', texte: 'Ni trop épaisse, ni trop fine, souple et mobile.' },
    gonflee: { nom: 'Gonflée, dentelée', texte: 'Gonflée, avec l’empreinte des dents sur les bords : vide de Qi de la Rate, rétention de liquides.' },
    mince: { nom: 'Mince', texte: 'Mince : vide de Sang (si pâle) ou de Yin (si rouge).' },
    fissuree: { nom: 'Fissurée', texte: 'Fissures : manque de liquides, vide de Yin ; une fissure au centre parle de l’Estomac. Certaines fissures sont de naissance et sans signification.' },
  };

  function langue() {
    compteur += 1;
    const idClip = 'clip-langue-' + compteur;
    const svg = s('svg', { viewBox: '0 0 240 300', class: 'schema langue', role: 'group', 'aria-label': 'Carte de la langue' });
    const contour = 'M38 46C38 18 202 18 202 46C216 118 206 208 168 254C146 282 94 282 72 254C34 208 24 118 38 46Z';
    const defs = s('defs');
    defs.appendChild(s('clipPath', { id: idClip }, s('path', { d: contour })));
    svg.appendChild(defs);
    const corps = s('g', { class: 'l-corps l-rose' });
    corps.appendChild(s('path', { d: contour, class: 'l-chair' }));
    const enduit = s('ellipse', { cx: 120, cy: 120, rx: 58, ry: 78, class: 'l-enduit e-fin', 'clip-path': 'url(#' + idClip + ')' });
    corps.appendChild(enduit);
    const fissures = s('g', { class: 'l-fissures', hidden: '' });
    fissures.appendChild(s('path', { d: 'M120 70L118 110L122 150L119 190' }));
    fissures.appendChild(s('path', { d: 'M119 110L100 124M121 140L142 152M118 170L104 180' }));
    corps.appendChild(fissures);
    const dents = s('g', { class: 'l-dents', hidden: '' });
    for (let i = 0; i < 6; i += 1) {
      const y = 80 + i * 26;
      dents.appendChild(s('path', { d: 'M' + (44 + i * 2.6) + ' ' + y + 'q7 6 0 12' }));
      dents.appendChild(s('path', { d: 'M' + (196 - i * 2.6) + ' ' + y + 'q-7 6 0 12' }));
    }
    corps.appendChild(dents);
    corps.appendChild(s('path', { d: 'M120 40L120 225', class: 'l-sillon' }));
    svg.appendChild(corps);
    // zones cliquables
    const calque = s('g', { class: 'l-zones', 'clip-path': 'url(#' + idClip + ')' });
    const formesZones = {
      racine: [s('rect', { x: 0, y: 0, width: 240, height: 92 })],
      cotes: [s('rect', { x: 0, y: 92, width: 74, height: 132 }), s('rect', { x: 166, y: 92, width: 74, height: 132 })],
      centre: [s('rect', { x: 74, y: 92, width: 92, height: 106 })],
      poumon: [s('rect', { x: 74, y: 198, width: 92, height: 34 })],
      pointe: [s('rect', { x: 0, y: 224, width: 240, height: 80 })],
    };
    const etiquettes = { racine: [120, 66], cotes: [56, 158], centre: [120, 150], poumon: [120, 218], pointe: [120, 254] };
    const groupes = {};
    for (const [id, formes] of Object.entries(formesZones)) {
      const g = s('g', { class: 'l-zone', tabindex: '0', role: 'button', 'aria-label': ZONES[id].nom + ' : ' + ZONES[id].organes });
      for (const f of formes) g.appendChild(f);
      g.addEventListener('click', () => choisirZone(id));
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choisirZone(id); } });
      calque.appendChild(g);
      groupes[id] = g;
    }
    svg.appendChild(calque);
    svg.appendChild(s('path', { d: contour, class: 'l-bord' }));
    for (const [id, [x, y]] of Object.entries(etiquettes)) {
      const noms = { racine: 'Reins', cotes: 'Foie', centre: 'Rate · Estomac', poumon: 'Poumon', pointe: 'Cœur' };
      svg.appendChild(s('text', { x, y, 'text-anchor': 'middle', class: 'l-etiquette' }, noms[id]));
      if (id === 'cotes') svg.appendChild(s('text', { x: 184, y, 'text-anchor': 'middle', class: 'l-etiquette' }, 'VB'));
    }

    const panneau = h('div', { class: 'panneau-detail', 'aria-live': 'polite' });
    function montrer(titre, texte) {
      panneau.textContent = '';
      panneau.appendChild(h('h4', null, titre));
      panneau.appendChild(riche(texte));
    }
    function choisirZone(id) {
      for (const [k, g] of Object.entries(groupes)) g.classList.toggle('choisi', k === id);
      montrer(ZONES[id].nom + ' — ' + ZONES[id].organes, ZONES[id].texte);
    }
    function rangee(titre, table, appliquer) {
      const r = h('div', { class: 'puces', role: 'group', 'aria-label': titre }, h('span', { class: 'discret petit' }, titre + ' :'));
      for (const [id, v] of Object.entries(table)) {
        r.appendChild(h('button', {
          type: 'button', class: 'puce', 'data-id': id, onclick: () => {
            for (const b of r.querySelectorAll('button')) b.setAttribute('aria-pressed', b.dataset.id === id ? 'true' : 'false');
            appliquer(id);
            montrer(titre + ' : ' + v.nom.toLowerCase(), v.texte);
          },
        }, v.nom));
      }
      r.querySelector('button').setAttribute('aria-pressed', 'true');
      return r;
    }
    const couleur = rangee('Couleur', COULEURS, (id) => { corps.setAttribute('class', 'l-corps ' + COULEURS[id].classe); });
    const enduits = rangee('Enduit', ENDUITS, (id) => { enduit.setAttribute('class', 'l-enduit ' + ENDUITS[id].classe); });
    const formes = rangee('Forme', FORMES, (id) => {
      if (id === 'fissuree') fissures.removeAttribute('hidden'); else fissures.setAttribute('hidden', '');
      if (id === 'gonflee') dents.removeAttribute('hidden'); else dents.setAttribute('hidden', '');
      corps.setAttribute('transform', id === 'mince' ? 'translate(120 0) scale(.84 1) translate(-120 0)' : id === 'gonflee' ? 'translate(120 0) scale(1.08 1) translate(-120 0)' : '');
    });
    choisirZone('centre');
    return h('div', { class: 'boite-langue' }, svg, couleur, enduits, formes, panneau);
  }

  // ── Le pouls ─────────────────────────────────────────────────────────────
  const POSITIONS = {
    gauche: [
      { nom: 'Cun (pouce)', organe: 'Cœur', fu: 'Intestin grêle' },
      { nom: 'Guan (barrière)', organe: 'Foie', fu: 'Vésicule biliaire' },
      { nom: 'Chi (pied)', organe: 'Rein (Yin)', fu: 'Vessie' },
    ],
    droite: [
      { nom: 'Cun (pouce)', organe: 'Poumon', fu: 'Gros Intestin' },
      { nom: 'Guan (barrière)', organe: 'Rate', fu: 'Estomac' },
      { nom: 'Chi (pied)', organe: 'Rein (Yang)', fu: 'Ming Men, Triple Réchauffeur' },
    ],
  };
  const QUALITES = [
    ['Flottant', 'Perçu dès qu’on effleure : atteinte de surface (rhume débutant).'],
    ['Profond', 'Perçu seulement en appuyant : trouble interne.'],
    ['Rapide', 'Plus de cinq battements par respiration : chaleur.'],
    ['Lent', 'Moins de quatre battements par respiration : froid.'],
    ['Glissant', 'Roule comme des perles : humidité, mucosités — ou grossesse.'],
    ['En corde', 'Tendu comme une corde de guitare : stagnation du Qi du Foie, douleur, stress.'],
    ['Fin', 'Mince comme un fil : vide de Sang ou de Yin.'],
    ['Vide', 'Faible sous les doigts : vide de Qi.'],
    ['Plein', 'Ample et fort aux trois positions : plénitude.'],
  ];

  function pouls() {
    const svg = s('svg', { viewBox: '0 0 340 236', class: 'schema pouls', role: 'img', 'aria-label': 'Les trois positions du pouls' });
    // l'avant-bras, paume vers le haut, vu d'au-dessus : la main à gauche, le pouce en haut
    svg.appendChild(s('path', { class: 'p-bras', d: 'M4 62C60 56 140 54 336 52L336 176C140 174 60 172 4 168Z' }));
    svg.appendChild(s('path', { class: 'p-pli', d: 'M34 60C38 92 38 132 34 168' }));
    svg.appendChild(s('path', { class: 'p-pli', d: 'M24 61C28 92 28 132 24 168' }));
    svg.appendChild(s('ellipse', { cx: 140, cy: 60, rx: 22, ry: 7, class: 'p-styloide' }));
    svg.appendChild(s('path', { class: 'p-artere', d: 'M4 84C90 82 200 82 336 86' }));
    svg.appendChild(s('text', { x: 140, y: 40, 'text-anchor': 'middle', class: 'p-legende' }, 'saillie du radius (styloïde)'));
    svg.appendChild(s('text', { x: 332, y: 104, 'text-anchor': 'end', class: 'p-legende' }, 'artère radiale'));
    svg.appendChild(s('text', { x: 6, y: 50, class: 'p-legende' }, 'côté pouce'));
    svg.appendChild(s('text', { x: 8, y: 186, class: 'p-legende' }, '← main'));
    const doigts = [];
    const xs = [80, 140, 200];
    xs.forEach((x, i) => {
      const g = s('g', { class: 'p-doigt' });
      g.appendChild(s('ellipse', { cx: x, cy: 86, rx: 17, ry: 13 }));
      g.appendChild(s('text', { x, y: 90, 'text-anchor': 'middle', class: 'p-nom' }, ['Cun', 'Guan', 'Chi'][i]));
      g.appendChild(s('text', { x, y: 204, 'text-anchor': 'middle', class: 'p-organe' }, ''));
      g.appendChild(s('path', { d: 'M' + x + ' 101V172', class: 'p-repere' }));
      svg.appendChild(g);
      doigts.push(g);
    });
    svg.appendChild(s('text', { x: 80, y: 222, 'text-anchor': 'middle', class: 'p-legende' }, 'index'));
    svg.appendChild(s('text', { x: 140, y: 222, 'text-anchor': 'middle', class: 'p-legende' }, 'majeur'));
    svg.appendChild(s('text', { x: 200, y: 222, 'text-anchor': 'middle', class: 'p-legende' }, 'annulaire'));
    const panneau = h('div', { class: 'panneau-detail', 'aria-live': 'polite' });
    const boutons = h('div', { class: 'puces', role: 'group', 'aria-label': 'Poignet' });
    function choisir(cote) {
      POSITIONS[cote].forEach((p, i) => { doigts[i].querySelector('.p-organe').textContent = p.organe; });
      for (const b of boutons.children) b.setAttribute('aria-pressed', b.dataset.id === cote ? 'true' : 'false');
      panneau.textContent = '';
      panneau.appendChild(h('h4', null, 'Poignet ' + cote));
      const ul = h('ul', { class: 'liste-texte' });
      for (const p of POSITIONS[cote]) ul.appendChild(h('li', null, h('strong', null, p.nom), ' — ', p.organe, ' (et ', p.fu, ')'));
      panneau.appendChild(ul);
      panneau.appendChild(h('p', { class: 'discret' }, 'Le majeur se pose sur Guan, à la hauteur de la saillie osseuse ; l’index en avant (Cun), l’annulaire en arrière (Chi). On écoute à trois profondeurs : en surface, au milieu, en profondeur.'));
    }
    for (const c of ['gauche', 'droite']) boutons.appendChild(h('button', { type: 'button', class: 'puce', 'data-id': c, onclick: () => choisir(c) }, 'Poignet ' + c));
    choisir('gauche');
    const qualites = h('ul', { class: 'liste-texte' });
    for (const [n, t] of QUALITES) qualites.appendChild(h('li', null, h('strong', null, n), ' — ', t));
    return h('div', { class: 'boite-pouls' }, boutons, svg, panneau, h('h4', { class: 'intertitre' }, 'Quelques qualités du pouls'), qualites);
  }

  racine.Schemas.langue = langue;
  racine.Schemas.pouls = pouls;

})(window);
