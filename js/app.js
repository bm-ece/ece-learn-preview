
const DATA=window.ECE_LINUX_DATA;
if(!DATA || !Array.isArray(DATA.commands) || !Array.isArray(DATA.parts)) throw new Error('Linux teaching data failed to load');
const COMMANDS=DATA.commands, PARTS=DATA.parts;
const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const persisted=window.ECE_STORAGE.load();
const state={
  view:'home',
  active:0,
  domain:-1,
  search:'',
  lessonTab:'learn',
  done:new Set(persisted.done||[]),
  labDone:new Set(persisted.labDone||[]),
  labStarted:new Set([...(persisted.labStarted||[]),...(persisted.labDone||[])]),
  attempts:persisted.attempts||{},
  cwd:'/home/student',
  fs:null,
  history:[],
  histCursor:0,
  termLog:'Bienvenue dans ECE Learn Linux. Tape help pour voir les commandes prises en charge.\n',
  lab:0,
  quizSelection:-1,
  quizFeedback:'',
  lastOutput:'',
  scriptOutput:'',
  scriptSource:'#!/usr/bin/env bash\n# Script de découverte\nNOM=Linux\necho "Bonjour $NOM"\nfor x in 1 2 3; do\n  echo "Étape $x"\ndone',
  sim:'process',
  simTick:0
};
const initialFS=window.ECE_LINUX_INITIAL_FS;
if(!initialFS || !initialFS['/home/student']) throw new Error('Terminal initial filesystem failed to load');
// Restauration des fichiers enregistrés dans le profil local, sans effacer les exercices.
if(persisted.fs && typeof persisted.fs==='object' && !Array.isArray(persisted.fs)){
  const migrated={};
  for(const [oldPath,oldNode] of Object.entries(persisted.fs)){
    const path=oldPath.replace(/^\/home\/alex(?=\/|$)/,'/home/student');
    const node=oldNode && typeof oldNode==='object' ? {...oldNode} : oldNode;
    if(node && typeof node.text==='string')node.text=node.text.replaceAll('/home/alex','/home/student').replace(/\balex\b/g,'student');
    if(!Object.prototype.hasOwnProperty.call(migrated,path) || path===oldPath)migrated[path]=node;
  }
  persisted.fs=migrated;
}
state.fs=JSON.parse(JSON.stringify(persisted.fs||initialFS));
function save() {
  window.ECE_STORAGE.save({
    done: [...state.done],
    labDone: [...state.labDone],
    labStarted: [...state.labStarted],
    attempts: state.attempts,
    fs: state.fs
  });
  const n = window.ECE_PROGRESS.summary(state, COMMANDS.length).notions;
  document.getElementById('status').innerHTML = `<span class="status-item"><span class="status-value">${n}/${COMMANDS.length}</span> notions validées</span>` +
    `<span class="status-divider" aria-hidden="true"></span>` +
    `<span class="status-item"><span class="status-value">${state.labDone.size}/7</span> labs réussis</span>` +
    `<span class="status-divider" aria-hidden="true"></span>` +
    `<span class="status-item status-xp"><span class="status-value">${window.ECE_PROGRESS.summary(state, COMMANDS.length).xp}</span> XP</span>`;
}
const NAV=[
  ['home','⌂','Accueil'],
  ['catalog','▦','Bibliothèque'],
  ['terminal','⌘','Terminal'],
  ['labs','⚗','Laboratoires'],
  ['sim','◈','Simulateurs'],
  ['bash','{ }','Atelier Bash'],
  ['progress','◉','Progression']
];
// Routage extrait vers js/routing.js.

