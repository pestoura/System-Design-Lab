/* Compatibility/bootstrap guard for 3D Architecture Lab v2. */
(function(){
'use strict';

function prepareDom(){
  const legacyWrap=document.getElementById('lab3d-canvas-wrap');
  if(legacyWrap&&!document.getElementById('lab-3d')){
    legacyWrap.id='lab-3d';
    legacyWrap.dataset.legacyId='lab3d-canvas-wrap';
  }
  const section=document.getElementById('section-lab3d');
  if(section){
    section.classList.add('sdl3d-page-v2');
    const oldPresets=section.querySelector('.lab3d-preset-bar');
    if(oldPresets)oldPresets.style.display='none';
  }
}

/* Run immediately, before the v2 init interval gets its first tick. */
prepareDom();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',prepareDom,{once:true});

function guardLegacy(){
  const api=window.SDLArchitecture3DV2;
  if(!api||!api.state||!api.state.ready)return false;
  if(!window.__sdlLegacyInitLab3D&&typeof window.initLab3D==='function')window.__sdlLegacyInitLab3D=window.initLab3D;
  window.initLab3D=function(){
    prepareDom();
    try{window.dispatchEvent(new Event('resize'));}catch(e){}
    return true;
  };
  return true;
}

let guardTries=0;
const guardTimer=setInterval(function(){guardTries++;if(guardLegacy()||guardTries>160)clearInterval(guardTimer);},50);

function restore(){
 const api=window.SDLArchitecture3DV2;if(!api||!api.state||!api.state.ready)return;
 const s=api.state,focus=s.selected?new Set([s.selected]):null;
 if(focus){(s.edges||[]).forEach(e=>{if(e.from===s.selected)focus.add(e.to);if(e.to===s.selected)focus.add(e.from);});}
 s.nodes.forEach((r,id)=>{
   let op=.96;
   const load=Number(r.load)||0,critical=!!r.highlight||load>=100,warn=load>=75;
   if(s.mode==='failure')op=critical||warn?.98:.30;
   if(s.mode==='security')op=['WAF','Identity Provider','Auth Service','Service Mesh','API Gateway'].includes(r.def.type)?.98:.28;
   if(focus&&!focus.has(id))op*=.18;
   if(s.hovered===id||s.selected===id)op=1;
   r.group.traverse(o=>{
     if(!o.isMesh||!o.material||o.material.wireframe||!o.material.transparent)return;
     if(o.geometry&&o.geometry.type==='CircleGeometry')return;
     const cap=r.def.type==='Region / AZ'?.58:.96;
     o.material.opacity=Math.min(op,cap);
   });
 });
}

document.addEventListener('click',()=>setTimeout(function(){prepareDom();guardLegacy();restore();},0),true);
document.addEventListener('sdl:languagechange',()=>setTimeout(function(){prepareDom();guardLegacy();restore();},80));
window.addEventListener('resize',()=>setTimeout(restore,0));
})();
