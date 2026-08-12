/* System Design Lab — Advanced architecture components + simulation engine v2 */
(function(){
'use strict';

const NEW_COMPONENTS=[
  {type:'WAF',group:'Network & Security',color:'#d98f76',icon:'🛡',fields:[
    s('Provider',['Cloudflare','AWS WAF','Azure WAF']),s('Enabled',['ON','OFF']),n('Block Malicious (%)',95),n('Max RPS',100000),n('False Positive (%)',0.1),s('Managed Rules',['ON','OFF']),n('Monthly Cost',25)
  ]},
  {type:'Region / AZ',group:'Network & Security',color:'#8da6c4',icon:'🌍',large:true,fields:[
    s('Provider',['Generic','AWS','Azure','GCP']),n('Regions',1),n('AZs / Region',2),s('Multi-Region',['OFF','Active-Passive','Active-Active']),n('Inter-Region Latency (ms)',80),s('Region Outage',['OFF','ON']),n('Monthly Fixed Cost',100)
  ]},
  {type:'BFF',group:'Services & Runtime',color:'#b7a6d8',icon:'◫',fields:[
    s('Runtime',['Node.js','Spring','ASP.NET Core']),n('Replicas',2),n('RPS / Replica',2500),n('Timeout (ms)',3000),s('Response Cache',['OFF','ON']),s('Auth Validation',['OIDC/JWT','Pass-through']),n('Monthly Cost / Replica',45)
  ]},
  {type:'Service Mesh',group:'Services & Runtime',color:'#9fbfc0',icon:'◈',fields:[
    s('Provider',['Istio','Linkerd','Consul']),s('mTLS',['ON','OFF']),n('Retries',2),s('Circuit Breaker',['ON','OFF']),n('Timeout (ms)',2000),n('Telemetry Overhead (ms)',4),n('Monthly Cost',20)
  ]},
  {type:'Identity Provider',group:'Services & Runtime',color:'#d9a7bb',icon:'🔑',fields:[
    s('Provider',['Microsoft Entra ID','Keycloak','Auth0','Okta']),s('MFA',['TOTP','FIDO2','SMS','OFF']),n('Replicas',2),n('RPS / Replica',1500),n('Availability (%)',99.99),n('Token TTL (min)',15),s('Refresh Tokens',['ON','OFF']),n('Monthly Cost',80)
  ]},
  {type:'Kubernetes',group:'Platform & Dependencies',color:'#9eb8da',icon:'☸',fields:[
    s('Platform',['Kubernetes','EKS','AKS','GKE']),n('Worker Nodes',3),n('Pods / Node',30),s('HPA',['ON','OFF']),n('Min Replicas',2),n('Max Replicas',10),n('Scale Threshold (%)',70),n('Scale Delay (s)',30),s('Pod Disruption Budget',['ON','OFF']),n('Restart Time (s)',15),n('Monthly Cost / Node',120)
  ]},
  {type:'External API',group:'Platform & Dependencies',color:'#d6bd93',icon:'↗',fields:[
    s('Provider',['Generic','Stripe','Twilio']),n('Base Latency (ms)',250),n('Availability (%)',99.9),n('Rate Limit RPS',1000),n('Timeout (ms)',2000),n('Failure Rate (%)',0.5),s('Circuit Breaker',['ON','OFF']),n('Cost / 1K Requests',0.5)
  ]}
];

const EXISTING_ENRICHMENTS={
  'CDN':[n('Cache Hit Ratio (%)',80),n('PoPs',50),s('Origin Shield',['ON','OFF']),s('DDoS Protection',['ON','OFF']),n('Capacity RPS',250000)],
  'Load Balancer':[n('Replicas',2),n('RPS / Replica',50000),n('Health Check (s)',5),s('Sticky Sessions',['OFF','ON']),n('Connection Timeout (ms)',5000)],
  'API Gateway':[n('Replicas',2),n('RPS / Replica',25000),s('Autoscaling',['ON','OFF']),n('Scale Threshold (%)',70),n('Timeout (ms)',5000),n('Retries',1),s('Circuit Breaker',['ON','OFF']),n('Burst Limit',5000)],
  'Web Server':[n('RPS / Replica',3000),n('Timeout (ms)',3000),s('Autoscaling',['ON','OFF']),n('Max Replicas',10)],
  'Microservice':[n('RPS / Replica',2500),n('Timeout (ms)',2500),n('Retries',1),s('Circuit Breaker',['ON','OFF']),s('Autoscaling',['ON','OFF']),n('Min Replicas',2),n('Max Replicas',12)],
  'Database':[n('RPS / Replica',10000),n('Read Ratio (%)',80),s('Replication Mode',['Async','Sync']),s('Consistency',['Strong','Eventual']),s('Automatic Failover',['ON','OFF']),n('Failover Time (s)',30),s('Multi-AZ',['ON','OFF'])],
  'Cache':[n('Capacity RPS',120000),n('Hit Ratio (%)',85),n('Cluster Replicas',2),s('Persistence',['ON','OFF']),s('Pre-Warming',['ON','OFF'])],
  'Message Queue':[n('Producer RPS',0),n('Consumer RPS',15000),n('Replication Factor',3),s('DLQ',['ON','OFF']),s('Idempotency',['ON','OFF'])]
};

const state={
  running:false,timer:null,
  scenario:{baseRps:12000,peak:1.5,attackRps:0,authPct:15,requestKB:12},
  last:null
};

function s(label,opts){return {label,type:'select',opts};}
function n(label,val){return {label,type:'input',val:String(val)};}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function pt(){return (localStorage.getItem('sdl:locale')||'pt-PT')!=='en';}
function numberValue(node,key,fallback){
  const raw=node&&node.config?node.config[key]:undefined;
  const v=parseFloat(String(raw==null?'':raw).replace(',','.'));
  return Number.isFinite(v)?v:fallback;
}
function textValue(node,key,fallback){const v=node&&node.config&&node.config[key];return v==null||v===''?fallback:String(v);}
function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
function hasField(cfg,label){return (cfg.fields||[]).some(f=>f.label===label);}

function addConfigFields(){
  if(typeof builderNodeConfigs==='undefined')return false;
  NEW_COMPONENTS.forEach(c=>{builderNodeConfigs[c.type]={fields:c.fields.map(f=>({...f,opts:f.opts?[...f.opts]:undefined}))};});
  Object.entries(EXISTING_ENRICHMENTS).forEach(([type,fields])=>{
    const cfg=builderNodeConfigs[type];if(!cfg)return;
    cfg.fields=cfg.fields||[];
    fields.forEach(f=>{if(!hasField(cfg,f.label))cfg.fields.push({...f,opts:f.opts?[...f.opts]:undefined});});
  });
  return true;
}

function registerVendors(){
  const v=window.SDLVendorComponents;if(!v)return false;
  Object.assign(v.BRAND,{
    cloudflare:{label:'Cloudflare',slug:'cloudflare'},istio:{label:'Istio',slug:'istio'},linkerd:{label:'Linkerd',slug:'linkerd'},consul:{label:'Consul',slug:'consul'},
    entra:{label:'Microsoft Entra ID',slug:'microsoftentra'},keycloak:{label:'Keycloak',slug:'keycloak'},auth0:{label:'Auth0',slug:'auth0'},okta:{label:'Okta',slug:'okta'},
    kubernetes:{label:'Kubernetes',slug:'kubernetes'},dotnet:{label:'.NET',slug:'dotnet'},stripe:{label:'Stripe',slug:'stripe'},twilio:{label:'Twilio',slug:'twilio'}
  });
  Object.assign(v.TYPES,{
    'WAF':{field:'Provider',values:{'Cloudflare':{brand:'cloudflare',product:'Cloudflare WAF'},'AWS WAF':{brand:'aws',product:'AWS WAF'},'Azure WAF':{brand:'azure',product:'Azure WAF'}}},
    'Region / AZ':{field:'Provider',values:{'Generic':{product:'Region / AZ'},'AWS':{brand:'aws',product:'AWS Region / AZ'},'Azure':{brand:'azure',product:'Azure Region / Zone'},'GCP':{brand:'gcp',product:'GCP Region / Zone'}}},
    'BFF':{field:'Runtime',values:{'Node.js':{brand:'node',product:'Node.js BFF'},'Spring':{brand:'spring',product:'Spring BFF'},'ASP.NET Core':{brand:'dotnet',product:'ASP.NET Core BFF'}}},
    'Service Mesh':{field:'Provider',values:{'Istio':{brand:'istio',product:'Istio'},'Linkerd':{brand:'linkerd',product:'Linkerd'},'Consul':{brand:'consul',product:'Consul Service Mesh'}}},
    'Identity Provider':{field:'Provider',values:{'Microsoft Entra ID':{brand:'entra',product:'Microsoft Entra ID'},'Keycloak':{brand:'keycloak',product:'Keycloak'},'Auth0':{brand:'auth0',product:'Auth0'},'Okta':{brand:'okta',product:'Okta'}}},
    'Kubernetes':{field:'Platform',values:{'Kubernetes':{brand:'kubernetes',product:'Kubernetes'},'EKS':{brand:'aws',product:'Amazon EKS'},'AKS':{brand:'azure',product:'Azure AKS'},'GKE':{brand:'gcp',product:'Google GKE'}}},
    'External API':{field:'Provider',values:{'Generic':{product:'External API'},'Stripe':{brand:'stripe',product:'Stripe API'},'Twilio':{brand:'twilio',product:'Twilio API'}}}
  });
  return true;
}

function makePaletteItem(c){
  const el=document.createElement('div');
  el.className='palette-item sdl-v2-palette-item';el.draggable=true;el.dataset.type=c.type;el.dataset.color=c.color;el.dataset.icon=c.icon;
  el.innerHTML=`<span>${esc(c.icon)}</span> ${esc(c.type)}`;
  el.addEventListener('dragstart',e=>{e.dataTransfer.setData('type',c.type);e.dataTransfer.setData('color',c.color);e.dataTransfer.setData('icon',c.icon);});
  el.addEventListener('dblclick',()=>{
    if(typeof builderAddNode!=='function'||typeof builder==='undefined'||!builder.canvas)return;
    const x=Math.round(((builder.canvas.width/2)-builder.pan.x)/builder.zoom/40)*40;
    const y=Math.round(((builder.canvas.height/2)-builder.pan.y)/builder.zoom/40)*40;
    builderAddNode(c.type,c.color,c.icon,x,y);
  });
  return el;
}

function injectPalette(){
  const palette=document.getElementById('builder-palette');if(!palette||palette.dataset.sdlV2)return false;
  palette.dataset.sdlV2='true';
  const groups={};
  NEW_COMPONENTS.forEach(c=>{
    if(!groups[c.group]){
      const h=document.createElement('h4');h.style.marginTop='12px';h.textContent=c.group;palette.appendChild(h);groups[c.group]=true;
    }
    palette.appendChild(makePaletteItem(c));
  });
  return true;
}

function setDefaults(node){
  const cfg=builderNodeConfigs[node.type];if(!cfg)return;
  node.config=node.config||{};
  (cfg.fields||[]).forEach(f=>{if(node.config[f.label]==null||node.config[f.label]==='')node.config[f.label]=f.type==='select'?(f.opts&&f.opts[0]||''):(f.val||'');});
  const def=NEW_COMPONENTS.find(c=>c.type===node.type);
  if(def&&def.large){node.w=Math.max(node.w||110,190);node.h=Math.max(node.h||50,88);}
}

function patchAddAndClear(){
  if(window.__sdlArchitectureV2Patched)return;
  window.__sdlArchitectureV2Patched=true;
  const add=builderAddNode;
  builderAddNode=function(type,color,icon,x,y){
    add(type,color,icon,x,y);if(builder.selected){setDefaults(builder.selected);if(window.SDLVendorComponents){try{window.SDLVendorComponents.configChanged('__noop',builder.selected.config.__noop||'');delete builder.selected.config.__noop;}catch(e){}}builderUpdateConfig();builderUpdateStats();builderDraw();}
  };
  const clear=builderClearAll;
  builderClearAll=function(){stop();clear();renderMetrics(null);};
}

function augmentExistingNodes(){if(typeof builder==='undefined')return;builder.nodes.forEach(setDefaults);}

function injectScenarioPanel(){
  const wrap=document.querySelector('#section-builder .builder-toolbar-wrap');if(!wrap||document.getElementById('sdl-arch-sim-v2'))return false;
  const panel=document.createElement('div');panel.id='sdl-arch-sim-v2';panel.innerHTML=`
    <div class="sdl-sim-v2-head">
      <div><strong>${pt()?'Cenário de Simulação':'Simulation Scenario'}</strong><span>${pt()?'As configurações dos componentes alteram estes resultados.':'Component configuration changes these results.'}</span></div>
      <button type="button" class="sdl-sim-v2-run" id="sdl-sim-v2-run">▶ ${pt()?'Executar':'Run'}</button>
    </div>
    <div class="sdl-sim-v2-controls">
      ${scenarioInput('baseRps',pt()?'Base RPS':'Base RPS',state.scenario.baseRps,100)}
      ${scenarioInput('peak',pt()?'Multiplicador Pico':'Peak Multiplier',state.scenario.peak,0.1)}
      ${scenarioInput('attackRps',pt()?'RPS de Ataque':'Attack RPS',state.scenario.attackRps,100)}
      ${scenarioInput('authPct',pt()?'Tráfego Auth %':'Auth Traffic %',state.scenario.authPct,1)}
      ${scenarioInput('requestKB',pt()?'Resposta Média KB':'Avg Response KB',state.scenario.requestKB,1)}
    </div>
    <div class="sdl-sim-v2-metrics" id="sdl-sim-v2-metrics"></div>
    <div class="sdl-sim-v2-findings" id="sdl-sim-v2-findings"></div>`;
  const toolbar=wrap.querySelector('.builder-toolbar');toolbar.insertAdjacentElement('afterend',panel);
  panel.addEventListener('input',e=>{const key=e.target&&e.target.dataset.scenario;if(!key)return;const v=parseFloat(e.target.value);if(Number.isFinite(v))state.scenario[key]=v;if(state.running)evaluateAndRender();});
  panel.querySelector('#sdl-sim-v2-run').addEventListener('click',toggle);
  renderMetrics(null);return true;
}
function scenarioInput(key,label,val,step){return `<label class="sdl-sim-v2-control"><span>${esc(label)}</span><input type="number" min="0" step="${step}" value="${val}" data-scenario="${key}"></label>`;}

function connected(node,type){
  if(!builder||!node)return false;
  return builder.edges.some(e=>{const f=builder.nodes.find(n=>n.id===e.from),t=builder.nodes.find(n=>n.id===e.to);return (f===node&&t&&t.type===type)||(t===node&&f&&f.type===type);});
}

function capacityFor(node,demand){
  setDefaults(node);
  switch(node.type){
    case 'WAF':return textValue(node,'Enabled','ON')==='ON'?numberValue(node,'Max RPS',100000):Infinity;
    case 'Load Balancer':return numberValue(node,'Replicas',2)*numberValue(node,'RPS / Replica',50000);
    case 'API Gateway':return numberValue(node,'Replicas',2)*numberValue(node,'RPS / Replica',25000);
    case 'BFF':return numberValue(node,'Replicas',2)*numberValue(node,'RPS / Replica',2500);
    case 'Web Server':return numberValue(node,'Replicas',3)*numberValue(node,'RPS / Replica',3000);
    case 'Microservice':{
      let reps=numberValue(node,'Replicas',2);if(textValue(node,'Autoscaling','ON')==='ON'&&demand>reps*numberValue(node,'RPS / Replica',2500)*0.7)reps=Math.min(numberValue(node,'Max Replicas',12),Math.max(reps,Math.ceil(demand/numberValue(node,'RPS / Replica',2500))));
      return reps*numberValue(node,'RPS / Replica',2500);
    }
    case 'Identity Provider':return numberValue(node,'Replicas',2)*numberValue(node,'RPS / Replica',1500);
    case 'Cache':return numberValue(node,'Capacity RPS',120000);
    case 'Database':return numberValue(node,'Replicas',3)*numberValue(node,'Shards',1)*numberValue(node,'RPS / Replica',10000);
    case 'Message Queue':return numberValue(node,'Consumer RPS',15000);
    case 'Kubernetes':{
      let cap=numberValue(node,'Worker Nodes',3)*numberValue(node,'Pods / Node',30)*250;
      if(textValue(node,'HPA','ON')==='ON')cap*=1.5;return cap;
    }
    case 'External API':return numberValue(node,'Rate Limit RPS',1000);
    case 'CDN':return numberValue(node,'Capacity RPS',250000);
    default:return Infinity;
  }
}

function evaluate(){
  if(typeof builder==='undefined')return null;
  augmentExistingNodes();
  const nodes=builder.nodes||[];
  const base=Math.max(0,state.scenario.baseRps)*Math.max(0,state.scenario.peak||1);
  const attack=Math.max(0,state.scenario.attackRps);
  const wafs=nodes.filter(n=>n.type==='WAF'&&textValue(n,'Enabled','ON')==='ON');
  const block=wafs.length?Math.max(...wafs.map(n=>numberValue(n,'Block Malicious (%)',95))):0;
  const attackPassed=attack*(1-clamp(block,0,100)/100);
  const cdns=nodes.filter(n=>n.type==='CDN');
  const cdnHit=cdns.length?Math.max(...cdns.map(n=>numberValue(n,'Cache Hit Ratio (%)',80))):0;
  const originBase=base*(1-clamp(cdnHit,0,99.5)/100);
  const originRps=originBase+attackPassed;
  const caches=nodes.filter(n=>n.type==='Cache');
  const cacheHit=caches.length?Math.max(...caches.map(n=>numberValue(n,'Hit Ratio (%)',85))):0;
  const dbRps=originRps*(1-clamp(cacheHit,0,99.5)/100);
  const authRps=originRps*clamp(state.scenario.authPct,0,100)/100;
  const findings=[];let maxLoad=0;let bottleneck=null;let queueBacklog=0;

  nodes.forEach(node=>{
    let demand=originRps;
    if(node.type==='CDN'||node.type==='WAF')demand=base+attack;
    if(node.type==='Identity Provider')demand=authRps;
    if(node.type==='Database')demand=dbRps;
    if(node.type==='Message Queue'){
      const producer=numberValue(node,'Producer RPS',0)||originRps*0.2;const consumer=numberValue(node,'Consumer RPS',15000);demand=producer;queueBacklog+=Math.max(0,producer-consumer);
    }
    if(node.type==='External API')demand=Math.min(originRps*0.25,originRps);
    const cap=capacityFor(node,demand);const load=cap===Infinity?0:(demand/Math.max(cap,1))*100;
    node.load=clamp(load,0,999);node.highlight=load>90;
    if(load>maxLoad){maxLoad=load;bottleneck=node;}
  });

  let latency=18;
  const mesh=nodes.find(n=>n.type==='Service Mesh');
  if(mesh){latency+=numberValue(mesh,'Telemetry Overhead (ms)',4)+(textValue(mesh,'mTLS','ON')==='ON'?1.5:0);}
  if(nodes.some(n=>n.type==='WAF'&&textValue(n,'Enabled','ON')==='ON'))latency+=3;
  if(nodes.some(n=>n.type==='BFF'))latency+=8;
  if(nodes.some(n=>n.type==='API Gateway'))latency+=5;
  if(caches.length)latency+=2;
  if(nodes.some(n=>n.type==='Database'))latency+=12;
  if(maxLoad>70)latency+=(maxLoad-70)*1.6;
  if(maxLoad>100)latency+=(maxLoad-100)*4;

  let externalError=0;
  nodes.filter(n=>n.type==='External API').forEach(n=>{
    const availabilityLoss=100-numberValue(n,'Availability (%)',99.9);let e=availabilityLoss+numberValue(n,'Failure Rate (%)',0.5);
    const cb=textValue(n,'Circuit Breaker','ON')==='ON';if(cb)e*=0.55;
    externalError=Math.max(externalError,e);
    const extLat=numberValue(n,'Base Latency (ms)',250);latency+=Math.min(extLat,numberValue(n,'Timeout (ms)',2000))*0.22;
    if(e>1)findings.push((pt()?'Dependência externa instável: ':'Unstable external dependency: ')+n.label+' ('+e.toFixed(1)+'% '+(pt()?'falha efetiva':'effective failure')+')');
  });

  let overloadError=maxLoad>100?Math.min(60,(maxLoad-100)*0.45):0;
  if(mesh&&textValue(mesh,'Circuit Breaker','ON')==='ON')overloadError*=0.75;
  const region=nodes.find(n=>n.type==='Region / AZ');let regionError=0;
  if(region){
    const mode=textValue(region,'Multi-Region','OFF'),outage=textValue(region,'Region Outage','OFF')==='ON';
    if(mode!=='OFF')latency+=numberValue(region,'Inter-Region Latency (ms)',80)*(mode==='Active-Active'?0.12:0.05);
    if(outage){regionError=mode==='Active-Active'?0.2:mode==='Active-Passive'?1.5:45;findings.push(pt()?'Falha regional ativa: a redundância Multi-Region está a determinar a disponibilidade.':'Active regional outage: Multi-Region redundancy is determining availability.');}
  }
  let errorRate=clamp(overloadError+externalError+regionError,0,99.9);
  let availability=clamp(100-errorRate,0.01,100);

  let security=42;
  if(wafs.length)security+=15;
  if(wafs.some(n=>textValue(n,'Managed Rules','ON')==='ON'))security+=5;
  if(mesh&&textValue(mesh,'mTLS','ON')==='ON')security+=10;
  const idp=nodes.find(n=>n.type==='Identity Provider');
  if(idp){const mfa=textValue(idp,'MFA','TOTP');security+=mfa==='FIDO2'?15:mfa==='TOTP'?12:mfa==='SMS'?6:0;if(textValue(idp,'Refresh Tokens','ON')==='ON')security+=2;}
  if(nodes.some(n=>n.type==='API Gateway'))security+=5;
  if(cdns.some(n=>textValue(n,'DDoS Protection','ON')==='ON'))security+=5;
  security=clamp(security,0,100);

  let cost=0;
  nodes.forEach(n=>{
    switch(n.type){
      case 'WAF':cost+=numberValue(n,'Monthly Cost',25);break;
      case 'Region / AZ':cost+=numberValue(n,'Monthly Fixed Cost',100)*numberValue(n,'Regions',1);break;
      case 'BFF':cost+=numberValue(n,'Monthly Cost / Replica',45)*numberValue(n,'Replicas',2);break;
      case 'Service Mesh':cost+=numberValue(n,'Monthly Cost',20);break;
      case 'Identity Provider':cost+=numberValue(n,'Monthly Cost',80);break;
      case 'Kubernetes':cost+=numberValue(n,'Monthly Cost / Node',120)*numberValue(n,'Worker Nodes',3);break;
      case 'External API':cost+=(originRps*3600*24*30/1000)*numberValue(n,'Cost / 1K Requests',0.5)*0.25;break;
      case 'Load Balancer':cost+=numberValue(n,'Replicas',2)*30;break;
      case 'API Gateway':cost+=numberValue(n,'Replicas',2)*50;break;
      case 'Web Server':cost+=numberValue(n,'Replicas',3)*35;break;
      case 'Microservice':cost+=numberValue(n,'Replicas',2)*30;break;
      case 'Database':cost+=numberValue(n,'Replicas',3)*numberValue(n,'Shards',1)*120;break;
      case 'Cache':cost+=numberValue(n,'Cluster Replicas',2)*40;break;
      case 'CDN':cost+=25;break;
      case 'Message Queue':cost+=numberValue(n,'Replication Factor',3)*35;break;
    }
  });

  if(attack>0&&!wafs.length)findings.push(pt()?'Não existe WAF: todo o tráfego de ataque está a atingir a arquitetura.':'No WAF: all attack traffic is reaching the architecture.');
  if(attack>0&&wafs.length)findings.push((pt()?'WAF bloqueia aproximadamente ':'WAF blocks approximately ')+(attack-attackPassed).toFixed(0)+' RPS '+(pt()?'maliciosos.':'of malicious traffic.'));
  if(maxLoad>85&&bottleneck)findings.push((pt()?'Bottleneck: ':'Bottleneck: ')+bottleneck.label+' '+maxLoad.toFixed(0)+'%');
  if(queueBacklog>0)findings.push((pt()?'Backlog da Queue cresce ':'Queue backlog grows by ')+queueBacklog.toFixed(0)+' msg/s');
  if(!nodes.some(n=>n.type==='Identity Provider')&&nodes.some(n=>n.type==='Auth Service'))findings.push(pt()?'Auth Service sem Identity Provider dedicado: considera separar federação/identidade da lógica aplicacional.':'Auth Service has no dedicated Identity Provider: consider separating identity federation from application logic.');
  if(nodes.some(n=>n.type==='Kubernetes'&&textValue(n,'HPA','ON')==='OFF')&&maxLoad>70)findings.push(pt()?'Kubernetes sem HPA durante carga elevada limita elasticidade.':'Kubernetes without HPA under high load limits elasticity.');

  return {baseRps:base,originRps,attackPassed,dbRps,authRps,maxLoad,bottleneck,latency,errorRate,availability,security,cost,queueBacklog,findings};
}

function metric(label,value,kind){return `<div class="sdl-sim-v2-metric ${kind||''}"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`;}
function renderMetrics(r){
  const m=document.getElementById('sdl-sim-v2-metrics'),f=document.getElementById('sdl-sim-v2-findings');if(!m||!f)return;
  if(!r){m.innerHTML=metric(pt()?'Estado':'Status',pt()?'Pronto':'Ready','neutral');f.innerHTML=`<span>${pt()?'Adiciona componentes, configura-os e executa o cenário.':'Add components, configure them and run the scenario.'}</span>`;return;}
  const loadKind=r.maxLoad>100?'bad':r.maxLoad>75?'warn':'good';const errKind=r.errorRate>5?'bad':r.errorRate>1?'warn':'good';
  m.innerHTML=[
    metric('Origin RPS',Math.round(r.originRps),loadKind),metric('DB RPS',Math.round(r.dbRps),r.dbRps>20000?'warn':'good'),
    metric('P99',Math.round(r.latency)+' ms',r.latency>500?'bad':r.latency>250?'warn':'good'),metric(pt()?'Disponibilidade':'Availability',r.availability.toFixed(2)+'%',errKind),
    metric(pt()?'Erros':'Errors',r.errorRate.toFixed(2)+'%',errKind),metric(pt()?'Carga Máx.':'Max Load',r.maxLoad.toFixed(0)+'%',loadKind),
    metric(pt()?'Segurança':'Security',r.security.toFixed(0)+'/100',r.security>=75?'good':r.security>=55?'warn':'bad'),metric(pt()?'Custo/mês':'Monthly Cost','$'+Math.round(r.cost).toLocaleString('en-US'),r.cost>5000?'warn':'neutral')
  ].join('');
  f.innerHTML=r.findings.length?r.findings.map(x=>`<div>• ${esc(x)}</div>`):`<div>✓ ${pt()?'Sem findings relevantes neste cenário.':'No material findings in this scenario.'}</div>`;
}

function emitPackets(){
  if(!state.running||typeof builder==='undefined')return;
  (builder.edges||[]).forEach(e=>{if(Math.random()<0.55){const a=builder.nodes.find(n=>n.id===e.from),b=builder.nodes.find(n=>n.id===e.to);if(a&&b)builder.simPackets.push({fx:a.x+a.w/2,fy:a.y+a.h/2,tx:b.x+b.w/2,ty:b.y+b.h/2,t:0,color:(a.highlight||b.highlight)?'#ff4757':'#4EA1FF'});}});
}
function evaluateAndRender(){state.last=evaluate();renderMetrics(state.last);emitPackets();if(typeof builderUpdateStats==='function')builderUpdateStats();if(typeof builderDraw==='function')builderDraw();return state.last;}
function start(){
  if(state.running)return;state.running=true;const b=document.getElementById('sdl-sim-v2-run');if(b){b.classList.add('running');b.textContent='■ '+(pt()?'Parar':'Stop');}
  evaluateAndRender();state.timer=setInterval(evaluateAndRender,850);
}
function stop(){state.running=false;if(state.timer){clearInterval(state.timer);state.timer=null;}const b=document.getElementById('sdl-sim-v2-run');if(b){b.classList.remove('running');b.textContent='▶ '+(pt()?'Executar':'Run');}if(typeof builder!=='undefined'){builder.nodes.forEach(n=>{n.load=0;n.highlight=false;});if(typeof builderDraw==='function')builderDraw();}}
function toggle(){state.running?stop():start();}

function patchSimulationButton(){
  if(window.__sdlSimulationButtonV2)return;window.__sdlSimulationButtonV2=true;
  builderSimulate=function(){toggle();};
}

function registerTranslations(){
  const e=window.SDLCoreContentI18N;if(!e||!e.dictionary)return;
  Object.assign(e.dictionary,{
    'Network & Security':'Rede e Segurança','Services & Runtime':'Serviços e Runtime','Platform & Dependencies':'Plataforma e Dependências',
    'Simulation Scenario':'Cenário de Simulação','Component configuration changes these results.':'As configurações dos componentes alteram estes resultados.',
    'Run':'Executar','Stop':'Parar','Peak Multiplier':'Multiplicador de Pico','Attack RPS':'RPS de Ataque','Auth Traffic %':'Tráfego Auth %','Avg Response KB':'Resposta Média KB',
    'Block Malicious (%)':'Bloqueio de Tráfego Malicioso (%)','False Positive (%)':'Falsos Positivos (%)','Managed Rules':'Regras Geridas','Monthly Cost':'Custo Mensal',
    'Worker Nodes':'Worker Nodes','Pods / Node':'Pods / Nó','Scale Delay (s)':'Atraso de Scale (s)','Pod Disruption Budget':'Pod Disruption Budget','Restart Time (s)':'Tempo de Restart (s)',
    'Base Latency (ms)':'Latência Base (ms)','Failure Rate (%)':'Taxa de Falha (%)','Rate Limit RPS':'Rate Limit RPS','Cost / 1K Requests':'Custo / 1K Pedidos',
    'Regions':'Regiões','AZs / Region':'AZs / Região','Inter-Region Latency (ms)':'Latência Inter-Region (ms)','Region Outage':'Falha de Região','Monthly Fixed Cost':'Custo Fixo Mensal',
    'RPS / Replica':'RPS / Réplica','Monthly Cost / Replica':'Custo Mensal / Réplica','Telemetry Overhead (ms)':'Overhead de Telemetria (ms)','Availability (%)':'Disponibilidade (%)',
    'Cache Hit Ratio (%)':'Cache Hit Ratio (%)','Hit Ratio (%)':'Hit Ratio (%)','Cluster Replicas':'Réplicas do Cluster','Automatic Failover':'Failover Automático','Failover Time (s)':'Tempo de Failover (s)',
    'Consumer RPS':'Consumer RPS','Producer RPS':'Producer RPS','Replication Factor':'Replication Factor'
  });
  if(e.refresh)e.refresh();
}

function observeChanges(){
  document.addEventListener('change',e=>{if(!state.running)return;if(e.target&&e.target.closest('#builder-config'))setTimeout(evaluateAndRender,0);});
  document.addEventListener('input',e=>{if(!state.running)return;if(e.target&&e.target.closest('#builder-config'))setTimeout(evaluateAndRender,50);});
  document.addEventListener('sdl:languagechange',()=>{const panel=document.getElementById('sdl-arch-sim-v2');if(panel){panel.remove();injectScenarioPanel();renderMetrics(state.last);}registerTranslations();});
}

function boot(){
  let tries=0;const timer=setInterval(()=>{
    tries++;
    if(typeof builder==='undefined'||typeof builderAddNode!=='function'||typeof builderNodeConfigs==='undefined'||!document.getElementById('builder-palette')){if(tries>160)clearInterval(timer);return;}
    clearInterval(timer);addConfigFields();registerVendors();injectPalette();augmentExistingNodes();patchAddAndClear();injectScenarioPanel();patchSimulationButton();registerTranslations();observeChanges();
    try{builderUpdateConfig();builderUpdateStats();builderDraw();}catch(e){}
  },75);
}

window.SDLArchitectureSimulationV2={state,evaluate,start,stop,toggle,components:NEW_COMPONENTS};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
