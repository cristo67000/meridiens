'use strict';
/*
 * La diététique chinoise : les saisons, les neuf constitutions (et un
 * questionnaire pour situer la sienne) et des recettes simples.
 *
 * Le questionnaire s'inspire de la classification des neuf constitutions de
 * Wang Qi, adoptée en Chine en 2009 (CCMQ), réduite ici à trois questions par
 * constitution. Il donne une tendance, pas un diagnostic.
 */
(function (racine) {
  const MTC = racine.MTC = racine.MTC || {};

  // ── Les saisons ──────────────────────────────────────────────────────────
  MTC.saisons = [
    {
      id: 'printemps', nom: 'Printemps', hanzi: '春', element: 'bois', organe: 'F', climat: 'le Vent', periode: 'du début février au début mai',
      resume: 'Le Yang s’éveille et monte, tout pousse. On aide le Foie à s’étirer et à faire circuler le Qi.',
      texte: 'Le printemps est la saison du **Bois** et du **Foie**. Comme la sève qui monte, l’énergie a besoin de s’étendre librement : on allège l’assiette après l’hiver, on privilégie les **pousses et les légumes verts**, cuits rapidement, et une pointe de saveur **piquante** qui aide à disperser (ciboule, menthe, radis). La tradition conseille d’ailleurs de modérer l’acide et d’augmenter un peu le doux, pour protéger la Rate d’un Foie trop vigoureux.',
      favoriser: ['epinard', 'celeri', 'poireau', 'ciboule', 'radis', 'asperge', 'menthe', 'chrysantheme', 'riz', 'millet', 'carotte'],
      moderer: ['fritures', 'alcool', 'fromage', 'sucre'],
      gestes: ['Se lever plus tôt et marcher le matin, cheveux et vêtements dénoués, dit le Neijing.', 'S’étirer, bouger : le Foie aime le mouvement.', 'Exprimer ce qui pèse plutôt que de s’irriter.'],
      points: ['F3', 'VB34', 'VB20'],
      recettes: ['infusion-rose', 'tisane-chrysantheme'],
    },
    {
      id: 'ete', nom: 'Été', hanzi: '夏', element: 'feu', organe: 'C', climat: 'la Chaleur', periode: 'du début mai à la mi-juillet',
      resume: 'Le Yang est à son apogée. On rafraîchit sans glacer, on protège le Cœur et les liquides.',
      texte: 'L’été est la saison du **Feu** et du **Cœur**. On profite des fruits et légumes de saison, de nature **fraîche**, et d’un peu de saveur **amère** qui rafraîchit (thé vert, laitue, céleri). Le paradoxe chinois : on évite les boissons **glacées**, qui figent la digestion et empêchent de transpirer — une boisson tiède désaltère mieux.',
      favoriser: ['haricot-mungo', 'concombre', 'tomate', 'courgette', 'pasteque', 'melon', 'laitue', 'the-vert', 'menthe', 'tofu', 'orge'],
      moderer: ['boissons-glacees', 'alcool', 'piment', 'fritures', 'agneau'],
      gestes: ['Se lever tôt, s’abriter aux heures chaudes ; une courte sieste à l’heure du Cœur.', 'Transpirer un peu n’est pas un mal : c’est ainsi que le corps se rafraîchit.', 'Cultiver la joie, mais sans excitation excessive.'],
      points: ['MC6', 'C7', 'GI11'],
      recettes: ['soupe-mungo', 'tisane-orge'],
    },
    {
      id: 'fin-ete', nom: 'Fin d’été', hanzi: '长夏', element: 'terre', organe: 'RP', climat: 'l’Humidité', periode: 'de la mi-juillet au début août (et les fins de chaque saison)',
      resume: 'Le temps lourd et humide pèse sur la Rate. On mange simple, cuit, régulier.',
      texte: 'La « longue fin d’été » est la saison de la **Terre** et de la **Rate**, la plus sensible à l’**humidité**. On revient à des plats **doux et cuits** — céréales, courges, légumes racines —, on draine l’humidité avec les larmes de Job ou les haricots azuki, et l’on réduit le cru, le sucre et les laitages. La Terre gouverne aussi les dix-huit derniers jours de chaque saison : des moments de transition où la régularité est précieuse.',
      favoriser: ['millet', 'riz', 'potiron', 'carotte', 'patate-douce', 'larmes-de-job', 'haricot-azuki', 'mais', 'gingembre', 'zeste-mandarine'],
      moderer: ['crudites', 'sucre', 'laitages', 'boissons-glacees', 'fritures'],
      gestes: ['Repas à heures fixes, sans écran, en mâchant longuement.', 'Ne pas rester dans les vêtements mouillés ; aérer et assécher la maison.', 'Une marche après les repas.'],
      points: ['E36', 'RP3', 'RP9'],
      recettes: ['millet-potiron', 'soupe-azuki'],
    },
    {
      id: 'automne', nom: 'Automne', hanzi: '秋', element: 'metal', organe: 'P', climat: 'la Sécheresse', periode: 'du début août au début novembre',
      resume: 'L’énergie se rassemble et descend. On humidifie le Poumon contre la sécheresse.',
      texte: 'L’automne est la saison du **Métal** et du **Poumon**, et de la **sécheresse** (sans compter celle du chauffage). On **humidifie** : poires, pommes, amandes, sésame, miel, igname, champignons — les aliments blancs sont associés au Métal. Une pointe de piquant (gingembre, radis) aide le Poumon à diffuser, une pointe d’acide aide à « rassembler » l’énergie.',
      favoriser: ['poire', 'pomme', 'amande', 'sesame', 'miel', 'igname', 'radis', 'champignon', 'riz', 'canard', 'raisin'],
      moderer: ['piment', 'alcool', 'fritures', 'cafe'],
      gestes: ['Se coucher et se lever tôt, « avec le coq ».', 'Respirer amplement, se couvrir le cou dès que le vent fraîchit.', 'Faire le tri, ranger, lâcher ce qui n’est plus utile — l’automne est le temps de la récolte et du deuil.'],
      points: ['P7', 'P9', 'GI4'],
      recettes: ['poire-miel', 'radis-mijote'],
    },
    {
      id: 'hiver', nom: 'Hiver', hanzi: '冬', element: 'eau', organe: 'R', climat: 'le Froid', periode: 'du début novembre au début février',
      resume: 'Le Yin domine, tout se met en réserve. On réchauffe, on nourrit les Reins, on économise ses forces.',
      texte: 'L’hiver est la saison de l’**Eau** et des **Reins**. On **réchauffe** et l’on **nourrit** : soupes, plats mijotés longtemps, céréales cuites, légumineuses, noix et châtaignes, un peu de viande (agneau, poulet), épices douces (gingembre, cannelle). Les aliments noirs (haricots, sésame noir) sont associés aux Reins. Le salé convient, sans excès.',
      favoriser: ['haricot-noir', 'sesame-noir', 'noix', 'chataigne', 'agneau', 'poulet', 'poireau', 'gingembre', 'cannelle', 'avoine', 'riz-gluant'],
      moderer: ['crudites', 'boissons-glacees', 'pasteque', 'sel'],
      gestes: ['Se coucher tôt et se lever avec le soleil.', 'Garder au chaud les lombes, le ventre et les pieds.', 'Économiser ses forces : l’hiver n’est pas la saison des grands efforts ni des grandes sueurs.'],
      points: ['R3', 'R1', 'VG4', 'V23'],
      recettes: ['bouillon-poulet', 'soupe-haricots-noirs', 'agneau-gingembre'],
    },
  ];

  // ── Les neuf constitutions ───────────────────────────────────────────────
  MTC.constitutions = [
    {
      id: 'equilibree', nom: 'Équilibrée', hanzi: '平和', resume: 'Énergie stable, bon sommeil, bonne adaptation.',
      signes: ['Teint frais, regard vif', 'Énergie stable, bon sommeil', 'Appétit et transit réguliers', 'S’adapte bien aux changements de saison'],
      texte: 'C’est la constitution idéale : le Yin et le Yang, le Qi et le Sang sont en harmonie. Il s’agit surtout de la **préserver** : alimentation variée et de saison, modération en tout, mouvement régulier.',
      plus: ['riz', 'millet', 'carotte', 'pomme', 'poisson'], moins: [],
      points: ['E36'], conseils: ['Suivez simplement les saisons (voir les conseils de saison).', 'Évitez les excès, même de « bonnes » choses.'],
    },
    {
      id: 'qi-vide', nom: 'Vide de Qi', hanzi: '气虚', resume: 'Fatigue facile, souffle court, rhumes fréquents.',
      signes: ['Fatigue rapide, voix faible', 'Essoufflement à l’effort', 'Transpiration facile', 'Rhumes fréquents', 'Appétit faible, selles molles'],
      texte: 'Le Qi manque pour animer, défendre et retenir. On **tonifie la Rate et le Poumon** par des aliments doux, cuits et faciles à digérer, et l’on évite de s’épuiser.',
      plus: ['riz', 'millet', 'patate-douce', 'igname', 'potiron', 'jujube', 'poulet', 'champignon', 'avoine'], moins: ['crudites', 'boissons-glacees', 'radis', 'cafe'],
      points: ['E36', 'VC6', 'P9'], conseils: ['Exercices doux et réguliers (marche, Tai Chi, Qi Gong) plutôt que des efforts intenses.', 'Ne sautez pas de repas ; mangez chaud.', 'Respirez lentement par le ventre, quelques minutes chaque jour.'],
    },
    {
      id: 'yang-vide', nom: 'Vide de Yang', hanzi: '阳虚', resume: 'Frilosité, mains et pieds froids, besoin de chaleur.',
      signes: ['Frilosité, mains et pieds froids', 'Besoin de chaleur, de boissons chaudes', 'Selles molles, urines claires', 'Fatigue, envie de dormir'],
      texte: 'Le « feu » du corps est faible. On **réchauffe** par la nature des aliments et les modes de cuisson longs (mijotés), et l’on protège le corps du froid.',
      plus: ['agneau', 'poulet', 'poireau', 'gingembre', 'cannelle', 'noix', 'chataigne', 'crevette', 'avoine'], moins: ['crudites', 'boissons-glacees', 'pasteque', 'banane', 'the-vert', 'kiwi'],
      points: ['VC4', 'VG4', 'R3', 'E36'], conseils: ['Gardez le dos, le ventre et les pieds au chaud.', 'Profitez du soleil, surtout sur le dos.', 'Préférez les plats mijotés, les soupes, les épices douces.'],
    },
    {
      id: 'yin-vide', nom: 'Vide de Yin', hanzi: '阴虚', resume: 'Sécheresse, chaleurs, sueurs la nuit.',
      signes: ['Paumes et plantes chaudes', 'Bouche, gorge et peau sèches', 'Bouffées de chaleur, sueurs nocturnes', 'Agitation, sommeil léger'],
      texte: 'Le Yin, qui rafraîchit et humidifie, s’est épuisé (surmenage, veilles, âge). On **nourrit le Yin** par des aliments frais et humidifiants, et l’on évite ce qui chauffe et dessèche.',
      plus: ['tofu', 'poire', 'sesame-noir', 'baie-de-goji', 'canard', 'igname', 'huitre', 'millet', 'haricot-mungo'], moins: ['piment', 'agneau', 'alcool', 'cafe', 'fritures', 'cannelle'],
      points: ['R3', 'R6', 'RP6'], conseils: ['Évitez les veilles tardives, les saunas, les sports qui font beaucoup transpirer.', 'Préférez les cuissons douces : vapeur, bouillons.', 'Ménagez des temps de calme.'],
    },
    {
      id: 'mucosites', nom: 'Mucosités et humidité', hanzi: '痰湿', resume: 'Lourdeur, glaires, tendance à prendre du poids.',
      signes: ['Sensation de lourdeur', 'Ventre mou, prise de poids facile', 'Glaires, nez encombré', 'Somnolence après les repas'],
      texte: 'L’humidité s’accumule faute d’être transformée par la Rate, puis s’épaissit en mucosités. On **draine** et l’on **allège**, en réduisant ce qui encrasse.',
      plus: ['larmes-de-job', 'haricot-azuki', 'radis', 'orge', 'celeri', 'zeste-mandarine', 'fenouil', 'oignon'], moins: ['sucre', 'laitages', 'fritures', 'boissons-glacees', 'alcool'],
      points: ['E40', 'RP9', 'VC12', 'E36'], conseils: ['Bougez chaque jour jusqu’à transpirer légèrement.', 'Arrêtez-vous de manger avant d’être rassasié.', 'Évitez les lieux humides et les repas tardifs.'],
    },
    {
      id: 'humidite-chaleur', nom: 'Humidité-chaleur', hanzi: '湿热', resume: 'Peau grasse, bouche amère, urines foncées.',
      signes: ['Peau grasse, boutons', 'Bouche amère ou pâteuse, mauvaise haleine', 'Urines foncées, selles collantes', 'Irritabilité'],
      texte: 'L’humidité s’est échauffée. On **rafraîchit et draine**, et l’on supprime en priorité ce qui produit humidité et chaleur à la fois : alcool, fritures, épices fortes, sucre.',
      plus: ['haricot-mungo', 'larmes-de-job', 'concombre', 'celeri', 'chou-chinois', 'sarrasin', 'the-vert'], moins: ['alcool', 'piment', 'fritures', 'sucre', 'agneau'],
      points: ['GI11', 'RP9', 'E44'], conseils: ['Réduisez nettement l’alcool.', 'Évitez la chaleur humide (hammam, siestes prolongées après un repas lourd).', 'Bougez régulièrement.'],
    },
    {
      id: 'stase', nom: 'Stase de Sang', hanzi: '血瘀', resume: 'Teint terne, ecchymoses, douleurs fixes.',
      signes: ['Teint terne ou sombre, cernes', 'Lèvres un peu violacées', 'Ecchymoses faciles', 'Douleurs fixes, règles avec caillots'],
      texte: 'Le Sang circule mal et s’immobilise. On **fait circuler** par le mouvement, la chaleur douce et quelques aliments qui « dynamisent » le Sang.',
      plus: ['curcuma', 'rose', 'oignon', 'aubergine', 'poireau', 'vinaigre'], moins: ['boissons-glacees', 'fritures'],
      points: ['RP10', 'RP6', 'V17'], conseils: ['Bougez quotidiennement : la circulation est le premier remède.', 'Évitez le froid, qui fige le Sang.', 'Consultez pour toute douleur fixe qui dure.'],
    },
    {
      id: 'stagnation', nom: 'Stagnation de Qi', hanzi: '气郁', resume: 'Soucis, soupirs, humeur changeante.',
      signes: ['Tendance aux soucis, humeur changeante', 'Soupirs, gorge ou poitrine serrées', 'Tensions dans les flancs', 'Sommeil perturbé par les pensées'],
      texte: 'Le Qi ne circule plus librement, souvent sous l’effet des émotions. On **fait circuler le Qi du Foie** par des aliments légèrement piquants et parfumés, et surtout par le mouvement et l’expression.',
      plus: ['zeste-mandarine', 'rose', 'menthe', 'radis', 'celeri', 'orange', 'fenouil'], moins: ['cafe', 'alcool'],
      points: ['F3', 'GI4', 'MC6', 'VC17'], conseils: ['Faites du sport, sortez dans la nature, chantez : tout ce qui fait circuler.', 'Parlez de ce qui pèse.', 'Ne mangez pas dans la tension ou en travaillant.'],
    },
    {
      id: 'sensible', nom: 'Sensible (allergique)', hanzi: '特禀', resume: 'Allergies, réactions de la peau et du nez.',
      signes: ['Éternuements, nez qui coule sans rhume', 'Allergies (pollens, aliments, poussière)', 'Peau réactive : urticaire, plaques', 'Sensibilité aux changements de saison'],
      texte: 'Une constitution particulière, souvent héritée, où le Qi défensif réagit trop. On **renforce** le terrain (Rate, Poumon, Reins) hors des périodes de crise et l’on évite ses déclencheurs.',
      plus: ['riz', 'millet', 'champignon', 'igname', 'jujube'], moins: ['crustaces', 'alcool', 'piment', 'fritures'],
      points: ['E36', 'GI11', 'P9'], conseils: ['Repérez et évitez vos déclencheurs.', 'Renforcez-vous hors saison : massage de E36 chaque jour.', 'Demandez un avis médical pour toute allergie sérieuse.'],
    },
  ];

  const R = (texte, c) => ({ texte, c });
  MTC.questionnaire = [
    R('Vous sentez-vous plein d’énergie, la plupart du temps ?', 'equilibree'),
    R('Vous adaptez-vous facilement aux changements de saison, de climat ou d’environnement ?', 'equilibree'),
    R('Dormez-vous bien et vous réveillez-vous reposé ?', 'equilibree'),
    R('Vous fatiguez-vous facilement ?', 'qi-vide'),
    R('Manquez-vous de souffle au moindre effort ?', 'qi-vide'),
    R('Attrapez-vous facilement des rhumes, transpirez-vous facilement ?', 'qi-vide'),
    R('Avez-vous les mains et les pieds froids ?', 'yang-vide'),
    R('Craignez-vous le froid plus que votre entourage ?', 'yang-vide'),
    R('Les aliments ou boissons froids vous dérangent-ils (ventre, transit) ?', 'yang-vide'),
    R('Avez-vous les paumes des mains ou les plantes des pieds chaudes ?', 'yin-vide'),
    R('Avez-vous la bouche, la gorge ou la peau sèches ?', 'yin-vide'),
    R('Avez-vous des bouffées de chaleur ou des sueurs la nuit ?', 'yin-vide'),
    R('Ressentez-vous une lourdeur dans le corps ?', 'mucosites'),
    R('Avez-vous souvent des glaires dans la gorge, ou le nez encombré ?', 'mucosites'),
    R('Votre ventre est-il mou et proéminent, prenez-vous facilement du poids ?', 'mucosites'),
    R('Avez-vous la peau du visage grasse, ou des boutons ?', 'humidite-chaleur'),
    R('Avez-vous la bouche amère ou pâteuse, ou mauvaise haleine ?', 'humidite-chaleur'),
    R('Vos urines sont-elles foncées, ou vos selles collantes ?', 'humidite-chaleur'),
    R('Avez-vous des bleus sans raison apparente ?', 'stase'),
    R('Votre teint est-il terne ou sombre, avec des cernes marqués ?', 'stase'),
    R('Avez-vous des douleurs fixes, toujours au même endroit (ou des règles avec caillots) ?', 'stase'),
    R('Avez-vous souvent des soucis, une humeur changeante ?', 'stagnation'),
    R('Soupirez-vous souvent, avez-vous la gorge ou la poitrine serrées ?', 'stagnation'),
    R('Les contrariétés vous tendent-elles facilement ?', 'stagnation'),
    R('Éternuez-vous ou avez-vous le nez qui coule sans être enrhumé ?', 'sensible'),
    R('Êtes-vous allergique (pollens, aliments, poussière, médicaments) ?', 'sensible'),
    R('Votre peau réagit-elle facilement (urticaire, plaques, démangeaisons) ?', 'sensible'),
  ];
  MTC.reponses = ['Jamais', 'Rarement', 'Parfois', 'Souvent', 'Toujours'];

  // ── Les recettes ─────────────────────────────────────────────────────────
  MTC.recettes = [
    {
      id: 'congee', nom: 'Congee nature', hanzi: '白粥', nature: 'neutre', temps: '1 h 30',
      pour: 'Digestion fragile, convalescence, fatigue, diarrhée. Le plat le plus doux pour la Rate et l’Estomac.',
      ingredients: ['1 volume de riz (rond ou thaï)', '8 à 10 volumes d’eau', 'Une pincée de sel'],
      etapes: ['Rincez le riz.', 'Portez l’eau à ébullition, ajoutez le riz.', 'Laissez frémir à feu très doux, à couvert, 1 h 30 environ, en remuant de temps en temps, jusqu’à obtenir une crème épaisse.', 'Salez légèrement. Servez chaud.'],
      conseils: 'Variantes : quelques lamelles de gingembre et de ciboule (salé), ou des jujubes et des baies de goji (sucré). On peut le préparer la veille dans un cuiseur lent.',
      aliments: ['riz'],
    },
    {
      id: 'congee-rhume', nom: 'Congee au gingembre et à la ciboule', hanzi: '葱姜粥', nature: 'tiede', temps: '1 h',
      pour: 'Rhume qui commence, avec frissons et nez qui coule clair (Vent-Froid).',
      ingredients: ['Un bol de congee nature (ou 1/2 verre de riz et 4 verres d’eau)', '5 tranches de gingembre frais', 'Le blanc de 3 ciboules (ou d’oignons nouveaux)', 'Sel'],
      etapes: ['Faites cuire le congee.', 'Ajoutez le gingembre en fin de cuisson, laissez frémir 10 minutes.', 'Ajoutez la ciboule émincée, couvrez 2 minutes, salez.', 'Mangez très chaud, puis couvrez-vous et reposez-vous pour transpirer légèrement.'],
      conseils: 'Pas pour un rhume avec gorge rouge et fièvre (Vent-Chaleur) : préférez alors une infusion de menthe et de chrysanthème.',
      aliments: ['riz', 'gingembre', 'ciboule'],
    },
    {
      id: 'millet-potiron', nom: 'Bouillie de millet au potiron', hanzi: '小米南瓜粥', nature: 'neutre', temps: '40 min',
      pour: 'Rate fatiguée, digestion lente, fin d’été, petit-déjeuner réconfortant.',
      ingredients: ['1/2 verre de millet', '300 g de potiron en dés', '4 verres d’eau', 'Quelques jujubes (facultatif)'],
      etapes: ['Rincez le millet.', 'Mettez tous les ingrédients dans une casserole, portez à ébullition.', 'Laissez cuire à feu doux 30 à 40 minutes en remuant, jusqu’à ce que le potiron se défasse.'],
      conseils: 'Le millet est la céréale de la Terre ; associé au potiron, il nourrit la Rate en douceur.',
      aliments: ['millet', 'potiron', 'jujube'],
    },
    {
      id: 'poire-miel', nom: 'Poire cuite au miel et aux amandes', hanzi: '冰糖炖梨', nature: 'frais', temps: '35 min',
      pour: 'Toux sèche, gorge sèche ou irritée, sécheresse d’automne.',
      ingredients: ['1 poire', '1 cuillère à soupe de miel', 'Une dizaine d’amandes effilées', 'Un peu d’eau'],
      etapes: ['Coupez le haut de la poire et creusez le cœur.', 'Garnissez de miel et d’amandes, replacez le chapeau.', 'Faites cuire à la vapeur (ou dans un bol posé au bain-marie) 30 minutes.', 'Mangez la poire tiède et buvez le jus.'],
      conseils: 'En Chine, on utilise du sucre candi à la place du miel. Pour une toux grasse avec glaires, préférez le radis.',
      aliments: ['poire', 'miel', 'amande'],
    },
    {
      id: 'soupe-mungo', nom: 'Soupe de haricots mungo', hanzi: '绿豆汤', nature: 'froid', temps: '1 h',
      pour: 'Canicule, coup de chaleur, éruptions, aphtes, chaleur.',
      ingredients: ['100 g de haricots mungo', '1,5 litre d’eau', 'Un peu de sucre (facultatif)'],
      etapes: ['Faites tremper les haricots 2 heures.', 'Faites-les cuire dans l’eau 40 minutes à 1 heure jusqu’à ce qu’ils éclatent.', 'Sucrez légèrement. Buvez le bouillon tiède ou à température ambiante — pas glacé.'],
      conseils: 'Très rafraîchissante : à éviter en cas de diarrhée, de frilosité, pendant les règles.',
      aliments: ['haricot-mungo'],
    },
    {
      id: 'tisane-gingembre', nom: 'Infusion de gingembre au sucre roux', hanzi: '红糖姜茶', nature: 'tiede', temps: '15 min',
      pour: 'Règles douloureuses par le froid, nausées, frissons, digestion froide.',
      ingredients: ['5 à 6 tranches de gingembre frais', '1 cuillère à café de sucre roux complet', '40 cl d’eau', '2 jujubes (facultatif)'],
      etapes: ['Portez l’eau à ébullition avec le gingembre (et les jujubes).', 'Laissez frémir 10 minutes.', 'Ajoutez le sucre roux, buvez chaud.'],
      conseils: 'Sans sucre, c’est le remède des nausées et du mal des transports. À éviter en cas de chaleur, de fièvre, d’ulcère.',
      aliments: ['gingembre', 'sucre-roux', 'jujube'],
    },
    {
      id: 'tisane-chrysantheme', nom: 'Infusion de chrysanthème et de goji', hanzi: '菊花枸杞茶', nature: 'frais', temps: '10 min',
      pour: 'Yeux fatigués ou rouges, travail sur écran, maux de tête par la chaleur, printemps.',
      ingredients: ['5 à 6 fleurs de chrysanthème séchées', 'Une cuillère à soupe de baies de goji', 'Eau chaude (80 °C)'],
      etapes: ['Mettez fleurs et baies dans une tasse.', 'Versez l’eau chaude, laissez infuser 5 minutes.', 'Buvez, puis mangez les baies.'],
      conseils: 'Les fleurs se trouvent dans les épiceries asiatiques. Plusieurs infusions possibles dans la journée.',
      aliments: ['chrysantheme', 'baie-de-goji'],
    },
    {
      id: 'bouillon-poulet', nom: 'Bouillon de poulet aux jujubes et au gingembre', hanzi: '红枣鸡汤', nature: 'tiede', temps: '2 h',
      pour: 'Fatigue, convalescence, frilosité, hiver, après l’accouchement.',
      ingredients: ['Un poulet fermier ou 4 cuisses', '6 à 8 jujubes', '1 morceau de gingembre (5 cm) en tranches', '1 cuillère à soupe de baies de goji', '2 litres d’eau, sel'],
      etapes: ['Blanchissez la viande 3 minutes dans l’eau bouillante, égouttez.', 'Remettez-la dans une marmite avec l’eau froide, le gingembre et les jujubes.', 'Laissez mijoter à couvert 1 h 30 à 2 heures à feu très doux.', 'Ajoutez les baies de goji 10 minutes avant la fin, salez.'],
      conseils: 'On boit surtout le bouillon, chaud. Ajoutez des champignons shiitake pour renforcer les défenses.',
      aliments: ['poulet', 'jujube', 'gingembre', 'baie-de-goji'],
    },
    {
      id: 'soupe-azuki', nom: 'Soupe d’azuki et de larmes de Job', hanzi: '红豆薏米汤', nature: 'neutre', temps: '1 h 30',
      pour: 'Jambes lourdes, rétention d’eau, lourdeur, temps humide.',
      ingredients: ['50 g de haricots azuki', '50 g de larmes de Job (Yi Yi Ren)', '1,5 litre d’eau', 'Un zeste de mandarine (facultatif)'],
      etapes: ['Faites tremper azuki et larmes de Job une nuit (ou au moins 3 heures).', 'Faites cuire dans l’eau 1 h à 1 h 30, jusqu’à ce que tout soit tendre.', 'Buvez le bouillon et mangez les grains, tièdes.'],
      conseils: 'Les larmes de Job sont déconseillées pendant la grossesse : n’utilisez alors que les azuki. Faites griller légèrement les larmes de Job à sec pour les rendre plus douces pour la Rate.',
      aliments: ['haricot-azuki', 'larmes-de-job', 'zeste-mandarine'],
    },
    {
      id: 'radis-mijote', nom: 'Radis blanc mijoté', hanzi: '炖萝卜', nature: 'neutre', temps: '40 min',
      pour: 'Digestion lourde, ballonnements, excès de table, toux grasse.',
      ingredients: ['1 radis blanc (daikon)', '2 tranches de gingembre', '50 cl de bouillon ou d’eau', 'Sel, un filet de sauce soja'],
      etapes: ['Pelez le radis, coupez-le en gros tronçons.', 'Faites-le mijoter avec le gingembre dans le bouillon 30 minutes, jusqu’à ce qu’il soit translucide.', 'Assaisonnez.'],
      conseils: 'Cuit, le radis perd son piquant et devient doux pour l’Estomac. On peut y ajouter un peu de porc ou de bœuf.',
      aliments: ['radis', 'gingembre'],
    },
    {
      id: 'lotus-jujube', nom: 'Infusion jujube et graines de lotus', hanzi: '莲子红枣茶', nature: 'neutre', temps: '45 min',
      pour: 'Sommeil léger, esprit agité, palpitations, fatigue.',
      ingredients: ['15 graines de lotus (sans le germe)', '6 jujubes', '1 cuillère à soupe de longanes séchées (facultatif)', '60 cl d’eau'],
      etapes: ['Faites tremper les graines de lotus 1 heure.', 'Faites frémir le tout 30 à 40 minutes à feu doux.', 'Buvez tiède en début de soirée et mangez les graines et les fruits.'],
      conseils: 'Le germe vert des graines de lotus est amer : retirez-le. Version « Gan Mai Da Zao », célèbre recette contre l’émotivité : remplacez le lotus par une poignée de grains de blé et une tranche de réglisse.',
      aliments: ['graine-lotus', 'jujube', 'longane', 'ble'],
    },
    {
      id: 'agneau-gingembre', nom: 'Agneau mijoté au gingembre', hanzi: '生姜羊肉汤', nature: 'chaud', temps: '2 h',
      pour: 'Frilosité, froid intérieur, fatigue d’hiver, mains et pieds froids.',
      ingredients: ['500 g d’agneau (épaule ou collier) en morceaux', '1 gros morceau de gingembre (8 cm) en tranches', '1 bâton de cannelle', '1 poireau', 'Sel, poivre'],
      etapes: ['Blanchissez la viande 3 minutes, égouttez.', 'Faites-la revenir avec le gingembre et le poireau émincé.', 'Couvrez d’eau, ajoutez la cannelle, laissez mijoter 1 h 30 à 2 heures.', 'Salez, poivrez, servez avec du riz.'],
      conseils: 'Inspiré d’une recette classique du *Jin Gui Yao Lüe* (IIᵉ siècle). Très réchauffant : à éviter en cas de chaleur, de fièvre, de bouffées de chaleur.',
      aliments: ['agneau', 'gingembre', 'cannelle', 'poireau'],
    },
    {
      id: 'infusion-rose', nom: 'Infusion de rose et zeste de mandarine', hanzi: '玫瑰陈皮茶', nature: 'tiede', temps: '10 min',
      pour: 'Stress, humeur sombre, seins tendus avant les règles, digestion nouée.',
      ingredients: ['5 à 6 boutons de rose séchés (alimentaires)', 'Un morceau de zeste de mandarine séché', 'Eau chaude'],
      etapes: ['Mettez les boutons et le zeste dans une théière.', 'Versez l’eau chaude, laissez infuser 5 minutes.', 'Buvez tiède, pourquoi pas avec une cuillère de miel.'],
      conseils: 'Faites sécher vous-même les zestes de mandarines non traitées en hiver : ils se conservent un an.',
      aliments: ['rose', 'zeste-mandarine', 'miel'],
    },
    {
      id: 'soupe-haricots-noirs', nom: 'Soupe de haricots noirs au sésame noir', hanzi: '黑豆黑芝麻汤', nature: 'neutre', temps: '1 h 30',
      pour: 'Fatigue de fond, lombes faibles, cheveux ternes, hiver.',
      ingredients: ['150 g de haricots noirs', '2 cuillères à soupe de sésame noir', '1 morceau de gingembre', '1 oignon', '1,5 litre d’eau, sel'],
      etapes: ['Faites tremper les haricots une nuit.', 'Faites-les cuire avec l’oignon et le gingembre 1 h à 1 h 30.', 'Faites griller le sésame à sec, écrasez-le grossièrement.', 'Mixez la soupe en partie, parsemez de sésame.'],
      conseils: 'Les aliments noirs sont associés à l’Eau et aux Reins.',
      aliments: ['haricot-noir', 'sesame-noir', 'gingembre', 'oignon'],
    },
    {
      id: 'tisane-orge', nom: 'Tisane d’orge grillée', hanzi: '大麦茶', nature: 'frais', temps: '15 min',
      pour: 'Été, chaleur, digestion lourde, lourdeur.',
      ingredients: ['2 cuillères à soupe d’orge perlé', '1 litre d’eau'],
      etapes: ['Faites griller l’orge à sec dans une poêle jusqu’à ce qu’elle brunisse et sente le pain grillé.', 'Faites-la bouillir 10 minutes dans l’eau.', 'Filtrez. Se boit chaude ou à température ambiante.'],
      conseils: 'Boisson courante en Chine, en Corée et au Japon ; sans caféine.',
      aliments: ['orge'],
    },
    {
      id: 'pomme-cannelle', nom: 'Pommes cuites à la cannelle', hanzi: '肉桂苹果', nature: 'tiede', temps: '25 min',
      pour: 'Digestion fragile, selles molles, envie de douceur sans sucre.',
      ingredients: ['2 pommes', 'Une pincée de cannelle', 'Un peu d’eau', 'Quelques raisins secs (facultatif)'],
      etapes: ['Coupez les pommes en quartiers.', 'Faites-les cuire à couvert avec l’eau et la cannelle 15 à 20 minutes.', 'Servez tiède.'],
      conseils: 'Cuite, la pomme perd sa fraîcheur et devient douce pour la Rate.',
      aliments: ['pomme', 'cannelle', 'raisin'],
    },
  ];

  MTC.reglesDOr = [
    'Manger **chaud et cuit** la plupart du temps : la Rate « cuit » les aliments, aidons-la.',
    'Manger à **heures régulières**, assis, sans écran, en mâchant longuement.',
    'Un **petit-déjeuner** consistant (l’heure de l’Estomac), un **dîner** léger et tôt.',
    'S’arrêter avant d’être rassasié — l’adage chinois dit « aux sept dixièmes ».',
    'Éviter les **boissons glacées**, surtout pendant les repas.',
    'Varier les **cinq saveurs** et les couleurs, sans excès d’aucune.',
    'Adapter son assiette à la **saison** et à sa **constitution**.',
  ];

  MTC.cuissons = [
    ['Cru', 'frais', 'Rafraîchit ; plus difficile à digérer.'],
    ['Vapeur, bouilli, poché', 'neutre', 'Préserve la nature de l’aliment, facile à digérer.'],
    ['Mijoté longtemps', 'tiede', 'Réchauffe et rend très digeste : les soupes et ragoûts d’hiver.'],
    ['Sauté, au wok', 'tiede', 'Réchauffe un peu, garde le croquant.'],
    ['Rôti, grillé, frit, fumé', 'chaud', 'Réchauffe et assèche ; produit de la chaleur en excès.'],
  ];

})(window);
