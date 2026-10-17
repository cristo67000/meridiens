'use strict';
/*
 * Le corps entier, de face et de dos.
 *
 * Une seule silhouette sert aux deux vues : un corps debout en position
 * anatomique (paumes vers l'avant, bras légèrement écartés), symétrique. On la
 * décrit pour la moitié qui s'éloigne de l'axe, en « dx » — la distance à la
 * ligne médiane — puis on la reflète. Les méridiens étant bilatéraux, leurs
 * tracés se reflètent de même.
 *
 * Les proportions suivent les mesures du cun proportionnel (« gu du ») :
 *   creux sus-sternal → jonction xipho-sternale   9 cun
 *   jonction xipho-sternale → ombilic             8 cun
 *   ombilic → bord supérieur du pubis             5 cun
 *   entre les deux mamelons                       8 cun
 *   pli du coude → pli du poignet                12 cun
 *   pubis → épicondyle médial du fémur           18 cun
 *   pli du genou → malléole externe              16 cun
 * Le cun vaut ainsi ~14,3 unités sur le tronc, ~13,4 à la cuisse, ~11,6 à la
 * jambe, ~11,7 à l'avant-bras : chaque segment a le sien, c'est le principe.
 */
(function (racine) {

  const { axe, sur, lerp, incline, lisse, polygone, capsule, ellipse } = racine.Geo;

  const CX = 220;
  const LARGEUR = 440;
  const HAUTEUR = 1014;

  // ── Repères du tronc (ordonnées) ──────────────────────────────────────────
  const Y = {
    vertex: 20, sourcils: 77, yeux: 86, nez: 106, bouche: 122, menton: 148,
    sternum: 192, mamelons: 285, xiphoide: 321, ombilic: 435, pubis: 507,
    rotule: 728, genou: 755, malleoleExt: 941, malleoleInt: 935, plante: 1004,
  };
  const CUN = 14.3;           // tronc
  const CUN_JAMBE = 11.6;      // pli du genou → malléole

  // ── Le bras : trois axes ──────────────────────────────────────────────────
  const EPAULE = [104, 206];
  const COUDE = [132, 371];
  const POIGNET = [166, 507];
  const BRAS = axe(EPAULE, COUDE);
  const AVB = axe(COUDE, POIGNET);
  const CUN_AVB = AVB.l / 12;
  const bras = (s, o) => sur(BRAS, s, o);
  const avb = (s, o) => sur(AVB, s, o);
  const main = (s, o) => sur(AVB, AVB.l + s, o);
  const pliPoignet = (o) => avb(AVB.l, o);

  // ── La silhouette (moitié qui s'écarte de l'axe) ─────────────────────────
  const TRONC = [
    [0, 20], [18, 22], [31, 29], [39, 41], [42, 56], [43, 72], [42, 88], [40, 101], [37, 112],
    [33, 121], [28, 129], [25.5, 140], [25, 156], [26.5, 168], [34, 177], [50, 183], [70, 187],
    [88, 191], [100, 195], [107, 210], [101, 238], [97.5, 256], [96, 274], [94, 293], [90.5, 315],
    [85.5, 340], [80.5, 364], [78.5, 385], [79, 405], [82, 426], [87, 448], [92, 470], [96, 492],
    [98, 513], [98, 532], [96.5, 556], [93, 590], [88, 630], [82, 668], [76.5, 702], [72.5, 728],
    [70.5, 750], [71, 768], [74, 790], [75, 812], [72.5, 840], [66.5, 869], [59, 897], [53, 918],
    [50.5, 931], [53.5, 941], [56, 952], [58.5, 966], [60.5, 982], [60.5, 994], [57, 1001],
    [47, 1004.5], [34, 1005], [24, 1004], [18, 999.5], [16, 990], [16.5, 975], [17.5, 958],
    [18, 946], [16, 936], [18.5, 925], [19, 905], [17, 876], [15, 846], [14, 816], [15, 790],
    [18, 770], [18.5, 750], [16.5, 725], [13.5, 695], [10.5, 660], [7.5, 620], [4.5, 581],
    [2, 553], [0, 544, true],
  ];

  const OREILLE = [[39, 80], [44, 77], [47.5, 82], [47, 93], [45, 104], [42, 110], [39, 108]];

  const BRAS_CONTOUR = [
    [94, 193], [104, 196.5], bras(1, 21.5), bras(17, 25.5), bras(45, 25), bras(80, 22.6),
    bras(118, 20.5), bras(148, 19.6), bras(165, 21.4),
    avb(13, 22.5), avb(38, 21.2), avb(72, 18.2), avb(106, 15.8), avb(134, 14.8), avb(141, 14.4, true),
    avb(141, -13.8, true), avb(128, -14.2), avb(96, -15.6), avb(62, -17.6), avb(28, -19.5), avb(7, -21.2),
    bras(167, -22.6), bras(150, -19.9), bras(120, -19.6), bras(86, -20.4), bras(55, -21.2), bras(36, -19.5),
    [92, 232], [89, 210],
  ];

  const PAUME = [
    avb(134, 14.8), main(6, 17.8), main(15, 20.6), main(27, 21), main(38, 19.2), main(46, 17.4),
    main(49.5, 10), main(50, 0), main(48, -9), main(44.5, -16.8), main(36, -19.2), main(22, -18.8),
    main(8, -16.2), avb(134, -14.2),
  ];

  // Les doigts : base sur la ligne des métacarpo-phalangiennes, longueur, largeur, inclinaison.
  const DOIGTS = {
    pouce: { B: main(17, 21.2), v: incline(AVB, 13), l: 41, w: 12.6 },
    index: { B: main(43, 13.6), v: incline(AVB, 3), l: 46, w: 9.7 },
    majeur: { B: main(44, 4.1), v: incline(AVB, 0), l: 51, w: 10.1 },
    annulaire: { B: main(43, -5.4), v: incline(AVB, -3), l: 48, w: 9.7 },
    auriculaire: { B: main(40, -14), v: incline(AVB, -7.5), l: 38, w: 8.6 },
  };
  const bout = (d, recul, cote) => {
    const D = DOIGTS[d];
    const n = [D.v[1], -D.v[0]];
    const s = D.l - (recul || 0);
    return [D.B[0] + D.v[0] * s + n[0] * (cote || 0), D.B[1] + D.v[1] * s + n[1] * (cote || 0)];
  };

  // ── Reflet ────────────────────────────────────────────────────────────────
  const droite = (p) => [CX + p[0], p[1]];
  const gauche = (p) => [CX - p[0], p[1]];
  const deuxCotes = (pts) => [pts.map(droite), pts.map(gauche)];

  function contourCorps() {
    const moitie = TRONC.map(droite);
    const autre = TRONC.slice(1, -1).reverse().map(gauche);
    return lisse(moitie.concat(autre), true);
  }

  // Les formes qui composent le corps : leur réunion fait la silhouette.
  function formes() {
    const f = [contourCorps()];
    for (const cote of [droite, gauche]) {
      f.push(lisse(OREILLE.map(cote), true));
      f.push(lisse(BRAS_CONTOUR.map(cote), true));
      f.push(lisse(PAUME.map(cote), true));
      for (const d of Object.values(DOIGTS)) f.push(polygone(capsule(d.B, d.v, d.l, d.w).map(cote)));
    }
    return f;
  }

  /* La réunion des formes, dessinée sans couture : les traits de toutes les
   * formes d'abord (deux fois plus épais que voulu), les remplissages ensuite
   * par-dessus. Seule la moitié extérieure du trait de bord reste visible. */
  function silhouette() {
    const f = formes();
    return '<g class="sil-trait">' + f.map((d) => '<path d="' + d + '"/>').join('') + '</g>'
      + '<g class="sil-peau">' + f.map((d) => '<path d="' + d + '"/>').join('') + '</g>';
  }

  const chemin = (d, classe) => '<path class="' + (classe || 'det') + '" d="' + d + '"/>';
  const deux = (pts, classe, ferme) => chemin(lisse(pts.map(droite), ferme), classe) + chemin(lisse(pts.map(gauche), ferme), classe);
  const rond = (p, r, classe) => '<circle class="' + (classe || 'det') + '" cx="' + (CX + p[0]) + '" cy="' + p[1] + '" r="' + r + '"/>'
    + (p[0] ? '<circle class="' + (classe || 'det') + '" cx="' + (CX - p[0]) + '" cy="' + p[1] + '" r="' + r + '"/>' : '');

  // ── Détails, vue de face ─────────────────────────────────────────────────
  function detailsFace() {
    let s = '';
    // chevelure
    const cheveux = [[40.5, 64], [42.5, 56], [39.4, 41], [31.4, 29.2], [18, 22.2], [0, 20.2],
      [-18, 22.2], [-31.4, 29.2], [-39.4, 41], [-42.5, 56], [-40.5, 64], [-37, 59], [-33, 50], [-21, 44.5],
      [0, 43], [21, 44.5], [33, 50], [37, 59]];
    s += chemin(lisse(cheveux.map(droite), true), 'cheveux');
    // visage
    s += deux([[5, 78.5], [11, 75.6], [18, 75], [26.5, 77]], 'det trait-fin');
    s += deux([[6, 86.2], [10, 83.4], [16, 82.6], [21, 84], [25, 86.4], [20.5, 88.8], [15, 89.4], [9.5, 88.2]], 'det', true);
    s += rond([15.3, 86.2], 2.1, 'iris');
    s += chemin(lisse([droite([4.6, 84]), droite([6.8, 96]), droite([8.4, 104]), droite([6.4, 108.6]), droite([2.5, 107.6])]), 'det');
    s += deux([[3.5, 108], [6.5, 109.8], [9.7, 107.4], [9.2, 104]], 'det trait-fin');
    s += chemin(lisse([gauche([12.5, 122.4]), gauche([6, 120.6]), [CX, 121.6], droite([6, 120.6]), droite([12.5, 122.4])]), 'det');
    s += chemin(lisse([gauche([7, 126.5]), [CX, 128.6], droite([7, 126.5])]), 'det trait-fin');
    s += deux([[37.5, 114], [31, 128], [21, 140], [9, 146.6]], 'det trait-fin');
    s += deux([[41, 86], [44.4, 83], [45.6, 92], [43.4, 101], [41.2, 104]], 'det trait-fin');
    // cou, clavicules, poitrine
    s += deux([[28, 118], [22, 150], [8, 188]], 'det trait-fin');
    s += deux([[7, 192], [24, 195.5], [46, 196], [70, 191], [94, 195.5]], 'det');
    s += chemin('M' + (CX - 7) + ' 191.5Q' + CX + ' 197 ' + (CX + 7) + ' 191.5', 'det');
    s += deux([[8, 296], [32, 306], [62, 302], [86, 286], [93, 268]], 'det trait-fin');
    s += rond([57, Y.mamelons], 2.3, 'repere');
    s += deux([[3, 323], [20, 334], [44, 357], [64, 382], [77, 400]], 'det pointille');
    s += chemin('M' + CX + ' 324L' + CX + ' 418', 'det pointille');
    s += chemin(ellipse(CX, Y.ombilic, 2.8, 3.8), 'repere-creux');
    s += deux([[65, 466], [48, 484], [26, 499], [12, 506]], 'det trait-fin');
    // genoux, jambes, pieds
    s += deux(ellipsePts(46, 728, 11.5, 15.5), 'det', true);
    s += deux([[46, 745], [45, 771]], 'det trait-fin');
    s += deux([[44.5, 776], [43, 840], [41.5, 925]], 'det pointille');
    s += deux([[51, 934], [55.5, 940], [52.5, 948]], 'det trait-fin');
    s += deux([[19.5, 928], [16.5, 935], [19.5, 942]], 'det trait-fin');
    for (const dx of [29.5, 37.5, 44.5, 51.5]) s += deux([[dx, 991], [dx + 0.6, 1003.5]], 'det trait-fin');
    // bras : pli du coude, poignet, paume
    s += deux([avb(0, -15), avb(2.5, 0), avb(0, 16)], 'det trait-fin');
    s += deux([avb(AVB.l - 0.5, -13), avb(AVB.l + 0.6, 0), avb(AVB.l - 0.5, 14)], 'det trait-fin');
    s += deux([main(4, 13.5), main(18, 11), main(33, 13.5)], 'det trait-fin');
    s += deux([main(31, -17), main(29, -3), main(36, 12)], 'det trait-fin');
    for (const d of ['index', 'majeur', 'annulaire', 'auriculaire']) {
      const D = DOIGTS[d];
      for (const t of [0.43, 0.7]) {
        const c = bout(d, D.l * (1 - t));
        const n = [D.v[1], -D.v[0]];
        s += deux([[c[0] + n[0] * D.w * 0.32, c[1] + n[1] * D.w * 0.32], [c[0] - n[0] * D.w * 0.32, c[1] - n[1] * D.w * 0.32]], 'det trait-fin');
      }
    }
    return s;
  }

  function ellipsePts(cx, cy, rx, ry) {
    const p = [];
    for (let k = 0; k < 16; k += 1) {
      const a = 2 * Math.PI * k / 16;
      p.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]);
    }
    return p;
  }

  // ── Détails, vue de dos ──────────────────────────────────────────────────
  function detailsDos() {
    let s = '';
    const cheveux = [[41.5, 84], [42.8, 70], [42.4, 56], [39.4, 41], [31.4, 29.2], [18, 22.2], [0, 20.2],
      [-18, 22.2], [-31.4, 29.2], [-39.4, 41], [-42.4, 56], [-42.8, 70], [-41.5, 84], [-39, 100], [-34, 112],
      [-21, 118], [0, 120.5], [21, 118], [34, 112], [39, 100]];
    s += chemin(lisse(cheveux.map(droite), true), 'cheveux');
    s += deux([[42, 84], [44.6, 82], [45.4, 93], [43, 102]], 'det trait-fin');
    // nuque, colonne
    s += deux([[24, 128], [21, 156], [36, 178]], 'det trait-fin');
    s += chemin('M' + CX + ' 172L' + CX + ' 506', 'det pointille');
    for (const y of VERTEBRES) s += '<circle class="vertebre" cx="' + CX + '" cy="' + y + '" r="' + (y === 172 ? 2.6 : 1.4) + '"/>';
    // omoplates
    s += deux([[52, 199], [45, 216], [45.5, 246], [58, 277], [72, 262], [88, 238], [97, 222]], 'det trait-fin');
    s += deux([[45, 217], [70, 207], [98, 200]], 'det');
    // crêtes iliaques, sacrum, fessiers
    s += deux([[22, 447], [42, 424], [66, 414], [86, 430]], 'det trait-fin');
    s += rond([18, 455], 2, 'repere-creux');
    s += deux([[19, 457], [10, 490], [0.5, 514]], 'det trait-fin');
    s += chemin('M' + CX + ' 510L' + CX + ' 548', 'det');
    s += deux([[5, 552], [26, 563], [52, 566], [76, 557]], 'det');
    // genoux, mollets, chevilles
    s += deux([[28, 755], [44, 757.5], [61, 754]], 'det');
    s += deux([[34, 772], [31, 800], [35, 838], [40, 856]], 'det trait-fin');
    s += deux([[56, 772], [61, 800], [55, 838], [47, 856]], 'det trait-fin');
    s += deux([[37, 868], [38, 932]], 'det trait-fin');
    s += deux([[46, 868], [45, 932]], 'det trait-fin');
    s += deux([[51, 934], [55.5, 940], [52.5, 948]], 'det trait-fin');
    s += deux([[19.5, 928], [16.5, 935], [19.5, 942]], 'det trait-fin');
    s += deux([[27, 962], [33, 990], [44, 992], [51, 965]], 'det trait-fin');
    // coude, ongles
    s += deux([bras(160, -7), bras(168, 0), bras(160, 7)], 'det trait-fin');
    for (const d of ['index', 'majeur', 'annulaire', 'auriculaire', 'pouce']) {
      const D = DOIGTS[d];
      const ongle = capsule(bout(d, 11), D.v, 9.5, D.w * 0.62);
      s += chemin(polygone(ongle.map(droite)), 'ongle') + chemin(polygone(ongle.map(gauche)), 'ongle');
    }
    s += deux([main(48, 12), main(48.5, 3.5), main(47.5, -5.5), main(44.5, -13.6)], 'det pointille');
    return s;
  }

  const VERTEBRES = [172, 187, 202, 217, 232, 247, 262, 277, 292, 307, 322, 337, 352, 369, 386, 403, 420, 437];
  // C7, T1…T12, L1…L5 : épineuses

  // ── Positions des points (dx, y) ─────────────────────────────────────────
  // Repérées sur les bras par leurs axes, ailleurs par les mesures en cun.
  const P5 = avb(0, 7);
  const P9 = pliPoignet(11);
  const GI11 = avb(0, 19.5);
  const GI5 = main(1, 15.5);

  const FACE = {
    // tête
    VG20: [0, 21], VG24: [0, 47], VG25: [0, 104], VG26: [0, 114], Yintang: [0, 79], VC24: [0, 133],
    V1: [6, 84], V2: [7, 77], V3: [7, 43], Yuyao: [15.3, 75.6], TR23: [27, 77], VB1: [29.5, 87],
    E1: [15.3, 92], E2: [15.3, 96.5], E3: [15.3, 105.5], GI20: [11.2, 106], GI19: [7, 112], Bitong: [9.4, 99],
    E4: [15.5, 122], VB14: [15.3, 67], VB15: [15.3, 45], VB13: [27, 47], E8: [32, 47], Taiyang: [36, 83],
    E6: [31.5, 119.5], E7: [38.5, 96], IG19: [40.5, 92], VB2: [40.5, 99], TR21: [40, 86], IG18: [25, 101],
    IG17: [33.5, 127], E5: [24.5, 137],
    // cou, poitrine, abdomen
    VC22: [0, 196], VC17: [0, Y.mamelons + 1], VC14: [0, 349], VC12: [0, 378], VC8: [0, Y.ombilic],
    VC6: [0, 457], VC4: [0, 478], VC3: [0, 492], VC2: [0, 507],
    E9: [17, 163], E11: [12.5, 190], E12: [57, 186], E13: [57, 205], E15: [57, 240], E16: [57, 262],
    E17: [57, Y.mamelons], E18: [57, 303], E19: [28.6, 349], E21: [28.6, 378], E25: [28.6, Y.ombilic],
    E28: [28.6, 478], E29: [28.6, 492], E30: [28.6, 505],
    R27: [28.6, 200], R26: [28.6, 218], R25: [28.6, 240], R24: [28.6, 262], R23: [28.6, 284], R22: [28.6, 303],
    R21: [7, 349], R16: [7, Y.ombilic], R11: [7, 505],
    P1: [86, 222], P2: [88, 206.5], MC1: [71, 284], C1: [97.5, 252],
    RP12: [50, 502], RP13: [57, 489], RP14: [57, 450], RP15: [57, Y.ombilic], RP16: [57, 378],
    RP17: [86, 303], RP18: [86, 284], RP19: [86, 262], RP20: [86, 240], RP21: [95, 328],
    F12: [36, 505], F13: [82, 412], F14: [57, 322],
    GI15: [111, 211], GI16: [90, 193], GI17: [24.5, 180], GI18: [23.5, 165],
    VB21: [52, 183], VB22: [96, 292], VB23: [91, 300], VB24: [57, 340], VB25: [84, 405], VB26: [86, Y.ombilic],
    VB27: [70, 462], VB28: [66, 473], VB29: [91, 500],
    // jambes
    E31: [64, 545], E32: [62.5, 632], E34: [60, 686], E35: [57, 752], E36: [55, 787], E37: [54, 822],
    E38: [54, 845], E39: [53, 857], E40: [61, 845], E41: [41, 942], E42: [40.5, 957], E43: [37, 978],
    E44: [37.5, 992], E45: [40.5, 1002], Heding: [46, 708], Neixiyan: [35, 752],
    RP1: [19, 1001], RP2: [17.5, 990], RP3: [17.5, 980], RP4: [17.8, 968], RP5: [23, 944], RP6: [22, 900],
    RP7: [21, 866], RP8: [20, 820], RP9: [20.5, 782], RP10: [24, 686], RP11: [32, 610],
    F1: [27, 1003], F2: [30, 991], F3: [30, 976], F4: [27.5, 946], F5: [33, 880], F6: [31, 856], F7: [20, 790],
    F8: [18, 756], F9: [16.5, 700], F10: [14.5, 560], F11: [17, 535],
    VB31: [91, 632], VB32: [89, 662], VB33: [72, 738], VB34: [67, 780], VB35: [62, 858], VB37: [59, 883],
    VB38: [57, 894], VB39: [55, 906], VB40: [52.5, 950], VB41: [51, 976], VB42: [52.5, 982], VB43: [52, 993],
    VB44: [52.5, 1002], R6: [17, 947], R10: [16.5, 757],
    // bras, face antérieure
    P3: bras(78, 10), P4: bras(98, 9.5), P5, P6: lerp(P5, P9, 5 / 12), P7: avb(AVB.l - 1.5 * CUN_AVB, 12.4),
    P8: avb(AVB.l - CUN_AVB, 12), P9, P10: main(16, 20), P11: bout('pouce', 3, 5.2),
    MC2: bras(68, -1), MC3: avb(1, -5), MC4: avb(AVB.l - 5 * CUN_AVB, -0.5), MC5: avb(AVB.l - 3 * CUN_AVB, 0),
    MC6: avb(AVB.l - 2 * CUN_AVB, 0), MC7: pliPoignet(0), MC8: main(27, 4.5), MC9: bout('majeur', 1),
    C2: bras(128, -18.5), C3: avb(2, -18), C4: avb(AVB.l - 1.5 * CUN_AVB, -10.5), C5: avb(AVB.l - CUN_AVB, -10.5),
    C6: avb(AVB.l - 0.5 * CUN_AVB, -10.5), C7: pliPoignet(-10.5), C8: main(27, -11), C9: bout('auriculaire', 2.5, 4),
    GI11, GI12: bras(152, 20.5), GI13: bras(128, 21.5), GI14: bras(76, 24.5),
  };

  const DOS = {
    VG1: [0, 517], VG2: [0, 505], VG3: [0, 428], VG4: [0, 394], VG9: [0, 284], VG14: [0, 180],
    VG15: [0, 119], VG16: [0, 110.5], VG17: [0, 92], VG19: [0, 52], VG20: [0, 21],
    VB20: [22.5, 113], V10: [13, 124.5], V9: [13, 92], Anmian: [32.5, 108], VB12: [36.5, 109], VB19: [15.5, 92],
    VB18: [16.5, 70], VB17: [17, 50], VB21: [52, 183], VB30: [65, 511],
    Dingchuan: [7.2, 180], Shiqizhui: [0, 446],
    V11: [21.4, 195], V12: [21.4, 210], V13: [21.4, 224], V15: [21.4, 254], V17: [21.4, 284], V18: [21.4, 314],
    V20: [21.4, 344], V21: [21.4, 360], V23: [21.4, 394], V25: [21.4, 428], V27: [17.5, 458], V28: [16.5, 472],
    V29: [15.5, 486], V30: [14.5, 500], V31: [10.5, 459], V32: [9.8, 472], V33: [9, 486], V34: [8.2, 499],
    V35: [5, 516], V36: [42, 563], V37: [43, 640], V38: [53, 741], V39: [53.5, 755], V40: [44, 756],
    V41: [43, 202], V43: [43, 232], V52: [43, 386], V53: [43, 470], V54: [42, 500],
    V55: [44, 779], V56: [43.5, 810], V57: [43, 850], V58: [50, 868], V59: [51.5, 906], V60: [50, 940],
    V61: [51, 961], V62: [56.5, 952],
    R2: [20, 975], R3: [27, 937.5], R4: [25.5, 949], R5: [23.5, 954], R7: [28.5, 913], R8: [23.5, 912],
    R9: [27, 880], R10: [29, 756],
    IG9: [100, 251], IG10: [89, 224], IG11: [68, 240], IG12: [66.5, 209], IG13: [50, 208], IG14: [40, 188],
    IG15: [28, 180], IG16: [27, 150], IG17: [33.5, 128],
    TR14: [106, 213], TR15: [57, 203], TR16: [30, 141], TR17: [37.5, 104],
    VB33: [74, 740], VB34: [68, 780], VB39: [55.5, 906], VB40: [53.5, 950], VB31: [91, 632],
    // bras, face postérieure
    GI1: bout('index', 2.5, 4), GI2: main(52, 18.4), GI3: main(44, 18.6), GI4: main(24, 15.2), GI5,
    GI6: avb(AVB.l - 3 * CUN_AVB, 15.4), GI7: avb(AVB.l - 5 * CUN_AVB, 16.6), GI10: lerp(GI11, GI5, 2 / 12), GI11,
    GI12: bras(152, 20.5), GI13: bras(128, 21.5), GI14: bras(76, 24.5), GI15: [109, 208], GI16: [89, 196],
    TR1: bout('annulaire', 2.5, -4), TR2: main(45, -9.6), TR3: main(36, -10), TR4: pliPoignet(-1),
    TR5: avb(AVB.l - 2 * CUN_AVB, -0.5), TR6: avb(AVB.l - 3 * CUN_AVB, -0.5), TR8: avb(AVB.l - 4 * CUN_AVB, -0.5),
    TR10: bras(156, 0), TR11: bras(140, 0), TR12: bras(104, 0.5), TR13: bras(62, 2),
    IG1: bout('auriculaire', 2.5, -3.6), IG2: main(46, -18.6), IG3: main(39, -19.6), IG4: main(8, -17.6),
    IG5: pliPoignet(-14.6), IG6: avb(AVB.l - 0.9 * CUN_AVB, -8.6), IG7: avb(AVB.l - 5 * CUN_AVB, -15.8),
    IG8: avb(-1, -14.5), Luozhen: main(39, 8.6), Yaotongdian: main(21, 8.4), Yaotongdian2: main(21, -9.2),
  };

  // ── Tracés des méridiens ─────────────────────────────────────────────────
  // Des noms de points ou des coordonnées, dans le sens où circule le Qi.
  // Plusieurs sous-tracés par méridien quand il se ramifie.
  const TRACES = {
    face: {
      P: [['P1', 'P2', [98, 213], bras(30, 13), bras(55, 11), 'P3', 'P4', bras(135, 8.5), 'P5', avb(40, 9),
        'P6', avb(102, 11.6), 'P7', 'P8', 'P9', main(8, 19.5), 'P10', main(27, 23.5), bout('pouce', 16, 5.6), 'P11']],
      GI: [['GI11', 'GI12', 'GI13', bras(100, 24), 'GI14', bras(45, 25.5), bras(18, 24), 'GI15', [100, 196], 'GI16',
        [64, 189], [36, 184], 'GI17', 'GI18', [22.5, 143], [16.5, 128], [9, 119], 'VG26', [-7, 112], [-11.2, 106]]],
      E: [['E1', 'E2', 'E3', [15.4, 113], 'E4', [20, 131], 'E5', [29, 129], 'E6', [35.5, 108], 'E7', [37.5, 75], [35.5, 58], 'E8'],
        ['E5', [21, 150], 'E9', [14.5, 176], 'E11', [30, 189], 'E12', 'E13', [57, 222], 'E15', 'E16', 'E17', 'E18',
          [44, 325], 'E19', 'E21', [28.6, 405], 'E25', 'E28', 'E29', 'E30', [45, 520], 'E31', [63.5, 590], 'E32',
          [61, 665], 'E34', [59.5, 718], 'E35', 'E36', 'E37', 'E38', 'E39', [49, 890], [43, 925], 'E41', 'E42', 'E43', 'E44', 'E45']],
      RP: [['RP1', 'RP2', 'RP3', 'RP4', [19.5, 955], 'RP5', [22.5, 925], 'RP6', 'RP7', 'RP8', 'RP9', [20.5, 745], [22, 712],
        'RP10', [28, 650], 'RP11', [42, 550], 'RP12', 'RP13', 'RP14', 'RP15', [57, 410], 'RP16', [72, 340], 'RP17',
        'RP18', 'RP19', 'RP20', [94, 260], [96.5, 292], 'RP21']],
      C: [['C1', bras(62, -17.5), bras(100, -18.5), 'C2', bras(155, -19), 'C3', avb(40, -15.5), avb(85, -12.5),
        'C4', 'C5', 'C6', 'C7', main(12, -12.5), 'C8', main(40, -12.5), bout('auriculaire', 18, 3.8), 'C9']],
      R: [[[19, 952], [18.5, 925], [16.5, 880], [15.5, 820], [16, 790], 'R10', [13, 680], [9.5, 600], [7, 545], 'R11',
        [7, 470], 'R16', [7, 390], 'R21', 'R22', 'R23', 'R24', 'R25', 'R26', 'R27']],
      MC: [['MC1', [84, 276], [96, 266], bras(50, -6), 'MC2', bras(110, -3), bras(150, -4), 'MC3', avb(40, -2.5),
        'MC4', 'MC5', 'MC6', 'MC7', main(12, 3), 'MC8', main(45, 4.2), 'MC9']],
      TR: [['TR21', [37.5, 80.5], 'TR23']],
      IG: [[[31, 150], 'IG17', [29, 113], 'IG18', [33, 96], 'IG19']],
      V: [['V1', 'V2', [7, 60], 'V3', [11, 40], [12, 28]]],
      VB: [['VB1', [35, 92], 'VB2', [42, 86], [41.5, 70], [37, 58], [36, 50], 'VB13', [22, 58], 'VB14', 'VB15', [16, 32]],
        ['VB21', [80, 210], [98, 262], 'VB22', 'VB23', [75, 320], 'VB24', [72, 370], 'VB25', 'VB26', 'VB27', 'VB28',
          [82, 488], 'VB29', [95, 540], [94, 590], 'VB31', 'VB32', [78, 715], 'VB33', 'VB34', [64.5, 820],
          'VB35', 'VB37', 'VB38', 'VB39', [53.5, 930], 'VB40', 'VB41', 'VB42', 'VB43', 'VB44']],
      F: [['F1', 'F2', 'F3', [29, 962], 'F4', [31, 915], 'F5', 'F6', [25, 830], 'F7', 'F8', 'F9', [15.5, 640],
        'F10', 'F11', 'F12', [56, 470], [76, 438], 'F13', [72, 365], 'F14']],
      VC: [['VC2', 'VC3', 'VC4', 'VC6', 'VC8', 'VC12', 'VC14', 'VC17', 'VC22', [0, 168], [0, 145], 'VC24']],
      VG: [['VG20', [0, 33], 'VG24', [0, 65], [0, 80], [0, 95], 'VG25', 'VG26', [0, 118]]],
    },
    dos: {
      GI: [['GI1', bout('index', 18, 4.8), 'GI2', 'GI3', main(33, 17.8), 'GI4', main(12, 16.2), 'GI5', 'GI6', 'GI7',
        avb(48, 19.2), 'GI10', 'GI11', 'GI12', 'GI13', bras(100, 24), 'GI14', bras(45, 25.5), bras(18, 24), 'GI15', 'GI16']],
      IG: [['IG1', bout('auriculaire', 16, -4), 'IG2', 'IG3', main(22, -18.8), 'IG4', 'IG5', 'IG6', avb(105, -12), 'IG7',
        avb(35, -17), 'IG8', bras(150, -15), bras(115, -16), bras(80, -18), bras(55, -19), 'IG9', 'IG10', 'IG11',
        'IG12', 'IG13', 'IG14', 'IG15', 'IG16', 'IG17']],
      TR: [['TR1', bout('annulaire', 16, -4.4), 'TR2', 'TR3', main(18, -5.5), 'TR4', 'TR5', 'TR6', 'TR8', avb(38, 0),
        avb(5, 0), 'TR10', 'TR11', 'TR12', 'TR13', bras(25, 6), 'TR14', [84, 205], 'TR15', [40, 172], 'TR16', 'TR17',
        [41.5, 98], [43, 84]]],
      V: [[[12, 28], [12.5, 60], 'V9', 'V10', [17, 160], 'V11', 'V12', 'V13', 'V15', 'V17', 'V18', 'V20', 'V21',
        'V23', 'V25', 'V27', 'V28', 'V29', 'V30', 'V31', 'V32', 'V33', 'V34', 'V35', [22, 535], 'V36', 'V37',
        [44, 700], 'V40'],
        [[24, 186], 'V41', 'V43', [43, 300], 'V52', [43, 430], 'V53', 'V54', [56, 560], [57, 650], 'V38', 'V39', 'V40'],
        ['V40', 'V55', 'V56', 'V57', 'V58', [51.5, 890], 'V59', 'V60', 'V61', 'V62', [59.5, 965], [61.5, 980], [60.5, 994]]],
      R: [[[24, 990], 'R2', [22.5, 960], 'R5', 'R4', 'R3', 'R8', 'R7', 'R9', [27, 830], [28, 790], 'R10', [24, 700],
        [17, 620], [9, 555]]],
      VB: [[[43, 72], [42, 88], [39.5, 101], 'VB12'],
        [[17, 30], 'VB17', 'VB18', 'VB19', 'VB20', [30, 145], [40, 172], 'VB21', [88, 220], [98, 272], [93, 320],
          [86, 380], [85, 430], [91, 470], [93, 495], 'VB30', [90, 560], [95, 600], 'VB31', [88, 680], 'VB33', 'VB34',
          [64, 830], [58, 880], 'VB39', [54, 930], 'VB40']],
      VG: [['VG1', 'VG2', [0, 470], 'VG3', 'VG4', [0, 340], 'VG9', [0, 230], 'VG14', [0, 150], 'VG15', 'VG16',
        'VG17', [0, 70], 'VG19', [0, 35], 'VG20']],
    },
  };

  // Le méridien est montré d'abord dans la vue où il se voit le mieux.
  const VUE_PRINCIPALE = {
    P: 'face', GI: 'dos', E: 'face', RP: 'face', C: 'face', IG: 'dos', V: 'dos',
    R: 'face', MC: 'face', TR: 'dos', VB: 'face', F: 'face', VC: 'face', VG: 'dos',
  };

  // ── Assemblage des planches ──────────────────────────────────────────────
  function resoudre(vue, item) {
    if (typeof item === 'string') {
      const p = (vue === 'face' ? FACE : DOS)[item];
      if (!p) throw new Error('point sans position sur la vue ' + vue + ' : ' + item);
      return p;
    }
    return item;
  }

  function planche(vue) {
    const positions = vue === 'face' ? FACE : DOS;
    const points = {};
    for (const [id, p] of Object.entries(positions)) points[id] = p[0] ? [droite(p), gauche(p)] : [droite(p)];
    const traces = {};
    for (const [m, sous] of Object.entries(TRACES[vue])) {
      traces[m] = [];
      for (const t of sous) {
        const pts = t.map((item) => resoudre(vue, item));
        traces[m].push(pts.map(droite));
        if (m !== 'VC' && m !== 'VG') traces[m].push(pts.map(gauche));
      }
    }
    return {
      id: 'corps-' + vue,
      vue,
      titre: vue === 'face' ? 'Le corps, face antérieure' : 'Le corps, face postérieure',
      largeur: LARGEUR,
      hauteur: HAUTEUR,
      fond: silhouette() + (vue === 'face' ? detailsFace() : detailsDos()),
      points,
      traces,
      cote: 'droite',
    };
  }

  const cache = {};
  racine.Corps = {
    planche(vue) { return cache[vue] || (cache[vue] = planche(vue)); },
    VUE_PRINCIPALE,
    positions: { face: FACE, dos: DOS },
    CX, LARGEUR, HAUTEUR,
  };

})(window);
