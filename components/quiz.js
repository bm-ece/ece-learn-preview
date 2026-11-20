// Composant extrait sans changement de logique.
function quizOptions(c,i){let arr=learningInfo(c,i).quiz;let shift=(i*3)%4;return arr.map((_,j)=>arr[(j+shift)%4])}
function checkQuiz(choice){let c=COMMANDS[state.active],shift=(state.active*3)%4,correct=(4-shift)%4;document.querySelectorAll('[data-choice]').forEach(b=>b.classList.toggle('selected',+b.dataset.choice===choice));$('quizfeedback').innerHTML=choice===correct?`<div class="ok">✓ Exact. ${esc(learningInfo(c,state.active).retain)}</div>`:`<div class="bad">Ce n'est pas la bonne fonction. ${esc(c.name)} : ${esc(c.desc)} Consulte l’exemple puis réessaie.</div>`}
function checkAnswer(){
  let c=COMMANDS[state.active],
    v=$('answer').value.trim(),
    expected=c.task||c.example;
  let norm=x=>x.trim()
    .replace(/\s+/g,' ')
    .replace(/\s*\|\s*/g,' | ')
    .replace(/\s*;\s*/g,'; ')
    .replace(/\s*([>])\s*/g,'$1');
  let ok=norm(v)===norm(expected)||norm(v)===norm(c.example);
  if(!v){
    $('answerfeedback').innerHTML='<div class="bad">Écris d’abord une commande.</div>';
    return;
  }
  state.attempts[state.active]=(state.attempts[state.active]||0)+1;
  if(ok){
    state.done.add(state.active);
    $('answerfeedback').innerHTML=`<div class="ok">✓ Syntaxe attendue reconnue. ${esc(c.tip)}<br>Compétence enregistrée (+25 XP).</div>`;
  }else{
    $('answerfeedback').innerHTML=`<div class="warn">Pas encore reconnu. Compare ta réponse avec cet exemple :<div class="code">${esc(expected)}</div><p>Vérifie les options, les arguments et les opérateurs. Le correcteur de cette fiche vérifie une syntaxe de référence, pas toutes les variantes Linux valides.</p></div>`;
  }
  save();
}
