// Moteur Linux extrait sans modification de comportement.
function isRunnable(x){return /^(pwd|ls|cd|cat|head|tail|grep|cut|sort|uniq|wc|awk|sed|tee|xargs|echo|printf|touch|mkdir|cp|mv|rm|file|stat|du|df|man|whoami|id|chmod|chown|chgrp|umask|ln|ps|top|htop|kill|jobs|free|vmstat|uptime|ip|ping|ss|dig|nslookup|systemctl|journalctl|docker|busybox|sysctl|mount|lsblk|traceroute|ssh|true|false)\b/.test(x)}
function terminalView(){
  return `<div class="hero"><div class="eyebrow">TERMINAL PÉDAGOGIQUE ISOLÉ</div><h1>Expérimente sans risque.</h1>` +
    `<p class="muted">Le système de fichiers est fictif, mais les commandes prises en charge agissent sur son état. Les pipelines, les redirections, la navigation et plusieurs outils de traitement de texte sont interprétés localement. Aucune commande ne touche à ton ordinateur.</p>` +
    `<div class="actions"><button data-resetfs="1">Réinitialiser les fichiers du laboratoire</button><button data-clear="1">Effacer l'écran</button><button data-nav="catalog">Consulter les explications</button></div></div>` +
    `<div class="split"><div><div class="terminal"><div class="termbar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span style="margin-left:8px">student@linux-nexus — bash simulé</span></div>` +
    `<div class="termout" id="termout">${esc(state.termLog)}</div>` +
    `<div class="termline"><span id="prompt">student@ece-os:${esc(state.cwd)}$</span><input id="cmd" spellcheck="false" autocomplete="off" aria-label="Commande du terminal" placeholder="Tape une commande puis Entrée"></div></div>` +
    `<p class="muted small">Astuce : ↑ et ↓ parcourent l'historique. Tape <code>help</code> pour afficher les commandes reconnues.</p></div><div><div class="card"><h3>🗂️ Système de fichiers virtuel</h3><p class="muted small">Ces fichiers existent dans le navigateur et sont conservés localement.</p>` +
    `<div class="code" style="max-height:320px;overflow:auto">${Object.keys(state.fs).sort().map(k=>`${state.fs[k].dir?'📁':'📄'} ${k}`).join('\n')}</div></div>` +
    `<div class="card" style="margin-top:14px"><h3>Idées de manipulations</h3><div class="code">ls -la /etc\ncat /var/log/app.log\ngrep ERROR /var/log/app.log | wc -l\ncut -d: -f1 /etc/passwd\nsort /data/names.txt | uniq -c\necho bonjour > /tmp/message.txt\ncat /tmp/message.txt</div></div></div></div>`
}
function normPath(p){p=p||'.';if(p==='~')p='/home/student';if(p.startsWith('~/'))p='/home/student/'+p.slice(2);let arr=[];for(let part of (p.startsWith('/')?p:state.cwd+'/'+p).split('/')){if(!part||part==='.')continue;if(part==='..')arr.pop();else arr.push(part)}return '/'+arr.join('/')}
function entries(p){return Object.keys(state.fs).filter(x=>x!==p&&x.startsWith(p==='/'?'/':p+'/')&&!x.slice(p==='/'?1:p.length+1).includes('/'))}
function tokenize(s){return (s.match(/"(?:\\.|[^"])*"|'[^']*'|[^\s]+/g)||[]).map(x=>x.replace(/^(['"])([\s\S]*)\1$/,'$2'))}
function execute(line){
  let out='',error='',status=0;
  let cmd=line.trim();
  if(!cmd)return {out:'',error:'',status:0};
  if(/\$\(|`/.test(cmd))return {out:'',error:'Substitution de commandes non prise en charge dans ce simulateur.',status:2};
  if(cmd==='clear')return {out:'__CLEAR__',error:'',status:0};
  if(cmd==='history')return {out:state.history.map((x,i)=>`${i+1}  ${x}`).join('\n')+'\n',error:'',status:0};
  if(cmd==='help')return {out:'Commandes interactives : pwd ls cd cat head tail grep cut sort uniq wc awk sed tee xargs echo printf touch mkdir cp mv rm file stat du df man whoami id chmod chown chgrp umask ln ps top htop kill jobs free vmstat uptime ip ping ss dig nslookup systemctl journalctl docker busybox sysctl mount lsblk traceroute ssh true false.\nPipes |, redirections > >> 2>, ; (séquences simples). Certaines commandes retournent des observations fictives.\n',error:'',status:0};
  let stages=splitOutside(cmd,';');
  for(let stage of stages){
    let r=runPipeline(stage.trim());
    out+=r.out;
    error+=r.error;
    status=r.status;
  }
  return {out,error,status};
}
function splitOutside(str,sep){
  let result=[],start=0,q='',escNext=false;
  for(let i=0;i<str.length;i++){
    let c=str[i];if(escNext){escNext=false;continue}
    if(c==='\\'){escNext=true;continue}
    if(q){if(c===q)q='';continue}
    if(c==='"'||c==="'"){q=c;continue}
    if(c===sep){result.push(str.slice(start,i));start=i+1}
  }
  result.push(str.slice(start));
  return result;
}
function runPipeline(text){
  let parts=splitOutside(text,'|'),input='',err='',status=0;
  for(let i=0;i<parts.length;i++){
    let part=parts[i].trim();
    let stderrFile=part.match(/\s+2>\s*(\S+)\s*$/);
    if(stderrFile)part=part.slice(0,stderrFile.index);
    let redirect=part.match(/\s*(>>|>)\s*(\S+)\s*$/);
    if(redirect)part=part.slice(0,redirect.index);
    let r=runSingle(part,input);
    input=r.out;
    status=r.status;if(stderrFile){state.fs[normPath(stderrFile[1])]={text:r.error.trimEnd()};}
    else err+=r.error;if(redirect){
      let p=normPath(redirect[2]);if(!state.fs[normPath('..')]&&p===''){}
      if(redirect[1]==='>>')state.fs[p]={text:(state.fs[p]?.text||'')+input};
      else state.fs[p]={text:input};
      input='';
    }
  }
  return {out:input,error:err,status};
}
function runSingle(text,stdin){
  let a=tokenize(text),c=(a.shift()||'').toLowerCase(),
    opts=a.filter(x=>x.startsWith('-')),
    args=a.filter(x=>!x.startsWith('-')),
    first=args[0],
    path=normPath(first||'.'),
    fs=state.fs,
    err=(s)=>({out:'',error:`${c}: ${s}\n`,status:1}),
    ok=(s='')=>({out:String(s),error:'',status:0}),
    read=(p)=>{let f=fs[normPath(p)];return f&&!f.dir?f.text:null},
    content=first?read(first):stdin;
if(!c)return ok(stdin);
if(c==='true')return ok();if(c==='false')return {out:'',error:'',status:1};
if(c==='pwd')return ok(state.cwd+'\n');if(c==='whoami')return ok('student\n');if(c==='id')return ok('uid=1000(student) gid=1000(student) groupes=1000(student),27(sudo)\n');
if(c==='cd'){
  if(!first)path=normPath('~');
  if(!fs[path]?.dir)return err('répertoire introuvable : '+path);
  state.cwd=path;
  return ok();
}
if(c==='ls'){let p=first?path:state.cwd;if(!fs[p])return err('aucun fichier : '+p);let names=fs[p].dir?entries(p):[p];return ok(names.filter(x=>opts.some(o=>o.includes('a'))||!x.split('/').pop().startsWith('.')).map(x=>opts.some(o=>o.includes('l'))?`${fs[x].dir?'d':'-'}rw-r--r-- 1 student student ${fs[x].dir?4096:(fs[x].text||'').length} Nov 17 ${x.split('/').pop()}`:x.split('/').pop()).join('\n')+'\n')}
if(c==='cat'||c==='head'||c==='tail'){let fileArg=(c==='head'||c==='tail')?a.find((v,i)=>!v.startsWith('-')&&!(i>0&&a[i-1]==='-n')):first;let value=fileArg?read(fileArg):stdin;if(value===null||value===undefined)return err('fichier absent : '+path);let lines=value.trimEnd().split('\n');let n=Number((a.join(' ').match(/-n\s*(\d+)/)||[])[1]||10);if(c==='head')lines=lines.slice(0,n);if(c==='tail')lines=lines.slice(-n);return ok(lines.join('\n')+'\n')}
if(c==='mkdir'){
  for(let p of args){
    let full=normPath(p);
    if(opts.includes('-p')){
      let acc='';
      for(let seg of full.split('/').filter(Boolean)){
        acc+='/'+seg;
        if(!fs[acc])fs[acc]={dir:true};
      }
    }else{
      if(!fs[normPath(full+'/..')]?.dir)return err('répertoire parent absent');
      fs[full]={dir:true};
    }
  }
  return ok();
}
if(c==='touch'){
  for(let p of args){
    let full=normPath(p);
    if(!fs[full])fs[full]={text:''};
  }
  return ok();
}
if(c==='cp'||c==='mv'){
  let src=normPath(args[0]),dest=normPath(args[1]);
  if(!fs[src]||!args[1])return err('source ou destination invalide');
  fs[dest]=JSON.parse(JSON.stringify(fs[src]));
  if(c==='mv')delete fs[src];
  return ok();
}
if(c==='rm'){
  for(let p of args){
    let full=normPath(p);
    if(fs[full]?.dir&&!opts.some(o=>o.includes('r')))return err('utilise -r pour un dossier');
    for(let key of Object.keys(fs)){
      if(key===full||(opts.some(o=>o.includes('r'))&&key.startsWith(full+'/')))delete fs[key];
    }
  }
  return ok();
}
if(c==='echo'||c==='printf'){
  let s=a.join(' ').replace(/\\n/g,'\n');
  if(c==='echo')s+='\n';
  return ok(s);
}
if(c==='grep'){
  let pattern=args[0]||'',source=args[1]?read(args[1]):stdin;
  if(source==null)return err('fichier absent');
  let lines=source.trimEnd().split('\n');
  let flags=opts.some(o=>o.includes('i'))?'i':'';
  let reg;
  try{reg=new RegExp(pattern,flags)}
  catch{return err('expression régulière invalide')}let matches=lines.map((x,i)=>({x,i})).filter(x=>reg.test(x.x)!==opts.some(o=>o.includes('v')));
  if(opts.some(o=>o.includes('c')))return ok(matches.length+'\n');
  return ok(matches.map(o=>(opts.some(x=>x.includes('n'))?(o.i+1)+':':'')+o.x).join('\n')+(matches.length?'\n':''))
}
if(c==='wc'){
  let s=first?read(first):stdin;
  if(s==null)return err('fichier absent');
  let n=opts.some(o=>o.includes('l'))?(s.match(/\n/g)||[]).length:opts.some(o=>o.includes('w'))?s.trim().split(/\s+/).filter(Boolean).length:opts.some(o=>o.includes('c'))?new TextEncoder().encode(s).length:[(s.match(/\n/g)||[]).length,s.trim().split(/\s+/).filter(Boolean).length,new TextEncoder().encode(s).length].join(' ');
  return ok(n+(first?' '+first:'')+'\n')
}
if(c==='sort'){
  let s=first?read(first):stdin;
  if(s==null)return err('fichier absent');
  let l=s.trimEnd().split('\n');l.sort(opts.some(o=>o.includes('n'))?(x,y)=>Number(x)-Number(y):undefined);
  if(opts.some(o=>o.includes('r')))l.reverse();
  return ok(l.join('\n')+'\n')
}
if(c==='uniq'){
  let s=first?read(first):stdin;
  if(s==null)return err('fichier absent');
  let l=s.trimEnd().split('\n'),res=[];
  for(let v of l){if(res.length&&res[res.length-1][0]===v)res[res.length-1][1]++;
    else res.push([v,1])}return ok(res.map(([v,n])=>(opts.some(o=>o.includes('c'))?String(n).padStart(4)+' ':'')+v).join('\n')+'\n')
}
if(c==='cut'){
  let sep=(text.match(/-d\s*([^\s]+)/)||[])[1]||':',field=Number((text.match(/-f\s*(\d+)/)||[])[1]||1),f=first?read(first):stdin;
  if(f==null)return err('fichier absent');
  return ok(f.trimEnd().split('\n').map(x=>x.split(sep)[field-1]||'').join('\n')+'\n')
}
if(c==='sed'){
  let expression=a[0]||'',f=a[1]?read(a[1]):stdin;
  if(f==null)return err('fichier absent');
  let m=expression.match(/^s(.)(.*?)\1(.*?)\1([g]*)$/);
  if(!m)return err('simulation : seule la substitution s/ancien/nouveau/g est prise en charge');
  return ok(f.replace(new RegExp(m[2],m[4]?'g':''),m[3]))
}
if(c==='awk'){
  let m=text.match(/\{\s*print\s+\$(\d+)\s*\}/),sep=(text.match(/-F\s*([^\s]+)/)||[])[1]||/\s+/,file=a.find(x=>x.startsWith('/'));
  let s=file?read(file):stdin;
  if(!m||s==null)return err('simulation : awk {print $N} est pris en charge');
  return ok(s.trimEnd().split('\n').map(x=>x.split(sep)[Number(m[1])-1]||'').join('\n')+'\n')
}
if(c==='tee'){
  if(!first)return err('nom de fichier requis');
  fs[path]={text:(opts.some(o=>o.includes('a'))?(fs[path]?.text||''):'')+stdin};
  return ok(stdin);
}
if(c==='xargs'){
  let next=a.join(' ')||'echo',joined=stdin.trim().split(/\s+/).join(' ');
  return runSingle(next+' '+joined,'');
}
if(c==='file')return ok(`${path}: ${fs[path]?.dir?'directory':fs[path]?'UTF-8 text':'cannot open'}\n`);
if(c==='stat'){if(!fs[path])return err('fichier absent');return ok(`Fichier : ${path}\nTaille : ${(fs[path].text||'').length} octets\nInode : 10042 (simulé)\nAccès : (0644/-rw-r--r--)\n`)}
if(c==='du')return ok(`4.0K\t${first||'.'}\n`);if(c==='df')return ok('Filesystem Size Used Avail Use% Mounted on\n/dev/vda1 20G 8G 12G 40% /\n');
if(c==='man')return ok(`MANUEL SIMULÉ — ${first||'linux'}\nConsulte la fiche de la bibliothèque pour l’explication détaillée.\n`);
if(c==='chmod'||c==='chown'||c==='chgrp'||c==='umask'||c==='ln')return ok(`Commande ${c} prise en compte conceptuellement dans le laboratoire. Pour vérifier les effets Unix réels, utilise une VM Linux.\n`);
if(c==='ps')return ok(' PID PPID STAT COMMAND\n  1    0 Ss   systemd\n210    1 Ss   sshd\n412  210 S    bash\n540  412 R    ps\n');
if(c==='top'||c==='htop')return ok('top - 08:10 up 3 days, load average: 1.24, 0.87, 0.65\nTasks: 78 total, 1 running, 77 sleeping\n%Cpu(s): 24.0 us, 6.0 sy, 70.0 id\nMiB Mem: 8000 total, 500 free, 2400 used, 5100 buff/cache\n');
if(c==='kill'||c==='jobs')return ok(c==='jobs'?'[1] Running sleep 120 &\n':'Signal simulé : aucune tâche réelle affectée.\n');
if(c==='free')return ok('               total        used        free      shared  buff/cache   available\nMem:            8000        2400         500         200        5100        3200\nSwap:           2048           0        2048\n');
if(c==='vmstat')return ok('procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----\n r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st\n 1  0      0 512000 220000 2100000  0    0    12    15  120  210 20  5 73  2  0\n');
if(c==='uptime')return ok('08:10:00 up 3 days, 2:14, 2 users, load average: 1.24, 0.87, 0.65\n');
if(c==='ip')return ok(a[0]==='route'?'default via 192.168.56.1 dev eth0\n192.168.56.0/24 dev eth0 scope link\n':'1: lo: <LOOPBACK,UP> inet 127.0.0.1/8\n2: eth0: <BROADCAST,UP> inet 192.168.56.10/24\n');
if(c==='ping')return ok('PING (simulation)\n64 bytes from 192.0.2.1: icmp_seq=1 ttl=55 time=18.2 ms\n3 packets transmitted, 3 received, 0% packet loss\n');
if(c==='ss')return ok('Netid State  Local Address:Port  Peer Address:Port\ntcp   LISTEN 0.0.0.0:22          0.0.0.0:*\ntcp   LISTEN 127.0.0.1:8080      0.0.0.0:*\n');
if(c==='dig'||c==='nslookup')return ok('example.org. 300 IN A 192.0.2.1  ; résultat DNS fictif\n');
if(c==='traceroute')return ok('1  192.168.56.1  1.2 ms\n2  198.51.100.1  12.8 ms\n3  192.0.2.1  18.2 ms\n');
if(c==='ssh')return ok('SSH : démonstration locale uniquement. Aucune connexion réseau ouverte.\n');
if(c==='systemctl')return ok('● ssh.service - OpenBSD Secure Shell server\n     Loaded: loaded\n     Active: active (running) [SIMULÉ]\n');
if(c==='journalctl')return ok('Nov 17 08:00 sshd[210]: Started OpenBSD Secure Shell server\nNov 17 08:05 sshd[210]: Accepted publickey for student\n');
if(c==='docker')return ok(a[0]==='images'?'REPOSITORY TAG IMAGE ID SIZE\nalpine 3.20 demo123 8MB\n':'CONTAINER ID IMAGE COMMAND STATUS NAMES\nabc123 alpine "sh" Up 2 minutes lab-container\n');
if(c==='busybox')return ok('BusyBox v1.36 (simulation)\nash cat cp echo grep ls mount ps sed sh\n');
if(c==='sysctl')return ok('vm.swappiness = 60\n');
if(c==='mount')return ok('/dev/vda1 on / type ext4 (rw,relatime)\nproc on /proc type proc (rw)\n');
if(c==='lsblk')return ok('NAME MAJ:MIN RM SIZE RO TYPE MOUNTPOINT\nvda  252:0    0  20G  0 disk\n└─vda1 252:1  0  20G  0 part /\n');
return err(`commande non implémentée : ${c}. Utilise la bibliothèque pour son cours ou un Linux réel pour la pratiquer.`)}
function submitCommand(line){
  state.history.push(line);
  state.histCursor=state.history.length;
  let r=execute(line);
  if(r.out==='__CLEAR__')state.termLog='';
  else state.termLog+=`student@ece-os:${state.cwd}$ ${line}\n`+r.out+r.error;
  state.lastOutput=r.out;
  state.termLog=state.termLog.slice(-20000);
  save();
  if(state.view==='terminal')render();
  return r;
}
const LABS=window.LINUX_NEXUS_LABS;
if(!Array.isArray(LABS)||LABS.length!==7) throw new Error('Linux laboratories failed to load');
let labSteps={};function labs(){return `<div class="hero"><div class="eyebrow">APPRENTISSAGE PAR L'ENQUÊTE</div><h1>7 laboratoires. 7 situations.</h1>` +
    `<p class="muted">Chaque scénario a une mission, un environnement fictif et des objectifs vérifiés sur la sortie des commandes. Tu peux proposer des commandes équivalentes si elles produisent les observations attendues.</p></div>` +
    `<div class="grid lab-cards">${LABS.map((l,i)=>`<div class="card"><span class="tag">LAB ${i+1} · ${state.labDone.has(i)?'✓ TERMINÉ':state.labStarted.has(i)?'EN COURS':'À COMMENCER'}</span>` +
    `<h3>${esc(l.title)}</h3>` +
    `<p class="muted">${esc(l.story)}</p>` +
    `<p class="small">${l.steps.length} étapes vérifiées</p>` +
    `<button class="primary" data-lab="${i}">Ouvrir le laboratoire →</button></div>`).join('')}</div>`}
