# Méridiens

Application web installable (PWA), hors ligne, sans compte ni publicité :
la médecine traditionnelle chinoise dans la poche.

- **Principes** — 13 chapitres (Yin-Yang, Qi, Sang et Liquides, Trois Trésors,
  cinq éléments, organes, méridiens et catégories de points, causes des
  maladies, diagnostic, huit principes, digipuncture, Yang Sheng) avec des
  schémas à manipuler : taiji et états de déséquilibre, cycles des cinq
  éléments, carte de la langue, positions du pouls, mesures en cun, horloge
  des méridiens qui suit l'heure réelle.
- **Méridiens** — les 14 méridiens sur le corps de face et de dos, le Qi qui
  circule en animation, et 12 vues de détail (visage, tête de profil, nuque,
  tronc, dos, avant-bras paume et dos, genou, jambe intérieure, extérieure et
  arrière, pied) ; 133 points avec localisation OMS 2008, repérage sur soi,
  technique, indications, actions, précautions (grossesse).
- **Soins** — 39 maux courants : explication MTC, protocole de points,
  variantes selon la forme, conseils, aliments, et signes qui doivent faire
  consulter ; **séances guidées** plein écran (minuteur, changement de côté,
  son, vibration, guide de respiration, écran maintenu allumé).
- **Diététique** — natures, saveurs, cuissons, règles d'or ; 113 aliments ;
  les cinq saisons ; les neuf constitutions et un questionnaire ; 16 recettes.
- **Carnet** — favoris, notes, historique des séances, constitution ;
  sauvegarde exportable. Tout reste sur l'appareil.

En ligne : <https://cristo67000.github.io/meridiens/>

## Développer

Zéro build : HTML, CSS et JavaScript servis tels quels.

- Serveur : configuration `meridiens` du `launch.json` racine (Node, port
  **8230**, `Cache-Control: no-cache`).
- `index.html?sans-sw` n'enregistre pas le service worker (penser à désinscrire
  celui d'une visite précédente).
- `build/atelier.html` montre toutes les planches avec tous les tracés et
  points étiquetés sur un quadrillage (`?p=main-dos&g=GI4&l=800`).

## Épreuves

    node build/essais.mjs                       # ~13 900 vérifications statiques
    node build/captures.mjs <dossier> "#/" "#/point/GI4" [--sombre] [--plein]
    node build/essais_en_ligne.mjs              # site publié : fichiers servis, hors ligne réel

`essais.mjs` vérifie la syntaxe, que `sw.js` range exactement les fichiers
chargés par la page, la version, et l'intégrité du contenu (renvois `[[…]]`,
positions de chaque point, aliments, questionnaire…). `captures.mjs` pilote
Chrome sans affichage (CDP, port 9371) en téléphone 390 × 844 ; un argument
`"#/route|code JS"` exécute le code avant la capture.

## Organisation

    js/anatomie/   geo (axes, courbes), corps (silhouettes face/dos, tracés),
                   regions (vues de détail, points, repères), planche (rendu)
    js/donnees/    meridiens, points, principes, soins, aliments, dietetique, index
    js/schemas/    horloge, taiji, wuxing, diagnostic (langue, pouls), cun
    js/vues/       une vue par écran ; communs.js pour les morceaux partagés
    js/visionneuse.js   zoom et déplacement des planches (pincer, molette, boutons)

Toute retouche publiée : incrémenter `VERSION` dans `sw.js` **et**
`application-version` dans `index.html` (une épreuve le vérifie), et ajouter
tout nouveau fichier à la liste de `sw.js`.

Icônes et image d'aperçu : `python build/generer-icones.py`.

## Sources

Localisations : *WHO Standard Acupuncture Point Locations in the Western
Pacific Region* (OMS, 2008). Théorie : Huangdi Neijing, manuels de MTC.
Constitutions : classification de Wang Qi (2009). Textes et dessins originaux.
