# ECE Learn

**Votre espace d'apprentissage interactif**

ECE Learn est une plateforme pédagogique ECE **en phase de test interne**. Elle est accessible sur GitHub Pages pour la validation, mais **n'est pas encore livrée aux étudiants**.

## Accès et environnements

- **Site officiel de test :** https://bm-ece.github.io/ece-learn/ — dépôt `bm-ece/ece-learn`, branche `main`.
- **Cours Linux :** https://bm-ece.github.io/ece-learn/linux/.
- **Preview :** https://bm-ece.github.io/ece-learn-preview/ — dépôt `bm-ece/ece-learn-preview`, branche `main`.
- **Développement :** branche `develop/multicourse-platform` du dépôt `bm-ece/ece-learn`.

## Fonctionnement actuel

Le portail propose ING1, ING2 et ING3. **Linux est associé uniquement à ING3**. Réseaux, Programmation et Cybersécurité ne sont pas encore disponibles et n'ont pas de niveau attribué. Le choix du niveau filtre le catalogue, sans empêcher l'ouverture d'un lien direct.

Le cours Linux comporte **79 notions, 7 domaines, 14 séances, 7 laboratoires, 28 commandes de référence, un terminal, un atelier Bash et 4 simulateurs**.

## Architecture

- `index.html` : portail ECE Learn ; `linux/index.html` : cours Linux.
- `js/catalog.js`, `js/portal.js` : catalogue et choix du niveau.
- `js/routing.js`, `js/storage.js`, `js/progress.js`, `js/app.js` : navigation, sauvegarde et fonctionnement Linux.
- `components/` : leçons, quiz et navigation.
- `courses/linux/` : contenus, laboratoires, simulateurs et terminal.
- `css/` : présentation ; `tests/` et `.github/workflows/` : vérifications.

## Données locales

La progression Linux utilise `ece_learn_linux_progress_2026` sur le site officiel de test et `ece_learn_preview_linux_progress_2026` sur Preview. Le niveau choisi est mémorisé sous `ece_learn_selected_level`.

Les données sont enregistrées localement dans le navigateur ; elles ne constituent ni un compte étudiant ni une synchronisation entre appareils. La plateforme étant en test, les données de test peuvent être réinitialisées après décision explicite.

## Règles de développement et de validation

Le portail conserve sa référence graphique validée au commit `52354f55`. Toute modification visuelle nécessite un accord préalable.

Circuit de travail : **développement → CI verte → synchronisation complète Preview → contrôle de parité → recette → autorisation explicite de publication**. La branche `main` correspond au site officiel de test, **pas à une livraison aux étudiants**.

Voir [architecture](docs/ARCHITECTURE.md), [inventaire technique](docs/INVENTAIRE-TECHNIQUE.md), [déploiement Preview](docs/DEPLOIEMENT-PREVIEW.md) et [recette](docs/RECETTE-PREVIEW.md).
