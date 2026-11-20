# Déploiement de la prévisualisation — méthode simplifiée

## Décision

**Identité finale retenue : ECE Learn** — « Votre espace d'apprentissage interactif ». Le dépôt source `linux-nexus` et le dépôt Preview `linux-nexus-preview` gardent leurs noms **pendant la migration**. Le dépôt final envisagé est `bm-ece/ece-learn` avec l'adresse `https://bm-ece.github.io/ece-learn/` ; ce renommage n'est **pas encore effectué** et requiert validation explicite.

Nous utilisons deux dépôts GitHub :

- **Source :** `bm-ece/linux-nexus`, branche de travail `develop/multicourse-platform`.
- **Site de test :** `bm-ece/linux-nexus-preview`, branche `main`.
- **Site officiel :** `https://bm-ece.github.io/linux-nexus/`, publié depuis la branche `main` du dépôt source, inchangée jusqu'à validation.

La prévisualisation doit fonctionner comme le site officiel : **chaque push sur `main` du dépôt
`linux-nexus-preview` déclenche le déploiement GitHub Pages**, une fois la source Pages configurée sur **Deploy
from a branch**, branche **main**, dossier **/(root)**.

## Fonctionnement quotidien

1. Développer uniquement sur `develop/multicourse-platform` dans `bm-ece/linux-nexus`.
2. Vérifier les changements et les tests.
3. Copier les fichiers statiques nécessaires dans `bm-ece/linux-nexus-preview` sur `main` et effectuer le commit/push.
4. GitHub Pages publie automatiquement le site de test à partir de ce push ; aucune exécution manuelle de workflow n'est nécessaire.
5. Tester le site sur ordinateur et téléphone, corriger si nécessaire.
6. **Uniquement après validation explicite**, proposer une pull request de la branche de développement vers `main` du dépôt officiel.

**Limite assumée :** un push sur `develop/multicourse-platform` dans le dépôt source ne déclenche pas
automatiquement une copie vers l'autre dépôt. L'étape 3 est réalisée lors de la publication de la preview. Le
déploiement Pages, lui, est automatique après le push dans le dépôt Preview.

## Configuration unique à vérifier

Dans `bm-ece/linux-nexus-preview` → **Settings → Pages** :

- Source : **Deploy from a branch**.
- Branche : **main**.
- Dossier : **/(root)**.
- Enregistrer.

Adresse prévue après publication : `https://bm-ece.github.io/linux-nexus-preview/` (à vérifier dans GitHub Pages).

## Séparation des données étudiantes

Les deux URLs sont sur la même origine `https://bm-ece.github.io`. Le `localStorage` est donc partagé entre les deux chemins.

L'application de développement choisit :

- `linux_nexus_complete_2026` sur `/linux-nexus/` (clé historique conservée).
- `linux_nexus_preview_complete_2026` sur `/linux-nexus-preview/` (clé distincte).

Ne jamais remplacer les données de production par celles de la preview. Tester le comportement dans le navigateur avant de déclarer la recette terminée.

## État de réalisation

- [x] Branche `develop/multicourse-platform` créée dans le dépôt source.
- [x] Dépôt public `bm-ece/linux-nexus-preview` créé.
- [x] Première copie de `index.html`, `assets/favicon.svg` et `assets/ece-logo.jpg` publiée dans le dépôt de test.
- [x] Workflows de synchronisation inter-dépôts supprimés ; aucun jeton ni secret requis.
- [ ] Vérifier **Settings → Pages → Deploy from a branch → main → /(root)**.
- [ ] Vérifier l'URL publique de la preview sur PC et téléphone.
- [ ] Tester l'isolation de la progression et les fonctionnalités de la plateforme.
- [ ] Poursuivre la migration modulaire par petits commits, puis republier les fichiers sur le dépôt de test.

**Règle :** ne jamais fusionner dans la branche `main` de `bm-ece/linux-nexus` sans autorisation explicite.

## Convention des chemins multi-matières (décision validée)

**Attention :** les chemins `/linux-nexus/` de ce tableau sont ceux de la phase de migration, avant le renommage final en `/ece-learn/`. La convention des sous-chemins par matière reste identique.

La racine de chaque site est le **portail** ; les cours utilisent des sous-dossiers avec un véritable `index.html` statique :

| Usage | Preview | Production cible |
| --- | --- | --- |
| Portail | `/linux-nexus-preview/` | `/linux-nexus/` |
| Linux | `/linux-nexus-preview/linux/` | `/linux-nexus/linux/` |
| Notion Linux 12 | `/linux-nexus-preview/linux/?view=learn&notion=12` | `/linux-nexus/linux/?view=learn&notion=12` |
| Réseaux (futur) | `/linux-nexus-preview/networks/` | `/linux-nexus/networks/` |

**Option B :** ne pas conserver les anciennes URL pédagogiques `/?view=learn&notion=12`, ni ajouter de redirection. La racine ignore ces paramètres et reste le portail. Les chemins Réseaux ne seront publiés que lorsque le cours sera prêt.

Avant validation : vérifier l'accès direct, le rafraîchissement, les liens internes et le chargement des ressources depuis les sous-dossiers. Les entrées statiques chargent les mêmes services et composants partagés, sans copie de l'application.

**Attention au stockage :** les deux sites partagent l'origine `bm-ece.github.io`. La détection de l'environnement doit rester correcte sur **tous les sous-chemins** (`/linux-nexus-preview/linux/`, etc.). Isoler ensuite les données de progression par matière ; préserver la progression Linux enregistrée. La suppression de la compatibilité des **URL** ne justifie jamais de supprimer la compatibilité des **données**.

### Contrôles spécifiques avant le renommage final

- Confirmer la disponibilité et la configuration GitHub Pages de `ece-learn`, ainsi que les éventuels impacts des redirections GitHub liées au renommage de dépôt ; ne pas supposer que les anciennes URL Pages fonctionneront.
- Tester le portail cible `/ece-learn/`, le cours `/ece-learn/linux/` et les liens profonds avec rechargement, scripts, CSS et médias.
- Vérifier que la progression historique `linux_nexus_complete_2026` reste lisible : **ne pas renommer automatiquement les clés localStorage avec le dépôt**. Tester l'isolation Preview/production après changement de chemins.
- Préserver l'option B : aucune compatibilité ajoutée pour les anciennes URL pédagogiques ; traiter séparément les conséquences du changement d'adresse publique.
- Ne renommer ni le dépôt source, ni le dépôt Preview, ni la production sans autorisation explicite et recette préalable.

### Procédure pour chaque changement structurel

1. Commit sur `develop/multicourse-platform` seulement ; vérifier la CI.
2. Copier les fichiers statiques nécessaires dans `bm-ece/linux-nexus-preview/main`, en conservant leurs chemins relatifs.
3. Vérifier le déploiement GitHub Pages puis tester les URL exactes sur Preview, notamment les accès directs et les rechargements.
4. Comparer rendu, navigation, fiches, quiz, laboratoires, terminal, simulateurs et progression au site de référence.
5. Ne modifier `bm-ece/linux-nexus/main` qu'après autorisation explicite du propriétaire.
