'use strict';
/*
 * Les grands principes de la médecine traditionnelle chinoise, en chapitres.
 * Chaque chapitre est une suite de blocs :
 *   { texte }                       texte riche (voir Outils.riche)
 *   { schema: 'nom' }               un schéma interactif (js/schemas)
 *   { tableau: { tetes, lignes } }  un tableau
 *   { encadre: 'info'|'alerte', texte }
 *   { organes: true }               les organes, en cartes liées aux méridiens
 */
(function (racine) {
  const MTC = racine.MTC = racine.MTC || {};

  MTC.chapitres = [
    {
      id: 'mtc', titre: 'Qu’est-ce que la médecine chinoise ?', hanzi: '中医', icone: 'livre',
      sousTitre: 'Une vision du corps vivant, en mouvement',
      blocs: [
        { texte: 'La médecine traditionnelle chinoise (MTC) est un ensemble de savoirs et de pratiques élaboré en Chine depuis plus de deux mille ans. Son texte fondateur, le *Classique interne de l’Empereur Jaune* (Huangdi Neijing), rassemble des écrits rédigés autour du IIᵉ siècle avant notre ère.\n\nElle regarde l’être humain comme un tout, relié à son environnement : le climat, les saisons, l’alimentation, les émotions, le rythme du jour et de la nuit. La santé y est un **équilibre en mouvement** — entre le Yin et le Yang, entre les organes, entre l’intérieur et l’extérieur. La maladie naît quand cet équilibre se rompt et ne se rétablit plus de lui-même.' },
        { texte: '## Les cinq branches\n\n- **L’acupuncture et la moxibustion** : stimuler des points précis avec des aiguilles ou par la chaleur de l’armoise.\n- **La pharmacopée** : des préparations de plantes, le pilier de la pratique en Chine.\n- **La diététique** : soigner et prévenir par la nature et la saveur des aliments.\n- **Le massage Tui Na** et la **digipuncture** (acupression) : agir sur les méridiens et les points avec les mains.\n- **Les exercices énergétiques** : Qi Gong et Tai Chi, pour faire circuler le Qi par le mouvement et le souffle.' },
        { texte: '## Prévenir plutôt que guérir\n\nUn passage célèbre du Neijing compare le médecin qui attend la maladie pour la soigner à celui qui creuserait un puits quand il a déjà soif. L’idéal chinois est le **Yang Sheng**, « nourrir la vie » : prendre soin chaque jour de son énergie par le sommeil, l’alimentation, le mouvement et la sérénité.' },
        { encadre: 'info', texte: 'Cette application présente la MTC telle qu’elle se pense elle-même, avec ses concepts (Qi, méridiens, cinq éléments). Ces notions ne correspondent pas à des structures anatomiques mesurables. L’efficacité de l’acupression est démontrée pour certains usages — les nausées par exemple — et discutée pour d’autres. Elle complète une prise en charge médicale, elle ne la remplace jamais.' },
      ],
    },
    {
      id: 'yin-yang', titre: 'Le Yin et le Yang', hanzi: '阴阳', icone: 'taiji',
      sousTitre: 'Deux forces opposées et complémentaires',
      blocs: [
        { texte: 'À l’origine, Yin désigne le versant ombragé d’une colline, Yang son versant ensoleillé. Ce ne sont pas des substances mais deux **aspects** de toute chose, qui n’existent que l’un par rapport à l’autre : le jour n’a de sens que par la nuit, le chaud par le froid.' },
        { schema: 'taiji', legende: 'Le taiji : chaque moitié porte en elle le germe de l’autre, et l’ensemble tourne.' },
        { texte: '## Quatre lois\n\n- **Opposition** : le Yin et le Yang s’opposent et se tempèrent — la fraîcheur calme la chaleur.\n- **Interdépendance** : l’un ne va pas sans l’autre ; le Yang naît du Yin, le Yin a besoin du Yang pour circuler.\n- **Équilibre dynamique** : quand l’un croît, l’autre décroît, comme les saisons ; c’est un balancement permanent, pas un point fixe.\n- **Transformation** : à son extrême, chacun se change en l’autre — la nuit la plus profonde annonce l’aube.' },
        { tableau: { tetes: ['Yin', 'Yang'], lignes: [
          ['Nuit, lune', 'Jour, soleil'], ['Froid, fraîcheur', 'Chaleur'], ['Repos, lenteur', 'Activité, rapidité'],
          ['Eau', 'Feu'], ['Bas, intérieur', 'Haut, extérieur'], ['Avant du corps, intérieur des membres', 'Dos, extérieur des membres'],
          ['Organes qui conservent (Zang)', 'Entrailles qui transforment (Fu)'], ['Sang, liquides, matière', 'Qi, fonction, chaleur'],
          ['Hiver', 'Été'], ['Humidité', 'Sécheresse'], ['Contraction', 'Expansion'],
        ] } },
        { texte: '## Quand l’équilibre se rompt\n\nToute maladie peut se lire comme un déséquilibre du Yin et du Yang. Il y en a quatre grandes formes : deux par **excès** (plénitude), deux par **manque** (vide). Choisissez-les pour voir les barres bouger.' },
        { schema: 'etatsYinYang' },
        { texte: 'On comprend alors la logique du soin : on **disperse** ce qui est en excès, on **tonifie** ce qui manque. Une chaleur n’appelle pas le même remède selon qu’elle vient d’un Yang trop fort ou d’un Yin trop faible.' },
      ],
    },
    {
      id: 'qi', titre: 'Le Qi, souffle de vie', hanzi: '气', icone: 'souffle',
      sousTitre: 'L’énergie qui anime et relie tout',
      blocs: [
        { texte: 'Le caractère 气 représente la vapeur qui s’élève du riz qui cuit. Le Qi est à la fois souffle, énergie et matière subtile : tout ce qui vit et se transforme est fait de Qi. Dans le corps, il circule dans les méridiens, anime les organes, réchauffe, protège et transforme.' },
        { texte: '## D’où vient le Qi ?\n\n- Le **Qi originel** (Yuan Qi), hérité des parents, stocké dans les Reins : la réserve de fond.\n- Le **Qi des aliments** (Gu Qi), extrait par la Rate et l’Estomac.\n- Le **Qi de l’air** (Qing Qi), reçu par le Poumon.\n\nLe Qi des aliments et celui de l’air s’unissent dans la poitrine pour former le **Qi pectoral** (Zong Qi), qui soutient la respiration et le battement du cœur. Activé par le Qi originel, il devient le **Qi vrai**, qui se répartit en **Qi nourricier** (Ying Qi), circulant dans les méridiens avec le Sang, et **Qi défensif** (Wei Qi), qui protège la surface du corps et règle l’ouverture des pores.' },
        { texte: '## Ses cinq fonctions\n\n- **Mettre en mouvement** : la circulation du Sang, la croissance, toute activité.\n- **Réchauffer** le corps.\n- **Défendre** contre les agressions extérieures (vent, froid…).\n- **Retenir** : garder le Sang dans les vaisseaux, les organes à leur place, la sueur et les urines.\n- **Transformer** : les aliments en Qi et en Sang, les liquides en sueur et en urines.' },
        { texte: '## Ses quatre troubles\n\n- **Vide de Qi** : fatigue, voix faible, essoufflement, transpiration facile.\n- **Effondrement du Qi** : descente d’organes, sensation de pesanteur.\n- **Stagnation du Qi** : tensions, douleurs qui se déplacent, ballonnements, soupirs, irritabilité — souvent liée au Foie et au stress.\n- **Qi à contre-courant** : ce qui devrait descendre remonte — toux (Poumon), nausées, renvois, hoquet (Estomac), maux de tête et vertiges (Foie).' },
        { encadre: 'info', texte: 'En digipuncture, presser un point revient à agir sur le Qi du méridien : le **tonifier** s’il manque, le **faire circuler** s’il stagne, le **faire descendre** s’il remonte. Voir [[p:digipuncture]].' },
      ],
    },
    {
      id: 'sang-liquides', titre: 'Le Sang et les Liquides', hanzi: '血', icone: 'cercle',
      sousTitre: 'Ce qui nourrit et ce qui humidifie',
      blocs: [
        { texte: 'Le **Sang** (Xue) est une forme dense du Qi. Il naît des aliments transformés par la Rate, monte au Poumon et au Cœur qui le rougit. Il nourrit les tissus, humidifie la peau, les yeux, les tendons, et — c’est propre à la pensée chinoise — il **ancre l’Esprit** : un Sang suffisant donne un sommeil profond et une humeur stable.' },
        { texte: '## Le Qi et le Sang\n\n« Le Qi est le commandant du Sang, le Sang est la mère du Qi. » Le Qi produit le Sang, le fait circuler et le retient dans les vaisseaux ; le Sang, en retour, nourrit et porte le Qi. Ils vont toujours ensemble.' },
        { texte: '## Les troubles du Sang\n\n- **Vide de Sang** : teint pâle et terne, lèvres et ongles pâles, vertiges en se levant, yeux secs, fourmillements, sommeil léger, règles peu abondantes.\n- **Stase de Sang** : douleurs fixes et piquantes, teint sombre, lèvres violacées, règles douloureuses avec caillots.\n- **Chaleur du Sang** : éruptions rouges, démangeaisons, saignements, agitation.' },
        { texte: '## Les Liquides organiques\n\nLes **Jin Ye** regroupent tous les liquides du corps : les **Jin**, clairs et légers, humidifient la peau et les muqueuses (larmes, sueur, salive) ; les **Ye**, plus épais, lubrifient les articulations, le cerveau, les orifices.\n\nLeur circulation dépend de trois organes : le Poumon qui les **diffuse**, la Rate qui les **transforme**, les Reins qui les **filtrent**.\n\n- Quand ils manquent : **sécheresse** (peau, gorge, selles sèches).\n- Quand ils stagnent : **humidité** (lourdeur, œdèmes) puis **mucosités** (Tan), plus épaisses : glaires, sinus encombrés, mais aussi, dans la pensée chinoise, une forme de brouillard qui « obstrue » l’esprit.' },
      ],
    },
    {
      id: 'jing-shen', titre: 'Les Trois Trésors', hanzi: '精气神', icone: 'saison',
      sousTitre: 'L’Essence, le Qi et l’Esprit',
      blocs: [
        { texte: 'La tradition taoïste parle de trois trésors à préserver : l’**Essence** (Jing), le **Qi** et l’**Esprit** (Shen). On les compare à une bougie : la cire est l’Essence, la flamme le Qi, la lumière l’Esprit.' },
        { texte: '## L’Essence (Jing)\n\nC’est la substance la plus profonde, stockée dans les Reins. L’**Essence du Ciel antérieur** est héritée des parents ; l’**Essence du Ciel postérieur** est tirée chaque jour des aliments et vient la compléter. Elle gouverne la croissance, la maturité sexuelle, la fécondité et le vieillissement.\n\nLe Neijing décrit des cycles de **7 ans chez la femme** et de **8 ans chez l’homme** : à 14 ans (2 × 7) apparaissent les règles, à 49 ans (7 × 7) elles cessent ; à 16 ans (2 × 8) l’homme atteint sa maturité… L’Essence se dépense par le surmenage, les excès et les nuits trop courtes : on la ménage plus qu’on ne la reconstitue.' },
        { texte: '## L’Esprit (Shen)\n\nLe Shen loge dans le **Cœur**. C’est la conscience, la pensée claire, la présence qui brille dans le regard. Quand le Sang du Cœur est abondant, l’Esprit est calme et le sommeil profond ; quand il est troublé, viennent agitation, insomnie, anxiété.\n\nChaque organe Yin abrite aussi un aspect psychique :\n\n- le **Foie** abrite le **Hun** (l’âme spirituelle : projets, imagination, rêves) ;\n- le **Poumon** abrite le **Po** (l’âme corporelle : sensations, instinct) ;\n- la **Rate** abrite le **Yi** (la pensée, la concentration) ;\n- les **Reins** abritent le **Zhi** (la volonté, la persévérance) ;\n- le **Cœur** abrite le **Shen**, qui les coordonne tous.' },
      ],
    },
    {
      id: 'cinq-elements', titre: 'Les cinq éléments', hanzi: '五行', icone: 'feuille',
      sousTitre: 'Bois, Feu, Terre, Métal, Eau',
      blocs: [
        { texte: 'Les cinq éléments (Wu Xing, littéralement « les cinq mouvements ») ne sont pas des matières mais cinq **phases** du changement, observées dans la nature et appliquées au corps : la naissance (Bois), la croissance (Feu), la transformation (Terre), la récolte (Métal), la mise en réserve (Eau). Chaque organe, chaque saison, chaque saveur, chaque émotion se range dans l’un d’eux.' },
        { schema: 'wuxing', legende: 'Touchez un élément pour ses correspondances ; changez de cycle avec les boutons.' },
        { texte: '## À quoi cela sert\n\nCe système relie des signes qui semblent sans rapport. Un teint verdâtre, une envie d’acide, des colères et des crampes orientent vers le Bois (le Foie). Il guide aussi le soin : pour aider un organe faible, on peut tonifier sa « mère » dans le cycle d’engendrement ; pour calmer un organe qui en agresse un autre, on le disperse.\n\nLa **diététique** s’en sert beaucoup : chaque saveur va vers un organe — l’acide vers le Foie, l’amer vers le Cœur, le doux vers la Rate, le piquant vers le Poumon, le salé vers les Reins. Voir [[p:hygiene|vivre avec les saisons]].' },
      ],
    },
    {
      id: 'organes', titre: 'Les organes et les entrailles', hanzi: '脏腑', icone: 'corps',
      sousTitre: 'Cinq Zang, six Fu, et leurs fonctions',
      blocs: [
        { texte: 'La MTC décrit des **fonctions** plus que des organes anatomiques : la « Rate » chinoise, par exemple, désigne tout le travail de digestion et d’assimilation. On distingue :\n\n- les cinq **organes Zang** (Yin), pleins, qui **conservent** les substances précieuses : Cœur, Poumon, Rate, Foie, Reins — auxquels s’ajoute le Maître du Cœur ;\n- les six **entrailles Fu** (Yang), creuses, qui **reçoivent, transforment et évacuent** : Intestin grêle, Gros Intestin, Estomac, Vésicule biliaire, Vessie, Triple Réchauffeur.\n\nChaque organe Zang forme un couple avec une entraille Fu, reliées par leurs méridiens.' },
        { organes: true },
        { texte: '## Les entrailles extraordinaires\n\nSix structures ont la forme des Fu mais la fonction des Zang : le **cerveau**, la **moelle**, les **os**, les **vaisseaux**, l’**utérus** et la **vésicule biliaire** (qui, seule des entrailles, contient un liquide pur, la bile). Elles dépendent surtout de l’Essence des Reins.' },
      ],
    },
    {
      id: 'meridiens', titre: 'Les méridiens et les points', hanzi: '经络', icone: 'corps',
      sousTitre: 'Le réseau où circule le Qi',
      blocs: [
        { texte: 'Les méridiens (Jing Luo) forment un réseau qui relie l’intérieur du corps (les organes) à sa surface (la peau, les muscles), le haut au bas, la gauche à la droite. Le Qi et le Sang y circulent sans interruption.' },
        { texte: '## Le réseau\n\n- **12 méridiens principaux**, chacun relié à un organe ou une entraille, symétriques à gauche et à droite.\n- **8 Merveilleux Vaisseaux**, des réservoirs ; deux d’entre eux ont leurs propres points, sur la ligne médiane : le [[m:VC]] devant, le [[m:VG]] derrière.\n- Des vaisseaux **Luo** de communication, des méridiens **tendino-musculaires** et des méridiens **distincts** complètent l’ensemble.' },
        { texte: '## Les noms des méridiens\n\nChaque méridien porte le nom de son organe, de son membre (main ou pied) et de son niveau d’énergie : trois niveaux Yin (Tai Yin, Shao Yin, Jue Yin) et trois niveaux Yang (Tai Yang, Shao Yang, Yang Ming). Ainsi le Poumon est le « Tai Yin de la main », l’Estomac le « Yang Ming du pied ».\n\nLeurs trajets suivent une règle simple :\n\n- les **Yin de la main** vont de la poitrine vers les doigts ;\n- les **Yang de la main** vont des doigts vers la tête ;\n- les **Yang du pied** vont de la tête vers les orteils ;\n- les **Yin du pied** vont des orteils vers le ventre et la poitrine.\n\nLes méridiens Yin parcourent la face interne des membres et l’avant du tronc, les Yang la face externe des membres, le dos et les côtés.' },
        { texte: '## La grande circulation\n\nLe Qi passe d’un méridien à l’autre dans un ordre immuable, en vingt-quatre heures : Poumon → Gros Intestin → Estomac → Rate → Cœur → Intestin grêle → Vessie → Reins → Maître du Cœur → Triple Réchauffeur → Vésicule biliaire → Foie → Poumon… L’horloge ci-dessous le montre ; elle a aussi sa [[h:horloge|page dédiée]].' },
        { schema: 'horloge', legende: 'L’horloge suit l’heure réelle. Plus de détails dans la page « Horloge des méridiens ».' },
        { texte: '## Les catégories de points\n\nOn compte 361 points sur les quatorze méridiens, et de nombreux points « hors méridiens ». Certains ont un rôle particulier :\n\n- **Points Yuan (source)** : l’énergie originelle de l’organe s’y manifeste ; on les utilise pour diagnostiquer et pour tonifier ([[R3]], [[F3]], [[GI4]]).\n- **Points Luo (communication)** : ils relient un méridien à son couple ([[P7]], [[MC6]], [[E40]]).\n- **Points Xi (fissure)** : là où le Qi s’accumule ; pour les troubles aigus et douloureux ([[E34]], [[RP8]]).\n- **Points Shu antiques** : cinq points entre les doigts ou orteils et le coude ou genou — Jing (puits), Ying (jaillissement), Shu (rivière), Jing (fleuve), He (mer) — où le Qi grossit comme une source qui devient fleuve.\n- **Points Shu du dos** : sur la Vessie, le long de la colonne ; chacun est relié à un organe ([[V13]] Poumon, [[V23]] Reins…).\n- **Points Mu (alarme)** : sur l’avant du tronc, ils deviennent sensibles quand leur organe souffre ([[VC12]] Estomac, [[F14]] Foie).\n- **Points Hui (réunion)** : chacun agit sur un tissu — le Qi ([[VC17]]), le Sang ([[V17]]), les tendons ([[VB34]]), les vaisseaux ([[P9]]), les moelles ([[VB39]])…\n- **Points d’ouverture** des Merveilleux Vaisseaux ([[P7]], [[RP4]], [[MC6]], [[IG3]], [[V62]], [[R6]], [[TR5]], [[VB41]]).\n- **Points de commande** : six points classiques pour une grande région du corps — [[E36]] l’abdomen, [[V40]] le dos, [[P7]] la tête et la nuque, [[GI4]] le visage et la bouche, [[MC6]] la poitrine, [[VG26]] la réanimation.' },
      ],
    },
    {
      id: 'causes', titre: 'Les causes des maladies', hanzi: '病因', icone: 'alerte',
      sousTitre: 'Climats, émotions et mode de vie',
      blocs: [
        { texte: 'La MTC range les causes des maladies en trois familles : les causes **externes** (les climats), les causes **internes** (les émotions), et celles qui ne sont ni l’un ni l’autre (le mode de vie). Elle insiste moins sur l’agresseur que sur le **terrain** : un même froid enrhume l’un et épargne l’autre, selon la force de son Qi défensif.' },
        { texte: '## Les six climats pervers\n\nLes six énergies du climat deviennent pathogènes quand elles sont excessives, hors saison, ou quand le corps est affaibli.\n\n- **Le Vent** — « le chef des cent maladies » : il arrive vite, bouge, attaque le haut du corps (rhume, nuque raide, démangeaisons qui se déplacent). Il porte souvent un autre climat avec lui.\n- **Le Froid** contracte et fige : frissons, douleurs fixes améliorées par la chaleur, crampes, selles liquides.\n- **La Chaleur de l’été** (canicule) épuise le Qi et les liquides : fièvre, soif, sueurs, fatigue.\n- **L’Humidité** est lourde et collante : lourdeur, fatigue, articulations gonflées, digestion lente ; elle traîne en longueur.\n- **La Sécheresse**, propre à l’automne et au chauffage, assèche le Poumon : toux sèche, gorge, peau et lèvres sèches.\n- **Le Feu** (ou chaleur intense) monte et agite : fièvre élevée, soif, agitation, éruptions, saignements.' },
        { tableau: { tetes: ['Émotion', 'Organe', 'Effet sur le Qi'], lignes: [
          ['Colère, frustration', 'Foie', 'le fait monter (maux de tête, rougeur)'],
          ['Joie excessive, excitation', 'Cœur', 'le relâche, le disperse'],
          ['Soucis, rumination', 'Rate', 'le noue (digestion bloquée)'],
          ['Tristesse, chagrin', 'Poumon', 'l’épuise (souffle court)'],
          ['Peur', 'Reins', 'le fait descendre'],
          ['Frayeur, choc', 'Reins et Cœur', 'le désordonne'],
        ] }, legende: 'Les sept émotions (qing zhi) et leurs effets' },
        { texte: '## Les émotions\n\nLes émotions ne sont pas des maladies : elles le deviennent quand elles sont **intenses, prolongées ou réprimées**. Chacune touche en priorité un organe, et l’inverse est vrai : un Foie engorgé rend irritable, une Rate affaiblie fait ruminer.' },
        { texte: '## Le mode de vie\n\n- **L’alimentation** : repas irréguliers, trop de froid et de cru, de gras, de sucre, d’alcool, ou au contraire trop peu.\n- **Le surmenage** physique ou mental, et à l’inverse le **manque d’exercice**, qui fait stagner le Qi.\n- **Le manque de sommeil**, qui puise dans l’Essence.\n- Les **excès sexuels** (dans la pensée traditionnelle), les **traumatismes**, les **parasites et toxiques**, et la **constitution** héritée.' },
      ],
    },
    {
      id: 'diagnostic', titre: 'Le diagnostic', hanzi: '四诊', icone: 'question',
      sousTitre: 'Observer, écouter, interroger, palper',
      blocs: [
        { texte: 'Le praticien de MTC rassemble des signes par quatre examens, puis les relie en un **syndrome** : une image d’ensemble (« vide de Qi de la Rate », « stagnation du Qi du Foie »…) qui guide le traitement. Deux personnes souffrant de la même migraine peuvent ainsi recevoir des soins différents.\n\n- **Observer** : le teint, l’éclat du regard, la posture, et surtout la **langue**.\n- **Écouter et sentir** : la voix, la respiration, la toux, les odeurs.\n- **Interroger** : le froid et la chaleur, la transpiration, l’appétit et la soif, les selles et les urines, le sommeil, les douleurs, le cycle féminin…\n- **Palper** : les zones sensibles, l’abdomen, les points, et le **pouls**.' },
        { texte: '## La langue\n\nVisible et changeante, la langue est un miroir de l’intérieur : chaque région correspond à des organes, sa couleur renseigne sur le Sang et la température, son enduit sur l’Estomac et les « pervers ». Touchez les zones, changez la couleur, l’enduit, la forme.' },
        { schema: 'langue', legende: 'La carte de la langue, telle que l’enseigne la MTC.' },
        { texte: '## Le pouls\n\nOn prend le pouls aux deux poignets, sur l’artère radiale, avec trois doigts. Chaque position, à chaque poignet, reflète des organes ; et l’on écoute à trois profondeurs. La MTC décrit 28 qualités de pouls.' },
        { schema: 'pouls' },
        { encadre: 'alerte', texte: 'Ces repères servent à comprendre la démarche chinoise. Ils ne permettent pas de poser un diagnostic sur soi-même : des symptômes qui durent, s’aggravent ou inquiètent demandent l’avis d’un médecin.' },
      ],
    },
    {
      id: 'huit-principes', titre: 'Les huit principes', hanzi: '八纲', icone: 'regle',
      sousTitre: 'Quatre questions pour situer un déséquilibre',
      blocs: [
        { texte: 'Les huit principes (Ba Gang) sont la grille de lecture la plus générale. Ils posent quatre questions, chacune à deux réponses : **où ?** (extérieur ou intérieur), **quelle nature ?** (froid ou chaleur), **quelle force ?** (vide ou plénitude), et, en synthèse, **Yin ou Yang ?**' },
        { tableau: { tetes: ['', 'Signes typiques'], lignes: [
          ['**Extérieur**', 'Début brutal, frissons et fièvre, courbatures, nuque raide, pouls flottant : un rhume qui commence.'],
          ['**Intérieur**', 'Les organes sont touchés : troubles digestifs, fatigue durable, émotions, troubles chroniques.'],
          ['**Froid**', 'Frilosité, envie de chaud, urines claires, selles molles, langue pâle, pouls lent.'],
          ['**Chaleur**', 'Sensation de chaleur, soif de froid, visage rouge, urines foncées, constipation, langue rouge, pouls rapide.'],
          ['**Vide**', 'Fatigue, voix faible, douleur sourde améliorée par la pression, transpiration spontanée, pouls faible.'],
          ['**Plénitude**', 'Trouble récent et intense, douleur aggravée par la pression, voix forte, pouls plein.'],
          ['**Yin**', 'Synthèse de l’intérieur, du froid et du vide : un état de repli, de froid, de lenteur.'],
          ['**Yang**', 'Synthèse de l’extérieur, de la chaleur et de la plénitude : un état d’agitation, de chaleur, de vivacité.'],
        ] } },
        { texte: 'Le soin découle de la réponse : on **libère l’extérieur** (faire transpirer légèrement), on **réchauffe le froid**, on **rafraîchit la chaleur**, on **tonifie le vide**, on **disperse la plénitude**. C’est aussi la logique de la diététique : un aliment chaud pour un froid, frais pour une chaleur. Voir [[p:hygiene]].' },
      ],
    },
    {
      id: 'digipuncture', titre: 'La digipuncture', hanzi: '指压', icone: 'main',
      sousTitre: 'Trouver les points et les masser sans risque',
      blocs: [
        { texte: 'La digipuncture (ou acupression) stimule les points d’acupuncture avec les doigts plutôt qu’avec des aiguilles. Elle est simple, sans matériel, et se pratique sur soi-même. On l’associe souvent au massage Tui Na.' },
        { texte: '## Trouver un point\n\nLes distances se mesurent en **cun** (le « pouce » chinois). Ce n’est pas une longueur fixe : c’est une unité **proportionnelle** au corps de chacun. Entre le pli du coude et celui du poignet, par exemple, il y a toujours 12 cun, quelle que soit la taille du bras. En pratique, on mesure avec ses propres doigts :' },
        { schema: 'mesuresCun' },
        { texte: 'Les repères osseux (malléoles, rotule, vertèbres), les plis et les tendons sont plus sûrs que les mesures. Un point se trouve souvent dans un **petit creux**, et il est fréquemment **plus sensible** que la peau autour : laissez votre doigt chercher.' },
        { texte: '## Les gestes\n\n- **Pression** : appuyer avec la pulpe du pouce ou du majeur, perpendiculairement, en augmentant progressivement.\n- **Cercles** : appuyer et décrire de petits cercles sans glisser sur la peau.\n- **Pétrissage** : saisir un muscle (le haut de l’épaule) entre pouce et doigts.\n- **Pincement** : pour les points au coin des ongles, pincer ou presser avec l’ongle.\n- **Frictions** : frotter vivement pour réchauffer (bas du dos, plante des pieds).\n- **Main posée** : pour certains points du ventre, une paume chaude et immobile suffit.' },
        { texte: '## Tonifier ou disperser\n\nLa tradition distingue deux intentions. Pour **tonifier** (fatigue, faiblesse) : une pression douce, lente, prolongée, des cercles dans le sens des aiguilles d’une montre. Pour **disperser** (douleur, tension, chaleur) : une pression plus ferme, plus rapide, des cercles dans l’autre sens. Dans le doute, une pression modérée et régulière convient toujours.' },
        { texte: '## Durée et sensation\n\nComptez **une à deux minutes par point**, de chaque côté, en respirant calmement — on presse en expirant. On recherche une sensation diffuse de pesanteur, de chaleur ou de légers fourmillements (le *de qi*, « l’arrivée du Qi ») ; jamais une douleur vive. Une séance de 10 à 20 minutes, une à trois fois par jour, suffit. Buvez un verre d’eau tiède après.' },
        { encadre: 'alerte', texte: '**Ne massez pas** : sur une plaie, une brûlure, un bouton infecté, une cicatrice récente, une zone enflée ou une varice ; sur une fracture ou une entorse récente (les premières 48 heures) ; juste après un repas copieux, à jeun complet ou après avoir bu de l’alcool ; en cas de fièvre élevée.\n\n**Pendant la grossesse**, évitez [[GI4]], [[RP6]], [[RP8]], [[VB21]], [[V60]], [[V67]], [[V32]], [[Shiqizhui]] et les points du bas-ventre ([[VC3]], [[VC4]], [[VC6]], [[E29]]). [[MC6]], lui, est couramment utilisé contre les nausées. Demandez toujours conseil à votre sage-femme ou votre médecin.\n\nAvec un traitement anticoagulant, des troubles de la coagulation ou l’ostéoporose, pressez doucement. Chez l’enfant et la personne âgée, la douceur est la règle.' },
        { encadre: 'info', texte: 'La digipuncture accompagne, elle ne soigne pas une maladie. Consultez un médecin pour toute douleur intense, inhabituelle ou qui dure, et sans attendre en cas de signe d’alerte (douleur dans la poitrine, difficulté à respirer, paralysie, confusion, forte fièvre). En France : **15** (SAMU) ou **112**.' },
      ],
    },
    {
      id: 'hygiene', titre: 'Nourrir la vie', hanzi: '养生', icone: 'feuille',
      sousTitre: 'Le Yang Sheng au quotidien',
      blocs: [
        { texte: '« Nourrir la vie » (Yang Sheng) est l’art chinois de garder la santé. Il tient en quelques principes de bon sens, que la tradition relie aux saisons et aux organes.' },
        { texte: '## Suivre le rythme du jour\n\nSe lever avec la lumière, manger le matin un vrai repas chaud (l’heure de l’Estomac), alléger le soir, se coucher avant 23 h pour laisser la Vésicule biliaire et le Foie faire leur travail de nuit. Voir [[h:horloge|l’horloge des méridiens]].' },
        { texte: '## Suivre le rythme des saisons\n\n- **Printemps** (Bois, Foie) : se lever tôt, marcher, s’étirer ; manger des pousses et des légumes verts, alléger les plats.\n- **Été** (Feu, Cœur) : profiter de la lumière, se rafraîchir sans glacer ; fruits, légumes frais, un peu d’amer.\n- **Fin d’été** (Terre, Rate) : régularité, plats doux et cuits ; se méfier de l’humidité.\n- **Automne** (Métal, Poumon) : se couvrir, respirer amplement ; humidifier avec la poire, les amandes, le miel.\n- **Hiver** (Eau, Reins) : se coucher tôt, ménager ses forces, garder les lombes au chaud ; plats mijotés et réchauffants.\n\nLa rubrique [[h:soins|Soins]] et la [[h:dietetique|diététique saisonnière]] détaillent ces conseils.' },
        { texte: '## Bouger sans s’épuiser\n\nLe Qi a besoin de circuler. La marche, les étirements, le Qi Gong et le Tai Chi, pratiqués avec régularité et sans forcer, sont les exercices de prédilection : ils associent mouvement lent, respiration et attention.' },
        { texte: '## Respirer\n\nUne respiration abdominale, lente et profonde, nourrit le Qi et calme l’Esprit. Asseyez-vous, une main sur le ventre sous l’ombilic ([[VC6]]) : inspirez par le nez en laissant le ventre se gonfler (4 secondes), expirez lentement par la bouche (6 secondes). Cinq minutes suffisent — c’est d’ailleurs le rythme proposé pendant les séances de l’application.' },
        { texte: '## Garder l’équilibre des émotions\n\nNi les étouffer, ni s’y laisser emporter : les exprimer, les traverser, retrouver le calme. Le lien social, la nature, la lenteur sont des remèdes chinois très anciens.' },
      ],
    },
  ];

})(window);
