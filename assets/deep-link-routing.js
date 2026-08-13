/* System Design Lab — Deep-link routing */
(function(){
'use strict';

if(!document.querySelector('script[data-sdl-builder-simulation-paths]')){
  const simPath=document.createElement('script');
  simPath.src='./assets/builder-simulation-paths.js?v=1';
  simPath.async=false;
  simPath.dataset.sdlBuilderSimulationPaths='true';
  document.body.appendChild(simPath);
}

const ALIASES={
  '3dlab':'lab3d',
  '3d-lab':'lab3d',
  '3darchitecture':'lab3d',
  '3d-architecture':'lab3d',
  'architecture3d':'lab3d',
  'architecture-3d':'lab3d'
};
let lastOpened='';

function cleanHash(){
  let value=(window.location.hash||'').replace(/^#\/?!?/,'').trim();
  try{value=decodeURIComponent(value);}catch(e){}
  value=value.toLowerCase();
  return ALIASES[value]||value;
}

function findLegacySource(route){
  return Array.from(document.querySelectorAll('#sidebar .sidebar-item')).find(function(el){
    const onclick=el.getAttribute('onclick')||'';
    return onclick.indexOf("showSection('"+route+"')")!==-1||onclick.indexOf('showSection("'+route+'")')!==-1;
  })||null;
}

function openRoute(route,attempt){
  attempt=attempt||0;
  if(!route||route==='home')return false;
  const target=document.getElementById('section-'+route);
  if(!target||typeof window.showSection!=='function'){
    if(attempt<20)setTimeout(function(){openRoute(route,attempt+1);},75);
    return false;
  }

  if(lastOpened===route&&target.classList.contains('active'))return true;
  lastOpened=route;
  window.showSection(route);

  const source=findLegacySource(route);
  if(source){
    document.querySelectorAll('#sidebar .sidebar-item.active').forEach(function(el){el.classList.remove('active');});
    source.classList.add('active');
  }

  if(route==='lab3d'){
    document.body.classList.add('sdl-deeplink-lab3d');
    setTimeout(function(){
      window.dispatchEvent(new Event('resize'));
      const main=document.getElementById('main');
      if(main)main.scrollTop=0;
      window.scrollTo(0,0);
    },120);
  }

  setTimeout(function(){
    const active=document.getElementById('section-'+route);
    if(active&&!active.classList.contains('active'))window.showSection(route);
  },250);
  return true;
}

function applyHash(){
  const route=cleanHash();
  if(route)openRoute(route,0);
}

window.addEventListener('hashchange',function(){lastOpened='';applyHash();});
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',function(){setTimeout(applyHash,0);},{once:true});
}else{
  setTimeout(applyHash,0);
}

window.SDLDeepLink={open:function(route){return openRoute(ALIASES[String(route||'').toLowerCase()]||String(route||'').toLowerCase(),0);},refresh:applyHash};
})();
