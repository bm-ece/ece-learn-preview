# Recette utilisateur — ECE Learn (Preview)

**Site à tester :** https://bm-ece.github.io/linux-nexus-preview/  
**Cours Linux :** https://bm-ece.github.io/linux-nexus-preview/linux/  
**Branche source :** `develop/multicourse-platform`  
**Référence visuelle validée :** portail au commit `52354f55`  
**État :** recette manuelle à effectuer ; aucune autorisation de production implicite.

## Avant de commencer

Effectuer le parcours sur **un téléphone réel** et **un ordinateur**. Ne pas effacer le stockage du navigateur habituel : la recette doit notamment vérifier la conservation des données existantes. Le site Preview utilise `linux_nexus_preview_complete_2026` ; le site de production utilise `linux_nexus_complete_2026`, sur la même origine GitHub Pages. Les tests automatisés emploient un navigateur isolé et ne constituent pas une preuve de validation sur appareil réel.

## Parcours à cocher pour chaque appareil

- [ ] Ouvrir le portail : logo, titre, couleurs, disposition et menu déroulant conformes à la référence approuvée ; aucun élément tronqué.
- [ ] Choisir ING1 puis ING2 : aucun cours attribué, message explicite.
- [ ] Choisir ING3 : Linux seul cours affiché, lien fonctionnel ; recharger et retrouver ING3.
- [ ] Ouvrir Linux, utiliser « Retour aux matières », puis rouvrir Linux.
- [ ] Ouvrir directement la [fiche 1](https://bm-ece.github.io/linux-nexus-preview/linux/?view=learn&notion=1), la [fiche 12](https://bm-ece.github.io/linux-nexus-preview/linux/?view=learn&notion=12) et la [fiche 79](https://bm-ece.github.io/linux-nexus-preview/linux/?view=learn&notion=79). Recharger chaque fiche.
- [ ] Sur une fiche, vérifier les cinq cartes : Comprendre, Observer, Vérifier la compréhension, S'entraîner, Retenir.
- [ ] Essayer une mauvaise puis une bonne réponse au quiz ; vérifier les retours explicites.
- [ ] Tester une mission avec champ vide, mauvaise commande, puis commande de référence ; vérifier la progression après rechargement.
- [ ] Parcourir les 7 laboratoires ; exécuter au moins une commande, essayer une erreur et une réinitialisation. Les 28 commandes de référence sont couvertes par la CI.
- [ ] Tester terminal (commande et historique), atelier Bash (script simple) et les 4 simulateurs.
- [ ] Vérifier la navigation clavier (Tab, Entrée), la visibilité du focus et l'absence de défilement horizontal gênant.
- [ ] Vérifier la progression déjà enregistrée avant la recette et sa conservation après fermeture/réouverture du navigateur.
- [ ] Ouvrir `/linux-nexus-preview/linux/?view=learn&notion=80` : retour à l'accueil Linux sans erreur.
- [ ] Confirmer qu'aucune donnée du site officiel n'a été modifiée par les manipulations Preview.

## Relevé des résultats

| Contrôle | Téléphone | Ordinateur | Anomalie / capture |
| --- | --- | --- | --- |
| Portail et niveaux | À tester | À tester | |
| Navigation et liens directs | À tester | À tester | |
| Fiches, quiz et missions | À tester | À tester | |
| Laboratoires, terminal, Bash, simulateurs | À tester | À tester | |
| Progression et stockage | À tester | À tester | |
| Accessibilité et rendu | À tester | À tester | |

**Décision finale :** ☐ Preview validée ☐ Anomalies à corriger ☐ Recette incomplète  
**Date / appareil / navigateur :** à renseigner.  
**Accord pour publication sur `main` :** à demander **séparément**, jamais déduit de la recette.

## Couverture automatisée déjà acquise

La CI du commit `c4e69f64` (run `44716014154`) a réussi. Elle couvre notamment les 79 fiches et leurs QCM/missions, la persistance, les URL invalides, les 7 laboratoires et leurs 28 commandes, les simulateurs et les interactions terminal/Bash, sur des viewports desktop et mobile. Ces contrôles ne remplacent pas la recette sur appareils réels.

**Synchronisation :** les commits récents `7b3cfd4e`, `758e2426`, `fd7582c9` et `c4e69f64` ne concernent que les tests ou la documentation. Aucune copie supplémentaire vers le dépôt Preview n'est nécessaire pour cette recette ; la version visuelle approuvée reste en place.