function card(c,i){
  return `<article class="card"><span class="tag">P${c.part+1} · ${state.done.has(i)?'✓ MAÎTRISÉ':'À DÉCOUVRIR'}</span>` +
    `<h3>${esc(c.name)}</h3>` +
    `<p class="muted">${esc(c.desc)}</p>` +
    `<div class="code">${esc(c.example)}</div>` +
    `<div class="actions"><button data-learn="${i}" class="primary">Comprendre et pratiquer →</button></div></article>`;
}
function learningPath(){
  const steps=PARTS.map((part,i)=>{
    const indices=COMMANDS.map((cmd,j)=>cmd.part===i?j:-1).filter(j=>j>=0);
    const done=indices.filter(j=>state.done.has(j)).length;
    const total=indices.length;
    const labDone=state.labDone.has(i);
    const finished=done===total&&labDone;
    const started=done>0||labDone;
    const next=indices.find(j=>!state.done.has(j))??indices[0];
    const klass=finished?'complete':started?'partial':'';
    const status=finished?'Étape terminée':done===total?'Laboratoire à terminer':started?'En cours':'À commencer';
    return `<article class="path-step ${klass}"><span class="path-status">${status}</span>` +
    `<span class="tag">ÉTAPE ${i+1}</span>` +
    `<h3>${esc(part.title)}</h3>` +
    `<div class="path-bottom"><p class="path-notions">Notions validées : ${done} / ${total}</p>` +
    `<div class="progress" role="progressbar" aria-label="Notions validées dans le domaine ${i+1}" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${done}"><div style="width:${total?Math.round(100*done/total):0}%"></div></div>` +
    `<button class="path-lab" data-lab="${i}" aria-label="Ouvrir le laboratoire du domaine ${i+1}, ${labDone?'validé':'à valider'}"><span>⚗ Laboratoire</span><span>${labDone?'✓ 1 / 1':'0 / 1'} →</span></button>` +
    `<button data-learn="${next}">${done===total?'Revoir le module':'Continuer le parcours →'}</button>` +
    `</div></article>`;
  }).join('');
  return `<section aria-label="Parcours pédagogique"><div class="path-head"><h2>Ton parcours Linux</h2></div>` +
    `<p class="muted">Avance de module en module. Chaque étape comprend des notions à pratiquer et un laboratoire à réussir.</p>` +
    `<div class="path-track">${steps}</div></section>`;
}
function home(){
  return `<div class="hero"><div class="eyebrow">EXPLORE · COMPRENDS · EXPÉRIMENTE</div><h1>Linux s'apprend<br><span style="color:var(--cyan)">en le pratiquant.</span></h1>` +
    `<p class="muted" style="max-width:670px">Un véritable parcours d'entraînement : découvre pourquoi une commande existe, lis un exemple expliqué, exécute-la dans un laboratoire isolé, résous des enquêtes et mesure ta progression. Construit à partir des compétences du cours Operating Systems: Linux.</p>` +
    `<div class="actions"><button class="primary" data-nav="catalog">Explorer les ${COMMANDS.length} notions →</button>` +
    `<button data-nav="labs">Lancer un laboratoire</button>` +
    `<button data-nav="terminal">Ouvrir le terminal</button></div></div>${learningPath()}<div class="grid"><div class="card"><div class="big">${COMMANDS.length}</div><span class="muted">fiches de commandes et mécanismes</span></div>` +
    `<div class="card"><div class="big">${state.done.size}</div><span class="muted">fiches validées</span><div class="progress"><div style="width:${state.done.size/COMMANDS.length*100}%"></div></div></div>` +
    `<div class="card"><div class="big">${state.labDone.size}/7</div><span class="muted">laboratoires résolus</span></div></div>` +
    `<h2>Choisir un premier défi</h2>` +
    `<div class="grid"><div class="card"><div class="iconbox">📂</div><h3>Je découvre les fichiers</h3><p class="muted">Chemins, répertoires, fichiers et métadonnées.</p>` +
    `<button data-learn="1">Commencer avec ls →</button></div>` +
    `<div class="card"><div class="iconbox">🔎</div><h3>J'enquête sur des erreurs</h3><p class="muted">grep, wc, pipes et journaux.</p>` +
    `<button data-lab="1">Enquête logs →</button></div>` +
    `<div class="card"><div class="iconbox">🛡️</div><h3>Je sécurise un dossier</h3><p class="muted">Comprendre rwx, chmod et les groupes.</p>` +
    `<button data-lab="4">Laboratoire permissions →</button></div></div>`;
}
function catalog(){
  return `<div class="hero"><div class="eyebrow">BIBLIOTHÈQUE INTERACTIVE</div><h1>Comprendre chaque commande.</h1>` +
    `<p class="muted">Les fiches commencent par le rôle de la commande, puis présentent un exemple, un piège et un exercice. Recherche une notion et choisis ton domaine.</p>` +
    `<div class="grid"><input id="search" placeholder="Rechercher : grep, permissions, mémoire, fork..." value="${esc(state.search)}" aria-label="Rechercher une commande"><select id="domainselect" aria-label="Filtrer par domaine"><option value="-1">Tous les domaines</option>${PARTS.map((p,i)=>`<option value="${i}" ${state.domain===i?'selected':''}>P${i+1} · ${esc(p.title)}</option>`).join('')}</select></div></div>` +
    `<p id="count" class="muted small"></p>` +
    `<div class="grid" id="cards"></div>`;
}
function filterCards(){
  let q=state.search.toLocaleLowerCase();
  let list=COMMANDS.map((c,i)=>({...c,i}))
    .filter(c=>(state.domain===-1||c.part===state.domain)&&(`${c.name} ${c.desc} ${c.tip} ${c.example}`).toLocaleLowerCase().includes(q));
  $('count').textContent=`${list.length} notions affichées sur ${COMMANDS.length}`;
  $('cards').innerHTML=list.length
    ?list.map(c=>card(c,c.i)).join('')
    :'<div class="card">Aucune notion trouvée. Essaie un autre terme.</div>';
}
const concepts=[
  ['Architecture & POSIX','Une application utilise des fonctions de bibliothèque et des appels système pour accéder aux ressources. Le noyau arbitre les accès au matériel. POSIX spécifie des interfaces communes à de nombreux systèmes Unix.'],
  ['Pipelines & descripteurs','stdin (0) est l’entrée, stdout (1) la sortie normale et stderr (2) la sortie d’erreur. Le pipe relie stdout d’une commande à stdin de la suivante ; les redirections changent la destination des flux.'],
  ['Scripts fiables','Les scripts Bash combinent variables, arguments, tests, boucles, fonctions et codes de retour. La robustesse exige de contrôler les erreurs et de tester les cas limites.'],
  ['Processus & appels système','fork crée un processus fils ; exec remplace son image de programme ; wait permet au parent de récupérer le statut d’un fils. Un signal notifie un processus.'],
  ['Inodes & permissions','Un inode décrit un objet du système de fichiers. Les répertoires associent des noms à des inodes. Les droits rwx sont évalués pour propriétaire, groupe et autres.'],
  ['Mémoire virtuelle','Chaque processus voit un espace d’adresses virtuelles. Les tables de pages permettent la traduction vers la mémoire physique ; le cache et le swap influencent la performance.'],
  ['Réseau & isolation','Les routes déterminent la destination des paquets, DNS résout des noms, systemd supervise des services. Les conteneurs isolent des processus mais partagent le noyau de l’hôte.']
];
const lessonConcepts = [
  [
    "Répertoire courant",
    "Cette notion concerne répertoire courant. Affiche le répertoire courant. Repère où tu te trouves avant toute opération."
  ],
  [
    "Arborescence et métadonnées",
    "Cette notion concerne arborescence et métadonnées. Liste les fichiers et dossiers ; -l affiche les métadonnées, -a les fichiers cachés. Un fichier caché commence par un point."
  ],
  [
    "Chemins absolus et relatifs",
    "Cette notion concerne chemins absolus et relatifs. Change de répertoire ; .. remonte d’un niveau, ~ désigne le domicile. Le chemin absolu commence par / ; le chemin relatif part du dossier courant."
  ],
  [
    "Copie et destination",
    "Cette notion concerne copie et destination. Copie un fichier ; -r copie récursivement un répertoire. La copie conserve la source et crée une destination."
  ],
  [
    "Renommage et déplacement",
    "Cette notion concerne renommage et déplacement. Déplace ou renomme un fichier. Attention : un fichier destination peut être remplacé."
  ],
  [
    "Suppression et liens",
    "Cette notion concerne suppression et liens. Supprime un fichier ; -r supprime un dossier et son contenu. En Linux, rm ne passe généralement pas par une corbeille."
  ],
  [
    "Création de répertoires",
    "Cette notion concerne création de répertoires. Crée un répertoire ; -p crée aussi les parents absents. Pratique pour préparer une arborescence de TP."
  ],
  [
    "Horodatages",
    "Cette notion concerne horodatages. Crée un fichier vide ou met à jour son horodatage. La commande ne modifie pas le contenu d’un fichier existant."
  ],
  [
    "Lecture sur stdout",
    "Cette notion concerne lecture sur stdout. Affiche ou concatène des fichiers texte. Pour de longs fichiers, utiliser plutôt less."
  ],
  [
    "Type et contenu",
    "Cette notion concerne type et contenu. Identifie le type probable d’un fichier en analysant son contenu. L’extension seule ne suffit pas à déterminer un type."
  ],
  [
    "Inodes et attributs",
    "Cette notion concerne inodes et attributs. Présente les métadonnées : taille, inode, permissions et dates. Distinguer taille du fichier et espace disque occupé."
  ],
  [
    "Occupation disque",
    "Cette notion concerne occupation disque. Mesure l’espace occupé par des fichiers ou dossiers. du mesure l’utilisation des fichiers, pas l’espace libre du volume."
  ],
  [
    "Systèmes de fichiers montés",
    "Cette notion concerne systèmes de fichiers montés. Affiche l’espace total, utilisé et disponible des systèmes montés. df et du peuvent différer selon les fichiers ouverts ou les réservations."
  ],
  [
    "Documentation Unix",
    "Cette notion concerne documentation unix. Ouvre la documentation de référence d’une commande. Les sections de man distinguent commandes, appels système, formats, etc."
  ],
  [
    "Options de programme",
    "Cette notion concerne options de programme. Affiche l’aide rapide intégrée à de nombreuses commandes. Le support de --help dépend du programme."
  ],
  [
    "Expressions régulières",
    "Cette notion concerne expressions régulières. Filtre les lignes correspondant à un motif ; -i ignore la casse, -n numérote. grep cherche des lignes, pas des colonnes."
  ],
  [
    "Champs délimités",
    "Cette notion concerne champs délimités. Extrait des champs ; -d choisit le séparateur, -f les colonnes. cut fonctionne bien avec un séparateur simple."
  ],
  [
    "Ordre lexicographique et numérique",
    "Cette notion concerne ordre lexicographique et numérique. Trie les lignes ; -n pour les nombres, -r pour l’ordre inverse. Un tri alphabétique n’est pas un tri numérique."
  ],
  [
    "Doublons adjacents",
    "Cette notion concerne doublons adjacents. Regroupe les lignes identiques consécutives ; -c compte. Pour compter les occurrences globales, trier avant uniq."
  ],
  [
    "Lignes mots et octets",
    "Cette notion concerne lignes mots et octets. Compte les lignes (-l), mots (-w) ou octets (-c). wc -l compte les caractères de fin de ligne."
  ],
  [
    "Enregistrements et champs",
    "Cette notion concerne enregistrements et champs. Traite des enregistrements et colonnes ; $1 est le premier champ. awk sait aussi effectuer des calculs et des conditions."
  ],
  [
    "Substitution dans un flux",
    "sed applique des transformations à chaque ligne du flux ; sans option -i, le résultat est écrit sur stdout et le fichier source reste intact."
  ],
  [
    "Duplication de stdout",
    "tee lit stdin puis écrit simultanément sur stdout et dans un fichier ; l’option -a ajoute les données au lieu de les écraser."
  ],
  [
    "Construction d’arguments",
    "Cette notion concerne construction d’arguments. Transforme des lignes d’entrée en arguments de commandes. xargs transforme des éléments reçus sur stdin en arguments."
  ],
  [
    "Connexion de processus",
    "Un pipeline transmet stdout du processus de gauche à stdin de celui de droite ; stderr reste distinct."
  ],
  [
    "Écrasement de stdout",
    "La redirection > remplace le contenu du fichier cible par la sortie standard de la commande."
  ],
  [
    "Ajout à un fichier",
    "La redirection >> conserve le contenu existant et écrit les nouveaux octets à la fin."
  ],
  [
    "Séparation des flux",
    "2> redirige stderr, descripteur 2, sans rediriger automatiquement stdout."
  ],
  [
    "Interpréteur de script",
    "Cette notion concerne interpréteur de script. Déclare l’interpréteur d’un script en première ligne. Le shebang ne remplace pas la permission d’exécution."
  ],
  [
    "Expansion et citation",
    "Cette notion concerne expansion et citation. Stocke une valeur sans espace autour du signe =. Les guillemets protègent les espaces lors de l’expansion."
  ],
  [
    "Paramètres positionnels",
    "Cette notion concerne paramètres positionnels. Accède aux arguments d’un script : premier, tous, nombre. Préférer \"$@\" pour transmettre les arguments sans les fusionner."
  ],
  [
    "Statut de sortie",
    "Cette notion concerne statut de sortie. Contient le code de sortie de la dernière commande ; 0 signifie succès. Lire $? immédiatement avant d’exécuter une autre commande."
  ],
  [
    "Conditions Bash",
    "Cette notion concerne conditions bash. Exécute une branche selon le statut d’une condition. Les espaces autour des crochets [ ] sont obligatoires."
  ],
  [
    "Itération sur une liste",
    "Cette notion concerne itération sur une liste. Répète des instructions pour chaque valeur d’une liste. Bien citer les variables pour les noms avec espaces."
  ],
  [
    "Boucles conditionnelles",
    "Cette notion concerne boucles conditionnelles. Répète tant qu’une condition est vraie (while) ou fausse (until). Éviter les boucles sans condition d’arrêt."
  ],
  [
    "Réutilisation de code",
    "Cette notion concerne réutilisation de code. Regroupe des instructions réutilisables dans un script. Les variables sont globales sauf si local est utilisé."
  ],
  [
    "Gestion stricte des erreurs",
    "Cette notion concerne gestion stricte des erreurs. Demande à Bash de sortir sur certaines erreurs et variables non définies. set -e a des exceptions contextuelles ; tester ses scripts."
  ],
  [
    "Nettoyage et signaux",
    "Cette notion concerne nettoyage et signaux. Déclenche un nettoyage à la réception d’un signal ou à la sortie. Utile pour supprimer les fichiers temporaires."
  ],
  [
    "Traçage Bash",
    "Cette notion concerne traçage bash. Affiche les commandes au fur et à mesure de leur exécution. Le traçage peut exposer des secrets dans les logs."
  ],
  [
    "Planification périodique",
    "Cette notion concerne planification périodique. Planifie l’exécution répétée d’une tâche via une crontab. Les cinq champs représentent minute, heure, jour, mois, jour semaine."
  ],
  [
    "Identifiants de processus",
    "Cette notion concerne identifiants de processus. Affiche un instantané des processus et leurs PID. PID identifie un processus ; PPID son parent."
  ],
  [
    "Mesures en temps réel",
    "Cette notion concerne mesures en temps réel. Affiche périodiquement la charge CPU et les processus. La consommation CPU varie dans le temps."
  ],
  [
    "Interface de supervision",
    "Cette notion concerne interface de supervision. Visualise interactivement les processus (si installé). htop n’est pas toujours présent par défaut."
  ],
  [
    "Signaux et terminaison",
    "Cette notion concerne signaux et terminaison. Envoie un signal à un processus ; -TERM demande l’arrêt, -KILL le force. SIGKILL ne permet pas au processus de nettoyer ses ressources."
  ],
  [
    "Contrôle des jobs",
    "Cette notion concerne contrôle des jobs. Liste les tâches gérées par le shell courant. Un job du shell n’est pas la même chose qu’un service systemd."
  ],
  [
    "Premier plan et arrière-plan",
    "Cette notion concerne premier plan et arrière-plan. Reprend un job suspendu en arrière-plan ou au premier plan. Ctrl+Z suspend une tâche interactive."
  ],
  [
    "Cycle de vie des processus",
    "Cette notion concerne cycle de vie des processus. fork crée un processus fils, exec remplace son image, wait attend sa fin. Ce sont des interfaces système, pas des commandes shell ordinaires."
  ],
  [
    "Interface noyau–utilisateur",
    "Cette notion concerne interface noyau–utilisateur. Trace les appels système et leurs retours. Les appels openat, read, write et close expliquent les E/S."
  ],
  [
    "Effets des signaux",
    "Cette notion concerne effets des signaux. SIGTERM demande l’arrêt, SIGSTOP suspend, SIGCONT reprend. SIGSTOP et SIGKILL ne sont pas interceptables."
  ],
  [
    "Permissions Unix",
    "Cette notion concerne permissions unix. Modifie les permissions rwx ; 750 signifie rwx r-x --- . La permission x sur un dossier permet de le traverser."
  ],
  [
    "Propriété des fichiers",
    "Cette notion concerne propriété des fichiers. Change le propriétaire d’un fichier (souvent réservé à root). Ne pas confondre propriétaire et groupe."
  ],
  [
    "Groupes Unix",
    "Cette notion concerne groupes unix. Change le groupe propriétaire d’un fichier. L’appartenance au groupe conditionne les droits applicables."
  ],
  [
    "Permissions à la création",
    "Cette notion concerne permissions à la création. Définit les bits de permission retirés lors des créations. Pour un fichier, la base habituelle est 666 ; pour un dossier 777."
  ],
  [
    "Liens et inodes",
    "Cette notion concerne liens et inodes. Crée un lien physique ; -s crée un lien symbolique. Le lien physique partage l’inode ; le lien symbolique référence un chemin."
  ],
  [
    "Points de montage",
    "Cette notion concerne points de montage. Monte un système de fichiers dans l’arborescence. Le montage relie un périphérique ou FS à un point de montage."
  ],
  [
    "Démontage sécurisé",
    "Cette notion concerne démontage sécurisé. Démonte un système de fichiers. Le démontage peut échouer si le système est occupé."
  ],
  [
    "Disques et partitions",
    "Cette notion concerne disques et partitions. Affiche les périphériques bloc et leurs partitions. Un disque n’est pas forcément monté."
  ],
  [
    "Montages persistants",
    "Cette notion concerne montages persistants. Décrit les montages persistants dans /etc/fstab. Une erreur dans fstab peut gêner le démarrage."
  ],
  [
    "Interfaces virtuelles du noyau",
    "Cette notion concerne interfaces virtuelles du noyau. Pseudo-systèmes exposant processus, noyau et périphériques. Ces chemins ne sont pas des répertoires de données ordinaires."
  ],
  [
    "Mémoire disponible",
    "Cette notion concerne mémoire disponible. Résume l’utilisation de la RAM et du swap. La colonne available est souvent plus utile que free."
  ],
  [
    "Activité mémoire et E/S",
    "Cette notion concerne activité mémoire et e/s. Présente processus, mémoire, swap, E/S et CPU. Observer si et so (swap in/out) pour détecter l’activité swap."
  ],
  [
    "Moyenne de charge",
    "Cette notion concerne moyenne de charge. Affiche durée de fonctionnement et charge moyenne. Le load average n’est pas un pourcentage de CPU."
  ],
  [
    "Compteurs mémoire du noyau",
    "Cette notion concerne compteurs mémoire du noyau. Expose les statistiques détaillées de mémoire. MemAvailable estime la RAM disponible pour de nouvelles tâches."
  ],
  [
    "Processeurs logiques",
    "Cette notion concerne processeurs logiques. Expose des informations sur les processeurs logiques. Les champs peuvent varier selon l’architecture."
  ],
  [
    "Cartographie mémoire virtuelle",
    "Cette notion concerne cartographie mémoire virtuelle. Décrit les régions mémoire virtuelles d’un processus. Les adresses sont virtuelles, non directement physiques."
  ],
  [
    "Paramètres noyau",
    "Cette notion concerne paramètres noyau. Consulte ou règle des paramètres du noyau. Les changements de réglages système peuvent être sensibles."
  ],
  [
    "Adresses réseau",
    "Cette notion concerne adresses réseau. Affiche les interfaces et leurs adresses IP. Une interface peut être UP sans accès Internet."
  ],
  [
    "Table de routage",
    "Cette notion concerne table de routage. Affiche les routes et la passerelle par défaut. Une route par défaut indique où envoyer les destinations inconnues."
  ],
  [
    "ICMP et diagnostic",
    "Cette notion concerne icmp et diagnostic. Teste l’accessibilité ICMP et mesure des délais. Un ping bloqué ne prouve pas forcément une panne réseau."
  ],
  [
    "Sockets et ports",
    "Cette notion concerne sockets et ports. Affiche les sockets et ports d’écoute. Un port en écoute ne garantit pas l’accès depuis l’extérieur."
  ],
  [
    "Sauts IP et TTL",
    "Cette notion concerne sauts ip et ttl. Présente les sauts réseau vers une destination. Certains routeurs ne répondent pas aux sondes."
  ],
  [
    "Enregistrements DNS",
    "Cette notion concerne enregistrements dns. Interroge le DNS et présente les enregistrements. Le DNS traduit un nom en données, pas seulement en IPv4."
  ],
  [
    "Résolution de noms",
    "Cette notion concerne résolution de noms. Effectue des requêtes DNS simples. dig fournit généralement davantage de détails."
  ],
  [
    "Authentification distante",
    "Cette notion concerne authentification distante. Ouvre une session distante chiffrée. Les clés SSH permettent une authentification sans mot de passe."
  ],
  [
    "Unités systemd",
    "Cette notion concerne unités systemd. Contrôle les unités et services systemd. Le nom exact du service varie selon la distribution."
  ],
  [
    "Journaux structurés",
    "Cette notion concerne journaux structurés. Lit les journaux de systemd. Utiliser -f pour suivre les nouvelles entrées."
  ],
  [
    "Isolation par conteneurs",
    "Cette notion concerne isolation par conteneurs. Gère images et conteneurs lorsque Docker est installé. Un conteneur partage le noyau de l’hôte."
  ],
  [
    "Outils pour systèmes embarqués",
    "Cette notion concerne outils pour systèmes embarqués. Regroupe des utilitaires Unix compacts pour systèmes embarqués. BusyBox peut offrir moins d’options que les outils GNU."
  ],
  [
    "Construction de Linux embarqué",
    "Cette notion concerne construction de linux embarqué. Génère des images Linux pour systèmes embarqués. Buildroot est un outil de construction, pas un gestionnaire de paquets."
  ]
];
const lessonExplanations = [
  "pwd affiche le chemin absolu du répertoire de travail du shell. Après un cd, relance pwd pour vérifier ta position.",
  "ls affiche les entrées d’un répertoire. -l détaille les droits, propriétaires et tailles ; -a inclut les noms commençant par un point.",
  "cd change le répertoire courant du shell. cd sans argument revient au domicile, cd .. remonte et cd / utilise la racine.",
  "cp duplique une source vers une destination. La source reste intacte ; pour une arborescence, Linux utilise cp -r.",
  "mv renomme ou déplace un fichier sans conserver de copie à l’emplacement initial. Vérifie la destination avant validation.",
  "rm supprime les entrées sélectionnées. -r descend dans les répertoires : contrôler le chemin est indispensable avant toute suppression.",
  "mkdir crée un dossier. L’option -p crée aussi les répertoires parents manquants et accepte un chemin déjà existant.",
  "touch crée un fichier vide s’il n’existe pas ; sinon, il actualise normalement ses horodatages sans modifier son contenu.",
  "cat lit et concatène des fichiers vers la sortie standard. Un pipe permet de transmettre ce texte à une autre commande.",
  "file examine les signatures et le contenu pour estimer le type d’un fichier ; son nom ou son extension ne suffisent pas.",
  "stat fournit les informations du système de fichiers : inode, taille, droits, propriétaire et horodatages.",
  "du mesure l’espace réellement occupé par les fichiers et répertoires ; -s résume et -h utilise des unités lisibles.",
  "df décrit la capacité et l’espace libre des systèmes de fichiers montés ; -h rend les tailles lisibles.",
  "man ouvre les pages de manuel. Utilise man nom_commande pour consulter synopsis, options et codes de retour.",
  "--help est une option fréquente, non une commande autonome : commande --help affiche généralement une aide courte.",
  "grep sélectionne les lignes qui correspondent à une expression régulière. -i ignore la casse, -n ajoute les numéros de ligne.",
  "cut extrait des champs de chaque ligne. -d définit le délimiteur et -f choisit les champs à conserver.",
  "sort ordonne les lignes d’un flux. -n applique un tri numérique ; -r inverse l’ordre.",
  "uniq compare seulement les lignes voisines. Trie d’abord avec sort pour regrouper toutes les occurrences identiques ; -c les compte.",
  "wc compte lignes, mots et octets. -l sélectionne les lignes ; attention à la différence entre caractères et octets.",
  "awk traite chaque ligne comme un enregistrement et permet d’accéder aux champs avec $1, $2, etc. -F définit le séparateur.",
  "sed est un éditeur de flux : s/ancien/nouveau/g remplace toutes les occurrences sur chaque ligne. Sans -i, le fichier source n’est pas modifié.",
  "tee lit stdin, écrit le même flux sur stdout et dans un fichier. -a ajoute au fichier plutôt que de l’écraser.",
  "xargs convertit des données reçues sur stdin en arguments d’une commande. Les noms contenant des espaces demandent un traitement adapté.",
  "Le symbole | relie stdout de la commande de gauche à stdin de celle de droite. stderr n’est pas transmis automatiquement.",
  "Le symbole > redirige stdout vers un fichier et écrase son contenu précédent. Il ne capture pas stderr.",
  "Le symbole >> ajoute stdout à la fin d’un fichier au lieu de remplacer son contenu.",
  "2> redirige uniquement stderr, descripteur 2. stdout continue à s’afficher ou à circuler dans le pipeline.",
  "La ligne #!/usr/bin/env bash indique l’interpréteur d’un script exécutable. Elle doit être placée en première ligne.",
  "Une affectation Bash s’écrit NOM=valeur, sans espace autour de =. Utilise \"$NOM\" pour développer la valeur sans découpage indésirable.",
  "$1 désigne le premier argument, \"$@\" préserve la liste des arguments et $# donne leur nombre.",
  "$? contient le statut de la commande précédente : 0 signifie généralement succès ; une valeur non nulle signale un autre résultat.",
  "if teste le statut d’une commande ou d’un test ; then et else déterminent les branches exécutées.",
  "for parcourt des valeurs successives. Chaque itération affecte la valeur courante à une variable de boucle.",
  "while répète tant que la condition réussit ; until répète jusqu’à ce qu’elle réussisse. Prévois une condition de sortie.",
  "Une fonction Bash nomme un bloc de commandes réutilisable. Elle peut recevoir des arguments positionnels comme un script.",
  "set -e peut interrompre un script après certaines erreurs ; set -u signale les variables non définies. Leur comportement comporte des exceptions.",
  "trap associe une action à EXIT ou à certains signaux, notamment pour nettoyer des fichiers temporaires.",
  "bash -x script.sh ou set -x affiche les commandes après expansion. Évite d’exposer des secrets dans ces traces.",
  "cron déclenche des tâches selon une expression minute, heure, jour, mois et jour de semaine. L’environnement est plus limité qu’un shell interactif.",
  "ps présente un instantané des processus et de leurs identifiants PID. Les options aux ou -ef montrent davantage de colonnes.",
  "top actualise périodiquement l’activité CPU, mémoire et processus ; il sert à repérer les charges anormales.",
  "htop propose une interface interactive de surveillance des processus. Il doit être installé séparément sur de nombreux systèmes.",
  "kill envoie un signal à un PID. SIGTERM demande un arrêt propre ; SIGKILL force l’arrêt sans nettoyage applicatif.",
  "jobs liste les tâches lancées depuis le shell courant, et non tous les processus du système.",
  "bg reprend un job suspendu en arrière-plan ; fg le ramène au premier plan. Ces commandes utilisent les identifiants de jobs du shell.",
  "fork crée un processus fils, exec charge un nouveau programme dans un processus, et wait récupère la fin d’un fils.",
  "strace observe les appels système et leurs résultats. Il est utile pour diagnostiquer accès aux fichiers, processus et erreurs de permissions.",
  "SIGTERM demande une terminaison, SIGSTOP suspend et SIGCONT reprend un processus. Les signaux n’ont pas tous le même traitement.",
  "chmod modifie les droits d’accès. En notation octale, 7=rwx, 5=r-x et 0=--- ; chmod 750 distingue propriétaire, groupe et autres.",
  "chown change le propriétaire d’un fichier. Cette opération exige généralement des privilèges élevés.",
  "chgrp change le groupe associé à un fichier. Les autorisations dépendent des groupes de l’utilisateur.",
  "umask retire des bits de permission lors de la création : elle ne modifie pas rétroactivement les fichiers existants.",
  "ln crée un lien physique vers un inode ; ln -s crée un lien symbolique contenant un chemin cible.",
  "mount attache un système de fichiers à un point de montage existant. Le montage peut nécessiter des privilèges.",
  "umount détache un système de fichiers. Il peut échouer si des processus utilisent encore le point de montage.",
  "lsblk présente les disques, partitions et points de montage sous forme arborescente.",
  "/etc/fstab décrit les montages persistants : périphérique ou UUID, point de montage, type, options et champs de contrôle.",
  "/proc expose des informations sur les processus, /sys sur les objets du noyau et /dev sur les périphériques.",
  "free résume la RAM et le swap. La colonne available estime la mémoire disponible pour de nouvelles applications.",
  "vmstat résume processus, mémoire, swap, entrées/sorties et CPU ; un intervalle permet de suivre leur évolution.",
  "uptime affiche le temps depuis le démarrage et les moyennes de charge sur 1, 5 et 15 minutes.",
  "/proc/meminfo est un fichier virtuel du noyau contenant MemTotal, MemAvailable, SwapTotal et d’autres compteurs.",
  "/proc/cpuinfo expose les caractéristiques des processeurs logiques ; son format varie selon l’architecture.",
  "/proc/PID/maps liste les zones mémoire virtuelles d’un processus : adresses, permissions et fichiers associés.",
  "sysctl lit ou modifie certains paramètres du noyau, souvent exposés sous /proc/sys. Les modifications peuvent être temporaires.",
  "ip addr affiche les interfaces et leurs adresses IPv4 ou IPv6. Il remplace généralement ifconfig sur les systèmes récents.",
  "ip route montre les routes du noyau, dont la route default utilisée en l’absence d’une route plus précise.",
  "ping envoie des requêtes ICMP pour mesurer les réponses et pertes. Un blocage ICMP ne prouve pas qu’un service est inaccessible.",
  "ss affiche les sockets réseau. -tuln aide à repérer les ports TCP et UDP en écoute sans résolution des noms.",
  "traceroute recherche les routeurs traversés vers une destination à l’aide de paquets avec des limites de sauts croissantes.",
  "dig interroge le DNS et affiche les réponses détaillées, types d’enregistrements et serveurs utilisés.",
  "nslookup réalise des requêtes DNS simples pour résoudre un nom ou une adresse.",
  "ssh établit une connexion distante chiffrée. Vérifie l’empreinte du serveur et privilégie l’authentification par clé.",
  "systemctl interroge et pilote les unités systemd, notamment status, start, stop et enable.",
  "journalctl consulte les journaux gérés par systemd ; -u filtre par unité et -f suit les nouveaux messages.",
  "docker gère images et conteneurs. docker ps liste les conteneurs ; docker images liste les images locales.",
  "BusyBox rassemble des versions compactes d’utilitaires Unix dans un seul exécutable, fréquent en environnement embarqué.",
  "Buildroot construit une chaîne d’outils, un noyau et un système de fichiers racine adaptés à une cible embarquée."
];

