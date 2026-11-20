# Inventaire technique — ECE Learn

**Statut : environnement de test interne, sans livraison aux étudiants.**

## Dépôts et sites

- Site officiel de test : `bm-ece/ece-learn/main` — https://bm-ece.github.io/ece-learn/.
- Développement : `bm-ece/ece-learn/develop/multicourse-platform`.
- Preview : `bm-ece/ece-learn-preview/main` — https://bm-ece.github.io/ece-learn-preview/.

## Application

Application statique HTML, CSS et JavaScript, sans framework, serveur applicatif ni authentification.

- `index.html` : portail ; `linux/index.html` : cours Linux.
- `js/catalog.js` et `js/portal.js` : catalogue et choix du niveau.
- `js/routing.js`, `js/storage.js`, `js/progress.js` et `js/app.js` : navigation et fonctionnement Linux.
- `components/lesson.js`, `quiz.js`, `navigation.js` : composants pédagogiques.
- `courses/linux/course.json` et `syllabus/syllabus.json` : métadonnées et organisation pédagogique.
- `courses/linux/lessons/`, `labs/`, `simulators/`, `terminal/` : contenus et outils.
- `css/` : styles du portail et du cours.
- `tests/` et `.github/workflows/` : contrôles automatisés.

## Contenu et niveaux

Linux : **79 notions, 7 domaines, 14 séances, 7 laboratoires, 28 commandes de référence, terminal, atelier Bash et 4 simulateurs**.

Le portail propose ING1, ING2 et ING3. **Linux est associé uniquement à ING3**. Les autres matières sont indisponibles et ne sont pas affectées à un niveau.

## Stockage navigateur

- Progression du site officiel de test : `ece_learn_linux_progress_2026`.
- Progression Preview : `ece_learn_preview_linux_progress_2026`.
- Niveau sélectionné : `ece_learn_selected_level`.

Les données sont locales au navigateur, sans compte ni synchronisation entre appareils.

## Vérifications et maintenance

Tests statiques et navigateurs ordinateur/mobile ; vérification des liens directs, de la progression et des activités. Le contrôle Preview compare les fichiers applicatifs à la branche de développement, hors workflows.

Référence graphique : commit `52354f55`. Toute évolution suit **développement → CI verte → Preview synchronisée → parité → recette → autorisation explicite**.

La plateforme est encore en test : aucune mise à disposition des étudiants n'est déclarée.
