window.ECE_LINUX_INITIAL_FS={
  '/': {
    dir: true
  },
  '/home': {
    dir: true
  },
  '/home/student': {
    dir: true
  },
  '/home/student/projets': {
    dir: true
  },
  '/etc': {
    dir: true
  },
  '/var': {
    dir: true
  },
  '/var/log': {
    dir: true
  },
  '/data': {
    dir: true
  },
  '/proc': {
    dir: true
  },
  '/proc/self': {
    dir: true
  },
  '/dev': {
    dir: true
  },
  '/sys': {
    dir: true
  },
  '/tmp': {
    dir: true
  },
  '/mnt': {
    dir: true
  },
  '/etc/hosts': {
    text: '127.0.0.1 localhost\n192.168.56.10 serveur-lab'
  },
  '/etc/passwd': {
    text: 'root:x:0:0:root:/root:/bin/bash\nstudent:x:1000:1000:Student:/home/student:/bin/bash\nservice:x:1001:1001:Service:/srv:/usr/sbin/nologin'
  },
  '/etc/fstab': {
    text: 'UUID=demo-root / ext4 defaults 0 1\ntmpfs /tmp tmpfs defaults 0 0'
  },
  '/var/log/app.log': {
    text: '2026-11-17T08:00 INFO service démarré\n' +
      '2026-11-17T08:01 ERROR connexion refusée\n' +
      '2026-11-17T08:02 WARN latence élevée\n' +
      '2026-11-17T08:03 ERROR espace disque insuffisant\n' +
      '2026-11-17T08:04 INFO reprise normale\n' +
      '2026-11-17T08:05 ERROR connexion refusée'
  },
  '/var/log/access.log': {
    text: '192.0.2.10 - - [17/Nov/2026:08:00:00 +0100] "GET / HTTP/1.1" 200 1024 "-" "Mozilla"\n' +
      '192.0.2.11 - - [17/Nov/2026:08:00:01 +0100] "GET /api HTTP/1.1" 500 23 "-" "curl"\n' +
      '192.0.2.12 - - [17/Nov/2026:08:00:02 +0100] "GET /login HTTP/1.1" 404 15 "-" "Mozilla"\n' +
      '192.0.2.11 - - [17/Nov/2026:08:00:03 +0100] "POST /api HTTP/1.1" 500 42 "-" "curl"'
  },
  '/data/names.txt': {
    text: 'alice\nbob\nalice\ncharlie\nbob\nalice'
  },
  '/data/scores.csv': {
    text: 'nom;score;groupe\nalice;17;A\nbob;12;B\ncharlie;19;A\ndiane;14;B'
  },
  '/proc/meminfo': {
    text: 'MemTotal:        8192000 kB\n' +
      'MemFree:          512000 kB\n' +
      'MemAvailable:    3240000 kB\n' +
      'Buffers:          220000 kB\n' +
      'Cached:          2100000 kB\n' +
      'SwapTotal:       2097152 kB\n' +
      'SwapFree:        2097152 kB'
  },
  '/proc/cpuinfo': {
    text: 'processor : 0\nmodel name : ECE Learn Linux Virtual CPU\nprocessor : 1\nmodel name : ECE Learn Linux Virtual CPU'
  },
  '/proc/self/maps': {
    text: '00400000-00452000 r-xp 00000000 08:01 100 /usr/bin/demo\n7ffd0000-7ffd1000 rw-p 00000000 00:00 0 [stack]'
  },
  '/home/student/README.txt': {
    text: 'Bienvenue dans le laboratoire.\nExplore /etc, /var/log, /data, /proc.\nLa machine est fictive et entièrement isolée.'
  }
};