/* Chaque étape possède une fonction pédagogique distincte ; la grille CSS existante reste inchangée. */
const observedOutputs={
 pwd:'/home/student',whoami:'student',
 'echo':'Le texte fourni après echo est affiché.',
 'ls':'Liste des entrées du dossier demandé.',
 'cd':'Aucune sortie en cas de succès : la position du shell change.',
 'mkdir':'Aucune sortie en cas de succès : le répertoire est créé.',
 'touch':'Aucune sortie en cas de succès : le fichier est créé ou actualisé.',
 'cp':'Aucune sortie en cas de succès : une copie est créée.',
 'mv':'Aucune sortie en cas de succès : la source est déplacée ou renommée.',
 'rm':'Aucune sortie en cas de succès : la cible est supprimée.'
};
function exampleObservation(c,example){
 const head=(example.trim().split(/\s+/)[0]||'').toLowerCase();
 if(head==='pwd')return 'Sortie attendue dans le dossier personnel initial : /home/student. Le chemin change après cd.';
 if(head==='whoami')return 'Sortie attendue dans le simulateur : student.';
 if(head==='cd')return 'Après cette commande, pwd permet de vérifier le nouveau répertoire. cd ne produit normalement aucun texte en cas de succès.';
 if(head==='ls')return 'Observe les noms affichés et, avec -l, les permissions, propriétaires et tailles ; avec -a, les entrées cachées.';
 if(head==='grep')return 'La sortie contient uniquement les lignes qui correspondent au motif recherché, si elles existent.';
 if(head==='sed')return 'Observe les lignes transformées sur stdout : sans -i, le fichier source n’est pas modifié.';
 if(head==='tee'||example.includes(' | tee '))return 'Le flux reste visible dans le terminal et une copie est écrite dans le fichier indiqué.';
 if(head==='cat')return 'Le contenu du fichier demandé apparaît sur la sortie standard.';
 if(head==='sort')return 'Compare l’ordre des lignes avant et après le tri.';
 if(head==='wc')return 'Observe le nombre de lignes, mots ou octets selon les options.';
 if(head==='head'||head==='tail')return 'Seule une partie du fichier apparaît : le début avec head, la fin avec tail.';
 if(head==='echo'||head==='printf')return 'Observe le texte produit sur la sortie standard, avec les règles de formatage de la commande.';
 if(head==='ip'||head==='ss'||head==='ps'||head==='df'||head==='free'||head==='uptime')return 'La sortie présente un état du système ; ses valeurs dépendent de l’environnement exécuté.';
 if(Object.prototype.hasOwnProperty.call(observedOutputs,head))return observedOutputs[head];
 if(example.includes(' | '))return 'Lis le pipeline de gauche à droite : la sortie de chaque étape alimente la suivante.';
 if(example.includes(' >'))return 'La redirection envoie le flux vers le fichier indiqué plutôt que vers l’écran.';
 return 'Repère les options et arguments dans cet exemple ; observe son effet dans un environnement Linux adapté.';
}

