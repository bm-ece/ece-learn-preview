# Architecture technique — ECE Learn

**Statut : plateforme en test interne, non livrée aux étudiants.**

## Objectif et périmètre

ECE Learn est une plateforme pédagogique statique multi-matières. Le portail permet de sélectionner un niveau d'études et d'accéder aux cours disponibles. Chaque matière dispose de ses propres contenus et outils ; les services communs assurent la navigation, le stockage et la progression.

Le site utilise **HTML, CSS et JavaScript natifs**, sans framework, backend ni authentification.

## Structure actuelle — inventaire des fichiers versionnés

Cette arborescence décrit les fichiers réellement présents dans le dépôt. Elle n'inclut pas les cours futurs. Le dépôt Preview possède les mêmes fichiers **hors workflows**, adaptés à chaque environnement.

```text
ece-learn/
├── index.html                       # Point d'entrée du portail
├── README.md                        # Présentation et règles de validation
├── linux/                           # Accès au cours Linux
│   └── index.html                   # Point d'entrée du cours
├── assets/                          # Ressources graphiques
│   ├── ece-logo.jpg                 # Logo ECE
│   └── favicon.svg                  # Icône du navigateur
├── css/                             # Présentation de l'interface
│   ├── tokens.css                   # Variables et constantes visuelles
│   ├── layout.css                   # Structure et adaptation responsive
│   ├── components.css               # Styles des composants
│   ├── portal.css                   # Styles du portail
│   └── styles.css                   # Point d'entrée des styles Linux
├── js/                              # Logique de l'application
│   ├── app.js                       # Coordination du cours Linux
│   ├── routing.js                   # Navigation et liens profonds Linux
│   ├── catalog.js                   # Catalogue des matières et niveaux
│   ├── portal.js                    # Interactions du portail
│   ├── storage.js                   # Stockage local du cours
│   └── progress.js                  # Gestion de la progression Linux
├── components/                      # Composants pédagogiques Linux
│   ├── lesson.js                    # Présentation des leçons
│   ├── quiz.js                      # Questions et évaluations
│   └── navigation.js                # Navigation pédagogique
├── courses/                         # Données et outils par matière
│   └── linux/                       # Cours Linux existant
│       ├── course.json              # Métadonnées du cours
│       ├── syllabus/                # Référentiel pédagogique
│       │   └── syllabus.json        # Domaines, notions et séances
│       ├── lessons/                 # Contenus pédagogiques
│       │   └── data.js              # Données des 79 notions
│       ├── labs/                    # Laboratoires pratiques
│       │   ├── data.js              # Données des laboratoires
│       │   └── engine.js            # Logique des laboratoires
│       ├── simulators/              # Simulations Linux
│       │   └── index.js             # Implémentation des simulateurs
│       └── terminal/                # Terminal et environnement simulés
│           ├── bash.js              # Fonctions liées à Bash
│           ├── engine.js            # Moteur du terminal
│           └── fs.js                # Système de fichiers virtuel
├── tests/                           # Vérifications automatisées
│   ├── command-matrix.test.cjs      # Matrice de commandes simulées
│   ├── lessons.test.cjs             # Tests des leçons
│   ├── simulator.test.cjs           # Tests des simulateurs
│   ├── smoke-browser.mjs            # Démarrage en navigateur desktop/mobile
│   └── smoke-static.mjs             # Vérifications statiques
├── docs/                            # Documentation du projet
│   ├── ARCHITECTURE.md              # Présent document
│   ├── DEPLOIEMENT-PREVIEW.md       # Procédure de déploiement Preview
│   ├── INVENTAIRE-TECHNIQUE.md     # Inventaire technique
│   └── RECETTE-PREVIEW.md           # Procédure de recette
└── .github/                         # Automatisation GitHub
    └── workflows/
        ├── simulator-tests.yml      # Régressions Linux (officiel uniquement)
        └── verify-development.yml   # CI adaptée au dépôt / à la branche
```

**Particularité Preview :** `simulator-tests.yml` n'y est pas présent ; `verify-development.yml` vérifie notamment la parité avec la branche de développement. Les composants et services actuels sont largement centrés sur Linux : leur réutilisation par d'autres matières n'est pas encore garantie.

## Catalogue et niveaux

Le portail propose **ING1, ING2 et ING3**. Le cours Linux est associé **à ING3 uniquement**. Réseaux, Programmation et Cybersécurité sont envisagés, sans affectation de niveau ni lien actif. Le choix du niveau est enregistré dans `ece_learn_selected_level` et ne contrôle pas l'accès par authentification.

## Cours Linux

