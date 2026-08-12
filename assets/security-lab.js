/* System Design Lab — Security Engineering modules */
(function(){
'use strict';

const WEB_RISKS=[
 {code:'A01:2025',title:'Broken Access Control',attack:'Access another user or administrator resource without the required authorization.',detect:'Authorization denials, anomalous object access and privilege changes.',control:'Server-side authorization, deny-by-default, least privilege and object/function level checks.'},
 {code:'A02:2025',title:'Security Misconfiguration',attack:'Exploit insecure defaults, exposed management surfaces, permissive headers or unnecessary services.',detect:'Configuration drift, exposed endpoints and policy violations.',control:'Hardened baselines, configuration-as-code, continuous validation and secure defaults.'},
 {code:'A03:2025',title:'Software Supply Chain Failures',attack:'Compromise a dependency, build step, package source or artifact provenance path.',detect:'Dependency changes, unsigned artifacts, provenance failures and malicious package indicators.',control:'SCA, trusted registries, signed artifacts, SBOM, provenance and dependency pinning.'},
 {code:'A04:2025',title:'Cryptographic Failures',attack:'Read or manipulate sensitive data because encryption, key handling or protocol choices are weak.',detect:'Plaintext sensitive data, weak protocol negotiation and key-management violations.',control:'Modern TLS, strong cryptography, KMS/HSM-backed keys, rotation and data classification.'},
 {code:'A05:2025',title:'Injection',attack:'Send untrusted input that is interpreted as a command, query or expression.',detect:'Unexpected query patterns, command metacharacters and application/WAF alerts.',control:'Parameterized interfaces, input validation, context-aware encoding and least-privilege service accounts.'},
 {code:'A06:2025',title:'Insecure Design',attack:'Abuse a business or trust-flow weakness that cannot be fixed by input validation alone.',detect:'Threat-model gaps, abuse-case testing and architecture review findings.',control:'Threat modelling, secure design patterns, abuse cases and security requirements.'},
 {code:'A07:2025',title:'Authentication Failures',attack:'Take over an account through weak authentication, session handling or credential protection.',detect:'Credential stuffing patterns, impossible travel and abnormal session creation.',control:'MFA, phishing-resistant authentication, secure sessions, rate limiting and breached-password controls.'},
 {code:'A08:2025',title:'Software or Data Integrity Failures',attack:'Cause the application to trust unverified software, updates, serialized data or critical content.',detect:'Signature failures, unexpected artifact hashes and integrity-control bypasses.',control:'Digital signatures, trusted update channels, integrity validation and protected CI/CD.'},
 {code:'A09:2025',title:'Security Logging & Alerting Failures',attack:'Operate without meaningful detection because security events are missing or never acted upon.',detect:'Coverage gaps, silent critical actions and missing correlation rules.',control:'Structured audit logs, central SIEM, alerting, retention and detection engineering.'},
 {code:'A10:2025',title:'Mishandling of Exceptional Conditions',attack:'Trigger failures, resource errors or edge conditions that expose data or produce unsafe states.',detect:'Unhandled exceptions, repeated edge-condition errors and inconsistent recovery paths.',control:'Fail-safe defaults, bounded retries, exception handling, graceful degradation and resilience testing.'}
];

const API_RISKS=[
 {code:'API1:2023',title:'Broken Object Level Authorization',attack:'Change an object identifier to access another user or tenant object.',detect:'Cross-user object access and authorization mismatch telemetry.',control:'Object-level authorization on every data access using a user-controlled identifier.'},
 {code:'API2:2023',title:'Broken Authentication',attack:'Abuse weak token, credential, session or authentication flows.',detect:'Token anomalies, repeated failed authentication and suspicious refresh patterns.',control:'Strong authentication, token validation, short lifetimes, rotation and rate limiting.'},
 {code:'API3:2023',title:'Broken Object Property Level Authorization',attack:'Read or modify object properties that the current subject should not access.',detect:'Unexpected sensitive fields in responses or unauthorized property updates.',control:'Explicit response schemas, field-level authorization and allow-list binding.'},
 {code:'API4:2023',title:'Unrestricted Resource Consumption',attack:'Exhaust CPU, memory, storage, bandwidth or paid downstream resources.',detect:'Per-client consumption spikes, latency and saturation telemetry.',control:'Quotas, rate limits, payload limits, timeouts, budgets and bounded pagination.'},
 {code:'API5:2023',title:'Broken Function Level Authorization',attack:'Call an administrative or privileged function as a lower-privileged user.',detect:'Role/function mismatch and privileged endpoint access anomalies.',control:'Central authorization, role/attribute policies and deny-by-default function access.'},
 {code:'API6:2023',title:'Unrestricted Access to Sensitive Business Flows',attack:'Automate a valid business flow such as purchasing, booking or account creation at abusive scale.',detect:'Bot-like behavioral patterns and abnormal transaction velocity.',control:'Business-flow rate controls, bot mitigation, step-up verification and anti-automation design.'},
 {code:'API7:2023',title:'Server Side Request Forgery',attack:'Make the server fetch attacker-selected internal, metadata or external destinations.',detect:'Unexpected outbound destinations, metadata access and DNS anomalies.',control:'Egress allow-lists, URL validation, network isolation and metadata service protections.'},
 {code:'API8:2023',title:'Security Misconfiguration',attack:'Exploit permissive CORS, verbose errors, insecure defaults or exposed services.',detect:'Configuration scanning, response-header checks and asset exposure monitoring.',control:'Secure baselines, automated configuration checks, least functionality and hardened gateways.'},
 {code:'API9:2023',title:'Improper Inventory Management',attack:'Target forgotten, deprecated, shadow or undocumented API versions and hosts.',detect:'Unknown endpoints, unmanaged versions and traffic to unregistered assets.',control:'API inventory, lifecycle ownership, version retirement and continuous discovery.'},
 {code:'API10:2023',title:'Unsafe Consumption of APIs',attack:'Exploit trust placed in data returned by third-party or upstream APIs.',detect:'Schema anomalies, upstream behavior changes and dependency failures.',control:'Treat upstream data as untrusted, validate schemas, apply timeouts and isolate dependencies.'}
];

const ARCH_CONTROLS=[
 {id:'mfa',name:'MFA / OIDC',desc:'Strong user authentication and modern identity federation.',points:12,checked:true},
 {id:'leastpriv',name:'RBAC / ABAC',desc:'Least privilege for users, services and administration.',points:10,checked:true},
 {id:'mtls',name:'Service mTLS',desc:'Mutual authentication for service-to-service traffic.',points:10,checked:false},
 {id:'waf',name:'WAF / API Gateway',desc:'Central edge policy, validation and threat filtering.',points:10,checked:true},
 {id:'ratelimit',name:'Rate Limiting',desc:'Per-client and per-flow consumption controls.',points:9,checked:true},
 {id:'egress',name:'Egress Control',desc:'Restrict outbound destinations to reduce SSRF impact.',points:10,checked:false},
 {id:'secrets',name:'Secrets Management',desc:'Vaulted credentials with rotation and workload identity.',points:10,checked:true},
 {id:'network',name:'Network Segmentation',desc:'Workload and data-plane trust boundaries.',points:9,checked:false},
 {id:'logging',name:'Central Security Logging',desc:'Audit trail, SIEM correlation and detection coverage.',points:10,checked:true},
 {id:'supply',name:'Supply Chain Controls',desc:'SBOM, SCA, provenance and signed artifacts.',points:10,checked:false}
];

const SCENARIOS={
 ddos:{name:'DDoS / API Abuse',base:30,steps:['Traffic rapidly exceeds normal baseline.','API Gateway begins queueing requests.','Backend saturation increases latency.','Database connection pool approaches exhaustion.'],recommended:['ratelimit','waf','autoscale','observe']},
 ssrf:{name:'SSRF / Egress Abuse',base:25,steps:['Attacker submits a server-side fetch target.','Application resolves an attacker-controlled destination.','Request attempts to reach an internal/metadata endpoint.','Sensitive response may be relayed to the attacker.'],recommended:['egress','waf','observe']},
 bola:{name:'Broken Access Control / BOLA',base:20,steps:['Authenticated user changes an object identifier.','Backend loads a resource belonging to another subject.','Missing object-level authorization permits access.','Sensitive data crosses a trust boundary.'],recommended:['waf','observe']},
 stuffing:{name:'Credential Stuffing',base:30,steps:['Automated login attempts begin across many accounts.','Known breached credentials are replayed.','Successful logins create anomalous sessions.','Account takeover risk increases.'],recommended:['ratelimit','waf','observe']},
 cache:{name:'Cache Stampede',base:40,steps:['Popular cache entry expires.','Concurrent requests miss the cache together.','Backend receives a sudden fan-out of identical work.','Database and dependent services become saturated.'],recommended:['breaker','bulkhead','backoff','observe']},
 db:{name:'Database Outage',base:35,steps:['Primary database stops responding.','Request latency reaches timeout thresholds.','Retries amplify pressure on the dependency.','Upstream services risk cascading degradation.'],recommended:['breaker','bulkhead','backoff','observe']},
 partition:{name:'Network Partition',base:35,steps:['Connectivity between service zones is interrupted.','Partial requests begin timing out.','Replicas disagree about dependency health.','Availability and consistency trade-offs become visible.'],recommended:['breaker','bulkhead','backoff','observe']},
 cascade:{name:'Cascading Failure',base:20,steps:['One critical dependency slows down.','Threads and connection pools begin to accumulate.','Retries propagate load to adjacent services.','Failure spreads across the request path.'],recommended:['breaker','bulkhead','backoff','observe','autoscale']}
};

const RESILIENCE_CONTROLS=[
 {id:'ratelimit',name:'Rate limit / quota',points:12},
 {id:'breaker',name:'Circuit breaker',points:12},
 {id:'bulkhead',name:'Bulkhead isolation',points:10},
 {id:'backoff',name:'Retry + backoff',points:8},
 {id:'waf',name:'WAF / gateway policy',points:10},
 {id:'egress',name:'Egress policy',points:12},
 {id:'autoscale',name:'Autoscaling',points:8},
 {id:'observe',name:'Observability / alerting',points:8}
];

const PIPELINE=[
 {id:'sast',name:'SAST',desc:'Static application security testing.',required:true,checked:true},
 {id:'sca',name:'SCA',desc:'Dependency and vulnerability analysis.',required:true,checked:true},
 {id:'secretscan',name:'Secrets',desc:'Credential and secret detection.',required:true,checked:true},
 {id:'sbom',name:'SBOM',desc:'Software bill of materials generation.',required:false,checked:true},
 {id:'iac',name:'IaC Scan',desc:'Infrastructure-as-code policy validation.',required:true,checked:false},
 {id:'dast',name:'DAST',desc:'Dynamic application security testing.',required:false,checked:false},
 {id:'policy',name:'Policy as Code',desc:'Machine-enforced architecture and security rules.',required:true,checked:true},
 {id:'gate',name:'Security Gate',desc:'Block release when critical policy fails.',required:true,checked:true}
];

function hubHtml(){return `
<section id="security-hub" class="section sdl-security-section">
 <div class="sdl-security-kicker"><span>Security Engineering</span><span>Interactive</span></div>
 <div class="page-title">Security Lab</div>
 <p class="sdl-security-lead">Explore security architecture, application and API risks, resilience under attack or failure, and DevSecOps controls as first-class system design decisions.</p>
 <div class="sdl-sec-grid">
  <a class="sdl-sec-panel sdl-sec-span-6 sdl-sec-card-link" data-sec-open="security-architecture"><div class="sdl-sec-number">01</div><h3>Security Architecture</h3><p class="sdl-sec-muted">Configure identity, edge, workload, network and detection controls and watch the security posture change.</p><div class="sdl-sec-arrow">Open architecture lab →</div></a>
  <a class="sdl-sec-panel sdl-sec-span-6 sdl-sec-card-link" data-sec-open="owasp-lab"><div class="sdl-sec-number">02</div><h3>OWASP Lab</h3><p class="sdl-sec-muted">OWASP Top 10:2025 and API Security Top 10:2023 with attack path, detection and mitigation context.</p><div class="sdl-sec-arrow">Open OWASP lab →</div></a>
  <a class="sdl-sec-panel sdl-sec-span-6 sdl-sec-card-link" data-sec-open="attack-failure-lab"><div class="sdl-sec-number">03</div><h3>Attack & Failure Lab</h3><p class="sdl-sec-muted">Inject DDoS, SSRF, access-control abuse, database outage, network partition and cascading failure scenarios.</p><div class="sdl-sec-arrow">Run scenarios →</div></a>
  <a class="sdl-sec-panel sdl-sec-span-6 sdl-sec-card-link" data-sec-open="devsecops-lab"><div class="sdl-sec-number">04</div><h3>DevSecOps</h3><p class="sdl-sec-muted">Build a security pipeline with SAST, SCA, secrets, SBOM, IaC, DAST, policy-as-code and release gates.</p><div class="sdl-sec-arrow">Open pipeline lab →</div></a>
 </div>
 <div class="sdl-sec-panel" style="margin-top:16px"><h3>Design principle</h3><p class="sdl-sec-muted">Security is modeled here as an architectural property: controls change trust boundaries, failure modes, blast radius, observability and release decisions rather than appearing as a separate checklist.</p><div class="sdl-sec-pill-row"><span class="sdl-sec-pill">Zero Trust</span><span class="sdl-sec-pill">IAM / PAM</span><span class="sdl-sec-pill">API Security</span><span class="sdl-sec-pill">Cloud / Kubernetes</span><span class="sdl-sec-pill">Threat Modelling</span><span class="sdl-sec-pill">Resilience</span></div></div>
</section>`}

function architectureHtml(){return `
<section id="security-architecture" class="section sdl-security-section">
 <div class="sdl-security-kicker"><span>Security Architecture</span><span>Configurable</span></div>
 <div class="page-title">Security Architecture</div>
 <p class="sdl-security-lead">Treat controls as system properties. Enable or disable protections and observe how the posture of a typical internet-facing service changes.</p>
 <div class="sdl-sec-grid">
  <div class="sdl-sec-panel sdl-sec-span-8"><h3>Architecture controls</h3><p class="sdl-sec-muted">Controls are deliberately distributed across identity, edge, workload, network, data and detection layers.</p><div class="sdl-sec-control-list" id="sdl-arch-controls"></div></div>
  <div class="sdl-sec-panel sdl-sec-span-4"><h3>Security posture</h3><div class="sdl-sec-score-wrap"><div class="sdl-sec-ring" id="sdl-arch-ring"><span id="sdl-arch-score">0</span></div><div class="sdl-sec-score-copy"><strong id="sdl-arch-rating">Assessing</strong><p id="sdl-arch-copy">Enable controls to improve defence-in-depth and reduce blast radius.</p></div></div></div>
  <div class="sdl-sec-panel sdl-sec-span-12"><h3>Trust path</h3><p class="sdl-sec-muted">A simplified flow for visualising where controls should be enforced.</p><div class="sdl-sec-flow"><div class="sdl-sec-node">User<small>Identity</small></div><div class="sdl-sec-flow-arrow">→</div><div class="sdl-sec-node">WAF / Gateway<small>Edge</small></div><div class="sdl-sec-flow-arrow">→</div><div class="sdl-sec-node">BFF<small>Session</small></div><div class="sdl-sec-flow-arrow">→</div><div class="sdl-sec-node">Services<small>Workload</small></div><div class="sdl-sec-flow-arrow">→</div><div class="sdl-sec-node">Data<small>Protected asset</small></div></div></div>
 </div>
</section>`}

function owaspHtml(){return `
<section id="owasp-lab" class="section sdl-security-section">
 <div class="sdl-security-kicker"><span>Application Security</span><span>OWASP</span></div>
 <div class="page-title">OWASP Lab</div>
 <p class="sdl-security-lead">Explore the current OWASP web application awareness list and the API-specific list. Select a risk to see a compact attack, detection and control model.</p>
 <div class="sdl-sec-panel"><div class="sdl-sec-tabs"><button class="sdl-sec-tab active" data-owasp-set="web">OWASP Top 10:2025</button><button class="sdl-sec-tab" data-owasp-set="api">API Security Top 10:2023</button></div><div class="sdl-owasp-grid" id="sdl-owasp-grid"></div><div class="sdl-sec-detail" id="sdl-owasp-detail"></div></div>
</section>`}

function attackHtml(){return `
<section id="attack-failure-lab" class="section sdl-security-section">
 <div class="sdl-security-kicker"><span>Chaos + Security</span><span>Scenario Driven</span></div>
 <div class="page-title">Attack & Failure Lab</div>
 <p class="sdl-security-lead">Inject a failure or attack into a service path. Enable resilience and security controls to see how the expected blast radius changes.</p>
 <div class="sdl-sec-grid">
  <div class="sdl-sec-panel sdl-sec-span-4"><h3>Scenario</h3><select class="sdl-sec-select" id="sdl-scenario"><option value="ddos">DDoS / API Abuse</option><option value="ssrf">SSRF / Egress Abuse</option><option value="bola">Broken Access Control / BOLA</option><option value="stuffing">Credential Stuffing</option><option value="cache">Cache Stampede</option><option value="db">Database Outage</option><option value="partition">Network Partition</option><option value="cascade">Cascading Failure</option></select><div class="sdl-sec-actions"><button class="sdl-sec-btn" id="sdl-run-scenario">Run scenario</button><button class="sdl-sec-btn secondary" id="sdl-reset-scenario">Reset</button></div><div style="margin-top:18px"><div class="sdl-sec-muted">Expected resilience</div><div class="sdl-sec-resilience"><div id="sdl-resilience-bar"></div></div><div style="margin-top:6px;font:800 18px var(--font-code)" id="sdl-resilience-score">0%</div></div></div>
  <div class="sdl-sec-panel sdl-sec-span-8"><h3>Protection controls</h3><div class="sdl-sec-control-list" id="sdl-resilience-controls"></div></div>
  <div class="sdl-sec-panel sdl-sec-span-12"><h3>Event stream</h3><div class="sdl-sec-log" id="sdl-scenario-log">Select a scenario and run the simulation.</div></div>
 </div>
</section>`}

function devsecopsHtml(){return `
<section id="devsecops-lab" class="section sdl-security-section">
 <div class="sdl-security-kicker"><span>DevSecOps</span><span>Policy as Code</span></div>
 <div class="page-title">DevSecOps Pipeline</div>
 <p class="sdl-security-lead">Configure the security controls that protect source, dependencies, infrastructure and releases. Required controls determine whether the deployment gate passes.</p>
 <div class="sdl-sec-panel"><div class="sdl-pipeline" id="sdl-pipeline"></div><div class="sdl-gate"><div><strong>Release decision</strong><div class="sdl-sec-muted" id="sdl-gate-copy">Evaluating enabled controls…</div></div><span class="sdl-gate-status" id="sdl-gate-status">CHECKING</span></div></div>
 <div class="sdl-sec-grid" style="margin-top:16px"><div class="sdl-sec-panel sdl-sec-span-6"><h3>Shift left</h3><p class="sdl-sec-muted">SAST, SCA, secret detection, IaC validation and policy-as-code provide fast feedback before deployment.</p></div><div class="sdl-sec-panel sdl-sec-span-6"><h3>Continuous assurance</h3><p class="sdl-sec-muted">DAST, runtime telemetry, SBOM provenance and release gates create evidence that the deployed system still satisfies policy.</p></div></div>
</section>`}

function addNavigation(){
 const sidebar=document.getElementById('sidebar');
 if(sidebar&&!document.querySelector('.sdl-security-nav')){
  const block=document.createElement('div');block.className='sidebar-section sdl-security-nav';
  block.innerHTML='<div class="sidebar-heading">Security Engineering</div>'+[
   ['security-hub','Security Hub'],['security-architecture','Security Architecture'],['owasp-lab','OWASP / API Security'],['attack-failure-lab','Attack & Failure Lab'],['devsecops-lab','DevSecOps']
  ].map(([id,label])=>`<div class="sidebar-item" data-sec-open="${id}"><span class="sidebar-dot"></span>${label}</div>`).join('');
  sidebar.appendChild(block);
 }
 const nav=document.querySelector('#navbar .nav-menu')||document.getElementById('navbar');
 if(nav&&!document.querySelector('.sdl-security-topnav')){
  const btn=document.createElement('button');btn.className='nav-btn sdl-security-topnav';btn.type='button';btn.textContent='Security Lab';btn.dataset.secOpen='security-hub';nav.appendChild(btn);
 }
}

function addSections(){const main=document.getElementById('main');if(!main||document.getElementById('security-hub'))return;main.insertAdjacentHTML('beforeend',hubHtml()+architectureHtml()+owaspHtml()+attackHtml()+devsecopsHtml());}

function openSection(id){
 document.querySelectorAll('.section').forEach(el=>el.classList.remove('active'));
 const target=document.getElementById(id);if(!target)return;
 target.classList.add('active');
 document.querySelectorAll('.sidebar-item').forEach(el=>el.classList.remove('active'));
 document.querySelectorAll('.nav-btn').forEach(el=>el.classList.remove('active'));
 document.querySelectorAll(`[data-sec-open="${id}"]`).forEach(el=>el.classList.add('active'));
 const top=document.querySelector('.sdl-security-topnav');if(top)top.classList.add('active');
 try{history.replaceState(null,'','#'+id);}catch(e){}
 window.scrollTo({top:0,behavior:'smooth'});
}

function bindGlobalNav(){document.addEventListener('click',e=>{const trigger=e.target.closest('[data-sec-open]');if(!trigger)return;e.preventDefault();openSection(trigger.dataset.secOpen);});}

function initArchitecture(){
 const wrap=document.getElementById('sdl-arch-controls');if(!wrap)return;
 wrap.innerHTML=ARCH_CONTROLS.map(c=>`<label class="sdl-sec-toggle"><input type="checkbox" data-arch-control="${c.id}" ${c.checked?'checked':''}><span><strong>${c.name}</strong><small>${c.desc}</small></span></label>`).join('');
 const update=()=>{let score=0;ARCH_CONTROLS.forEach(c=>{const el=wrap.querySelector(`[data-arch-control="${c.id}"]`);if(el&&el.checked)score+=c.points;});score=Math.min(100,score);const ring=document.getElementById('sdl-arch-ring');const val=document.getElementById('sdl-arch-score');const rating=document.getElementById('sdl-arch-rating');const copy=document.getElementById('sdl-arch-copy');if(ring)ring.style.setProperty('--score',score);if(val)val.textContent=score;let r='High exposure',t='Critical trust boundaries remain insufficiently protected.';if(score>=85){r='Strong baseline';t='Defence-in-depth covers the main identity, edge, workload and detection layers.'}else if(score>=65){r='Moderate baseline';t='Core controls exist, but remaining gaps can still increase blast radius.'}else if(score>=45){r='Material gaps';t='Several important trust boundaries rely on implicit trust or weak detection.'}if(rating)rating.textContent=r;if(copy)copy.textContent=t;};
 wrap.addEventListener('change',update);update();
}

function renderOwasp(set){
 const risks=set==='api'?API_RISKS:WEB_RISKS;const grid=document.getElementById('sdl-owasp-grid');if(!grid)return;
 grid.innerHTML=risks.map((r,i)=>`<div class="sdl-risk-card ${i===0?'active':''}" data-risk-index="${i}"><div class="sdl-risk-code">${r.code}</div><div class="sdl-risk-title">${r.title}</div></div>`).join('');
 const detail=document.getElementById('sdl-owasp-detail');const show=i=>{const r=risks[i];grid.querySelectorAll('.sdl-risk-card').forEach(x=>x.classList.remove('active'));const card=grid.querySelector(`[data-risk-index="${i}"]`);if(card)card.classList.add('active');detail.innerHTML=`<div class="sdl-risk-code">${r.code}</div><h3>${r.title}</h3><div class="sdl-sec-detail-grid"><div><b>Attack path</b><span>${r.attack}</span></div><div><b>Detection</b><span>${r.detect}</span></div><div><b>Architecture control</b><span>${r.control}</span></div></div>`;};
 grid.onclick=e=>{const card=e.target.closest('[data-risk-index]');if(card)show(Number(card.dataset.riskIndex));};show(0);
}

function initOwasp(){document.querySelectorAll('[data-owasp-set]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-owasp-set]').forEach(x=>x.classList.remove('active'));btn.classList.add('active');renderOwasp(btn.dataset.owaspSet);}));renderOwasp('web');}

