# Recette ECE Learn — procès-verbal de validation

**Statut : VALIDÉ.** La recette Preview et la vérification finale du site officiel ont été confirmées par l'utilisateur le **20 novembre 2026**.

- **Production validée :** https://bm-ece.github.io/ece-learn/
- **Linux production :** https://bm-ece.github.io/ece-learn/linux/
- **Preview de référence :** https://bm-ece.github.io/ece-learn-preview/
- **Référence graphique approuvée :** portail au commit `52354f55`.
- **Version publiée :** fusion PR #62, commit `8dab5e78905b77b46bd29ec834be5164efc44fc2`.

## Parcours validés

| Périmètre | Validation |
| --- | --- |
| Portail ECE Learn et présentation ordinateur/mobile | Confirmée par l'utilisateur |
| Niveaux ING1, ING2, ING3 ; Linux associé à ING3 | Tests automatisés et recette Preview |
| Navigation vers Linux et retour aux matières | Tests et recette |
| 79 fiches, cinq cartes, quiz et missions | Couverture automatisée desktop/mobile |
| 7 laboratoires, 28 commandes de référence, erreurs et réinitialisation | Couverture automatisée desktop/mobile |
| Terminal, historique, Bash et 4 simulateurs | Couverture automatisée desktop/mobile |
| Progression sauvegardée et rechargement | Tests et recette |
| Liens directs, URL invalides et ressources statiques | Tests automatisés |
| Chemin cible `/ece-learn/`, clé historique Linux et séparation Preview | Tests automatisés |
| Nouveau portail publié sur GitHub Pages | Déploiement réussi et validation utilisateur |

Les tests automatisés ont été réalisés sur des **viewports** ordinateur et mobile. La validation utilisateur constitue une étape distincte ; aucun détail d'appareil ou de navigateur non fourni n'est inventé ici.

## Vérifications de publication

- CI développement : verte après le test du chemin `/ece-learn/` et la correction du workflow Linux.
- CI Preview : verte ; synchronisation finale et comparaison des **38 fichiers hors workflows** confirmées avant migration.
- CI production : **Linux regression checks** et **pages build and deployment** verts après fusion `8dab5e78`.
- Sauvegarde de l'ancienne production : `backup/linux-nexus-production-2026-11-20` au commit `c0add686`.
- L'utilisateur a confirmé que le nouveau site fonctionne après la publication.

**Décision : recette clôturée, migration publiée et validée.** Les futures évolutions pédagogiques constituent de nouveaux travaux et non des étapes restantes de cette migration.
