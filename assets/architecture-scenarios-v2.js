/* System Design Lab — integrated incident scenarios for Architecture Simulation v2 */
(function(){
'use strict';

const SCENARIOS={
  nodeFailure:{titlePT:'Falha de Nó',titleEN:'Node Failure',descPT:'Reduz réplicas num serviço executável e observa redistribuição e saturação.',descEN:'Reduces replicas on a runnable service and observes redistribution and saturation.'},
  dbOutage:{titlePT:'DB Outage',titleEN:'DB Outage',descPT:'Simula indisponibilidade da base de dados e força o sistema a operar sem capacidade de persistência.',descEN:'Simulates database unavailability and removes persistence capacity.'},
  cacheFailure:{titlePT:'Falha de Cache',titleEN:'Cache Failure',descPT:'Elimina o Cache Hit Ratio e força o tráfego a atingir a base de dados.',descEN:'Removes cache hit ratio and pushes traffic to the database.'},
  externalOutage:{titlePT:'External API Outage',titleEN:'External API Outage',descPT:'Degrada disponibilidade e latência da dependência externa.',descEN:'Degrades availability and latency of the external dependency.'},
  regionOutage:{titlePT:'Region Outage',titleEN:'Region Outage',descPT:'Ativa uma falha regional e deixa a estratégia Multi-Region determinar o impacto.',descEN:'Activates a regional outage and lets Multi-Region strategy determine impact.'},
  ddos:{titlePT:'DDoS',titleEN:'DDoS',descPT:'Adiciona tráfego malicioso elevado para testar WAF, CDN e capacidade do edge.',descEN:'Adds high malicious traffic to test WAF, CDN and edge capacity.'},
  retryStorm:{titlePT:'Retry Storm',titleEN:'Retry Storm',descPT:'Aumenta retries e carga efetiva, expondo falhas em cascata.',descEN:'Increases retries and effective load, exposing cascading failures.'},
  queueBacklog:{titlePT:'Queue Backlog',titleEN:'Queue Backlog',descPT:'Aumenta produção acima da capacidade dos consumers.',descEN:'Raises production above consumer capacity.'}
};

const incident={active:null,snapshot:null,startedAt:null,lastBefore:null,lastAfter:null,log:[]};
function pt(){return (localStorage.getItem('sdl:locale')||'pt-PT')!=='en';}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function sim(){return window.SDLArchitectureSimulationV2;}
function b(){return typeof builder!=='undefined'?builder:null;}
function clone(v){return JSON.parse(JSON.stringify(v));}
function now(){return new Date().toLocaleTimeString(pt()?'pt-PT':'en-GB',{hour12:false});}
function log(msg){incident.log.unshift('['+now()+'] '+msg);incident.log=incident.log.slice(0,8);renderTimeline();}
function nodeOf(types){const bb=b();if(!bb)return null;for(const t of types){const n=bb.nodes.find(x=>x.type===t);if(n)return n;}return null;}
function cfg(node,key,val){if(!node)return;node.config=node.config||{};node.config[key]=String(val);}
function num(node,key,fallback){const v=parseFloat(node&&node.config?node.config[key]:NaN);return Number.isFinite(v)?v:fallback;}
function text(node,key,fallback){const v=node&&node.config?node.config[key]:undefined;return v==null||v===''?fallback:String(v);}

function takeSnapshot(){
  const s=sim(),bb=b();if(!s||!bb)return null;
  return {scenario:clone(s.state.scenario),nodes:bb.nodes.map(n=>({id:n.id,config:clone(n.config||{}),load:n.load||0,highlight:!!n.highlight}))};
}
function restoreSnapshot(snap){
  const s=sim(),bb=b();if(!snap||!s||!bb)return;
  Object.assign(s.state.scenario,clone(snap.scenario));
  snap.nodes.forEach(saved=>{const n=bb.nodes.find(x=>x.id===saved.id);if(n){n.config=clone(saved.config);n.load=saved.load;n.highlight=saved.highlight;}});
  syncScenarioInputs();
  try{builderUpdateConfig();builderUpdateStats();builderDraw();}catch(e){}
}
function syncScenarioInputs(){
  const s=sim();if(!s)return;
  document.querySelectorAll('[data-scenario]').forEach(el=>{const k=el.dataset.scenario;if(Object.prototype.hasOwnProperty.call(s.state.scenario,k))el.value=s.state.scenario[k];});
}

function applyNodeFailure(){
  const n=nodeOf(['Microservice','Web Server','BFF','API Gateway','Load Balancer','Identity Provider']);
  if(!n){log(pt()?'Não existe serviço elegível para falha de nó.':'No eligible service exists for node failure.');return false;}
  const reps=Math.max(1,num(n,'Replicas',2));cfg(n,'Replicas',Math.max(1,reps-1));n.highlight=true;log((pt()?'Nó removido em ':'Node removed from ')+n.label+': '+reps+' → '+Math.max(1,reps-1)+' replicas');return true;
}
function applyDbOutage(){const n=nodeOf(['Database']);if(!n){log(pt()?'Não existe Database no diagrama.':'No Database exists in the diagram.');return false;}cfg(n,'Replicas',0);cfg(n,'Automatic Failover','OFF');n.highlight=true;log(pt()?'Database sem réplicas disponíveis.':'Database has no available replicas.');return true;}
function applyCacheFailure(){const n=nodeOf(['Cache']);if(!n){log(pt()?'Não existe Cache no diagrama.':'No Cache exists in the diagram.');return false;}cfg(n,'Hit Ratio (%)',0);cfg(n,'Capacity RPS',1);n.highlight=true;log(pt()?'Cache Hit Ratio reduzido para 0%; tráfego passa para a BD.':'Cache hit ratio reduced to 0%; traffic falls through to DB.');return true;}
function applyExternalOutage(){const n=nodeOf(['External API']);if(!n){log(pt()?'Não existe External API no diagrama.':'No External API exists in the diagram.');return false;}cfg(n,'Availability (%)',75);cfg(n,'Failure Rate (%)',20);cfg(n,'Base Latency (ms)',1500);n.highlight=true;log(pt()?'External API degradada para 75% availability e 1500 ms.':'External API degraded to 75% availability and 1500 ms.');return true;}
function applyRegionOutage(){const n=nodeOf(['Region / AZ']);if(!n){log(pt()?'Não existe Region / AZ no diagrama.':'No Region / AZ exists in the diagram.');return false;}cfg(n,'Region Outage','ON');n.highlight=true;log((pt()?'Falha regional ativada; modo Multi-Region: ':'Regional outage active; Multi-Region mode: ')+text(n,'Multi-Region','OFF'));return true;}
function applyDdos(){const s=sim();if(!s)return false;const baseline=Math.max(1000,s.state.scenario.baseRps||12000);s.state.scenario.attackRps=Math.max(100000,baseline*8);syncScenarioInputs();log((pt()?'DDoS injetado: ':'DDoS injected: ')+Math.round(s.state.scenario.attackRps)+' attack RPS');return true;}
function applyRetryStorm(){
  const s=sim(),bb=b();if(!s||!bb)return false;let changed=0;
  ['API Gateway','Microservice','Service Mesh'].forEach(t=>bb.nodes.filter(n=>n.type===t).forEach(n=>{if(n.config&&Object.prototype.hasOwnProperty.call(n.config,'Retries')){const old=num(n,'Retries',1);cfg(n,'Retries',Math.max(5,old*4));changed++;}}));
  s.state.scenario.peak=Math.max(3,(s.state.scenario.peak||1)*2);syncScenarioInputs();log((pt()?'Retry Storm: retries elevados em ':'Retry storm: retries increased on ')+changed+' '+(pt()?'componentes; pico de tráfego ampliado.':'components; traffic peak amplified.'));return true;
}
function applyQueueBacklog(){const n=nodeOf(['Message Queue']);if(!n){log(pt()?'Não existe Message Queue no diagrama.':'No Message Queue exists in the diagram.');return false;}const consumer=Math.max(1,num(n,'Consumer RPS',15000));cfg(n,'Producer RPS',consumer*3);cfg(n,'Consumer RPS',consumer);n.highlight=true;log((pt()?'Producer RPS elevado para ':'Producer RPS raised to ')+Math.round(consumer*3)+'; consumers permanecem em '+Math.round(consumer));return true;}

const APPLY={nodeFailure:applyNodeFailure,dbOutage:applyDbOutage,cacheFailure:applyCacheFailure,externalOutage:applyExternalOutage,regionOutage:applyRegionOutage,ddos:applyDdos,retryStorm:applyRetryStorm,queueBacklog:applyQueueBacklog};

function activate(name){
  const s=sim();if(!s||!b())return;
  if(incident.active)reset(false);
  incident.snapshot=takeSnapshot();incident.lastBefore=s.evaluate();incident.active=name;incident.startedAt=Date.now();incident.log=[];
  const ok=APPLY[name]&&APPLY[name]();if(!ok){incident.active=null;incident.snapshot=null;render();return;}
  incident.lastAfter=s.evaluate();if(!s.state.running)s.start();
  document.querySelectorAll('.sdl-scenario-btn').forEach(x=>x.classList.toggle('active',x.dataset.incident===name));
  renderStatus();
}
function reset(writeLog=true){
  const s=sim();if(incident.snapshot)restoreSnapshot(incident.snapshot);
  const old=incident.active;incident.active=null;incident.startedAt=null;incident.lastAfter=s?s.evaluate():null;incident.snapshot=null;
  document.querySelectorAll('.sdl-scenario-btn').forEach(x=>x.classList.remove('active'));
  if(writeLog&&old)log(pt()?'Cenário reposto para o baseline.':'Scenario reset to baseline.');
  renderStatus();
}

function impactText(){
  if(!incident.lastBefore||!incident.lastAfter)return '';
  const a=incident.lastBefore,b=incident.lastAfter;
  const p99=Math.round(b.latency-a.latency),err=(b.errorRate-a.errorRate).toFixed(1),avail=(b.availability-a.availability).toFixed(1),load=Math.round(b.maxLoad-a.maxLoad);
  return `ΔP99 ${p99>=0?'+':''}${p99}ms · ΔErr ${err>=0?'+':''}${err}% · ΔAvail ${avail>=0?'+':''}${avail}% · ΔLoad ${load>=0?'+':''}${load}%`;
}
function renderTimeline(){const el=document.getElementById('sdl-scenario-timeline');if(el)el.innerHTML=incident.log.map(x=>'<div>'+esc(x)+'</div>').join('');}
function renderStatus(){
  const status=document.getElementById('sdl-scenario-status');if(!status)return;
  if(!incident.active){status.innerHTML=`<div><strong>${pt()?'Sem incidente ativo':'No active incident'}</strong><span>${pt()?'Seleciona um cenário para alterar a arquitetura em execução.':'Select a scenario to alter the running architecture.'}</span></div><div class="sdl-scenario-impact">BASELINE</div>`;return;}
  const sc=SCENARIOS[incident.active];status.innerHTML=`<div><strong>${esc(pt()?sc.titlePT:sc.titleEN)}</strong><span>${esc(pt()?sc.descPT:sc.descEN)}</span></div><div class="sdl-scenario-impact">${esc(impactText())}</div>`;
}
function render(){renderStatus();renderTimeline();}

function inject(){
  const host=document.getElementById('sdl-arch-sim-v2');if(!host||document.getElementById('sdl-arch-scenarios-v2'))return false;
  const panel=document.createElement('div');panel.id='sdl-arch-scenarios-v2';
  panel.innerHTML=`<div class="sdl-scenario-head"><div><strong>${pt()?'Cenários de Falha & Ataque':'Failure & Attack Scenarios'}</strong><span>${pt()?'Os incidentes alteram configurações reais dos componentes e recalculam o motor v2.':'Incidents mutate real component configuration and recalculate engine v2.'}</span></div><div class="sdl-scenario-actions"><button class="sdl-scenario-reset" type="button">↺ ${pt()?'Reset':'Reset'}</button></div></div><div class="sdl-scenario-grid">${Object.entries(SCENARIOS).map(([k,v])=>`<button type="button" class="sdl-scenario-btn" data-incident="${k}"><b>${esc(pt()?v.titlePT:v.titleEN)}</b><small>${esc(pt()?v.descPT:v.descEN)}</small></button>`).join('')}</div><div class="sdl-scenario-status" id="sdl-scenario-status"></div><div class="sdl-scenario-timeline" id="sdl-scenario-timeline"></div>`;
  host.appendChild(panel);
  panel.querySelectorAll('.sdl-scenario-btn').forEach(btn=>btn.addEventListener('click',()=>activate(btn.dataset.incident)));
  panel.querySelector('.sdl-scenario-reset').addEventListener('click',()=>reset(true));
  render();return true;
}

function languageRefresh(){
  const old=document.getElementById('sdl-arch-scenarios-v2');if(old){const active=incident.active;old.remove();inject();if(active)document.querySelector(`[data-incident="${active}"]`)?.classList.add('active');render();}
}
function boot(){let tries=0;const t=setInterval(()=>{tries++;if(inject()||tries>100)clearInterval(t);},75);document.addEventListener('sdl:languagechange',languageRefresh);}
window.SDLArchitectureScenariosV2={SCENARIOS,incident,activate,reset};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
