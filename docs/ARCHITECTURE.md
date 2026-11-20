# Architecture technique — ECE Learn

**Statut : plateforme en test interne, non livrée aux étudiants.**

## Objectif et périmètre

ECE Learn est une plateforme pédagogique statique multi-matières. Le portail permet de sélectionner un niveau d'études et d'accéder aux cours disponibles. Chaque matière dispose de ses propres contenus et outils ; les services communs assurent la navigation, le stockage et la progression.

Le site utilise **HTML, CSS et JavaScript natifs**, sans framework, backend ni authentification.

## Structure actuelle

```text
ece-learn/
├── index.html                  # Portail
├── linux/index.html            # Cours Linux
├── assets/                     # Logo et favicon
├── css/                        # Styles du portail et du cours
├── js/                         # Catalogue, routage, stockage, progression
├── components/                 # Leçons, quiz, navigation
├── courses/linux/
│   ├── course.json
│   ├── syllabus/syllabus.json
│   ├── lessons/data.js
│   ├── labs/
│   ├── simulators/
│   └── terminal/
├── tests/                      # Tests statiques et navigateur
├── docs/                       # Documentation courante
└── .github/workflows/          # Intégration continue
```

Les autres matières ne disposent pas encore de pages de cours. Leurs répertoires seront créés lorsque leurs contenus seront prêts.

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

## Qualité et évolutions

Les tests couvrent les contenus, les liens profonds, la navigation, les activités et la persistance sur des formats ordinateur et mobile. Le contrôle de parité compare les fichiers applicatifs entre développement et Preview, hors workflows.

La référence graphique validée est le commit `52354f55`. Toute modification visuelle ou publication sur le site officiel de test demande une validation explicite. **Aucune livraison aux étudiants n'est actée.**

Les prochaines matières, leurs niveaux et les éventuelles fonctions supplémentaires restent à définir et à valider.
