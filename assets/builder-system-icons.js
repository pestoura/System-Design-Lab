/* System Design Lab — canonical SVG semantics for the 2D Architecture Builder */
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
const symbols=new Map(),imageCache=new Map(),brandCache=new Map();
let ready=false,patched=false;

function B(){try{return typeof builder!=='undefined'?builder:null;}catch(e){return null;}}
function vm(node){try{return window.SDLVendorComponents&&window.SDLVendorComponents.vendorMeta?window.SDLVendorComponents.vendorMeta(node):null;}catch(e){return null;}}
function brandUrl(slug){try{return window.SDLVendorComponents&&window.SDLVendorComponents.iconUrl?window.SDLVendorComponents.iconUrl(slug):'';}catch(e){return '';}}
function round(ctx,x,y,w,h,r){const rr=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();}
function escSvg(s){return String(s).replace(/#/g,'%23');}
function iconId(type){return TYPE_ICON[type]||FALLBACK;}
function svgData(type,color){const id=iconId(type),rec=symbols.get(id);if(!rec)return '';
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${rec.viewBox||'0 0 32 32'}" style="color:${color||'#dce6ee'}">${rec.body}</svg>`;
  return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
}
function loadSemantic(type,color){const key=iconId(type)+'|'+(color||'');if(imageCache.has(key))return imageCache.get(key);const rec={img:null,ok:false};const src=svgData(type,color);if(!src)return rec;const img=new Image();img.onload=()=>{rec.ok=true;redraw();};img.src=src;rec.img=img;imageCache.set(key,rec);return rec;}
function loadBrand(slug){if(!slug)return null;if(brandCache.has(slug))return brandCache.get(slug);const rec={img:null,ok:false};const u=brandUrl(slug);if(!u)return null;const img=new Image();img.crossOrigin='anonymous';img.onload=()=>{rec.ok=true;redraw();};img.onerror=()=>{};img.src=u;rec.img=img;brandCache.set(slug,rec);return rec;}
function redraw(){try{if(typeof window.builderDraw==='function')window.builderDraw();}catch(e){}}
function compact(s,n){s=String(s||'');return s.length>n?s.slice(0,n-1)+'…':s;}
function ensureNode(n){if(!n)return;n.w=Math.max(Number(n.w)||110,144);n.h=Math.max(Number(n.h)||50,62);loadSemantic(n.type,n.color||'#b9c4ce');const meta=vm(n);if(meta&&meta.brands)meta.brands.forEach(b=>loadBrand(b.slug));}
function drawBadge(ctx,node,meta){if(!meta||!meta.brands||!meta.brands.length)return;const b=meta.brands[0],rec=loadBrand(b.slug),x=node.x+node.w-23,y=node.y+8;
  ctx.save();ctx.fillStyle='rgba(245,248,250,.92)';ctx.beginPath();ctx.arc(x+7,y+7,10,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(15,23,31,.16)';ctx.lineWidth=1;ctx.stroke();if(rec&&rec.ok)ctx.drawImage(rec.img,x,y,14,14);else{ctx.fillStyle='#27313b';ctx.font='700 7px Inter,sans-serif';ctx.textAlign='center';ctx.fillText((b.label||'?').slice(0,2).toUpperCase(),x+7,y+9.5);}ctx.restore();}
function drawNodeContent(ctx,n){ensureNode(n);const meta=vm(n),selected=B()&&B().selected===n;
  ctx.save();
  round(ctx,n.x+3,n.y+3,n.w-6,n.h-6,8);ctx.fillStyle=n.highlight?'rgba(62,32,39,.96)':'rgba(18,25,33,.96)';ctx.fill();
  round(ctx,n.x+4,n.y+4,n.w-8,n.h-8,7);ctx.fillStyle=(n.color||'#91b4d8')+'12';ctx.fill();
  const rec=loadSemantic(n.type,n.color||'#dce6ee'),ix=n.x+11,iy=n.y+(n.h-28)/2;
  if(rec&&rec.ok)ctx.drawImage(rec.img,ix,iy,28,28);else{ctx.strokeStyle=n.color||'#dce6ee';ctx.strokeRect(ix+4,iy+4,20,20);}
  const tx=n.x+48,center=n.y+n.h/2;
  ctx.textAlign='left';ctx.fillStyle=selected?'#f5fbff':'#edf2f6';ctx.font='700 11px Inter,Manrope,sans-serif';ctx.fillText(compact(n.label||n.type,15),tx,center-4);
  const sub=meta&&meta.product?meta.product:(n.label!==n.type?n.type:'');
  if(sub){ctx.fillStyle='rgba(190,201,211,.72)';ctx.font='500 9px Inter,Manrope,sans-serif';ctx.fillText(compact(sub,18),tx,center+11);}
  drawBadge(ctx,n,meta);
  if(Number(n.load)>0){const load=Number(n.load);ctx.fillStyle=load>=100?'#ff7d8b':load>=75?'#e8c178':'#78d99b';ctx.font='700 8px JetBrains Mono,monospace';ctx.textAlign='right';ctx.fillText(Math.round(load)+'%',n.x+n.w-9,n.y+n.h-8);}
  ctx.restore();
}
function overlay(){const b=B();if(!ready||!b||!b.ctx)return;const ctx=b.ctx;ctx.save();ctx.translate(b.pan.x,b.pan.y);ctx.scale(b.zoom,b.zoom);b.nodes.forEach(n=>drawNodeContent(ctx,n));ctx.restore();}
function wrapDraw(){if(patched||typeof window.builderDraw!=='function')return false;const original=window.builderDraw;const wrapped=function(){const r=original.apply(this,arguments);overlay();return r;};wrapped.__sdlSystemIcons=true;wrapped.__original=original;window.builderDraw=wrapped;patched=true;return true;}
function paletteType(el){const on=el.getAttribute('onclick')||'';const m=on.match(/builderAddNode\(\s*['\"]([^'\"]+)/);if(m)return m[1];const txt=el.textContent.trim();return Object.keys(TYPE_ICON).find(t=>txt.includes(t))||null;}
function refreshPalette(){document.querySelectorAll('.palette-item').forEach(el=>{const type=paletteType(el);if(!type)return;const host=el.querySelector('.palette-icon');if(!host||host.dataset.sdlSemantic)return;host.dataset.sdlSemantic='true';host.textContent='';const img=document.createElement('img');img.alt='';img.setAttribute('aria-hidden','true');img.src=svgData(type,'#dce6ee');img.style.cssText='width:18px;height:18px;display:block;';host.appendChild(img);});}
async function loadSprite(){const res=await fetch(SPRITE,{cache:'force-cache'});if(!res.ok)throw new Error('SVG sprite HTTP '+res.status);const text=await res.text(),doc=new DOMParser().parseFromString(text,'image/svg+xml');doc.querySelectorAll('symbol').forEach(s=>symbols.set(s.id,{viewBox:s.getAttribute('viewBox')||'0 0 32 32',body:s.innerHTML}));ready=true;const b=B();if(b)b.nodes.forEach(ensureNode);refreshPalette();redraw();}
function init(){const b=B();if(!b||!b.canvas||typeof window.builderDraw!=='function')return false;wrapDraw();refreshPalette();const mo=new MutationObserver(refreshPalette);const p=document.getElementById('builder-palette');if(p)mo.observe(p,{childList:true,subtree:true});return true;}
loadSprite().catch(e=>console.warn('System Design SVG icon set:',e));
let tries=0;const timer=setInterval(()=>{tries++;if(init()||tries>200)clearInterval(timer);},75);
window.SDLSystemDesignIcons={TYPE_ICON,svgData,refreshPalette};
})();