// Moteur Linux extrait sans modification de comportement.
function bashView(){
  return `<div class="hero"><div class="eyebrow">ATELIER DE SCRIPTING</div><h1>Écris. Exécute. Observe.</h1>` +
    `<p class="muted">Un interpréteur pédagogique prend en charge les variables, echo, les boucles for simples, les tests if simples et quelques commandes. Il ne remplace pas Bash : pour les scripts complexes, utilise une VM ou un conteneur Linux.</p></div>` +
    `<div class="split"><div class="card"><h3>Éditeur Bash</h3><textarea id="script" rows="15" spellcheck="false">${esc(state.scriptSource)}</textarea><div class="actions"><button class="primary" data-script="1">▶ Exécuter le script</button>` +
    `<button data-preset="backup">Exemple sauvegarde</button>` +
    `<button data-preset="monitor">Exemple monitoring</button>` +
    `<button data-export="1">Exporter .sh</button></div></div>` +
    `<div class="card"><h3>Sortie du script</h3><div class="code" id="scriptout" style="min-height:230px">${esc(state.scriptOutput||'Clique sur Exécuter pour lancer la simulation.')}</div>` +
    `<div class="hint">Les commandes de sauvegarde et de monitoring sont des exercices pédagogiques. Le simulateur ne lit pas la mémoire réelle, n’installe pas de tâches cron et ne lance aucun programme système.</div></div></div>`
}
function runScript(){
  state.scriptSource=$('script').value;
  let lines=state.scriptSource.split('\n'),vars={},output=[],limit=200;
  function expand(s){return s.replace(/\$\{?(\w+)\}?/g,(m,k)=>vars[k]??'')}
  function execLine(line){
    if(output.length>=limit)return;
    line=line.trim();
    if(!line||line.startsWith('#'))return;
    let assign=line.match(/^([A-Za-z_]\w*)=(.*)$/);
    if(assign){vars[assign[1]]=expand(assign[2]).replace(/^['"]|['"]$/g,'');return}
    if(/^echo\s/.test(line)){output.push(expand(line.slice(5)).replace(/^['"]|['"]$/g,''));return}
    if(/^true$/.test(line))return;
    if(/^false$/.test(line)){output.push('false : code de retour 1');return}
    if(/^((pwd|ls|cat|grep|free|uptime|date|whoami|df|ps)\b)/.test(line)){let r=execute(expand(line));output.push((r.out+r.error).trimEnd());return}
    output.push('Instruction non simulée : '+line)
  }
  for(let i=0;i<lines.length&&output.length<limit;i++){
    let line=lines[i].trim();
    let fm=line.match(/^for\s+(\w+)\s+in\s+(.+?);?\s*do\s*$/);
    if(fm){
      let body=[],j=i+1;
      while(j<lines.length&&lines[j].trim()!=='done'){body.push(lines[j]);j++}
      if(j===lines.length){output.push('Erreur : done manquant');break}
      for(let val of fm[2].replace(/;$/,'').split(/\s+/).slice(0,50)){vars[fm[1]]=val;body.forEach(execLine)}
      i=j;
      continue
    }
    let single=line.match(/^for\s+(\w+)\s+in\s+(.+?);\s*do\s+(.+?);\s*done$/);
    if(single){
      for(let val of single[2].split(/\s+/).slice(0,50)){vars[single[1]]=val;execLine(single[3])}
      continue
    }
    let im=line.match(/^if\s+(true|false|test\s+\d+\s+-gt\s+\d+);\s*then\s+(.+?);\s*else\s+(.+?);\s*fi$/);
    if(im){
      let cond=im[1]==='true'||(im[1].startsWith('test')&&Number(im[1].split(' ')[1])>Number(im[1].split(' ')[3]));
      execLine(cond?im[2]:im[3]);
      continue
    }
    execLine(line)
  }
  state.scriptOutput=output.join('\n')||'(aucune sortie)';
  render()
}
