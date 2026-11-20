// Composant extrait sans changement de logique.
function navRender() {
  const selectedDomain=state.view==='learn'&&COMMANDS[state.active]
    ?COMMANDS[state.active].part
    :state.view==='catalog'?state.domain:-1;
  $('nav').innerHTML=NAV.map(([id,ico,label])=>
    `<button class="nav ${(state.view===id||(id==='labs'&&state.view==='lab'))?'on':''}" data-nav="${id}"><span>${ico}</span>${label}</button>`
  ).join('');
  $('domains').innerHTML=PARTS.map((p,i)=>
    `<button class="domain-card ${selectedDomain===i?'on':''}" data-domain="${i}" aria-label="Domaine ${i+1} : ${esc(p.title)}" ${selectedDomain===i?'aria-current="true"':''}><span class="domain-number">0${i+1}</span><span class="domain-title">${esc(p.title)}</span><span class="domain-symbol" aria-hidden="true">${['⌘','≡','{ }','⚙','▣','◉','◇'][i]}</span></button>`
  ).join('');
}
