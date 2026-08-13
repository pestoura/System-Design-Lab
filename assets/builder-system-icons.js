/* System Design Lab — icon-first canonical SVG renderer for the 2D Architecture Builder */
(function(){
'use strict';

const SPRITE='./assets/system-design-icons.svg?v=1';
const TYPE_ICON={
  'Client':'client','Mobile App':'mobile-app','Load Balancer':'load-balancer','API Gateway':'api-gateway','WAF':'waf','BFF':'bff',
  'Microservice':'microservice','Web Server':'web-server','Service Mesh':'service-mesh','Database':'database','Cache':'cache',
  'Message Queue':'message-queue','Event Bus':'event-bus','Stream Processor':'stream-processor','CDN':'cdn','Object Storage':'object-storage',
  'Search':'search','Identity Provider':'identity-provider','Auth Service':'auth-service','Kubernetes':'kubernetes','External API':'external-api',
  'Region / AZ':'region-az','Monitor':'monitor','Monitoring':'monitor','DNS':'dns','Secrets Manager':'secrets-manager'
};
const FALLBACK='microservice';
const BOUNDARY_TYPES=new Set(['Region / AZ']);
const symbols=new Map(),imageCache=new Map(),brandCache=new Map();
let spriteReady=false,installed=false;

function B(){try{return typeof builder!=='undefined'?builder:null;}catch(e){return null;}}
function vendorMeta(node){try{return window.SDLVendorComponents&&window.SDLVendorComponents.vendorMeta?window.SDLVendorComponents.vendorMeta(node):null;}catch(e){return null;}}
function brandUrl(slug){try{return window.SDLVendorComponents&&window.SDLVendorComponents.iconUrl?window.SDLVendorComponents.iconUrl(slug):'';}catch(e){return '';}}
function iconId(type){return TYPE_ICON[type]||FALLBACK;}
function compact(s,n){s=String(s||'');return s.length>n?s.slice(0,n-1)+'…':s;}
function round(ctx,x,y,w,h,r){const rr=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();}
function redraw(){try{if(typeof window.builderDraw==='function')window.builderDraw();}catch(e){}}

function svgData(type,color){const rec=symbols.get(iconId(type));if(!rec)return '';const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${rec.viewBox||'0 0 32 32'}" style="color:${color||'#dce6ee'}">${rec.body}</svg>`;return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);}
function loadSemantic(type,color){const key=iconId(type)+'|'+(color||'');if(imageCache.has(key))return imageCache.get(key);const rec={img:null,ok:false};const src=svgData(type,color);if(!src)return rec;const img=new Image();img.onload=()=>{rec.ok=true;redraw();};img.src=src;rec.img=img;imageCache.set(key,rec);return rec;}
function loadBrand(slug){if(!slug)return null;if(brandCache.has(slug))return brandCache.get(slug);const u=brandUrl(slug);if(!u)return null;const rec={img:null,ok:false};const img=new Image();img.crossOrigin='anonymous';img.onload=()=>{rec.ok=true;redraw();};img.onerror=()=>{};img.src=u;rec.img=img;brandCache.set(slug,rec);return rec;}

function ensureNode(n){if(!n)return;if(BOUNDARY_TYPES.has(n.type)){n.w=Math.max(Number(n.w)||0,190);n.h=Math.max(Number(n.h)||0,125);}else{n.w=92;n.h=94;}loadSemantic(n.type,n.color||'#b9c4ce');const meta=vendorMeta(n);if(meta&&meta.brands)meta.brands.forEach(b=>loadBrand(b.slug));}
function center(n){return {x:n.x+n.w/2,y:n.y+n.h/2};}
function iconBox(n){const c=center(n),size=BOUNDARY_TYPES.has(n.type)?30:46;return {x:c.x-size/2,y:n.y+8,w:size,h:size};}
function anchor(n,other){if(BOUNDARY_TYPES.has(n.type)){const c=center(n),oc=center(other),dx=oc.x-c.x,dy=oc.y-c.y;if(Math.abs(dx)>Math.abs(dy))return{x:dx>0?n.x+n.w:n.x,y:c.y};return{x:c.x,y:dy>0?n.y+n.h:n.y};}const c=center(n),oc=center(other),dx=oc.x-c.x,dy=oc.y-c.y,r=26;if(Math.abs(dx)>Math.abs(dy))return{x:c.x+(dx>0?r:-r),y:n.y+31};return{x:c.x,y:n.y+31+(dy>0?r:-r)};}
function drawArrow(ctx,a,b,color,highlight){const dx=b.x-a.x,dy=b.y-a.y,dist=Math.hypot(dx,dy)||1,ux=dx/dist,uy=dy/dist;ctx.save();ctx.strokeStyle=color;ctx.lineWidth=highlight?2.6:1.5;ctx.globalAlpha=highlight?.95:.58;ctx.beginPath();ctx.moveTo(a.x,a.y);const mx=(a.x+b.x)/2,my=(a.y+b.y)/2- Math.min(28,Math.abs(dx)*.08);ctx.quadraticCurveTo(mx,my,b.x,b.y);ctx.stroke();const ang=Math.atan2(b.y-my,b.x-mx);ctx.translate(b.x,b.y);ctx.rotate(ang);ctx.beginPath();ctx.moveTo(-9,-4.5);ctx.lineTo(0,0);ctx.lineTo(-9,4.5);ctx.stroke();ctx.restore();}

function drawBoundary(ctx,n,isSel,meta){ctx.save();ctx.setLineDash([7,5]);ctx.strokeStyle=isSel?'#62d98b':(n.color||'#91b4d8');ctx.globalAlpha=isSel?.95:.58;ctx.lineWidth=isSel?2.2:1.4;round(ctx,n.x,n.y,n.w,n.h,14);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=(n.color||'#91b4d8')+'0D';round(ctx,n.x,n.y,n.w,n.h,14);ctx.fill();const rec=loadSemantic(n.type,n.color||'#dce6ee');if(rec&&rec.ok)ctx.drawImage(rec.img,n.x+12,n.y+10,24,24);ctx.fillStyle=isSel?'#f4fff8':'#dce5ec';ctx.font='700 10px Inter,Manrope,sans-serif';ctx.textAlign='left';ctx.fillText(compact(n.label||n.type,25),n.x+43,n.y+26);if(meta&&meta.product){ctx.fillStyle='rgba(190,201,211,.7)';ctx.font='500 8px Inter,sans-serif';ctx.fillText(compact(meta.product,22),n.x+43,n.y+39);}ctx.restore();}
function drawVendorBadge(ctx,n,meta){if(!meta||!meta.brands||!meta.brands.length)return;const b=meta.brands[0],rec=loadBrand(b.slug),c=center(n),x=c.x+18,y=n.y+6;ctx.save();ctx.fillStyle='rgba(245,248,250,.96)';ctx.beginPath();ctx.arc(x,y,9,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(15,23,31,.16)';ctx.stroke();if(rec&&rec.ok)ctx.drawImage(rec.img,x-6,y-6,12,12);else{ctx.fillStyle='#27313b';ctx.font='700 6px Inter,sans-serif';ctx.textAlign='center';ctx.fillText((b.label||'?').slice(0,2).toUpperCase(),x,y+2);}ctx.restore();}
function drawIconNode(ctx,n,isSel,meta){const c=center(n),box=iconBox(n),color=n.highlight?'#ff7d8b':(n.color||'#dce6ee'),rec=loadSemantic(n.type,color);ctx.save();if(isSel||n.highlight){ctx.shadowColor=isSel?'#62d98b':color;ctx.shadowBlur=isSel?24:18;}if(rec&&rec.ok)ctx.drawImage(rec.img,box.x,box.y,box.w,box.h);else{ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();ctx.arc(c.x,n.y+31,21,0,Math.PI*2);ctx.stroke();}ctx.restore();drawVendorBadge(ctx,n,meta);ctx.textAlign='center';ctx.fillStyle=isSel?'#f4fff8':'#edf2f6';ctx.font='700 10px Inter,Manrope,sans-serif';ctx.fillText(compact(n.label||n.type,17),c.x,n.y+69);const sub=meta&&meta.product?meta.product:(n.label!==n.type?n.type:'');if(sub){ctx.fillStyle='rgba(190,201,211,.72)';ctx.font='500 8px Inter,Manrope,sans-serif';ctx.fillText(compact(sub,19),c.x,n.y+82);}if(Number(n.load)>0){const load=Number(n.load);ctx.fillStyle=load>=100?'#ff7d8b':load>=75?'#e8c178':'#78d99b';ctx.font='700 8px JetBrains Mono,monospace';ctx.fillText(Math.round(load)+'%',c.x,n.y+93);}}

function drawIconFirst(){const b=B();if(!b||!b.ctx||!spriteReady)return;const {ctx,canvas,nodes,edges,pan,zoom,selected,simPackets}=b,W=canvas.width,H=canvas.height;ctx.clearRect(0,0,W,H);ctx.fillStyle='#111827';ctx.fillRect(0,0,W,H);ctx.save();ctx.translate(pan.x,pan.y);ctx.scale(zoom,zoom);
  nodes.forEach(ensureNode);
  if(window.SDLBuilderConnectionsV2&&typeof window.SDLBuilderConnectionsV2.draw==='function')window.SDLBuilderConnectionsV2.draw(ctx,b);else edges.forEach(e=>{const f=nodes.find(n=>n.id===e.from),t=nodes.find(n=>n.id===e.to);if(!f||!t)return;drawArrow(ctx,anchor(f,t),anchor(t,f),e.highlight?'#ff6f7f':'#8ab8d8',!!e.highlight);});
  nodes.filter(n=>BOUNDARY_TYPES.has(n.type)).forEach(n=>drawBoundary(ctx,n,n===selected,vendorMeta(n)));
  nodes.filter(n=>!BOUNDARY_TYPES.has(n.type)).forEach(n=>drawIconNode(ctx,n,n===selected,vendorMeta(n)));
  (simPackets||[]).forEach(p=>{p.t+=.04;const px=p.fx+(p.tx-p.fx)*p.t,py=p.fy+(p.ty-p.fy)*p.t;ctx.beginPath();ctx.arc(px,py,4,0,Math.PI*2);ctx.fillStyle=p.color||'#8ab8d8';ctx.shadowColor=p.color||'#8ab8d8';ctx.shadowBlur=8;ctx.fill();ctx.shadowBlur=0;});b.simPackets=(simPackets||[]).filter(p=>p.t<1);ctx.restore();
}
function installRenderer(){if(!spriteReady||installed||!window.__sdlVendorBuilderPatched||typeof window.builderDraw!=='function')return false;const renderer=function(){drawIconFirst();};renderer.__sdlIconFirst=true;window.builderDraw=renderer;installed=true;const b=B();if(b)b.nodes.forEach(ensureNode);redraw();return true;}

function paletteType(el){const on=el.getAttribute('onclick')||'';const m=on.match(/builderAddNode\(\s*['\"]([^'\"]+)/);if(m)return m[1];const txt=el.textContent.trim();return Object.keys(TYPE_ICON).find(t=>txt.includes(t))||null;}
function refreshPalette(){document.querySelectorAll('.palette-item').forEach(el=>{const type=paletteType(el);if(!type)return;const host=el.querySelector('.palette-icon');if(!host)return;host.dataset.sdlSemantic='true';host.textContent='';const img=document.createElement('img');img.alt='';img.setAttribute('aria-hidden','true');img.src=svgData(type,'#dce6ee');img.style.cssText='width:20px;height:20px;display:block;object-fit:contain';host.appendChild(img);});}
async function loadSprite(){const res=await fetch(SPRITE,{cache:'force-cache'});if(!res.ok)throw new Error('SVG sprite HTTP '+res.status);const text=await res.text(),doc=new DOMParser().parseFromString(text,'image/svg+xml');doc.querySelectorAll('symbol').forEach(s=>symbols.set(s.id,{viewBox:s.getAttribute('viewBox')||'0 0 32 32',body:s.innerHTML}));spriteReady=true;refreshPalette();installRenderer();}
function init(){const b=B();if(!b||!b.canvas)return false;refreshPalette();const p=document.getElementById('builder-palette');if(p&&!p.dataset.sdlIconObserver){p.dataset.sdlIconObserver='1';new MutationObserver(refreshPalette).observe(p,{childList:true,subtree:true});}installRenderer();return true;}
loadSprite().catch(e=>console.warn('System Design SVG icon set:',e));
let tries=0;const timer=setInterval(()=>{tries++;init();if(installed||tries>240)clearInterval(timer);},75);
window.SDLSystemDesignIcons={TYPE_ICON,svgData,refreshPalette,get ready(){return spriteReady;},get installed(){return installed;},BOUNDARY_TYPES};
})();