# Déploiement ECE Learn — production et Preview

**État : opérationnel depuis le 20 novembre 2026.** Le dépôt Preview porte désormais le nom `bm-ece/ece-learn-preview` et publie sous `/ece-learn-preview/`. Le dépôt officiel est **`bm-ece/ece-learn`** ; le renommage et la publication sont terminés.

## Environnements en service

| Environnement | Dépôt et branche | Adresse |
| --- | --- | --- |
| Production | `bm-ece/ece-learn` — `main` | https://bm-ece.github.io/ece-learn/ |
| Linux production | Même dépôt — `main` | https://bm-ece.github.io/ece-learn/linux/ |
| Preview | `bm-ece/ece-learn-preview` — `main` | https://bm-ece.github.io/ece-learn-preview/ |
| Développement | `bm-ece/ece-learn` — `develop/multicourse-platform` | Branche de travail, pas une URL de publication |

GitHub Pages publie les sites depuis leurs branches `main`. Le déploiement Pages du nouveau dépôt officiel a réussi après fusion de la PR #62 (`8dab5e78`), et l'utilisateur a confirmé le fonctionnement du site.

## Procédure pour les mises à jour futures

1. Modifier `develop/multicourse-platform` dans `bm-ece/ece-learn`.
2. Attendre la réussite des tests statiques et navigateurs (ordinateur et mobile).
3. Synchroniser **tous les fichiers hors `.github/workflows/`** vers `bm-ece/ece-learn-preview/main` ; ne pas transférer une sélection approximative de fichiers.
4. Vérifier la CI Preview : le contrôle de parité compare les empreintes Git des fichiers à la branche de développement et échoue en cas d'écart.
5. Vérifier le déploiement Pages et faire valider les parcours sur Preview.
6. Publier sur `bm-ece/ece-learn/main` uniquement après autorisation explicite, puis contrôler les tests et le déploiement de production.

Les workflows diffèrent intentionnellement selon le dépôt ; ils ne font pas partie de la parité des fichiers applicatifs. La synchronisation inter-dépôts n'est pas automatique : la copie doit être complète et vérifiée.

## Chemins et navigation

| Usage | Production | Preview |
| --- | --- | --- |
| Portail | `/ece-learn/` | `/ece-learn-preview/` |
| Linux | `/ece-learn/linux/` | `/ece-learn-preview/linux/` |
| Fiche Linux 12 | `/ece-learn/linux/?view=learn&notion=12` | `/ece-learn-preview/linux/?view=learn&notion=12` |

Les liens et ressources utilisent des chemins relatifs. Les cours non publiés ne possèdent pas de point d'entrée. Les anciennes URL pédagogiques Linux Nexus ne font pas partie du contrat de compatibilité.

## Stockage et progression

Les deux sites partagent l'origine `bm-ece.github.io` : le stockage navigateur doit rester séparé par environnement.

- Production ECE Learn : **`linux_nexus_complete_2026`**, clé historique conservée après renommage.
- Preview : **`linux_nexus_preview_complete_2026`**.
- Niveau choisi : **`ece_learn_selected_level`**.

Ne pas renommer ni effacer les clés sans migration versionnée et tests. Le niveau choisi ne constitue pas une authentification.

## Référence et sécurité

La version Linux Nexus d'avant migration est sauvegardée dans `bm-ece/ece-learn`, branche `backup/linux-nexus-production-2026-11-20`, commit `c0add686`. La sauvegarde Git protège le code, **pas** le `localStorage` des étudiants. Toute restauration ou publication ultérieure demande une décision explicite.

La recette initiale a été validée ; voir [le bilan](PLAN-MIGRATION.md) et [la recette Preview](RECETTE-PREVIEW.md).
