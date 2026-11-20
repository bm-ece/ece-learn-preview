# Architecture cible — ECE Learn

> Statut : **arborescence cible implémentée sur la branche de développement ; recette Preview et publication finale séparées**. Branche de travail :
> `develop/multicourse-platform`. **Nom final retenu : ECE Learn.** Le dépôt et le site publics restent temporairement `linux-nexus` pendant la migration ; leur renommage est obligatoire avant la publication finale, après recette et accord explicite.

## 1. Vision et périmètre

Faire évoluer Linux Nexus vers **ECE Learn**, une plateforme pédagogique ECE multi-matières, hébergée statiquement, tout en
préservant l'expérience Linux actuelle. Un portail commun propose plusieurs matières ; chaque matière possède ses
données, activités et outils spécialisés. Les composants transversaux (navigation, design, progression, tests) sont
mutualisés.

**Contraintes :** ne pas altérer l'apparence actuelle (charte ECE, logo, favicon, colonnes), les 79 fiches Linux,
les 7 laboratoires, les simulateurs, le terminal, les fonctionnalités Linux ni les données sauvegardées. Pas de réécriture
en framework ni de backend imposé dans cette phase. Conserver GitHub Pages et une application statique
HTML/CSS/JavaScript.

## 2. Arborescence cible

```text
linux-nexus/
├── index.html                     # Portail ECE Learn (racine du site)
├── linux/
│   └── index.html                  # Point d'entrée statique du cours Linux
├── assets/                        # Logo officiel, favicon, médias
├── css/
│   ├── tokens.css                 # Variables visuelles ECE
│   ├── layout.css                 # Structure responsive
│   └── components.css             # Cartes, formulaires, navigation
├── js/
│   ├── app.js                     # Initialisation
│   ├── routing.js                 # Routage et navigation (extrait sur develop)
│   ├── catalog.js                 # Catalogue des matières
│   ├── storage.js                 # Lecture et sauvegarde des données locales
│   └── progress.js                # Progression isolée par matière
├── components/
│   ├── lesson.js                  # Les cinq cartes pédagogiques
│   ├── quiz.js
│   └── navigation.js
├── courses/
│   └── linux/
│       ├── course.json            # Métadonnées, domaines, ordre
│       ├── syllabus/              # Référence pédagogique
│       ├── lessons/               # 79 fiches structurées
│       ├── labs/                  # 7 laboratoires
│       ├── simulators/            # Simulateurs Linux
│       └── terminal/              # Shell et FS simulés
├── tests/                         # Tests unitaires, intégration, E2E
├── docs/
│   ├── ARCHITECTURE.md
│   ├── PLAN-MIGRATION.md
│   └── DEPLOIEMENT-PREVIEW.md
├── .github/workflows/             # CI et déploiements isolés
└── README.md
```

Les dossiers des futures matières (ex. `networks/index.html`, `courses/networks/`, `courses/programming/`) seront créés **seulement lorsque leur contenu sera prêt** ; ne pas publier de fausses fiches ou activités.

**Extension future illustrative, absente de l'arborescence actuelle :**

```text
networks/
└── index.html                 # Entrée web du cours Réseaux
courses/
└── networks/
    ├── course.json
    ├── lessons/
    └── labs/                  # Uniquement si le cours en propose
```

**Conformité de l'arborescence :** les répertoires cibles sont désormais présents, y compris `courses/linux/syllabus/` contenant la référence réelle des 7 domaines, 14 séances et 79 notions. Les notions restent regroupées dans `courses/linux/lessons/data.js` pour conserver leurs identifiants et la progression ; `css/styles.css` reste un point d'entrée compatible important les trois fichiers CSS. Les fichiers complémentaires (`js/portal.js`, `css/portal.css`, moteurs Linux) sont nécessaires au fonctionnement réel. Aucun dossier vide artificiel.

## 3. Contrats de données proposés

Une matière définit un identifiant stable (`linux`), un titre, une version de contenu, ses domaines, ses ressources
et les outils qu'elle active. Les notions conservent leur identité et leur ordre actuels durant la migration, y
compris leur indice historique pour la progression. Une fiche pourra ensuite stocker : `id`, `domainId`, `title`,
`description`, `understand`, `observe`, `quiz`, `practice`, `remember`. Les missions définissent des critères de
validation explicites, séparés de l'affichage.

