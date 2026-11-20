// Navigation et synchronisation des routes avec l'historique du navigateur.
// Script classique chargé avant app.js ; state et render sont utilisés après l'initialisation.
const routeViews=new Set(['home','catalog','learn','terminal','labs','lab','bash','sim','progress']);
function routeSnapshot(){return {view:state.view,active:state.active,domain:state.domain,lab:state.lab,sim:state.sim}}
function routeURL(route){
 const url=new URL(window.location.href);
 ['view','notion','domaine','lab','simulateur'].forEach(k=>url.searchParams.delete(k));
 if(route.view!=='home')url.searchParams.set('view',route.view);
 if(route.view==='learn')url.searchParams.set('notion',String(route.active+1));
 if(route.view==='catalog'&&route.domain>=0)url.searchParams.set('domaine',String(route.domain+1));
 if(route.view==='lab')url.searchParams.set('lab',String(route.lab+1));
 if(route.view==='sim')url.searchParams.set('simulateur',route.sim);
 return url.pathname+url.search+url.hash;
}
function routeFromURL(){
 const p=new URLSearchParams(window.location.search),view=p.get('view')||'home';
 if(!routeViews.has(view))return null;
 const route={view,active:state.active,domain:-1,lab:state.lab,sim:state.sim};
 if(view==='learn'){const n=Number(p.get('notion'));if(!Number.isInteger(n)||n<1||n>COMMANDS.length)return null;route.active=n-1}
 if(view==='catalog'&&p.has('domaine')){const n=Number(p.get('domaine'));if(!Number.isInteger(n)||n<1||n>PARTS.length)return null;route.domain=n-1}
 if(view==='lab'){const n=Number(p.get('lab'));if(!Number.isInteger(n)||n<1||n>LABS.length)return null;route.lab=n-1}
 if(view==='sim'&&p.has('simulateur'))route.sim=p.get('simulateur');
 return route;
}
function applyRoute(route){
 state.view=route.view;state.active=route.active;state.domain=route.domain;state.lab=route.lab;state.sim=route.sim;
 if(route.view==='catalog')state.search='';
 render();window.scrollTo({top:0,behavior:'instant'});
}
function goto(v){
 state.view=v;
 const route=routeSnapshot(),url=routeURL(route);
 if(url!==window.location.pathname+window.location.search+window.location.hash)window.history.pushState(route,'',url);
 render();window.scrollTo({top:0,behavior:'smooth'});
}
window.addEventListener('popstate',event=>{
  const route=routeFromURL()||event.state;
  if(route&&routeViews.has(route.view))applyRoute(route);
});
