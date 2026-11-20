# ECE Learn

**Votre espace d'apprentissage interactif**

ECE Learn est la plateforme pédagogique ECE multi-matières, publiée sur GitHub Pages. **La migration depuis Linux Nexus est terminée le 20 novembre 2026** : dépôt renommé, code fusionné dans `main`, tests et déploiement verts, recette Preview et vérification utilisateur validées.

## Accès

- **Production :** https://bm-ece.github.io/ece-learn/ — dépôt `bm-ece/ece-learn`, branche `main`.
- **Cours Linux :** https://bm-ece.github.io/ece-learn/linux/.
- **Preview :** https://bm-ece.github.io/ece-learn-preview/ — dépôt indépendant `bm-ece/ece-learn-preview`, branche `main`.
- **Développement :** branche `develop/multicourse-platform` du dépôt `bm-ece/ece-learn`.
- **Sauvegarde pré-migration :** branche `backup/linux-nexus-production-2026-11-20`, commit `c0add686f4f907b153b20eceb6d5857c77bc2d3e`.

## Fonctionnement publié

Le portail propose ING1, ING2 et ING3. **Linux est disponible uniquement dans le catalogue ING3** ; Réseaux, Programmation et Cybersécurité ne sont pas encore publiés ni affectés à un niveau. Le filtre de niveau ne bloque pas les liens directs.

Linux conserve **79 notions, 7 domaines, 14 séances, 7 laboratoires, 28 commandes de référence, un terminal, l'atelier Bash et 4 simulateurs**. Les données pédagogiques historiques et la progression sont préservées.

## Architecture

- `index.html` : portail ; `linux/index.html` : entrée Linux et liens profonds `?view=learn&notion=12`.
- `js/catalog.js`, `js/portal.js` : catalogue et sélection du niveau.
- `js/routing.js`, `js/storage.js`, `js/progress.js` : navigation, persistance et progression ; `js/app.js` : coordination Linux.
- `components/` : leçon, quiz, navigation ; `courses/linux/` : métadonnées, syllabus, fiches, laboratoires, terminal, simulateurs.
- `css/tokens.css`, `css/layout.css`, `css/components.css` : styles Linux ; `css/styles.css` : point d'entrée compatible ; `css/portal.css` : portail validé.
- `tests/` et `.github/workflows/` : contrôles statiques, navigateurs ordinateur/mobile et régressions.

## Données et précautions

Les URLs `/ece-learn/` et `/ece-learn/linux/` sont les URLs officielles. La progression Linux de production conserve la clé `linux_nexus_complete_2026`, même après le renommage ; Preview utilise `linux_nexus_preview_complete_2026`. Le niveau choisi utilise `ece_learn_selected_level`. Ne pas effacer ou renommer ces clés sans migration testée. Les anciennes URL pédagogiques ne sont pas garanties.

La référence visuelle du portail reste le commit `52354f55` ; tout changement graphique exige une validation préalable. Les futures évolutions suivent le circuit développement → CI verte → synchronisation complète Preview et contrôle de parité → recette → accord de publication.

Voir [architecture](docs/ARCHITECTURE.md), [bilan de migration](docs/PLAN-MIGRATION.md), [déploiement Preview](docs/DEPLOIEMENT-PREVIEW.md) et [recette validée](docs/RECETTE-PREVIEW.md).
