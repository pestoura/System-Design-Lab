/* Small compatibility guard for 3D v2 visual mode transitions. */
(function(){
'use strict';
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
document.addEventListener('click',()=>setTimeout(restore,0),true);
document.addEventListener('sdl:languagechange',()=>setTimeout(restore,80));
window.addEventListener('resize',()=>setTimeout(restore,0));
})();
