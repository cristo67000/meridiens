'use strict';
/*
 * Les vues de détail : là où se cherchent vraiment les points.
 *
 * Chaque vue a son propre repère et son propre cun (indiqué en tête). Les
 * points y sont placés d'après leur localisation officielle (OMS, 2008) :
 * repères osseux, plis, tendons, et distances en cun. Pour chaque point utile,
 * des « guides » disent comment le trouver sur soi : une distance en travers
 * de doigts, un relief à sentir, une ligne de construction.
 *
 * Les vues des membres montrent un seul côté — les points sont bilatéraux,
 * le texte le rappelle. Les vues du visage et du tronc sont symétriques.
 */
(function (racine) {

  const { lisse, polygone, capsule, ellipse, lerp } = racine.Geo;

  // ── Petits outils de dessin ──────────────────────────────────────────────
  const ch = (d, classe) => '<path class="' + (classe || 'det') + '" d="' + d + '"/>';
  const courbe = (pts, classe, ferme) => ch(lisse(pts, ferme), classe);
  const rond = (p, r, classe) => '<circle class="' + (classe || 'det') + '" cx="' + p[0] + '" cy="' + p[1] + '" r="' + r + '"/>';
  const texte = (p, t, ancre) => '<text class="legende-anat" x="' + p[0] + '" y="' + p[1] + '" text-anchor="' + (ancre || 'middle') + '">' + t + '</text>';

  /* La réunion de plusieurs formes, sans couture (voir Corps.silhouette). */
  function silhouette(chemins) {
    return '<g class="sil-trait">' + chemins.map((d) => '<path d="' + d + '"/>').join('') + '</g>'
      + '<g class="sil-peau">' + chemins.map((d) => '<path d="' + d + '"/>').join('') + '</g>';
  }

  /* Un doigt dessiné de sa base à son extrémité. */
  function doigt(B, bout, largeur) {
    const v = [bout[0] - B[0], bout[1] - B[1]];
    const l = Math.hypot(v[0], v[1]);
    return capsule(B, [v[0] / l, v[1] / l], l, largeur);
  }
  /* Un point sur le bord d'un doigt : à `recul` de l'extrémité, décalé de `cote` (+ à droite de la direction). */
  function surDoigt(B, bout, recul, cote) {
    const v = [bout[0] - B[0], bout[1] - B[1]];
    const l = Math.hypot(v[0], v[1]);
    const u = [v[0] / l, v[1] / l];
    const n = [-u[1], u[0]];
    return [bout[0] - u[0] * recul + n[0] * cote, bout[1] - u[1] * recul + n[1] * cote];
  }
  function ongle(B, bout, largeur, classe) {
    const v = [bout[0] - B[0], bout[1] - B[1]];
    const l = Math.hypot(v[0], v[1]);
    const u = [v[0] / l, v[1] / l];
    const base = [bout[0] - u[0] * largeur * 1.15, bout[1] - u[1] * largeur * 1.15];
    return ch(polygone(capsule(base, u, largeur * 0.98, largeur * 0.62)), classe || 'ongle');
  }
  function plisDoigt(B, bout, largeur, fractions) {
    let s = '';
    const v = [bout[0] - B[0], bout[1] - B[1]];
    const l = Math.hypot(v[0], v[1]);
    const u = [v[0] / l, v[1] / l];
    const n = [-u[1], u[0]];
    for (const f of fractions) {
      const c = [B[0] + v[0] * f, B[1] + v[1] * f];
      const a = [c[0] + n[0] * largeur * 0.3, c[1] + n[1] * largeur * 0.3];
      const b = [c[0] - n[0] * largeur * 0.3, c[1] - n[1] * largeur * 0.3];
      s += ch('M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'L' + b[0].toFixed(1) + ' ' + b[1].toFixed(1), 'det trait-fin');
    }
    return s;
  }

  /* Vues symétriques : la moitié droite (à l'écran) se reflète autour de cx. */
  const miroir = (cx) => ({
    d: (p) => [cx + p[0], p[1]],
    g: (p) => [cx - p[0], p[1]],
    deux: (pts, classe, ferme) => courbe(pts.map((p) => [cx + p[0], p[1]]), classe, ferme)
      + courbe(pts.map((p) => [cx - p[0], p[1]]), classe, ferme),
    contour: (moitie) => lisse(moitie.map((p) => [cx + p[0], p[1], p[2]])
      .concat(moitie.slice(1, -1).reverse().map((p) => [cx - p[0], p[1], p[2]])), true),
    bi: (p) => (p[0] ? [[cx + p[0], p[1]], [cx - p[0], p[1]]] : [[cx, p[1]]]),
  });

  /* Les positions d'une vue symétrique, données en (dx, y). */
  function bilateral(cx, table) {
    const m = miroir(cx);
    const r = {};
    for (const [id, p] of Object.entries(table)) r[id] = m.bi(p);
    return r;
  }
  function simple(table) {
    const r = {};
    for (const [id, p] of Object.entries(table)) r[id] = Array.isArray(p[0]) ? p : [p];
    return r;
  }
  /* Tracés d'une vue symétrique : chaque tracé est dessiné des deux côtés. */
  function tracesBi(cx, table, positions) {
    const r = {};
    for (const [m, sous] of Object.entries(table)) {
      r[m] = [];
      for (const t of sous) {
        const pts = t.map((it) => (typeof it === 'string' ? positions[it] : it));
        if (pts.some((p) => !p)) throw new Error('tracé ' + m + ' : point inconnu dans ' + JSON.stringify(t));
        r[m].push(pts.map((p) => [cx + p[0], p[1]]));
        if (pts.some((p) => p[0] !== 0)) r[m].push(pts.map((p) => [cx - p[0], p[1]]));
      }
    }
    return r;
  }
  function tracesSimples(table, positions) {
    const r = {};
    for (const [m, sous] of Object.entries(table)) {
      r[m] = sous.map((t) => t.map((it) => {
        const p = typeof it === 'string' ? positions[it] : it;
        if (!p) throw new Error('tracé ' + m + ' : point inconnu ' + it);
        return p;
      }));
    }
    return r;
  }

  const VUES = {};

  // ════════════════════════════════════════════════════════════════════════
  // Avant-bras et main, face palmaire — main gauche, paume vers soi, doigts
  // en haut : le pouce est à gauche. Pli du coude y = 525, pli du poignet
  // y = 300 : 12 cun → 1 cun = 18,75.
  // ════════════════════════════════════════════════════════════════════════
  const PAUME = {
    contour: [
      [104, 590], [106, 525], [109, 470], [113, 410], [117, 360], [119.5, 330], [117, 314], [121, 300],
      [113, 286], [104, 268], [101, 252], [106, 236], [114, 216], [132, 209], [152, 207], [172, 210],
      [189, 221], [193.5, 240], [194, 262], [189.5, 284], [181, 299], [182.5, 314], [185.5, 350],
      [189, 410], [193, 470], [195, 525], [196, 590],
    ],
    doigts: {
      index: [[122, 224], [119, 141], 18.5],
      majeur: [[143, 219], [142, 124], 19.5],
      annulaire: [[163, 222], [165, 133], 18.5],
      auriculaire: [[181, 232], [188, 164], 16],
      pouce: [[121, 300], [68, 195], 22],
    },
  };
  const cunAvb = 225 / 12;

  VUES['main-paume'] = function () {
    const D = PAUME.doigts;
    const formes = [lisse(PAUME.contour, true)];
    for (const k of Object.keys(D)) formes.push(polygone(doigt(D[k][0], D[k][1], D[k][2])));
    let fond = silhouette(formes);
    // éminences thénar et hypothénar, plis de la paume
    fond += courbe([[116, 236], [124, 262], [131, 284], [140, 297]], 'det');
    fond += courbe([[116, 236], [140, 243], [165, 250], [182, 258]], 'det trait-fin');
    fond += courbe([[190, 238], [170, 232], [150, 228], [134, 228]], 'det trait-fin');
    fond += courbe([[124, 300.5], [150, 303], [178, 300.5]], 'det');
    fond += courbe([[125, 292], [150, 294.5], [177, 292]], 'det trait-fin');
    // tendons du poignet (grand palmaire, petit palmaire, cubital antérieur)
    fond += courbe([[139.5, 304], [138.5, 350], [136.5, 410]], 'det tendon');
    fond += courbe([[152, 305], [151.5, 350], [150.5, 405]], 'det tendon');
    fond += courbe([[173.5, 304], [175, 360], [178, 420]], 'det tendon');
    // pli du coude, tendon du biceps
    fond += courbe([[109, 524], [146, 528], [193, 524]], 'det');
    fond += courbe([[143, 500], [144.5, 528], [145, 560]], 'det tendon');
    fond += courbe([[149, 500], [148.5, 528], [148, 560]], 'det tendon');
    // plis des doigts
    for (const k of ['index', 'majeur', 'annulaire', 'auriculaire']) fond += plisDoigt(D[k][0], D[k][1], D[k][2], [0.18, 0.52, 0.76]);
    fond += plisDoigt(D.pouce[0], D.pouce[1], D.pouce[2], [0.62]);
    fond += ongle(D.pouce[0], D.pouce[1], 13, 'ongle');
    // styloïde radiale
    fond += courbe([[118, 306], [114.5, 313], [118, 321]], 'det trait-fin');

    const P5 = [134, 525];
    const P9 = [128, 300];
    const pos = {
      P5, P6: lerp(P5, P9, 5 / 12), P7: [119.5, 300 + 1.5 * cunAvb], P8: [127.5, 300 + cunAvb], P9,
      P10: [103.5, 271], P11: surDoigt(D.pouce[0], D.pouce[1], 10, -10.6),
      MC3: [157, 526], MC4: [147, 300 + 5 * cunAvb], MC5: [146.5, 300 + 3 * cunAvb], MC6: [146, 300 + 2 * cunAvb],
      MC7: [146, 300], MC8: [133, 241], MC9: surDoigt(D.majeur[0], D.majeur[1], 2.5, 0),
      C3: [190, 527], C4: [168.5, 300 + 1.5 * cunAvb], C5: [168.5, 300 + cunAvb], C6: [168.5, 300 + 0.5 * cunAvb],
      C7: [168.5, 300], C8: [171, 241], C9: surDoigt(D.auriculaire[0], D.auriculaire[1], 9, -8.2),
    };
    const traces = tracesSimples({
      P: [['P5', [133, 480], 'P6', [126, 380], 'P7', 'P8', 'P9', [114, 288], 'P10', [93, 248], [81, 225], 'P11']],
      MC: [['MC3', [153, 470], 'MC4', 'MC5', 'MC6', 'MC7', [139, 272], 'MC8', [140, 200], 'MC9']],
      C: [['C3', [181, 440], [171, 370], 'C4', 'C5', 'C6', 'C7', [172.5, 272], 'C8', [177, 205], 'C9']],
    }, pos);
    const guides = {
      MC6: [
        { mesure: [[146, 300], pos.MC6], texte: '2 cun', doigts: 3, cote: -1, ou: [120, 318], ancre: 'end' },
        { ligne: [[139.5, 305], [138.5, 360]], texte: '' },
        { ligne: [[152, 305], [151.5, 360]], texte: 'entre les 2 tendons', ou: [158, 368], ancre: 'start' },
      ],
      MC5: [{ mesure: [[146, 300], pos.MC5], texte: '3 cun', doigts: 4, cote: -1, ou: [120, 330], ancre: 'end' }],
      MC4: [{ mesure: [[146, 300], pos.MC4], texte: '5 cun', ou: [160, 350], ancre: 'start' }],
      MC7: [{ ligne: [[124, 300.5], [150, 303], [178, 300.5]], texte: 'pli du poignet', ou: [186, 292], ancre: 'start' }],
      MC8: [{ fleche: [D.majeur[1], [136, 236]], texte: 'poing fermé : sous le bout du majeur', ou: [212, 190], ancre: 'start' }],
      P7: [
        { repere: [116, 313], r: 8, texte: 'styloïde radiale', ou: [92, 318], ancre: 'end' },
        { mesure: [[121, 300], pos.P7], texte: '1,5 cun', doigts: 2, cote: 1, ou: [150, 340], ancre: 'start' },
      ],
      P6: [
        { ligne: [P5, P9], texte: 'ligne P5–P9' , ou: [96, 470], ancre: 'end' },
        { mesure: [P9, pos.P6], texte: '7 cun au-dessus du poignet', ou: [100, 380], ancre: 'end' },
      ],
      P9: [{ ligne: [[124, 300.5], [150, 303], [178, 300.5]], texte: 'pli du poignet, côté pouce', ou: [186, 292], ancre: 'start' }],
      P10: [{ repere: [110, 272], r: 14, texte: 'milieu du 1er métacarpien', ou: [86, 300], ancre: 'end' }],
      P5: [{ repere: [146.5, 528], r: 9, texte: 'tendon du biceps', ou: [146, 500] }],
      C7: [{ ligne: [[173.5, 304], [175, 360]], texte: 'tendon côté auriculaire', ou: [182, 372], ancre: 'start' }],
      C5: [{ mesure: [[168.5, 300], pos.C5], texte: '1 cun', doigts: 1, cote: -1, ou: [190, 320], ancre: 'start' }],
      C6: [{ mesure: [[168.5, 300], pos.C6], texte: '0,5 cun', ou: [190, 312], ancre: 'start' }],
      C8: [{ fleche: [D.auriculaire[1], [172, 236]], texte: 'poing fermé : sous l’auriculaire', ou: [196, 190], ancre: 'start' }],
    };
    return {
      titre: 'Avant-bras et main, face palmaire',
      legende: 'Votre main gauche, paume vers vous, doigts en haut. Les points existent aussi sur la main droite.',
      largeur: 300, hauteur: 590, fond, points: simple(pos), traces, guides, axe: 150,
      etiquettes: { MC6: 'd', MC5: 'd', MC4: 'd', MC7: 'b', MC8: 'g', P9: 'g', P8: 'g', C7: 'd', C6: 'd', C5: 'd', C4: 'd', C8: 'd', C9: 'd' },
    };
  };

  // ════════════════════════════════════════════════════════════════════════
  // Avant-bras et main, face dorsale — main gauche, dos de la main vers soi :
  // le pouce est à droite. Même repère que la paume, reflété (x → 300 − x).
  // ════════════════════════════════════════════════════════════════════════
  VUES['main-dos'] = function () {
    const R = (p) => [300 - p[0], p[1], p[2]];
    const D = {};
    for (const [k, v] of Object.entries(PAUME.doigts)) D[k] = [R(v[0]), R(v[1]), v[2]];
    const formes = [lisse(PAUME.contour.map(R), true)];
    for (const k of Object.keys(D)) formes.push(polygone(doigt(D[k][0], D[k][1], D[k][2])));
    let fond = silhouette(formes);
    // métacarpiens
    const meta = [[[170, 293], [178, 221]], [[154, 293], [157, 217]], [[139, 294], [137, 220]], [[126, 293], [119, 229]]];
    for (const [a, b] of meta) fond += ch('M' + a[0] + ' ' + a[1] + 'L' + b[0] + ' ' + b[1], 'det os');
    fond += ch('M186 302L197 262', 'det os');
    // articulations des doigts (jointures) et ongles
    for (const k of ['index', 'majeur', 'annulaire', 'auriculaire']) {
      const [B, T, w] = D[k];
      const c = [B[0] + (T[0] - B[0]) * 0.02, B[1] + (T[1] - B[1]) * 0.02];
      fond += courbe([[c[0] - w * 0.38, c[1] + 3], [c[0], c[1] - 2.5], [c[0] + w * 0.38, c[1] + 3]], 'det trait-fin');
      fond += plisDoigt(B, T, w, [0.5, 0.74]);
      fond += ongle(B, T, w);
    }
    fond += ongle(D.pouce[0], D.pouce[1], 22);
    fond += plisDoigt(D.pouce[0], D.pouce[1], 22, [0.6]);
    // tendons extenseurs, tête du cubitus, styloïde radiale
    fond += courbe([[150, 305], [156, 260], [157.5, 222]], 'det tendon');
    fond += courbe([[146, 305], [139, 262], [137, 224]], 'det tendon');
    fond += courbe([[157, 305], [172, 262], [177.5, 226]], 'det tendon');
    fond += courbe([[181, 300], [190, 278], [199, 262]], 'det tendon');
    fond += courbe([[189, 304], [196, 286], [206, 268]], 'det tendon');
    fond += rond([118.5, 313], 6.5, 'det');
    fond += courbe([[182, 306], [185.5, 313], [182, 321]], 'det trait-fin');
    fond += courbe([[123, 300], [150, 298], [177, 300]], 'det trait-fin');
    // coude : olécrane, épicondyles
    fond += courbe([[140, 540], [152, 531], [164, 540]], 'det');
    fond += rond([193, 522], 4.5, 'det trait-fin');
    fond += rond([108, 524], 4.5, 'det trait-fin');

    const GI5 = [186, 299];
    const GI11 = [195.5, 522];
    const pos = {
      GI1: surDoigt(D.index[0], D.index[1], 9, 9.6), GI2: [189.5, 205], GI3: [189, 229], GI4: [186.5, 252], GI5,
      GI6: lerp(GI5, GI11, 3 / 12), GI7: lerp(GI5, GI11, 5 / 12), GI10: lerp(GI5, GI11, 10 / 12), GI11,
      TR1: surDoigt(D.annulaire[0], D.annulaire[1], 9, -9.6), TR2: [127.5, 213], TR3: [127.5, 237], TR4: [144, 300],
      TR5: [150, 300 + 2 * cunAvb], TR6: [150, 300 + 3 * cunAvb], TR8: [150, 300 + 4 * cunAvb], TR10: [152, 562],
      IG1: surDoigt(D.auriculaire[0], D.auriculaire[1], 8.5, -8.4), IG2: [106.5, 219], IG3: [107, 241],
      IG4: [110.5, 284], IG5: [119.5, 301], IG6: [126.5, 317], IG7: [116, 300 + 5 * cunAvb], IG8: [124, 530],
      Luozhen: [167.5, 236], Yaotongdian: [[167.5, 263], [128.5, 266]],
    };
    const traces = tracesSimples({
      GI: [['GI1', [190, 178], 'GI2', 'GI3', 'GI4', [187.5, 278], 'GI5', 'GI6', 'GI7', [193, 440], 'GI10', 'GI11', [197, 590]]],
      TR: [['TR1', [127, 180], 'TR2', 'TR3', [137, 272], 'TR4', 'TR5', 'TR6', 'TR8', [150.5, 450], [151.5, 525], 'TR10', [152, 590]]],
      IG: [['IG1', [106, 196], 'IG2', 'IG3', [108, 262], 'IG4', 'IG5', 'IG6', [120, 360], 'IG7', [117, 470], 'IG8', [124, 590]]],
    }, pos);
    const guides = {
      GI4: [
        { ligne: [[170, 293], [178, 221]], texte: '2e métacarpien', ou: [164, 276], ancre: 'end' },
        { repere: [pos.GI4[0] + 4, pos.GI4[1]], r: 10, texte: 'pouce serré : sommet du muscle', ou: [212, 300], ancre: 'start' },
      ],
      GI5: [{ repere: [187, 298], r: 7, texte: 'pouce tendu : le creux entre les tendons', ou: [206, 322], ancre: 'start' }],
      GI10: [{ mesure: [GI11, pos.GI10], texte: '2 cun', doigts: 3, cote: -1, ou: [218, 500], ancre: 'start' }],
      GI11: [{ repere: [193, 522], r: 6, texte: 'coude plié : au bout du pli', ou: [212, 548], ancre: 'start' }],
      TR5: [{ mesure: [[150, 300], pos.TR5], texte: '2 cun', doigts: 3, cote: 1, ou: [176, 330], ancre: 'start' }],
      TR6: [{ mesure: [[150, 300], pos.TR6], texte: '3 cun', doigts: 4, cote: 1, ou: [176, 340], ancre: 'start' }],
      TR4: [{ ligne: [[123, 300], [150, 298], [177, 300]], texte: 'pli du dos du poignet', ou: [100, 296], ancre: 'end' }],
      TR3: [{ fleche: [[127.5, 213], [127.5, 233]], texte: 'entre 4e et 5e métacarpiens', ou: [96, 250], ancre: 'end' }],
      IG3: [{ repere: [113, 232], r: 7, texte: 'poing fermé : au bout du pli', ou: [92, 258], ancre: 'end' }],
      IG6: [{ repere: [118.5, 313], r: 7, texte: 'tête du cubitus', ou: [96, 328], ancre: 'end' }],
      Luozhen: [{ fleche: [[167.5, 212], [167.5, 232]], texte: 'derrière les jointures', ou: [205, 196], ancre: 'start' }],
      Yaotongdian: [{ ligne: [[123, 300], [150, 298], [177, 300]], texte: 'à mi-chemin du poignet', ou: [205, 280], ancre: 'start' }],
    };
    return {
      titre: 'Avant-bras et main, face dorsale',
      legende: 'Votre main gauche, dos de la main vers vous, doigts en haut. Les points existent aussi sur la main droite.',
      largeur: 300, hauteur: 590, fond, points: simple(pos), traces, guides, axe: 150,
      etiquettes: { TR4: 'g', TR5: 'g', TR6: 'g', TR8: 'g', TR10: 'g', GI4: 'd', Luozhen: 'g', Yaotongdian: 'b' },
    };
  };

  // ════════════════════════════════════════════════════════════════════════
  // Le visage, de face. Axe x = 160. Glabelle (Yintang) y = 146, lisière
  // antérieure des cheveux y = 66 : 3 cun → 1 cun ≈ 26,7.
  // ════════════════════════════════════════════════════════════════════════
  VUES.visage = function () {
    const m = miroir(160);
    const tete = [[0, 4], [40, 7], [74, 20], [96, 44], [106, 80], [108, 120], [107, 150], [104, 180],
      [100, 214], [94, 248], [86, 276], [72, 304], [52, 330], [30, 347], [0, 353]];
    const oreille = [[104, 160], [114, 154], [121, 166], [120, 190], [116, 214], [110, 232], [103, 234]];
    let fond = silhouette([m.contour(tete), lisse(oreille.map(m.d), true), lisse(oreille.map(m.g), true)]);
    // cheveux
    const cheveux = [[0, 4], [40, 7], [74, 20], [96, 44], [106, 80], [107.5, 118], [106, 140], [101, 136],
      [98, 106], [92, 86], [72, 76], [40, 68], [0, 64]];
    fond += courbe(cheveux.map(m.d).concat(cheveux.slice(1, -1).reverse().map(m.g)), 'cheveux', true);
    // sourcils, yeux
    fond += m.deux([[20, 143], [36, 135], [58, 131], [76, 133], [90, 140]], 'det');
    fond += m.deux([[20, 140], [36, 132.5], [58, 128.5], [76, 130.5], [90, 138]], 'det trait-fin');
    fond += m.deux([[27, 167], [40, 158], [56, 155], [72, 158], [83, 165], [70, 173], [55, 176], [38, 173]], 'det', true);
    fond += m.deux([[30, 160], [55, 151.5], [80, 160]], 'det trait-fin');
    fond += rond(m.d([55, 166]), 7.5, 'det') + rond(m.g([55, 166]), 7.5, 'det');
    fond += rond(m.d([55, 166]), 3, 'iris') + rond(m.g([55, 166]), 3, 'iris');
    // rebord orbitaire inférieur
    fond += m.deux([[30, 186], [55, 192], [82, 184]], 'det pointille');
    // nez
    fond += m.deux([[15, 160], [17, 200], [24, 228]], 'det trait-fin');
    fond += courbe([m.g([26, 244]), m.g([31, 236]), m.g([24, 228]), m.g([14, 236]), [160, 246], m.d([14, 236]), m.d([24, 228]), m.d([31, 236]), m.d([26, 244])], 'det');
    fond += m.deux([[26, 244], [18, 250], [8, 252]], 'det');
    fond += courbe([m.g([8, 252]), [160, 254], m.d([8, 252])], 'det trait-fin');
    // sillons naso-géniens, philtrum, bouche, menton
    fond += m.deux([[34, 230], [42, 252], [50, 276], [58, 300]], 'det trait-fin');
    fond += m.deux([[7, 256], [8.5, 270], [10, 280]], 'det trait-fin');
    fond += courbe([m.g([42, 290]), m.g([24, 283]), m.g([10, 280]), [160, 283], m.d([10, 280]), m.d([24, 283]), m.d([42, 290])], 'det');
    fond += courbe([m.g([40, 291]), m.g([20, 296]), [160, 297], m.d([20, 296]), m.d([40, 291])], 'det trait-fin');
    fond += courbe([m.g([28, 300]), m.g([14, 307]), [160, 309], m.d([14, 307]), m.d([28, 300])], 'det trait-fin');
    fond += courbe([m.g([18, 321]), [160, 318], m.d([18, 321])], 'det trait-fin');
    // pommettes, angle de la mâchoire
    fond += m.deux([[70, 214], [86, 206], [100, 200]], 'det pointille');
    fond += m.deux([[98, 234], [92, 262], [86, 276], [76, 296]], 'det trait-fin');
    fond += m.deux([[107, 168], [112, 172], [113, 192], [109, 210]], 'det trait-fin');

    const P = {
      VG20: [0, 6], VG23: [0, 40], VG24: [0, 53], Yintang: [0, 146], VG25: [0, 238], VG26: [0, 264], VC24: [0, 318],
      V1: [22, 163], V2: [21, 141], V3: [21, 53], V4: [40, 53], Yuyao: [55, 132], TR23: [89, 140], VB1: [95, 167],
      E1: [55, 184], E2: [55, 201], E3: [55, 250], Bitong: [25, 222], GI20: [36, 243], GI19: [19, 263], E4: [51, 291],
      VB14: [55, 106], VB15: [55, 72], VB13: [82, 76], E8: [99, 82], Taiyang: [104, 152], IG18: [80, 218],
      E6: [80, 268], E5: [66, 330],
    };
    const traces = tracesBi(160, {
      E: [['E1', 'E2', [55, 225], 'E3', [53, 274], 'E4', [60, 316], 'E5', [74, 300], 'E6', [92, 236], [104, 190]],
        [[104, 126], 'E8']],
      GI: [[[70, 360], [56, 322], [44, 298], [28, 276], [0, 264], [-19, 263], [-36, 243]]],
      V: [['V1', 'V2', [21, 100], 'V3', 'V4', [40, 20]]],
      VB: [['VB1', [106, 176]], [[105, 96], 'VB13', 'VB14', 'VB15', [55, 30]]],
      TR: [[[106, 150], 'TR23']],
      IG: [[[104, 238], 'IG18', [106, 205]]],
      VG: [[[0, 0], 'VG24', [0, 100], 'Yintang', [0, 200], 'VG25', 'VG26', [0, 282]]],
      VC: [[[0, 360], 'VC24']],
    }, P);
    const d = (p) => [160 + p[0], p[1]];
    const guides = {
      Yintang: [{ ligne: [d([-20, 143]), d([20, 143])], texte: 'entre les sourcils', ou: [160, 120] }],
      V2: [{ repere: d([21, 141]), r: 7, texte: 'creux au début du sourcil', ou: [160, 112] }],
      Yuyao: [{ ligne: [d([55, 166]), d([55, 132])], texte: 'au-dessus de la pupille', ou: [226, 118], ancre: 'start' }],
      VB14: [{ mesure: [d([55, 131]), d([55, 106])], texte: '1 cun', doigts: 1, cote: 1, ou: [240, 112], ancre: 'start' }],
      TR23: [{ repere: d([89, 140]), r: 7, texte: 'bout du sourcil', ou: [252, 118], ancre: 'start' }],
      VB1: [{ repere: d([83, 165]), r: 6, texte: 'coin externe de l’œil', ou: [262, 192], ancre: 'start' }],
      E2: [{ ligne: [d([30, 186]), d([55, 192]), d([82, 184])], texte: 'rebord osseux sous l’œil', ou: [252, 210], ancre: 'start' }],
      GI20: [{ ligne: [d([34, 230]), d([42, 252]), d([50, 276])], texte: 'dans le sillon, au milieu de l’aile du nez', ou: [210, 268], ancre: 'start' }],
      Bitong: [{ repere: d([24, 228]), r: 6, texte: 'haut du sillon', ou: [204, 214], ancre: 'start' }],
      VG26: [{ ligne: [[160, 255], [160, 283]], texte: 'au tiers supérieur du sillon', ou: [180, 274], ancre: 'start' }],
      E6: [{ repere: d([86, 278]), r: 9, texte: 'serrez les dents : le muscle saille', ou: [250, 300], ancre: 'start' }],
      E4: [{ repere: d([42, 290]), r: 5, texte: 'coin des lèvres', ou: [230, 316], ancre: 'start' }],
      VC24: [{ ligne: [d([-18, 321]), d([18, 321])], texte: 'creux sous la lèvre', ou: [160, 340] }],
      Taiyang: [{ repere: d([104, 152]), r: 10, texte: 'le creux de la tempe', ou: [160, 112] }],
    };
    return {
      titre: 'Le visage, de face',
      legende: 'Tous ces points sont symétriques, à droite comme à gauche — sauf ceux de la ligne médiane.',
      largeur: 320, hauteur: 362, fond, points: bilateral(160, P), traces, guides, axe: 160,
      etiquettes: { Yintang: 'h', VG26: 'g', VC24: 'b', VG24: 'd', E1: 'd', E2: 'd', E3: 'd', V1: 'b', V2: 'h', Yuyao: 'h', GI19: 'b' },
    };
  };

  // ════════════════════════════════════════════════════════════════════════
  // La tête de profil, regard vers la gauche. Oreille au centre-droit.
  // 1 cun ≈ 28.
  // ════════════════════════════════════════════════════════════════════════
  VUES['tete-profil'] = function () {
    const tete = [
      [207, 14], [250, 24], [284, 52], [302, 92], [308, 140], [304, 186], [296, 222], [286, 248],
      [276, 268], [272, 300], [274, 340], [278, 386, true], [168, 386, true], [164, 352], [154, 330],
      [128, 330], [100, 334], [84, 328], [74, 312], [70, 296], [72, 288], [64, 280], [66, 270],
      [62, 262], [66, 254], [62, 244], [58, 238], [46, 232], [36, 224], [38, 212], [52, 188],
      [62, 168], [68, 156], [66, 140], [70, 118], [80, 82], [100, 50], [130, 28], [168, 16],
    ];
    const oreille = [[192, 186], [196, 162], [210, 150], [228, 152], [238, 168], [236, 196], [228, 220], [222, 238], [210, 246], [198, 240], [194, 226], [190, 208]];
    let fond = silhouette([lisse(tete, true), lisse(oreille, true)]);
    // cheveux
    const cheveux = [[207, 14], [250, 24], [284, 52], [302, 92], [308, 140], [304, 186], [296, 222], [287, 246],
      [268, 250], [246, 232], [240, 200], [242, 160], [228, 140], [204, 140], [188, 156], [184, 180],
      [176, 168], [164, 120], [148, 92], [118, 72], [92, 62], [100, 50], [130, 28], [168, 16]];
    fond += courbe(cheveux, 'cheveux', true);
    fond += silhouette([lisse(oreille, true)]);
    // oreille : hélix, tragus, lobe
    fond += courbe([[200, 182], [204, 166], [216, 160], [228, 166], [230, 186], [224, 206], [216, 220]], 'det');
    fond += courbe([[211, 178], [218, 176], [222, 190], [214, 206], [205, 212]], 'det trait-fin');
    fond += courbe([[194, 192], [198, 200], [194, 210]], 'det');
    fond += courbe([[200, 232], [210, 238], [220, 232]], 'det trait-fin');
    // œil, sourcil
    fond += courbe([[90, 136], [106, 132], [122, 138]], 'det');
    fond += courbe([[94, 160], [104, 154], [113, 160], [104, 167], [96, 165]], 'det', true);
    fond += courbe([[96, 160], [100, 158], [103, 162]], 'iris');
    // narine, bouche
    fond += courbe([[52, 222], [60, 228], [66, 226]], 'det trait-fin');
    fond += courbe([[64, 264], [74, 265]], 'det trait-fin');
    // arcade zygomatique, mandibule, mastoïde
    fond += courbe([[116, 190], [150, 194], [186, 196]], 'det pointille');
    fond += courbe([[86, 326], [130, 318], [166, 302], [182, 278], [188, 240], [192, 222]], 'det trait-fin');
    fond += courbe([[166, 300], [176, 290], [182, 278]], 'det trait-fin');
    fond += courbe([[234, 236], [242, 248], [238, 258]], 'det trait-fin');
    // sterno-cléido-mastoïdien, trapèze
    fond += courbe([[238, 252], [218, 300], [190, 360], [180, 386]], 'det trait-fin');
    fond += courbe([[288, 256], [286, 320], [290, 386]], 'det trait-fin');
    fond += rond([300, 200], 3, 'repere-creux');

    const pos = {
      VG20: [212, 15], Sishencong: [[178, 18], [246, 23]], VG16: [292, 236],
      Taiyang: [140, 152], TR23: [122, 138], VB1: [120, 162], E8: [134, 72], VB14: [80, 108],
      VB8: [214, 112], TR20: [212, 146], TR21: [189, 184], IG19: [188, 199], VB2: [189, 214],
      E7: [160, 205], E6: [162, 280], TR17: [225, 244], Anmian: [252, 244], VB20: [279, 246], V10: [283, 268],
      VB12: [242, 250], IG18: [116, 208], IG17: [196, 292], E4: [72, 268], GI20: [58, 224], E1: [100, 176],
      VB3: [164, 180], VB4: [150, 92], VB5: [156, 104], VB6: [162, 116], VB7: [182, 150],
      VB9: [236, 118], VB10: [244, 150], VB11: [242, 184], VB13: [104, 70], VB15: [96, 54], VB16: [126, 38],
      VB17: [166, 30], VB18: [222, 36], VB19: [264, 108], TR16: [242, 320], TR18: [238, 214], TR19: [238, 176],
      TR22: [178, 170], E5: [110, 322], E3: [92, 222], E2: [98, 190],
    };
    const traces = tracesSimples({
      VB: [['VB1', [148, 196], 'VB2', 'VB3', [156, 140], 'VB4', 'VB5', 'VB6', 'VB7', 'VB8', 'VB9', 'VB10', 'VB11', 'VB12'],
        ['VB13', 'VB14', 'VB15', 'VB16', 'VB17', 'VB18', 'VB19', 'VB20', [282, 300], [286, 386]]],
      TR: [[[250, 386], 'TR16', 'TR17', 'TR18', 'TR19', 'TR20', 'TR21', 'TR22', [150, 150], 'TR23']],
      IG: [[[210, 386], [204, 330], 'IG17', [150, 236], 'IG18', [156, 200], 'IG19']],
      E: [['E1', 'E2', 'E3', 'E4', [80, 300], 'E5', [140, 300], 'E6', 'E7', [154, 130], 'E8'], ['E5', [130, 360], [140, 386]]],
      GI: [[[176, 386], [130, 350], [96, 300], [72, 270], [58, 248]], [[56, 240], 'GI20']],
      V: [[[84, 150], [86, 120], [94, 88], [116, 50], [160, 26], [212, 22], [258, 40], [292, 100], [298, 170], [292, 220], 'V10', [280, 330], [282, 386]]],
      VG: [[[292, 386], [284, 300], 'VG16', [302, 190], [304, 130], [288, 64], [254, 30], 'VG20', [168, 21], [124, 34], [92, 60], [72, 110], [68, 150], [62, 172], [44, 214], [42, 228], [58, 240]]],
    }, pos);
    const guides = {
      IG19: [{ repere: [194, 200], r: 7, texte: 'ouvrez la bouche : un creux devant le tragus', ou: [190, 290], ancre: 'middle' }],
      TR21: [{ repere: [194, 186], r: 7, texte: 'creux au-dessus du tragus, bouche ouverte', ou: [190, 292] }],
      VB2: [{ repere: [194, 212], r: 7, texte: 'creux sous le tragus, bouche ouverte', ou: [190, 292] }],
      E7: [{ ligne: [[116, 190], [150, 194], [186, 196]], texte: 'sous l’arcade, bouche fermée', ou: [150, 236] }],
      E6: [{ repere: [172, 290], r: 9, texte: 'angle de la mâchoire', ou: [120, 296], ancre: 'end' }],
      TR17: [{ repere: [212, 238], r: 8, texte: 'derrière le lobe de l’oreille', ou: [228, 300], ancre: 'middle' }],
      Anmian: [{ ligne: [pos.TR17, pos.VB20], texte: 'à mi-chemin', ou: [252, 226] }],
      VB20: [{ repere: [300, 200], r: 9, texte: 'sous l’os de l’occiput', ou: [296, 296], ancre: 'end' }],
      VB8: [{ mesure: [[214, 150], pos.VB8], texte: '1,5 cun', doigts: 2, cote: 1, ou: [244, 126], ancre: 'start' }],
      VG20: [{ ligne: [[212, 150], [212, 18]], texte: 'à l’aplomb des oreilles', ou: [226, 80], ancre: 'start' }],
      Sishencong: [{ mesure: [[212, 15], [178, 18]], texte: '1 cun', ou: [195, 40] }],
      Taiyang: [{ repere: [140, 152], r: 13, texte: 'creux de la tempe', ou: [140, 124] }],
      VB14: [{ mesure: [[86, 136], [80, 108]], texte: '1 cun', doigts: 1, cote: -1, ou: [56, 116], ancre: 'end' }],
    };
    return {
      titre: 'La tête de profil',
      legende: 'Le côté gauche de la tête ; chaque point a son jumeau de l’autre côté.',
      largeur: 320, hauteur: 386, fond, points: simple(pos), traces, guides, axe: 150,
      etiquettes: { IG19: 'g', TR21: 'g', VB2: 'g', E7: 'b', TR17: 'b', Anmian: 'h', VB20: 'd', V10: 'd', VG16: 'd', VG20: 'h', Sishencong: 'h', VB8: 'd', Taiyang: 'b', E6: 'g' },
    };
  };

  // ════════════════════════════════════════════════════════════════════════
  // Nuque, épaules et haut du dos, vus de dos. Axe x = 180. C7 y = 228,
  // une vertèbre ≈ 21,6 ; 1 cun ≈ 20,6.
  // ════════════════════════════════════════════════════════════════════════
  VUES['nuque-dos'] = function () {
    const m = miroir(180);
    const corps = [[0, 6], [32, 10], [58, 26], [72, 52], [76, 84], [72, 116], [62, 136], [48, 150],
      [44, 176], [46, 200], [62, 212], [96, 224], [130, 236], [152, 246], [166, 264], [172, 296],
      [170, 340], [166, 400, true], [0, 400, true]];
    const oreille = [[70, 74], [80, 70], [86, 84], [84, 108], [78, 124], [70, 126]];
    let fond = silhouette([m.contour(corps), lisse(oreille.map(m.d), true), lisse(oreille.map(m.g), true)]);
    const cheveux = [[0, 6], [32, 10], [58, 26], [72, 52], [76, 84], [72, 116], [64, 134], [46, 140], [24, 146], [0, 148]];
    fond += courbe(cheveux.map(m.d).concat(cheveux.slice(1, -1).reverse().map(m.g)), 'cheveux', true);
    fond += m.deux([[76, 80], [81, 84], [80, 104]], 'det trait-fin');
    // trapèzes, colonne
    fond += m.deux([[32, 150], [28, 190], [40, 214]], 'det trait-fin');
    fond += ch('M180 150L180 400', 'det pointille');
    for (let k = 0; k < 8; k += 1) {
      const y = 228 + k * 21.6;
      fond += rond([180, y], k === 0 ? 3.4 : 2, 'vertebre');
    }
    fond += rond([180, 120], 3, 'repere-creux');
    // omoplates
    fond += m.deux([[75, 266], [64, 290], [66, 330], [84, 379], [108, 352], [128, 320], [142, 300]], 'det trait-fin');
    fond += m.deux([[64, 293], [100, 272], [130, 256], [150, 248]], 'det');
    fond += texte([180, 392], 'T7');
    fond += texte([196, 232], 'C7', 'start');

    const P = {
      VG20: [0, 6], VG16: [0, 130], VG15: [0, 140], VG14: [0, 239], VG13: [0, 260], VG12: [0, 303],
      VB20: [46, 130], V10: [27, 156], Anmian: [60, 128], TR17: [72, 124], VB21: [76, 232], VB19: [32, 100],
      Dingchuan: [10.3, 239], IG14: [62, 261], IG15: [41, 240], IG11: [99, 306], IG12: [100, 262], IG13: [72, 278],
      IG10: [138, 286], IG9: [146, 334], TR14: [158, 262], TR15: [80, 258], TR16: [50, 168], GI16: [136, 240], GI15: [160, 252],
      V11: [31, 261], V12: [31, 282], V13: [31, 304], V14: [31, 325], V15: [31, 347], V17: [31, 390],
      V41: [62, 282], V42: [62, 304], V43: [62, 325], V44: [62, 347],
    };
    const traces = tracesBi(180, {
      VB: [[[30, 60], 'VB19', 'VB20', [52, 176], [62, 214], 'VB21', [116, 238], [150, 250]]],
      V: [[[27, 20], [27, 100], 'V10', [30, 220], 'V11', 'V12', 'V13', 'V14', 'V15', 'V17', [31, 400]],
        [[42, 268], 'V41', 'V42', 'V43', 'V44', [62, 400]]],
      IG: [['IG9', 'IG10', 'IG11', 'IG12', 'IG13', 'IG14', 'IG15', [44, 190], [62, 150]]],
      TR: [[[170, 320], 'TR14', [120, 252], 'TR15', [52, 210], 'TR16', 'TR17']],
      GI: [[[172, 300], 'GI15', 'GI16', [104, 226], [76, 216]]],
      VG: [[[0, 400], 'VG12', 'VG13', 'VG14', [0, 200], 'VG15', 'VG16', [0, 60], 'VG20']],
    }, P);
    const d = (p) => [180 + p[0], p[1]];
    const guides = {
      VB20: [{ repere: [180, 120], r: 10, texte: 'sous l’os de l’occiput', ou: [180, 100] }, { ligne: [d([-46, 130]), d([46, 130])], texte: '' }],
      VG16: [{ repere: [180, 120], r: 9, texte: 'sous la bosse de l’occiput', ou: [180, 100] }],
      V10: [{ ligne: [d([16, 150]), d([16, 200])], texte: 'en dehors des muscles de la nuque', ou: [214, 186], ancre: 'start' }],
      VG14: [{ repere: [180, 228], r: 8, texte: 'C7 : la vertèbre qui saille, tête penchée', ou: [196, 214], ancre: 'start' }],
      Dingchuan: [{ mesure: [[180, 239], d([10.3, 239])], texte: '0,5 cun', ou: [214, 250], ancre: 'start' }],
      VB21: [{ ligne: [[180, 239], d([150, 248])], texte: 'à mi-chemin entre C7 et l’épaule', ou: [256, 214], ancre: 'middle' }],
      IG11: [{ ligne: [d([107, 264]), d([84, 379])], texte: 'au tiers supérieur', ou: [290, 330], ancre: 'start' }],
      V13: [{ mesure: [[180, 304], d([31, 304])], texte: '1,5 cun', doigts: 2, cote: -1, ou: [222, 320], ancre: 'start' }],
      V11: [{ mesure: [[180, 261], d([31, 261])], texte: '1,5 cun', doigts: 2, cote: -1, ou: [222, 276], ancre: 'start' }],
      V43: [{ ligne: [d([64, 293]), d([66, 330])], texte: 'bord interne de l’omoplate', ou: [256, 360], ancre: 'start' }],
      TR14: [{ repere: d([152, 248]), r: 8, texte: 'bras levé : creux arrière de l’épaule', ou: [276, 226], ancre: 'middle' }],
    };
    return {
      titre: 'Nuque, épaules et haut du dos',
      legende: 'Vue de dos. Les points sont symétriques de part et d’autre de la colonne.',
      largeur: 360, hauteur: 400, fond, points: bilateral(180, P), traces, guides, axe: 180,
      etiquettes: { VG14: 'g', VG16: 'g', VG13: 'g', VG12: 'g', Dingchuan: 'b', VB20: 'b', IG11: 'b', V10: 'b' },
    };
  };

  // ════════════════════════════════════════════════════════════════════════
  // Le dos et les lombes. Axe x = 170. 1 cun ≈ 19,6. Épineuses :
  // C7 20 · T1 40,5 · T3 81,5 · T7 164 · T12 266 · L2 313 · L4 360 · S2 427.
  // ════════════════════════════════════════════════════════════════════════
  const VERT = { C7: 20, T1: 40.5, T2: 61, T3: 81.5, T4: 102, T5: 123, T6: 143, T7: 164, T8: 184, T9: 205, T10: 225, T11: 246, T12: 266, L1: 290, L2: 313, L3: 336, L4: 360, L5: 383, S1: 408, S2: 427, S3: 446, S4: 466 };
  const sous = (a, b) => (VERT[a] + VERT[b]) / 2;
  VUES.dos = function () {
    const m = miroir(170);
    const corps = [[0, 0], [40, 0], [100, 8], [134, 18], [150, 34], [152, 60], [144, 96], [136, 150], [128, 210],
      [119, 270], [114, 320], [117, 360], [128, 400], [138, 440], [142, 480], [140, 530], [134, 580, true], [0, 580, true]];
    let fond = silhouette([m.contour(corps)]);
    fond += ch('M170 0L170 488', 'det pointille');
    for (const [nom, y] of Object.entries(VERT)) {
      if (nom.startsWith('S')) continue;
      fond += rond([170, y], nom === 'C7' ? 3 : (nom === 'L4' || nom === 'L2' || nom === 'T7' || nom === 'T3' ? 2.4 : 1.7), 'vertebre');
    }
    for (const nom of ['C7', 'T3', 'T7', 'T12', 'L2', 'L4']) fond += texte([158, VERT[nom] + 3.5], nom, 'end');
    // omoplates
    fond += m.deux([[60, 56], [57, 80], [60, 120], [78, 164], [100, 140], [118, 100], [130, 66]], 'det trait-fin');
    fond += m.deux([[57, 81], [90, 58], [120, 38], [140, 28]], 'det');
    // crêtes iliaques, sacrum, fessiers
    fond += m.deux([[34, 410], [60, 368], [92, 352], [118, 362], [132, 390]], 'det');
    fond += rond(m.d([34, 424]), 3, 'repere-creux') + rond(m.g([34, 424]), 3, 'repere-creux');
    fond += m.deux([[36, 404], [22, 450], [6, 482], [0, 492]], 'det trait-fin');
    fond += ch('M170 488L170 580', 'det');
    fond += m.deux([[4, 568], [40, 578], [80, 576], [110, 562]], 'det trait-fin');
    fond += m.deux([[100, 300], [118, 296]], 'det pointille');

    const P = {
      VG14: [0, sous('C7', 'T1')], VG12: [0, sous('T3', 'T4')], VG9: [0, sous('T7', 'T8')], VG4: [0, sous('L2', 'L3')],
      VG3: [0, sous('L4', 'L5')], VG2: [0, 478], VG1: [0, 496], Shiqizhui: [0, sous('L5', 'S1')], Dingchuan: [9.8, sous('C7', 'T1')],
      V11: [29.4, sous('T1', 'T2')], V12: [29.4, sous('T2', 'T3')], V13: [29.4, sous('T3', 'T4')], V14: [29.4, sous('T4', 'T5')],
      V15: [29.4, sous('T5', 'T6')], V17: [29.4, sous('T7', 'T8')], V18: [29.4, sous('T9', 'T10')], V19: [29.4, sous('T10', 'T11')],
      V20: [29.4, sous('T11', 'T12')], V21: [29.4, sous('T12', 'L1')], V22: [29.4, sous('L1', 'L2')], V23: [29.4, sous('L2', 'L3')],
      V24: [29.4, sous('L3', 'L4')], V25: [29.4, sous('L4', 'L5')], V26: [29.4, sous('L5', 'S1')],
      V27: [27, 412], V28: [26, 431], V29: [25, 450], V30: [24, 468],
      V31: [17, 410], V32: [15.5, 429], V33: [14, 448], V34: [12.5, 466], V35: [9, 496],
      V41: [59, sous('T2', 'T3')], V43: [59, sous('T4', 'T5')], V52: [59, sous('L2', 'L3')], V53: [59, 431], V54: [59, 468],
      IG11: [93, 92], IG12: [95, 42], IG13: [64, 56], IG10: [130, 72],
      VB25: [124, 300], VB30: [92, 500], V36: [52, 575],
    };
    const traces = tracesBi(170, {
      V: [[[29.4, 0], 'V11', 'V12', 'V13', 'V14', 'V15', 'V17', 'V18', 'V19', 'V20', 'V21', 'V22', 'V23', 'V24', 'V25', 'V26', 'V27', 'V28', 'V29', 'V30', 'V31', 'V32', 'V33', 'V34', 'V35', [30, 540], 'V36'],
        [[48, 30], 'V41', 'V43', [59, 200], 'V52', [59, 400], 'V53', 'V54', [70, 540], [72, 580]]],
      VG: [['VG1', 'VG2', 'Shiqizhui', 'VG3', 'VG4', [0, 250], 'VG9', 'VG12', 'VG14', [0, 0]]],
      VB: [[[148, 60], [138, 160], [128, 250], 'VB25', [124, 380], [138, 450], [134, 486], 'VB30', [120, 540], [134, 580]]],
      IG: [['IG10', 'IG11', 'IG12', 'IG13', [52, 20], [40, 0]]],
    }, P);
    const d = (p) => [170 + p[0], p[1]];
    const crete = { ligne: [d([-92, 352]), d([92, 352])], texte: 'sommet des crêtes iliaques = L4', ou: [170, 344] };
    const guides = {
      V23: [crete, { repere: [170, 313], r: 7, texte: 'L2 : deux vertèbres plus haut', ou: [190, 300], ancre: 'start' }, { mesure: [[170, P.V23[1]], d([29.4, P.V23[1]])], texte: '1,5 cun', doigts: 2, cote: 1, ou: [214, 336], ancre: 'start' }],
      VG4: [crete, { repere: [170, 313], r: 7, texte: 'sous L2, en face du nombril', ou: [190, 300], ancre: 'start' }],
      V25: [crete, { mesure: [[170, P.V25[1]], d([29.4, P.V25[1]])], texte: '1,5 cun', doigts: 2, cote: 1, ou: [214, 390], ancre: 'start' }],
      V52: [crete, { mesure: [[170, P.V52[1]], d([59, P.V52[1]])], texte: '3 cun', doigts: 4, cote: 1, ou: [240, 336], ancre: 'start' }],
      V13: [{ ligne: [d([-57, 81]), d([57, 81])], texte: 'épine des omoplates ≈ T3', ou: [170, 72] }, { mesure: [[170, P.V13[1]], d([29.4, P.V13[1]])], texte: '1,5 cun', doigts: 2, cote: 1, ou: [214, 112], ancre: 'start' }],
      V15: [{ mesure: [[170, P.V15[1]], d([29.4, P.V15[1]])], texte: '1,5 cun', doigts: 2, cote: 1, ou: [214, 150], ancre: 'start' }],
      V17: [{ ligne: [d([-78, 164]), d([78, 164])], texte: 'pointes des omoplates ≈ T7', ou: [170, 156] }],
      V18: [{ ligne: [d([-78, 164]), d([78, 164])], texte: 'T7, puis deux vertèbres plus bas', ou: [170, 156] }],
      V20: [{ repere: [170, 266], r: 7, texte: 'T12 : dernière vertèbre à côtes', ou: [190, 280], ancre: 'start' }],
      V21: [{ repere: [170, 266], r: 7, texte: 'sous T12', ou: [190, 284], ancre: 'start' }],
      V32: [{ repere: d([34, 424]), r: 7, texte: 'fossettes du bas du dos', ou: [236, 412], ancre: 'start' }],
      Shiqizhui: [crete, { repere: [170, 383], r: 6, texte: 'sous la 5e lombaire', ou: [190, 396], ancre: 'start' }],
      VB30: [{ ligne: [d([140, 505]), [170, 482]], texte: 'du grand trochanter au sacrum : 1/3', ou: [250, 534], ancre: 'middle' }],
      VG14: [{ repere: [170, 20], r: 7, texte: 'C7, la plus saillante', ou: [190, 14], ancre: 'start' }],
    };
    return {
      titre: 'Le dos et les lombes',
      legende: 'Vue de dos. Les points de la Vessie suivent deux lignes, à 1,5 et 3 cun de la colonne.',
      largeur: 340, hauteur: 580, fond, points: bilateral(170, P), traces, guides, axe: 170,
      etiquettes: { VG4: 'g', VG3: 'g', VG9: 'g', VG12: 'g', VG14: 'g', Shiqizhui: 'g', VG2: 'g', VG1: 'g', Dingchuan: 'b' },
    };
  };

  // ════════════════════════════════════════════════════════════════════════
  // Thorax et abdomen, de face. Axe x = 170. Creux sus-sternal y = 40,
  // ombilic y = 410 : 1 cun ≈ 21,8.
  // ════════════════════════════════════════════════════════════════════════
  VUES.tronc = function () {
    const m = miroir(170);
    const c = 21.8;
    const corps = [[0, -6], [30, -6], [34, 12], [60, 26], [110, 36], [148, 46], [166, 66], [170, 100],
      [150, 120], [140, 150], [138, 190], [133, 250], [124, 310], [118, 350], [121, 400], [131, 450],
      [140, 500], [144, 560, true], [0, 560, true]];
    let fond = silhouette([m.contour(corps)]);
    // clavicules, sternum, côtes
    fond += m.deux([[10, 40], [40, 46], [80, 42], [120, 38], [150, 48]], 'det');
    fond += ch('M163 40Q170 47 177 40', 'det');
    fond += ch('M170 46L170 236', 'det pointille');
    fond += m.deux([[6, 236], [40, 262], [80, 300], [112, 336], [126, 352]], 'det pointille');
    fond += m.deux([[8, 214], [50, 226], [90, 212], [128, 190]], 'det trait-fin');
    fond += rond(m.d([87, 180]), 3.2, 'repere') + rond(m.g([87, 180]), 3.2, 'repere');
    fond += ch(ellipse(170, 410, 4.5, 6), 'repere-creux');
    // épines iliaques, plis de l'aine
    fond += m.deux([[96, 450], [72, 478], [44, 502], [20, 520]], 'det trait-fin');
    fond += rond(m.d([98, 452]), 3, 'repere-creux') + rond(m.g([98, 452]), 3, 'repere-creux');
    fond += m.deux([[146, 120], [134, 160]], 'det trait-fin');

    const P = {
      VC22: [0, 44], VC21: [0, 62], VC17: [0, 180], VC15: [0, 258], VC14: [0, 279], VC13: [0, 301], VC12: [0, 323],
      VC10: [0, 366], VC8: [0, 410], VC6: [0, 410 + 1.5 * c], VC4: [0, 410 + 3 * c], VC3: [0, 410 + 4 * c], VC2: [0, 519],
      E12: [87, 34], E13: [87, 52], E15: [87, 104], E16: [87, 140], E17: [87, 180], E18: [87, 206],
      E19: [2 * c, 279], E21: [2 * c, 323], E25: [2 * c, 410], E28: [2 * c, 475], E29: [2 * c, 497], E30: [2 * c, 519],
      R11: [11, 519], R16: [11, 410], R21: [11, 279], R22: [2 * c, 206], R23: [2 * c, 180], R24: [2 * c, 140],
      R25: [2 * c, 104], R26: [2 * c, 72], R27: [2 * c, 52],
      RP12: [76, 518], RP13: [4 * c, 492], RP14: [4 * c, 432], RP15: [4 * c, 410], RP16: [4 * c, 323],
      RP17: [6 * c, 206], RP18: [6 * c, 180], RP19: [6 * c, 140], RP20: [6 * c, 104], RP21: [138, 236],
      P1: [6 * c, 72], P2: [6 * c, 52], MC1: [109, 180], F14: [87, 236], F13: [128, 352], F12: [54, 520],
      VB24: [87, 262], VB25: [128, 300], VB26: [125, 410], VB27: [100, 456], VB28: [96, 470], VB22: [140, 160],
      GI16: [146, 40], GI17: [32, 20], C1: [150, 120],
    };
    const traces = tracesBi(170, {
      VC: [['VC2', 'VC3', 'VC4', 'VC6', 'VC8', 'VC10', 'VC12', 'VC13', 'VC14', 'VC15', 'VC17', 'VC21', 'VC22', [0, -6]]],
      E: [[[56, -6], 'E12', 'E13', [87, 80], 'E15', 'E16', 'E17', 'E18', [68, 250], 'E19', 'E21', [2 * c, 370], 'E25', 'E28', 'E29', 'E30', [52, 560]]],
      R: [[[11, 560], 'R11', 'R16', 'R21', [24, 250], 'R22', 'R23', 'R24', 'R25', 'R26', 'R27']],
      RP: [[[70, 560], 'RP12', 'RP13', 'RP14', 'RP15', 'RP16', [104, 260], 'RP17', 'RP18', 'RP19', 'RP20', [142, 120], [141, 180], 'RP21']],
      F: [[[50, 560], 'F12', [80, 450], [118, 390], 'F13', [108, 290], 'F14']],
      VB: [[[148, 90], 'VB22', [124, 210], 'VB24', 'VB25', [126, 360], 'VB26', 'VB27', 'VB28', [118, 520], [140, 560]]],
      P: [['P1', 'P2', [140, 60], [160, 80]]],
      MC: [['MC1', [130, 168], [150, 150]]],
    }, P);
    const d = (p) => [170 + p[0], p[1]];
    const guides = {
      VC12: [{ ligne: [[170, 236], [170, 410]], texte: '' }, { repere: [170, 236], r: 6, texte: 'pointe du sternum', ou: [190, 230], ancre: 'start' }, { mesure: [[170, 410], [170, 323]], texte: 'à mi-chemin : 4 cun', ou: [190, 368], ancre: 'start' }],
      VC6: [{ mesure: [[170, 410], [170, P.VC6[1]]], texte: '1,5 cun', doigts: 2, cote: 1, ou: [212, 432], ancre: 'start' }],
      VC4: [{ mesure: [[170, 410], [170, P.VC4[1]]], texte: '3 cun', doigts: 4, cote: 1, ou: [214, 448], ancre: 'start' }],
      VC3: [{ mesure: [[170, 410], [170, P.VC3[1]]], texte: '4 cun', ou: [190, 460], ancre: 'start' }],
      E25: [{ mesure: [[170, 410], d([2 * c, 410])], texte: '2 cun', doigts: 3, cote: 1, ou: [200, 392], ancre: 'middle' }],
      VC17: [{ ligne: [d([-87, 180]), d([87, 180])], texte: 'entre les mamelons', ou: [170, 166] }],
      VC22: [{ repere: [170, 44], r: 8, texte: 'le creux au-dessus du sternum', ou: [170, 70] }],
      F14: [{ repere: d([87, 180]), r: 7, texte: 'mamelon', ou: [282, 172], ancre: 'start' }, { mesure: [d([87, 180]), d([87, 236])], texte: '2 côtes plus bas', ou: [266, 214], ancre: 'start' }],
      P1: [{ repere: d([132, 50]), r: 8, texte: 'creux sous la clavicule', ou: [262, 26], ancre: 'middle' }, { mesure: [d([6 * c, 52]), d([6 * c, 72])], texte: '1 cun', ou: [318, 66], ancre: 'end' }],
      R27: [{ ligne: [d([10, 40]), d([40, 46]), d([80, 42])], texte: 'sous la clavicule', ou: [236, 30], ancre: 'start' }],
      F13: [{ repere: d([128, 352]), r: 8, texte: 'extrémité de la 11e côte', ou: [270, 380], ancre: 'middle' }],
    };
    return {
      titre: 'Thorax et abdomen',
      legende: 'Vue de face. Les points sont symétriques de part et d’autre de la ligne médiane.',
      largeur: 340, hauteur: 560, fond, points: bilateral(170, P), traces, guides, axe: 170,
      etiquettes: { VC22: 'g', VC17: 'g', VC12: 'g', VC6: 'g', VC4: 'g', VC3: 'g', VC8: 'g', VC14: 'g', VC10: 'g', VC2: 'g', VC13: 'g', VC15: 'g', VC21: 'g' },
    };
  };

  // ════════════════════════════════════════════════════════════════════════
  // Le genou, de face (genou droit : le côté externe est à gauche).
  // 1 cun ≈ 32 à la cuisse, ≈ 27,7 à la jambe.
  // ════════════════════════════════════════════════════════════════════════
  VUES.genou = function () {
    const contour = [[70, 0], [66, 60], [61, 118], [64, 168], [58, 214], [61, 262], [56, 330], [62, 430, true],
      [230, 430, true], [240, 330], [238, 262], [230, 206], [236, 160], [247, 108], [242, 54], [232, 0, true], [70, 0, true]];
    let fond = silhouette([lisse(contour, true)]);
    fond += ch(ellipse(150, 150, 27, 32), 'os-plein');
    fond += courbe([[140, 182], [142, 210], [146, 236]], 'det tendon');
    fond += courbe([[160, 182], [158, 210], [156, 236]], 'det tendon');
    fond += courbe([[140, 236], [151, 240], [160, 236]], 'det trait-fin');
    fond += courbe([[151, 244], [149, 330], [146, 430]], 'det pointille');
    fond += rond([70, 236], 9, 'det trait-fin');
    fond += courbe([[214, 140], [236, 108], [238, 60]], 'det trait-fin');
    fond += courbe([[86, 120], [70, 80], [66, 30]], 'det trait-fin');
    fond += courbe([[64, 194], [100, 192]], 'det pointille') + courbe([[200, 192], [236, 192]], 'det pointille');
    fond += texte([40, 420], 'ext.', 'start') + texte([260, 420], 'int.', 'end');

    const pos = {
      Heding: [150, 112], RP10: [190, 62], E34: [114, 62], E35: [129, 190], Neixiyan: [171, 190],
      E36: [125, 273], E37: [126, 356], RP9: [215, 262], VB34: [82, 254], E33: [113, 30],
    };
    const traces = tracesSimples({
      E: [[[110, 0], 'E33', 'E34', [122, 140], 'E35', 'E36', 'E37', [128, 430]]],
      RP: [[[218, 430], 'RP9', [222, 200], [212, 120], 'RP10', [182, 0]]],
      VB: [[[60, 0], [60, 140], 'VB34', [80, 430]]],
    }, pos);
    const guides = {
      RP10: [{ mesure: [[176, 124], [190, 62]], texte: '2 cun', doigts: 3, cote: -1, ou: [212, 92], ancre: 'start' }, { repere: [176, 124], r: 6, texte: '', ou: [0, 0] }],
      E34: [{ mesure: [[124, 124], [114, 62]], texte: '2 cun', doigts: 3, cote: 1, ou: [90, 92], ancre: 'end' }],
      E35: [{ ligne: [[140, 182], [146, 236]], texte: 'genou plié : creux en dehors du tendon', ou: [118, 222], ancre: 'end' }],
      Neixiyan: [{ ligne: [[160, 182], [156, 236]], texte: 'creux en dedans du tendon', ou: [186, 222], ancre: 'start' }],
      E36: [{ mesure: [[129, 190], [129, 273]], texte: '3 cun', doigts: 4, cote: -1, ou: [96, 236], ancre: 'end' }, { ligne: [[151, 244], [149, 330]], texte: 'crête du tibia : 1 doigt en dehors', ou: [158, 320], ancre: 'start' }],
      E37: [{ mesure: [[129, 190], [129, 356]], texte: '6 cun', ou: [100, 330], ancre: 'end' }],
      Heding: [{ repere: [150, 118], r: 30, texte: 'au-dessus de la rotule', ou: [150, 72] }],
      RP9: [{ fleche: [[220, 360], [216, 272]], texte: 'remontez le long du tibia jusqu’à la butée', ou: [212, 396], ancre: 'end' }],
      VB34: [{ repere: [70, 236], r: 10, texte: 'tête du péroné', ou: [52, 212], ancre: 'middle' }],
    };
    return {
      titre: 'Le genou, de face',
      legende: 'Genou droit vu de face : l’extérieur est à gauche. Les mêmes points existent sur l’autre genou.',
      largeur: 300, hauteur: 430, fond, points: simple(pos), traces, guides, axe: 150,
      etiquettes: { Heding: 'h', E35: 'g', Neixiyan: 'd', E36: 'g', E37: 'g', E34: 'g', RP10: 'd', RP9: 'd', VB34: 'g', E33: 'g' },
    };
  };

  // ════════════════════════════════════════════════════════════════════════
  // Jambe et pied, face interne (jambe droite, orteils à gauche).
  // RP9 y = 80, malléole interne y = 392 : 13 cun → 1 cun = 24.
  // ════════════════════════════════════════════════════════════════════════
  VUES['jambe-int'] = function () {
    const contour = [[96, 0], [90, 30], [94, 62], [102, 92], [108, 200], [116, 300], [123, 360], [126, 392],
      [118, 404], [88, 420], [52, 433], [22, 438], [10, 446], [8, 456], [18, 466], [50, 468], [80, 464],
      [112, 460], [140, 460], [176, 468], [214, 470], [230, 462], [234, 440], [222, 416], [206, 396],
      [200, 360], [204, 320], [222, 260], [238, 190], [238, 130], [228, 80], [222, 46], [224, 0]];
    let fond = silhouette([lisse(contour, true)]);
    fond += rond([150, 392], 13, 'os-plein');
    fond += courbe([[182, 84], [175, 160], [166, 260], [158, 340], [152, 374]], 'det os');
    fond += courbe([[206, 300], [202, 360], [204, 400]], 'det tendon');
    fond += courbe([[104, 92], [180, 82], [200, 74]], 'det pointille');
    fond += courbe([[96, 18], [100, 46], [96, 70]], 'det trait-fin');
    fond += courbe([[16, 456], [40, 460], [80, 458], [112, 452], [150, 450], [190, 458], [224, 456]], 'det pointille');
    fond += rond([124, 434], 5, 'det trait-fin');
    fond += courbe([[100, 446], [76, 451], [52, 455]], 'det os');
    fond += courbe([[48, 450], [45, 458]], 'det trait-fin');
    fond += courbe([[12, 444], [18, 440], [24, 446]], 'ongle');
    fond += courbe([[218, 46], [228, 52]], 'det');

    const pos = {
      RP9: [181, 82], RP8: [176, 154], RP7: [166, 248], RP6: [161, 320], RP5: [127, 408], RP4: [98, 452], RP3: [60, 459],
      RP2: [37, 461], RP1: [17, 447],
      R2: [124, 452], R3: [176, 392], R4: [185, 407], R5: [176, 418], R6: [150, 416], R7: [184, 344], R8: [168, 344],
      R9: [198, 272], R10: [216, 46], F4: [124, 392], F5: [139, 272], F6: [137, 224], F7: [203, 84], F8: [204, 44],
    };
    const traces = tracesSimples({
      RP: [['RP1', 'RP2', 'RP3', 'RP4', [116, 430], 'RP5', [140, 372], [155, 344], 'RP6', 'RP7', 'RP8', 'RP9', [178, 40], [170, 0]]],
      R: [[[140, 468], 'R2', [158, 438], 'R3', 'R4', 'R5', 'R6', [166, 396], [182, 370], 'R7', 'R9', [214, 150], 'R10', [222, 0]]],
      F: [[[60, 432], [100, 412], 'F4', [130, 340], 'F5', 'F6', [160, 192], [190, 120], 'F7', 'F8', [200, 0]]],
    }, pos);
    const guides = {
      RP6: [{ repere: [150, 392], r: 14, texte: 'malléole interne', ou: [104, 384], ancre: 'end' }, { mesure: [[150, 378], [150, 320]], texte: '3 cun', doigts: 4, cote: -1, ou: [104, 336], ancre: 'end' }, { ligne: [[166, 260], [158, 340]], texte: 'juste derrière le bord du tibia', ou: [180, 300], ancre: 'start' }],
      R3: [{ repere: [150, 392], r: 14, texte: 'malléole interne', ou: [104, 384], ancre: 'end' }, { ligne: [[206, 300], [202, 360], [204, 400]], texte: 'tendon d’Achille', ou: [226, 330], ancre: 'start' }],
      R6: [{ mesure: [[150, 392], [150, 416]], texte: '1 cun', doigts: 1, cote: -1, ou: [120, 426], ancre: 'end' }],
      R7: [{ mesure: [[176, 392], [176, 344]], texte: '2 cun', doigts: 3, cote: -1, ou: [142, 360], ancre: 'end' }],
      RP8: [{ mesure: [[181, 82], [176, 154]], texte: '3 cun', doigts: 4, cote: -1, ou: [150, 118], ancre: 'end' }],
      RP9: [{ fleche: [[170, 200], [180, 92]], texte: 'remontez le bord du tibia jusqu’à la butée', ou: [160, 196], ancre: 'end' }],
      RP4: [{ repere: [100, 446], r: 8, texte: 'base du 1er métatarsien', ou: [100, 492] }, { ligne: [[52, 455], [100, 446]], texte: '' }],
      RP3: [{ repere: [50, 455], r: 7, texte: 'tête du 1er métatarsien', ou: [60, 492] }],
      RP5: [{ repere: [150, 392], r: 14, texte: 'malléole interne', ou: [104, 380], ancre: 'end' }],
      RP1: [{ repere: [18, 442], r: 6, texte: 'coin de l’ongle, côté interne', ou: [20, 492], ancre: 'start' }],
    };
    return {
      titre: 'Jambe et pied, face interne',
      legende: 'Jambe droite vue par l’intérieur, orteils à gauche. Points bilatéraux.',
      largeur: 260, hauteur: 500, fond, points: simple(pos), traces, guides, axe: 300,
      etiquettes: { R3: 'd', R4: 'd', R5: 'b', R7: 'd', R9: 'd', R10: 'd', R8: 'g', F7: 'h', F8: 'g', RP6: 'g', RP5: 'h', RP4: 'h', RP3: 'h', RP2: 'b', RP1: 'h', R2: 'b', R6: 'b', F4: 'g' },
    };
  };

  // ════════════════════════════════════════════════════════════════════════
  // Jambe et pied, face externe (jambe droite, orteils à droite).
  // Pli du genou y = 36, malléole externe y = 420 : 16 cun → 1 cun = 24.
  // ════════════════════════════════════════════════════════════════════════
  VUES['jambe-ext'] = function () {
    const contour = [[76, 0], [80, 36], [72, 100], [62, 170], [70, 250], [92, 330], [100, 380], [98, 420],
      [82, 442], [70, 462], [76, 486], [120, 490], [180, 490], [230, 490], [272, 488], [290, 480],
      [290, 470], [276, 462], [244, 452], [204, 434], [184, 412], [180, 400], [184, 330], [192, 200],
      [200, 92], [210, 52], [206, 0]];
    let fond = silhouette([lisse(contour, true)]);
    fond += rond([124, 420], 14, 'os-plein');
    fond += rond([112, 76], 10, 'os-plein');
    fond += courbe([[114, 86], [118, 200], [122, 330], [124, 404]], 'det os');
    fond += courbe([[198, 92], [192, 200], [186, 330], [182, 398]], 'det pointille');
    fond += courbe([[98, 330], [96, 380], [92, 440]], 'det tendon');
    fond += courbe([[78, 36], [140, 40], [204, 34]], 'det pointille');
    fond += courbe([[206, 40], [204, 60], [200, 90]], 'det tendon');
    fond += courbe([[110, 434], [126, 452], [158, 474]], 'det tendon');
    fond += rond([166, 478], 5, 'det trait-fin');
    fond += courbe([[74, 476], [120, 482], [180, 484], [240, 484], [282, 480]], 'det pointille');
    fond += courbe([[278, 470], [286, 471], [288, 476]], 'ongle');

    const pos = {
      E35: [199, 50], E36: [182, 122], E37: [180, 194], E38: [179, 236], E39: [178, 266], E40: [162, 236], E41: [178, 415],
      E42: [200, 436], E43: [238, 452], E44: [262, 462], VB33: [118, 18], VB34: [124, 94], VB35: [108, 252], VB36: [128, 252],
      VB37: [131, 300], VB38: [131, 324], VB39: [133, 348], VB40: [147, 441], VB41: [206, 458], VB42: [228, 466],
      VB43: [262, 470], V40: [80, 36], V58: [80, 252], V59: [98, 348], V60: [100, 420], V61: [92, 452], V62: [124, 445],
      V63: [150, 474], V64: [172, 484], V65: [238, 486], V66: [262, 486], V67: [284, 478],
    };
    const traces = tracesSimples({
      E: [[[206, 0], 'E35', 'E36', 'E37', 'E38', 'E39', [176, 360], 'E41', 'E42', 'E43', 'E44', [284, 466]]],
      VB: [[[112, 0], 'VB33', 'VB34', [126, 170], 'VB36', 'VB37', 'VB38', 'VB39', [138, 400], 'VB40', 'VB41', 'VB42', 'VB43', [286, 474]]],
      V: [['V40', [70, 130], [74, 200], 'V58', 'V59', 'V60', 'V61', 'V62', 'V63', 'V64', 'V65', 'V66', 'V67']],
    }, pos);
    const guides = {
      E36: [{ mesure: [[199, 50], [199, 122]], texte: '3 cun', doigts: 4, cote: 1, ou: [236, 92], ancre: 'start' }, { ligne: [[198, 92], [192, 200]], texte: 'crête du tibia, 1 doigt en dehors', ou: [210, 160], ancre: 'start' }],
      E37: [{ mesure: [[199, 50], [199, 194]], texte: '6 cun', ou: [224, 160], ancre: 'start' }],
      E40: [{ ligne: [[150, 36], [150, 420]], texte: '' }, { repere: [162, 236], r: 9, texte: 'à mi-hauteur genou–malléole', ou: [154, 214], ancre: 'end' }],
      VB34: [{ repere: [112, 76], r: 11, texte: 'tête du péroné', ou: [100, 60], ancre: 'end' }],
      VB39: [{ repere: [124, 420], r: 15, texte: 'malléole externe', ou: [160, 396], ancre: 'start' }, { mesure: [[133, 404], [133, 348]], texte: '3 cun', doigts: 4, cote: 1, ou: [166, 376], ancre: 'start' }],
      V60: [{ repere: [124, 420], r: 15, texte: 'malléole externe', ou: [160, 396], ancre: 'start' }, { ligne: [[98, 330], [96, 380], [92, 440]], texte: 'tendon d’Achille', ou: [78, 330], ancre: 'end' }],
      V62: [{ repere: [124, 420], r: 15, texte: 'malléole externe', ou: [160, 396], ancre: 'start' }],
      VB40: [{ repere: [124, 420], r: 15, texte: 'malléole externe', ou: [160, 396], ancre: 'start' }],
      E41: [{ ligne: [[150, 404], [196, 420]], texte: 'pli de la cheville, entre les tendons', ou: [190, 396], ancre: 'start' }],
      V67: [{ repere: [282, 474], r: 6, texte: 'coin de l’ongle du petit orteil', ou: [282, 448], ancre: 'end' }],
      V58: [{ mesure: [[100, 420], [80, 252]], texte: '7 cun', ou: [56, 340], ancre: 'end' }],
    };
    return {
      titre: 'Jambe et pied, face externe',
      legende: 'Jambe droite vue par l’extérieur, orteils à droite. Points bilatéraux.',
      largeur: 300, hauteur: 500, fond, points: simple(pos), traces, guides, axe: 150,
      etiquettes: { E36: 'd', E37: 'd', E38: 'd', E39: 'd', E35: 'd', E41: 'h', E40: 'g', VB37: 'g', VB38: 'g', VB39: 'g', VB36: 'd', VB35: 'g', V58: 'g', V59: 'g', V60: 'g', V61: 'b', V62: 'b', V63: 'b', V64: 'b', V65: 'b', V66: 'b', V67: 'h', VB40: 'b', VB41: 'h', VB42: 'h', VB43: 'h', E42: 'h', E43: 'h', E44: 'h' },
    };
  };

  // ════════════════════════════════════════════════════════════════════════
  // L'arrière de la jambe (jambe droite vue de dos : l'intérieur à gauche).
  // Pli du genou y = 110, malléole externe y = 478 : 1 cun = 23.
  // ════════════════════════════════════════════════════════════════════════
  VUES['jambe-arr'] = function () {
    const contour = [[58, 0], [60, 60], [62, 110], [54, 170], [50, 230], [62, 300], [86, 380], [92, 440],
      [88, 470], [96, 506], [116, 528], [144, 528], [164, 506], [176, 486], [180, 470], [172, 440],
      [178, 380], [200, 300], [210, 230], [206, 170], [198, 110], [200, 60], [202, 0]];
    let fond = silhouette([lisse(contour, true)]);
    fond += courbe([[84, 110], [130, 116], [176, 110]], 'det');
    fond += courbe([[86, 130], [70, 200], [92, 280], [124, 312]], 'det trait-fin');
    fond += courbe([[174, 130], [190, 200], [168, 280], [136, 312]], 'det trait-fin');
    fond += courbe([[122, 320], [124, 400], [124, 500]], 'det tendon');
    fond += courbe([[138, 320], [136, 400], [136, 500]], 'det tendon');
    fond += rond([90, 465], 11, 'os-plein');
    fond += rond([174, 478], 11, 'os-plein');
    fond += courbe([[104, 0], [100, 60], [96, 110]], 'det tendon');
    fond += courbe([[160, 0], [166, 60], [170, 110]], 'det tendon');
    fond += texte([40, 520], 'int.', 'start') + texte([220, 520], 'ext.', 'end');

    const pos = {
      V40: [130, 112], V39: [164, 112], V38: [162, 88], V55: [130, 158], V56: [130, 225], V57: [130, 296], V58: [156, 316],
      V59: [160, 410], V60: [158, 478], R3: [104, 465], R7: [101, 419], R9: [100, 350], R10: [92, 110],
    };
    const traces = tracesSimples({
      V: [[[128, 0], 'V40', 'V55', 'V56', 'V57', 'V58', 'V59', 'V60', [162, 520]], [[160, 0], 'V38', 'V39', 'V40']],
      R: [[[106, 520], 'R3', 'R7', 'R9', [96, 240], [94, 160], 'R10', [90, 0]]],
    }, pos);
    const guides = {
      V40: [{ ligne: [[84, 110], [130, 116], [176, 110]], texte: 'pli derrière le genou : au milieu', ou: [130, 140] }],
      V57: [{ ligne: [[92, 280], [124, 312], [136, 312], [168, 280]], texte: 'sur la pointe des pieds : le creux sous les renflements', ou: [130, 340] }],
      V60: [{ repere: [174, 478], r: 12, texte: 'malléole externe', ou: [200, 456], ancre: 'start' }, { ligne: [[136, 400], [136, 500]], texte: '', ou: [0, 0] }],
      R3: [{ repere: [90, 465], r: 12, texte: 'malléole interne', ou: [62, 440], ancre: 'end' }, { ligne: [[124, 400], [124, 500]], texte: '', ou: [0, 0] }],
      R7: [{ mesure: [[104, 465], [104, 419]], texte: '2 cun', doigts: 3, cote: 1, ou: [70, 430], ancre: 'end' }],
      V58: [{ mesure: [[158, 478], [158, 316]], texte: '7 cun au-dessus de V60', ou: [190, 400], ancre: 'start' }],
    };
    return {
      titre: 'L’arrière de la jambe',
      legende: 'Jambe droite vue de dos : l’intérieur est à gauche. Points bilatéraux.',
      largeur: 260, hauteur: 540, fond, points: simple(pos), traces, guides, axe: 130,
      etiquettes: { V40: 'b', V55: 'd', V56: 'd', V57: 'd', V58: 'd', V59: 'd', V60: 'd', R3: 'g', R7: 'g', R9: 'g', R10: 'g', V39: 'd', V38: 'd' },
    };
  };

  // ════════════════════════════════════════════════════════════════════════
  // Le pied : dessus (pied droit vu d'en haut) et plante (le même, de dessous).
  // ════════════════════════════════════════════════════════════════════════
  VUES.pied = function () {
    const orteils = [
      [[57, 132], [56, 52], 33], [[87, 136], [88, 64], 21.5], [[109, 144], [110, 78], 19.5],
      [[128, 154], [129, 94], 18], [[145, 168], [146, 112], 16.5],
    ];
    const dessus = [[42, 120], [38, 156], [42, 220], [50, 280], [56, 330], [52, 372], [56, 400], [58, 440, true],
      [140, 440, true], [142, 400], [150, 384], [146, 340], [150, 300], [158, 250], [160, 190], [154, 160],
      [128, 140], [100, 128], [70, 116]];
    const S = (p) => [350 - p[0], p[1], p[2]];
    const plante = [[42, 120], [38, 156], [44, 220], [60, 280], [66, 320], [60, 360], [62, 396], [80, 420],
      [100, 424], [122, 420], [138, 400], [140, 360], [146, 320], [154, 260], [160, 190], [154, 160],
      [128, 140], [100, 128], [70, 116]].map(S);
    const formes = [lisse(dessus, true), lisse(plante, true)];
    for (const [B, T, w] of orteils) {
      formes.push(polygone(doigt(B, T, w)));
      formes.push(polygone(doigt(S(B), S(T), w)));
    }
    let fond = silhouette(formes);
    // dessus : ongles, métatarsiens, tendons, malléoles
    for (const [B, T, w] of orteils) fond += ongle(B, T, w);
    const meta = [[[60, 268], [55, 150]], [[78, 262], [86, 150]], [[95, 262], [109, 156]], [[112, 266], [128, 164]], [[130, 286], [146, 178]]];
    for (const [a, b] of meta) fond += ch('M' + a[0] + ' ' + a[1] + 'L' + b[0] + ' ' + b[1], 'det os');
    fond += courbe([[88, 360], [72, 260], [58, 150]], 'det tendon');
    fond += courbe([[102, 360], [104, 260], [110, 160]], 'det tendon');
    fond += courbe([[106, 360], [124, 260], [130, 168]], 'det tendon');
    fond += rond([50, 384], 9, 'det trait-fin') + rond([148, 398], 9, 'det trait-fin');
    fond += courbe([[60, 362], [98, 366], [140, 362]], 'det trait-fin');
    fond += texte([96, 456], 'dessus') + texte([254, 456], 'plante');
    // plante : coussinets
    fond += courbe([S([46, 168]), S([100, 152]), S([154, 178])], 'det trait-fin');
    fond += ch(ellipse(254, 386, 34, 26), 'det trait-fin');
    for (const [B, T] of orteils) fond += courbe([S([B[0] - 6, B[1] - 14]), S([B[0] + 6, B[1] - 14])], 'det trait-fin');

    const pos = {
      F1: [69, 76], F2: [73, 133], F3: [71, 222], F4: [62, 352], E41: [94, 364], E42: [92, 300], E43: [99, 178],
      E44: [99, 139], E45: [97, 80], VB40: [140, 370], VB41: [138, 250], VB42: [138, 190], VB43: [137, 152],
      VB44: [136, 110], V67: [153, 126], RP1: [42, 76], R1: [252, 226],
    };
    const traces = tracesSimples({
      F: [['F1', 'F2', 'F3', [66, 300], 'F4', [64, 440]]],
      E: [[[96, 440], 'E41', 'E42', [98, 230], 'E43', 'E44', 'E45']],
      VB: [[[140, 440], 'VB40', 'VB41', 'VB42', 'VB43', 'VB44']],
      RP: [['RP1', [40, 110], [38, 160], [44, 240], [52, 330], [54, 440]]],
      V: [[[154, 330], [158, 230], [158, 160], 'V67']],
      R: [['R1', [270, 280], [290, 330]]],
    }, pos);
    const guides = {
      F3: [{ fleche: [[73, 140], [71, 214]], texte: 'remontez entre les deux os jusqu’à la butée', ou: [30, 250], ancre: 'start' }],
      F2: [{ repere: [73, 124], r: 7, texte: 'la commissure', ou: [20, 150], ancre: 'start' }],
      E44: [{ repere: [99, 130], r: 7, texte: 'entre 2e et 3e orteils', ou: [104, 110], ancre: 'start' }],
      E41: [{ ligne: [[60, 362], [98, 366], [140, 362]], texte: 'pli de la cheville', ou: [96, 344] }],
      VB41: [{ fleche: [[137, 160], [138, 242]], texte: 'remontez entre 4e et 5e métatarsiens', ou: [168, 300], ancre: 'start' }],
      R1: [{ ligne: [[251, 128], [254, 410]], texte: '' }, { repere: [252, 226], r: 12, texte: 'au tiers avant, orteils repliés : le creux', ou: [252, 186] }],
      F1: [{ repere: [65, 66], r: 6, texte: 'coin externe de l’ongle', ou: [20, 30], ancre: 'start' }],
      RP1: [{ repere: [45, 66], r: 6, texte: 'coin interne de l’ongle', ou: [20, 30], ancre: 'start' }],
    };
    return {
      titre: 'Le pied : dessus et plante',
      legende: 'À gauche, le dessus du pied droit (gros orteil à gauche) ; à droite, sa plante. Points bilatéraux.',
      largeur: 350, hauteur: 466, fond, points: simple(pos), traces, guides, axe: 175,
      etiquettes: { F1: 'g', F2: 'g', F3: 'g', F4: 'g', E41: 'b', E42: 'd', E43: 'd', E44: 'd', E45: 'h', VB40: 'd', VB41: 'd', VB42: 'd', VB43: 'd', VB44: 'h', V67: 'd', RP1: 'g', R1: 'd' },
    };
  };

  // ── Accès ────────────────────────────────────────────────────────────────
  const ORDRE = ['visage', 'tete-profil', 'nuque-dos', 'tronc', 'dos', 'main-paume', 'main-dos', 'genou', 'jambe-int', 'jambe-ext', 'jambe-arr', 'pied'];
  const cache = {};
  function planche(id) {
    if (!cache[id]) {
      const v = VUES[id]();
      v.id = id;
      cache[id] = v;
    }
    return cache[id];
  }
  /* Les vues de détail où figure un point, la plus précise d'abord. */
  function vuesDuPoint(idPoint) {
    return ORDRE.filter((id) => planche(id).points[idPoint]);
  }

  racine.Regions = { liste: () => ORDRE.slice(), planche, vuesDuPoint };

})(window);
