/* System Design Lab — Navigation v2 */
(function(){
'use strict';

const AREAS={
  learn:{label:'Learn',index:'01',desc:'Concepts, patterns and distributed-systems foundations.',accent:'#4EA1FF'},
  build:{label:'Build',index:'02',desc:'Architecture builders, visual tools and design analysis.',accent:'#FFB000'},
  simulate:{label:'Simulate',index:'03',desc:'Traffic, capacity, cost, chaos and failure behaviour.',accent:'#42D392'},
  security:{label:'Security',index:'04',desc:'Security architecture, OWASP, attacks and DevSecOps.',accent:'#FF7A00'},
  practice:{label:'Practice',index:'05',desc:'Questions, interviews, whiteboard and guided learning.',accent:'#F06292'}
};

const AREA_ORDER=['learn','build','simulate','security','practice'];
let catalog=[];
let currentArea='learn';
let signature='';
let initialized=false;
let rebuildTimer=null;

function norm(value){return String(value||'').replace(/\s+/g,' ').trim().toLowerCase();}
function cleanLabel(value){return String(value||'').replace(/^[•·▪▫◦\-–—>›→\s]+/,'').replace(/\s+/g,' ').trim();}
function routeOf(el){
  if(!el)return '';
  return el.dataset.section||el.dataset.secOpen||el.dataset.secRoute||el.dataset.securityRoute||
    el.getAttribute('data-security-section')||el.getAttribute('data-route')||el.getAttribute('data-target')||'';
}
function groupOf(el){
  const section=el.closest('.sidebar-section,.sdl-sec-sidebar-section');
  const heading=section&&section.querySelector('.sidebar-heading,.sdl-sec-sidebar-heading');
  return cleanLabel(heading?heading.textContent:'');
}
function classify(item){
  const text=norm([item.route,item.label,item.group,item.source.className].join(' '));
  if(item.source.classList.contains('sdl-sec-sidebar-item')||/security|owasp|devsecops|threat|attack/.test(text))return 'security';
  if(/interview|question|quiz|whiteboard|learning path|practice|challenge|game/.test(text))return 'practice';
  if(/builder|playground|3d|advisor|architecture builder|performance analyzer|perf analyzer|analyzer|design studio|canvas/.test(text))return 'build';
  if(/traffic|chaos|failure|latency|capacity|cost|resilien|simulation|simulator|heatmap|load test|stress/.test(text))return 'simulate';
  return 'learn';
}
function collect(){
  const sidebar=document.getElementById('sidebar');
  if(!sidebar)return [];
  return Array.from(sidebar.querySelectorAll('.sidebar-item')).filter(function(el){
    return !el.closest('#sdl-nav-v2');
  }).map(function(el,index){
    const item={source:el,label:cleanLabel(el.textContent)||('Module '+(index+1)),route:routeOf(el),group:groupOf(el),index:index};
    item.area=classify(item);
    item.key=norm(item.route||item.label)+'|'+index;
    return item;
  }).filter(function(item){return norm(item.route)!=='home'&&norm(item.label)!=='home';});
}
function sourceSignature(items){return items.map(function(i){return [i.route,i.label,i.area].join(':');}).join('|');}
function areaItems(area){return catalog.filter(function(i){return i.area===area;});}
function sourceForHome(){
  const all=Array.from(document.querySelectorAll('#sidebar .sidebar-item'));
  return all.find(function(el){return norm(routeOf(el))==='home'||norm(cleanLabel(el.textContent))==='home';});
}

function createRail(){
  if(document.getElementById('sdl-area-rail'))return;
  const rail=document.createElement('div');
  rail.id='sdl-area-rail';
  rail.setAttribute('role','navigation');
  rail.setAttribute('aria-label','System Design Lab areas');
  rail.innerHTML='<button class="sdl-rail-home" type="button" data-sdl-home>Home</button>'+
    AREA_ORDER.map(function(area){return '<button class="sdl-area-btn" type="button" data-sdl-area="'+area+'">'+AREAS[area].label+'</button>';}).join('')+
    '<div class="sdl-area-spacer"></div><div class="sdl-search-wrap"><input id="sdl-global-search" type="search" autocomplete="off" placeholder="Search modules…" aria-label="Search all modules"><span class="sdl-search-key">⌘K</span><div id="sdl-search-results" role="listbox"></div></div>';
  document.body.appendChild(rail);
  rail.querySelector('[data-sdl-home]').addEventListener('click',openHome);
  rail.querySelectorAll('[data-sdl-area]').forEach(function(btn){btn.addEventListener('click',function(){setArea(btn.dataset.sdlArea,true);});});
  const input=rail.querySelector('#sdl-global-search');
  input.addEventListener('input',function(){renderSearch(input.value);});
  input.addEventListener('focus',function(){if(input.value.trim())renderSearch(input.value);});
  document.addEventListener('click',function(e){if(!e.target.closest('.sdl-search-wrap'))closeSearch();});
  document.addEventListener('keydown',function(e){
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();input.focus();input.select();}
    if(e.key==='/'&&!/input|textarea|select/i.test((e.target&&e.target.tagName)||'')){e.preventDefault();input.focus();}
    if(e.key==='Escape'){closeSearch();input.blur();}
  });
}

function createSidebar(){
  const sidebar=document.getElementById('sidebar');
  if(!sidebar)return;
  let root=document.getElementById('sdl-nav-v2');
  if(!root){root=document.createElement('div');root.id='sdl-nav-v2';sidebar.appendChild(root);}
  renderSidebar(root,currentArea);
}
function groupCatalog(items){
  const groups=[];
  const map=new Map();
  items.forEach(function(item){
    let name=item.group||AREAS[item.area].label;
    if(/security engineering/i.test(name))name='Security Lab';
    if(!map.has(name)){const entry={name:name,items:[]};map.set(name,entry);groups.push(entry);}
    map.get(name).items.push(item);
  });
  return groups;
}
function renderSidebar(root,area){
  const config=AREAS[area];
  const items=areaItems(area);
  const groups=groupCatalog(items);
  root.innerHTML='<div class="sdl-side-head"><div class="sdl-side-eyebrow">'+config.index+' / '+config.label+'</div><div class="sdl-side-title">'+config.label+'</div><div class="sdl-side-desc">'+config.desc+'</div></div><div class="sdl-side-modules">'+
    (groups.length?groups.map(function(group){return '<div class="sdl-side-group"><div class="sdl-side-group-title">'+escapeHtml(group.name)+'</div>'+group.items.map(proxyHtml).join('')+'</div>';}).join(''):'<div class="sdl-search-empty">No modules classified in this area yet.</div>')+'</div>';
  root.querySelectorAll('[data-sdl-key]').forEach(function(btn){btn.addEventListener('click',function(){const item=catalog.find(function(i){return i.key===btn.dataset.sdlKey;});if(item)openItem(item);});});
  syncActive();
}
function proxyHtml(item){return '<button class="sdl-proxy-item" type="button" data-sdl-key="'+escapeAttr(item.key)+'" title="'+escapeAttr(item.label)+'"><span class="sdl-proxy-dot"></span><span>'+escapeHtml(item.label)+'</span></button>';}

function createContextBar(){
  const main=document.getElementById('main');
  if(!main||document.getElementById('sdl-context-bar'))return;
  const bar=document.createElement('div');bar.id='sdl-context-bar';bar.innerHTML='<span>System Design Lab</span><span class="sdl-context-sep">/</span><span class="sdl-context-area">Home</span>';
  main.insertBefore(bar,main.firstChild);
}
function updateContext(item){
  const bar=document.getElementById('sdl-context-bar');if(!bar)return;
  if(!item){bar.innerHTML='<span>System Design Lab</span><span class="sdl-context-sep">/</span><span class="sdl-context-area">Home</span>';return;}
  bar.innerHTML='<span>System Design Lab</span><span class="sdl-context-sep">/</span><span class="sdl-context-area">'+escapeHtml(AREAS[item.area].label)+'</span><span class="sdl-context-sep">/</span><span class="sdl-context-current">'+escapeHtml(item.label)+'</span>';
}

function createHomeDashboard(){
  const home=document.getElementById('section-home');
  if(!home||document.getElementById('sdl-home-dashboard'))return;
  const dash=document.createElement('div');dash.id='sdl-home-dashboard';
  home.insertBefore(dash,home.firstChild);
  renderHomeDashboard();
}
function topItems(area,count){
  const preferred={
    learn:['fundament','hld','distributed','design pattern'],
    build:['builder','3d','analyzer','playground'],
    simulate:['traffic','chaos','cost','capacity'],
    security:['security architecture','owasp','attack','devsecops'],
    practice:['question','mock interview','whiteboard','learning path']
  }[area];
  const items=areaItems(area).slice();
  items.sort(function(a,b){
    function score(x){const h=norm(x.label+' '+x.route);let s=0;preferred.forEach(function(k,i){if(h.includes(k))s+=20-i;});return s;}
    return score(b)-score(a);
  });
  return items.slice(0,count);
}
function renderHomeDashboard(){
  const dash=document.getElementById('sdl-home-dashboard');if(!dash)return;
  const quick=[
    findBest(['builder','architecture builder']),findBest(['traffic','simulator']),findBest(['security-hub','security lab']),findBest(['mock interview','interview coach'])
  ].filter(Boolean);
  dash.innerHTML='<div class="sdl-home-wrap"><div class="sdl-home-kicker">Interactive architecture workspace</div><div class="sdl-home-title">Learn. Build. Simulate.<br><span>Secure systems.</span></div><p class="sdl-home-lead">A structured workspace for system design, distributed architectures, resilience, security engineering and interview practice. Choose a path instead of navigating one long catalogue.</p>'+
    '<div class="sdl-home-quick">'+quick.map(function(i){return '<button class="sdl-quick-btn" type="button" data-home-key="'+escapeAttr(i.key)+'">'+escapeHtml(i.label)+'</button>';}).join('')+'</div>'+
    '<div class="sdl-path-grid">'+AREA_ORDER.map(pathCardHtml).join('')+'</div><div class="sdl-home-foot"><strong>Navigation v2</strong><span>The original laboratories remain intact; this layer groups them by intent and adds global search.</span></div></div>';
  dash.querySelectorAll('[data-home-key]').forEach(function(btn){btn.addEventListener('click',function(){const item=catalog.find(function(i){return i.key===btn.dataset.homeKey;});if(item)openItem(item);});});
  dash.querySelectorAll('[data-home-area]').forEach(function(btn){btn.addEventListener('click',function(){setArea(btn.dataset.homeArea,true);});});
}
function pathCardHtml(area){
  const config=AREAS[area];const items=topItems(area,4);
  return '<article class="sdl-path-card sdl-path-'+area+'"><div class="sdl-path-index">'+config.index+' / '+config.label.toUpperCase()+'</div><h2>'+config.label+'</h2><p>'+config.desc+'</p><div class="sdl-path-links">'+items.map(function(i){return '<button class="sdl-path-link" type="button" data-home-key="'+escapeAttr(i.key)+'">'+escapeHtml(i.label)+'</button>';}).join('')+'</div><button class="sdl-path-open" type="button" data-home-area="'+area+'">Explore '+config.label+' →</button></article>';
}
function findBest(terms){
  for(const term of terms){const hit=catalog.find(function(i){return norm(i.route+' '+i.label).includes(norm(term));});if(hit)return hit;}
  return null;
}

function setArea(area,focusSidebar){
  if(!AREAS[area])return;
  currentArea=area;
  document.querySelectorAll('.sdl-area-btn').forEach(function(btn){btn.classList.toggle('active',btn.dataset.sdlArea===area);});
  const root=document.getElementById('sdl-nav-v2');if(root)renderSidebar(root,area);
  if(focusSidebar){const sidebar=document.getElementById('sidebar');if(sidebar)sidebar.scrollTop=0;}
}
function openItem(item){
  if(!item||!item.source)return;
  setArea(item.area,false);
  closeSearch();
  try{item.source.click();}catch(e){console.warn('Navigation proxy could not click source module',e);}
  localStorage.setItem('sdl:last-module',item.route||item.label);
  setTimeout(function(){syncActive(item);},40);
}
function openHome(){
  closeSearch();
  const home=sourceForHome();
  if(home){home.click();}
  else if(typeof window.showSection==='function'){window.showSection('home');}
  document.querySelectorAll('.sdl-area-btn').forEach(function(btn){btn.classList.remove('active');});
  updateContext(null);
  setTimeout(function(){const main=document.getElementById('main');if(main)main.scrollTop=0;window.scrollTo({top:0,behavior:'smooth'});},20);
}
function activeItem(){
  const activeSource=Array.from(document.querySelectorAll('#sidebar .sidebar-item.active')).find(function(el){return !el.closest('#sdl-nav-v2');});
  if(activeSource){return catalog.find(function(i){return i.source===activeSource;})||null;}
  const activeSec=document.querySelector('.sdl-security-section.active');
  if(activeSec){return catalog.find(function(i){return i.route===activeSec.id||norm(i.label)===norm(activeSec.querySelector('.page-title')&&activeSec.querySelector('.page-title').textContent);})||null;}
  return null;
}
function syncActive(preferred){
  const item=preferred||activeItem();
  document.querySelectorAll('.sdl-proxy-item').forEach(function(btn){btn.classList.toggle('active',!!item&&btn.dataset.sdlKey===item.key);});
  if(item){
    if(currentArea!==item.area)setArea(item.area,false);
    updateContext(item);
  }else{
    const home=document.getElementById('section-home');
    if(home&&home.classList.contains('active'))updateContext(null);
  }
}

function renderSearch(query){
  const results=document.getElementById('sdl-search-results');if(!results)return;
  const q=norm(query);
  if(!q){closeSearch();return;}
  const tokens=q.split(' ').filter(Boolean);
  const matches=catalog.map(function(item){
    const hay=norm(item.label+' '+item.route+' '+item.group+' '+AREAS[item.area].label);
    let score=0;tokens.forEach(function(t){if(norm(item.label).startsWith(t))score+=7;else if(norm(item.label).includes(t))score+=5;else if(hay.includes(t))score+=2;else score-=20;});
    return {item:item,score:score};
  }).filter(function(x){return x.score>=0;}).sort(function(a,b){return b.score-a.score||a.item.label.localeCompare(b.item.label);}).slice(0,12);
  results.innerHTML=matches.length?matches.map(function(x){return '<button class="sdl-search-result" type="button" data-search-key="'+escapeAttr(x.item.key)+'"><strong>'+escapeHtml(x.item.label)+'</strong><span>'+escapeHtml(AREAS[x.item.area].label+(x.item.group?' · '+x.item.group:''))+'</span></button>';}).join(''):'<div class="sdl-search-empty">No matching modules</div>';
  results.classList.add('open');
  results.querySelectorAll('[data-search-key]').forEach(function(btn){btn.addEventListener('click',function(){const item=catalog.find(function(i){return i.key===btn.dataset.searchKey;});if(item)openItem(item);});});
}
function closeSearch(){const results=document.getElementById('sdl-search-results');if(results)results.classList.remove('open');}

function rebuild(force){
  const next=collect();
  const nextSig=sourceSignature(next);
  if(!force&&nextSig===signature)return;
  catalog=next;signature=nextSig;
  createSidebar();renderHomeDashboard();syncActive();
}
function observe(){
  const sidebar=document.getElementById('sidebar');if(!sidebar)return;
  const observer=new MutationObserver(function(mutations){
    let needsCatalog=false;let needsActive=false;
    mutations.forEach(function(m){
      if(m.type==='childList')needsCatalog=true;
      if(m.type==='attributes'&&m.attributeName==='class'&&m.target.classList&&m.target.classList.contains('sidebar-item'))needsActive=true;
    });
    if(needsCatalog){clearTimeout(rebuildTimer);rebuildTimer=setTimeout(function(){rebuild(false);},80);}
    if(needsActive)setTimeout(syncActive,0);
  });
  observer.observe(sidebar,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  const main=document.getElementById('main');
  if(main){new MutationObserver(function(){syncActive();}).observe(main,{subtree:true,attributes:true,attributeFilter:['class']});}
}

function escapeHtml(v){return String(v||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function escapeAttr(v){return escapeHtml(v);}

function init(){
  if(initialized)return;
  const sidebar=document.getElementById('sidebar');const main=document.getElementById('main');
  if(!sidebar||!main){setTimeout(init,80);return;}
  initialized=true;
  catalog=collect();signature=sourceSignature(catalog);
  document.body.classList.add('sdl-nav-v2');
  createRail();createSidebar();createContextBar();createHomeDashboard();observe();
  setArea((activeItem()||{}).area||'learn',false);
  setTimeout(function(){rebuild(true);},350);
  setTimeout(function(){rebuild(true);},1000);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else setTimeout(init,0);
})();
