# ECE Learn

**Votre espace d'apprentissage interactif**

Plateforme pédagogique statique ECE, en cours de migration depuis Linux Nexus vers un portail multi-matières. Le cours **Linux** (ING3) est le seul cours disponible ; Réseaux, Programmation et Cybersécurité ne sont pas encore publiés et n'ont pas de niveau attribué.

## Accès et branches

- [Production actuelle — Linux Nexus](https://bm-ece.github.io/linux-nexus/) : branche `main`, **ne pas modifier sans autorisation explicite**.
- [Preview ECE Learn](https://bm-ece.github.io/linux-nexus-preview/) : dépôt indépendant `bm-ece/linux-nexus-preview`, branche `main`.
- Développement : `bm-ece/linux-nexus`, branche `develop/multicourse-platform`.
- Nom et URL futurs **non encore activés** : `bm-ece/ece-learn` et `https://bm-ece.github.io/ece-learn/`.

## Architecture actuelle

- `index.html` : portail ECE Learn.
- `linux/index.html` : cours Linux et liens profonds `?view=learn&notion=12`.
- `js/catalog.js` : registre des matières et niveaux.
- `js/routing.js`, `js/storage.js`, `js/progress.js` : services extraits.
- `js/app.js` : orchestration et état Linux ; `components/` : fiches, quiz et navigation ; `courses/linux/` : syllabus, notions, laboratoires, terminal, Bash et simulateurs.
- `css/portal.css` : portail approuvé ; `css/styles.css` importe dans l'ordre `tokens.css`, `layout.css`, `components.css` pour Linux.
- `courses/linux/course.json` : métadonnées ; `courses/linux/syllabus/syllabus.json` : référence des 7 domaines, 14 séances et 79 notions. Le catalogue actif demeure `js/catalog.js`.
- `tests/` : contrôles statiques et navigateur ; `docs/` : plan et recette.

Les dossiers cibles `components/`, `courses/linux/` et les trois feuilles CSS sont en place. Le chargement garde un fichier d'entrée CSS de compatibilité et des scripts JavaScript classiques. Les 79 notions restent structurées en ordre stable dans `courses/linux/lessons/data.js` ; les 7 laboratoires, les 4 simulateurs et le terminal possèdent leurs répertoires. `js/app.js` conserve la coordination générale sans dupliquer les moteurs. Le schéma cible est présent, avec quelques fichiers de compatibilité supplémentaires.

## Règles de migration

1. Ne jamais fusionner ni publier sur `main` sans accord explicite.
2. Préserver les 79 notions, 7 laboratoires, terminal, Bash, 4 simulateurs et la progression existante.
3. Garder la référence visuelle du portail au commit `52354f55` ; aucun changement graphique sans validation préalable.
4. Tester sur `develop/multicourse-platform`, attendre la CI verte, puis synchroniser Preview uniquement pour les modifications nécessaires à son fonctionnement.
5. Faire valider la Preview avant toute publication officielle.

Voir [le plan de migration](docs/PLAN-MIGRATION.md), [la procédure Preview](docs/DEPLOIEMENT-PREVIEW.md) et [la recette](docs/RECETTE-PREVIEW.md).
