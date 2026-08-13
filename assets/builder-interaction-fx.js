/* System Design Lab — reference-style interaction layer for 2D Architecture Builder */
(function(){
'use strict';
const fx={ready:false,hover:null,drag:null,connect:null,preview:null,target:null,lastSelected:null,spawn:new Map(),raf:0};
const SELECT='#62d98b',WARN='#d9b77d',BAD='#e497a4';
function B(){try{return typeof builder!=='undefined'?builder:null;}catch(e){return null;}}
function canvas(){const b=B();return b&&b.canvas;}
function worldPoint(e){const b=B(),c=canvas();if(!b||!c)return null;const r=c.getBoundingClientRect();const sx=(e.clientX-r.left)*(c.width/r.width),sy=(e.clientY-r.top)*(c.height/r.height);return {x:(sx-b.pan.x)/b.zoom,y:(sy-b.pan.y)/b.zoom,sx,sy};}
function nodeAt(p){const b=B();if(!b||!p)return null;for(let i=b.nodes.length-1;i>=0;i--){const n=b.nodes[i];if(p.x>=n.x&&p.x<=n.x+n.w&&p.y>=n.y&&p.y<=n.y+n.h)return n;}return null;}
function ports(n){return [
 {name:'top',x:n.x+n.w/2,y:n.y-7},
 {name:'right',x:n.x+n.w+7,y:n.y+n.h/2},
 {name:'bottom',x:n.x+n.w/2,y:n.y+n.h+7},
 {name:'left',x:n.x-7,y:n.y+n.h/2}
];}
function portAt(p){const b=B();if(!b||!b.selected||!p)return null;const radius=12/Math.max(.65,b.zoom);return ports(b.selected).find(pt=>Math.hypot(pt.x-p.x,pt.y-p.y)<=radius)||null;}
function status(n){const load=Number(n&&n.load)||0;if(n&&n.highlight||load>=100)return 'critical';if(load>=75)return 'warn';return 'healthy';}
function statusColor(n){const s=status(n);return s==='critical'?BAD:s==='warn'?WARN:SELECT;}
function bezier(ctx,a,b){const dx=Math.max(50,Math.abs(b.x-a.x)*.42);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.bezierCurveTo(a.x+dx,a.y,b.x-dx,b.y,b.x,b.y);}
function edgeAnchor(n,other){const cx=n.x+n.w/2,cy=n.y+n.h/2,ox=other.x+other.w/2,oy=other.y+other.h/2,dx=ox-cx,dy=oy-cy;if(Math.abs(dx)>Math.abs(dy))return {x:dx>0?n.x+n.w:n.x,y:cy};return {x:cx,y:dy>0?n.y+n.h:n.y};}
function drawGlow(ctx,n,color,alpha){ctx.save();ctx.shadowColor=color;ctx.shadowBlur=22;ctx.strokeStyle=color;ctx.globalAlpha=alpha;ctx.lineWidth=2;round(ctx,n.x-5,n.y-5,n.w+10,n.h+10,13);ctx.stroke();ctx.restore();}
function round(ctx,x,y,w,h,r){const rr=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();}
function drawFx(){const b=B();if(!b||!b.ctx)return;const ctx=b.ctx;ctx.save();ctx.translate(b.pan.x,b.pan.y);ctx.scale(b.zoom,b.zoom);
 const now=performance.now();
 b.nodes.forEach(n=>{const isSel=b.selected===n,isHover=fx.hover===n,isTarget=fx.target===n,st=status(n);if(isSel||isHover||isTarget||st!=='healthy'){const pulse=1+Math.sin(now*.007+n.id%17)*.08;const color=isTarget?SELECT:statusColor(n);drawGlow(ctx,{x:n.x-(pulse-1)*3,y:n.y-(pulse-1)*2,w:n.w+(pulse-1)*6,h:n.h+(pulse-1)*4},color,isSel?.85:isTarget?.95:isHover?.52:.30);} });
 if(b.selected){ports(b.selected).forEach((p,i)=>{const pulse=1+Math.sin(now*.009+i)*.13;ctx.save();ctx.fillStyle=SELECT;ctx.shadowColor=SELECT;ctx.shadowBlur=11;ctx.beginPath();ctx.arc(p.x,p.y,5.3*pulse,0,Math.PI*2);ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='rgba(240,255,246,.95)';ctx.stroke();ctx.restore();});}
 if(fx.connect&&fx.preview){const a=fx.preview.from,bp=fx.preview.to;ctx.save();ctx.strokeStyle=SELECT;ctx.globalAlpha=.9;ctx.lineWidth=2;ctx.setLineDash([8,6]);bezier(ctx,a,bp);ctx.stroke();ctx.restore();}
 ctx.restore();}
function wrapDraw(){if(typeof window.builderDraw!=='function'||window.builderDraw.__sdlFx)return false;const original=window.builderDraw;const wrapped=function(){const r=original.apply(this,arguments);drawFx();return r;};wrapped.__sdlFx=true;wrapped.__original=original;window.builderDraw=wrapped;return true;}
function redraw(){try{window.builderDraw&&window.builderDraw();}catch(e){}}
function updatePreview(e){const b=B(),p=worldPoint(e);if(!b||!fx.connect||!p)return;const source=fx.connect.node,target=nodeAt(p);fx.target=target&&target!==source?target:null;const from=fx.connect.port;let to={x:p.x,y:p.y};if(fx.target)to=edgeAnchor(fx.target,source);fx.preview={from,to};redraw();}
function commitConnection(){const b=B();if(!b||!fx.connect)return;if(fx.target&&fx.target!==fx.connect.node){const exists=b.edges.some(e=>(e.from===fx.connect.node.id&&e.to===fx.target.id)||(e.from===fx.target.id&&e.to===fx.connect.node.id));if(!exists)b.edges.push({from:fx.connect.node.id,to:fx.target.id,id:Date.now()});try{builderUpdateStats();}catch(e){} }
 fx.connect=null;fx.preview=null;fx.target=null;redraw();}
function beginDrag(e,n,p){const b=B();if(!b||!n)return;b.selected=n;fx.drag={node:n,dx:p.x-n.x,dy:p.y-n.y,startX:e.clientX,startY:e.clientY,moved:false};try{builderUpdateConfig();}catch(err){}redraw();}
function moveDrag(e){const b=B(),p=worldPoint(e),d=fx.drag;if(!b||!p||!d)return;if(Math.hypot(e.clientX-d.startX,e.clientY-d.startY)>3)d.moved=true;const tx=p.x-d.dx,ty=p.y-d.dy;d.node.x+=(tx-d.node.x)*.72;d.node.y+=(ty-d.node.y)*.72;redraw();}
function bind(){const c=canvas(),b=B();if(!c||!b||c.dataset.sdlBuilderFx)return false;c.dataset.sdlBuilderFx='true';
 c.addEventListener('pointerdown',e=>{if(B().tool!=='select')return;const p=worldPoint(e),port=portAt(p);if(port){e.preventDefault();e.stopImmediatePropagation();fx.connect={node:B().selected,port:{x:port.x,y:port.y}};fx.preview={from:{x:port.x,y:port.y},to:{x:port.x,y:port.y}};c.setPointerCapture&&c.setPointerCapture(e.pointerId);redraw();return;}const n=nodeAt(p);if(n){e.preventDefault();e.stopImmediatePropagation();beginDrag(e,n,p);c.setPointerCapture&&c.setPointerCapture(e.pointerId);}},true);
 c.addEventListener('pointermove',e=>{const p=worldPoint(e);if(fx.connect){e.preventDefault();e.stopImmediatePropagation();updatePreview(e);return;}if(fx.drag){e.preventDefault();e.stopImmediatePropagation();moveDrag(e);return;}fx.hover=nodeAt(p);redraw();},true);
 c.addEventListener('pointerup',e=>{if(fx.connect){e.preventDefault();e.stopImmediatePropagation();commitConnection();return;}if(fx.drag){e.preventDefault();e.stopImmediatePropagation();fx.drag=null;redraw();}},true);
 c.addEventListener('pointerleave',()=>{if(!fx.drag&&!fx.connect){fx.hover=null;redraw();}},true);
 return true;}
function spawnTrack(){const b=B();if(!b)return;b.nodes.forEach(n=>{if(!fx.spawn.has(n.id))fx.spawn.set(n.id,performance.now());});for(const id of [...fx.spawn.keys()])if(!b.nodes.some(n=>n.id===id))fx.spawn.delete(id);}
function animate(){if(!fx.ready)return;spawnTrack();redraw();fx.raf=requestAnimationFrame(animate);}
function injectHelp(){const wrap=document.getElementById('builder-canvas-wrap');if(!wrap||wrap.querySelector('.sdl-builder-fx-help'))return;const h=document.createElement('div');h.className='sdl-builder-fx-help';h.textContent='Selecionar · Arrastar nó · Arrastar handle verde para ligar';wrap.appendChild(h);}
function init(){const b=B();if(!b||!b.canvas||!b.ctx)return false;wrapDraw();if(!bind())return false;injectHelp();fx.ready=true;animate();return true;}
let tries=0;const timer=setInterval(()=>{tries++;if(init()||tries>240)clearInterval(timer);},75);
window.SDLBuilderInteractionFX=fx;
})();