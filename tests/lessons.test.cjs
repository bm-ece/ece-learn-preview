const { URL, URLSearchParams } = require('node:url');
// Run: node tests/lessons.test.cjs
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];assert.ok(script);
const saved={done:[0,21],labDone:[0,2],attempts:{21:3},fs:{'/':{dir:true},'/home':{dir:true},'/home/student':{dir:true},'/home/student/notes.txt':{text:'cours personnel'}}};
const storage=new Map([['ece_learn_linux_progress_2026',JSON.stringify(saved)]]);
const nodes=new Map();
const browserListeners={};
const browserWindow={
 location:new URL('https://bm-ece.github.io/ece-learn/'),
 scrollTo(){},
 addEventListener(type,callback){browserListeners[type]=callback},
 history:{
  replaceState(data,title,url){browserWindow.location=new URL(url,browserWindow.location)},
  pushState(data,title,url){browserWindow.location=new URL(url,browserWindow.location)}
 }
};
const context=vm.createContext({document:{getElementById(id){if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',focus(){}});return nodes.get(id)},addEventListener(){}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},window:browserWindow,URL,URLSearchParams,TextEncoder,console});
vm.runInContext(script+'\nthis.api={COMMANDS,LABS,lessonExplanations,lessonConcepts,learningInfo,lesson,state,execute,save,goto};',context,{timeout:5000});
const {COMMANDS,LABS,lessonExplanations,lessonConcepts,learningInfo,lesson,state,execute,save}=context.api;
assert.equal(COMMANDS.length,79);assert.equal(LABS.length,7);assert.equal(lessonExplanations.length,79);assert.equal(lessonConcepts.length,79);assert.equal(new Set(Array.from(lessonConcepts,x=>x[0])).size,79);
assert.equal(new Set(Array.from(lessonExplanations)).size,79,'each lesson must have distinct explanation');
for(let i=0;i<79;i++){
 state.active=i;const page=lesson();
 assert.ok(page.includes('Comprendre : '+COMMANDS[i].name.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')),'missing specific heading '+i);
 assert.ok(page.includes(lessonExplanations[i].replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')),'missing explanation '+i);
 assert.ok(page.includes('Concept clé :'),'specific concept missing '+i);
 assert.equal((page.match(/class="card(?: [^"]*)?"/g)||[]).length,6,'five learning cards plus domain navigation '+i);
 assert.ok(page.includes('Pour aller plus loin'),'domain navigation heading missing '+i);
 assert.ok(page.includes('Approfondir le domaine : '),'domain context missing '+i);
 assert.ok(page.includes('data-lab="'+COMMANDS[i].part+'"'),'domain laboratory link missing '+i);
 assert.ok(page.includes('data-nav="sim"'),'simulators link missing '+i);
 for(const heading of ['01 · COMPRENDRE','02 · OBSERVER','03 · VÉRIFIER LA COMPRÉHENSION','04 · S’ENTRAÎNER','05 · RETENIR'])assert.ok(page.includes(heading),'missing learning stage '+heading+' '+i);
 assert.ok(page.includes('Ce qu’il faut observer :'),'observation missing '+i);
 assert.ok(page.includes(learningInfo(COMMANDS[i],i).mission.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')),'mission missing '+i);
 assert.ok(page.includes('Mission de commande'),'training missing '+i);
}
state.active=21;assert.match(lesson(),/éditeur de flux/);
state.active=22;assert.match(lesson(),/écrit le même flux/);assert.match(lesson(),/tee|flux/);
assert.equal(execute('whoami').out.trim(),'student');
assert.equal(execute('cat /home/student/notes.txt').out.trim(),'cours personnel');
assert.equal(state.done.size,2);assert.equal(state.labDone.size,2);assert.equal(state.attempts[21],3);
save();const persisted=JSON.parse(storage.get('ece_learn_linux_progress_2026'));
assert.deepEqual(persisted.done,[0,21]);assert.deepEqual(persisted.labDone,[0,2]);
assert.equal(persisted.fs['/home/student/notes.txt'].text,'cours personnel');
// Browser back/forward restores the view and active notion without reloading saved progress.
context.api.goto('catalog');
assert.equal(browserWindow.location.searchParams.get('view'),'catalog');
state.active=38;context.api.goto('learn');
const lessonURL=browserWindow.location.href;
assert.equal(browserWindow.location.searchParams.get('notion'),'39');
context.api.goto('terminal');
assert.equal(state.view,'terminal');
browserWindow.location=new URL(lessonURL);
browserListeners.popstate({state:null});
assert.equal(state.view,'learn');assert.equal(state.active,38);
browserWindow.location=new URL('https://bm-ece.github.io/ece-learn/?view=catalog');
browserListeners.popstate({state:null});
assert.equal(state.view,'catalog');
assert.equal(state.done.size,2);assert.equal(state.labDone.size,2);
console.log('PASS browser history: catalog, lesson 39, terminal, back to lesson and catalog');
console.log('PASS 79 distinct lessons, domain context, training, terminal, 7 labs, persisted progress and files');
