# Environnements et déploiement — ECE Learn

**Statut : plateforme en test interne, non livrée aux étudiants.**

## Environnements

| Environnement | Dépôt et branche | URL |
| --- | --- | --- |
| Site officiel de test | `bm-ece/ece-learn` — `main` | https://bm-ece.github.io/ece-learn/ |
| Linux | Même dépôt — `main` | https://bm-ece.github.io/ece-learn/linux/ |
| Preview | `bm-ece/ece-learn-preview` — `main` | https://bm-ece.github.io/ece-learn-preview/ |
| Développement | `bm-ece/ece-learn` — `develop/multicourse-platform` | Branche de travail |

Les deux sites sont publiés via GitHub Pages. Le site officiel reste un **environnement de test**, pas une plateforme livrée aux étudiants.

## Circuit de mise à jour

1. Développer sur `develop/multicourse-platform`.
2. Obtenir une CI verte, comprenant les tests statiques et navigateur.
3. Synchroniser tous les fichiers applicatifs vers `bm-ece/ece-learn-preview/main`.
4. Vérifier le contrôle de parité des fichiers, hors `.github/workflows/`.
5. Vérifier le déploiement Pages et réaliser la recette sur Preview.
6. Modifier `bm-ece/ece-learn/main` uniquement après autorisation explicite, puis vérifier ses tests et son déploiement.

Les workflows diffèrent selon les dépôts et ne sont pas copiés lors de la synchronisation. Celle-ci doit être complète et contrôlée.

## Chemins

| Usage | Site officiel de test | Preview |
| --- | --- | --- |
| Portail | `/ece-learn/` | `/ece-learn-preview/` |
| Linux | `/ece-learn/linux/` | `/ece-learn-preview/linux/` |
| Notion 12 | `/ece-learn/linux/?view=learn&notion=12` | `/ece-learn-preview/linux/?view=learn&notion=12` |

## Données de test

Les deux sites utilisent la même origine `bm-ece.github.io`, donc des clés distinctes sont nécessaires :

- Site officiel de test : `ece_learn_linux_progress_2026`.
- Preview : `ece_learn_preview_linux_progress_2026`.
- Niveau choisi : `ece_learn_selected_level`.

Le stockage est local au navigateur. Aucune donnée d'étudiant livré n'est supposée exister à ce stade.

## Précautions

Préserver la référence graphique du portail (`52354f55`). Ne pas confondre la réussite d'un déploiement GitHub Pages avec une validation pédagogique ou une autorisation de livraison aux étudiants.
