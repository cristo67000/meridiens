'use strict';
/*
 * Les points de digipuncture.
 *
 * Une sélection : les points les plus utiles en automassage, plus le premier
 * et le dernier point de chaque méridien. Localisations d'après le standard de
 * l'OMS (WHO Standard Acupuncture Point Locations, 2008), reformulées pour
 * qu'on puisse les trouver sur soi.
 *
 *   loc          localisation anatomique
 *   astuce       comment le trouver, concrètement
 *   technique    comment le masser ; duree : secondes par côté
 *   actions      ses actions selon la MTC
 *   indications  à quoi il sert
 *   categories   sa place dans la théorie (Yuan, Luo, Shu antiques…)
 *   grossesse    true : à éviter pendant la grossesse
 */
(function (racine) {
  const MTC = racine.MTC = racine.MTC || {};

  const CERCLES = 'Pression de la pulpe du pouce ou du majeur, perpendiculaire à la peau, d’abord légère puis plus appuyée, en petits cercles. Respirez lentement ; une sensation de lourdeur ou de chaleur diffuse est bon signe.';
  const PINCER = 'Pincez l’angle de l’ongle entre le pouce et l’index, ou pressez-le avec l’ongle, par pressions brèves et répétées.';
  const DOUX = 'Pression très douce de la pulpe du doigt, yeux fermés, en petits cercles lents. Jamais d’appui sur le globe de l’œil.';
  const PETRIR = 'Saisissez le muscle entre le pouce et les doigts et pétrissez-le, puis appuyez sur le point quelques secondes en expirant.';
  const PAUME = 'Massage circulaire de toute la paume, lent et enveloppant, dans le sens des aiguilles d’une montre ; ou main posée à plat, immobile et chaude.';

  const L = [];
  function pt(id, nom, hanzi, sens, d) { L.push(Object.assign({ id, nom, hanzi, sens, duree: 60, technique: CERCLES }, d)); }

  // ── Poumon ───────────────────────────────────────────────────────────────
  pt('P1', 'Zhōngfǔ', '中府', 'Palais du milieu', {
    loc: 'Sur le haut de la poitrine, au 1ᵉʳ espace intercostal, à 6 cun de la ligne médiane, 1 cun sous le creux qui se forme sous l’extrémité externe de la clavicule.',
    astuce: 'Placez les doigts sous la clavicule, côté épaule : un creux se forme quand vous avancez l’épaule. Le point est un pouce plus bas, souvent sensible.',
    technique: 'Pression douce, perpendiculaire, en petits cercles, pendant que vous respirez profondément.',
    actions: ['Fait descendre le Qi du Poumon', 'Libère la poitrine', 'Arrête la toux'],
    indications: ['Toux', 'Essoufflement, respiration courte', 'Oppression thoracique', 'Douleur de l’épaule et du haut du dos'],
    categories: ['Point Mu (alarme) du Poumon', 'Premier point du méridien'],
  });
  pt('P5', 'Chǐzé', '尺泽', 'Marais du pied (de la coudée)', {
    loc: 'Au pli du coude, dans le creux situé du côté du pouce (côté radial) du tendon du biceps.',
    astuce: 'Pliez un peu le coude contre une résistance : le tendon du biceps se tend au milieu du pli. Le point est juste à côté, vers le pouce.',
    actions: ['Rafraîchit la chaleur du Poumon', 'Fait descendre le Qi du Poumon', 'Détend les tendons du coude'],
    indications: ['Toux avec mucosités jaunes ou toux sèche', 'Mal de gorge', 'Fièvre', 'Douleur et raideur du coude'],
    categories: ['Point He (mer)', 'Point de dispersion'],
  });
  pt('P6', 'Kǒngzuì', '孔最', 'Ouverture suprême', {
    loc: 'Sur la face antérieure de l’avant-bras, à 7 cun au-dessus du pli du poignet, sur la ligne qui relie P5 à P9.',
    astuce: 'Prenez le milieu entre les plis du coude et du poignet, puis remontez d’un pouce vers le coude, sur le bord côté pouce.',
    actions: ['Arrête la toux aiguë', 'Fait descendre le Qi du Poumon', 'Arrête les saignements'],
    indications: ['Toux aiguë, crise d’essoufflement (en complément)', 'Voix éteinte', 'Hémorroïdes'],
    categories: ['Point Xi (fissure), pour les troubles aigus'],
    precautions: 'Des crachats de sang imposent de consulter sans attendre.',
  });
  pt('P7', 'Lièquē', '列缺', 'Rupture de l’alignement', {
    loc: 'Sur le bord radial de l’avant-bras, 1,5 cun au-dessus du pli du poignet, juste au-dessus de l’apophyse styloïde du radius, dans la gouttière entre deux tendons.',
    astuce: 'Croisez les mains par la palmure entre pouce et index ; l’index posé sur le poignet de l’autre main tombe dans un petit creux sur le bord de l’os : c’est le point.',
    technique: 'Pression du bout de l’index ou du pouce, frottements de va-et-vient le long du creux.',
    actions: ['Libère la surface et chasse le Vent', 'Fait descendre le Qi du Poumon', 'Dégage la tête et la nuque', 'Ouvre le Vaisseau Conception'],
    indications: ['Rhume débutant, nez bouché', 'Toux', 'Maux de tête, raideur de la nuque', 'Mal de gorge'],
    categories: ['Point Luo (communication)', 'Point d’ouverture du Ren Mai', 'Point de commande de la tête et de la nuque'],
  });
  pt('P9', 'Tàiyuān', '太渊', 'Abîme suprême', {
    loc: 'Au pli du poignet, du côté du pouce de l’artère radiale (là où l’on prend le pouls).',
    astuce: 'Sentez le pouls au poignet, côté pouce : le point est juste en dehors de l’artère, sur le pli.',
    technique: 'Pression légère et maintenue — l’artère est juste à côté.',
    actions: ['Tonifie le Qi du Poumon', 'Arrête la toux chronique', 'Favorise la circulation dans les vaisseaux'],
    indications: ['Toux ancienne, voix faible', 'Essoufflement à l’effort', 'Fatigue respiratoire', 'Douleur du poignet'],
    categories: ['Point Yuan (source)', 'Point Shu (rivière)', 'Point Hui (réunion) des vaisseaux'],
  });
  pt('P10', 'Yújì', '鱼际', 'Bord du poisson', {
    loc: 'Au milieu du 1ᵉʳ métacarpien, sur la limite entre la peau de la paume et celle du dos de la main (éminence thénar).',
    actions: ['Rafraîchit la gorge', 'Fait descendre le Qi du Poumon'],
    indications: ['Mal de gorge, voix enrouée', 'Toux sèche', 'Fièvre, paumes brûlantes'],
    categories: ['Point Ying (jaillissement)'],
  });
  pt('P11', 'Shàoshāng', '少商', 'Petit marchand', {
    loc: 'Sur le côté radial (externe) du pouce, à 0,1 cun de l’angle de l’ongle.',
    technique: PINCER, duree: 30,
    actions: ['Rafraîchit la gorge', 'Fait baisser la chaleur', 'Rétablit la conscience'],
    indications: ['Mal de gorge aigu', 'Fièvre', 'Toux aiguë'],
    categories: ['Point Jing (puits)', 'Dernier point du méridien'],
  });

  // ── Gros Intestin ────────────────────────────────────────────────────────
  pt('GI1', 'Shāngyáng', '商阳', 'Yang du marchand', {
    loc: 'Sur le côté radial de l’index (côté pouce), à 0,1 cun de l’angle de l’ongle.',
    technique: PINCER, duree: 30,
    actions: ['Rafraîchit la chaleur', 'Soulage la gorge'],
    indications: ['Mal de gorge', 'Mal de dents', 'Fièvre'],
    categories: ['Point Jing (puits)', 'Premier point du méridien'],
  });
  pt('GI4', 'Hégǔ', '合谷', 'Vallée de la jonction', {
    loc: 'Sur le dos de la main, entre les 1ᵉʳ et 2ᵉ métacarpiens, au milieu du 2ᵉ métacarpien, du côté du pouce.',
    astuce: 'Serrez le pouce contre l’index : le point est au sommet du petit renflement musculaire. Ou posez le pli du pouce de l’autre main sur la palmure : le bout du pouce tombe dessus.',
    technique: 'Pressez fermement vers l’os de l’index (pas vers la paume), en pétrissant par petits cercles. La sensation est souvent vive : c’est normal.',
    duree: 90,
    actions: ['Chasse le Vent et libère la surface', 'Calme la douleur', 'Dégage le visage et les sens', 'Fait circuler le Qi'],
    indications: ['Maux de tête, surtout frontaux', 'Douleurs du visage, mal de dents', 'Rhume, sinusite, nez bouché', 'Douleurs en général', 'Stress (avec [[F3]] : les « quatre barrières »)', 'Constipation', 'Règles douloureuses'],
    categories: ['Point Yuan (source)', 'Point de commande du visage et de la bouche'],
    grossesse: true,
  });
  pt('GI5', 'Yángxī', '阳溪', 'Ruisseau du Yang', {
    loc: 'Sur le bord radial du dos du poignet, dans le creux de la « tabatière anatomique », entre les tendons qui saillent quand on tend le pouce vers l’arrière.',
    actions: ['Chasse le Vent', 'Soulage les douleurs locales'],
    indications: ['Douleur du poignet, tendinite du pouce', 'Mal de dents', 'Maux de tête'],
    categories: ['Point Jing (fleuve)'],
  });
  pt('GI10', 'Shǒusānlǐ', '手三里', 'Trois distances du bras', {
    loc: 'Sur la face externe de l’avant-bras, à 2 cun sous GI11, sur la ligne qui le relie à GI5.',
    astuce: 'Trois doigts sous le pli du coude (coude plié), sur le relief musculaire : le point est souvent sensible.',
    actions: ['Fait circuler le Qi et le Sang dans le bras', 'Harmonise l’estomac et les intestins'],
    indications: ['Douleur de l’avant-bras et du coude, « tennis-elbow »', 'Bras fatigué', 'Douleurs abdominales, diarrhée'],
    categories: [],
  });
  pt('GI11', 'Qūchí', '曲池', 'Étang de la courbe', {
    loc: 'Coude plié à angle droit, à l’extrémité externe du pli, à mi-chemin entre P5 et la saillie osseuse externe du coude (épicondyle).',
    astuce: 'Pliez le coude, main sur la poitrine : le point est au bout du pli, côté extérieur.',
    duree: 90,
    actions: ['Rafraîchit la chaleur', 'Rafraîchit le Sang, calme les démangeaisons', 'Fait circuler le Qi dans le bras'],
    indications: ['Fièvre, mal de gorge', 'Démangeaisons, eczéma, urticaire', 'Douleur et raideur du coude', 'Tension artérielle un peu élevée (en accompagnement)'],
    categories: ['Point He (mer)', 'Point de tonification'],
  });
  pt('GI15', 'Jiānyú', '肩髃', 'Os de l’épaule', {
    loc: 'Sur l’épaule, dans le creux qui apparaît en avant et en dessous de l’acromion quand on lève le bras à l’horizontale.',
    astuce: 'Levez le bras sur le côté : deux creux se forment sous la pointe de l’épaule. Celui de devant est GI15, celui de derrière [[TR14]].',
    actions: ['Fait circuler le Qi dans l’épaule', 'Chasse le Vent-Humidité'],
    indications: ['Douleur et raideur de l’épaule', 'Bras difficile à lever'],
    categories: [],
  });
  pt('GI20', 'Yíngxiāng', '迎香', 'Accueillir les parfums', {
    loc: 'Dans le sillon qui va de l’aile du nez au coin de la bouche, à hauteur du milieu de l’aile du nez.',
    technique: 'Pression des index de part et d’autre du nez, en petits cercles, ou frottements de haut en bas le long des ailes du nez.',
    actions: ['Ouvre le nez', 'Chasse le Vent'],
    indications: ['Nez bouché, rhinite, sinusite', 'Perte de l’odorat', 'Éternuements'],
    categories: ['Dernier point du méridien'],
  });

  // ── Estomac ──────────────────────────────────────────────────────────────
  pt('E1', 'Chéngqì', '承泣', 'Recevoir les larmes', {
    loc: 'Juste sous la pupille, entre le globe oculaire et le rebord osseux de l’orbite.',
    technique: DOUX, duree: 30,
    actions: ['Clarifie les yeux', 'Chasse le Vent'],
    indications: ['Yeux rouges, larmoiement', 'Fatigue des yeux', 'Paupière qui tressaute'],
    categories: ['Premier point du méridien'],
    precautions: 'Appuyez seulement sur l’os du rebord, jamais sur l’œil.',
  });
  pt('E2', 'Sìbái', '四白', 'Quatre blancheurs', {
    loc: 'À l’aplomb de la pupille, dans le petit creux de l’os sous l’orbite (trou sous-orbitaire), un travers de doigt sous le rebord.',
    technique: 'Pression douce des index en petits cercles, regard au loin ou yeux fermés.',
    actions: ['Clarifie les yeux', 'Chasse le Vent du visage'],
    indications: ['Fatigue oculaire, yeux secs', 'Douleur ou engourdissement du visage', 'Sinusite des joues'],
    categories: [],
  });
  pt('E4', 'Dìcāng', '地仓', 'Grenier de la terre', {
    loc: 'À 0,4 cun en dehors du coin des lèvres.',
    actions: ['Chasse le Vent du visage', 'Fait circuler le Qi des joues'],
    indications: ['Paralysie faciale (en accompagnement)', 'Salivation excessive', 'Douleur autour de la bouche'],
    categories: [],
  });
  pt('E6', 'Jiáchē', '颊车', 'Char de la mâchoire', {
    loc: 'Un travers de doigt en avant et au-dessus de l’angle de la mâchoire, au sommet du muscle masséter quand on serre les dents.',
    astuce: 'Serrez les dents : le muscle se gonfle sous les doigts. Desserrez : le point est dans le creux qui reste.',
    actions: ['Chasse le Vent', 'Détend la mâchoire', 'Calme la douleur dentaire'],
    indications: ['Mal de dents (mâchoire inférieure)', 'Mâchoire crispée, grincement des dents', 'Douleur de l’articulation de la mâchoire'],
    categories: [],
  });
  pt('E7', 'Xiàguān', '下关', 'Barrière inférieure', {
    loc: 'Devant l’oreille, dans le creux situé sous l’arcade de la pommette, devant l’articulation de la mâchoire. Le creux se ferme quand on ouvre la bouche.',
    technique: 'Bouche fermée, pression en petits cercles des index ou des majeurs, des deux côtés à la fois.',
    actions: ['Détend la mâchoire', 'Ouvre l’oreille', 'Calme la douleur'],
    indications: ['Douleur de l’articulation de la mâchoire', 'Mal de dents (mâchoire supérieure)', 'Acouphènes', 'Névralgie du visage'],
    categories: [],
  });
  pt('E8', 'Tóuwéi', '头维', 'Coin de la tête', {
    loc: 'À l’angle du front, 0,5 cun au-dessus de la lisière des cheveux, à 4,5 cun de la ligne médiane.',
    actions: ['Chasse le Vent de la tête', 'Clarifie les yeux'],
    indications: ['Maux de tête frontaux et des tempes', 'Vertiges', 'Douleur des yeux, larmoiement'],
    categories: [],
  });
  pt('E25', 'Tiānshū', '天枢', 'Pivot céleste', {
    loc: 'Sur l’abdomen, à 2 cun de part et d’autre de l’ombilic.',
    astuce: 'Trois doigts à plat à côté du nombril, de chaque côté.',
    technique: 'Allongé, genoux pliés : pressions lentes des deux côtés en expirant, puis massage circulaire du ventre dans le sens des aiguilles d’une montre.',
    duree: 90,
    actions: ['Règle les intestins', 'Fait circuler le Qi de l’abdomen'],
    indications: ['Constipation', 'Diarrhée', 'Ballonnements, douleurs abdominales', 'Règles douloureuses'],
    categories: ['Point Mu (alarme) du Gros Intestin'],
    precautions: 'Pas de pression profonde sur un ventre douloureux sans raison connue, ni pendant la grossesse.',
  });
  pt('E29', 'Guīlái', '归来', 'Le retour', {
    loc: 'Sur le bas-ventre, à 4 cun sous l’ombilic et 2 cun de la ligne médiane.',
    technique: 'Pression douce, ou paume posée chaude sur le bas-ventre.',
    actions: ['Réchauffe le Réchauffeur inférieur', 'Fait circuler le Qi et le Sang de l’utérus'],
    indications: ['Règles douloureuses', 'Règles irrégulières', 'Pesanteur du bas-ventre'],
    categories: [],
    grossesse: true,
  });
  pt('E34', 'Liángqiū', '梁丘', 'Monticule de la poutre', {
    loc: 'Au-dessus du genou, à 2 cun au-dessus de l’angle supéro-externe de la rotule.',
    astuce: 'Trois doigts au-dessus du coin externe de la rotule, dans un petit creux entre les muscles.',
    duree: 90,
    actions: ['Calme les douleurs aiguës de l’estomac', 'Soulage le genou'],
    indications: ['Crampe ou douleur aiguë de l’estomac', 'Douleur, gonflement du genou'],
    categories: ['Point Xi (fissure), pour les troubles aigus'],
  });
  pt('E35', 'Dúbí', '犊鼻', 'Nez de veau', {
    loc: 'Genou plié, dans le creux situé sous la rotule, en dehors du tendon rotulien (« œil externe du genou »).',
    technique: 'Assis, genou plié : pression des deux « yeux du genou » à la fois (pouce et index), en petits cercles.',
    actions: ['Soulage le genou', 'Chasse le Vent-Humidité'],
    indications: ['Douleurs, raideurs du genou', 'Genou qui « grince »'],
    categories: [],
  });
  pt('E36', 'Zúsānlǐ', '足三里', 'Trois distances du pied', {
    loc: 'À 3 cun sous E35 (sous la rotule), un travers de doigt en dehors de la crête du tibia.',
    astuce: 'Main à plat sous la rotule, index contre son bord inférieur : le point est sous l’auriculaire, un doigt en dehors de l’os. Il se contracte quand on relève le pied.',
    technique: 'Massage profond en cercles avec le pouce, ou tapotements du poing pendant une à deux minutes.',
    duree: 120,
    actions: ['Tonifie le Qi et le Sang', 'Renforce la Rate et l’Estomac', 'Fait descendre le Qi de l’Estomac', 'Renforce les défenses'],
    indications: ['Fatigue, convalescence', 'Digestion lente, ballonnements, nausées', 'Constipation ou diarrhée', 'Défenses faibles, rhumes à répétition', 'Jambes lourdes et fatiguées'],
    categories: ['Point He (mer)', 'Point de commande de l’abdomen', 'Grand point de tonification'],
    note: 'L’adage dit qu’en massant Zusanli chaque jour, on peut marcher encore « trois li » de plus : c’est le point de l’endurance.',
  });
  pt('E37', 'Shàngjùxū', '上巨虚', 'Grand vide supérieur', {
    loc: 'À 6 cun sous E35, un travers de doigt en dehors de la crête du tibia.',
    astuce: 'Deux fois quatre doigts sous le genou, sur la même ligne que E36.',
    actions: ['Règle le Gros Intestin', 'Fait circuler le Qi des intestins'],
    indications: ['Diarrhée', 'Constipation', 'Douleurs abdominales'],
    categories: ['Point He inférieur du Gros Intestin'],
  });
  pt('E40', 'Fēnglóng', '丰隆', 'Abondance et prospérité', {
    loc: 'Sur la jambe, à mi-hauteur entre le genou et la malléole externe, deux travers de doigt en dehors de la crête du tibia.',
    duree: 90,
    actions: ['Transforme les mucosités (Tan)', 'Calme l’esprit', 'Fait descendre le Qi du Poumon et de l’Estomac'],
    indications: ['Toux grasse, glaires', 'Tête lourde, vertiges', 'Nausées', 'Sensation de lourdeur générale'],
    categories: ['Point Luo (communication)', '« Le point des mucosités »'],
  });
  pt('E41', 'Jiěxī', '解溪', 'Ruisseau de la séparation', {
    loc: 'Au milieu du pli de la cheville, entre les deux tendons qui saillent quand on relève le pied.',
    actions: ['Soulage la cheville', 'Rafraîchit l’Estomac', 'Clarifie la tête'],
    indications: ['Douleur de la cheville, entorse ancienne', 'Maux de tête frontaux', 'Vertiges'],
    categories: ['Point Jing (fleuve)', 'Point de tonification'],
  });
  pt('E44', 'Nèitíng', '内庭', 'Cour intérieure', {
    loc: 'Sur le dos du pied, entre les 2ᵉ et 3ᵉ orteils, juste en arrière du bord de la commissure.',
    actions: ['Rafraîchit la chaleur de l’Estomac', 'Calme la douleur du visage'],
    indications: ['Mal de dents, gencives enflées', 'Aphtes, mauvaise haleine', 'Mal de gorge, saignements de nez', 'Brûlures d’estomac, faim excessive'],
    categories: ['Point Ying (jaillissement)'],
  });
  pt('E45', 'Lìduì', '厉兑', 'Échange rigoureux', {
    loc: 'Sur le côté externe du 2ᵉ orteil, à 0,1 cun de l’angle de l’ongle.',
    technique: PINCER, duree: 30,
    actions: ['Rafraîchit la chaleur de l’Estomac', 'Calme l’esprit'],
    indications: ['Rêves agités, sommeil troublé', 'Saignements de nez', 'Mal de dents'],
    categories: ['Point Jing (puits)', 'Dernier point du méridien'],
  });

  // ── Rate ─────────────────────────────────────────────────────────────────
  pt('RP1', 'Yǐnbái', '隐白', 'Blanc caché', {
    loc: 'Sur le côté interne du gros orteil, à 0,1 cun de l’angle de l’ongle.',
    technique: PINCER, duree: 30,
    actions: ['Retient le Sang', 'Calme l’esprit'],
    indications: ['Règles trop abondantes (en accompagnement, après avis médical)', 'Rêves agités', 'Ballonnements'],
    categories: ['Point Jing (puits)', 'Premier point du méridien'],
  });
  pt('RP3', 'Tàibái', '太白', 'Grande blancheur', {
    loc: 'Sur le bord interne du pied, dans le creux en arrière et en dessous de la tête du 1ᵉʳ métatarsien (la bosse à la base du gros orteil), à la limite de la peau de la plante.',
    actions: ['Tonifie la Rate', 'Transforme l’Humidité', 'Renforce la concentration'],
    indications: ['Fatigue et digestion lente', 'Ballonnements, selles molles', 'Manque d’appétit', 'Lourdeur, rumination'],
    categories: ['Point Yuan (source)', 'Point Shu (rivière)'],
  });
  pt('RP4', 'Gōngsūn', '公孙', 'Le duc et son petit-fils', {
    loc: 'Sur le bord interne du pied, dans le creux en avant et en dessous de la base du 1ᵉʳ métatarsien, à la limite de la peau de la plante.',
    astuce: 'Partez de RP3 et glissez le long du bord du pied vers le talon : le doigt bute contre la base de l’os, le point est juste devant.',
    duree: 90,
    actions: ['Renforce la Rate et l’Estomac', 'Fait descendre le Qi', 'Ouvre le Chong Mai'],
    indications: ['Douleurs d’estomac, nausées, vomissements', 'Ballonnements, diarrhée', 'Règles douloureuses (avec [[MC6]])'],
    categories: ['Point Luo (communication)', 'Point d’ouverture du Chong Mai'],
  });
  pt('RP6', 'Sānyīnjiāo', '三阴交', 'Croisement des trois Yin', {
    loc: 'Sur la face interne de la jambe, à 3 cun au-dessus de la pointe de la malléole interne, juste en arrière du bord du tibia.',
    astuce: 'Posez quatre doigts au-dessus de la malléole interne : le point est sous le bord de l’auriculaire, contre l’os. Il est souvent sensible.',
    duree: 90,
    actions: ['Tonifie la Rate, le Foie et les Reins', 'Nourrit le Sang et le Yin', 'Fait circuler le Sang', 'Calme l’esprit'],
    indications: ['Règles douloureuses ou irrégulières, syndrome prémenstruel', 'Troubles de la ménopause', 'Insomnie, anxiété', 'Digestion difficile, ballonnements', 'Rétention d’eau, jambes lourdes'],
    categories: ['Réunion des trois méridiens Yin du pied (Rate, Foie, Rein)'],
    grossesse: true,
    precautions: 'Pas de pression forte sur des varices.',
  });
  pt('RP8', 'Dìjī', '地机', 'Mécanisme de la terre', {
    loc: 'Sur la face interne de la jambe, à 3 cun sous RP9, juste en arrière du bord du tibia.',
    actions: ['Fait circuler le Sang', 'Calme les douleurs aiguës de l’utérus'],
    indications: ['Règles douloureuses (pendant la crise)', 'Douleurs du bas-ventre', 'Rétention d’eau'],
    categories: ['Point Xi (fissure), pour les troubles aigus'],
    grossesse: true,
  });
  pt('RP9', 'Yīnlíngquán', '阴陵泉', 'Source du tertre Yin', {
    loc: 'Dans le creux situé sous le plateau interne du tibia, à l’angle qu’il forme avec le bord du tibia.',
    astuce: 'Remontez le bord interne du tibia avec le pouce depuis la cheville : il bute sous le genou. C’est là.',
    duree: 90,
    actions: ['Transforme l’Humidité', 'Favorise l’élimination de l’eau', 'Soulage le genou'],
    indications: ['Rétention d’eau, chevilles enflées', 'Jambes lourdes', 'Ballonnements, diarrhée', 'Douleur du genou'],
    categories: ['Point He (mer)'],
  });
  pt('RP10', 'Xuèhǎi', '血海', 'Mer du Sang', {
    loc: 'Genou plié, à 2 cun au-dessus de l’angle supéro-interne de la rotule, sur le renflement du muscle vaste interne.',
    astuce: 'Asseyez-vous, posez la paume de la main droite sur votre rotule gauche, doigts vers le haut : le pouce, écarté naturellement, tombe sur le point. Et inversement.',
    duree: 90,
    actions: ['Fait circuler le Sang', 'Rafraîchit le Sang', 'Calme les démangeaisons'],
    indications: ['Démangeaisons, eczéma, urticaire', 'Règles irrégulières ou douloureuses', 'Douleur du genou'],
    categories: [],
  });
  pt('RP15', 'Dàhéng', '大横', 'Grande transversale', {
    loc: 'Sur l’abdomen, à 4 cun en dehors de l’ombilic (à l’aplomb du mamelon).',
    technique: 'Pressions lentes en expirant, puis massage du ventre en grands cercles dans le sens des aiguilles d’une montre.',
    actions: ['Fait circuler le Qi des intestins'],
    indications: ['Constipation', 'Ballonnements', 'Douleurs abdominales'],
    categories: [],
  });
  pt('RP21', 'Dàbāo', '大包', 'Grande enveloppe', {
    loc: 'Sur le côté du thorax, sur la ligne axillaire moyenne, au 6ᵉ espace intercostal.',
    technique: 'Pression douce ou frottements le long des côtes, bras levé.',
    actions: ['Fait circuler le Qi et le Sang dans tout le corps'],
    indications: ['Douleurs diffuses, « mal partout »', 'Faiblesse des membres', 'Oppression du thorax'],
    categories: ['Grand point Luo de la Rate', 'Dernier point du méridien'],
  });

  // ── Cœur ─────────────────────────────────────────────────────────────────
  pt('C1', 'Jíquán', '极泉', 'Source suprême', {
    loc: 'Au centre du creux de l’aisselle, là où l’on sent battre l’artère.',
    technique: 'Bras légèrement écarté, pression douce des doigts au fond de l’aisselle.',
    actions: ['Libère la poitrine', 'Fait circuler le Qi dans le bras'],
    indications: ['Oppression thoracique', 'Douleur du bras et de l’épaule'],
    categories: ['Premier point du méridien'],
  });
  pt('C3', 'Shàohǎi', '少海', 'Petite mer', {
    loc: 'Coude plié, entre l’extrémité interne du pli et la saillie osseuse interne du coude (épicondyle médial).',
    actions: ['Calme l’esprit', 'Détend le coude'],
    indications: ['Douleur du coude, côté interne', 'Tremblements de la main', 'Anxiété'],
    categories: ['Point He (mer)'],
  });
  pt('C5', 'Tōnglǐ', '通里', 'Communication intérieure', {
    loc: 'À 1 cun au-dessus du pli du poignet, du côté du pouce du tendon qui longe le bord de l’auriculaire.',
    actions: ['Calme l’esprit', 'Libère la langue et la voix'],
    indications: ['Palpitations', 'Voix enrouée ou éteinte sous le coup de l’émotion', 'Anxiété'],
    categories: ['Point Luo (communication)'],
  });
  pt('C6', 'Yīnxì', '阴郄', 'Fissure du Yin', {
    loc: 'À 0,5 cun au-dessus du pli du poignet, du côté du pouce du tendon qui longe le bord de l’auriculaire.',
    actions: ['Nourrit le Yin du Cœur', 'Arrête les sueurs nocturnes', 'Calme l’esprit'],
    indications: ['Sueurs nocturnes', 'Bouffées de chaleur', 'Palpitations, angoisse'],
    categories: ['Point Xi (fissure)'],
  });
  pt('C7', 'Shénmén', '神门', 'Porte de l’Esprit', {
    loc: 'Au pli du poignet, côté auriculaire, dans le creux situé du côté du pouce du tendon (fléchisseur ulnaire du carpe).',
    astuce: 'Pliez légèrement le poignet : le tendon se dessine sur le bord côté auriculaire ; le point est dans le creux juste à côté, sur le pli.',
    duree: 90,
    actions: ['Calme l’esprit (Shen)', 'Nourrit le Sang du Cœur'],
    indications: ['Insomnie, réveils nocturnes', 'Anxiété, émotivité', 'Palpitations', 'Troubles de la mémoire'],
    categories: ['Point Yuan (source)', 'Point Shu (rivière)', 'Point de dispersion'],
  });
  pt('C9', 'Shàochōng', '少冲', 'Petit assaut', {
    loc: 'Sur le côté radial de l’auriculaire (côté annulaire), à 0,1 cun de l’angle de l’ongle.',
    technique: PINCER, duree: 30,
    actions: ['Rétablit la conscience', 'Rafraîchit la chaleur du Cœur'],
    indications: ['Palpitations', 'Agitation', 'Malaise (en attendant les secours)'],
    categories: ['Point Jing (puits)', 'Point de tonification', 'Dernier point du méridien'],
  });

  // ── Intestin Grêle ───────────────────────────────────────────────────────
  pt('IG1', 'Shàozé', '少泽', 'Petit marais', {
    loc: 'Sur le côté cubital (externe) de l’auriculaire, à 0,1 cun de l’angle de l’ongle.',
    technique: PINCER, duree: 30,
    actions: ['Favorise la montée de lait', 'Rafraîchit la chaleur'],
    indications: ['Manque de lait pendant l’allaitement', 'Mal de gorge', 'Maux de tête'],
    categories: ['Point Jing (puits)', 'Premier point du méridien'],
  });
  pt('IG3', 'Hòuxī', '后溪', 'Ruisseau postérieur', {
    loc: 'Sur le bord de la main côté auriculaire, juste en arrière de la tête du 5ᵉ métacarpien, au bout du pli de la paume quand on ferme le poing.',
    astuce: 'Fermez le poing : un pli se forme au bord de la main ; le point est au bout de ce pli, à la limite de la peau de la paume.',
    technique: 'Poing fermé, pressez fortement en petits cercles tout en tournant doucement la tête ou en fléchissant le dos.',
    duree: 90,
    actions: ['Ouvre le Vaisseau Gouverneur', 'Détend la nuque et le dos', 'Chasse le Vent'],
    indications: ['Torticolis, nuque raide', 'Lumbago aigu', 'Maux de tête à l’arrière du crâne', 'Douleurs des doigts et de la main'],
    categories: ['Point Shu (rivière)', 'Point de tonification', 'Point d’ouverture du Du Mai'],
  });
  pt('IG6', 'Yǎnglǎo', '养老', 'Soutien de la vieillesse', {
    loc: 'Sur le dos de l’avant-bras, côté auriculaire, dans le creux en dehors (côté pouce) de la bosse du cubitus, 1 cun au-dessus du pli du poignet.',
    astuce: 'Paume vers le bas, posez un doigt sur la bosse du cubitus, puis tournez la paume vers la poitrine : le doigt glisse dans un creux — c’est le point.',
    actions: ['Détend les tendons', 'Clarifie les yeux'],
    indications: ['Douleur aiguë du cou, de l’épaule ou du haut du dos', 'Vue qui baisse, yeux fatigués', 'Douleur du poignet'],
    categories: ['Point Xi (fissure), pour les troubles aigus'],
  });
  pt('IG11', 'Tiānzōng', '天宗', 'Ancêtre céleste', {
    loc: 'Au milieu de l’omoplate, dans le creux situé au tiers supérieur de la ligne qui va du milieu de l’épine de l’omoplate à sa pointe.',
    technique: 'Difficile à atteindre seul : demandez à quelqu’un, ou appuyez-vous contre une balle de tennis posée contre un mur.',
    duree: 90,
    actions: ['Fait circuler le Qi dans l’omoplate', 'Libère la poitrine'],
    indications: ['Douleur de l’omoplate et de l’épaule', 'Raideur du haut du dos', 'Seins tendus, engorgement'],
    categories: [],
  });
  pt('IG19', 'Tīnggōng', '听宫', 'Palais de l’ouïe', {
    loc: 'Devant l’oreille, au milieu du tragus (le petit cartilage), dans le creux qui se forme quand on ouvre la bouche.',
    technique: 'Bouche entrouverte, pression des index en petits cercles, des deux côtés à la fois.',
    actions: ['Ouvre l’oreille', 'Calme l’esprit'],
    indications: ['Acouphènes', 'Baisse d’audition, oreille bouchée', 'Douleur de l’articulation de la mâchoire'],
    categories: ['Dernier point du méridien'],
  });

  // ── Vessie ───────────────────────────────────────────────────────────────
  pt('V1', 'Jīngmíng', '睛明', 'Clarté des yeux', {
    loc: 'Dans le petit creux situé juste au-dessus et en dedans de l’angle interne de l’œil.',
    technique: 'Yeux fermés, pincez doucement la racine du nez entre le pouce et l’index, en appuyant vers l’os et non vers l’œil.',
    duree: 30,
    actions: ['Clarifie les yeux', 'Chasse le Vent'],
    indications: ['Fatigue des yeux, écrans', 'Yeux rouges, larmoiement', 'Vision trouble'],
    categories: ['Premier point du méridien'],
  });
  pt('V2', 'Cuánzhú', '攒竹', 'Bambous rassemblés', {
    loc: 'Dans le creux au début du sourcil, à son extrémité interne.',
    technique: 'Pression des pouces vers le haut, sous le rebord de l’os, en petits cercles. Pour le hoquet : pression forte et maintenue.',
    actions: ['Chasse le Vent', 'Clarifie les yeux', 'Calme la douleur de la tête'],
    indications: ['Maux de tête frontaux', 'Fatigue oculaire', 'Sinusite frontale', 'Hoquet'],
    categories: [],
  });
  pt('V10', 'Tiānzhù', '天柱', 'Pilier céleste', {
    loc: 'Sur la nuque, à 1,3 cun de la ligne médiane, dans le creux situé en dehors des deux gros muscles verticaux de la nuque, au niveau de la 2ᵉ vertèbre cervicale.',
    astuce: 'Partez de la base du crâne au milieu, glissez sur le côté jusqu’au bord externe des gros muscles de la nuque, un peu plus bas que [[VB20]].',
    actions: ['Chasse le Vent', 'Détend la nuque', 'Clarifie la tête et les yeux'],
    indications: ['Nuque raide', 'Maux de tête à l’arrière du crâne', 'Tête lourde, yeux fatigués', 'Nez bouché'],
    categories: ['Point « fenêtre du Ciel »'],
  });
  const SHU = (organe, vertebre, d) => Object.assign({
    loc: 'Sur le dos, à 1,5 cun (deux travers de doigt) de la ligne médiane, au niveau du bord inférieur de l’apophyse épineuse de ' + vertebre + '.',
    technique: 'Allongé sur le ventre : quelqu’un appuie des deux pouces de part et d’autre de la colonne, en expirant ; ou appuyez-vous contre deux balles de tennis dans une chaussette.',
    categories: ['Point Shu du dos ' + organe],
  }, d);
  pt('V13', 'Fèishū', '肺俞', 'Transport du Poumon', SHU('du Poumon', 'T3 (3ᵉ vertèbre dorsale)', {
    actions: ['Tonifie et fait descendre le Qi du Poumon', 'Chasse le Vent'],
    indications: ['Toux, rhume, bronchite (en complément)', 'Essoufflement', 'Peau sèche'],
  }));
  pt('V15', 'Xīnshū', '心俞', 'Transport du Cœur', SHU('du Cœur', 'T5', {
    actions: ['Calme l’esprit', 'Nourrit le Cœur'],
    indications: ['Palpitations, anxiété', 'Insomnie', 'Troubles de la mémoire'],
  }));
  pt('V17', 'Géshū', '膈俞', 'Transport du diaphragme', SHU('du diaphragme', 'T7 (à hauteur de la pointe des omoplates)', {
    actions: ['Nourrit et fait circuler le Sang', 'Fait descendre le Qi'],
    indications: ['Hoquet', 'Nausées, reflux', 'Fatigue par manque de Sang', 'Éruptions qui démangent'],
    categories: ['Point Shu du dos du diaphragme', 'Point Hui (réunion) du Sang'],
  }));
  pt('V18', 'Gānshū', '肝俞', 'Transport du Foie', SHU('du Foie', 'T9', {
    actions: ['Fait circuler le Qi du Foie', 'Nourrit le Sang du Foie', 'Clarifie les yeux'],
    indications: ['Irritabilité, tensions', 'Douleurs des flancs', 'Yeux secs ou fatigués'],
  }));
  pt('V20', 'Píshū', '脾俞', 'Transport de la Rate', SHU('de la Rate', 'T11', {
    actions: ['Tonifie la Rate', 'Transforme l’Humidité', 'Nourrit le Sang'],
    indications: ['Fatigue, digestion lente', 'Ballonnements, selles molles', 'Manque d’appétit', 'Rétention d’eau'],
  }));
  pt('V21', 'Wèishū', '胃俞', 'Transport de l’Estomac', SHU('de l’Estomac', 'T12', {
    actions: ['Harmonise l’Estomac', 'Fait descendre le Qi'],
    indications: ['Douleurs d’estomac', 'Nausées', 'Manque d’appétit'],
  }));
  pt('V23', 'Shènshū', '肾俞', 'Transport des Reins', SHU('des Reins', 'L2 (2ᵉ lombaire, à hauteur de l’ombilic)', {
    technique: 'Frottez vigoureusement le bas du dos avec le dos des mains jusqu’à le réchauffer, puis pressez des pouces de part et d’autre de la colonne.',
    duree: 90,
    actions: ['Tonifie les Reins (Yin et Yang)', 'Renforce les lombes', 'Fortifie l’oreille'],
    indications: ['Lombalgie, dos fatigué', 'Fatigue profonde, frilosité', 'Acouphènes', 'Envies d’uriner fréquentes'],
  }));
  pt('V25', 'Dàchángshū', '大肠俞', 'Transport du Gros Intestin', SHU('du Gros Intestin', 'L4 (à hauteur du sommet des crêtes iliaques)', {
    duree: 90,
    actions: ['Règle les intestins', 'Renforce les lombes'],
    indications: ['Lombalgie basse, sciatique', 'Constipation', 'Ballonnements'],
  }));
  pt('V32', 'Cìliáo', '次髎', 'Deuxième trou', {
    loc: 'Sur le sacrum, dans le 2ᵉ trou sacré, à peu près à la hauteur des fossettes du bas du dos.',
    technique: 'Frictions du sacrum avec la paume jusqu’à ce qu’il chauffe, puis pression des pouces dans les petits creux.',
    actions: ['Fait circuler le Qi et le Sang du bassin', 'Renforce les lombes'],
    indications: ['Règles douloureuses', 'Douleurs du sacrum', 'Troubles urinaires'],
    categories: [],
    grossesse: true,
  });
  pt('V40', 'Wěizhōng', '委中', 'Milieu du creux', {
    loc: 'Au milieu du pli situé derrière le genou (creux poplité).',
    technique: 'Pression modérée du pouce ou des doigts recourbés, jambe détendue. Pas de pression forte : vaisseaux et nerf passent là.',
    duree: 60,
    actions: ['Détend les tendons du dos', 'Rafraîchit le Sang', 'Soulage les lombes'],
    indications: ['Lombalgie, mal de dos', 'Sciatique', 'Crampes, douleur du genou'],
    categories: ['Point He (mer)', 'Point de commande du dos et des lombes'],
    precautions: 'Ne pas masser sur des varices ou une veine gonflée.',
  });
  pt('V52', 'Zhìshì', '志室', 'Chambre de la volonté', {
    loc: 'Sur le dos, à 3 cun (quatre travers de doigt) de la ligne médiane, au niveau de L2.',
    technique: 'Mains sur les hanches, pouces vers l’arrière : pressez les muscles du bas du dos, à hauteur de la taille, en expirant.',
    actions: ['Tonifie les Reins', 'Renforce la volonté', 'Renforce les lombes'],
    indications: ['Lombalgie', 'Fatigue, manque d’élan'],
    categories: [],
  });
  pt('V57', 'Chéngshān', '承山', 'Soutien de la montagne', {
    loc: 'Au milieu de l’arrière du mollet, dans le creux qui se forme sous les deux renflements du muscle quand on se met sur la pointe des pieds.',
    duree: 90,
    actions: ['Détend les tendons', 'Soulage les jambes et les lombes', 'Traite les hémorroïdes'],
    indications: ['Crampes du mollet', 'Douleurs des jambes et des lombes', 'Hémorroïdes', 'Constipation'],
    categories: [],
  });
  pt('V60', 'Kūnlún', '昆仑', 'Monts Kunlun', {
    loc: 'Dans le creux situé entre la pointe de la malléole externe et le tendon d’Achille.',
    technique: 'Pincez la cheville entre le pouce (sur V60) et l’index (sur [[R3]], de l’autre côté), en petits cercles.',
    actions: ['Chasse le Vent', 'Détend les tendons', 'Fait descendre le Qi'],
    indications: ['Maux de tête à l’arrière du crâne', 'Nuque raide', 'Lombalgie', 'Douleur de la cheville et du talon'],
    categories: ['Point Jing (fleuve)'],
    grossesse: true,
  });
  pt('V62', 'Shēnmài', '申脉', 'Neuvième vaisseau', {
    loc: 'Directement sous la pointe de la malléole externe, dans le creux.',
    actions: ['Ouvre le Yang Qiao Mai', 'Calme l’esprit', 'Détend le dos'],
    indications: ['Insomnie (avec [[R6]])', 'Maux de tête, vertiges', 'Raideur du dos et de la nuque'],
    categories: ['Point d’ouverture du Yang Qiao Mai'],
  });
  pt('V67', 'Zhìyīn', '至阴', 'Atteindre le Yin', {
    loc: 'Sur le côté externe du petit orteil, à 0,1 cun de l’angle de l’ongle.',
    technique: PINCER, duree: 30,
    actions: ['Chasse le Vent de la tête', 'Clarifie les yeux'],
    indications: ['Maux de tête', 'Nez bouché'],
    categories: ['Point Jing (puits)', 'Dernier point du méridien'],
    grossesse: true,
    note: 'Traditionnellement chauffé à l’armoise (moxa) par un professionnel pour aider un bébé en siège à se retourner, en fin de grossesse : jamais en automassage.',
  });

  // ── Rein ─────────────────────────────────────────────────────────────────
  pt('R1', 'Yǒngquán', '涌泉', 'Source jaillissante', {
    loc: 'Sous la plante du pied, dans le creux qui se forme quand on replie les orteils, au tiers avant de la ligne qui va de la base des 2ᵉ et 3ᵉ orteils au talon.',
    astuce: 'Repliez les orteils : un creux se dessine sous l’avant-pied, entre les deux coussinets. C’est le point.',
    technique: 'Le soir, frictionnez vigoureusement la plante avec la paume (la paume opposée : main droite pour le pied gauche) jusqu’à la chaleur, puis appuyez fermement du pouce.',
    duree: 90,
    actions: ['Fait redescendre ce qui monte (chaleur, agitation)', 'Calme l’esprit', 'Nourrit le Yin', 'Rétablit la conscience'],
    indications: ['Insomnie, agitation du soir', 'Maux de tête au sommet du crâne, vertiges', 'Bouffées de chaleur', 'Pieds froids ou brûlants', 'Malaise (stimulation forte, en attendant les secours)'],
    categories: ['Point Jing (puits)', 'Premier point du méridien'],
  });
  pt('R3', 'Tàixī', '太溪', 'Grand ruisseau', {
    loc: 'Dans le creux situé entre la pointe de la malléole interne et le tendon d’Achille.',
    astuce: 'Glissez le doigt de la malléole interne vers l’arrière : il tombe dans un creux avant le tendon. On y sent parfois battre une artère.',
    duree: 90,
    actions: ['Tonifie les Reins (Yin et Yang)', 'Renforce les lombes et les genoux', 'Nourrit l’Essence'],
    indications: ['Fatigue de fond', 'Lombalgie chronique', 'Acouphènes', 'Insomnie, sueurs nocturnes', 'Mal de gorge ou de dents qui traîne'],
    categories: ['Point Yuan (source)', 'Point Shu (rivière)'],
  });
  pt('R6', 'Zhàohǎi', '照海', 'Mer lumineuse', {
    loc: 'À 1 cun sous la pointe de la malléole interne, dans le creux.',
    actions: ['Nourrit le Yin', 'Calme l’esprit', 'Humidifie la gorge', 'Ouvre le Yin Qiao Mai'],
    indications: ['Insomnie (avec [[V62]])', 'Gorge sèche, toux sèche le soir', 'Constipation par sécheresse', 'Bouffées de chaleur'],
    categories: ['Point d’ouverture du Yin Qiao Mai'],
  });
  pt('R7', 'Fùliū', '复溜', 'Courant de retour', {
    loc: 'À 2 cun au-dessus de R3, en avant du tendon d’Achille.',
    actions: ['Tonifie les Reins', 'Règle la transpiration', 'Élimine l’eau'],
    indications: ['Sueurs nocturnes ou transpiration excessive', 'Chevilles enflées', 'Bouche sèche', 'Lombalgie'],
    categories: ['Point Jing (fleuve)', 'Point de tonification'],
  });
  pt('R27', 'Shùfǔ', '俞府', 'Palais des transports', {
    loc: 'Juste sous la clavicule, à 2 cun de la ligne médiane.',
    technique: 'Croisez les mains et frottez ou tapotez le creux sous chaque clavicule, de part et d’autre du sternum.',
    actions: ['Fait descendre le Qi', 'Arrête la toux'],
    indications: ['Toux, oppression', 'Fatigue, besoin de « se réveiller »'],
    categories: ['Dernier point du méridien'],
  });

  // ── Maître du Cœur ───────────────────────────────────────────────────────
  pt('MC1', 'Tiānchí', '天池', 'Étang céleste', {
    loc: 'Au 4ᵉ espace intercostal, à 1 cun en dehors du mamelon.',
    technique: 'Pression douce de la pulpe des doigts.',
    actions: ['Libère la poitrine', 'Fait descendre le Qi'],
    indications: ['Oppression thoracique', 'Seins tendus', 'Toux'],
    categories: ['Premier point du méridien'],
  });
  pt('MC3', 'Qūzé', '曲泽', 'Marais de la courbe', {
    loc: 'Au pli du coude, du côté auriculaire du tendon du biceps.',
    actions: ['Rafraîchit la chaleur', 'Calme l’estomac'],
    indications: ['Palpitations', 'Nausées par la chaleur', 'Douleur du coude'],
    categories: ['Point He (mer)'],
  });
  pt('MC6', 'Nèiguān', '内关', 'Barrière interne', {
    loc: 'Sur la face intérieure de l’avant-bras, à 2 cun au-dessus du pli du poignet, entre les deux tendons centraux.',
    astuce: 'Posez trois doigts au-dessus du pli du poignet : le point est sous l’index, au milieu, entre les deux tendons qui saillent quand on serre le poing.',
    technique: 'Pression ferme du pouce, maintenue ou en petits cercles, 1 à 2 minutes de chaque côté. Les bracelets d’acupression appuient sur ce point.',
    duree: 90,
    actions: ['Harmonise l’Estomac, arrête les nausées', 'Libère la poitrine', 'Calme l’esprit', 'Ouvre le Yin Wei Mai'],
    indications: ['Nausées, mal des transports, nausées de grossesse', 'Vomissements, hoquet', 'Anxiété, palpitations', 'Oppression thoracique', 'Insomnie'],
    categories: ['Point Luo (communication)', 'Point d’ouverture du Yin Wei Mai', 'Point de commande de la poitrine'],
    note: 'C’est le point d’acupression le mieux étudié : plusieurs essais cliniques soutiennent son effet sur les nausées. Il est utilisé pendant la grossesse.',
  });
  pt('MC7', 'Dàlíng', '大陵', 'Grande colline', {
    loc: 'Au milieu du pli du poignet, entre les deux tendons centraux.',
    actions: ['Calme l’esprit', 'Rafraîchit la chaleur du Cœur', 'Détend le poignet'],
    indications: ['Anxiété, agitation', 'Insomnie', 'Douleur du poignet, fourmillements des doigts (en accompagnement)', 'Mauvaise haleine'],
    categories: ['Point Yuan (source)', 'Point Shu (rivière)', 'Point de dispersion'],
  });
  pt('MC8', 'Láogōng', '劳宫', 'Palais du labeur', {
    loc: 'Au creux de la paume, entre les 2ᵉ et 3ᵉ métacarpiens, là où tombe le bout du majeur quand on ferme le poing.',
    technique: 'Pressez avec le pouce de l’autre main en petits cercles ; ou posez les paumes l’une contre l’autre et frottez-les.',
    actions: ['Rafraîchit la chaleur du Cœur', 'Calme l’esprit'],
    indications: ['Anxiété, agitation', 'Aphtes, mauvaise haleine', 'Mains moites ou brûlantes'],
    categories: ['Point Ying (jaillissement)'],
  });
  pt('MC9', 'Zhōngchōng', '中冲', 'Assaut central', {
    loc: 'Au centre de la pointe du majeur.',
    technique: 'Pression forte avec l’ongle du pouce, par à-coups.',
    duree: 30,
    actions: ['Rétablit la conscience', 'Rafraîchit la chaleur'],
    indications: ['Malaise, sensation d’évanouissement (en attendant les secours)', 'Coup de chaleur', 'Fièvre'],
    categories: ['Point Jing (puits)', 'Point de tonification', 'Dernier point du méridien'],
  });

  // ── Triple Réchauffeur ───────────────────────────────────────────────────
  pt('TR1', 'Guānchōng', '关冲', 'Assaut de la barrière', {
    loc: 'Sur le côté cubital de l’annulaire (côté auriculaire), à 0,1 cun de l’angle de l’ongle.',
    technique: PINCER, duree: 30,
    actions: ['Rafraîchit la chaleur', 'Soulage la gorge'],
    indications: ['Mal de gorge', 'Fièvre', 'Maux de tête'],
    categories: ['Point Jing (puits)', 'Premier point du méridien'],
  });
  pt('TR3', 'Zhōngzhǔ', '中渚', 'Îlot central', {
    loc: 'Sur le dos de la main, entre les 4ᵉ et 5ᵉ métacarpiens, juste en arrière des articulations.',
    astuce: 'Partez du creux entre l’annulaire et l’auriculaire et remontez sur le dos de la main, entre les deux os, en arrière des jointures.',
    actions: ['Ouvre les oreilles', 'Chasse le Vent', 'Fait circuler le Qi du bras'],
    indications: ['Acouphènes, oreille bouchée', 'Maux de tête des tempes', 'Douleurs des doigts et du poignet'],
    categories: ['Point Shu (rivière)', 'Point de tonification'],
  });
  pt('TR4', 'Yángchí', '阳池', 'Étang du Yang', {
    loc: 'Au pli du dos du poignet, dans le creux situé du côté auriculaire du tendon extenseur commun des doigts.',
    actions: ['Détend le poignet', 'Réchauffe les mains'],
    indications: ['Douleur du poignet', 'Mains froides', 'Soif, bouche sèche'],
    categories: ['Point Yuan (source)'],
  });
  pt('TR5', 'Wàiguān', '外关', 'Barrière externe', {
    loc: 'Sur le dos de l’avant-bras, à 2 cun au-dessus du pli du poignet, entre le radius et le cubitus.',
    astuce: 'Trois doigts au-dessus du pli du dos du poignet, au milieu, entre les deux os : c’est le pendant de [[MC6]], de l’autre côté.',
    actions: ['Chasse le Vent et libère la surface', 'Ouvre le Yang Wei Mai', 'Dégage l’oreille et les tempes'],
    indications: ['Rhume, fièvre débutante', 'Maux de tête des tempes, migraine (avec [[VB41]])', 'Acouphènes', 'Douleurs du bras et du poignet'],
    categories: ['Point Luo (communication)', 'Point d’ouverture du Yang Wei Mai'],
  });
  pt('TR6', 'Zhīgōu', '支沟', 'Fossé de la branche', {
    loc: 'Sur le dos de l’avant-bras, à 3 cun au-dessus du pli du poignet, entre le radius et le cubitus.',
    astuce: 'Quatre doigts au-dessus du pli du dos du poignet, au milieu.',
    duree: 90,
    actions: ['Fait circuler le Qi', 'Fait descendre et favorise le transit', 'Soulage les flancs'],
    indications: ['Constipation (le point classique)', 'Douleurs des côtes et des flancs', 'Voix enrouée'],
    categories: ['Point Jing (fleuve)'],
  });
  pt('TR14', 'Jiānliáo', '肩髎', 'Trou de l’épaule', {
    loc: 'Dans le creux situé en arrière et en dessous de l’acromion quand le bras est levé à l’horizontale (le creux arrière de l’épaule).',
    actions: ['Fait circuler le Qi dans l’épaule', 'Chasse le Vent-Humidité'],
    indications: ['Douleur et raideur de l’épaule', '« Épaule gelée » (en accompagnement)'],
    categories: [],
  });
  pt('TR17', 'Yìfēng', '翳风', 'Écran du vent', {
    loc: 'Derrière le lobe de l’oreille, dans le creux entre l’angle de la mâchoire et l’os mastoïde.',
    technique: 'Pression douce vers l’avant, des deux côtés à la fois, en ouvrant légèrement la bouche.',
    actions: ['Chasse le Vent', 'Ouvre l’oreille', 'Détend la mâchoire'],
    indications: ['Acouphènes, douleur d’oreille', 'Douleur de la mâchoire', 'Hoquet', 'Paralysie faciale (en accompagnement)'],
    categories: [],
  });
  pt('TR21', 'Ěrmén', '耳门', 'Porte de l’oreille', {
    loc: 'Devant l’oreille, dans le creux situé devant l’échancrure au-dessus du tragus, bouche ouverte.',
    actions: ['Ouvre l’oreille'],
    indications: ['Acouphènes, surdité', 'Douleur d’oreille', 'Mal de dents (mâchoire supérieure)'],
    categories: [],
  });
  pt('TR23', 'Sīzhúkōng', '丝竹空', 'Creux du bambou soyeux', {
    loc: 'Dans le creux situé à l’extrémité externe du sourcil.',
    technique: DOUX, duree: 45,
    actions: ['Chasse le Vent', 'Clarifie les yeux', 'Calme la douleur'],
    indications: ['Maux de tête des tempes', 'Fatigue oculaire', 'Tics des paupières', 'Vertiges'],
    categories: ['Dernier point du méridien'],
  });

  // ── Vésicule Biliaire ────────────────────────────────────────────────────
  pt('VB1', 'Tóngzǐliáo', '瞳子髎', 'Trou de la pupille', {
    loc: 'À 0,5 cun en dehors de l’angle externe de l’œil, dans le creux du rebord osseux de l’orbite.',
    technique: DOUX, duree: 45,
    actions: ['Clarifie les yeux', 'Chasse le Vent'],
    indications: ['Fatigue des yeux', 'Maux de tête des tempes', 'Yeux rouges'],
    categories: ['Premier point du méridien'],
  });
  pt('VB2', 'Tīnghuì', '听会', 'Réunion de l’ouïe', {
    loc: 'Devant l’oreille, dans le creux situé devant l’échancrure sous le tragus, bouche ouverte.',
    actions: ['Ouvre l’oreille', 'Détend la mâchoire'],
    indications: ['Acouphènes, baisse d’audition', 'Douleur de la mâchoire'],
    categories: [],
  });
  pt('VB8', 'Shuàigǔ', '率谷', 'Suivre la vallée', {
    loc: 'Sur le côté de la tête, à 1,5 cun (deux travers de doigt) au-dessus du sommet de l’oreille.',
    astuce: 'Pliez l’oreille vers l’avant : de son sommet, montez de deux doigts. Le point est souvent sensible pendant une migraine.',
    actions: ['Chasse le Vent', 'Calme la douleur de la tête'],
    indications: ['Migraine, maux de tête des tempes', 'Vertiges', 'Nausées'],
    categories: [],
  });
  pt('VB14', 'Yángbái', '阳白', 'Blancheur du Yang', {
    loc: 'Sur le front, à 1 cun au-dessus du milieu du sourcil, à l’aplomb de la pupille.',
    actions: ['Chasse le Vent', 'Clarifie les yeux', 'Calme la douleur du front'],
    indications: ['Maux de tête frontaux', 'Fatigue oculaire', 'Paupière lourde'],
    categories: [],
  });
  pt('VB20', 'Fēngchí', '风池', 'Étang du vent', {
    loc: 'Sous la base du crâne, dans le creux situé entre les insertions des deux grands muscles du cou (sterno-cléido-mastoïdien et trapèze), au niveau de [[VG16]].',
    astuce: 'Mains autour de la tête, pouces sous l’os de l’occiput au milieu : glissez-les vers l’extérieur jusqu’à un creux de chaque côté. C’est là.',
    technique: 'Pressez des deux pouces vers le haut, comme vers les yeux opposés, en petits cercles, tête légèrement inclinée en arrière.',
    duree: 90,
    actions: ['Chasse le Vent (extérieur et intérieur)', 'Clarifie la tête et les yeux', 'Détend la nuque'],
    indications: ['Maux de tête, migraine', 'Rhume débutant', 'Nuque raide', 'Vertiges', 'Yeux fatigués', 'Insomnie'],
    categories: ['Réunion des méridiens de la Vésicule biliaire et du Triple Réchauffeur avec le Yang Wei Mai'],
  });
  pt('VB21', 'Jiānjǐng', '肩井', 'Puits de l’épaule', {
    loc: 'Au sommet de l’épaule, au milieu de la ligne qui relie la 7ᵉ vertèbre cervicale (la plus saillante) au bout de l’épaule.',
    technique: PETRIR, duree: 60,
    actions: ['Détend les épaules et la nuque', 'Fait descendre le Qi', 'Favorise la circulation dans les seins'],
    indications: ['Épaules et nuque contractées', 'Maux de tête de tension', 'Seins tendus, engorgement'],
    categories: [],
    grossesse: true,
  });
  pt('VB30', 'Huántiào', '环跳', 'Sauter en cercle', {
    loc: 'Sur la fesse, à la jonction du tiers externe et des deux tiers internes de la ligne qui va du grand trochanter (la bosse de la hanche) au bas du sacrum.',
    technique: 'Couché sur le côté, jambe du dessus pliée : pression profonde du coude ou du poing. Seul : allongé sur une balle de tennis.',
    duree: 90,
    actions: ['Fait circuler le Qi et le Sang dans la jambe', 'Chasse le Vent-Humidité'],
    indications: ['Sciatique', 'Douleur de la hanche et de la fesse', 'Faiblesse des jambes'],
    categories: [],
  });
  pt('VB31', 'Fēngshì', '风市', 'Marché du vent', {
    loc: 'Sur la face externe de la cuisse, là où tombe le bout du majeur quand on se tient debout, bras le long du corps.',
    actions: ['Chasse le Vent', 'Calme les démangeaisons'],
    indications: ['Démangeaisons', 'Engourdissement, douleur de la cuisse', 'Sciatique'],
    categories: [],
  });
  pt('VB34', 'Yánglíngquán', '阳陵泉', 'Source de la colline Yang', {
    loc: 'Sur la face externe de la jambe, dans le creux situé en avant et en dessous de la tête du péroné (la petite bosse osseuse sous le genou, à l’extérieur).',
    astuce: 'Trouvez la petite bosse osseuse en dehors, sous le genou : glissez en avant et en bas, le doigt tombe dans un creux.',
    duree: 90,
    actions: ['Détend les tendons et les muscles', 'Fait circuler le Qi du Foie', 'Soulage les flancs'],
    indications: ['Crampes, raideurs musculaires, tendinites', 'Douleur du genou', 'Douleurs des côtes et des flancs', 'Bouche amère, nausées'],
    categories: ['Point He (mer)', 'Point Hui (réunion) des tendons et des muscles'],
  });
  pt('VB37', 'Guāngmíng', '光明', 'Lumière brillante', {
    loc: 'Sur la face externe de la jambe, à 5 cun au-dessus de la malléole externe, en avant du péroné.',
    actions: ['Clarifie les yeux'],
    indications: ['Yeux fatigués, vue qui baisse', 'Douleur des seins'],
    categories: ['Point Luo (communication)'],
  });
  pt('VB39', 'Xuánzhōng', '悬钟', 'Cloche suspendue', {
    loc: 'Sur la face externe de la jambe, à 3 cun (quatre doigts) au-dessus de la malléole externe, en avant du péroné.',
    technique: 'Pression ferme pendant que l’on tourne doucement la tête de droite à gauche.',
    actions: ['Nourrit la moelle', 'Détend la nuque'],
    indications: ['Torticolis, nuque raide', 'Douleurs des jambes', 'Faiblesse'],
    categories: ['Point Hui (réunion) des moelles'],
  });
  pt('VB40', 'Qiūxū', '丘墟', 'Ruines de la colline', {
    loc: 'En avant et en dessous de la malléole externe, dans le creux situé en dehors du tendon extenseur des orteils.',
    actions: ['Fait circuler le Qi', 'Soulage la cheville'],
    indications: ['Cheville fragile, suites d’entorse', 'Douleur des flancs', 'Douleur du cou'],
    categories: ['Point Yuan (source)'],
  });
  pt('VB41', 'Zúlínqì', '足临泣', 'Larmes du pied', {
    loc: 'Sur le dos du pied, dans le creux situé juste en avant de la jonction des 4ᵉ et 5ᵉ métatarsiens.',
    astuce: 'Partez de la commissure entre 4ᵉ et 5ᵉ orteils et remontez entre les deux os jusqu’à ce que le doigt bute.',
    actions: ['Fait circuler le Qi du Foie et de la Vésicule', 'Ouvre le Dai Mai'],
    indications: ['Migraine, maux de tête des tempes (avec [[TR5]])', 'Seins tendus avant les règles', 'Douleurs des flancs', 'Douleur du pied'],
    categories: ['Point Shu (rivière)', 'Point d’ouverture du Dai Mai'],
  });
  pt('VB44', 'Zúqiàoyīn', '足窍阴', 'Orifice Yin du pied', {
    loc: 'Sur le côté externe du 4ᵉ orteil, à 0,1 cun de l’angle de l’ongle.',
    technique: PINCER, duree: 30,
    actions: ['Rafraîchit la chaleur', 'Calme l’esprit'],
    indications: ['Migraine', 'Sommeil agité, rêves'],
    categories: ['Point Jing (puits)', 'Dernier point du méridien'],
  });

  // ── Foie ─────────────────────────────────────────────────────────────────
  pt('F1', 'Dàdūn', '大敦', 'Grande abondance', {
    loc: 'Sur le côté externe du gros orteil (côté 2ᵉ orteil), à 0,1 cun de l’angle de l’ongle.',
    technique: PINCER, duree: 30,
    actions: ['Fait circuler le Qi du Foie', 'Retient le Sang'],
    indications: ['Règles trop abondantes (en accompagnement)', 'Douleurs du bas-ventre'],
    categories: ['Point Jing (puits)', 'Premier point du méridien'],
  });
  pt('F2', 'Xíngjiān', '行间', 'Intervalle du mouvement', {
    loc: 'Sur le dos du pied, entre le 1ᵉʳ et le 2ᵉ orteil, juste en arrière du bord de la commissure.',
    actions: ['Rafraîchit le Feu du Foie', 'Fait descendre le Yang du Foie', 'Calme l’esprit'],
    indications: ['Irritabilité, colère', 'Maux de tête « qui battent », yeux rouges', 'Insomnie avec agitation', 'Bouffées de chaleur', 'Saignements de nez'],
    categories: ['Point Ying (jaillissement)', 'Point de dispersion'],
  });
  pt('F3', 'Tàichōng', '太冲', 'Grand assaut', {
    loc: 'Sur le dos du pied, entre les 1ᵉʳ et 2ᵉ métatarsiens, dans le creux situé en avant de la jonction de leurs bases.',
    astuce: 'Glissez le doigt entre le gros orteil et le 2ᵉ, puis remontez sur le dos du pied entre les deux os : il bute dans un creux souvent sensible.',
    technique: 'Pression du pouce en remontant vers la cheville, petits cercles. Avec [[GI4]], c’est l’association des « quatre barrières ».',
    duree: 90,
    actions: ['Fait circuler le Qi du Foie', 'Apaise le Yang du Foie', 'Nourrit le Sang du Foie', 'Calme l’esprit et les spasmes'],
    indications: ['Stress, irritabilité, tensions', 'Maux de tête, migraine, vertiges', 'Règles douloureuses, syndrome prémenstruel', 'Crampes', 'Yeux fatigués', 'Tension artérielle un peu élevée (en accompagnement)'],
    categories: ['Point Yuan (source)', 'Point Shu (rivière)'],
  });
  pt('F13', 'Zhāngmén', '章门', 'Porte des écrits', {
    loc: 'Sur le flanc, juste sous l’extrémité libre de la 11ᵉ côte.',
    astuce: 'Coudes au corps, le point est souvent là où touche la pointe du coude.',
    actions: ['Harmonise le Foie et la Rate', 'Fait circuler le Qi'],
    indications: ['Ballonnements, digestion difficile', 'Douleurs des flancs'],
    categories: ['Point Mu (alarme) de la Rate', 'Point Hui (réunion) des organes Zang'],
  });
  pt('F14', 'Qīmén', '期门', 'Porte de l’échéance', {
    loc: 'Sur la poitrine, au 6ᵉ espace intercostal, à l’aplomb du mamelon (4 cun de la ligne médiane).',
    astuce: 'Descendez de deux côtes sous le mamelon : le point est dans l’espace entre les côtes.',
    technique: 'Pression douce dans l’espace intercostal, ou frottements en éventail le long des côtes.',
    actions: ['Fait circuler le Qi du Foie', 'Harmonise le Foie et l’Estomac'],
    indications: ['Douleurs des côtes et des flancs', 'Oppression, soupirs', 'Digestion difficile par le stress', 'Seins tendus'],
    categories: ['Point Mu (alarme) du Foie', 'Dernier point du méridien'],
  });

  // ── Vaisseau Conception ──────────────────────────────────────────────────
  pt('VC3', 'Zhōngjí', '中极', 'Pôle central', {
    loc: 'Sur la ligne médiane du bas-ventre, à 4 cun sous l’ombilic (un pouce au-dessus du pubis).',
    technique: 'Pression douce, ou paume posée chaude.',
    actions: ['Règle la Vessie', 'Rafraîchit l’Humidité-Chaleur du bas'],
    indications: ['Envies d’uriner fréquentes, brûlures (consulter si fièvre)', 'Règles douloureuses'],
    categories: ['Point Mu (alarme) de la Vessie'],
    grossesse: true,
  });
  pt('VC4', 'Guānyuán', '关元', 'Barrière de l’origine', {
    loc: 'Sur la ligne médiane du bas-ventre, à 3 cun (quatre doigts) sous l’ombilic.',
    technique: 'Paume posée sur le point, l’autre main par-dessus, immobile et chaude, en respirant dans le ventre ; ou bouillotte tiède.',
    duree: 120,
    actions: ['Tonifie le Qi originel (Yuan Qi) et les Reins', 'Réchauffe le bas-ventre', 'Nourrit le Sang'],
    indications: ['Fatigue profonde', 'Frilosité, ventre froid', 'Règles douloureuses améliorées par la chaleur', 'Envies d’uriner fréquentes'],
    categories: ['Point Mu (alarme) de l’Intestin grêle', 'Grand point de tonification'],
    grossesse: true,
  });
  pt('VC6', 'Qìhǎi', '气海', 'Mer du Qi', {
    loc: 'Sur la ligne médiane du bas-ventre, à 1,5 cun (deux doigts) sous l’ombilic.',
    technique: 'Massage circulaire lent dans le sens des aiguilles d’une montre, ou main posée chaude, en respiration abdominale.',
    duree: 120,
    actions: ['Tonifie et fait circuler le Qi', 'Réchauffe et renforce le Yang'],
    indications: ['Fatigue, manque de souffle', 'Ballonnements', 'Selles molles', 'Règles douloureuses'],
    categories: ['Point de « la mer du Qi » inférieure'],
    grossesse: true,
  });
  pt('VC8', 'Shénquè', '神阙', 'Palais de l’Esprit', {
    loc: 'Au centre de l’ombilic.',
    technique: 'On n’y appuie pas : on le réchauffe. Paume posée sur le nombril, ou bouillotte tiède, en respirant lentement.',
    duree: 180,
    actions: ['Réchauffe le Yang', 'Renforce la Rate et les intestins'],
    indications: ['Diarrhée par le froid', 'Ventre froid, douleurs améliorées par la chaleur', 'Fatigue'],
    categories: [],
  });
  pt('VC12', 'Zhōngwǎn', '中脘', 'Milieu de l’estomac', {
    loc: 'Sur la ligne médiane de l’abdomen, à 4 cun au-dessus de l’ombilic — à mi-chemin entre l’ombilic et la pointe du sternum.',
    technique: 'Massage circulaire doux dans le sens des aiguilles d’une montre, à distance des repas, ou main posée chaude.',
    duree: 120,
    actions: ['Harmonise l’Estomac', 'Tonifie la Rate', 'Transforme l’Humidité', 'Fait descendre le Qi'],
    indications: ['Douleurs d’estomac, crampes', 'Nausées, reflux', 'Ballonnements, digestion lente', 'Manque d’appétit'],
    categories: ['Point Mu (alarme) de l’Estomac', 'Point Hui (réunion) des entrailles Fu'],
    precautions: 'Pas juste après un repas copieux.',
  });
  pt('VC17', 'Dànzhōng', '膻中', 'Centre de la poitrine', {
    loc: 'Sur le sternum, au niveau du 4ᵉ espace intercostal — entre les mamelons chez l’homme.',
    technique: 'Pression douce du majeur en petits cercles, ou paume posée, en respirant amplement. On peut aussi tapoter doucement.',
    duree: 90,
    actions: ['Libère la poitrine', 'Tonifie et fait circuler le Qi', 'Fait descendre le Qi du Poumon'],
    indications: ['Oppression, anxiété, gorge serrée', 'Essoufflement, toux', 'Palpitations', 'Manque de lait'],
    categories: ['Point Mu (alarme) du Maître du Cœur', 'Point Hui (réunion) du Qi', '« Mer du Qi » supérieure'],
  });
  pt('VC22', 'Tiāntū', '天突', 'Proéminence céleste', {
    loc: 'Au centre du creux situé au-dessus du sternum (fourchette sternale).',
    technique: 'Pression très douce de l’index, dirigée vers le bas, derrière le sternum — jamais vers la gorge.',
    duree: 30,
    actions: ['Fait descendre le Qi du Poumon', 'Soulage la gorge', 'Transforme les mucosités'],
    indications: ['Toux, gorge qui gratte', 'Voix enrouée', 'Sensation de boule dans la gorge', 'Hoquet'],
    categories: ['Point « fenêtre du Ciel »'],
  });
  pt('VC24', 'Chéngjiāng', '承浆', 'Recevoir la salive', {
    loc: 'Dans le creux situé au milieu du sillon sous la lèvre inférieure.',
    actions: ['Chasse le Vent du visage', 'Calme la douleur'],
    indications: ['Mal de dents', 'Aphtes, salivation', 'Paralysie faciale (en accompagnement)'],
    categories: ['Dernier point du vaisseau'],
  });

  // ── Vaisseau Gouverneur ──────────────────────────────────────────────────
  pt('VG4', 'Mìngmén', '命门', 'Porte de la vie', {
    loc: 'Sur la colonne, sous l’apophyse épineuse de la 2ᵉ vertèbre lombaire — à peu près en face de l’ombilic.',
    technique: 'Frottez vigoureusement le bas du dos avec le dos des mains ou la paume jusqu’à ce qu’il chauffe, puis posez la paume immobile.',
    duree: 90,
    actions: ['Tonifie le Yang des Reins', 'Réchauffe', 'Renforce les lombes'],
    indications: ['Lombalgie par le froid', 'Frilosité, fatigue profonde', 'Envies d’uriner la nuit'],
    categories: [],
  });
  pt('VG14', 'Dàzhuī', '大椎', 'Grande vertèbre', {
    loc: 'Sur la colonne, sous l’apophyse épineuse de la 7ᵉ vertèbre cervicale — la plus saillante quand on penche la tête en avant.',
    technique: 'Frictions rapides jusqu’à la chaleur, ou pression en petits cercles.',
    actions: ['Libère la surface, chasse le Vent-Froid', 'Fait baisser la fièvre', 'Renforce le Yang et les défenses'],
    indications: ['Rhume débutant, frissons', 'Fièvre', 'Nuque raide', 'Défenses faibles'],
    categories: ['Réunion de tous les méridiens Yang'],
  });
  pt('VG16', 'Fēngfǔ', '风府', 'Palais du vent', {
    loc: 'Sur la ligne médiane de la nuque, 1 cun au-dessus de la lisière des cheveux, dans le creux sous la bosse de l’occiput.',
    technique: 'Pression douce du majeur vers le haut, sous l’os, tête légèrement penchée en avant.',
    actions: ['Chasse le Vent', 'Clarifie l’esprit'],
    indications: ['Maux de tête', 'Rhume, nuque raide', 'Vertiges'],
    categories: ['Point « fenêtre du Ciel »'],
  });
  pt('VG20', 'Bǎihuì', '百会', 'Cent réunions', {
    loc: 'Au sommet du crâne, sur la ligne médiane, à mi-chemin de la ligne qui relie les sommets des deux oreilles.',
    astuce: 'Pouces sur le haut des oreilles, faites se rejoindre les majeurs au sommet de la tête : ils tombent dans un léger creux.',
    technique: 'Pression du majeur en petits cercles, ou tapotements légers du bout des doigts.',
    actions: ['Fait monter le Yang clair', 'Calme l’esprit', 'Clarifie la tête'],
    indications: ['Maux de tête du sommet du crâne', 'Vertiges, tête embrumée', 'Baisse de moral, fatigue', 'Troubles de la mémoire, insomnie', 'Hémorroïdes (traditionnel)'],
    categories: ['Réunion des méridiens Yang', '« Mer des moelles »'],
  });
  pt('VG24', 'Shéntíng', '神庭', 'Cour de l’Esprit', {
    loc: 'Sur la ligne médiane du front, 0,5 cun au-dessus de la lisière des cheveux.',
    actions: ['Calme l’esprit', 'Ouvre le nez'],
    indications: ['Anxiété, insomnie', 'Vertiges', 'Rhinite'],
    categories: [],
  });
  pt('VG26', 'Shuǐgōu', '水沟', 'Fossé de l’eau (Renzhong)', {
    loc: 'Sur le sillon sous le nez, à la jonction de son tiers supérieur et de ses deux tiers inférieurs.',
    technique: 'Pression forte et brève avec l’ongle de l’index, répétée. Pour un lumbago : pressez en bougeant doucement le bassin.',
    duree: 30,
    actions: ['Rétablit la conscience', 'Calme l’esprit', 'Détend la colonne'],
    indications: ['Malaise, évanouissement — en attendant les secours (15 ou 112)', 'Lumbago aigu'],
    categories: ['Point de réanimation traditionnel'],
  });

  // ── Points hors méridiens ────────────────────────────────────────────────
  pt('Yintang', 'Yìntáng', '印堂', 'Salle du sceau', {
    oms: 'EX-HN3',
    loc: 'Entre les deux sourcils, au milieu.',
    technique: 'Pression douce du majeur en petits cercles, ou mouvements de lissage du point vers le haut du front, yeux fermés.',
    duree: 90,
    actions: ['Calme l’esprit', 'Ouvre le nez', 'Chasse le Vent'],
    indications: ['Stress, anxiété', 'Insomnie', 'Maux de tête frontaux', 'Nez bouché, sinusite'],
    categories: ['Point hors méridien (rattaché au Vaisseau Gouverneur dans la norme chinoise)'],
  });
  pt('Taiyang', 'Tàiyáng', '太阳', 'Soleil suprême', {
    oms: 'EX-HN5',
    loc: 'Dans le creux de la tempe, environ 1 cun en arrière du milieu entre l’extrémité du sourcil et l’angle externe de l’œil.',
    technique: 'Pression des majeurs des deux côtés à la fois, en petits cercles lents vers l’arrière.',
    actions: ['Chasse le Vent', 'Calme la douleur', 'Clarifie les yeux'],
    indications: ['Maux de tête des tempes, migraine', 'Yeux fatigués ou rouges'],
    categories: ['Point hors méridien'],
  });
  pt('Yuyao', 'Yúyāo', '鱼腰', 'Dos du poisson', {
    oms: 'EX-HN4',
    loc: 'Au milieu du sourcil, à l’aplomb de la pupille.',
    technique: DOUX, duree: 45,
    actions: ['Clarifie les yeux', 'Calme la douleur'],
    indications: ['Fatigue des yeux', 'Douleur du sourcil', 'Paupière qui tressaute'],
    categories: ['Point hors méridien'],
  });
  pt('Sishencong', 'Sìshéncōng', '四神聪', 'Quatre intelligences de l’esprit', {
    oms: 'EX-HN1',
    loc: 'Quatre points au sommet du crâne, à 1 cun en avant, en arrière et de chaque côté de [[VG20]].',
    technique: 'Bout des doigts posés en couronne autour du sommet du crâne, petits cercles, puis tapotements légers.',
    actions: ['Calme l’esprit', 'Clarifie la tête'],
    indications: ['Insomnie', 'Vertiges, maux de tête', 'Mémoire et concentration'],
    categories: ['Point hors méridien'],
  });
  pt('Anmian', 'Ānmián', '安眠', 'Sommeil paisible', {
    loc: 'Derrière l’oreille, à mi-chemin entre [[TR17]] (derrière le lobe) et [[VB20]] (sous l’occiput).',
    technique: 'Le soir au coucher, pression des majeurs des deux côtés en petits cercles lents.',
    duree: 90,
    actions: ['Calme l’esprit', 'Apaise le Foie'],
    indications: ['Insomnie, difficultés d’endormissement', 'Agitation, palpitations', 'Vertiges'],
    categories: ['Point hors méridien'],
  });
  pt('Bitong', 'Bítōng', '鼻通', 'Passage du nez (Shangyingxiang)', {
    oms: 'EX-HN8',
    loc: 'De chaque côté du nez, à l’extrémité supérieure du sillon de l’aile du nez, à la jonction de l’os et du cartilage.',
    technique: 'Frottez de haut en bas les côtés du nez avec les index, puis pressez le point en petits cercles.',
    actions: ['Ouvre le nez'],
    indications: ['Nez bouché', 'Rhinite, sinusite', 'Rhume des foins'],
    categories: ['Point hors méridien'],
  });
  pt('Dingchuan', 'Dìngchuǎn', '定喘', 'Calmer l’essoufflement', {
    oms: 'EX-B1',
    loc: 'Sur le haut du dos, à 0,5 cun de part et d’autre de [[VG14]] (sous la 7ᵉ cervicale).',
    actions: ['Calme la toux et l’essoufflement'],
    indications: ['Toux', 'Essoufflement, sifflements (en complément d’un traitement)', 'Nuque raide'],
    categories: ['Point hors méridien'],
  });
  pt('Shiqizhui', 'Shíqīzhuī', '十七椎', 'Dix-septième vertèbre', {
    oms: 'EX-B8',
    loc: 'Sur la ligne médiane du bas du dos, sous l’apophyse épineuse de la 5ᵉ vertèbre lombaire.',
    technique: 'Pression ferme du pouce ou frictions chaudes, au moment des douleurs.',
    actions: ['Fait circuler le Qi et le Sang du bassin'],
    indications: ['Règles douloureuses', 'Lombalgie basse'],
    categories: ['Point hors méridien'],
    grossesse: true,
  });
  pt('Luozhen', 'Luòzhěn', '落枕', 'Torticolis (Wailaogong)', {
    oms: 'EX-UE8',
    loc: 'Sur le dos de la main, entre les 2ᵉ et 3ᵉ métacarpiens, à 0,5 cun en arrière des articulations.',
    technique: 'Pressez fortement en petits cercles tout en tournant lentement la tête, dans les limites de la douleur.',
    duree: 90,
    actions: ['Détend la nuque', 'Calme la douleur'],
    indications: ['Torticolis du réveil', 'Nuque raide', 'Douleur de l’épaule'],
    categories: ['Point hors méridien'],
  });
  pt('Yaotongdian', 'Yāotòngdiǎn', '腰痛点', 'Points du lumbago', {
    oms: 'EX-UE7',
    loc: 'Deux points sur le dos de chaque main : entre les 2ᵉ et 3ᵉ métacarpiens, et entre les 4ᵉ et 5ᵉ, à mi-chemin entre le pli du poignet et les articulations.',
    technique: 'Pressez les deux points à la fois (pouce et index), fortement, tout en mobilisant doucement le bas du dos.',
    duree: 90,
    actions: ['Calme la douleur lombaire aiguë'],
    indications: ['Lumbago, « tour de reins »'],
    categories: ['Point hors méridien'],
  });
  pt('Heding', 'Hèdǐng', '鹤顶', 'Sommet de la grue', {
    oms: 'EX-LE2',
    loc: 'Au-dessus du genou, dans le creux situé au milieu du bord supérieur de la rotule.',
    actions: ['Soulage le genou'],
    indications: ['Douleurs et faiblesse du genou'],
    categories: ['Point hors méridien'],
  });
  pt('Neixiyan', 'Nèixīyǎn', '内膝眼', 'Œil interne du genou', {
    oms: 'EX-LE4',
    loc: 'Genou plié, dans le creux situé sous la rotule, en dedans du tendon rotulien.',
    technique: 'Assis, genou plié : pressez les deux « yeux du genou » à la fois, celui-ci et [[E35]], entre pouce et index.',
    actions: ['Soulage le genou', 'Chasse le Vent-Humidité'],
    indications: ['Douleurs, raideurs du genou'],
    categories: ['Point hors méridien'],
  });

  MTC.points = L;

})(window);