const learningOverrides={
 pwd:{concept:'Le répertoire courant est la position du shell dans l’arborescence ; pwd en affiche le chemin absolu.',
    observe:'Dans le dossier personnel, pwd affiche /home/student. Après cd /tmp, il affiche /tmp.',
    mission:'Tu viens d’ouvrir un terminal : affiche le chemin absolu du dossier où tu te trouves.',
    retain:'pwd affiche ta position ; cd la modifie ; ls liste les fichiers du dossier.',
    quiz:['Affiche le chemin du répertoire courant.','Change le répertoire courant.','Liste les fichiers du répertoire courant.','Affiche le contenu d’un fichier.']},
 ls:{concept:'Un répertoire contient des entrées ; -a révèle les noms cachés et -l affiche les métadonnées.',
    mission:'Inspecte /etc en affichant aussi les fichiers cachés et les détails des entrées.',
    retain:'ls affiche les entrées ; pwd affiche la position ; cd permet de se déplacer.',
    quiz:['Liste les entrées d’un répertoire.','Affiche le chemin courant.','Change de répertoire.','Copie un fichier.']},
 cd:{concept:'Un chemin absolu commence par / ; un chemin relatif part du dossier courant. cd modifie la position du shell.',
    observe:'Lance pwd, puis cd /var/log, puis pwd : le dernier résultat doit être /var/log. cd ne produit normalement aucun texte.',
    mission:'Depuis ton dossier personnel, déplace-toi vers /var/log en utilisant un chemin absolu.',
    retain:'cd change de dossier ; pwd vérifie la nouvelle position ; ls affiche le contenu du dossier.',
    quiz:['Change le répertoire courant du shell.','Affiche le chemin courant sans le modifier.','Liste les fichiers du répertoire courant.','Affiche le contenu d’un fichier texte.']},
 sed:{concept:'sed transforme un flux texte. s/ancien/nouveau/g remplace toutes les occurrences sur chaque ligne.',
    mission:'Affiche le contenu de /var/log/app.log en remplaçant ERROR par ALERTE dans le flux.',
    retain:'sed transforme le texte ; sans -i, le fichier source reste inchangé. tee copie un flux.',
    quiz:['Transforme le texte d’un flux.','Enregistre un flux sans le transformer.','Trie les lignes.','Filtre les lignes par motif.']},
 tee:{concept:'tee reçoit stdin, écrit sur stdout et enregistre simultanément une copie dans un fichier.',
    mission:'Affiche les lignes ERROR de /var/log/app.log et enregistre-les dans /tmp/errors.log.',
    retain:'tee conserve une copie du flux tout en le laissant continuer ; sed transforme le texte.',
    quiz:['Affiche un flux et l’enregistre dans un fichier.','Transforme les mots d’un flux.','Affiche les premières lignes.','Compte les lignes.']}
};
function progressView(){
  let counts=window.ECE_PROGRESS.byDomain(PARTS, COMMANDS, state.done);
  return `<div class="hero"><div class="eyebrow">MON PARCOURS</div><h1>Apprendre à ton rythme.</h1>` +
    `<p class="muted">Progression enregistrée localement sur cet appareil. Tu peux exporter ton bilan, mais ce navigateur n'envoie aucune note à un serveur.</p>` +
    `<div class="grid"><div class="card"><div class="big">${state.done.size}/${COMMANDS.length}</div><p>Notions travaillées</p></div>` +
    `<div class="card"><div class="big">${state.labDone.size}/7</div><p>Laboratoires terminés</p></div>` +
    `<div class="card"><div class="big">${window.ECE_PROGRESS.summary(state, COMMANDS.length).xp}</div><p>Points d'expérience</p></div></div></div>` +
    `<div class="card"><h2>Progression par domaine</h2>${counts.map(([p,total,n],i)=>`<p><strong>P${i+1} · ${esc(p.title)}</strong><span style="float:right">${n}/${total}</span></p>` +
    `<div class="progress"><div style="width:${n/total*100}%"></div></div>`).join('')}<div class="actions"><button data-exportprogress="1">Exporter mon bilan JSON</button><button data-resetprogress="1">Réinitialiser la progression</button></div></div>`
}
function render(){
  save();
  navRender();
  syncFloatingStatus();
  let app=$('app');
  app.innerHTML=state.view==='home'?home()
    :state.view==='catalog'?catalog()
    :state.view==='learn'?lesson()
    :state.view==='terminal'?terminalView()
    :state.view==='labs'?labs()
    :state.view==='lab'?labView()
    :state.view==='bash'?bashView()
    :state.view==='sim'?simView():progressView();
  if(state.view==='catalog')filterCards();
  if(state.view==='terminal'){
    let o=$('termout');
    o.scrollTop=o.scrollHeight;
    $('cmd').focus();
  }
  if(state.view==='lab'){
    let o=$('labout');
    o.scrollTop=o.scrollHeight;
    $('labcmd')?.focus();
  }
}
function download(name,text,type='text/plain'){let blob=new Blob([text],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
document.addEventListener('click',e=>{
  let b=e.target.closest('button');
  if(!b)return;
  let d=b.dataset;
  if(d.nav){
    if(d.nav==='catalog'){state.domain=-1;state.search=''}
    goto(d.nav);
  }
  else if(d.domain!==undefined){state.domain=+d.domain;state.search='';goto('catalog')}
  else if(d.learn!==undefined){state.active=+d.learn;goto('learn')}
  else if(d.next!==undefined){state.active=+d.next;goto('learn')}
  else if(d.choice!==undefined)checkQuiz(+d.choice);
  else if(d.check)checkAnswer();
  else if(d.runexample!==undefined){let ex=COMMANDS[+d.runexample].example;submitCommand(ex);goto('terminal')}
  else if(d.lab!==undefined){state.lab=+d.lab;state.labStarted.add(state.lab);state.labLog='';goto('lab')}
  else if(d.labreset){labSteps[state.lab]=0;state.labLog='';render()}
  else if(d.hint){$('labhint').hidden=false}
  else if(d.labskip){
    let l=LABS[state.lab],step=labSteps[state.lab]||0;state.labLog=(state.labLog||'')+'Solution de référence : '+l.steps[step][1]+'\n';labSteps[state.lab]=step+1;if(step+1===l.steps.length){state.labDone.add(state.lab);save()}render()}
  else if(d.clear){state.termLog='';render()}
  else if(d.resetfs){if(confirm('Réinitialiser les fichiers virtuels ?')){state.fs=JSON.parse(JSON.stringify(initialFS));save();render()}}
  else if(d.sim){state.sim=d.sim;goto('sim')}
  else if(d.tick){state.simTick++;render()}
  else if(d.tickreset){state.simTick=0;render()}
  else if(d.script)runScript();
  else if(d.preset){state.scriptSource=d.preset==='backup'?'#!/usr/bin/env bash\n# Démonstration de sauvegarde\nSOURCE=/home/student\necho "Sauvegarde de $SOURCE"\nfor f in notes logs docs; do\n  echo "Copie de $f"\ndone\necho "Terminé"':'#!/usr/bin/env bash\n# Monitoring pédagogique\necho "Rapport de supervision"\nfree -h\nuptime\necho "Analyse terminée"';render()}
  else if(d.export)download('script_ece_learn_linux.sh',$('script').value);
  else if(d.exportprogress)download('bilan_ece_learn_linux.json',JSON.stringify({date:new Date().toISOString(),notions:[...state.done].map(i=>COMMANDS[i].name),laboratoires:[...state.labDone].map(i=>LABS[i].title),xp:window.ECE_PROGRESS.summary(state, COMMANDS.length).xp},null,2),'application/json');
  else if(d.resetprogress){
    if(confirm('Effacer les validations et points ?')){
      state.done.clear();
      state.labDone.clear();
      state.labStarted.clear();
      state.attempts={};
      save();
      render();
    }
  }
});
document.addEventListener('input',e=>{
  if(e.target.id==='search'){state.search=e.target.value;filterCards()}
  if(e.target.id==='ram'){state.ram=+e.target.value;let focused=document.activeElement;let pos=state.ram;$('simcontent').innerHTML=simContent();$('ram').focus()}
  if(e.target.id==='script')state.scriptSource=e.target.value
});
document.addEventListener('change',e=>{
  if(e.target.id==='domainselect'){state.domain=+e.target.value;filterCards();navRender();window.history.replaceState(routeSnapshot(),'',routeURL(routeSnapshot()))}
  if(e.target.dataset.perm!==undefined){let a=(state.perm||'754').split('');a[+e.target.dataset.perm]=e.target.value;state.perm=a.join('');$('simcontent').innerHTML=simContent()}
});
document.addEventListener('keydown',e=>{
  if(e.key==='Enter'&&e.target.id==='cmd'){
    let v=e.target.value;
    e.preventDefault();
    submitCommand(v);
  }
  if(e.key==='Enter'&&e.target.id==='labcmd'){
    let v=e.target.value;
    e.preventDefault();
    submitLab(v);
  }
  if(e.target.id==='cmd'&&(e.key==='ArrowUp'||e.key==='ArrowDown')){
    e.preventDefault();
    state.histCursor=Math.min(state.history.length,Math.max(0,state.histCursor+(e.key==='ArrowUp'?-1:1)));
    e.target.value=state.history[state.histCursor]||'';
  }
  if(e.key==='Enter'&&e.target.id==='answer')checkAnswer();
});
// The desktop footer spans the viewport, but is revealed only when the right pane reaches its end.
const mainScrollPane=typeof document.querySelector==='function'?document.querySelector('.main'):null,siteFooter=typeof document.querySelector==='function'?document.querySelector('.footer'):null;
function syncFloatingStatus(){
 if(typeof document.querySelector!=='function')return;
 const pane=document.querySelector('.main'),original=document.getElementById('status'),floating=document.getElementById('floating-status');
 if(!pane||!original||!floating)return;
 floating.innerHTML=original.innerHTML;
 const desktop=typeof window.matchMedia==='function'&&window.matchMedia('(min-width:901px)').matches;
 floating.classList.toggle('is-visible',desktop&&pane.scrollTop>Math.max(30,original.offsetTop+original.offsetHeight));
}
function syncFooterAtEnd(){
 if(!mainScrollPane||!siteFooter||!document.body||!document.body.classList)return;
 const desktop=typeof window.matchMedia==='function'&&window.matchMedia('(min-width:901px)').matches;
 const showing=document.body.classList.contains('footer-at-end');
 const threshold=showing?(siteFooter.offsetHeight||48)+3:3;
 const atEnd=mainScrollPane.scrollHeight-mainScrollPane.scrollTop-mainScrollPane.clientHeight<=threshold;
 document.body.classList.toggle('footer-at-end',desktop&&atEnd);
}
if(mainScrollPane&&typeof mainScrollPane.addEventListener==='function')mainScrollPane.addEventListener('scroll',syncFooterAtEnd,{passive:true});
if(mainScrollPane&&typeof mainScrollPane.addEventListener==='function')mainScrollPane.addEventListener('scroll',syncFloatingStatus,{passive:true});
if(typeof window.addEventListener==='function')window.addEventListener('resize',syncFooterAtEnd);
const initialRoute=routeFromURL();if(initialRoute){state.view=initialRoute.view;state.active=initialRoute.active;state.domain=initialRoute.domain;state.lab=initialRoute.lab;state.sim=initialRoute.sim;}window.history.replaceState(routeSnapshot(),'',routeURL(routeSnapshot()));
render();
syncFooterAtEnd();
syncFloatingStatus();