**Important :** les exemples ci-dessus constituent un schéma cible à affiner après inventaire du code existant. Ne
pas modifier les clés localStorage, les identifiants de fiches ou les règles de notation sans stratégie de
migration et tests de non-régression.

## 4. Séparation des responsabilités

- **Contenu** : syllabus, fiches, exemples, questions, corrections, laboratoires.
- **Présentation** : design ECE, navigation, cartes pédagogiques et accessibilité.
- **Moteurs interactifs** : terminal Linux, simulateurs et atelier Bash ; aucun moteur Linux n'est imposé aux autres matières.
- **Services communs** : catalogue, progression, persistance, suivi des validations.
- **Tests** : contrôle du contenu, du rendu, des interactions et de la compatibilité des données.

## 5. Principes techniques

1. JavaScript natif avec modules ES si compatibles avec GitHub Pages ; pas de framework ajouté sans nécessité démontrée.
2. Chemins relatifs compatibles avec `/linux-nexus/` (éviter les chemins racine `/assets/...`).
3. Aucun appel réseau requis pour l'usage normal des fiches déjà chargées, sauf ressources statiques hébergées sur le même site.
4. Contenu textuel échappé lors du rendu ; pas d'injection HTML provenant des données de cours.
5. Identifiants de cours et de notions stables ; progression isolée par matière. Préserver les données de progression Linux pendant la migration ; la compatibilité des anciennes URL n'est pas requise.
6. Accessibilité : titres hiérarchiques, clavier, focus, contrastes et annonces des résultats de quiz.
7. Une modification structurelle par étape, avec tests et comparaison visuelle avant validation.

## 6. Déploiement et sécurité

`main` demeure la branche de production. `develop/multicourse-platform` est la branche d'intégration. La
prévisualisation doit être déployée **séparément** (autre site ou autre cible de publication) ; changer la source
GitHub Pages du dépôt existant risquerait de remplacer la production. Voir `docs/DEPLOIEMENT-PREVIEW.md`.

## 7. Critères de réussite

- Les 79 fiches, leurs cinq cartes et leurs évaluations restent accessibles.
- Les 7 laboratoires, les simulateurs et le terminal fonctionnent comme avant.
- La progression existante est conservée après mise à jour et rechargement, y compris sur les profils déjà enregistrés.
- L'interface mobile et ordinateur est visuellement équivalente.
- Les tests automatisés passent ; les scénarios manuels critiques sont documentés.
- Une seconde matière peut être ajoutée sans recopier le terminal ou le code de l'application Linux.
- Aucun changement n'atteint `main` avant validation explicite.

## 8. Convention validée : URL par matière et GitHub Pages

**Convention cible (option B, plateforme encore en test) :**

- Portail : `https://bm-ece.github.io/linux-nexus/`.
- Linux : `https://bm-ece.github.io/linux-nexus/linux/`.
- Réseaux (lorsque le cours existera) : `https://bm-ece.github.io/linux-nexus/networks/`.
- Fiche Linux 12 : `/linux-nexus/linux/?view=learn&notion=12`.
- Fiche Réseaux 12 : `/linux-nexus/networks/?view=learn&notion=12`.

Le **chemin du cours est obligatoire** pour les pages pédagogiques. Les identifiants de notions sont interprétés **dans le cours sélectionné** : les deux notions 12 ne se confondent jamais. Conserver provisoirement les identifiants numériques existants, sans introduire de nouveaux identifiants textuels avant besoin démontré.

Chaque matière publiée dispose d'un vrai point d'entrée statique `<course>/index.html`, afin qu'un chargement direct ou un rafraîchissement fonctionne sur GitHub Pages, sans serveur de réécriture. Ces entrées sont de minces amorces qui chargent les **mêmes** styles, composants et services communs : **ne pas dupliquer l'application**. Les ressources doivent être résolues correctement depuis les sous-chemins du dépôt GitHub Pages, en production comme en preview.

**Option B : pas de redirection ni de prise en charge des anciennes URL pédagogiques** du type `/linux-nexus/?view=learn&notion=12`. La racine est réservée au portail ; ses paramètres pédagogiques hérités sont ignorés. La plateforme n'étant pas encore distribuée aux étudiants, ne pas ajouter de couche de compatibilité des URL. **Ne pas confondre avec les données locales :** préserver les progressions Linux enregistrées et séparer les progressions par cours reste obligatoire.

