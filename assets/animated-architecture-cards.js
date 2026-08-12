/* System Design Lab — Animated Architecture Cards
 * Decorates the five Navigation v2 home cards with lightweight architecture diagrams.
 */
(function(){
'use strict';

const DIAGRAMS={
  learn:`<svg viewBox="0 0 360 240" aria-hidden="true">
    <path class="sdl-line solid" d="M278 118 L225 70 M278 118 L326 72 M278 118 L224 170 M278 118 L326 168"/>
    <path class="sdl-line" d="M225 70 C248 34 298 34 326 72 M224 170 C251 203 300 202 326 168"/>
    <circle class="sdl-node-fill sdl-pulse" cx="278" cy="118" r="27"/><text x="278" y="116" text-anchor="middle">SYSTEM</text><text x="278" y="126" text-anchor="middle">DESIGN</text>
    <circle class="sdl-node" cx="225" cy="70" r="15"/><text x="225" y="73" text-anchor="middle">CAP</text>
    <circle class="sdl-node" cx="326" cy="72" r="15"/><text x="326" y="75" text-anchor="middle">HLD</text>
    <circle class="sdl-node" cx="224" cy="170" r="15"/><text x="224" y="173" text-anchor="middle">LLD</text>
    <circle class="sdl-node" cx="326" cy="168" r="15"/><text x="326" y="171" text-anchor="middle">PATTERN</text>
    <circle class="sdl-packet sdl-flow-a" r="4" style="offset-path:path('M225 70 L278 118 L326 168')"/>
    <circle class="sdl-packet sdl-flow-b" r="3.5" style="offset-path:path('M326 72 L278 118 L224 170')"/>
  </svg>`,

  build:`<svg viewBox="0 0 360 240" aria-hidden="true">
    <path class="sdl-line" d="M197 118 H330 M260 67 V182"/>
    <g class="sdl-float-a"><rect class="sdl-chip" x="201" y="50" width="64" height="38" rx="8"/><text x="233" y="72" text-anchor="middle">CLIENT</text></g>
    <g class="sdl-float-b"><rect class="sdl-node-fill" x="277" y="99" width="61" height="40" rx="9"/><text x="307" y="122" text-anchor="middle">API</text></g>
    <g class="sdl-float-a"><rect class="sdl-chip" x="199" y="146" width="68" height="39" rx="9"/><text x="233" y="169" text-anchor="middle">QUEUE</text></g>
    <g class="sdl-float-b"><path class="sdl-node-fill" d="M286 157 q25-10 50 0 v32 q-25 10-50 0z"/><ellipse class="sdl-node" cx="311" cy="157" rx="25" ry="8"/><text x="311" y="179" text-anchor="middle">DATA</text></g>
    <rect class="sdl-node-fill sdl-pulse" x="241" y="99" width="44" height="40" rx="10"/><text x="263" y="122" text-anchor="middle">BFF</text>
    <circle class="sdl-packet sdl-flow-a" r="4" style="offset-path:path('M210 118 H332')"/>
  </svg>`,

  simulate:`<svg viewBox="0 0 360 240" aria-hidden="true">
    <circle class="sdl-node" cx="201" cy="73" r="8"/><circle class="sdl-node" cx="201" cy="103" r="8"/><circle class="sdl-node" cx="201" cy="133" r="8"/><circle class="sdl-node" cx="201" cy="163" r="8"/>
    <path class="sdl-line" d="M210 73 Q239 88 255 112 M210 103 Q239 105 255 116 M210 133 Q239 128 255 120 M210 163 Q238 146 255 124"/>
    <rect class="sdl-node-fill sdl-pulse" x="254" y="96" width="48" height="45" rx="10"/><text x="278" y="114" text-anchor="middle">LOAD</text><text x="278" y="124" text-anchor="middle">BALANCER</text>
    <path class="sdl-line solid" d="M302 108 L329 79 M302 119 L334 119 M302 130 L329 160"/>
    <rect class="sdl-chip" x="318" y="62" width="37" height="28" rx="7"/><rect class="sdl-chip" x="323" y="105" width="34" height="28" rx="7"/><rect class="sdl-chip" x="318" y="147" width="37" height="28" rx="7"/>
    <circle class="sdl-packet sdl-flow-a" r="4" style="offset-path:path('M202 74 Q248 92 278 117 L337 76')"/>
    <circle class="sdl-packet sdl-flow-b" r="3.5" style="offset-path:path('M202 163 Q246 145 278 120 L338 160')"/>
  </svg>`,

  security:`<svg viewBox="0 0 360 240" aria-hidden="true">
    <path class="sdl-soft sdl-pulse" d="M282 48 L326 64 V105 C326 139 309 163 282 181 C255 163 238 139 238 105 V64Z"/>
    <path class="sdl-node" d="M282 52 L321 67 V104 C321 135 306 157 282 174 C258 157 243 135 243 104 V67Z" fill="none"/>
    <path class="sdl-line solid" d="M195 118 H246 M318 118 H352"/>
    <rect class="sdl-chip" x="191" y="99" width="52" height="38" rx="8"/><text x="217" y="121" text-anchor="middle">WAF</text>
    <rect class="sdl-chip" x="322" y="99" width="35" height="38" rx="8"/><text x="339" y="116" text-anchor="middle">API</text><text x="339" y="126" text-anchor="middle">GW</text>
    <path class="sdl-scan" d="M259 88 H307" stroke="currentColor" stroke-width="2.2" opacity=".8"/>
    <circle class="sdl-node-fill" cx="282" cy="112" r="14"/><path d="M276 112 l5 5 9-11" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
    <circle class="sdl-packet sdl-flow-a" r="4" style="offset-path:path('M198 118 H352')"/>
  </svg>`,

  practice:`<svg viewBox="0 0 360 240" aria-hidden="true">
    <rect class="sdl-chip" x="195" y="47" width="154" height="145" rx="13"/>
    <path class="sdl-line solid" d="M216 82 H264 M216 105 H244 M216 128 H278"/>
    <rect class="sdl-node-fill sdl-float-a" x="281" y="70" width="45" height="30" rx="7"/><text x="304" y="88" text-anchor="middle">API</text>
    <circle class="sdl-node-fill sdl-float-b" cx="307" cy="133" r="17"/><text x="307" y="136" text-anchor="middle">DB</text>
    <path class="sdl-line sdl-draw" d="M238 156 C258 138 280 161 300 148 S329 143 337 161" style="stroke-dasharray:42"/>
    <path class="sdl-line" d="M264 82 L281 84 M278 128 L290 130"/>
    <circle class="sdl-packet sdl-flow-a" r="3.8" style="offset-path:path('M217 82 H264 L304 84')"/>
  </svg>`
};

function areaOf(card){
  if(card.classList.contains('sdl-path-learn'))return 'learn';
  if(card.classList.contains('sdl-path-build'))return 'build';
  if(card.classList.contains('sdl-path-simulate'))return 'simulate';
  if(card.classList.contains('sdl-path-security'))return 'security';
  if(card.classList.contains('sdl-path-practice'))return 'practice';
  return null;
}

function decorate(card){
  if(!card||card.dataset.sdlAnimated==='true')return;
  const area=areaOf(card);if(!area||!DIAGRAMS[area])return;
  card.dataset.sdlAnimated='true';
  card.classList.add('sdl-animated-card');
  const motion=document.createElement('div');
  motion.className='sdl-arch-motion';
  motion.dataset.sdlNoI18n='true';
  motion.innerHTML=DIAGRAMS[area];
  card.insertBefore(motion,card.firstChild);

  if(window.matchMedia&&window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    card.addEventListener('pointermove',function(e){
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width;
      const y=(e.clientY-r.top)/r.height;
      card.style.setProperty('--sdl-mx',(x*100).toFixed(1)+'%');
      card.style.setProperty('--sdl-my',(y*100).toFixed(1)+'%');
      card.style.setProperty('--sdl-tilt-x',((x-.5)*2.2).toFixed(2)+'deg');
      card.style.setProperty('--sdl-tilt-y',((.5-y)*1.8).toFixed(2)+'deg');
    });
    card.addEventListener('pointerleave',function(){
      card.style.setProperty('--sdl-tilt-x','0deg');
      card.style.setProperty('--sdl-tilt-y','0deg');
    });
  }
}

function decorateAll(){document.querySelectorAll('#sdl-home-dashboard .sdl-path-card').forEach(decorate);}

function init(){
  decorateAll();
  const root=document.getElementById('sdl-home-dashboard')||document.body;
  const observer=new MutationObserver(function(mutations){
    if(mutations.some(function(m){return m.addedNodes&&m.addedNodes.length;}))decorateAll();
  });
  observer.observe(root,{subtree:true,childList:true});
  [120,350,900].forEach(function(ms){setTimeout(decorateAll,ms);});
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.SDLAnimatedCards={refresh:decorateAll};
})();
