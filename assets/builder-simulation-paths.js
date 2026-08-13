/* System Design Lab — make 2D simulation particles follow the exact editable connector geometry. */
(function(){
'use strict';
const decorated=new WeakSet();
function B(){try{return typeof builder!=='undefined'?builder:null;}catch(e){return null;}}
function isBoundary(n){return !!(window.SDLSystemDesignIcons&&window.SDLSystemDesignIcons.BOUNDARY_TYPES&&window.SDLSystemDesignIcons.BOUNDARY_TYPES.has(n.type));}
function visualCenter(n){return{x:n.x+n.w/2,y:isBoundary(n)?n.y+n.h/2:n.y+31};}
function legacyCenter(n){return{x:n.x+n.w/2,y:n.y+n.h/2};}
function anchor(n,other){const c=visualCenter(n),o=visualCenter(other),dx=o.x-c.x,dy=o.y-c.y;if(isBoundary(n)){if(Math.abs(dx)>Math.abs(dy))return{x:dx>0?n.x+n.w:n.x,y:c.y};return{x:c.x,y:dy>0?n.y+n.h:n.y};}const r=27;if(Math.abs(dx)>Math.abs(dy))return{x:c.x+(dx>0?r:-r),y:c.y};return{x:c.x,y:c.y+(dy>0?r:-r)};}
function geometry(edge,a,b){const p0=anchor(a,b),p2=anchor(b,a),dx=p2.x-p0.x,dy=p2.y-p0.y,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len,curve=Number(edge.curvature)||0;return{p0,p1:{x:(p0.x+p2.x)/2+nx*curve,y:(p0.y+p2.y)/2+ny*curve},p2};}
function point(g,t){t=Math.max(0,Math.min(1,Number(t)||0));const u=1-t;return{x:u*u*g.p0.x+2*u*t*g.p1.x+t*t*g.p2.x,y:u*u*g.p0.y+2*u*t*g.p1.y+t*t*g.p2.y};}
function resolve(packet,orig){const b=B();if(!b)return null;if(packet.__sdlEdgeId!=null){const edge=b.edges.find(e=>e.id===packet.__sdlEdgeId);if(edge)return{edge,reverse:!!packet.__sdlReverse};}let best=null,bestScore=Infinity,reverse=false;(b.edges||[]).forEach(edge=>{const a=b.nodes.find(n=>n.id===edge.from),z=b.nodes.find(n=>n.id===edge.to);if(!a||!z)return;const ac=legacyCenter(a),zc=legacyCenter(z);const direct=Math.hypot(orig.fx-ac.x,orig.fy-ac.y)+Math.hypot(orig.tx-zc.x,orig.ty-zc.y);const rev=Math.hypot(orig.fx-zc.x,orig.fy-zc.y)+Math.hypot(orig.tx-ac.x,orig.ty-ac.y);if(direct<bestScore){bestScore=direct;best=edge;reverse=false;}if(rev<bestScore){bestScore=rev;best=edge;reverse=true;}});if(best){packet.__sdlEdgeId=best.id;packet.__sdlReverse=reverse;return{edge:best,reverse};}return null;}
function currentPoint(packet,orig){const b=B(),resolved=resolve(packet,orig);if(!b||!resolved)return{x:orig.fx+(orig.tx-orig.fx)*(Number(packet.t)||0),y:orig.fy+(orig.ty-orig.fy)*(Number(packet.t)||0)};const a=b.nodes.find(n=>n.id===resolved.edge.from),z=b.nodes.find(n=>n.id===resolved.edge.to);if(!a||!z)return{x:orig.fx,y:orig.fy};let t=Number(packet.t)||0;if(resolved.reverse)t=1-t;return point(geometry(resolved.edge,a,z),t);}
function decorate(packet){if(!packet||decorated.has(packet))return;const orig={fx:Number(packet.fx)||0,fy:Number(packet.fy)||0,tx:Number(packet.tx)||0,ty:Number(packet.ty)||0};packet.__sdlOriginalPath=orig;['fx','tx'].forEach(k=>{try{delete packet[k];Object.defineProperty(packet,k,{configurable:true,enumerable:true,get(){return currentPoint(packet,orig).x;},set(v){orig[k]=Number(v)||orig[k];}});}catch(e){}});['fy','ty'].forEach(k=>{try{delete packet[k];Object.defineProperty(packet,k,{configurable:true,enumerable:true,get(){return currentPoint(packet,orig).y;},set(v){orig[k]=Number(v)||orig[k];}});}catch(e){}});decorated.add(packet);}
function tick(){const b=B();if(b&&Array.isArray(b.simPackets))b.simPackets.forEach(decorate);requestAnimationFrame(tick);}
requestAnimationFrame(tick);
window.SDLBuilderSimulationPaths={decorate,geometry,point};
})();