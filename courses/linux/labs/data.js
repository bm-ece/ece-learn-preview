window.ECE_LINUX_LABS=[
  {
    title: 'Enquête dans le système de fichiers',
    story: 'Tu arrives sur une machine inconnue. Repère la configuration des utilisateurs et inspecte les métadonnées du système.',
    steps: [
      [
        'Repère ta position',
        'pwd',
        /\/home\/student/
      ],
      [
        'Identifie les comptes',
        'cat /etc/passwd',
        /root:x:0/
      ],
      [
        'Examine les fichiers de configuration',
        'ls -la /etc',
        /hosts/
      ],
      [
        'Observe la taille du disque',
        'df -h',
        /Filesystem/
      ]
    ]
  },
  {
    title: 'Analyse d’incident dans les logs',
    story: 'Un service échoue de manière intermittente. Filtre les erreurs, compte-les, puis examine les statistiques des utilisateurs.',
    steps: [
      [
        'Isole les erreurs',
        'grep ERROR /var/log/app.log',
        /ERROR/
      ],
      [
        'Compte les erreurs avec un pipeline',
        'grep ERROR /var/log/app.log | wc -l',
        /^3\s*$/
      ],
      [
        'Trie les noms',
        'sort /data/names.txt',
        /alice/
      ],
      [
        'Compte les doublons',
        'sort /data/names.txt | uniq -c',
        /3 alice/
      ]
    ]
  },
  {
    title: 'Automatiser un contrôle Bash',
    story: 'Tu dois produire un script lisible qui affiche un message, parcourt une liste et vérifie son fonctionnement.',
    steps: [
      [
        'Affiche un message de supervision',
        'echo Rapport de monitoring',
        /Rapport de monitoring/
      ],
      [
        'Observe la mémoire depuis un script',
        'free -h',
        /available/
      ],
      [
        'Observe la charge du système',
        'uptime',
        /load average/
      ]
    ]
  },
  {
    title: 'Processus et signaux',
    story: 'Un processus semble bloqué. Apprends à observer les PID et les états avant de décider d’envoyer un signal.',
    steps: [
      [
        'Liste les processus',
        'ps',
        /PID/
      ],
      [
        'Observe la charge',
        'top',
        /load average/
      ],
      [
        'Identifie les jobs',
        'jobs',
        /Running/
      ],
      [
        'Simule un signal de terminaison',
        'kill -TERM 412',
        /Signal simulé/
      ]
    ]
  },
  {
    title: 'Permissions et inodes',
    story: 'Un dossier partagé doit être sécurisé. Identifie les droits et applique les commandes adaptées.',
    steps: [
      [
        'Affiche les métadonnées',
        'stat /etc/hosts',
        /Inode/
      ],
      [
        'Comprends le changement de droits',
        'chmod 750 /home/student/projets',
        /conceptuellement/
      ],
      [
        'Découvre le propriétaire',
        'chown student /home/student/projets',
        /conceptuellement/
      ],
      [
        'Observe les montages',
        'mount',
        /ext4/
      ]
    ]
  },
  {
    title: 'Diagnostic CPU et mémoire',
    story: 'Les utilisateurs signalent des lenteurs. Différencie RAM libre, mémoire disponible, swap et charge système.',
    steps: [
      [
        'Observe la mémoire',
        'free -h',
        /available/
      ],
      [
        'Consulte le noyau',
        'cat /proc/meminfo',
        /MemAvailable/
      ],
      [
        'Observe les indicateurs',
        'vmstat',
        /swap/
      ],
      [
        'Examine la charge',
        'uptime',
        /load average/
      ]
    ]
  },
  {
    title: 'Réseau, services et conteneurs',
    story: 'Un service distant ne répond plus. Observe interfaces, routage, ports et journaux, puis examine l’isolation des conteneurs.',
    steps: [
      [
        'Observe les interfaces',
        'ip addr',
        /eth0/
      ],
      [
        'Vérifie le routage',
        'ip route',
        /default/
      ],
      [
        'Vérifie les ports',
        'ss -tuln',
        /LISTEN/
      ],
      [
        'Examine le service',
        'systemctl status ssh',
        /active/
      ],
      [
        'Inspecte les conteneurs',
        'docker ps',
        /alpine/
      ]
    ]
  }
];
