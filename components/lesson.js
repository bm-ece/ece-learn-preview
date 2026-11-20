// Composant extrait sans changement de logique.
function learningInfo(c,i){
 const o=learningOverrides[c.name]||{};
 const others=COMMANDS.map((v,j)=>({v,j})).filter(x=>x.j!==i&&x.v.desc!==c.desc).sort((a,b)=>Number(b.v.part===c.part)-Number(a.v.part===c.part)).slice(0,3);
 return {concept:o.concept||lessonConcepts[i][1].replace(/^Cette notion concerne [^.]*\.\s*/,''),observe:o.observe||exampleObservation(c,c.example||c.task),mission:o.mission||('Situation pratique : '+c.desc+' Rédige la commande adaptée à cette situation.'),retain:o.retain||lessonExplanations[i],quiz:o.quiz||[c.desc,...others.map(x=>x.v.desc)]};
}
function lesson(){
 let c=COMMANDS[state.active],i=state.active,example=c.example||c.task,runnable=isRunnable(example);
 let concept=lessonConcepts[i][0],explanation=lessonExplanations[i],mission=c.task||example,info=learningInfo(c,i);
 return '<div class="hero"><div class="eyebrow">DOMAINE '+(c.part+1)+' · FICHE '+(i+1)+'/'+COMMANDS.length +
   '</div><h1>'+esc(c.name) +
   '</h1><p class="muted">'+esc(c.desc) +
   '</p><div class="lesson-position" role="group" aria-label="Position dans le parcours"><span>Position dans le parcours : fiche '+(i+1)+' sur '+COMMANDS.length +
   '</span><div class="lesson-position-track" role="progressbar" aria-label="Position dans le parcours" aria-valuemin="1" aria-valuemax="'+COMMANDS.length+'" aria-valuenow="'+(i+1)+'"><span style="width:'+(((i+1)/COMMANDS.length)*100).toFixed(2)+'%"></span></div></div><div class="actions lesson-actions"><button data-next="'+(i-1)+'" '+(i===0?'disabled aria-disabled="true"':'')+'>← Précédente</button><button data-nav="catalog">▦ Bibliothèque</button>'+(i<COMMANDS.length-1?'<button class="primary" data-next="'+(i+1)+'">Suivante →</button>':'<span class="lesson-end">✓ Fin du parcours · 79/79</span>')+'</div></div>'
 +'<div class="split"><section><div class="card"><span class="tag">01 · COMPRENDRE</span><h2>Comprendre : '+esc(c.name)+'</h2><p>'+esc(explanation)+'</p><p class="muted small"><strong>Concept clé :</strong> '+esc(concept)+'</p>'
 +'</div><div class="card" style="margin-top:14px"><span class="tag">02 · OBSERVER</span><h3>Observer un exemple</h3><p>Commande de référence :</p><div class="code">'+esc(example)+'</div><p><strong>Ce qu’il faut observer :</strong> '+esc(info.observe)+'</p>'
 +'</div><div class="card" style="margin-top:14px"><span class="tag">03 · VÉRIFIER LA COMPRÉHENSION</span><h3>Quelle proposition décrit le mieux cet outil ?</h3><div id="quizoptions">'+quizOptions(c,i).map((opt,j)=>'<button class="choice" data-choice="'+j+'">'+String.fromCharCode(65+j)+'. '+esc(opt)+'</button>').join('')+'</div><div id="quizfeedback"></div></div></section>'
 +'<section><div class="card"><span class="tag gold">04 · S’ENTRAÎNER</span><h3>Mission de commande</h3><p>'+esc(info.mission)+'</p><p class="muted small">Rédige une commande adaptée à cette situation puis vérifie-la.</p>'
 +'<input id="answer" spellcheck="false" autocomplete="off" placeholder="Écris une commande Linux..." aria-label="Réponse de la mission"><div class="actions"><button class="primary" data-check="1">Vérifier ma commande</button>'+(runnable?'<button data-runexample="'+i+'">Tester l’exemple dans le terminal →</button>':'')+'</div><div id="answerfeedback"></div><p class="muted small">'+(runnable?'Exécution possible dans le simulateur local, avec ses limites.':'Notion à étudier : une démonstration complète peut nécessiter un vrai système Linux.')+'</p>'
 +'</div><div class="card" style="margin-top:14px"><span class="tag">05 · RETENIR</span><h3>L’essentiel</h3><p><strong>À retenir :</strong> '+esc(concept)+'.</p><aside class="vigilance" role="note" aria-label="Point de vigilance"><div class="vigilance-title"><span class="vigilance-icon" aria-hidden="true">!</span>Point de vigilance</div><p>'+esc(c.tip)+'</p></aside></div>'
 +'<div class="card further-learning" style="margin-top:14px"><h3>Pour aller plus loin</h3><p class="muted small">Approfondir le domaine : '+esc(PARTS[c.part].title)+'</p><div class="actions"><button data-lab="'+c.part+'">Laboratoire du domaine →</button><button data-nav="sim">Simulateurs visuels →</button></div></div></section></div>';
}
