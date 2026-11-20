# Architecture en production — ECE Learn

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
│   ├── routing.js                 # Routage et navigation
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
et les outils qu'elle active. Les notions conservent leur identité et leur ordre actuels dans la version publiée, y
compris leur indice historique pour la progression. Une fiche pourra ensuite stocker : `id`, `domainId`, `title`,
`description`, `understand`, `observe`, `quiz`, `practice`, `remember`. Les missions définissent des critères de
validation explicites, séparés de l'affichage.

**Important :** les champs proposés ci-dessus restent un contrat extensible ; les données Linux existantes sont conservées. Ne
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
2. Chemins relatifs compatibles avec `/ece-learn/` et `/linux-nexus-preview/` (éviter les chemins racine `/assets/...`).
3. Aucun appel réseau requis pour l'usage normal des fiches déjà chargées, sauf ressources statiques hébergées sur le même site.
4. Contenu textuel échappé lors du rendu ; pas d'injection HTML provenant des données de cours.
5. Identifiants de cours et de notions stables ; progression isolée par matière. Préserver les données de progression Linux pendant la migration ; la compatibilité des anciennes URL n'est pas requise.
6. Accessibilité : titres hiérarchiques, clavier, focus, contrastes et annonces des résultats de quiz.
7. Les évolutions structurelles ultérieures passent par tests, comparaison visuelle et validation avant publication.

## 6. Déploiement et sécurité

`main` est la branche de production publiée. `develop/multicourse-platform` est la branche d'intégration. La
prévisualisation doit être déployée **séparément** (autre site ou autre cible de publication) ; changer la source
GitHub Pages du dépôt existant risquerait de remplacer la production. Voir `docs/DEPLOIEMENT-PREVIEW.md`.

## 7. Critères de réussite

- Les 79 fiches, leurs cinq cartes et leurs évaluations restent accessibles.
- Les 7 laboratoires, les simulateurs et le terminal fonctionnent comme avant.
- La progression existante est conservée après mise à jour et rechargement, y compris sur les profils déjà enregistrés.
- L'interface mobile et ordinateur est visuellement équivalente.
- Les tests automatisés passent ; les scénarios manuels critiques sont documentés.
- Une seconde matière peut être ajoutée sans recopier le terminal ou le code de l'application Linux.
- Les évolutions futures n'atteignent `main` qu'après validation explicite.

## 8. URL officielles par matière

**Convention B publiée :** portail https://bm-ece.github.io/ece-learn/ ; Linux https://bm-ece.github.io/ece-learn/linux/ ; fiche 12 `/ece-learn/linux/?view=learn&notion=12`. Preview : `/linux-nexus-preview/` et `/linux-nexus-preview/linux/`.

Chaque matière dispose d'un point d'entrée statique `<cours>/index.html` et réutilise les services communs. La racine affiche uniquement le portail. Les anciennes URL pédagogiques de Linux Nexus ne sont pas garanties ; les identifiants de notions et la progression Linux ont été conservés.

Les cours Réseaux, Programmation et Cybersécurité ne sont pas publiés et ne possèdent pas de liens navigables.

## 9. Identité et publication réalisée

- **Nom : ECE Learn** ; signature : « Votre espace d'apprentissage interactif ».
- **Dépôt officiel :** `bm-ece/ece-learn` (renommé depuis `bm-ece/linux-nexus`).
- **Publication :** pull request #62 fusionnée dans `main`, commit `8dab5e78905b77b46bd29ec834be5164efc44fc2`. Tests et déploiement GitHub Pages verts, vérification utilisateur confirmée.
- **Sauvegarde :** `backup/linux-nexus-production-2026-11-20`, commit `c0add686`.
- **Progression historique :** clé `linux_nexus_complete_2026` maintenue après renommage ; clé Preview `linux_nexus_preview_complete_2026`.
- **Référence visuelle approuvée :** portail au commit `52354f55`.

## 10. Vérifications effectuées

1. Accès direct et rechargement de `/ece-learn/linux/` et des fiches `?view=learn&notion=12` : tests automatisés et validation utilisateur.
2. Racine `/ece-learn/` réservée au portail ; navigation et retour aux matières validés.
3. Ressources, styles et scripts testés sur les chemins Preview et `/ece-learn/`.
4. Progression Linux historique et isolation Preview contrôlées.
5. Tests des 79 fiches, quiz, missions, 7 laboratoires, terminal, Bash et 4 simulateurs sur configurations ordinateur/mobile ; recette utilisateur validée.
6. Parité des 38 fichiers hors workflows entre développement et Preview vérifiée avant publication ; CI production et Pages vertes après fusion.
7. Toute évolution future conserve le circuit CI → Preview → validation → autorisation de publication.

## 11. Niveaux d'études et visibilité des matières (décision validée)

- **Périmètre initial : ING1, ING2 et ING3 uniquement.** ING4 et ING5 ne sont pas proposés à ce stade.
- **Affectation confirmée : Linux → ING3 uniquement.** Les autres matières envisagées (Réseaux, Programmation, Cybersécurité) n'ont **pas encore de niveau attribué** : ne pas en déduire qu'elles concernent ING1, ING2 ou ING3.
- Le portail demande le niveau avant d'afficher les matières ; il filtre les entrées de `js/catalog.js` selon leur tableau `levels`. Un cours peut être associé à plusieurs niveaux sans duplication de son contenu.
- En l'absence de cours attribué au niveau sélectionné, afficher un message explicite, et non des cours d'autres niveaux. Les cours non publiés ne possèdent aucun lien navigable.
- Le choix du niveau est mémorisé localement sous `ece_learn_selected_level`, **distinct** des données pédagogiques Linux. Il ne constitue ni une authentification ni une restriction d'accès : une URL directe vers Linux reste utilisable indépendamment du niveau choisi.
- Le filtrage n'altère ni les identifiants des notions, ni la progression, ni les clés de stockage Linux historiques ; la séparation Preview/production est conservée.
- Tests attendus : ING1 et ING2 sans cours attribué ; ING3 avec Linux ; mémorisation du choix après rechargement ; accès direct aux cours et progression Linux inchangés ; rendu mobile et ordinateur.
- **Évolutions à décider plus tard :** affectation pédagogique des nouvelles matières, éventuelle distinction par parcours/spécialité et ajout d'autres niveaux. Ne pas inventer ces règles avant validation.
