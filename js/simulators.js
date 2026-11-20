function simView() {
  return `<div class="hero"><div class="eyebrow">COMPRENDRE LES MÉCANISMES</div><h1>Simulateurs visuels.</h1>` +
    `<p class="muted">Expérimente les concepts derrière les commandes : droits Unix, ordonnanceur, mémoire virtuelle et réseau. Modèles didactiques simplifiés, non mesures réelles.</p>` +
    `<div class="actions">${[['process','Processus'],['permissions','Permissions'],['memory','Mémoire'],['network','Réseau']].map(([id,n])=>`<button class="${state.sim===id?'primary':''}" data-sim="${id}">${n}</button>`).join('')}</div>` +
    `</div><div id="simcontent">${simContent()}</div>`
}
function simContent() {
  let tick = state.simTick;
  if (state.sim === 'process') {
    let procs =[['PID 101','bash',4],['PID 102','grep',2],['PID 103','python',6]];
    return `<div class="card"><h2>Ordonnancement CPU · Round Robin</h2>` +
      `<p>Un seul processus occupe le CPU à un instant donné. Clique sur « Tick » pour visualiser une allocation successive simplifiée.</p>` +
      `<div class="grid">${procs.map((p,i)=>`<div class="card"><span class="tag">${p[0]}</span><h3>${p[1]}</h3><div class="meter"><div style="width:${Math.max(0,100-(tick*15+(i*20))%100)}%"></div></div><p>${tick%3===i?'🟢 RUNNING':'🟡 READY / WAITING'}</p></div>`).join('')}</div>` +
      `<div class="actions"><button class="primary" data-tick="1">▶ Tick ordonnanceur</button><button data-tickreset="1">Réinitialiser</button></div>` +
      `<div class="hint">Un vrai ordonnanceur Linux est plus complexe que cette rotation. Les états affichés servent à comprendre l'alternance des tâches.</div></div>`;
  }
  if (state.sim === 'permissions') {
    let val = state.perm || '754';
    return `<div class="card"><h2>Calculateur de permissions rwx</h2>` +
      `<p>Chaque chiffre octal additionne lecture (4), écriture (2) et exécution (1).</p>` +
      `<div class="grid">${['Propriétaire','Groupe','Autres'].map((label,i)=>`<div class="card"><h3>${label}</h3><select data-perm="${i}">${[0,1,2,3,4,5,6,7].map(n=>`<option value="${n}" ${Number(val[i])===n?'selected':''}>${n} · ${n&4?'r':'-'}${n&2?'w':'-'}${n&1?'x':'-'}</option>`).join('')}</select></div>`).join('')}</div>` +
      `<h2 class="code">chmod ${val} fichier.txt · ${val.split('').map(n=>`${n&4?'r':'-'}${n&2?'w':'-'}${n&1?'x':'-'}`).join('')}</h2>` +
      `<p class="muted">Attention : sur un répertoire, x autorise la traversée ; r autorise l'énumération des noms et w la modification des entrées (avec x).</p></div>`;
  }
  if (state.sim === 'memory') {
    let ram = state.ram || 65;
    return `<div class="card"><h2>Mémoire, cache et pression</h2>` +
      `<p>Déplace le curseur pour simuler une hausse de consommation. La mémoire « disponible » tient compte de pages de cache récupérables.</p>` +
      `<label for="ram">Pression mémoire : ${ram}%</label>` +
      `<input id="ram" type="range" min="10" max="99" value="${ram}"><div class="meter"><div style="width:${ram}%"></div></div>` +
      `<div class="grid" style="margin-top:15px"><div class="card"><div class="big">${(8*ram/100).toFixed(1)} Go</div><p>RAM occupée (simulation)</p></div><div class="card"><div class="big">${(8*(100-ram)/100+1).toFixed(1)} Go</div><p>RAM récupérable estimée</p></div><div class="card"><div class="big">${ram>88?'ÉLEVÉE':'MODÉRÉE'}</div><p>Pression mémoire</p></div></div>` +
      `<p class="hint">free -h et /proc/meminfo sont à interpréter ensemble : « free » seul ne mesure pas la capacité réelle à démarrer une application.</p></div>`;
  }
  return `<div class="card"><h2>Chemin d'une requête réseau</h2>` +
      `<p>Une requête par nom dépend de la résolution DNS, de la table de routage, de l'interface et de la disponibilité du service.</p>` +
      `<div class="grid">${[['1','DNS','dig example.org'],['2','ROUTAGE','ip route'],['3','INTERFACE','ip addr'],['4','SOCKET','ss -tuln']].map(x=>`<div class="card"><span class="tag">ÉTAPE ${x[0]}</span><h3>${x[1]}</h3><div class="code">${x[2]}</div></div>`).join('')}</div>` +
      `<p class="hint">Un ping qui échoue ne prouve pas que le service HTTP est indisponible : ICMP peut être filtré. Vérifie aussi les sockets et les journaux.</p></div>`
}
