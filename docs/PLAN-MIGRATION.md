# Bilan de migration — Linux Nexus vers ECE Learn

**Statut : TERMINÉ — 20 novembre 2026.** Le dépôt Preview a ensuite été renommé `bm-ece/ece-learn-preview`, sans changer son rôle ni sa clé de progression. Ce document consigne les opérations réalisées ; il ne constitue plus une liste de tâches avant publication.

## Publication effectuée

- Dépôt renommé de `bm-ece/linux-nexus` en **`bm-ece/ece-learn`**.
- Pull request **#62** fusionnée dans `main`, commit **`8dab5e78905b77b46bd29ec834be5164efc44fc2`**.
- Production publiée : **https://bm-ece.github.io/ece-learn/** ; Linux : **https://bm-ece.github.io/ece-learn/linux/**.
- GitHub Actions : vérifications Linux sur `main` et déploiement Pages **réussis** au commit de fusion.
- Validation fonctionnelle et visuelle du nouveau site **confirmée par l'utilisateur**.
- Référence de retour arrière conservée : branche **`backup/linux-nexus-production-2026-11-20`**, commit **`c0add686f4f907b153b20eceb6d5857c77bc2d3e`**.

## Phases achevées

| Phase | Résultat |
| --- | --- |
| Inventaire et architecture | Inventaire technique, architecture et convention URL par matière documentés |
| Preview indépendante | Dépôt `bm-ece/ece-learn-preview`, Pages, isolation de stockage et validation utilisateur |
| Styles | `tokens.css`, `layout.css`, `components.css`, compatibilité `styles.css` et portail approuvé |
| Services | Routage, stockage, progression et catalogue séparés |
| Contenu Linux | 79 notions, syllabus de 7 domaines et 14 séances, 7 laboratoires, 28 commandes, terminal, Bash, 4 simulateurs |
| Composants | `components/lesson.js`, `quiz.js`, `navigation.js` |
| Niveaux | ING1, ING2 et ING3 ; Linux affecté à ING3 uniquement |
| Recette | Tests statiques, navigateur desktop/mobile, parcours pédagogiques et validation humaine |
| Migration officielle | Renommage du dépôt, fusion #62, Pages vertes et contrôle utilisateur du site |

Les 79 notions restent dans `courses/linux/lessons/data.js` avec leurs indices historiques ; cela préserve les URL profondes et la progression. Le site est statique, sans framework ni backend ajouté. Les autres matières restent non publiées.

## Tests et parité validés avant publication

- Les tests couvrent les **79 fiches**, les cinq cartes, quiz et missions, les **7 laboratoires et 28 commandes**, le terminal, Bash, les **4 simulateurs**, la persistance, les URL invalides et le retour au portail.
- Les essais automatisés ont été exécutés sur des configurations ordinateur et mobile ; la recette visuelle et fonctionnelle a ensuite été validée par l'utilisateur.
- Avant publication, les **38 fichiers hors workflows** des branches développement et Preview ont été comparés à l'identique. Preview dispose d'un contrôle CI de parité avec la branche de développement ; les workflows de déploiement sont volontairement distincts.
- Les tests du futur chemin `/ece-learn/` et de la conservation de la clé Linux historique ont réussi avant fusion.
- Après fusion, les workflows **Linux regression checks** et **pages build and deployment** sur `main` ont réussi.

## Données conservées

- Production : `linux_nexus_complete_2026` (champs historiques `done`, `labDone`, `labStarted`, `attempts`, `fs`).
- Preview : `linux_nexus_preview_complete_2026`.
- Choix de niveau : `ece_learn_selected_level`.
- Les chemins `/ece-learn/` et `/ece-learn/linux/` remplacent les anciens chemins publics. La compatibilité des anciennes URL pédagogiques n'a pas été ajoutée ; **la compatibilité des données Linux a été maintenue**.

## Sauvegarde et retour arrière

La branche `backup/linux-nexus-production-2026-11-20` pointe toujours vers le code Linux Nexus antérieur à la migration (`c0add686`). En cas d'incident, restaurer ce commit sur `main` après décision explicite, puis vérifier le paramétrage GitHub Pages et, si nécessaire, rétablir le nom `linux-nexus`. La sauvegarde Git ne contient **pas** les données `localStorage` des navigateurs.

## Exploitation après migration

- Production : `bm-ece/ece-learn`, `main`.
- Développement : `develop/multicourse-platform` dans le même dépôt.
- Preview : `bm-ece/ece-learn-preview`, `main`.
- Circuit des modifications ultérieures : tests sur développement, CI verte, synchronisation **intégrale** des fichiers hors workflows avec Preview, contrôle de parité, validation utilisateur puis publication autorisée.
- La référence graphique du portail est `52354f55`. Aucun changement graphique non validé.
- Les matières Réseaux, Programmation et Cybersécurité ne sont pas encore disponibles : leur publication est une **évolution ultérieure**, distincte de la migration achevée.