function initAttackLab(){
 const wrap=document.getElementById('sdl-resilience-controls');if(!wrap)return;
 wrap.innerHTML=RESILIENCE_CONTROLS.map(c=>`<label class="sdl-sec-toggle"><input type="checkbox" data-res-control="${c.id}"><span><strong>${c.name}</strong><small>+${c.points} resilience points when relevant to the selected scenario.</small></span></label>`).join('');
 const score=()=>{const key=document.getElementById('sdl-scenario').value;const s=SCENARIOS[key];let total=s.base;RESILIENCE_CONTROLS.forEach(c=>{const el=wrap.querySelector(`[data-res-control="${c.id}"]`);if(el&&el.checked)total+=s.recommended.includes(c.id)?c.points:Math.round(c.points*.25);});return Math.min(100,total);};
 const update=()=>{const n=score();document.getElementById('sdl-resilience-score').textContent=n+'%';document.getElementById('sdl-resilience-bar').style.width=n+'%';};
 wrap.addEventListener('change',update);document.getElementById('sdl-scenario').addEventListener('change',update);
 document.getElementById('sdl-run-scenario').addEventListener('click',()=>{const key=document.getElementById('sdl-scenario').value;const s=SCENARIOS[key];const n=score();const log=document.getElementById('sdl-scenario-log');const enabled=RESILIENCE_CONTROLS.filter(c=>{const el=wrap.querySelector(`[data-res-control="${c.id}"]`);return el&&el.checked;}).map(c=>c.name);let lines=[`<span class="warn">[SCENARIO]</span> ${s.name}`];s.steps.forEach((x,i)=>lines.push(`<span class="${i>1&&n<55?'err':'warn'}">[T+${i+1}]</span> ${x}`));lines.push(`<span class="ok">[CONTROLS]</span> ${enabled.length?enabled.join(', '):'No additional controls enabled'}`);lines.push(`<span class="${n>=70?'ok':n>=50?'warn':'err'}">[OUTCOME]</span> Expected resilience ${n}% — ${n>=70?'degradation is likely to remain contained.':n>=50?'partial degradation is expected; blast radius remains material.':'high probability of broad service impact.'}`);log.innerHTML=lines.join('<br>');update();});
 document.getElementById('sdl-reset-scenario').addEventListener('click',()=>{wrap.querySelectorAll('input').forEach(x=>x.checked=false);document.getElementById('sdl-scenario-log').textContent='Select a scenario and run the simulation.';update();});update();
}

