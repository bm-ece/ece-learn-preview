# Inventaire technique initial — Linux Nexus

## Périmètre inspecté

- Branche source : `develop/multicourse-platform`.
- Application statique sans framework, hébergée sur GitHub Pages.
- Avant extraction : `index.html` contenait une unique balise `<style>` de **20 277 caractères**, ainsi qu'un
  script JavaScript inline contenant les données pédagogiques et la logique interactive.
- Les ressources utilisées directement par le HTML comprennent `assets/favicon.svg` et `assets/ece-logo.jpg`.
- Le contenu Linux comprend **79 notions** regroupées en **7 domaines**, **7 laboratoires**, un terminal simulé, des simulateurs, des quiz et un suivi de progression.

## Persistance

Une seule clé principale est utilisée par le script : `linux_nexus_complete_2026` en production. Les données
incluent `done`, `labDone`, `labStarted`, `attempts` et `fs`. Sur le chemin `/linux-nexus-preview/`, le code
utilise `linux_nexus_preview_complete_2026` pour éviter de modifier la progression de production sur l'origine
commune `bm-ece.github.io`.

## Première extraction CSS

- Fichier créé : `css/styles.css`, copie **exacte** du contenu de l'ancienne balise `<style>` (sans réécriture ni changement des règles).
- `index.html` référence désormais `<link rel="stylesheet" href="css/styles.css">`.
- Tout le reste du document HTML a été conservé à l'identique lors de cette extraction.
- Les deux fichiers ont été copiés dans `bm-ece/linux-nexus-preview` sur sa branche `main` afin de déclencher la publication GitHub Pages classique.

## Contrôles et risques

- [x] Vérification structurelle : une seule balise `<style>` initiale et extraction exacte.
- [x] Vérification structurelle : HTML inchangé hors remplacement de la balise CSS.
- [x] Fichiers `css/styles.css` et `index.html` publiés dans le dépôt Preview.
- [ ] Vérification visuelle sur PC et mobile (comparaison avec le site officiel).
- [ ] Vérifier chargement réseau de `css/styles.css` et absence d'erreurs console.
- [ ] Tester les 79 notions, les cinq cartes pédagogiques, les 7 laboratoires, le terminal, les simulateurs et la sauvegarde.
- [ ] Relever les tests automatisés et workflows existants dans le dépôt source.
- [ ] Préparer l'extraction progressive du JavaScript **après** validation visuelle.

## Règles de migration

Ne pas modifier le design, le logo, le favicon, la disposition en deux colonnes ou les fonctionnalités pendant les
extractions techniques. Ne pas fusionner vers `main` du dépôt source sans accord explicite.

## Deuxième extraction : JavaScript de l'application

- Le script inline unique a été copié **à l'identique** vers `js/app.js` (**104 209 caractères**).
- La balise `<script>` d'origine a été remplacée au même emplacement en fin de document par `<script src="js/app.js"></script>`.
- Le script reste un **script classique**, sans `async`, `defer` ni `type="module"`, afin de conserver l'ordre d'exécution et le fonctionnement des déclarations globales.
- Aucune fonction, donnée pédagogique, route ou clé de progression n'a été volontairement modifiée pendant cette extraction.
- Les fichiers `js/app.js` et `index.html` ont été publiés sur `bm-ece/linux-nexus-preview/main`.
- [ ] Vérifier le chargement HTTP de `js/app.js`, l'absence d'erreurs JavaScript et le fonctionnement interactif sur le site Preview.

La séparation en modules plus petits sera entreprise **après** validation de cette étape.

## Troisième extraction : données pédagogiques Linux

- `js/data/linux.js` contient désormais la déclaration `const DATA` originale (**20 701 caractères**, sans modification des données).
- `js/app.js` conserve les fonctions de l'application et commence par `const COMMANDS=DATA.commands, PARTS=DATA.parts`.
- `index.html` charge les deux **scripts classiques synchrones**, dans cet ordre : `js/data/linux.js` puis
  `js/app.js`. Les déclarations lexicales globales restent accessibles entre scripts classiques exécutés dans le
  même environnement JavaScript.
- Le site Preview a reçu les trois fichiers sur sa branche `main` ; aucun changement sur `main` du dépôt officiel.
- [ ] Contrôle navigateur : chargement des deux scripts, navigation, notions, quiz, terminal, laboratoires, simulateurs et progression.

La prochaine étape peut isoler les laboratoires ou les services de progression, après validation fonctionnelle de cette extraction.
