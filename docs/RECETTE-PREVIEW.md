# Recette de test — ECE Learn

**Statut : plateforme en phase de test interne. La livraison aux étudiants n'est pas autorisée.**

## Périmètre

- Portail officiel de test : https://bm-ece.github.io/ece-learn/.
- Cours Linux : https://bm-ece.github.io/ece-learn/linux/.
- Environnement Preview : https://bm-ece.github.io/ece-learn-preview/.
- Référence visuelle : commit `52354f55`.

## Scénarios de recette

| Fonction | Contrôle attendu |
| --- | --- |
| Portail | Présentation conforme sur ordinateur et mobile |
| Niveaux | ING1 et ING2 sans cours attribué ; Linux visible en ING3 |
| Navigation | Ouverture de Linux et retour au portail |
| Notions | 79 fiches, cinq cartes pédagogiques, quiz et missions |
| Laboratoires | 7 laboratoires et 28 commandes de référence |
| Outils | Terminal, atelier Bash et 4 simulateurs |
| Progression | Sauvegarde et rechargement dans le navigateur |
| Liens directs | Notions, laboratoires, simulateurs et bibliothèque |
| Preview | Clé de progression distincte du site officiel de test |
| Qualité | CI verte, ressources accessibles, parité avec développement |

Les tests automatisés sur des formats ordinateur et mobile ne remplacent pas la recette humaine. Ne pas attribuer à un testeur des appareils, navigateurs ou résultats non explicitement constatés.

## Conditions de validation

1. CI développement réussie.
2. Synchronisation complète de Preview et contrôle de parité réussi.
3. Déploiement GitHub Pages Preview réussi.
4. Vérification fonctionnelle et visuelle par le responsable.
5. Accord explicite avant toute modification du site officiel de test.

**Important :** un site techniquement accessible sur GitHub Pages n'est pas pour autant livré aux étudiants. La décision de livraison est distincte et reste à prendre.
