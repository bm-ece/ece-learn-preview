// Moteur Linux extrait sans modification de comportement.
function labView(){
  let l=LABS[state.lab],step=labSteps[state.lab]||0;
  return `<div class="hero"><div class="eyebrow">LABORATOIRE ${state.lab+1}/7 · SCÉNARIO GUIDÉ</div><h1>${esc(l.title)}</h1>` +
    `<p class="muted">${esc(l.story)}</p>` +
    `<div class="progress"><div style="width:${step/l.steps.length*100}%"></div></div>` +
    `<div class="actions"><button data-nav="labs">← Tous les laboratoires</button><button data-labreset="1">Recommencer ce laboratoire</button></div></div>` +
    `<div class="split"><div class="card"><span class="tag gold">MISSION ACTIVE</span>${step>=l.steps.length?`<h2>Mission accomplie ✓</h2>` +
    `<div class="ok">Toutes les observations ont été validées. +150 XP</div>` +
    `<button data-nav="labs">Choisir un autre laboratoire</button>`:`<h2>Étape ${step+1} sur ${l.steps.length}</h2><h3>${esc(l.steps[step][0])}</h3><p>Utilise le terminal de mission pour produire le résultat demandé. Tu peux consulter l'indice si nécessaire.</p>` +
    `<div class="hint" id="labhint" hidden>Exemple possible : <code>${esc(l.steps[step][1])}</code></div>` +
    `<div class="actions"><button data-hint="1">Afficher un indice</button></div>`}<h3>Plan de mission</h3>${l.steps.map((x,i)=>`<div class="labstep"><b>${i<step?'✓':i+1}</b><div>${esc(x[0])}${i===step?' · en cours':''}</div></div>`).join('')}</div><div><div class="terminal"><div class="termbar"><span class="dot"></span><span class="dot"></span><span class="dot"></span> Terminal de mission · isolé</div>` +
    `<div class="termout" id="labout">${esc(state.labLog||'Exécute une commande pour commencer.\n')}</div>` +
    `<div class="termline"><span>student@ece-os:${esc(state.cwd)}$</span><input id="labcmd" spellcheck="false" autocomplete="off" placeholder="Commande à exécuter"></div></div>` +
    `<div id="labfeedback"></div>` +
    `<p class="muted small">La vérification porte sur la sortie simulée. Les commandes conceptuelles ne modifient pas de vrais processus ou permissions.</p></div></div>`
}
function submitLab(cmd){
  let r=execute(cmd),l=LABS[state.lab],step=labSteps[state.lab]||0;
  state.labLog=(state.labLog||'')+`student@ece-os:${state.cwd}$ `+cmd+'\n'+r.out+r.error;
  state.labLog=state.labLog.slice(-10000);
  if(step<l.steps.length){
    let good=r.status===0&&l.steps[step][2].test(r.out);
    if(good){
      labSteps[state.lab]=step+1;
      state.labLog+='✓ Observation attendue identifiée.\n';
      if(step+1===l.steps.length){
        state.labDone.add(state.lab);
        save();
        state.labLog+='★ Laboratoire terminé.\n';
      }
    }else state.labLog+='↳ La sortie ne répond pas encore à l’objectif. Analyse le résultat et réessaie.\n';
  }
  render();
}