Le portail ne doit pas afficher de matières fictives : `networks/index.html` et `courses/networks/` sont des exemples de structure, à créer uniquement lorsque le cours est prêt. Le nom du dépôt et son chemin public `linux-nexus` restent inchangés **pendant la migration** ; la cible finale est `ece-learn`.

## 9. Identité et renommage final

- **Nom de la plateforme : ECE Learn** ; signature : **« Votre espace d'apprentissage interactif »**.
- **Matières prévues au portail :** Linux — « Linux, Bash et administration système » ; Réseaux — « Protocoles, adressage et simulation » ; Programmation — « Algorithmes et exercices pratiques » ; Cybersécurité — « Sécurité des systèmes et réseaux ».
- Linux est le seul cours existant : les autres matières sont des perspectives de développement, éventuellement indiquées « Prochainement », **sans liens vers des cours inexistants**. Le cours s'appelle **Linux** dans le portail.
- **Nom cible du dépôt :** `bm-ece/ece-learn` ; **adresse cible :** `https://bm-ece.github.io/ece-learn/`, cours Linux `https://bm-ece.github.io/ece-learn/linux/`. Ce sont des **cibles non encore déployées**, pas des URL actuellement actives.
- Le renommage du dépôt, les changements de chemins GitHub Pages et l'identité visuelle finale interviennent dans une **étape dédiée avant publication**, uniquement après recette Preview et autorisation explicite. Éviter les chemins de base codés en dur ; préserver le chargement des ressources, la navigation et les données Linux. Un changement d'URL ne doit pas provoquer de perte de progression : tester la lecture de la clé historique et les migrations nécessaires.
- La convention **option B** reste en vigueur : pas de redirection des anciennes URL pédagogiques. La gestion opérationnelle d'un changement de nom du dépôt/site est une question distincte à vérifier avant publication.

## 10. Critères de conception et de vérification des URL

1. Accès direct et rechargement de `/linux/` et de `/linux/?view=learn&notion=12` sur GitHub Pages.
2. Une même valeur `notion=12` ne désigne jamais le contenu d'un autre cours.
3. La racine `/` affiche le portail et n'interprète pas les anciens paramètres Linux.
4. Les liens internes, CSS, scripts, images et ressources fonctionnent sous `/linux-nexus/` **et** `/linux-nexus-preview/`.
5. Progression et données locales isolées par environnement puis par matière, sans perte de progression Linux existante.
6. Aucune modification visuelle ou fonctionnelle non validée ; pas de framework, de routeur externe ni de redirection superflue.
7. Aucun changement sur `main` du dépôt source sans autorisation explicite.

## 11. Niveaux d'études et visibilité des matières (décision validée)

- **Périmètre initial : ING1, ING2 et ING3 uniquement.** ING4 et ING5 ne sont pas proposés à ce stade.
- **Affectation confirmée : Linux → ING3 uniquement.** Les autres matières envisagées (Réseaux, Programmation, Cybersécurité) n'ont **pas encore de niveau attribué** : ne pas en déduire qu'elles concernent ING1, ING2 ou ING3.
- Le portail demande le niveau avant d'afficher les matières ; il filtre les entrées de `js/catalog.js` selon leur tableau `levels`. Un cours peut être associé à plusieurs niveaux sans duplication de son contenu.
- En l'absence de cours attribué au niveau sélectionné, afficher un message explicite, et non des cours d'autres niveaux. Les cours non publiés ne possèdent aucun lien navigable.
- Le choix du niveau est mémorisé localement sous `ece_learn_selected_level`, **distinct** des données pédagogiques Linux. Il ne constitue ni une authentification ni une restriction d'accès : une URL directe vers Linux reste utilisable indépendamment du niveau choisi.
- Le filtrage n'altère ni les identifiants des notions, ni la progression, ni les clés de stockage Linux historiques ; la séparation Preview/production est conservée.
- Tests attendus : ING1 et ING2 sans cours attribué ; ING3 avec Linux ; mémorisation du choix après rechargement ; accès direct aux cours et progression Linux inchangés ; rendu mobile et ordinateur.
- **Évolutions à décider plus tard :** affectation pédagogique des nouvelles matières, éventuelle distinction par parcours/spécialité et ajout d'autres niveaux. Ne pas inventer ces règles avant validation.
