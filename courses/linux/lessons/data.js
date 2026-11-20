window.LINUX_NEXUS_DATA={
  "commands": [
    {
      "part": 0,
      "name": "pwd",
      "desc": "Affiche le répertoire courant.",
      "example": "pwd",
      "tip": "Repère où tu te trouves avant toute opération.",
      "task": "pwd"
    },
    {
      "part": 0,
      "name": "ls",
      "desc": "Liste les fichiers et dossiers ; -l affiche les métadonnées, -a les fichiers cachés.",
      "example": "ls -la /etc",
      "tip": "Un fichier caché commence par un point.",
      "task": "ls -la /etc"
    },
    {
      "part": 0,
      "name": "cd",
      "desc": "Change de répertoire ; .. remonte d’un niveau, ~ désigne le domicile.",
      "example": "cd /var/log",
      "tip": "Le chemin absolu commence par / ; le chemin relatif part du dossier courant.",
      "task": "cd /var/log"
    },
    {
      "part": 0,
      "name": "cp",
      "desc": "Copie un fichier ; -r copie récursivement un répertoire.",
      "example": "cp /etc/hosts hosts.bak",
      "tip": "La copie conserve la source et crée une destination.",
      "task": "cp /etc/hosts hosts.bak"
    },
    {
      "part": 0,
      "name": "mv",
      "desc": "Déplace ou renomme un fichier.",
      "example": "mv hosts.bak sauvegarde.txt",
      "tip": "Attention : un fichier destination peut être remplacé.",
      "task": "mv hosts.bak sauvegarde.txt"
    },
    {
      "part": 0,
      "name": "rm",
      "desc": "Supprime un fichier ; -r supprime un dossier et son contenu.",
      "example": "rm sauvegarde.txt",
      "tip": "En Linux, rm ne passe généralement pas par une corbeille.",
      "task": "rm sauvegarde.txt"
    },
    {
      "part": 0,
      "name": "mkdir",
      "desc": "Crée un répertoire ; -p crée aussi les parents absents.",
      "example": "mkdir -p projets/linux",
      "tip": "Pratique pour préparer une arborescence de TP.",
      "task": "mkdir -p projets/linux"
    },
    {
      "part": 0,
      "name": "touch",
      "desc": "Crée un fichier vide ou met à jour son horodatage.",
      "example": "touch essai.txt",
      "tip": "La commande ne modifie pas le contenu d’un fichier existant.",
      "task": "touch essai.txt"
    },
    {
      "part": 0,
      "name": "cat",
      "desc": "Affiche ou concatène des fichiers texte.",
      "example": "cat /etc/hosts",
      "tip": "Pour de longs fichiers, utiliser plutôt less.",
      "task": "cat /etc/hosts"
    },
    {
      "part": 0,
      "name": "file",
      "desc": "Identifie le type probable d’un fichier en analysant son contenu.",
      "example": "file /etc/hosts",
      "tip": "L’extension seule ne suffit pas à déterminer un type.",
      "task": "file /etc/hosts"
    },
    {
      "part": 0,
      "name": "stat",
      "desc": "Présente les métadonnées : taille, inode, permissions et dates.",
      "example": "stat /etc/hosts",
      "tip": "Distinguer taille du fichier et espace disque occupé.",
      "task": "stat /etc/hosts"
    },
    {
      "part": 0,
      "name": "du",
      "desc": "Mesure l’espace occupé par des fichiers ou dossiers.",
      "example": "du -sh /var/log",
      "tip": "du mesure l’utilisation des fichiers, pas l’espace libre du volume.",
      "task": "du -sh /var/log"
    },
    {
      "part": 0,
      "name": "df",
      "desc": "Affiche l’espace total, utilisé et disponible des systèmes montés.",
      "example": "df -h",
      "tip": "df et du peuvent différer selon les fichiers ouverts ou les réservations.",
      "task": "df -h"
    },
    {
      "part": 0,
      "name": "man",
      "desc": "Ouvre la documentation de référence d’une commande.",
      "example": "man grep",
      "tip": "Les sections de man distinguent commandes, appels système, formats, etc.",
      "task": "man grep"
    },
    {
      "part": 0,
      "name": "--help",
      "desc": "Affiche l’aide rapide intégrée à de nombreuses commandes.",
      "example": "grep --help",
      "tip": "Le support de --help dépend du programme.",
      "task": "grep --help"
    },
    {
      "part": 1,
      "name": "grep",
      "desc": "Filtre les lignes correspondant à un motif ; -i ignore la casse, -n numérote.",
      "example": "grep -i error /var/log/app.log",
      "tip": "grep cherche des lignes, pas des colonnes.",
      "task": "grep -i error /var/log/app.log"
    },
    {
      "part": 1,
      "name": "cut",
      "desc": "Extrait des champs ; -d choisit le séparateur, -f les colonnes.",
      "example": "cut -d: -f1 /etc/passwd",
      "tip": "cut fonctionne bien avec un séparateur simple.",
      "task": "cut -d: -f1 /etc/passwd"
    },
    {
      "part": 1,
      "name": "sort",
      "desc": "Trie les lignes ; -n pour les nombres, -r pour l’ordre inverse.",
      "example": "sort /data/names.txt",
      "tip": "Un tri alphabétique n’est pas un tri numérique.",
      "task": "sort /data/names.txt"
    },
    {
      "part": 1,
      "name": "uniq",
      "desc": "Regroupe les lignes identiques consécutives ; -c compte.",
      "example": "uniq -c /data/names.txt",
      "tip": "Pour compter les occurrences globales, trier avant uniq.",
      "task": "sort /data/names.txt | uniq -c"
    },
    {
      "part": 1,
      "name": "wc",
      "desc": "Compte les lignes (-l), mots (-w) ou octets (-c).",
      "example": "wc -l /var/log/app.log",
      "tip": "wc -l compte les caractères de fin de ligne.",
      "task": "wc -l /var/log/app.log"
    },
    {
      "part": 1,
      "name": "awk",
      "desc": "Traite des enregistrements et colonnes ; $1 est le premier champ.",
      "example": "awk -F: '{print $1}' /etc/passwd",
      "tip": "awk sait aussi effectuer des calculs et des conditions.",
      "task": "awk -F: '{print $1}' /etc/passwd"
    },
    {
      "part": 1,
      "name": "sed",
      "desc": "Transforme un flux ; s/ancien/nouveau/g remplace du texte.",
      "example": "sed 's/ERROR/ALERTE/g' /var/log/app.log",
      "tip": "Sans -i, sed n’écrase pas le fichier source.",
      "task": "sed 's/ERROR/ALERTE/g' /var/log/app.log"
    },
    {
      "part": 1,
      "name": "tee",
      "desc": "Affiche la sortie tout en l’enregistrant dans un fichier.",
      "example": "grep ERROR /var/log/app.log | tee /tmp/errors.log",
      "tip": "tee conserve une copie du flux tout en le laissant continuer.",
      "task": "grep ERROR /var/log/app.log | tee /tmp/errors.log"
    },
    {
      "part": 1,
      "name": "xargs",
      "desc": "Transforme des lignes d’entrée en arguments de commandes.",
      "example": "printf \"alice\\nbob\\n\" | xargs echo",
      "tip": "xargs transforme des éléments reçus sur stdin en arguments.",
      "task": "printf \"alice\\nbob\\n\" | xargs echo"
    },
    {
      "part": 1,
      "name": "pipe |",
      "desc": "Connecte stdout de la commande de gauche à stdin de celle de droite.",
      "example": "grep ERROR /var/log/app.log | wc -l",
      "tip": "stderr ne traverse pas automatiquement un pipe.",
      "task": "grep ERROR /var/log/app.log | wc -l"
    },
    {
      "part": 1,
      "name": "redirection >",
      "desc": "Envoie stdout vers un fichier en le remplaçant.",
      "example": "echo bonjour > message.txt",
      "tip": "L’ancien contenu est écrasé.",
      "task": "echo bonjour > message.txt"
    },
    {
      "part": 1,
      "name": "redirection >>",
      "desc": "Ajoute stdout à la fin d’un fichier.",
      "example": "echo suite >> message.txt",
      "tip": "Utiliser >> pour préserver les lignes existantes.",
      "task": "echo suite >> message.txt"
    },
    {
      "part": 1,
      "name": "redirection 2>",
      "desc": "Redirige stderr (descripteur 2) vers un fichier.",
      "example": "ls /absent 2> erreurs.txt",
      "tip": "stdout (1) et stderr (2) sont deux flux distincts.",
      "task": "ls /absent 2> erreurs.txt"
    },
    {
      "part": 2,
      "name": "shebang #!",
      "desc": "Déclare l’interpréteur d’un script en première ligne.",
      "example": "#!/usr/bin/env bash",
      "tip": "Le shebang ne remplace pas la permission d’exécution.",
      "task": "#!/usr/bin/env bash"
    },
    {
      "part": 2,
      "name": "variables Bash",
      "desc": "Stocke une valeur sans espace autour du signe =.",
      "example": "NOM=Linux; echo \"$NOM\"",
      "tip": "Les guillemets protègent les espaces lors de l’expansion.",
      "task": "NOM=Linux; echo \"$NOM\""
    },
    {
      "part": 2,
      "name": "arguments $1 $@ $#",
      "desc": "Accède aux arguments d’un script : premier, tous, nombre.",
      "example": "echo \"$1\" \"$#\"",
      "tip": "Préférer \"$@\" pour transmettre les arguments sans les fusionner.",
      "task": "echo \"$1\" \"$#\""
    },
    {
      "part": 2,
      "name": "code de retour $?",
      "desc": "Contient le code de sortie de la dernière commande ; 0 signifie succès.",
      "example": "true; echo \"$?\"",
      "tip": "Lire $? immédiatement avant d’exécuter une autre commande.",
      "task": "true; echo \"$?\""
    },
    {
      "part": 2,
      "name": "if / else / test",
      "desc": "Exécute une branche selon le statut d’une condition.",
      "example": "if test -f /etc/hosts; then echo OK; else echo NON; fi",
      "tip": "Les espaces autour des crochets [ ] sont obligatoires.",
      "task": "if test -f /etc/hosts; then echo OK; else echo NON; fi"
    },
    {
      "part": 2,
      "name": "for",
      "desc": "Répète des instructions pour chaque valeur d’une liste.",
      "example": "for x in a b c; do echo \"$x\"; done",
      "tip": "Bien citer les variables pour les noms avec espaces.",
      "task": "for x in a b c; do echo \"$x\"; done"
    },
    {
      "part": 2,
      "name": "while / until",
      "desc": "Répète tant qu’une condition est vraie (while) ou fausse (until).",
      "example": "while false; do echo encore; done",
      "tip": "Éviter les boucles sans condition d’arrêt.",
      "task": "while false; do echo encore; done"
    },
    {
      "part": 2,
      "name": "fonctions",
      "desc": "Regroupe des instructions réutilisables dans un script.",
      "example": "salut(){ echo bonjour; }; salut",
      "tip": "Les variables sont globales sauf si local est utilisé.",
      "task": "salut(){ echo bonjour; }; salut"
    },
    {
      "part": 2,
      "name": "set -e / set -u",
      "desc": "Demande à Bash de sortir sur certaines erreurs et variables non définies.",
      "example": "set -eu",
      "tip": "set -e a des exceptions contextuelles ; tester ses scripts.",
      "task": "set -eu"
    },
    {
      "part": 2,
      "name": "trap",
      "desc": "Déclenche un nettoyage à la réception d’un signal ou à la sortie.",
      "example": "trap 'echo fin' EXIT",
      "tip": "Utile pour supprimer les fichiers temporaires.",
      "task": "trap 'echo fin' EXIT"
    },
    {
      "part": 2,
      "name": "bash -x / set -x",
      "desc": "Affiche les commandes au fur et à mesure de leur exécution.",
      "example": "bash -x script.sh",
      "tip": "Le traçage peut exposer des secrets dans les logs.",
      "task": "bash -x script.sh"
    },
    {
      "part": 2,
      "name": "cron",
      "desc": "Planifie l’exécution répétée d’une tâche via une crontab.",
      "example": "crontab -l",
      "tip": "Les cinq champs représentent minute, heure, jour, mois, jour semaine.",
      "task": "crontab -l"
    },
    {
      "part": 3,
      "name": "ps",
      "desc": "Affiche un instantané des processus et leurs PID.",
      "example": "ps aux",
      "tip": "PID identifie un processus ; PPID son parent.",
      "task": "ps aux"
    },
    {
      "part": 3,
      "name": "top",
      "desc": "Affiche périodiquement la charge CPU et les processus.",
      "example": "top",
      "tip": "La consommation CPU varie dans le temps.",
      "task": "top"
    },
    {
      "part": 3,
      "name": "htop",
      "desc": "Visualise interactivement les processus (si installé).",
      "example": "htop",
      "tip": "htop n’est pas toujours présent par défaut.",
      "task": "htop"
    },
    {
      "part": 3,
      "name": "kill",
      "desc": "Envoie un signal à un processus ; -TERM demande l’arrêt, -KILL le force.",
      "example": "kill -TERM 4242",
      "tip": "SIGKILL ne permet pas au processus de nettoyer ses ressources.",
      "task": "kill -TERM 4242"
    },
    {
      "part": 3,
      "name": "jobs",
      "desc": "Liste les tâches gérées par le shell courant.",
      "example": "jobs",
      "tip": "Un job du shell n’est pas la même chose qu’un service systemd.",
      "task": "jobs"
    },
    {
      "part": 3,
      "name": "bg / fg",
      "desc": "Reprend un job suspendu en arrière-plan ou au premier plan.",
      "example": "fg %1",
      "tip": "Ctrl+Z suspend une tâche interactive.",
      "task": "fg %1"
    },
    {
      "part": 3,
      "name": "fork / exec / wait",
      "desc": "fork crée un processus fils, exec remplace son image, wait attend sa fin.",
      "example": "strace -f -e trace=process /bin/true",
      "tip": "Ce sont des interfaces système, pas des commandes shell ordinaires.",
      "task": "strace -f -e trace=process /bin/true"
    },
    {
      "part": 3,
      "name": "strace",
      "desc": "Trace les appels système et leurs retours.",
      "example": "strace -e trace=file cat /etc/hosts",
      "tip": "Les appels openat, read, write et close expliquent les E/S.",
      "task": "strace -e trace=file cat /etc/hosts"
    },
    {
      "part": 3,
      "name": "signaux Linux",
      "desc": "SIGTERM demande l’arrêt, SIGSTOP suspend, SIGCONT reprend.",
      "example": "kill -STOP 4242",
      "tip": "SIGSTOP et SIGKILL ne sont pas interceptables.",
      "task": "kill -STOP 4242"
    },
    {
      "part": 4,
      "name": "chmod",
      "desc": "Modifie les permissions rwx ; 750 signifie rwx r-x --- .",
      "example": "chmod 750 script.sh",
      "tip": "La permission x sur un dossier permet de le traverser.",
      "task": "chmod 750 script.sh"
    },
    {
      "part": 4,
      "name": "chown",
      "desc": "Change le propriétaire d’un fichier (souvent réservé à root).",
      "example": "sudo chown alice rapport.txt",
      "tip": "Ne pas confondre propriétaire et groupe.",
      "task": "sudo chown alice rapport.txt"
    },
    {
      "part": 4,
      "name": "chgrp",
      "desc": "Change le groupe propriétaire d’un fichier.",
      "example": "chgrp dev rapport.txt",
      "tip": "L’appartenance au groupe conditionne les droits applicables.",
      "task": "chgrp dev rapport.txt"
    },
    {
      "part": 4,
      "name": "umask",
      "desc": "Définit les bits de permission retirés lors des créations.",
      "example": "umask 027",
      "tip": "Pour un fichier, la base habituelle est 666 ; pour un dossier 777.",
      "task": "umask 027"
    },
    {
      "part": 4,
      "name": "ln",
      "desc": "Crée un lien physique ; -s crée un lien symbolique.",
      "example": "ln -s /etc/hosts hosts-link",
      "tip": "Le lien physique partage l’inode ; le lien symbolique référence un chemin.",
      "task": "ln -s /etc/hosts hosts-link"
    },
    {
      "part": 4,
      "name": "mount",
      "desc": "Monte un système de fichiers dans l’arborescence.",
      "example": "mount",
      "tip": "Le montage relie un périphérique ou FS à un point de montage.",
      "task": "mount"
    },
    {
      "part": 4,
      "name": "umount",
      "desc": "Démonte un système de fichiers.",
      "example": "umount /mnt/test",
      "tip": "Le démontage peut échouer si le système est occupé.",
      "task": "umount /mnt/test"
    },
    {
      "part": 4,
      "name": "lsblk",
      "desc": "Affiche les périphériques bloc et leurs partitions.",
      "example": "lsblk -f",
      "tip": "Un disque n’est pas forcément monté.",
      "task": "lsblk -f"
    },
    {
      "part": 4,
      "name": "fstab",
      "desc": "Décrit les montages persistants dans /etc/fstab.",
      "example": "cat /etc/fstab",
      "tip": "Une erreur dans fstab peut gêner le démarrage.",
      "task": "cat /etc/fstab"
    },
    {
      "part": 4,
      "name": "/proc /sys /dev",
      "desc": "Pseudo-systèmes exposant processus, noyau et périphériques.",
      "example": "ls /proc",
      "tip": "Ces chemins ne sont pas des répertoires de données ordinaires.",
      "task": "ls /proc"
    },
    {
      "part": 5,
      "name": "free",
      "desc": "Résume l’utilisation de la RAM et du swap.",
      "example": "free -h",
      "tip": "La colonne available est souvent plus utile que free.",
      "task": "free -h"
    },
    {
      "part": 5,
      "name": "vmstat",
      "desc": "Présente processus, mémoire, swap, E/S et CPU.",
      "example": "vmstat 1 3",
      "tip": "Observer si et so (swap in/out) pour détecter l’activité swap.",
      "task": "vmstat 1 3"
    },
    {
      "part": 5,
      "name": "uptime",
      "desc": "Affiche durée de fonctionnement et charge moyenne.",
      "example": "uptime",
      "tip": "Le load average n’est pas un pourcentage de CPU.",
      "task": "uptime"
    },
    {
      "part": 5,
      "name": "/proc/meminfo",
      "desc": "Expose les statistiques détaillées de mémoire.",
      "example": "cat /proc/meminfo",
      "tip": "MemAvailable estime la RAM disponible pour de nouvelles tâches.",
      "task": "cat /proc/meminfo"
    },
    {
      "part": 5,
      "name": "/proc/cpuinfo",
      "desc": "Expose des informations sur les processeurs logiques.",
      "example": "cat /proc/cpuinfo",
      "tip": "Les champs peuvent varier selon l’architecture.",
      "task": "cat /proc/cpuinfo"
    },
    {
      "part": 5,
      "name": "/proc/PID/maps",
      "desc": "Décrit les régions mémoire virtuelles d’un processus.",
      "example": "cat /proc/self/maps",
      "tip": "Les adresses sont virtuelles, non directement physiques.",
      "task": "cat /proc/self/maps"
    },
    {
      "part": 5,
      "name": "sysctl",
      "desc": "Consulte ou règle des paramètres du noyau.",
      "example": "sysctl vm.swappiness",
      "tip": "Les changements de réglages système peuvent être sensibles.",
      "task": "sysctl vm.swappiness"
    },
    {
      "part": 6,
      "name": "ip addr",
      "desc": "Affiche les interfaces et leurs adresses IP.",
      "example": "ip addr",
      "tip": "Une interface peut être UP sans accès Internet.",
      "task": "ip addr"
    },
    {
      "part": 6,
      "name": "ip route",
      "desc": "Affiche les routes et la passerelle par défaut.",
      "example": "ip route",
      "tip": "Une route par défaut indique où envoyer les destinations inconnues.",
      "task": "ip route"
    },
    {
      "part": 6,
      "name": "ping",
      "desc": "Teste l’accessibilité ICMP et mesure des délais.",
      "example": "ping -c 3 1.1.1.1",
      "tip": "Un ping bloqué ne prouve pas forcément une panne réseau.",
      "task": "ping -c 3 1.1.1.1"
    },
    {
      "part": 6,
      "name": "ss",
      "desc": "Affiche les sockets et ports d’écoute.",
      "example": "ss -tuln",
      "tip": "Un port en écoute ne garantit pas l’accès depuis l’extérieur.",
      "task": "ss -tuln"
    },
    {
      "part": 6,
      "name": "traceroute",
      "desc": "Présente les sauts réseau vers une destination.",
      "example": "traceroute example.org",
      "tip": "Certains routeurs ne répondent pas aux sondes.",
      "task": "traceroute example.org"
    },
    {
      "part": 6,
      "name": "dig",
      "desc": "Interroge le DNS et présente les enregistrements.",
      "example": "dig example.org A",
      "tip": "Le DNS traduit un nom en données, pas seulement en IPv4.",
      "task": "dig example.org A"
    },
    {
      "part": 6,
      "name": "nslookup",
      "desc": "Effectue des requêtes DNS simples.",
      "example": "nslookup example.org",
      "tip": "dig fournit généralement davantage de détails.",
      "task": "nslookup example.org"
    },
    {
      "part": 6,
      "name": "ssh",
      "desc": "Ouvre une session distante chiffrée.",
      "example": "ssh alice@serveur.example",
      "tip": "Les clés SSH permettent une authentification sans mot de passe.",
      "task": "ssh alice@serveur.example"
    },
    {
      "part": 6,
      "name": "systemctl",
      "desc": "Contrôle les unités et services systemd.",
      "example": "systemctl status ssh",
      "tip": "Le nom exact du service varie selon la distribution.",
      "task": "systemctl status ssh"
    },
    {
      "part": 6,
      "name": "journalctl",
      "desc": "Lit les journaux de systemd.",
      "example": "journalctl -u ssh -n 20",
      "tip": "Utiliser -f pour suivre les nouvelles entrées.",
      "task": "journalctl -u ssh -n 20"
    },
    {
      "part": 6,
      "name": "docker",
      "desc": "Gère images et conteneurs lorsque Docker est installé.",
      "example": "docker ps -a",
      "tip": "Un conteneur partage le noyau de l’hôte.",
      "task": "docker ps -a"
    },
    {
      "part": 6,
      "name": "BusyBox",
      "desc": "Regroupe des utilitaires Unix compacts pour systèmes embarqués.",
      "example": "busybox --list",
      "tip": "BusyBox peut offrir moins d’options que les outils GNU.",
      "task": "busybox --list"
    },
    {
      "part": 6,
      "name": "Buildroot",
      "desc": "Génère des images Linux pour systèmes embarqués.",
      "example": "make menuconfig",
      "tip": "Buildroot est un outil de construction, pas un gestionnaire de paquets.",
      "task": "make menuconfig"
    }
  ],
  "parts": [
    {
      "title": "Fondamentaux et architecture Linux",
      "sessions": [
        {
          "title": "Architecture & environnement système",
          "tp": "Activité Exploration guidée de l'arborescence système, identification des répertoires clés et de leur rôle"
        },
        {
          "title": "Commandes fondamentales & documentation",
          "tp": "TP Mini-enquête système : localiser, décrire et analyser des fichiers de configuration réels à partir d'indices fournis"
        }
      ]
    },
    {
      "title": "Commandes avancées et traitement de données",
      "sessions": [
        {
          "title": "Flux, pipes & outils Unix classiques",
          "tp": "Activité Extraction et comptage de données depuis un fichier texte structuré (journal, CSV, liste)"
        },
        {
          "title": "awk, sed & pipelines complexes",
          "tp": "TP Challenge pipeline : extraire des statistiques d'un journal d'accès web au format Combined Log Format"
        }
      ]
    },
    {
      "title": "Scripts shell et automatisation",
      "sessions": [
        {
          "title": "Structure d'un script & contrôle de flux",
          "tp": "Activité Écriture d'un script de sauvegarde incrémentale avec rapport de sortie et gestion des arguments"
        },
        {
          "title": "Robustesse, erreurs & automatisation",
          "tp": "TP Script de monitoring système : alerte si charge CPU ou mémoire dépasse un seuil, journalisation horodatée, planification cron"
        }
      ]
    },
    {
      "title": "Processus et exécution des programmes",
      "sessions": [
        {
          "title": "Processus, threads & cycle de vie",
          "tp": "Activité Observation de la création de processus parent/enfant, envoi de signaux et analyse de l'arbre de processus"
        },
        {
          "title": "Observation & introspection système",
          "tp": "TP Analyse comportementale d'un binaire : identifier ses ressources, fichiers ouverts et interactions réseau via strace"
        }
      ]
    },
    {
      "title": "Systèmes de fichiers et sécurité des accès",
      "sessions": [
        {
          "title": "Inodes, permissions & utilisateurs",
          "tp": "Activité Diagnostic et correction d'un système avec des droits incorrects : analyse, identification, correction documentée"
        },
        {
          "title": "Liens, montage & types de FS",
          "tp": "TP Création d'une arborescence sécurisée multi-utilisateurs, gestion des droits partagés, montage d'un FS virtuel"
        }
      ]
    },
    {
      "title": "Mémoire et observation du système",
      "sessions": [
        {
          "title": "Mémoire virtuelle & noyau",
          "tp": "Activité Lecture et interprétation de /proc/meminfo, /proc/cpuinfo et /proc/[pid]/maps d'un processus en cours"
        },
        {
          "title": "Observation & diagnostic système",
          "tp": "TP Diagnostic d'un système dégradé : identifier la source de surcharge (mémoire, CPU, I/O) à partir des outils d'observation"
        }
      ]
    },
    {
      "title": "Ouvertures technologiques Linux",
      "sessions": [
        {
          "title": "Réseau Linux & services",
          "tp": "TP Connexion SSH, exploration d'un service actif, diagnostic réseau complet sur un environnement de test"
        },
        {
          "title": "Conteneurs & Linux embarqué",
          "tp": "TP Lancement d'un conteneur minimal OU exploration d'un système Linux embarqué ; synthèse comparative en binôme"
        }
      ]
    }
  ]
};