function initDevSecOps(){
 const wrap=document.getElementById('sdl-pipeline');if(!wrap)return;
 wrap.innerHTML=PIPELINE.map((p,i)=>`<label class="sdl-pipe-stage"><input type="checkbox" data-pipe="${p.id}" ${p.checked?'checked':''}><div class="stage-num">STAGE ${String(i+1).padStart(2,'0')} ${p.required?'· REQUIRED':''}</div><strong>${p.name}</strong><small>${p.desc}</small></label>`).join('');
 const update=()=>{let missing=[];PIPELINE.forEach(p=>{const input=wrap.querySelector(`[data-pipe="${p.id}"]`);const card=input.closest('.sdl-pipe-stage');card.classList.toggle('on',input.checked);card.classList.toggle('off',!input.checked);if(p.required&&!input.checked)missing.push(p.name);});const status=document.getElementById('sdl-gate-status');const copy=document.getElementById('sdl-gate-copy');if(missing.length){status.textContent='BLOCKED';status.className='sdl-gate-status block';copy.textContent='Required controls missing: '+missing.join(', ')+'.';}else{status.textContent='PASS';status.className='sdl-gate-status pass';copy.textContent='All required security controls are enabled. Release may proceed to the next environment.';}};
 wrap.addEventListener('change',update);update();
}

function init(){
 addNavigation();addSections();bindGlobalNav();initArchitecture();initOwasp();initAttackLab();initDevSecOps();
 const hash=(location.hash||'').slice(1);if(['security-hub','security-architecture','owasp-lab','attack-failure-lab','devsecops-lab'].includes(hash))openSection(hash);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.SystemDesignSecurityLab={open:openSection};
})();
