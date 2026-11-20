const { URL, URLSearchParams } = require('node:url');
// Run: node tests/command-matrix.test.cjs
// Exercise every interactive command documented in the simulator's help.
// This tests pedagogical simulation, NOT full GNU/Linux compatibility.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'inline simulator source missing');
const elements=new Map();
const context=vm.createContext({
 document:{getElementById(id){if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',scrollTop:0,scrollHeight:0,focus(){}});return elements.get(id)},addEventListener(){}},
 localStorage:{getItem(){return null},setItem(){}},window:{location:new URL('https://bm-ece.github.io/linux-nexus/'),history:{replaceState(){},pushState(){}},scrollTo(){},addEventListener(){}},URL,URLSearchParams,console,TextEncoder
});
vm.runInContext(script+'\nthis.api={execute,state,initialFS,COMMANDS,LABS};',context,{timeout:5000});
const {execute,state,initialFS,COMMANDS,LABS}=context.api;
const cases=[
['pwd','/home/student'],['whoami','student'],['id','uid=1000(student)'],
['ls /','etc'],['ls -la /etc','hosts'],['cat /etc/passwd','student:x'],
['head -n 2 /var/log/app.log','ERROR'],['tail -n 2 /var/log/app.log','ERROR'],
['grep -i error /var/log/app.log','ERROR'],['grep -n ERROR /var/log/app.log','2:'],
['grep -c ERROR /var/log/app.log','3'],['grep -v ERROR /var/log/app.log','WARN'],
['wc -l /var/log/app.log','5'],['sort /data/names.txt','alice'],
['sort /data/names.txt | uniq -c','3 alice'],['cut -d: -f1 /etc/passwd','student'],
["awk -F: '{print $1}' /etc/passwd",'student'],
["sed 's/ERROR/ALERTE/g' /var/log/app.log",'ALERTE'],
['echo bonjour','bonjour'],["printf 'a\\nb'",'a\nb'],
['file /etc/hosts','UTF-8 text'],['stat /etc/hosts','Inode'],
['du -sh /var/log','4.0K'],['df -h','Filesystem'],['man grep','MANUEL'],
['chmod 750 /home/student/projets','conceptuellement'],
['chown student /home/student/projets','conceptuellement'],
['chgrp student /home/student/projets','conceptuellement'],
['umask','conceptuellement'],['ln -s /etc/hosts /tmp/hosts-link','conceptuellement'],
['ps aux','PID'],['top','load average'],['htop','load average'],
['kill -TERM 412','Signal simulé'],['jobs','Running'],['free -h','available'],
['vmstat','swap'],['uptime','load average'],['ip addr','eth0'],
['ip route','default'],['ping -c 3 example.org','packet loss'],
['ss -tuln','LISTEN'],['dig example.org','192.0.2.1'],
['nslookup example.org','192.0.2.1'],['traceroute example.org','192.0.2.1'],
['ssh student@example.org','Aucune connexion'],
['systemctl status ssh','active'],['journalctl -u ssh','student'],
['docker ps','alpine'],['docker images','alpine'],['busybox','BusyBox'],
['sysctl vm.swappiness','60'],['mount','ext4'],['lsblk','vda'],
['true',''],['help','pwd'],['clear','__CLEAR__'],
['echo hello | tee /tmp/audit.txt','hello'],['cat /tmp/audit.txt','hello'],
["printf 'a\\nb' | xargs echo",'a b'],
['echo first > /tmp/append.txt',''],['echo second >> /tmp/append.txt',''],
['cat /tmp/append.txt','first\nsecond'],
['ls /missing 2> /tmp/error.txt',''],['cat /tmp/error.txt','missing'],
['cd /',''],['pwd','/'],['cd',''],['pwd','/home/student'],
['mkdir -p /tmp/deep/dir',''],['touch /tmp/deep/dir/first',''],
['cp /tmp/deep/dir/first /tmp/deep/dir/second',''],
['mv /tmp/deep/dir/second /tmp/deep/dir/third',''],
['ls /tmp/deep/dir','third'],['rm /tmp/deep/dir/third',''],
['rm -r /tmp/deep',''],['false','']
];
let passed=0,failed=0;
for(const [command,expected] of cases){
 try{
  const result=execute(command);
  assert.ok(result.out.includes(expected),'expected '+JSON.stringify(expected)+'; got '+JSON.stringify(result));
  if(command==='false'||command.startsWith('ls /missing'))assert.notEqual(result.status,0,command);
  else assert.equal(result.status,0,command+': '+result.error);
  passed++;console.log('PASS',command);
 }catch(error){failed++;console.error('FAIL',command,error.message)}
}
const reset=()=>{state.cwd='/home/student';state.fs=JSON.parse(JSON.stringify(initialFS))};
for(let i=0;i<LABS.length;i++){
 reset();
 for(const [label,command,pattern] of LABS[i].steps){
  try{const r=execute(command);assert.equal(r.status,0,label);assert.match(r.out,pattern,label);passed++}
  catch(e){failed++;console.error('FAIL LAB '+(i+1)+' '+label,e.message)}
 }
}
assert.equal(COMMANDS.length,79);
assert.equal(LABS.length,7);
console.log('RESULT',passed,'passed;',failed,'failed');
if(failed)process.exitCode=1;
