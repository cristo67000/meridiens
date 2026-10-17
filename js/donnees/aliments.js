'use strict';
/*
 * Les aliments selon la diététique chinoise.
 *
 *   nature    chaud · tiede · neutre · frais · froid — l'effet thermique sur le corps
 *   saveurs   douce, piquante, acide, amere, salee, fade, astringente
 *   organes   méridiens vers lesquels l'aliment se dirige (son « tropisme »)
 *   actions   ce qu'il fait ; bon : quand il aide ; attention : quand le modérer
 *
 * Les classifications varient un peu d'un auteur à l'autre ; on a retenu les
 * plus courantes dans les ouvrages chinois de diététique. Pour les aliments
 * venus d'ailleurs, l'usage occidental de la diététique chinoise.
 */
(function (racine) {
  const MTC = racine.MTC = racine.MTC || {};

  MTC.categoriesAliments = [
    { id: 'cereales', nom: 'Céréales et féculents' },
    { id: 'legumineuses', nom: 'Légumineuses et soja' },
    { id: 'legumes', nom: 'Légumes' },
    { id: 'fruits', nom: 'Fruits' },
    { id: 'noix', nom: 'Noix et graines' },
    { id: 'viandes', nom: 'Viandes et œufs' },
    { id: 'poissons', nom: 'Poissons et fruits de mer' },
    { id: 'laitages', nom: 'Produits laitiers' },
    { id: 'aromates', nom: 'Épices, aromates et plantes' },
    { id: 'sucres', nom: 'Sucres et condiments' },
    { id: 'boissons', nom: 'Boissons' },
    { id: 'moderer', nom: 'À modérer' },
  ];

  MTC.natures = [
    { id: 'chaud', nom: 'Chaud', texte: 'Réchauffe fortement, active, fait transpirer. Pour le froid intense ; à éviter en cas de chaleur, de fièvre, de sécheresse.' },
    { id: 'tiede', nom: 'Tiède', texte: 'Réchauffe doucement, tonifie le Qi et le Yang. Idéal en hiver et pour les personnes frileuses ou fatiguées.' },
    { id: 'neutre', nom: 'Neutre', texte: 'Ni chaud ni froid : nourrit et équilibre. La base de l’alimentation, adaptée à tous et en toutes saisons.' },
    { id: 'frais', nom: 'Frais', texte: 'Rafraîchit doucement, calme, nourrit le Yin et les liquides. Utile en été et en cas de chaleur.' },
    { id: 'froid', nom: 'Froid', texte: 'Rafraîchit fortement, apaise la chaleur. À réserver aux états de chaleur ; nuit à la digestion des personnes frileuses.' },
  ];

  MTC.saveurs = [
    { id: 'douce', nom: 'Douce', element: 'terre', organe: 'RP', texte: 'Tonifie, nourrit, harmonise et détend. En excès, elle « encrasse » la Rate d’humidité.' },
    { id: 'piquante', nom: 'Piquante', element: 'metal', organe: 'P', texte: 'Disperse, fait circuler et transpirer, ouvre les pores. En excès, elle assèche et disperse le Qi.' },
    { id: 'acide', nom: 'Acide', element: 'bois', organe: 'F', texte: 'Astreint, resserre, retient (sueurs, diarrhée), génère les liquides avec le doux. En excès, elle crispe les tendons.' },
    { id: 'amere', nom: 'Amère', element: 'feu', organe: 'C', texte: 'Assèche l’humidité, fait descendre, rafraîchit la chaleur. En excès, elle assèche et affaiblit.' },
    { id: 'salee', nom: 'Salée', element: 'eau', organe: 'R', texte: 'Ramollit les durcissements, fait descendre, humidifie l’intestin. En excès, elle retient l’eau et fatigue le Cœur.' },
    { id: 'fade', nom: 'Fade', element: null, organe: 'V', texte: 'Insipide : draine l’humidité et favorise l’élimination de l’eau.' },
    { id: 'astringente', nom: 'Astringente', element: null, organe: null, texte: 'Comme l’acide, elle retient : sueurs, diarrhées, pertes.' },
  ];

  const L = [];
  function a(id, nom, cat, nature, saveurs, organes, actions, bon, attention) {
    L.push({ id, nom, cat, nature, saveurs, organes, actions, bon: bon || '', attention: attention || '' });
  }

  // ── Céréales et féculents ────────────────────────────────────────────────
  a('riz', 'Riz', 'cereales', 'neutre', ['douce'], ['RP', 'E'], 'Tonifie le Qi de la Rate, harmonise l’Estomac. La base de l’alimentation chinoise.', 'Fatigue, digestion fragile, convalescence, diarrhée (en congee, la bouillie de riz).');
  a('riz-complet', 'Riz complet', 'cereales', 'neutre', ['douce'], ['RP', 'E', 'GI'], 'Tonifie le Qi, régule le transit.', 'Transit paresseux.', 'Plus long à digérer : bien cuit, bien mâché.');
  a('riz-gluant', 'Riz gluant', 'cereales', 'tiede', ['douce'], ['RP', 'E', 'P'], 'Réchauffe et tonifie la Rate, retient la transpiration.', 'Frilosité, transpiration facile.', 'Lourd : à éviter en cas d’humidité ou de digestion lente.');
  a('millet', 'Millet', 'cereales', 'frais', ['douce', 'salee'], ['RP', 'E', 'R'], 'Harmonise l’Estomac, nourrit le Yin, apaise.', 'Estomac fragile, nausées, insomnie, convalescence (bouillie de millet).');
  a('ble', 'Blé', 'cereales', 'frais', ['douce'], ['C', 'RP', 'R'], 'Nourrit le Cœur, calme l’Esprit.', 'Agitation, émotivité, sueurs nocturnes — le grain entier, avec le jujube, est un remède classique.', 'Gluten, pour qui y est sensible.');
  a('avoine', 'Avoine', 'cereales', 'tiede', ['douce'], ['RP', 'E'], 'Tonifie la Rate, régule le transit, soutient l’énergie.', 'Fatigue, petit-déjeuner d’hiver (porridge chaud).');
  a('orge', 'Orge', 'cereales', 'frais', ['douce', 'salee'], ['RP', 'E', 'V'], 'Rafraîchit, draine l’humidité, facilite la digestion.', 'Rétention d’eau, chaleur, digestion lourde (tisane d’orge grillée).');
  a('larmes-de-job', 'Larmes de Job (Yi Yi Ren)', 'cereales', 'frais', ['douce', 'fade'], ['RP', 'P', 'R'], 'Draine l’humidité, renforce la Rate, éclaircit la peau.', 'Jambes lourdes, articulations gonflées, peau grasse.', 'Déconseillées pendant la grossesse.');
  a('mais', 'Maïs', 'cereales', 'neutre', ['douce'], ['E', 'GI'], 'Renforce l’Estomac, favorise l’élimination de l’eau (barbes de maïs en tisane).', 'Rétention d’eau, digestion fragile.');
  a('sarrasin', 'Sarrasin', 'cereales', 'frais', ['douce'], ['RP', 'E', 'GI'], 'Fait descendre le Qi, élimine l’humidité-chaleur.', 'Digestion lourde, intestins encombrés.', 'Avec modération si la Rate est froide.');
  a('pomme-de-terre', 'Pomme de terre', 'cereales', 'neutre', ['douce'], ['RP', 'E'], 'Tonifie le Qi, harmonise l’Estomac.', 'Estomac sensible, brûlures (le jus de pomme de terre crue est un remède populaire), constipation.');
  a('patate-douce', 'Patate douce', 'cereales', 'neutre', ['douce'], ['RP', 'R'], 'Tonifie le Qi de la Rate, humidifie l’intestin.', 'Fatigue, constipation.', 'En excès : ballonnements.');
  a('igname', 'Igname de Chine (Shan Yao)', 'cereales', 'neutre', ['douce'], ['RP', 'P', 'R'], 'Tonifie la Rate, le Poumon et les Reins, nourrit le Yin.', 'Fatigue, digestion fragile, toux ancienne, envies d’uriner fréquentes.');

  // ── Légumineuses et soja ─────────────────────────────────────────────────
  a('haricot-mungo', 'Haricot mungo', 'legumineuses', 'froid', ['douce'], ['C', 'E'], 'Rafraîchit la chaleur, désaltère, élimine les toxines.', 'Canicule, éruptions, aphtes, chaleur (soupe de haricots mungo).', 'Froid : à éviter en cas de diarrhée ou de frilosité.');
  a('haricot-azuki', 'Haricot azuki (haricot rouge)', 'legumineuses', 'neutre', ['douce', 'acide'], ['C', 'IG'], 'Draine l’humidité, fait dégonfler.', 'Œdèmes, jambes lourdes, rétention d’eau.');
  a('haricot-noir', 'Haricot noir', 'legumineuses', 'neutre', ['douce'], ['RP', 'R'], 'Tonifie les Reins, nourrit le Sang, draine l’eau.', 'Fatigue, lombes faibles, hiver.');
  a('soja', 'Soja (graine)', 'legumineuses', 'neutre', ['douce'], ['RP', 'GI'], 'Renforce la Rate, humidifie la sécheresse.', 'Fatigue, peau sèche.');
  a('tofu', 'Tofu', 'legumineuses', 'frais', ['douce'], ['RP', 'E', 'GI'], 'Rafraîchit, nourrit le Yin, humidifie la sécheresse.', 'Bouffées de chaleur, soif, peau sèche.', 'Pour les personnes frileuses : cuit, avec du gingembre.');
  a('lentilles', 'Lentilles', 'legumineuses', 'neutre', ['douce'], ['RP', 'R', 'C'], 'Tonifient la Rate et les Reins, drainent l’humidité.', 'Fatigue, rétention d’eau.');
  a('pois-chiche', 'Pois chiche', 'legumineuses', 'neutre', ['douce'], ['RP', 'E', 'C'], 'Renforce la Rate et l’Estomac.', 'Fatigue, appétit faible.', 'En excès : ballonnements.');
  a('petits-pois', 'Petits pois', 'legumineuses', 'neutre', ['douce'], ['RP', 'E'], 'Harmonisent le centre, favorisent l’élimination de l’eau.');

  // ── Légumes ──────────────────────────────────────────────────────────────
  a('carotte', 'Carotte', 'legumes', 'neutre', ['douce'], ['P', 'RP', 'F'], 'Renforce la Rate, nourrit le Sang du Foie et les yeux.', 'Yeux fatigués, digestion, diarrhée (cuite).');
  a('chou', 'Chou', 'legumes', 'neutre', ['douce'], ['E', 'RP'], 'Harmonise l’Estomac, apaise la douleur d’estomac.', 'Estomac sensible (cuit).');
  a('chou-chinois', 'Chou chinois, bok choy', 'legumes', 'frais', ['douce'], ['E', 'GI'], 'Rafraîchit, humidifie l’intestin.', 'Chaleur, constipation.');
  a('epinard', 'Épinard', 'legumes', 'frais', ['douce'], ['F', 'E', 'GI'], 'Nourrit le Sang, humidifie l’intestin, calme le Foie.', 'Constipation, yeux secs, crampes.', 'Riche en oxalates : avec modération en cas de calculs.');
  a('celeri', 'Céleri', 'legumes', 'frais', ['douce', 'amere'], ['F', 'E'], 'Rafraîchit le Foie, calme le Yang qui monte, draine.', 'Tensions, maux de tête, irritabilité, rétention d’eau.');
  a('concombre', 'Concombre', 'legumes', 'frais', ['douce'], ['RP', 'E', 'GI'], 'Rafraîchit, désaltère, favorise l’élimination de l’eau.', 'Chaleur, soif, peau irritée.', 'Évitez-le cru si la digestion est froide.');
  a('courgette', 'Courgette', 'legumes', 'frais', ['douce'], ['E', 'P'], 'Rafraîchit, désaltère.', 'Été, chaleur.');
  a('tomate', 'Tomate', 'legumes', 'frais', ['douce', 'acide'], ['F', 'E'], 'Rafraîchit, génère les liquides, aide la digestion.', 'Soif, chaleur.', 'Acide : peut aggraver les brûlures d’estomac.');
  a('potiron', 'Potiron, courge', 'legumes', 'tiede', ['douce'], ['RP', 'E'], 'Tonifie le Qi de la Rate, réchauffe le centre.', 'Fatigue, digestion lente, fin d’été et automne.');
  a('radis', 'Radis blanc (daikon)', 'legumes', 'frais', ['piquante', 'douce'], ['P', 'E'], 'Fait descendre le Qi, aide la digestion, transforme les mucosités.', 'Toux grasse, ballonnements, excès de table.', 'Cru, il rafraîchit ; cuit, il est plus doux.');
  a('poireau', 'Poireau', 'legumes', 'tiede', ['piquante'], ['P', 'E'], 'Réchauffe, chasse le froid, fait circuler le Qi.', 'Frilosité, hiver.');
  a('ciboule', 'Ciboule (blanc d’oignon nouveau)', 'legumes', 'tiede', ['piquante'], ['P', 'E'], 'Libère la surface, chasse le froid, fait transpirer légèrement.', 'Rhume débutant avec frissons (tisane gingembre-ciboule).');
  a('oignon', 'Oignon', 'legumes', 'tiede', ['piquante', 'douce'], ['P', 'RP', 'E'], 'Fait circuler le Qi, réchauffe, aide la digestion.', 'Froid, digestion lente.');
  a('ail', 'Ail', 'legumes', 'tiede', ['piquante'], ['RP', 'E', 'P'], 'Réchauffe la Rate, assainit, aide la digestion.', 'Froid, digestion lente.', 'Avec modération en cas de chaleur ou d’estomac irrité.');
  a('champignon', 'Champignon shiitake', 'legumes', 'neutre', ['douce'], ['RP', 'E'], 'Tonifie le Qi, renforce les défenses.', 'Fatigue, défenses faibles.');
  a('asperge', 'Asperge', 'legumes', 'frais', ['douce', 'amere'], ['P', 'R'], 'Rafraîchit, nourrit le Yin, favorise l’élimination.', 'Chaleur, soif.');
  a('laitue', 'Laitue', 'legumes', 'frais', ['douce', 'amere'], ['E', 'GI'], 'Rafraîchit, calme.', 'Chaleur, sommeil agité.');
  a('aubergine', 'Aubergine', 'legumes', 'frais', ['douce'], ['RP', 'E', 'GI'], 'Rafraîchit le Sang, fait circuler.', 'Chaleur, petites stagnations.', 'Avec modération si la digestion est froide.');
  a('fenouil', 'Fenouil', 'legumes', 'tiede', ['piquante'], ['F', 'R', 'RP', 'E'], 'Réchauffe, fait circuler le Qi, apaise les ballonnements.', 'Ballonnements, digestion froide.');
  a('betterave', 'Betterave', 'legumes', 'neutre', ['douce'], ['C', 'F'], 'Nourrit le Sang, humidifie l’intestin.', 'Pâleur, constipation.');
  a('algues', 'Algues (kombu, nori, wakamé)', 'legumes', 'froid', ['salee'], ['F', 'R', 'E'], 'Ramollissent, drainent, rafraîchissent.', 'Rétention d’eau, chaleur.', 'Riches en iode : avec modération.');
  a('crudites', 'Crudités, salades crues', 'legumes', 'froid', ['douce'], ['RP', 'E'], 'Rafraîchissent, désaltèrent en été.', 'Été, chaleur.', 'Elles pèsent sur la Rate : en petite quantité, surtout en hiver et si la digestion est lente.');

  // ── Fruits ───────────────────────────────────────────────────────────────
  a('pomme', 'Pomme', 'fruits', 'frais', ['douce', 'acide'], ['RP', 'E', 'P'], 'Génère les liquides, humidifie ; cuite, elle aide la digestion.', 'Soif, diarrhée (pomme cuite), toux sèche.');
  a('poire', 'Poire', 'fruits', 'frais', ['douce', 'acide'], ['P', 'E'], 'Humidifie le Poumon, apaise la toux sèche, rafraîchit.', 'Toux sèche, gorge sèche, automne (cuite au miel).', 'Crue, évitez-la en cas de diarrhée.');
  a('banane', 'Banane', 'fruits', 'froid', ['douce'], ['E', 'GI'], 'Humidifie l’intestin, rafraîchit.', 'Constipation par sécheresse ou chaleur.', 'Avec modération si les selles sont molles.');
  a('pasteque', 'Pastèque', 'fruits', 'froid', ['douce'], ['C', 'E', 'V'], 'Rafraîchit la canicule, désaltère, favorise l’élimination.', 'Coup de chaleur, soif d’été.', 'Très froide : jamais en hiver ni en cas de diarrhée.');
  a('melon', 'Melon', 'fruits', 'froid', ['douce'], ['C', 'E'], 'Rafraîchit, désaltère.', 'Été, chaleur.', 'Froid : avec modération si la digestion est fragile.');
  a('orange', 'Orange et agrumes', 'fruits', 'frais', ['douce', 'acide'], ['P', 'E'], 'Génèrent les liquides, désaltèrent.', 'Soif, chaleur.', 'Acides : peuvent irriter un estomac sensible.');
  a('citron', 'Citron', 'fruits', 'frais', ['acide'], ['F', 'E', 'P'], 'Génère les liquides, désaltère, aide la digestion des graisses.', 'Soif, digestion grasse.', 'Acide : estomac sensible.');
  a('raisin', 'Raisin', 'fruits', 'neutre', ['douce', 'acide'], ['F', 'R', 'P'], 'Nourrit le Qi et le Sang.', 'Fatigue, pâleur.');
  a('cerise', 'Cerise', 'fruits', 'tiede', ['douce'], ['RP', 'F'], 'Tonifie, réchauffe, nourrit le Sang.', 'Fatigue, frilosité.', 'En excès : chaleur.');
  a('peche', 'Pêche', 'fruits', 'tiede', ['douce', 'acide'], ['GI', 'E'], 'Humidifie, génère les liquides.', 'Sécheresse, constipation.');
  a('abricot', 'Abricot', 'fruits', 'neutre', ['douce', 'acide'], ['P', 'GI'], 'Humidifie le Poumon et l’intestin.', 'Toux sèche, constipation.');
  a('fraise', 'Fraise', 'fruits', 'frais', ['douce', 'acide'], ['P', 'RP'], 'Humidifie, rafraîchit.', 'Gorge sèche, chaleur.');
  a('kiwi', 'Kiwi', 'fruits', 'froid', ['douce', 'acide'], ['E', 'V'], 'Rafraîchit, génère les liquides.', 'Chaleur, soif.', 'Froid : avec modération si la digestion est fragile.');
  a('figue', 'Figue', 'fruits', 'neutre', ['douce'], ['RP', 'GI', 'P'], 'Humidifie l’intestin et la gorge.', 'Constipation, gorge sèche.');
  a('kaki', 'Kaki', 'fruits', 'froid', ['douce'], ['P', 'GI'], 'Rafraîchit, humidifie le Poumon.', 'Toux sèche par la chaleur.', 'Froid ; ne pas le consommer à jeun.');
  a('ananas', 'Ananas', 'fruits', 'neutre', ['douce', 'acide'], ['E', 'RP'], 'Aide la digestion, désaltère.', 'Digestion lourde.');
  a('jujube', 'Jujube (datte chinoise)', 'fruits', 'tiede', ['douce'], ['RP', 'E', 'C'], 'Tonifie le Qi et le Sang, calme l’Esprit.', 'Fatigue, pâleur, insomnie légère, émotivité.', 'Très sucrée : avec modération en cas d’humidité.');
  a('longane', 'Longane', 'fruits', 'tiede', ['douce'], ['C', 'RP'], 'Nourrit le Sang du Cœur, calme l’Esprit.', 'Insomnie, troubles de la mémoire, fatigue.', 'Réchauffante : évitez-la en cas de chaleur.');
  a('baie-de-goji', 'Baie de goji (Gou Qi Zi)', 'fruits', 'neutre', ['douce'], ['F', 'R', 'P'], 'Nourrit le Yin et le Sang du Foie et des Reins, clarifie les yeux.', 'Yeux fatigués, vertiges, lombes faibles.', 'À éviter en cas de diarrhée ou de fièvre.');
  a('litchi', 'Litchi', 'fruits', 'tiede', ['douce', 'acide'], ['RP', 'F'], 'Nourrit le Sang, réchauffe.', 'Fatigue, frilosité.', 'Réchauffant : avec modération.');

  // ── Noix et graines ──────────────────────────────────────────────────────
  a('noix', 'Noix', 'noix', 'tiede', ['douce'], ['R', 'P', 'GI'], 'Tonifie les Reins, réchauffe le Poumon, humidifie l’intestin.', 'Lombes faibles, mémoire, toux ancienne, constipation.');
  a('amande', 'Amande (douce)', 'noix', 'neutre', ['douce'], ['P', 'GI'], 'Humidifie le Poumon et l’intestin.', 'Toux sèche, constipation.', 'L’amande amère, elle, est toxique crue.');
  a('sesame-noir', 'Sésame noir', 'noix', 'neutre', ['douce'], ['F', 'R', 'GI'], 'Nourrit le Sang et le Yin du Foie et des Reins, humidifie l’intestin.', 'Cheveux ternes ou qui grisonnent, vertiges, constipation, fatigue de l’âge.', 'Avec modération si les selles sont molles.');
  a('sesame', 'Sésame blanc', 'noix', 'neutre', ['douce'], ['P', 'GI'], 'Humidifie, nourrit.', 'Peau sèche, constipation.');
  a('graine-lotus', 'Graine de lotus (Lian Zi)', 'noix', 'neutre', ['douce', 'astringente'], ['RP', 'R', 'C'], 'Calme l’Esprit, renforce la Rate, retient (diarrhée).', 'Insomnie, palpitations, selles molles.', 'Astringente : à éviter en cas de constipation.');
  a('chataigne', 'Châtaigne', 'noix', 'tiede', ['douce'], ['RP', 'E', 'R'], 'Tonifie la Rate et les Reins, renforce les lombes.', 'Fatigue d’hiver, lombes faibles.', 'Lourde : avec modération si la digestion est lente.');
  a('noisette', 'Noisette', 'noix', 'neutre', ['douce'], ['RP', 'E'], 'Renforce la Rate, ouvre l’appétit.');
  a('cacahuete', 'Cacahuète', 'noix', 'neutre', ['douce'], ['RP', 'P'], 'Renforce la Rate, humidifie le Poumon.', 'Appétit faible, toux sèche.', 'Grasse et allergisante.');

  // ── Viandes et œufs ──────────────────────────────────────────────────────
  a('poulet', 'Poulet', 'viandes', 'tiede', ['douce'], ['RP', 'E'], 'Tonifie le Qi et le Sang, réchauffe le centre.', 'Fatigue, convalescence, après l’accouchement (bouillon).');
  a('boeuf', 'Bœuf', 'viandes', 'tiede', ['douce'], ['RP', 'E'], 'Tonifie le Qi et le Sang, renforce les muscles et les os.', 'Fatigue, faiblesse.');
  a('agneau', 'Agneau', 'viandes', 'chaud', ['douce'], ['RP', 'R'], 'Réchauffe le Yang des Reins et de la Rate, chasse le froid.', 'Frilosité, hiver, fatigue avec froid.', 'Très réchauffant : à éviter en cas de chaleur, de fièvre, de bouffées de chaleur.');
  a('porc', 'Porc', 'viandes', 'neutre', ['douce', 'salee'], ['RP', 'E', 'R'], 'Nourrit le Yin, humidifie la sécheresse.', 'Sécheresse, fatigue.', 'Gras : avec modération en cas d’humidité.');
  a('canard', 'Canard', 'viandes', 'frais', ['douce', 'salee'], ['P', 'R'], 'Nourrit le Yin, rafraîchit.', 'Sécheresse, chaleurs.');
  a('oeuf', 'Œuf', 'viandes', 'neutre', ['douce'], ['C', 'R'], 'Nourrit le Sang et le Yin, apaise.', 'Fatigue, pâleur, convalescence.');
  a('foie-volaille', 'Foie de volaille', 'viandes', 'tiede', ['douce', 'amere'], ['F'], 'Nourrit le Sang du Foie, clarifie les yeux.', 'Yeux fatigués, pâleur.', 'Avec modération (riche en vitamine A).');

  // ── Poissons et fruits de mer ────────────────────────────────────────────
  a('poisson', 'Poissons blancs', 'poissons', 'neutre', ['douce'], ['RP', 'E'], 'Tonifient le Qi, drainent l’humidité ; légers à digérer.', 'Fatigue, digestion fragile, convalescence.');
  a('crevette', 'Crevette', 'poissons', 'tiede', ['douce', 'salee'], ['R', 'F'], 'Réchauffe le Yang des Reins.', 'Frilosité, fatigue.', 'Allergisante ; à éviter en cas d’éruption.');
  a('huitre', 'Huître', 'poissons', 'frais', ['douce', 'salee'], ['F', 'R'], 'Nourrit le Yin, calme l’Esprit.', 'Agitation, sommeil léger.');
  a('moule', 'Moule', 'poissons', 'tiede', ['salee'], ['F', 'R'], 'Nourrit le Sang et l’Essence.', 'Fatigue, vertiges.');
  a('crustaces', 'Crustacés et fruits de mer', 'poissons', 'tiede', ['salee'], ['R'], 'Nourrissants, riches en saveur salée.', '', 'La tradition les déconseille en cas de démangeaisons, d’eczéma, d’urticaire : ils « attisent le Vent » dans la peau.');

  // ── Produits laitiers ────────────────────────────────────────────────────
  a('laitages', 'Laitages (lait, fromages, yaourts)', 'laitages', 'frais', ['douce'], ['RP', 'E', 'P'], 'Nourrissent et humidifient.', 'Sécheresse, maigreur.', 'Favorisent l’humidité et les mucosités : à limiter en cas de glaires, de sinusite, de digestion lente, de peau grasse.');
  a('lait-vache', 'Lait de vache', 'laitages', 'neutre', ['douce'], ['C', 'P', 'E'], 'Nourrit, humidifie la sécheresse.', 'Sécheresse, fatigue.', 'Humidifiant : à limiter en cas de mucosités.');
  a('yaourt', 'Yaourt', 'laitages', 'frais', ['douce', 'acide'], ['P', 'GI'], 'Humidifie l’intestin.', 'Constipation par sécheresse.', 'Froid au sortir du réfrigérateur : laissez-le revenir à température.');
  a('fromage', 'Fromage', 'laitages', 'neutre', ['douce', 'acide', 'salee'], ['RP', 'P', 'GI'], 'Nourrissant.', '', 'Gras et humidifiant ; les fromages affinés déclenchent parfois des migraines.');

  // ── Épices, aromates et plantes ──────────────────────────────────────────
  a('gingembre', 'Gingembre frais', 'aromates', 'tiede', ['piquante'], ['P', 'RP', 'E'], 'Libère la surface, réchauffe l’Estomac, arrête les nausées et la toux de froid.', 'Rhume avec frissons, nausées, mal des transports, digestion froide.', 'Avec modération en cas de chaleur, de bouffées de chaleur ou d’ulcère.');
  a('gingembre-sec', 'Gingembre sec', 'aromates', 'chaud', ['piquante'], ['RP', 'E', 'C', 'P'], 'Réchauffe le centre et le Yang.', 'Ventre froid, diarrhée par le froid.', 'À éviter en cas de chaleur.');
  a('cannelle', 'Cannelle', 'aromates', 'chaud', ['piquante', 'douce'], ['R', 'RP', 'C', 'F'], 'Réchauffe le Yang, chasse le froid, fait circuler le Sang.', 'Frilosité, règles douloureuses par le froid, digestion froide.', 'À éviter en cas de chaleur ; fortes doses déconseillées pendant la grossesse.');
  a('poivre', 'Poivre noir', 'aromates', 'chaud', ['piquante'], ['E', 'GI'], 'Réchauffe le centre.', 'Ventre froid.', 'À éviter en cas de chaleur.');
  a('piment', 'Piment', 'aromates', 'chaud', ['piquante'], ['C', 'RP'], 'Réchauffe, fait transpirer, stimule la digestion.', 'Froid humide.', 'À éviter en cas de chaleur, de brûlures d’estomac, d’hémorroïdes, de peau irritée.');
  a('anis-etoile', 'Badiane (anis étoilé)', 'aromates', 'tiede', ['piquante', 'douce'], ['F', 'R', 'RP', 'E'], 'Réchauffe, fait circuler le Qi, apaise les douleurs de froid.', 'Ballonnements, douleurs abdominales par le froid.');
  a('clou-girofle', 'Clou de girofle', 'aromates', 'tiede', ['piquante'], ['RP', 'E', 'R'], 'Réchauffe, fait descendre le Qi de l’Estomac.', 'Hoquet, nausées par le froid.');
  a('cumin', 'Cumin', 'aromates', 'tiede', ['piquante'], ['RP', 'E'], 'Réchauffe, aide la digestion.', 'Digestion lente, ballonnements.');
  a('menthe', 'Menthe', 'aromates', 'frais', ['piquante'], ['P', 'F'], 'Libère la surface, dégage la tête et les yeux, fait circuler le Qi du Foie.', 'Rhume avec gorge rouge, maux de tête, stress.', 'Avec modération en cas de grande fatigue ou de transpiration excessive.');
  a('chrysantheme', 'Chrysanthème (fleurs en infusion)', 'aromates', 'frais', ['douce', 'amere'], ['P', 'F'], 'Rafraîchit la tête et les yeux, calme le Foie.', 'Yeux rouges ou fatigués, maux de tête par la chaleur.');
  a('curcuma', 'Curcuma', 'aromates', 'tiede', ['piquante', 'amere'], ['F', 'RP'], 'Fait circuler le Qi et le Sang, calme la douleur.', 'Douleurs articulaires, règles douloureuses.', 'Grossesse, calculs biliaires : demandez conseil.');
  a('coriandre', 'Coriandre', 'aromates', 'tiede', ['piquante'], ['P', 'E'], 'Libère la surface, ouvre l’appétit.', 'Rhume débutant, appétit faible.');
  a('rose', 'Bouton de rose (infusion)', 'aromates', 'tiede', ['douce', 'amere'], ['F', 'RP'], 'Fait circuler le Qi du Foie, apaise l’humeur, harmonise le cycle.', 'Stress, tristesse, syndrome prémenstruel.');
  a('zeste-mandarine', 'Zeste de mandarine (Chen Pi)', 'aromates', 'tiede', ['piquante', 'amere'], ['RP', 'P'], 'Fait circuler le Qi, assèche l’humidité, transforme les mucosités.', 'Ballonnements, nausées, toux grasse, digestion nouée par le stress (en infusion).');

  // ── Sucres et condiments ─────────────────────────────────────────────────
  a('miel', 'Miel', 'sucres', 'neutre', ['douce'], ['P', 'RP', 'GI'], 'Humidifie, adoucit la gorge et l’intestin, apaise la toux sèche.', 'Toux sèche, gorge irritée, constipation.', 'Jamais avant un an ; humidifiant en excès.');
  a('sucre', 'Sucre blanc', 'sucres', 'neutre', ['douce'], ['RP'], 'Donne un coup de fouet bref.', '', 'Le sucre raffiné favorise l’humidité, les mucosités et les coups de fatigue : à limiter.');
  a('sucre-roux', 'Sucre roux complet', 'sucres', 'tiede', ['douce'], ['RP', 'F', 'E'], 'Réchauffe, fait circuler le Sang.', 'Règles douloureuses par le froid (infusion de gingembre au sucre roux).');
  a('chocolat', 'Chocolat', 'sucres', 'tiede', ['amere', 'douce'], ['C', 'RP'], 'Stimulant.', '', 'Déclenche des migraines chez certains ; gras et sucré, il favorise l’humidité.');
  a('sel', 'Sel', 'sucres', 'froid', ['salee'], ['R', 'E', 'GI'], 'Ramollit, fait descendre.', '', 'Retient l’eau : à limiter en cas d’œdèmes et de tension artérielle.');
  a('vinaigre', 'Vinaigre', 'sucres', 'tiede', ['acide', 'amere'], ['F', 'E'], 'Fait circuler le Sang, aide la digestion.', 'Digestion des graisses.', 'Acide : estomac sensible.');

  // ── Boissons ─────────────────────────────────────────────────────────────
  a('the-vert', 'Thé vert', 'boissons', 'frais', ['amere', 'douce'], ['C', 'P', 'E'], 'Rafraîchit, éclaircit la tête, favorise l’élimination.', 'Chaleur, tête lourde.', 'Le soir, il peut empêcher de dormir ; avec modération si la digestion est froide.');
  a('the-noir', 'Thé noir', 'boissons', 'tiede', ['douce', 'amere'], ['C', 'P', 'E'], 'Réchauffe l’Estomac, aide la digestion.', 'Digestion froide.', 'Excitant : pas le soir.');
  a('cafe', 'Café', 'boissons', 'tiede', ['amere', 'douce'], ['C', 'F'], 'Stimule, fait circuler.', '', 'En excès : agitation, insomnie, brûlures d’estomac ; il « puise » dans le Yin et les Reins.');
  a('alcool', 'Alcool', 'boissons', 'chaud', ['piquante', 'amere'], ['C', 'F', 'E'], 'À petite dose, réchauffe et fait circuler le Sang.', '', 'En excès : humidité-chaleur, Feu du Foie, migraines, sommeil agité, peau irritée.');
  a('boissons-glacees', 'Boissons glacées', 'boissons', 'froid', [], ['RP', 'E'], 'Désaltèrent sur le moment.', '', '« Éteignent le feu digestif » : à éviter, surtout pendant les repas, pendant les règles et en hiver.');

  // ── À modérer ────────────────────────────────────────────────────────────
  a('fritures', 'Fritures et plats gras', 'moderer', 'chaud', [], ['RP', 'E', 'F'], 'Plats frits, panés, très gras.', '', 'Produisent humidité et chaleur : lourdeur, digestion lente, peau grasse, mucosités.');

  MTC.aliments = L;

})(window);