Le cours contient **79 notions**, réparties en **7 domaines et 14 séances**, ainsi que **7 laboratoires**, **28 commandes de référence**, un terminal, l'atelier Bash et **4 simulateurs**. Les données sont organisées sous `courses/linux/`.

La navigation directe est prise en charge :

| Activité | Chemin |
| --- | --- |
| Notion 12 | `/ece-learn/linux/?view=learn&notion=12` |
| Laboratoire 3 | `/ece-learn/linux/?view=lab&lab=3` |
| Simulateur de processus | `/ece-learn/linux/?view=sim&simulateur=process` |
| Bibliothèque | `/ece-learn/linux/?view=catalog` |

## Persistance

Le navigateur conserve la progression Linux et le niveau choisi dans son `localStorage`.

- Site officiel de test : `ece_learn_linux_progress_2026`.
- Preview : `ece_learn_preview_linux_progress_2026`.
- Niveau : `ece_learn_selected_level`.

La séparation des clés empêche les essais sur Preview de modifier la progression du site officiel de test. Aucune synchronisation entre appareils n'est fournie.

## Environnements

- **Site officiel de test :** https://bm-ece.github.io/ece-learn/ — `bm-ece/ece-learn/main`.
- **Développement :** `bm-ece/ece-learn/develop/multicourse-platform`.
- **Preview :** https://bm-ece.github.io/ece-learn-preview/ — `bm-ece/ece-learn-preview/main`.

Les ressources utilisent des chemins relatifs compatibles avec les deux sites.

## Extension future — conventions et exemples (non implémentés)

Les exemples ci-dessous sont **prospectifs** : aucun dossier `reseaux/` ou `programmation/` n'est actuellement présent et aucun niveau ING ne leur est attribué. Ils illustrent une organisation possible, à valider au moment de concevoir un cours.

### Exemple A : Réseaux

```text
ece-learn/
├── reseaux/
│   └── index.html                   # Entrée du nouveau cours
└── courses/
    ├── linux/                       # Cours existant conservé
    └── reseaux/
        ├── course.json              # Métadonnées et configuration
        ├── syllabus/
        │   └── syllabus.json        # Programme Réseaux
        ├── lessons/
        │   └── data.js              # Leçons Réseaux
        ├── labs/
        │   ├── data.js              # Travaux pratiques
        │   └── engine.js            # Logique de validation
        └── simulators/
            └── index.js             # Simulation réseau éventuelle
```

### Exemple B : Programmation

```text
ece-learn/
├── programmation/
│   └── index.html                   # Entrée du nouveau cours
└── courses/
    └── programmation/
        ├── course.json              # Métadonnées du cours
        ├── syllabus/
        │   └── syllabus.json        # Programme pédagogique
        ├── lessons/
        │   └── data.js              # Notions
        ├── exercises/
        │   ├── data.js              # Exercices proposés
        │   └── engine.js            # Vérification des réponses
        └── editor/
            └── index.js             # Éditeur éventuel, si retenu
```

### Règles d'intégration

1. **Isoler les matières :** placer les données et outils spécifiques sous `courses/<matiere>/`, avec un point d'entrée propre si nécessaire. Ne pas insérer la logique d'un nouveau cours dans les moteurs Linux.
2. **Déclarer explicitement le cours :** mettre à jour `js/catalog.js` et définir son niveau seulement après décision pédagogique. Conserver les liens existants.
3. **Réutiliser avec discernement :** examiner `js/` et `components/` avant de mutualiser ; ne pas supposer que les modules actuellement centrés sur Linux sont génériques. Éviter les duplications inutiles.
4. **Isoler les données :** définir une progression et des clés `localStorage` distinctes par matière et par environnement ; ne pas écraser la progression Linux.
5. **Adapter les outils :** laboratoires, simulateurs, éditeurs ou terminaux sont facultatifs et propres aux besoins pédagogiques du cours.
6. **Tester et documenter :** compléter les tests, `README.md`, `ARCHITECTURE.md` et l'inventaire technique pour tout cours effectivement ajouté.
7. **Respecter le circuit de validation :** développement → CI verte → synchronisation Preview → parité hors workflows → recette → autorisation explicite → publication sur `main`. Préserver la référence graphique du portail et les workflows spécifiques.

## Qualité et évolutions

Les tests couvrent les contenus, les liens profonds, la navigation, les activités et la persistance sur des formats ordinateur et mobile. Le contrôle de parité compare les fichiers applicatifs entre développement et Preview, hors workflows.

La référence graphique validée est le commit `52354f55`. Toute modification visuelle ou publication sur le site officiel de test demande une validation explicite. **Aucune livraison aux étudiants n'est actée.**

Les prochaines matières, leurs niveaux et les éventuelles fonctions supplémentaires restent à définir et à valider.
