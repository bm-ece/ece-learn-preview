# Inventaire technique ECE Learn — état après migration

**État constaté au 20 novembre 2026 :** migration Linux Nexus → ECE Learn terminée. Le présent inventaire décrit l'application publiée ; les extractions initiales depuis le HTML monolithique appartiennent à l'historique de la migration.

## Dépôt et publication

- Dépôt officiel : `bm-ece/ece-learn`, branche `main`.
- Site officiel : https://bm-ece.github.io/ece-learn/ ; Linux : https://bm-ece.github.io/ece-learn/linux/.
- Développement : `develop/multicourse-platform`.
- Preview : `bm-ece/ece-learn-preview/main`.
- Sauvegarde pré-migration : `backup/linux-nexus-production-2026-11-20` (`c0add686`).

## Application et contenus

- Application statique HTML/CSS/JavaScript, sans framework ni backend.
- `index.html` : portail ; `linux/index.html` : entrée Linux et navigation profonde.
- `js/catalog.js` : catalogue et niveaux ; `js/portal.js` : interface du portail.
- `js/routing.js`, `js/storage.js`, `js/progress.js` : services Linux ; `js/app.js` : coordination.
- `components/lesson.js`, `quiz.js`, `navigation.js` : composants pédagogiques.
- `courses/linux/course.json` et `courses/linux/syllabus/syllabus.json` : métadonnées, 7 domaines, 14 séances, 79 notions.
- `courses/linux/lessons/`, `labs/`, `simulators/`, `terminal/` : 79 fiches, 7 laboratoires et 28 commandes de référence, 4 simulateurs, shell et système de fichiers simulés ; atelier Bash.
- `css/tokens.css`, `layout.css`, `components.css`, `styles.css` et `portal.css` : styles, compatibilité et portail.

## Persistance

La clé historique **`linux_nexus_complete_2026`** est conservée en production après renommage du dépôt. Elle contient notamment `done`, `labDone`, `labStarted`, `attempts`, `fs`. Preview utilise **`linux_nexus_preview_complete_2026`** ; le niveau choisi est mémorisé sous **`ece_learn_selected_level`**. Ces clés ne doivent pas être modifiées sans procédure de migration et tests.

## Contrôles réalisés

- Tests statiques, tests de navigation navigateur ordinateur/mobile, 79 fiches, quiz, missions, laboratoires, terminal, Bash et simulateurs.
- Contrôle des chemins GitHub Pages `/ece-learn/` et `/ece-learn/linux/`, des liens profonds et de la persistance.
- Parité des **38 fichiers hors workflows** entre développement et Preview vérifiée avant fusion.
- Tests de production et déploiement Pages verts au commit `8dab5e78` ; validation utilisateur confirmée.

## Règles de maintenance

Conserver le rendu du portail validé au commit `52354f55`, les contenus et identifiants historiques, les clés de progression et les chemins relatifs. Utiliser développement → CI verte → synchronisation complète Preview → contrôle de parité → recette → autorisation de publication. La branche de sauvegarde protège le code de l'ancienne production ; elle ne contient pas les données navigateur.
