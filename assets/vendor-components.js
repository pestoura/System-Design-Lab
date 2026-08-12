/* System Design Lab — vendor / technology SVG identity for Architecture Builder */
(function(){
'use strict';

const CDN='https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/';
const iconCache=new Map();

const BRAND={
  aws:{label:'AWS',slug:'amazonwebservices'},
  gcp:{label:'Google Cloud',slug:'googlecloud'},
  azure:{label:'Microsoft Azure',slug:'microsoftazure'},
  akamai:{label:'Akamai',slug:'akamai'}, fastly:{label:'Fastly',slug:'fastly'},
  postgresql:{label:'PostgreSQL',slug:'postgresql'}, mysql:{label:'MySQL',slug:'mysql'},
  mongodb:{label:'MongoDB',slug:'mongodb'}, cassandra:{label:'Apache Cassandra',slug:'apachecassandra'},
  redis:{label:'Redis',slug:'redis'}, memcached:{label:'Memcached',slug:'memcached'},
  elasticsearch:{label:'Elasticsearch',slug:'elasticsearch'}, opensearch:{label:'OpenSearch',slug:'opensearch'}, typesense:{label:'Typesense',slug:'typesense'},
  kafka:{label:'Apache Kafka',slug:'apachekafka'}, rabbitmq:{label:'RabbitMQ',slug:'rabbitmq'},
  flink:{label:'Apache Flink',slug:'apacheflink'}, spark:{label:'Apache Spark',slug:'apachespark'},
  prometheus:{label:'Prometheus',slug:'prometheus'}, grafana:{label:'Grafana',slug:'grafana'},
  datadog:{label:'Datadog',slug:'datadog'}, newrelic:{label:'New Relic',slug:'newrelic'},
  express:{label:'Express',slug:'express'}, fastapi:{label:'FastAPI',slug:'fastapi'}, spring:{label:'Spring',slug:'spring'},
  go:{label:'Go',slug:'go'}, node:{label:'Node.js',slug:'nodedotjs'}, python:{label:'Python',slug:'python'}, java:{label:'Java / OpenJDK',slug:'openjdk'},
  apple:{label:'Apple',slug:'apple'}, android:{label:'Android',slug:'android'}
};

const TYPES={
  'CDN':{field:'Provider',values:{
    'CloudFront':{brand:'aws',product:'CloudFront'},'Akamai':{brand:'akamai',product:'Akamai CDN'},'Fastly':{brand:'fastly',product:'Fastly CDN'}
  }},
  'Database':{field:'Type',values:{
    'PostgreSQL':{brand:'postgresql',product:'PostgreSQL'},'MySQL':{brand:'mysql',product:'MySQL'},'MongoDB':{brand:'mongodb',product:'MongoDB'},
    'Cassandra':{brand:'cassandra',product:'Cassandra'},'DynamoDB':{brand:'aws',product:'DynamoDB'}
  }},
  'Cache':{field:'Engine',values:{
    'Redis':{brand:'redis',product:'Redis'},'Memcached':{brand:'memcached',product:'Memcached'}
  }},
  'Search':{field:'Engine',values:{
    'Elasticsearch':{brand:'elasticsearch',product:'Elasticsearch'},'OpenSearch':{brand:'opensearch',product:'OpenSearch'},'Typesense':{brand:'typesense',product:'Typesense'}
  }},
  'Object Storage':{field:'Provider',values:{
    'S3':{brand:'aws',product:'Amazon S3'},'GCS':{brand:'gcp',product:'Google Cloud Storage'},'Azure Blob':{brand:'azure',product:'Azure Blob Storage'}
  }},
  'Message Queue':{field:'System',values:{
    'Kafka':{brand:'kafka',product:'Apache Kafka'},'RabbitMQ':{brand:'rabbitmq',product:'RabbitMQ'},'SQS':{brand:'aws',product:'Amazon SQS'},'Pub/Sub':{brand:'gcp',product:'Google Cloud Pub/Sub'}
  }},
  'Stream Processor':{field:'System',values:{
    'Kafka Streams':{brand:'kafka',product:'Kafka Streams'},'Flink':{brand:'flink',product:'Apache Flink'},'Spark Streaming':{brand:'spark',product:'Spark Streaming'}
  }},
  'Monitor':{field:'Stack',values:{
    'Prometheus+Grafana':{brands:['prometheus','grafana'],product:'Prometheus + Grafana'},'Datadog':{brand:'datadog',product:'Datadog'},'New Relic':{brand:'newrelic',product:'New Relic'}
  }},
  'Web Server':{field:'Framework',values:{
    'Express':{brand:'express',product:'Express'},'FastAPI':{brand:'fastapi',product:'FastAPI'},'Spring':{brand:'spring',product:'Spring'}
  }},
  'Microservice':{field:'Language',values:{
    'Go':{brand:'go',product:'Go'},'Node.js':{brand:'node',product:'Node.js'},'Python':{brand:'python',product:'Python'},'Java':{brand:'java',product:'Java'}
  }},
  'Mobile App':{field:'Platform',values:{
    'iOS':{brand:'apple',product:'iOS'},'Android':{brand:'android',product:'Android'},'Cross-platform':{product:'Cross-platform'}
  }}
};

function iconUrl(slug){return slug?CDN+slug+'.svg':'';}
function brandInfo(id){return id&&BRAND[id]?BRAND[id]:null;}
function currentChoice(node){
  const def=TYPES[node&&node.type];
  if(!def)return null;
  let value=node.config&&node.config[def.field];
  if(!value){const keys=Object.keys(def.values);value=keys[0]||'';}
  return {def,value,meta:def.values[value]||null};
}
function vendorMeta(node){
  const c=currentChoice(node); if(!c||!c.meta)return null;
  const ids=c.meta.brands||(c.meta.brand?[c.meta.brand]:[]);
  return {
    field:c.def.field,value:c.value,product:c.meta.product||c.value,
    brands:ids.map(brandInfo).filter(Boolean)
  };
}
function initials(text){
  return String(text||'?').split(/[\s+/_-]+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
}
function ensureDefaults(node){
  const c=currentChoice(node); if(!c)return;
  node.config=node.config||{};
  if(!node.config[c.def.field])node.config[c.def.field]=c.value;
  if(vendorMeta(node)){node.w=Math.max(node.w||110,138);node.h=Math.max(node.h||50,62);}
}
function loadIcon(slug){
  if(!slug)return null;
  if(iconCache.has(slug))return iconCache.get(slug);
  const rec={img:null,ok:false,failed:false};
  const img=new Image(); img.crossOrigin='anonymous';
  img.onload=function(){rec.ok=true;try{if(typeof builderDraw==='function')builderDraw();}catch(e){}};
  img.onerror=function(){rec.failed=true;};
  img.src=iconUrl(slug); rec.img=img; iconCache.set(slug,rec); return rec;
}
function preloadNode(node){
  const vm=vendorMeta(node); if(!vm)return;
  vm.brands.forEach(b=>loadIcon(b.slug));
}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function isPT(){return (localStorage.getItem('sdl:locale')||'pt-PT')!=='en';}

function previewHtml(node){
  const vm=vendorMeta(node); if(!vm)return '';
  const imgs=vm.brands.length?vm.brands.map(b=>`<img src="${iconUrl(b.slug)}" alt="${esc(b.label)}" loading="lazy" onerror="this.style.display='none'">`).join(''):
    `<span class="sdl-vendor-preview-fallback">${esc(initials(vm.product))}</span>`;
  const brandText=vm.brands.map(b=>b.label).join(' + ');
  return `<div class="sdl-vendor-preview" data-sdl-no-i18n>
    <div class="sdl-vendor-preview-icons">${imgs}</div>
    <div class="sdl-vendor-preview-copy">
      <div class="sdl-vendor-preview-label">${esc(vm.product)}</div>
      <div class="sdl-vendor-preview-meta">${esc(brandText||vm.product)} · SVG vendor identity</div>
    </div>
  </div>`;
}

function configChanged(field,value){
  if(typeof builder==='undefined'||!builder.selected)return;
  builder.selected.config=builder.selected.config||{};
  builder.selected.config[field]=value;
  ensureDefaults(builder.selected); preloadNode(builder.selected);
  if(typeof builderUpdateConfig==='function')builderUpdateConfig();
  if(typeof builderUpdateStats==='function')builderUpdateStats();
  if(typeof builderDraw==='function')builderDraw();
}

function patchBuilder(){
  if(typeof builder==='undefined'||typeof builderDraw!=='function'||window.__sdlVendorBuilderPatched)return false;
  window.__sdlVendorBuilderPatched=true;

  const originalAdd=builderAddNode;
  builderAddNode=function(type,color,icon,x,y){
    originalAdd(type,color,icon,x,y);
    if(builder.selected){ensureDefaults(builder.selected);preloadNode(builder.selected);builderUpdateConfig();builderDraw();}
  };

  builder.nodes.forEach(n=>{ensureDefaults(n);preloadNode(n);});

  builderUpdateConfig=function(){
    const n=builder.selected;
    const title=document.getElementById('bc-title');
    const body=document.getElementById('bc-body');
    if(!n||!title||!body){
      if(title)title.textContent=isPT()?'Configuração do Componente':'Component Config';
      if(body)body.innerHTML=`<span style="color:var(--text3)">${isPT()?'Seleciona um componente para configurar':'Select a component to configure'}</span>`;
      return;
    }
    ensureDefaults(n); preloadNode(n);
    title.textContent=n.label+(isPT()?' · Configuração':' · Config');
    const cfg=builderNodeConfigs[n.type]||{fields:[]};
    const fields=cfg.fields.map(f=>{
      const current=(n.config&&n.config[f.label])||f.val||(f.opts&&f.opts[0])||'';
      if(n.config&&!n.config[f.label]&&current)n.config[f.label]=current;
      if(f.type==='select'){
        const options=f.opts.map(o=>`<option${o===current?' selected':''}>${esc(o)}</option>`).join('');
        return `<div class="config-field"><label>${esc(f.label)}</label><select class="config-select" onchange="SDLVendorComponents.configChanged('${esc(f.label)}',this.value)">${options}</select></div>`;
      }
      return `<div class="config-field"><label>${esc(f.label)}</label><input class="config-select" type="text" value="${esc(current)}" oninput="builder.selected.config['${esc(f.label)}']=this.value"></div>`;
    }).join('');
    body.innerHTML=`
      <div class="config-field"><label>${isPT()?'Etiqueta':'Label'}</label><input class="config-select" value="${esc(n.label)}" oninput="builder.selected.label=this.value;builderDraw()"></div>
      ${previewHtml(n)}
      ${vendorMeta(n)?`<div class="sdl-vendor-hint" data-sdl-no-i18n>${isPT()?'O SVG acompanha automaticamente a tecnologia/fabricante selecionado.':'The SVG follows the selected technology/vendor automatically.'}</div>`:''}
      ${fields}
      <div style="margin-top:12px"><button class="builder-tool-btn danger" style="width:100%" onclick="builderDeleteSelected()">🗑 ${isPT()?'Eliminar Nó':'Delete Node'}</button></div>`;
  };

  builderDraw=function(){
    const {ctx,canvas,nodes,edges,pan,zoom,selected,connecting,simPackets}=builder;
    if(!ctx)return;
    const W=canvas.width,H=canvas.height;
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#111827';ctx.fillRect(0,0,W,H);
    ctx.save();ctx.translate(pan.x,pan.y);ctx.scale(zoom,zoom);
    edges.forEach(e=>{
      const f=nodes.find(n=>n.id===e.from),t=nodes.find(n=>n.id===e.to);if(!f||!t)return;
      const fx=f.x+f.w/2,fy=f.y+f.h/2,tx=t.x+t.w/2,ty=t.y+t.h/2;
      ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(tx,ty);ctx.strokeStyle=e.highlight?'rgba(255,71,87,.8)':'rgba(0,229,255,.4)';ctx.lineWidth=e.highlight?3:1.5;ctx.stroke();
      const ang=Math.atan2(ty-fy,tx-fx);ctx.save();ctx.translate(tx,ty);ctx.rotate(ang);ctx.beginPath();ctx.moveTo(-10,-5);ctx.lineTo(0,0);ctx.lineTo(-10,5);ctx.strokeStyle=e.highlight?'rgba(255,71,87,.9)':'rgba(0,229,255,.8)';ctx.lineWidth=1.5;ctx.stroke();ctx.restore();
    });
    nodes.forEach(n=>{
      ensureDefaults(n);const vm=vendorMeta(n);const isSel=n===selected,isConn=n===connecting;
      ctx.save();ctx.shadowColor=isSel?'#00e5ff':n.color;ctx.shadowBlur=isSel?16:n.highlight?20:6;
      ctx.fillStyle=n.highlight?'rgba(255,71,87,.15)':n.color+'22';ctx.strokeStyle=isSel?'#00e5ff':n.color;ctx.lineWidth=isSel?2.5:isConn?3:1.5;
      roundRect(ctx,n.x,n.y,n.w,n.h,10);ctx.fill();ctx.stroke();ctx.restore();
      if(vm){
        let iconX=n.x+12,drawn=0;
        vm.brands.slice(0,2).forEach(b=>{const rec=loadIcon(b.slug);if(rec&&rec.ok){ctx.drawImage(rec.img,iconX,n.y+(n.h-22)/2,22,22);iconX+=drawn?18:25;drawn++;}});
        if(!drawn){ctx.fillStyle=n.color;ctx.font='700 10px Space Mono,monospace';ctx.textAlign='center';ctx.fillText(initials(vm.product),n.x+24,n.y+n.h/2+4);}
        const textX=n.x+(drawn?42:40);ctx.textAlign='left';ctx.fillStyle=n.color;ctx.font='bold 11px Space Mono,monospace';
        const label=String(n.label||n.type);ctx.fillText(label.length>15?label.slice(0,14)+'…':label,textX,n.y+n.h/2-3);
        ctx.fillStyle='rgba(226,232,240,.72)';ctx.font='9px Inter,sans-serif';const sub=vm.product.length>20?vm.product.slice(0,19)+'…':vm.product;ctx.fillText(sub,textX,n.y+n.h/2+12);
      }else{
        ctx.fillStyle=n.color;ctx.font='bold 12px Space Mono,monospace';ctx.textAlign='center';ctx.fillText((n.icon?n.icon+' ':'')+n.label,n.x+n.w/2,n.y+n.h/2+4);
      }
      if(n.load>0){ctx.fillStyle='rgba(255,71,87,.9)';ctx.font='10px Space Mono,monospace';ctx.textAlign='center';ctx.fillText(`${Math.round(n.load)}%`,n.x+n.w-16,n.y+12);}
    });
    simPackets.forEach(p=>{p.t+=.04;const px=p.fx+(p.tx-p.fx)*p.t,py=p.fy+(p.ty-p.fy)*p.t;ctx.beginPath();ctx.arc(px,py,5,0,Math.PI*2);ctx.fillStyle=p.color;ctx.shadowColor=p.color;ctx.shadowBlur=8;ctx.fill();ctx.shadowBlur=0;});
    builder.simPackets=simPackets.filter(p=>p.t<1);ctx.restore();
  };

  builderUpdateStats=function(){
    const body=document.getElementById('builder-stat-body');if(!body)return;
    body.innerHTML=`${isPT()?'Nós':'Nodes'}: <strong style="color:var(--cyan)">${builder.nodes.length}</strong> &nbsp;·&nbsp; ${isPT()?'Ligações':'Edges'}: <strong style="color:var(--cyan)">${builder.edges.length}</strong><br>${builder.nodes.length?(isPT()?'Componentes: ':'Components: ')+builder.nodes.map(n=>{const vm=vendorMeta(n);return `<span style="color:${n.color};font-size:11px">${esc(n.type)}${vm?' · '+esc(vm.product):''}</span>`;}).join(', '):(isPT()?'Adiciona componentes para começares a construir.':'Add components to start building.')}`;
  };

  builderExport=function(){
    const svg=['<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1000" height="700" style="background:#111827">'];
    builder.edges.forEach(e=>{const f=builder.nodes.find(n=>n.id===e.from),t=builder.nodes.find(n=>n.id===e.to);if(f&&t)svg.push(`<line x1="${f.x+f.w/2}" y1="${f.y+f.h/2}" x2="${t.x+t.w/2}" y2="${t.y+t.h/2}" stroke="rgba(0,229,255,0.5)" stroke-width="2"/>`);});
    builder.nodes.forEach(n=>{
      ensureDefaults(n);const vm=vendorMeta(n);
      svg.push(`<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="10" fill="${n.color}22" stroke="${n.color}" stroke-width="1.5"/>`);
      if(vm&&vm.brands.length){const b=vm.brands[0];svg.push(`<image href="${iconUrl(b.slug)}" x="${n.x+10}" y="${n.y+(n.h-22)/2}" width="22" height="22"/>`);}
      const tx=n.x+(vm?40:n.w/2),anchor=vm?'start':'middle';
      svg.push(`<text x="${tx}" y="${n.y+n.h/2-2}" text-anchor="${anchor}" fill="${n.color}" font-size="12" font-family="monospace">${esc(n.label)}</text>`);
      if(vm)svg.push(`<text x="${tx}" y="${n.y+n.h/2+13}" text-anchor="start" fill="#9ca3af" font-size="9" font-family="sans-serif">${esc(vm.product)}</text>`);
    });
    svg.push('</svg>');const blob=new Blob([svg.join('')],{type:'image/svg+xml'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='architecture-with-vendors.svg';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  };

  builder.nodes.forEach(preloadNode);builderUpdateConfig();builderUpdateStats();builderDraw();
  return true;
}

window.SDLVendorComponents={BRAND,TYPES,iconUrl,vendorMeta,configChanged,patchBuilder};
let tries=0;const timer=setInterval(function(){tries++;if(patchBuilder()||tries>80)clearInterval(timer);},75);
document.addEventListener('sdl:languagechange',function(){try{if(typeof builderUpdateConfig==='function')builderUpdateConfig();if(typeof builderUpdateStats==='function')builderUpdateStats();}catch(e){}});
})();
