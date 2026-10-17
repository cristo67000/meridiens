'use strict';
/*
 * Les soins : les maux courants qu'on peut soulager par la digipuncture.
 *
 *   points     le protocole de base, dans l'ordre de la séance guidée
 *              { id, duree (s, par côté), note }
 *   formes     les variantes selon la MTC : signes, points à ajouter, conseil
 *   aliments   { plus: [à favoriser], moins: [à modérer] } — identifiants d'aliments
 *   consulter  les signes d'alerte : ce qui doit faire consulter, et quand
 *
 * Les protocoles suivent les associations classiques de l'acupuncture,
 * ramenées à ce qui est simple et sûr en automassage.
 */
(function (racine) {
  const MTC = racine.MTC = racine.MTC || {};

  MTC.categoriesSoins = [
    { id: 'tete', nom: 'Tête et sens', hanzi: '头' },
    { id: 'sommeil', nom: 'Sommeil et émotions', hanzi: '神' },
    { id: 'digestion', nom: 'Digestion', hanzi: '胃' },
    { id: 'respiration', nom: 'Rhume et respiration', hanzi: '肺' },
    { id: 'douleurs', nom: 'Dos et articulations', hanzi: '骨' },
    { id: 'femme', nom: 'Au féminin', hanzi: '血' },
    { id: 'vitalite', nom: 'Vitalité, circulation, peau', hanzi: '气' },
    { id: 'urgence', nom: 'Premiers gestes', hanzi: '急' },
  ];

  const S = [];
  function soin(id, categorie, nom, d) { S.push(Object.assign({ id, categorie, nom }, d)); }
  const P = (id, duree, note) => ({ id, duree, note });

  // ── Tête et sens ─────────────────────────────────────────────────────────
  soin('cephalee', 'tete', 'Maux de tête', {
    embleme: '头', resume: 'Front, tempes, nuque ou sommet du crâne : soulager les maux de tête courants.',
    mtc: 'La MTC lit un mal de tête d’abord par **son emplacement**, qui désigne le méridien en cause : le front pour le Yang Ming (Estomac, Gros Intestin), les tempes pour le Shao Yang (Vésicule biliaire, Triple Réchauffeur), la nuque pour le Tai Yang (Vessie), le sommet pour le Foie. Puis par **sa nature** : une douleur qui serre et s’aggrave avec le stress (stagnation du Qi du Foie), qui bat (montée du Yang du Foie), qui pèse (humidité, mucosités), ou qui est sourde avec de la fatigue (vide).',
    points: [P('GI4', 90, 'Pressez fermement vers l’os de l’index ; commencez par le côté opposé à la douleur.'), P('VB20', 90, 'Pouces sous l’occiput, vers le haut, tête légèrement en arrière.'), P('Taiyang', 60, 'Petits cercles lents vers l’arrière, des deux côtés.'), P('Yintang', 60, 'Pression douce entre les sourcils, puis lissez vers le haut du front.'), P('F3', 90, 'En remontant vers la cheville, surtout si le stress est en cause.')],
    formes: [
      { nom: 'Au front', signes: 'Douleur au-dessus des yeux, parfois avec le nez bouché ou une digestion difficile.', points: ['GI4', 'Yintang', 'V2', 'VB14', 'E8', 'E44'] },
      { nom: 'Sur les tempes, sur un côté', signes: 'Douleur latérale, souvent liée au stress, à la fatigue visuelle ou aux règles.', points: ['Taiyang', 'VB8', 'VB20', 'TR5', 'VB41'] },
      { nom: 'À la nuque, à l’arrière du crâne', signes: 'Raideur de la nuque, douleur qui part de l’occiput ; fréquente après un coup de froid ou une posture prolongée.', points: ['VB20', 'V10', 'VG16', 'IG3', 'V60'] },
      { nom: 'Au sommet du crâne', signes: 'Pesanteur ou douleur au vertex, souvent avec fatigue, tension nerveuse ou vertiges.', points: ['VG20', 'Sishencong', 'F3', 'R1'] },
      { nom: 'De tension (stress, écran)', signes: 'Bandeau qui serre, épaules contractées, mâchoire crispée.', points: ['VB21', 'VB20', 'F3', 'GI4', 'Yintang'] },
    ],
    conseils: ['Massez dès les premiers signes : c’est là que la digipuncture est la plus efficace.', 'Buvez un grand verre d’eau ; un mal de tête vient parfois d’une simple déshydratation.', 'Desserrez les mâchoires, relâchez les épaules, respirez lentement par le ventre.', 'Une compresse tiède sur la nuque pour une douleur de tension, fraîche sur le front pour une douleur qui bat.'],
    aliments: { plus: ['menthe', 'chrysantheme', 'celeri', 'the-vert'], moins: ['alcool', 'cafe', 'piment', 'chocolat'] },
    consulter: 'Appelez le **15** devant un mal de tête **brutal et violent** (« en coup de tonnerre »), avec **fièvre et raideur de la nuque**, après un **choc à la tête**, ou avec **troubles de la vue, de la parole, faiblesse ou engourdissement** d’un côté. Consultez si les maux de tête sont **nouveaux après 50 ans**, changent de caractère ou s’aggravent de semaine en semaine.',
  });

  soin('migraine', 'tete', 'Migraine', {
    embleme: '偏', resume: 'Accompagner la crise et espacer les migraines.',
    mtc: 'La migraine, douleur d’un côté de la tête qui bat, avec nausées et sensibilité à la lumière, est le plus souvent rattachée par la MTC au **Foie et à la Vésicule biliaire** : le Yang du Foie « monte » à la tête, porté par le stress, la fatigue ou les variations hormonales. Les points sont choisis sur le trajet de la Vésicule biliaire (côté de la tête) et pour faire redescendre le Yang.',
    points: [P('F3', 90, 'Pression ferme, en expirant.'), P('VB41', 60, 'Associé à TR5 : c’est un couple classique pour les douleurs latérales.'), P('TR5', 60), P('VB20', 90), P('Taiyang', 60, 'Doux si la tempe est très sensible.'), P('MC6', 60, 'Contre les nausées.')],
    formes: [
      { nom: 'Le Yang du Foie monte', signes: 'Douleur qui bat, tempe ou œil, irritabilité, visage rouge, déclenchée par la contrariété ou le manque de sommeil.', points: ['F3', 'F2', 'VB20', 'VB41', 'R1'] },
      { nom: 'Vide de Sang', signes: 'Douleur plus sourde, en fin de règles ou après un effort, fatigue, pâleur, vertiges.', points: ['RP6', 'E36', 'VG20', 'F3'] },
      { nom: 'Mucosités', signes: 'Tête lourde, comme dans un casque, nausées marquées, digestion lente.', points: ['E40', 'MC6', 'VC12', 'VB20'] },
    ],
    conseils: ['À la première alerte : pièce sombre et calme, massage, respiration lente.', 'Tenez un carnet des crises (heures, repas, sommeil, cycle) pour repérer vos déclencheurs.', 'Des horaires réguliers — repas et sommeil — espacent souvent les crises.', 'Hors crise, massez F3, VB20 et E36 chaque jour, deux minutes.'],
    aliments: { plus: ['celeri', 'menthe', 'chrysantheme', 'millet'], moins: ['alcool', 'chocolat', 'fromage', 'cafe'] },
    consulter: 'Consultez pour une **première migraine avec aura** (troubles visuels, fourmillements, troubles de la parole), si l’aura dure plus d’une heure, si vos crises **changent** ou se rapprochent. Urgence (**15**) devant un déficit qui ne régresse pas, ou un mal de tête brutal et inhabituel.',
  });

  soin('yeux', 'tete', 'Yeux fatigués, écrans', {
    embleme: '目', resume: 'Détendre les yeux après une journée d’écran ou de lecture.',
    mtc: '« Le Foie s’ouvre dans les yeux » et le Sang du Foie les nourrit. Un usage prolongé des yeux « consomme le Sang » : les yeux deviennent secs, rouges, la vue se brouille. Les points autour de l’orbite détendent localement ; ceux du Foie et des Reins nourrissent en profondeur.',
    points: [P('V2', 45, 'Sous le rebord osseux, vers le haut.'), P('Yuyao', 45), P('TR23', 45), P('VB1', 45), P('E2', 45), P('V1', 30, 'Pincez doucement la racine du nez, yeux fermés.'), P('VB20', 60), P('F3', 60)],
    formes: [
      { nom: 'Yeux secs, vue qui se brouille le soir', signes: 'Vide de Sang ou de Yin du Foie : sécheresse, picotements, fatigue en fin de journée.', points: ['F3', 'RP6', 'R3', 'VB37'] },
      { nom: 'Yeux rouges, qui chauffent', signes: 'Chaleur du Foie : yeux rouges, irritabilité, maux de tête.', points: ['F2', 'Taiyang', 'VB20', 'GI4'] },
    ],
    conseils: ['Règle des 20-20-20 : toutes les 20 minutes, regardez à 6 mètres pendant 20 secondes.', 'Frottez vos paumes jusqu’à ce qu’elles chauffent, posez-les sur vos yeux fermés une minute (le « palming »).', 'Clignez volontairement des yeux ; réduisez la luminosité de l’écran le soir.'],
    aliments: { plus: ['baie-de-goji', 'chrysantheme', 'carotte', 'epinard'], moins: ['alcool', 'piment'] },
    consulter: 'Consultez sans attendre devant une **baisse brutale de la vision**, un **œil rouge et douloureux**, des **halos colorés**, une **vision double** ou des éclairs lumineux.',
  });

  soin('sinus', 'tete', 'Nez bouché, sinus', {
    embleme: '鼻', resume: 'Dégager le nez et soulager la pression des sinus.',
    mtc: 'Le Poumon s’ouvre dans le nez. Un rhume récent (Vent-Froid ou Vent-Chaleur) bloque le nez ; une sinusite qui traîne est plutôt rattachée à des **mucosités**, nées d’une Rate fatiguée par l’humidité et le sucre. On dégage localement autour du nez et l’on agit à distance sur le Poumon et la Rate.',
    points: [P('GI20', 60, 'Petits cercles, puis frottez de haut en bas le long du nez.'), P('Bitong', 45), P('Yintang', 60), P('V2', 45), P('GI4', 60), P('P7', 60), P('E40', 60, 'Si les sécrétions sont épaisses.')],
    formes: [
      { nom: 'Rhume récent', signes: 'Écoulement clair ou nez bouché, éternuements, frissons légers.', points: ['GI20', 'GI4', 'P7', 'VB20', 'VG14'] },
      { nom: 'Sinusite qui traîne', signes: 'Mucus épais, jaune ou vert, tête lourde, douleur sous les yeux ou au front.', points: ['GI20', 'E2', 'Yintang', 'E40', 'E36', 'GI11'] },
    ],
    conseils: ['Lavez le nez au sérum physiologique ou à l’eau salée tiède.', 'Inhalez la vapeur d’un bol d’eau chaude, tête sous une serviette.', 'Dormez la tête un peu surélevée.'],
    aliments: { plus: ['gingembre', 'ciboule', 'radis', 'riz'], moins: ['laitages', 'sucre', 'fromage', 'boissons-glacees'] },
    consulter: 'Consultez si la fièvre dure plus de trois jours, si les symptômes dépassent **dix jours** ou s’aggravent après une amélioration, devant une douleur intense d’un côté. Urgence si la **paupière gonfle** ou si la vue se trouble.',
  });

  soin('acouphenes', 'tete', 'Acouphènes, oreilles', {
    embleme: '耳', resume: 'Accompagner les sifflements et bourdonnements d’oreille.',
    mtc: 'Les Reins s’ouvrent dans les oreilles, et les méridiens du Triple Réchauffeur, de la Vésicule biliaire et de l’Intestin grêle les entourent. La MTC distingue l’acouphène **de plénitude**, fort, brutal, comme une vague, aggravé par la colère, et l’acouphène **de vide**, faible, progressif, comme un sifflement, aggravé par la fatigue — et soulagé quand on appuie sur l’oreille.',
    points: [P('IG19', 60, 'Bouche entrouverte.'), P('TR21', 45), P('VB2', 45), P('TR17', 60), P('TR3', 60), P('R3', 90)],
    formes: [
      { nom: 'Plénitude : bruit fort, soudain', signes: 'Comme une vague ou un grondement, avec stress, colère, maux de tête, visage rouge.', points: ['TR3', 'TR5', 'F3', 'VB20', 'IG19'] },
      { nom: 'Vide : sifflement léger, progressif', signes: 'Plus marqué la nuit et en cas de fatigue, avec lombes faibles, baisse d’audition.', points: ['R3', 'V23', 'R6', 'IG19', 'TR17'] },
    ],
    conseils: ['Évitez le silence total : un fond sonore doux aide à ne plus focaliser sur le bruit.', 'Protégez vos oreilles des bruits forts.', 'Le stress et la fatigue aggravent presque toujours les acouphènes : sommeil et détente comptent.'],
    aliments: { plus: ['noix', 'sesame-noir', 'haricot-noir', 'baie-de-goji'], moins: ['cafe', 'alcool', 'sel'] },
    consulter: 'Un acouphène **soudain avec baisse d’audition** est une **urgence ORL** (à traiter dans les 48 heures). Consultez aussi pour un acouphène d’**un seul côté**, qui **bat** au rythme du cœur, ou avec des **vertiges**.',
  });

  soin('dents', 'tete', 'Mal de dents', {
    embleme: '齿', resume: 'Calmer la douleur en attendant le dentiste.',
    mtc: 'La douleur dentaire est classiquement traitée par [[GI4]], point de commande du visage et de la bouche, pressé du **côté opposé** à la douleur. Le méridien de l’Estomac irrigue la mâchoire supérieure et inférieure ; une douleur avec gencives rouges et gonflées est une « chaleur de l’Estomac » ([[E44]]), une douleur sourde qui traîne chez une personne fatiguée, un vide des Reins ([[R3]]).',
    points: [P('GI4', 90, 'Fort, du côté opposé à la dent douloureuse, puis de l’autre.'), P('E44', 60, 'Si la gencive est rouge et enflée.'), P('E6', 60, 'Pour les dents du bas.'), P('E7', 60, 'Pour les dents du haut.'), P('R3', 60, 'Pour une douleur sourde et ancienne.')],
    formes: [],
    conseils: ['Ce massage soulage, il ne soigne pas : une douleur dentaire a une cause qu’il faut traiter.', 'Évitez le chaud et le froid sur la dent, mâchez de l’autre côté.'],
    aliments: { plus: ['haricot-mungo', 'concombre'], moins: ['sucre', 'piment', 'alcool'] },
    consulter: 'Prenez rendez-vous chez un dentiste dans tous les cas. Urgence si **la joue ou le cou gonflent**, avec **fièvre**, ou s’il devient difficile **d’ouvrir la bouche ou d’avaler**.',
  });

  soin('vertiges', 'tete', 'Vertiges légers', {
    embleme: '眩', resume: 'Tête qui tourne en se levant, sensation d’instabilité.',
    mtc: 'Pour la MTC, le vertige vient soit d’**en haut** — le Yang du Foie qui monte, avec tension et maux de tête —, soit d’un **vide** — le Qi et le Sang qui ne montent plus nourrir la tête (en se levant trop vite, après une maladie) —, soit de **mucosités** qui embrument la tête.',
    points: [P('VG20', 60, 'Pression douce, ou tapotements.'), P('VB20', 60), P('MC6', 60), P('F3', 60), P('E36', 90)],
    formes: [
      { nom: 'Le Yang du Foie monte', signes: 'Vertiges avec maux de tête, acouphènes, irritabilité, sommeil agité.', points: ['F3', 'VB20', 'R1', 'Taiyang'] },
      { nom: 'Vide de Qi et de Sang', signes: 'Vertiges en se levant, pâleur, fatigue, palpitations, aggravés par l’effort.', points: ['E36', 'RP6', 'VG20', 'VC6'] },
      { nom: 'Mucosités', signes: 'Tête lourde, nausées, sensation de flotter, appétit faible.', points: ['E40', 'MC6', 'VC12', 'VB20'] },
    ],
    conseils: ['Levez-vous en deux temps : assis quelques secondes au bord du lit, puis debout.', 'Asseyez-vous dès que la tête tourne pour éviter la chute.', 'Buvez régulièrement, ne sautez pas de repas.'],
    aliments: { plus: ['jujube', 'baie-de-goji', 'celeri', 'riz'], moins: ['alcool', 'sucre', 'laitages'] },
    consulter: 'Appelez le **15** devant un vertige **brutal et intense** avec mal de tête, troubles de la parole ou de la vue, faiblesse d’un côté, ou une perte d’audition subite. Consultez pour des vertiges qui se répètent, ou une chute.',
  });

  soin('hoquet', 'tete', 'Hoquet', {
    embleme: '呃', resume: 'Arrêter un hoquet tenace.',
    mtc: 'Le hoquet est un « Qi de l’Estomac à contre-courant » : il remonte au lieu de descendre. [[V2]], pressé fort, est un remède populaire ; [[MC6]] et [[VC12]] font redescendre le Qi de l’Estomac.',
    points: [P('V2', 60, 'Pression forte et maintenue des deux pouces vers le haut, en retenant un peu sa respiration.'), P('MC6', 60), P('VC22', 30, 'Très doucement, vers le bas.'), P('VC12', 60), P('E36', 60)],
    formes: [],
    conseils: ['Buvez lentement un verre d’eau à petites gorgées, ou retenez votre souffle quelques secondes.', 'Mangez lentement, évitez les boissons gazeuses.'],
    aliments: { plus: ['gingembre', 'clou-girofle'], moins: ['boissons-glacees', 'alcool'] },
    consulter: 'Consultez pour un hoquet qui dure **plus de 48 heures** ou qui revient souvent.',
  });

  // ── Sommeil et émotions ──────────────────────────────────────────────────
  soin('insomnie', 'sommeil', 'Mieux dormir', {
    embleme: '眠', resume: 'S’endormir plus facilement, moins se réveiller la nuit.',
    mtc: 'La nuit, l’Esprit (Shen) doit « rentrer » dans le Cœur et s’y reposer, porté par le Sang et le Yin. S’il manque de Sang (rumination, fatigue), ou s’il est agité par une chaleur (stress, colère, chaleurs de la ménopause), il ne se pose pas : on ne s’endort pas ou l’on se réveille. Les points apaisent l’Esprit et nourrissent ce qui manque.',
    points: [P('R1', 90, 'Au coucher : frictionnez la plante jusqu’à la chaleur, puis pressez.'), P('RP6', 60), P('C7', 60), P('MC6', 60), P('Anmian', 90, 'Petits cercles lents derrière les oreilles.'), P('Yintang', 60, 'Yeux fermés, en respirant lentement.')],
    formes: [
      { nom: 'Ruminations, difficulté à s’endormir', signes: 'Pensées qui tournent, fatigue, sommeil léger, rêves nombreux, digestion fragile (vide du Cœur et de la Rate).', points: ['C7', 'RP6', 'E36', 'V15', 'V20'] },
      { nom: 'Agitation, colère, réveils vers 1 h – 3 h', signes: 'Irritabilité, maux de tête, bouche amère, rêves violents (Feu du Foie).', points: ['F2', 'F3', 'VB20', 'Anmian'] },
      { nom: 'Chaleurs et sueurs la nuit', signes: 'Réveils avec chaleur, sueurs nocturnes, bouche sèche, agitation (vide de Yin, Cœur et Reins).', points: ['R6', 'R3', 'C6', 'R1'] },
      { nom: 'Esprit inquiet, réveils précoces', signes: 'Palpitations, sursauts, peurs, réveils au petit matin.', points: ['C7', 'MC6', 'Yintang', 'VG20'] },
    ],
    conseils: ['Couchez-vous et levez-vous à heures fixes ; visez le coucher avant 23 h.', 'Éteignez les écrans une heure avant le coucher, tamisez la lumière.', 'Dînez léger et tôt. Un bain de pieds chaud de dix minutes fait « descendre » l’énergie.', 'Si vous ne dormez pas au bout de vingt minutes, levez-vous et faites quelque chose de calme.'],
    aliments: { plus: ['jujube', 'graine-lotus', 'millet', 'longane', 'ble'], moins: ['cafe', 'the-vert', 'alcool', 'piment'] },
    consulter: 'Consultez si l’insomnie dure **plus de trois semaines**, retentit sur vos journées, s’accompagne de **tristesse persistante**, de **ronflements avec pauses respiratoires**, ou de jambes sans repos.',
  });

  soin('stress', 'sommeil', 'Stress, anxiété', {
    embleme: '静', resume: 'Retrouver le calme, desserrer l’étau.',
    mtc: 'Le stress est d’abord, pour la MTC, une **stagnation du Qi du Foie** : l’énergie ne circule plus librement, d’où les tensions, les soupirs, la gorge serrée, l’irritabilité. Prolongé, il échauffe le Foie, agite le Cœur (palpitations, insomnie) et attaque la Rate (digestion). L’association [[GI4]] + [[F3]], les « quatre barrières », est le grand classique pour faire circuler le Qi.',
    points: [P('Yintang', 90, 'Yeux fermés, respiration lente : inspirez 4 secondes, expirez 6.'), P('VC17', 60, 'Paume ou majeur au centre de la poitrine.'), P('MC6', 90), P('C7', 60), P('GI4', 60), P('F3', 90, 'Avec GI4 : les « quatre barrières ».')],
    formes: [
      { nom: 'Tensions, irritabilité, gorge serrée', signes: 'Soupirs, boule dans la gorge, ventre noué, humeur qui change vite (stagnation du Qi du Foie).', points: ['F3', 'GI4', 'VB34', 'MC6', 'VC17', 'F14'] },
      { nom: 'Inquiétude, rumination, fatigue', signes: 'On ressasse, on dort mal, on mange sans faim ou sans appétit (Cœur et Rate).', points: ['C7', 'RP6', 'E36', 'Yintang'] },
      { nom: 'Crise d’angoisse', signes: 'Cœur qui s’emballe, souffle court, peur intense.', points: ['MC6', 'MC8', 'VC17', 'R1'] },
    ],
    conseils: ['Respirez lentement par le ventre : 4 secondes à l’inspiration, 6 à l’expiration, pendant cinq minutes.', 'Marchez chaque jour, si possible dans la nature : le Foie aime le mouvement.', 'Mettez des mots sur ce qui pèse, à quelqu’un ou dans un carnet.'],
    aliments: { plus: ['menthe', 'rose', 'zeste-mandarine', 'celeri', 'radis'], moins: ['cafe', 'alcool', 'sucre'] },
    consulter: 'Consultez si l’anxiété dure, vous empêche de vivre normalement, ou si les **crises d’angoisse** se répètent. Si vous avez des **idées noires**, parlez-en sans attendre : en France, le **3114** répond jour et nuit.',
  });

  soin('moral', 'sommeil', 'Moral en berne', {
    embleme: '神', resume: 'Accompagner une baisse de moral passagère.',
    mtc: 'La tristesse affaiblit le Poumon, la rumination la Rate, la frustration bloque le Foie. Le sommet du crâne ([[VG20]]) « fait monter le Yang clair » et éclaircit l’esprit ; le centre de la poitrine ([[VC17]]) libère le souffle ; [[F3]] remet le Qi en mouvement.',
    points: [P('VG20', 60, 'Tapotements légers du bout des doigts.'), P('Yintang', 60), P('VC17', 60), P('F3', 60), P('E36', 90), P('C7', 60)],
    formes: [],
    conseils: ['La lumière du matin et la marche sont deux alliés simples.', 'Gardez un lien avec les autres, même bref, chaque jour.', 'Un horaire de sommeil régulier stabilise l’humeur.'],
    aliments: { plus: ['jujube', 'ble', 'longane', 'rose'], moins: ['alcool', 'sucre'] },
    consulter: 'Une tristesse qui dure **plus de deux semaines**, avec perte d’intérêt, fatigue, troubles du sommeil ou de l’appétit, mérite d’en parler à un médecin. En cas d’**idées noires**, appelez le **3114**, de jour comme de nuit.',
  });

  soin('concentration', 'sommeil', 'Concentration, mémoire', {
    embleme: '智', resume: 'Pour les périodes d’examen ou de travail intellectuel intense.',
    mtc: 'La concentration dépend de la Rate (le Yi, la pensée) et du Cœur (le Shen) ; la mémoire profonde, des Reins qui nourrissent le cerveau, « mer des moelles ». [[VG20]] et [[Sishencong]] éclaircissent la tête, [[E36]] et [[RP6]] nourrissent le Qi et le Sang.',
    points: [P('VG20', 60), P('Sishencong', 60, 'Bout des doigts en couronne autour du sommet du crâne.'), P('C7', 60), P('E36', 90), P('R3', 60)],
    formes: [],
    conseils: ['Travaillez par périodes de 45 minutes, avec de vraies pauses en mouvement.', 'Le sommeil consolide la mémoire : ne le sacrifiez pas la veille d’un examen.', 'Un petit-déjeuner chaud et complet soutient l’attention du matin.'],
    aliments: { plus: ['noix', 'sesame-noir', 'millet', 'graine-lotus', 'longane'], moins: ['sucre', 'cafe'] },
    consulter: 'Consultez si les troubles de mémoire sont **récents et inhabituels**, s’aggravent, ou inquiètent l’entourage.',
  });

  // ── Digestion ────────────────────────────────────────────────────────────
  soin('nausees', 'digestion', 'Nausées, mal des transports', {
    embleme: '晕', resume: 'Le point des nausées, et ses compagnons.',
    mtc: 'Les nausées sont un Qi de l’Estomac qui remonte. [[MC6]] est le point le plus étudié de toute l’acupression : plusieurs essais cliniques soutiennent son effet sur les nausées (transports, grossesse, après une anesthésie). Les bracelets anti-nausées appuient d’ailleurs sur lui.',
    points: [P('MC6', 120, 'Les deux poignets, pression ferme et régulière. Peut se faire en continu pendant le trajet.'), P('E36', 90), P('VC12', 60, 'Doucement, en cercles dans le sens des aiguilles d’une montre.'), P('RP4', 60)],
    formes: [
      { nom: 'Pendant la grossesse', signes: 'Nausées du premier trimestre.', points: ['MC6'], conseil: 'Pendant la grossesse, contentez-vous de MC6 : d’autres points sont déconseillés.' },
      { nom: 'Après un excès de table', signes: 'Estomac plein, renvois, mauvaise haleine.', points: ['MC6', 'VC12', 'E44', 'E36'] },
    ],
    conseils: ['En voiture, regardez l’horizon, aérez, évitez de lire.', 'Une tisane de gingembre frais (quelques tranches infusées 10 minutes) apaise l’estomac.', 'Mangez léger et sec avant un trajet, évitez le jeûne complet.'],
    aliments: { plus: ['gingembre', 'riz', 'pomme'], moins: ['fritures', 'alcool', 'laitages'] },
    consulter: 'Consultez si les vomissements se répètent, s’il y a du **sang**, une **douleur abdominale intense**, des signes de **déshydratation** (bouche sèche, urines rares), chez le nourrisson, ou pendant la grossesse si vous ne gardez rien.',
  });

  soin('digestion', 'digestion', 'Digestion lente, lourdeur', {
    embleme: '脾', resume: 'Estomac lourd, somnolence après les repas, appétit capricieux.',
    mtc: 'La Rate et l’Estomac forment ensemble le « foyer digestif ». La MTC le compare à une marmite : il lui faut du feu (le Yang de la Rate) pour bien cuire. Le froid, le cru, le glacé, les repas trop copieux ou pris en travaillant l’affaiblissent ; le stress le bloque.',
    points: [P('VC12', 90, 'En cercles doux dans le sens des aiguilles d’une montre, à distance du repas.'), P('E36', 120), P('RP4', 60), P('MC6', 60), P('RP3', 60)],
    formes: [
      { nom: 'Rate fatiguée', signes: 'Fatigue et somnolence après le repas, ballonnements, selles molles, envie de sucré.', points: ['E36', 'RP3', 'V20', 'VC6'] },
      { nom: 'Trop mangé', signes: 'Estomac plein, renvois, mauvaise haleine, langue à enduit épais.', points: ['VC12', 'MC6', 'E44', 'E25'] },
      { nom: 'Ventre noué par le stress', signes: 'Digestion qui se bloque avec les émotions, douleurs qui vont et viennent, soupirs.', points: ['F3', 'VC12', 'MC6', 'F14'] },
    ],
    conseils: ['Mangez chaud, cuit, assis, sans écran, en mâchant longuement.', 'Le repas du matin doit être le plus consistant, celui du soir le plus léger.', 'Une petite marche de dix minutes après le repas vaut mieux que la sieste immédiate.'],
    aliments: { plus: ['gingembre', 'millet', 'riz', 'potiron', 'carotte', 'patate-douce'], moins: ['crudites', 'boissons-glacees', 'sucre', 'laitages', 'fritures'] },
    consulter: 'Consultez si les troubles durent plus de quelques semaines, en cas d’**amaigrissement**, de **difficulté à avaler**, de **vomissements**, de **selles noires** ou de sang.',
  });

  soin('ballonnements', 'digestion', 'Ballonnements', {
    embleme: '胀', resume: 'Ventre gonflé, gaz, inconfort abdominal.',
    mtc: 'Les ballonnements sont un Qi qui stagne dans l’abdomen : par faiblesse de la Rate (ballonnements le soir, sans douleur) ou par stagnation du Qi du Foie (ballonnements qui suivent l’humeur, avec douleurs). Le massage du ventre lui-même est un excellent soin.',
    points: [P('E25', 90, 'Puis massez tout le ventre en grands cercles, dans le sens des aiguilles d’une montre.'), P('VC6', 90), P('E36', 90), P('RP4', 60), P('F3', 60)],
    formes: [],
    conseils: ['Mangez lentement, sans parler la bouche pleine, et sans boissons gazeuses.', 'Allongé, genoux pliés, massez le ventre dans le sens des aiguilles d’une montre (c’est le sens du côlon).', 'Une infusion de fenouil ou de badiane après le repas.'],
    aliments: { plus: ['fenouil', 'anis-etoile', 'radis', 'gingembre', 'zeste-mandarine'], moins: ['crudites', 'sucre', 'laitages', 'boissons-glacees'] },
    consulter: 'Consultez si les ballonnements sont **récents et persistants** (en particulier après 50 ans), s’accompagnent d’**amaigrissement**, de sang dans les selles, de douleurs intenses, ou d’un ventre qui gonfle sans arrêt.',
  });

  soin('constipation', 'digestion', 'Constipation', {
    embleme: '便', resume: 'Relancer un transit paresseux.',
    mtc: 'La MTC distingue plusieurs constipations : par **chaleur** (selles dures et sèches, soif), par **stagnation** du Qi (stress, ballonnements), par **vide** (on pousse sans résultat, on est fatigué), par **sécheresse** (personnes âgées, après une maladie). [[TR6]] est le point classique de toutes les constipations.',
    points: [P('TR6', 90, 'Le point classique du transit.'), P('E25', 90, 'Puis massage du ventre dans le sens des aiguilles d’une montre.'), P('RP15', 60), P('E37', 60), P('GI4', 60)],
    formes: [
      { nom: 'Chaleur', signes: 'Selles dures, odeur forte, soif, bouche sèche, urines foncées.', points: ['GI11', 'E44', 'GI4', 'TR6'] },
      { nom: 'Stress', signes: 'Ventre ballonné, envies sans résultat, transit qui suit l’humeur.', points: ['TR6', 'F3', 'VB34', 'E25'] },
      { nom: 'Fatigue', signes: 'Selles pas forcément dures mais difficiles à évacuer, fatigue après l’effort.', points: ['E36', 'VC6', 'V20', 'E25'] },
      { nom: 'Sécheresse', signes: 'Selles sèches en petites boules, peau et bouche sèches, souvent avec l’âge.', points: ['R6', 'RP6', 'R3', 'TR6'] },
    ],
    conseils: ['Un grand verre d’eau tiède au lever, à l’heure du Gros Intestin (5 h – 7 h).', 'Allez à la selle à heure régulière, sans vous retenir ; les pieds surélevés sur un petit tabouret aident.', 'Bougez : la marche quotidienne relance le transit.'],
    aliments: { plus: ['sesame-noir', 'banane', 'epinard', 'miel', 'patate-douce', 'poire'], moins: ['piment', 'alcool', 'fromage'] },
    consulter: 'Consultez devant du **sang dans les selles**, un changement récent du transit (surtout après 50 ans), un **amaigrissement**, des douleurs intenses. Urgence si **plus de gaz ni de selles** avec ventre gonflé et vomissements.',
  });

  soin('diarrhee', 'digestion', 'Diarrhée passagère', {
    embleme: '泻', resume: 'Apaiser l’intestin lors d’une diarrhée banale.',
    mtc: 'La diarrhée est presque toujours liée à l’**humidité** et à la Rate : humidité-froid (selles liquides, crampes, mieux au chaud), humidité-chaleur (selles brûlantes, urgentes, odorantes), ou Rate fatiguée (selles molles chroniques). La chaleur — une main posée, une bouillotte — sur l’ombilic ([[VC8]]) est un soin traditionnel.',
    points: [P('E25', 90), P('E37', 60), P('E36', 90), P('RP9', 60), P('VC8', 180, 'Paume chaude posée sur le nombril, sans appuyer.')],
    formes: [
      { nom: 'Froid', signes: 'Selles liquides et claires, crampes soulagées par la chaleur, frilosité.', points: ['VC8', 'VC6', 'RP4', 'E36'] },
      { nom: 'Chaleur', signes: 'Selles brûlantes, urgentes, odeur forte, soif.', points: ['GI11', 'RP9', 'E44', 'E25'] },
      { nom: 'Rate fatiguée', signes: 'Selles molles depuis longtemps, fatigue, aggravation après les repas.', points: ['E36', 'RP3', 'V20', 'VC6'] },
    ],
    conseils: ['Buvez souvent, par petites quantités : eau, bouillon salé, eau de riz.', 'Mangez simple : riz blanc, congee, carottes cuites, pomme cuite.', 'Évitez laitages, crudités, fruits crus, gras et alcool quelques jours.'],
    aliments: { plus: ['riz', 'carotte', 'pomme', 'gingembre'], moins: ['laitages', 'crudites', 'fritures', 'alcool'] },
    consulter: 'Consultez si la diarrhée dure **plus de 48 à 72 heures**, avec **fièvre élevée**, **sang**, signes de **déshydratation** (bouche sèche, urines rares, fatigue), chez le **nourrisson** ou la personne âgée, ou au retour d’un voyage lointain.',
  });

  soin('estomac', 'digestion', 'Brûlures et crampes d’estomac', {
    embleme: '酸', resume: 'Reflux, brûlures, crampes d’estomac.',
    mtc: 'Les brûlures et remontées acides sont souvent un Foie qui « attaque » l’Estomac (stress) ou une chaleur de l’Estomac (repas épicés, alcool) ; la crampe aiguë d’estomac a son point d’urgence, [[E34]], point Xi de l’Estomac.',
    points: [P('MC6', 90), P('VC12', 60, 'Doux, sans appuyer fort.'), P('E36', 90), P('E34', 60, 'Surtout pour une crampe aiguë.'), P('F3', 60)],
    formes: [
      { nom: 'Stress', signes: 'Brûlures qui suivent l’humeur, renvois, soupirs.', points: ['F3', 'MC6', 'VC12', 'F14'] },
      { nom: 'Chaleur', signes: 'Brûlure, faim fréquente, soif de froid, mauvaise haleine, gencives sensibles.', points: ['E44', 'MC6', 'VC12'] },
      { nom: 'Crampe aiguë', signes: 'Douleur vive et soudaine au creux de l’estomac.', points: ['E34', 'MC6', 'RP4', 'VC12'] },
    ],
    conseils: ['Évitez de vous allonger dans les deux heures qui suivent un repas ; surélevez la tête du lit.', 'Mangez lentement, en portions modérées, et pas trop tard le soir.', 'Limitez café, alcool, tabac, aliments très épicés ou très gras.'],
    aliments: { plus: ['riz', 'millet', 'pomme-de-terre', 'chou', 'igname'], moins: ['cafe', 'alcool', 'piment', 'chocolat', 'orange', 'tomate'] },
    consulter: 'Consultez si les brûlures durent plus de **deux à trois semaines**, avec **difficulté à avaler**, amaigrissement, vomissements, **selles noires**. Urgence (**15**) devant une douleur « d’estomac » avec **oppression thoracique**, essoufflement ou sueurs : ce peut être le cœur.',
  });

  // ── Rhume et respiration ─────────────────────────────────────────────────
  soin('rhume', 'respiration', 'Rhume qui commence', {
    embleme: '风', resume: 'Agir dès les premiers frissons.',
    mtc: 'Un rhume est une attaque du **Vent** à la surface du corps, accompagné de froid (frissons, écoulement clair, pas de soif) ou de chaleur (gorge rouge, fièvre, sécrétions jaunes). On agit tôt, en « libérant la surface » : faire transpirer légèrement, réchauffer la nuque ([[VG14]]), dégager le nez.',
    points: [P('VB20', 90), P('VG14', 60, 'Frictionnez vivement jusqu’à la chaleur.'), P('GI4', 60), P('P7', 60), P('GI20', 60), P('TR5', 60)],
    formes: [
      { nom: 'Vent-Froid', signes: 'Frissons, besoin de se couvrir, nez qui coule clair, nuque raide, pas de soif.', points: ['VG14', 'VB20', 'P7', 'GI4'], conseil: 'Buvez chaud une tisane de gingembre frais et de blanc de ciboule, couvrez-vous et reposez-vous pour transpirer légèrement.' },
      { nom: 'Vent-Chaleur', signes: 'Gorge rouge et douloureuse, fièvre, sécrétions jaunes, soif.', points: ['GI11', 'GI4', 'TR5', 'P11'], conseil: 'Préférez une tisane de menthe et de chrysanthème, et des aliments légers.' },
    ],
    conseils: ['Couvrez votre cou et votre nuque : le Vent y entre, dit la MTC.', 'Reposez-vous dès les premiers signes ; un rhume « forcé » s’installe.', 'Mangez léger : bouillons, congee, légumes cuits.'],
    aliments: { plus: ['gingembre', 'ciboule', 'menthe', 'chrysantheme', 'poire'], moins: ['laitages', 'sucre', 'fritures', 'boissons-glacees'] },
    consulter: 'Consultez si la fièvre dépasse **39 °C** ou dure **plus de trois jours**, en cas de **difficulté à respirer**, de douleur dans la poitrine, de raideur de la nuque, ou si les symptômes dépassent **dix jours**. Plus tôt pour un nourrisson, une personne âgée ou fragile.',
  });

  soin('gorge', 'respiration', 'Mal de gorge', {
    embleme: '喉', resume: 'Gorge qui pique, voix enrouée.',
    mtc: 'Un mal de gorge brutal avec rougeur et fièvre est une **chaleur** (le Vent-Chaleur ou la chaleur du Poumon) : on la « fait sortir » par les points des extrémités, comme [[P11]]. Une gorge sèche qui gratte le soir, chez une personne fatiguée, est un **vide de Yin** : on humidifie avec [[R6]].',
    points: [P('P11', 30, 'Pincez l’angle de l’ongle du pouce.'), P('P10', 60), P('GI4', 60), P('R6', 60), P('VC22', 30, 'Très doucement, vers le bas.')],
    formes: [
      { nom: 'Aigu, avec chaleur', signes: 'Gorge rouge, douloureuse, fièvre, soif.', points: ['P11', 'GI1', 'GI11', 'P10', 'E44'] },
      { nom: 'Sec, qui traîne', signes: 'Gorge sèche, voix qui se fatigue, gêne le soir.', points: ['R6', 'R3', 'P9', 'P10'] },
    ],
    conseils: ['Gargarisez-vous d’eau tiède salée.', 'Buvez tiède, souvent ; une cuillerée de miel adoucit.', 'Reposez votre voix ; évitez le tabac et l’air trop sec.'],
    aliments: { plus: ['poire', 'miel', 'radis', 'menthe'], moins: ['piment', 'alcool', 'fritures'] },
    consulter: 'Urgence si vous avez du mal à **avaler votre salive** ou à **respirer**, si vous bavez, si la voix est étouffée. Consultez pour une fièvre élevée, des plaques blanches, ou un mal de gorge qui dure plus d’une semaine.',
  });

  soin('toux', 'respiration', 'Toux', {
    embleme: '咳', resume: 'Toux grasse ou sèche : accompagner et apaiser.',
    mtc: 'La toux est un Qi du Poumon qui remonte au lieu de descendre. Elle est **grasse** quand des mucosités l’encombrent (souvent nées d’une Rate fatiguée : « la Rate produit les mucosités, le Poumon les stocke »), **sèche** quand la sécheresse ou un vide de Yin l’irrite.',
    points: [P('P7', 60), P('P5', 60), P('VC22', 30, 'Très doucement, vers le bas.'), P('VC17', 60), P('Dingchuan', 60), P('E40', 60, 'Si la toux est grasse.')],
    formes: [
      { nom: 'Toux grasse', signes: 'Glaires abondantes, gorge encombrée, plus le matin.', points: ['E40', 'P5', 'VC12', 'RP3', 'VC17'] },
      { nom: 'Toux sèche', signes: 'Toux qui irrite, gorge sèche, aggravée le soir ou dans l’air sec.', points: ['R6', 'P9', 'P7', 'P10'] },
      { nom: 'Toux ancienne, souffle court', signes: 'Toux faible qui traîne, voix faible, fatigue (vide du Poumon).', points: ['P9', 'V13', 'E36', 'R3'] },
    ],
    conseils: ['Humidifiez l’air de la chambre, buvez tiède régulièrement.', 'Pour une toux sèche, une poire cuite au miel le soir (voir les recettes).', 'Évitez tabac et fumées.'],
    aliments: { plus: ['poire', 'amande', 'radis', 'miel'], moins: ['laitages', 'sucre', 'fritures', 'boissons-glacees'] },
    consulter: 'Consultez pour une toux qui dure **plus de trois semaines**, avec **sang**, **fièvre élevée**, **essoufflement**, douleur dans la poitrine ou sifflements ; plus tôt chez le nourrisson et la personne âgée.',
  });

  soin('allergie', 'respiration', 'Rhume des foins', {
    embleme: '敏', resume: 'Éternuements, nez qui coule, yeux qui piquent au printemps.',
    mtc: 'Les allergies saisonnières sont lues comme une faiblesse du **Qi défensif** (Wei Qi), laissant entrer le Vent : on soulage les crises par les points du nez et du visage, et l’on renforce le terrain hors saison — Poumon, Rate, Reins.',
    points: [P('GI20', 60), P('Bitong', 45), P('Yintang', 60), P('GI4', 60), P('GI11', 60), P('E36', 90, 'À masser chaque jour, dès un mois avant la saison.')],
    formes: [],
    conseils: ['Commencez à masser [[E36]] et [[P9]] un mois avant la saison des pollens.', 'Rincez le nez au sérum physiologique le soir ; lavez les cheveux pour retirer les pollens.', 'Aérez tôt le matin ou tard le soir.'],
    aliments: { plus: ['riz', 'champignon', 'gingembre'], moins: ['laitages', 'alcool', 'sucre'] },
    consulter: 'Consultez en cas d’**essoufflement**, de **sifflements**, de toux nocturne (asthme associé). Urgence (**15**) en cas de **gonflement des lèvres, de la langue ou de la gorge**.',
  });

  // ── Dos et articulations ─────────────────────────────────────────────────
  soin('torticolis', 'douleurs', 'Torticolis, nuque raide', {
    embleme: '颈', resume: 'Débloquer une nuque raide, le matin au réveil.',
    mtc: 'Le torticolis du réveil est une **stagnation** du Qi et du Sang dans les méridiens de la nuque, souvent après un coup de froid ou une mauvaise position. On le traite à distance, sur la main, **en tournant doucement la tête** pendant qu’on presse.',
    points: [P('Luozhen', 90, 'Pressez fort en tournant lentement la tête, sans forcer.'), P('IG3', 60, 'Même principe : on presse en bougeant.'), P('VB39', 60), P('VB20', 60), P('V10', 60), P('VB21', 60)],
    formes: [],
    conseils: ['De la chaleur sur la nuque (bouillotte, douche chaude) détend.', 'Bougez doucement dans les limites de la douleur plutôt que de rester figé.', 'Protégez la nuque des courants d’air, adaptez l’oreiller.'],
    aliments: { plus: ['gingembre', 'cannelle'], moins: ['boissons-glacees'] },
    consulter: 'Urgence si la raideur s’accompagne de **fièvre et de maux de tête** (méningite possible), ou survient **après un accident**. Consultez s’il y a des **fourmillements ou une faiblesse** dans le bras, ou si la douleur dure plus d’une semaine.',
  });

  soin('epaules', 'douleurs', 'Épaules et nuque tendues', {
    embleme: '肩', resume: 'Le « dos de bureau » : trapèzes durs, épaules hautes.',
    mtc: 'Les tensions des épaules sont une stagnation dans les méridiens de la Vésicule biliaire et de l’Intestin grêle, entretenue par le stress (le Foie) et l’immobilité. [[VB21]], au sommet de l’épaule, se pétrit ; [[IG11]], au milieu de l’omoplate, se masse contre une balle.',
    points: [P('VB21', 60, 'Pétrissez le muscle entre pouce et doigts.'), P('VB20', 60), P('IG11', 90, 'Dos contre un mur, une balle de tennis entre le mur et l’omoplate.'), P('TR14', 60), P('GI15', 60), P('GI4', 60)],
    formes: [],
    conseils: ['Toutes les heures : haussez les épaules en inspirant, relâchez-les d’un coup en expirant, trois fois.', 'Écran à hauteur des yeux, coudes soutenus.', 'Une bouillotte sur les épaules le soir.'],
    aliments: { plus: ['gingembre', 'curcuma'], moins: ['cafe'] },
    consulter: 'Consultez pour une douleur d’épaule qui **réveille la nuit** ou empêche de **lever le bras** depuis plus de deux semaines. Urgence (**15**) pour une douleur de l’épaule ou du bras gauche avec **oppression thoracique**, essoufflement ou sueurs.',
  });

  soin('lombalgie', 'douleurs', 'Mal de dos (lombaires)', {
    embleme: '腰', resume: 'Lumbago, dos bloqué ou douleur qui traîne.',
    mtc: '« Les lombes sont la demeure des Reins. » La MTC distingue le **lumbago aigu** (stagnation après un faux mouvement), la douleur de **froid-humidité** (raideur, pire par temps humide, mieux au chaud) et la douleur chronique de **vide des Reins** (sourde, avec fatigue et genoux faibles). [[V40]], au creux du genou, est le point de commande du dos.',
    points: [P('V23', 90, 'Frictionnez le bas du dos jusqu’à la chaleur, puis pressez.'), P('V25', 90), P('V52', 60), P('V40', 60, 'Pression modérée.'), P('V60', 60), P('Yaotongdian', 90, 'En mobilisant doucement le bas du dos.')],
    formes: [
      { nom: 'Lumbago aigu', signes: 'Blocage brutal après un effort ou un faux mouvement.', points: ['Yaotongdian', 'VG26', 'IG3', 'V40'], conseil: 'Pressez ces points de la main ou du visage tout en bougeant très doucement le bassin.' },
      { nom: 'Froid et humidité', signes: 'Raideur, lourdeur, pire le matin et par temps humide, soulagée par la chaleur.', points: ['VG4', 'V23', 'V40', 'VB34'] },
      { nom: 'Vide des Reins', signes: 'Douleur sourde qui traîne, fatigue, genoux faibles, mieux allongé.', points: ['V23', 'R3', 'VG4', 'V52'] },
    ],
    conseils: ['Restez actif : le repos prolongé au lit retarde la guérison.', 'La chaleur (bouillotte, bain chaud) soulage la plupart des lombalgies.', 'Pliez les genoux pour ramasser un objet, gardez la charge près du corps.'],
    aliments: { plus: ['noix', 'haricot-noir', 'sesame-noir', 'agneau'], moins: ['boissons-glacees', 'crudites'] },
    consulter: 'Urgence en cas de **perte de force** ou d’**engourdissement** dans les jambes, de **troubles pour uriner ou aller à la selle**, d’**insensibilité entre les cuisses**. Consultez aussi en cas de fièvre, après une chute, pour une douleur qui **réveille la nuit**, avec amaigrissement, ou qui dure plus de quatre à six semaines.',
  });

  soin('sciatique', 'douleurs', 'Douleur sciatique', {
    embleme: '坐', resume: 'Douleur de la fesse qui descend dans la jambe.',
    mtc: 'La sciatique suit souvent le trajet de la Vésicule biliaire (côté de la jambe) ou de la Vessie (arrière de la jambe). On choisit les points le long du trajet douloureux.',
    points: [P('V25', 90), P('VB30', 90, 'Pression profonde, coude ou balle de tennis.'), P('VB34', 60), P('V40', 60), P('V57', 60), P('V60', 60)],
    formes: [],
    conseils: ['Restez en mouvement dans la mesure du possible ; la marche douce aide.', 'La chaleur sur la fesse et le bas du dos soulage.'],
    aliments: { plus: ['gingembre', 'cannelle', 'noix'], moins: ['boissons-glacees'] },
    consulter: 'Urgence en cas de **perte de force dans le pied ou la jambe**, d’**engourdissement du périnée** ou de **troubles urinaires**. Consultez pour une douleur insupportable, qui ne cède pas aux antalgiques, ou qui dure.',
  });

  soin('genou', 'douleurs', 'Douleurs du genou', {
    embleme: '膝', resume: 'Genou raide, douloureux, qui grince.',
    mtc: 'Les « yeux du genou » ([[E35]] et [[Neixiyan]]) et [[Heding]] agissent localement. La MTC associe les douleurs du genou à l’humidité-froid (raideur, pire par temps humide), à la chaleur (genou chaud et gonflé) ou, avec l’âge, au vide des Reins et du Foie qui nourrissent tendons et os.',
    points: [P('E35', 60, 'Avec Neixiyan : pressez les deux yeux du genou à la fois.'), P('Neixiyan', 60), P('Heding', 60), P('VB34', 60), P('RP9', 60), P('E36', 90)],
    formes: [
      { nom: 'Froid et humidité', signes: 'Raideur le matin, lourdeur, pire par temps humide, mieux au chaud.', points: ['E35', 'Neixiyan', 'RP9', 'E36'] },
      { nom: 'Avec l’âge', signes: 'Douleur sourde, faiblesse, craquements, lombes fatiguées.', points: ['R3', 'V23', 'VB34', 'E36'] },
    ],
    conseils: ['Gardez le genou au chaud ; la chaleur détend.', 'Renforcez les cuisses par des exercices doux ; le vélo et la marche à plat conviennent.'],
    aliments: { plus: ['larmes-de-job', 'gingembre', 'noix'], moins: ['sucre', 'alcool'] },
    consulter: 'Consultez pour un genou **chaud, rouge, très gonflé**, avec fièvre, s’il **se bloque** ou se **dérobe**, si vous ne pouvez plus vous appuyer dessus, ou après un traumatisme.',
  });

  soin('crampes', 'douleurs', 'Crampes du mollet', {
    embleme: '筋', resume: 'Dénouer une crampe, en prévenir le retour.',
    mtc: 'Les tendons sont nourris par le Sang du Foie : des crampes fréquentes, surtout la nuit, évoquent un Sang qui manque. [[V57]] se masse pendant la crampe ; [[VB34]] est le point de réunion de tous les tendons.',
    points: [P('V57', 60, 'Pendant la crampe : pressez en tirant les orteils vers vous.'), P('VB34', 60), P('V40', 45), P('E36', 60)],
    formes: [],
    conseils: ['Pendant la crampe : étirez le mollet, orteils tirés vers le nez.', 'Buvez suffisamment, surtout après l’effort.', 'Le soir, quelques étirements des mollets avant de vous coucher.'],
    aliments: { plus: ['epinard', 'sesame-noir', 'noix', 'banane'], moins: ['cafe', 'alcool'] },
    consulter: 'Urgence si le mollet est **rouge, chaud, gonflé et douloureux** d’un seul côté (phlébite). Consultez pour des crampes très fréquentes ou apparues avec un nouveau médicament.',
  });

  soin('coude', 'douleurs', 'Coude douloureux', {
    embleme: '肘', resume: 'Douleur à l’extérieur du coude (« tennis-elbow »).',
    mtc: 'La douleur externe du coude se trouve sur le trajet du Gros Intestin : on masse [[GI10]] et [[GI11]], souvent très sensibles, en pétrissant le muscle de l’avant-bras.',
    points: [P('GI10', 90, 'Pétrissez tout le relief musculaire autour du point.'), P('GI11', 60), P('P5', 60), P('GI4', 60)],
    formes: [],
    conseils: ['Mettez au repos les gestes qui déclenchent la douleur (souris, outils, raquette).', 'Chaleur et étirements doux de l’avant-bras.'],
    aliments: { plus: ['curcuma', 'gingembre'], moins: ['alcool'] },
    consulter: 'Consultez si le coude **gonfle**, après un traumatisme, s’il y a des fourmillements dans la main, ou si la douleur dure plus de trois mois.',
  });

  soin('poignet', 'douleurs', 'Poignet, fourmillements', {
    embleme: '腕', resume: 'Poignet douloureux, doigts qui fourmillent (canal carpien).',
    mtc: '[[MC7]], au milieu du pli du poignet, est situé juste au-dessus du canal carpien ; on l’associe à [[MC6]] et aux points du dos du poignet. Ce massage accompagne, il ne remplace pas le bilan.',
    points: [P('MC7', 60, 'Pression douce, pas d’appui fort si les doigts fourmillent.'), P('MC6', 60), P('TR5', 60), P('TR4', 60), P('GI5', 45)],
    formes: [],
    conseils: ['Pauses régulières, poignets dans l’axe, étirements doux.', 'Évitez de dormir poignets pliés.'],
    aliments: { plus: ['gingembre', 'curcuma'], moins: ['sel'] },
    consulter: 'Consultez si l’engourdissement **vous réveille la nuit**, si vous **lâchez les objets**, si le muscle du pouce fond, ou si les symptômes durent.',
  });

  soin('cheville', 'douleurs', 'Cheville fragile', {
    embleme: '踝', resume: 'Après une entorse, une fois la phase aiguë passée.',
    mtc: 'Après une entorse, le Qi et le Sang stagnent autour de la malléole. Les points autour de la cheville ([[VB40]], [[E41]], [[V60]]) aident à les remettre en mouvement — **seulement après les 48 premières heures**.',
    points: [P('VB40', 60), P('E41', 60), P('V60', 60), P('V62', 45), P('R3', 60)],
    formes: [],
    conseils: ['Les 48 premières heures : repos, glace, contention, jambe surélevée — pas de massage.', 'Ensuite, remettez la cheville en mouvement progressivement ; les exercices d’équilibre préviennent les récidives.'],
    aliments: { plus: ['curcuma'], moins: ['alcool'] },
    consulter: 'Consultez si vous ne pouvez **pas poser le pied**, si la **pression sur l’os** de la malléole est douloureuse, ou si le gonflement est important : une radiographie peut être nécessaire.',
  });

  // ── Au féminin ───────────────────────────────────────────────────────────
  soin('regles', 'femme', 'Règles douloureuses', {
    embleme: '经', resume: 'Soulager les douleurs du cycle.',
    mtc: 'Pour la MTC, la douleur des règles vient de ce que « ce qui ne circule pas fait mal » : stagnation du Qi et du Sang (stress, douleur avant et au début des règles, caillots), **froid** qui fige (douleur crampe soulagée par la chaleur), ou **vide** (douleur sourde en fin de règles). [[RP6]] est le point maître du bas-ventre féminin.',
    points: [P('RP6', 90), P('RP8', 60, 'Le point des douleurs aiguës.'), P('F3', 60), P('GI4', 60), P('VC6', 120, 'Paume chaude ou bouillotte, sans appuyer.'), P('V32', 60, 'Frictionnez le sacrum jusqu’à la chaleur.')],
    formes: [
      { nom: 'Froid', signes: 'Crampes soulagées par la chaleur, sang sombre, mains et pieds froids.', points: ['VC4', 'VC6', 'Shiqizhui', 'RP6'], conseil: 'Bouillotte sur le bas-ventre et le sacrum ; boissons chaudes au gingembre et à la cannelle.' },
      { nom: 'Stagnation', signes: 'Douleur avant et au début des règles, seins tendus, irritabilité, caillots.', points: ['F3', 'GI4', 'RP8', 'RP10', 'VB41'] },
      { nom: 'Vide', signes: 'Douleur sourde en fin de règles, fatigue, pâleur, règles peu abondantes.', points: ['E36', 'RP6', 'VC4'] },
    ],
    conseils: ['La chaleur sur le bas-ventre est le geste le plus simple et le plus efficace.', 'Évitez le froid pendant les règles : glaces, boissons glacées, pieds nus sur le carrelage.', 'Un mouvement doux (marche, étirements) vaut mieux que l’immobilité.'],
    aliments: { plus: ['gingembre', 'cannelle', 'sucre-roux', 'jujube'], moins: ['boissons-glacees', 'crudites'] },
    consulter: 'Plusieurs de ces points sont **déconseillés pendant la grossesse** : en cas de doute, abstenez-vous. Consultez si la douleur **ne cède pas aux antalgiques**, s’aggrave d’année en année, survient en dehors des règles ou pendant les rapports (une **endométriose** est possible), ou si les règles sont très abondantes. Urgence pour une **douleur intense avec retard de règles**.',
  });

  soin('spm', 'femme', 'Syndrome prémenstruel', {
    embleme: '郁', resume: 'Seins tendus, irritabilité, ventre gonflé avant les règles.',
    mtc: 'Les jours qui précèdent les règles, le Qi et le Sang affluent vers le bas : si le Qi du Foie circule mal, il se bloque — seins tendus, humeur à fleur de peau, ventre gonflé, maux de tête. On le fait circuler.',
    points: [P('F3', 90), P('VB41', 60), P('MC6', 60), P('VC17', 60), P('RP6', 60), P('F14', 45)],
    formes: [],
    conseils: ['Bougez davantage dans la semaine qui précède les règles.', 'Réduisez le sel, le sucre, le café et l’alcool ces jours-là.', 'Commencez les massages une semaine avant les règles.'],
    aliments: { plus: ['celeri', 'radis', 'rose', 'zeste-mandarine', 'menthe'], moins: ['cafe', 'alcool', 'sucre', 'sel'] },
    consulter: 'Consultez si les troubles de l’humeur sont **sévères** ou retentissent sur votre vie, ou si votre cycle change.',
  });

  soin('menopause', 'femme', 'Bouffées de chaleur', {
    embleme: '热', resume: 'Accompagner les chaleurs et sueurs de la ménopause.',
    mtc: 'À la ménopause, l’Essence des Reins diminue, et avec elle le **Yin** : le Yang, moins tempéré, produit des chaleurs qui montent, des sueurs la nuit, une agitation. On nourrit le Yin des Reins et l’on calme le Cœur.',
    points: [P('R6', 60), P('R3', 60), P('RP6', 60), P('C6', 60, 'Contre les sueurs nocturnes.'), P('F2', 45), P('R1', 90, 'Le soir.')],
    formes: [],
    conseils: ['Habillez-vous en plusieurs couches, gardez la chambre fraîche.', 'L’activité physique régulière diminue les bouffées de chaleur.', 'Repérez vos déclencheurs : alcool, café, plats épicés, boissons chaudes.'],
    aliments: { plus: ['tofu', 'haricot-mungo', 'poire', 'sesame-noir', 'baie-de-goji', 'igname'], moins: ['piment', 'alcool', 'cafe', 'agneau'] },
    consulter: 'Consultez si les symptômes sont très gênants (des traitements existent), et toujours en cas de **saignements après la ménopause**.',
  });

  // ── Vitalité, circulation, peau ──────────────────────────────────────────
  soin('fatigue', 'vitalite', 'Fatigue, coup de pompe', {
    embleme: '气', resume: 'Retrouver de l’énergie, chaque jour.',
    mtc: 'La fatigue est le plus souvent un **vide** — de Qi (essoufflement, voix faible), de Yang (frilosité), de Sang (pâleur, vertiges) — mais elle peut aussi venir d’une **humidité** qui alourdit (tête dans le brouillard, après les repas) ou d’un Qi qui **stagne** (fatigue qui disparaît quand on bouge). [[E36]] et [[VC6]] sont les grands points de tonification.',
    points: [P('E36', 120, 'Tapotez du poing ou massez profondément.'), P('VC6', 120, 'Main posée chaude, respiration abdominale.'), P('R3', 60), P('RP6', 60), P('VG20', 60), P('R27', 30, 'Frottez vivement sous les clavicules.')],
    formes: [
      { nom: 'Manque de Qi', signes: 'Essoufflement à l’effort, voix faible, transpiration facile, fatigue après avoir parlé.', points: ['E36', 'VC6', 'P9', 'RP3'] },
      { nom: 'Manque de Yang', signes: 'Frilosité, besoin de chaleur, mains et pieds froids, envie de dormir.', points: ['VG4', 'VC4', 'R3', 'E36'] },
      { nom: 'Manque de Sang', signes: 'Pâleur, vertiges en se levant, sommeil léger, ongles fragiles.', points: ['RP6', 'E36', 'V20', 'V17'] },
      { nom: 'Humidité', signes: 'Lourdeur, tête dans le brouillard, somnolence après les repas.', points: ['RP9', 'E40', 'VC12', 'E36'] },
      { nom: 'Qi qui stagne', signes: 'Fatigue avec tensions, qui disparaît dès qu’on bouge.', points: ['F3', 'GI4', 'VB34'] },
    ],
    conseils: ['Couchez-vous plus tôt plutôt que de vous lever plus tard.', 'Un petit-déjeuner chaud et consistant change souvent la journée.', 'Marchez vingt minutes par jour ; respirez lentement par le ventre.'],
    aliments: { plus: ['riz', 'jujube', 'patate-douce', 'poulet', 'gingembre', 'avoine'], moins: ['crudites', 'boissons-glacees', 'sucre', 'cafe'] },
    consulter: 'Consultez pour une fatigue qui dure **plus d’un mois** sans explication, avec amaigrissement, fièvre, essoufflement, pâleur marquée ou besoin de dormir sans cesse : un bilan (anémie, thyroïde…) peut s’imposer.',
  });

  soin('jambes-lourdes', 'vitalite', 'Jambes lourdes', {
    embleme: '湿', resume: 'Jambes lourdes, chevilles gonflées en fin de journée.',
    mtc: 'Les jambes lourdes sont le signe typique de l’**humidité**, qui descend et s’accumule en bas : la Rate ne la transforme plus assez. [[RP9]] est le point maître pour la drainer.',
    points: [P('RP9', 90), P('E36', 90), P('RP6', 60, 'Doucement, jamais sur une varice.'), P('R7', 60), P('E40', 60)],
    formes: [],
    conseils: ['Massez en remontant, des chevilles vers les genoux.', 'Marchez, surélevez les jambes en fin de journée, évitez la station debout prolongée.', 'Portez des bas de contention s’ils vous ont été prescrits.'],
    aliments: { plus: ['haricot-azuki', 'larmes-de-job', 'orge', 'mais', 'celeri'], moins: ['sel', 'sucre', 'laitages', 'alcool'] },
    consulter: 'Urgence si **un seul mollet** devient rouge, chaud, douloureux et gonflé (phlébite), ou en cas d’**essoufflement**. Consultez pour des jambes qui gonflent beaucoup ou brutalement.',
  });

  soin('froid', 'vitalite', 'Mains et pieds froids', {
    embleme: '寒', resume: 'Réchauffer les extrémités, en profondeur.',
    mtc: 'Des extrémités froides traduisent un **Yang** qui manque (frilosité générale) ou un Qi qui stagne (froid des mains en période de stress, avec un tronc chaud). On réchauffe par les frictions et les points du Yang.',
    points: [P('R1', 90, 'Frictionnez la plante jusqu’à la chaleur.'), P('R3', 60), P('TR4', 60), P('VC6', 120, 'Main posée chaude.'), P('E36', 90), P('VG4', 60, 'Frictions du bas du dos.')],
    formes: [],
    conseils: ['Gardez les pieds, le ventre et le bas du dos au chaud.', 'Un bain de pieds chaud au gingembre le soir.', 'Évitez de marcher pieds nus sur un sol froid.'],
    aliments: { plus: ['gingembre', 'cannelle', 'agneau', 'poireau', 'noix'], moins: ['boissons-glacees', 'crudites', 'pasteque'] },
    consulter: 'Consultez si les doigts deviennent **blancs puis bleus** au froid (syndrome de Raynaud), s’il y a des plaies qui cicatrisent mal, ou des douleurs des mollets à la marche.',
  });

  soin('peau', 'vitalite', 'Démangeaisons, peau irritée', {
    embleme: '痒', resume: 'Calmer les démangeaisons et les petites éruptions.',
    mtc: 'Les démangeaisons sont attribuées au **Vent** (elles se déplacent) et à la **chaleur du Sang** (rougeur). [[GI11]] et [[RP10]], « la mer du Sang », sont les deux points classiques ; [[VB31]], « le marché du Vent », complète.',
    points: [P('GI11', 90), P('RP10', 90), P('VB31', 60), P('RP6', 60), P('GI4', 60)],
    formes: [],
    conseils: ['Ne grattez pas : tapotez ou appliquez du frais.', 'Lavez à l’eau tiède, séchez sans frotter, hydratez.', 'Préférez le coton, évitez la laine sur la peau.'],
    aliments: { plus: ['haricot-mungo', 'concombre', 'riz'], moins: ['piment', 'alcool', 'crustaces', 'sucre'] },
    consulter: 'Urgence (**15**) si les démangeaisons s’accompagnent d’un **gonflement des lèvres, de la langue ou de la gorge** ou d’une gêne respiratoire. Consultez en cas de fièvre, de lésions qui s’étendent, ou de démangeaisons sans éruption qui durent.',
  });

  // ── Premiers gestes ──────────────────────────────────────────────────────
  soin('malaise', 'urgence', 'Malaise, évanouissement', {
    embleme: '醒', resume: 'Les points traditionnels de réanimation, en attendant les secours.',
    mtc: 'La tradition chinoise utilise [[VG26]], sous le nez, et les points des extrémités ([[MC9]], [[R1]]) pour « rappeler l’Esprit » lors d’un malaise. Ils ne remplacent **jamais** les gestes de premiers secours.',
    points: [P('VG26', 30, 'Pression forte et brève avec l’ongle, répétée.'), P('MC9', 30, 'Pincez le bout du majeur.'), P('R1', 30, 'Pression forte sous le pied.')],
    formes: [],
    conseils: ['Allongez la personne, jambes surélevées, desserrez ce qui serre, aérez.', 'Si elle ne répond pas et respire : position latérale de sécurité et appel des secours.', 'Si elle ne respire pas : appelez le 15 ou le 112 et commencez le massage cardiaque.'],
    aliments: { plus: [], moins: [] },
    consulter: 'Appelez le **15** ou le **112** si la personne **perd connaissance**, si le malaise s’accompagne d’une **douleur dans la poitrine**, d’une **difficulté à respirer**, d’une **paralysie** ou de troubles de la parole, ou si elle ne reprend pas rapidement ses esprits.',
  });

  MTC.soins = S;

})(window);
