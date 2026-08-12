/* Extended PT-PT translations for detailed core educational content. */
(function(){
'use strict';
const STORAGE_KEY='sdl:locale';
const SKIP='script,style,code,pre,kbd,samp,textarea,svg,[data-sdl-no-i18n]';
const O=new WeakMap();
const A=new WeakMap();
let busy=false;

const T={
  /* OOP / UML */
  'A child class inherits properties and methods from a parent class, enabling code reuse and establishing an IS-A relationship.':'Uma classe filha herda propriedades e métodos de uma classe pai, permitindo reutilização de código e estabelecendo uma relação IS-A.',
  'A Car IS-A Vehicle. A SavingsAccount IS-A BankAccount. Inheritance models real-world hierarchies.':'Um Car IS-A Vehicle. Uma SavingsAccount IS-A BankAccount. A herança modela hierarquias do mundo real.',
  'Same interface, different implementations. One method name behaves differently based on the object type at runtime.':'A mesma interface pode ter implementações diferentes. O mesmo método comporta-se de forma distinta consoante o tipo de objeto em runtime.',
  'Runtime polymorphism: Method dispatch decided at runtime via virtual table lookup.':'Polimorfismo em runtime: o Method Dispatch é decidido em runtime através de Virtual Table Lookup.',
  'UML Class Relationships':'Relações entre Classes UML',
  'Understanding relationship notation is critical for drawing class diagrams in interviews.':'Compreender a notação das relações é essencial para desenhar diagramas de classes em entrevistas.',

  /* SOLID detail */
  'Open for extension, Closed for modification. Add new behavior by creating new classes, not by modifying existing ones.':'Aberto para extensão, fechado para modificação. Adiciona novo comportamento através de novas classes, sem alterar classes existentes.',
  '❌ Violation — modifying PaymentProcessor for each payment':'❌ Violação — alterar PaymentProcessor para cada meio de pagamento',
  '✅ Extend without modifying':'✅ Estender sem modificar',
  "Subtypes must be substitutable for their base types. If S is a subtype of T, using S anywhere T is used should not break the program.":'Os subtipos devem poder substituir os seus tipos base. Se S é subtipo de T, usar S onde T é esperado não deve quebrar o programa.',
  "❌ Violation — Penguin IS-A Bird but can't fly":'❌ Violação — Penguin IS-A Bird, mas não consegue voar',
  '✅ Model behavior correctly':'✅ Modelar o comportamento corretamente',
  'No client should be forced to depend on methods it does not use. Split large interfaces into smaller, specific ones.':'Nenhum cliente deve ser obrigado a depender de métodos que não utiliza. Divide interfaces grandes em interfaces menores e específicas.',
  '❌ Fat interface':'❌ Interface demasiado abrangente',
  '✅ Segregated interfaces':'✅ Interfaces segregadas',
  'High-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details.':'Módulos de alto nível não devem depender de módulos de baixo nível. Ambos devem depender de abstrações, e as abstrações não devem depender de detalhes de implementação.',
  '❌ Direct dependency on low-level':'❌ Dependência direta de baixo nível',
  '✅ Depend on abstraction':'✅ Depender de abstrações',

  /* HLD detail */
  'Direct request-response. Caller waits for reply. gRPC is faster (Protocol Buffers). REST is simpler (JSON). Risk: cascading failures — use circuit breakers.':'Request-response direto. O caller aguarda pela resposta. gRPC é mais eficiente com Protocol Buffers; REST é mais simples com JSON. Risco: falhas em cascata — utiliza Circuit Breakers.',
  'Fire and forget. Best for notifications, analytics, billing. Decouples services, better fault tolerance, eventual consistency. Dead letter queues for failures.':'Fire-and-forget. Adequado para notificações, analítica e billing. Desacopla serviços, melhora a tolerância a falhas e normalmente implica Eventual Consistency. Usa Dead Letter Queues para falhas.',
  'Most common.':'Mais comum.',
  'Aligns service boundaries with team ownership.':'Alinha os limites dos serviços com a responsabilidade das equipas.',
  'Incrementally extract from monolith. Lowest risk migration path.':'Extrai funcionalidades do monólito de forma incremental. É uma abordagem de migração de menor risco.',
  "Conway's Law:":'Lei de Conway:',
  'Performance / Latency':'Desempenho / Latência',
  'How fast does the system respond? Always ask about percentile SLOs: p50/p95/p99. Tail latency matters — the 1% of slow requests affect real users.':'Com que rapidez responde o sistema? Avalia sempre SLOs por percentil: p50/p95/p99. A Tail Latency é relevante — o 1% de pedidos mais lentos afeta utilizadores reais.',
  '% of time the system is operational and serving requests. Each additional "9" = 10× less downtime. Most FAANG systems target 99.99%+.':'Percentagem de tempo em que o sistema está operacional e a servir pedidos. Cada "9" adicional representa aproximadamente 10× menos downtime. Sistemas de grande escala apontam frequentemente para 99,99% ou superior.',
  'Ability to handle growing load without degradation. Throughput = requests per second (RPS). Design for 3× peak load.':'Capacidade de suportar aumento de carga sem degradação. Throughput = pedidos por segundo (RPS). Dimensiona para múltiplos da carga de pico.',
  'System continues operating correctly despite component failures. MTBF (Mean Time Between Failures) and MTTR (Mean Time To Recovery) are key engineering metrics.':'O sistema continua a operar corretamente apesar de falhas de componentes. MTBF (Mean Time Between Failures) e MTTR (Mean Time To Recovery) são métricas fundamentais.',
  'Security':'Segurança',
  'CIA Triad: Confidentiality, Integrity, Availability. Defense-in-depth — multiple layers of controls.':'Tríade CIA: Confidentiality, Integrity e Availability. Defence-in-Depth — múltiplas camadas de controlos.',

  /* Builder detail */
  'Drag':'Arrastar',
  'configure':'configurar',
  'Simulate':'Simular',
  'Tips':'Dicas',
  'Architecture Stats':'Estatísticas da Arquitetura',
  'Nodes: 0 · Edges: 0 Add components to start building.':'Nós: 0 · Ligações: 0 Adiciona componentes para começar a construir.',
  'Architecture Advisor':'Assistente de Arquitetura',
  'Build an architecture to receive AI-powered suggestions.':'Constrói uma arquitetura para receber sugestões assistidas por IA.',
  '1. Drag components from palette onto canvas 2. Select Connect tool, then drag between nodes 3. Click a node to configure it 4. Press Simulate to animate traffic flow':'1. Arrasta componentes da paleta para o canvas 2. Seleciona Connect e liga os nós 3. Seleciona um nó para o configurar 4. Executa Simulate para animar o fluxo de tráfego',
  '• Nodes snap to 40px grid automatically • Double-click a node to rename it • Connections show animated request flow • Red glow = bottleneck in simulation mode':'• Os nós alinham automaticamente numa grelha de 40px • Duplo clique permite renomear um nó • As ligações mostram fluxo de pedidos animado • Brilho vermelho = bottleneck no modo de simulação',

  /* Question bank / game */
  'Req/sec':'Pedidos/seg',
  'Budget':'Orçamento',
  '+ API Server':'+ API Server',
  '+ Redis Cache':'+ Redis Cache',
  '+ Kafka Queue':'+ Kafka Queue',
  '+ DB Replica':'+ Réplica de BD',
  '+ CDN Node':'+ Nó CDN',
  'Rate Limiter':'Rate Limiter',
  'New Game':'Novo Jogo',
  'Defend your distributed system against real-world failure cascades. Build, scale, and survive 10 progressively harder scenarios.':'Defende o teu sistema distribuído contra cascatas de falhas realistas. Constrói, escala e sobrevive a 10 cenários progressivamente mais exigentes.',
  'Easy':'Fácil',
  'Normal':'Normal',
  'Hard':'Difícil',
  'Chaos':'Chaos',
  'Start Game':'Iniciar Jogo',
  'Node Inspector':'Inspector de Nós',
  'Click any node on the canvas to inspect its real-time metrics.':'Seleciona qualquer nó no canvas para inspecionar as respetivas métricas em tempo real.',
  'Current Challenge':'Desafio Atual',
  'Start the game to receive your first incident brief.':'Inicia o jogo para receberes o primeiro Incident Brief.',
  'Active Incidents':'Incidentes Ativos',
  'No active incidents.':'Sem incidentes ativos.',

  /* Whiteboard detail */
  'Pen':'Caneta',
  'Line':'Linha',
  'Arrow':'Seta',
  'Rect':'Retângulo',
  'Eraser':'Borracha',
  'Undo':'Desfazer',
  'Clear selection':'Limpar seleção',

  /* Performance detail */
  'Single primary at 72% capacity. Add write queue + worker consumers or switch to multi-primary.':'Primary único a 72% da capacidade. Adiciona uma Write Queue com Worker Consumers ou evolui para Multi-Primary.',
  'API gateway not horizontally scaled. Add 2+ instances behind load balancer.':'O API Gateway não está escalado horizontalmente. Adiciona pelo menos duas instâncias atrás de um Load Balancer.',
  'Cache hit ratio drops under 3× load spike. Pre-warm critical keys on startup.':'O Cache Hit Ratio diminui durante um pico de carga 3×. Faz Pre-Warm das chaves críticas no arranque.',

  /* Learning-path generated content */
  'Object-Oriented Programming':'Programação Orientada a Objetos (OOP)',
  'OOP + LLD fundamentals':'Fundamentos de OOP + LLD',
  'Write clean, well-structured classes in any OOP language.':'Escreve classes limpas e bem estruturadas em qualquer linguagem orientada a objetos.',
  'Write code that is maintainable, extensible, and testable.':'Escreve código manutenível, extensível e testável.',
  'Encapsulation — hide internal state':'Encapsulation — ocultar estado interno',
  'Abstraction — expose only what matters':'Abstraction — expor apenas o necessário',
  'Inheritance — reuse and extend':'Inheritance — reutilizar e estender',
  'Polymorphism — one interface, many forms':'Polymorphism — uma interface, múltiplas formas',
  'S — Single Responsibility Principle':'S — Single Responsibility Principle',
  'O — Open/Closed Principle':'O — Open/Closed Principle',
  'L — Liskov Substitution':'L — Liskov Substitution',
  'I — Interface Segregation':'I — Interface Segregation',
  'D — Dependency Inversion':'D — Dependency Inversion',

  /* Misc */
  'Tradeoffs':'Trade-offs',
  'Trade-offs':'Trade-offs',
  'Best for':'Adequado para',
  'Use when':'Utilizar quando',
  'Avoid when':'Evitar quando',
  'Pros':'Vantagens',
  'Cons':'Desvantagens',
  'Example':'Exemplo',
  'Examples':'Exemplos',
  'Key idea':'Ideia-chave',
  'Key concepts':'Conceitos-chave'
};

function lang(){return localStorage.getItem(STORAGE_KEY)||'pt-PT';}
function norm(v){return String(v||'').replace(/\s+/g,' ').trim();}
function tr(v){const k=norm(v);return Object.prototype.hasOwnProperty.call(T,k)?T[k]:null;}
function text(node){
  if(!node||!node.parentElement||node.parentElement.closest(SKIP))return;
  const result=tr(node.nodeValue);
  if(result===null)return;
  if(!O.has(node))O.set(node,node.nodeValue);
  const raw=O.get(node),lead=(raw.match(/^\s*/)||[''])[0],tail=(raw.match(/\s*$/)||[''])[0];
  const next=lead+result+tail;if(node.nodeValue!==next)node.nodeValue=next;
}
function attrs(el){
  if(!el||!el.getAttribute||el.closest(SKIP))return;
  ['title','placeholder','aria-label'].forEach(function(name){
    if(!el.hasAttribute(name))return;
    const current=el.getAttribute(name),result=tr(current);if(result===null)return;
    let s=A.get(el);if(!s){s={};A.set(el,s);}if(!(name in s))s[name]=current;
    if(current!==result)el.setAttribute(name,result);
  });
}
function walk(root){
  if(lang()!=='pt-PT'||!root)return;
  if(root.nodeType===3){text(root);return;}if(root.nodeType===1&&root.matches(SKIP))return;
  if(root.nodeType===1)attrs(root);
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);let n;
  while((n=w.nextNode())){if(n.nodeType===3)text(n);else attrs(n);}
}
function restore(){
  document.querySelectorAll('*').forEach(function(el){const s=A.get(el);if(s)Object.keys(s).forEach(function(k){el.setAttribute(k,s[k]);});});
  const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode()))if(O.has(n))n.nodeValue=O.get(n);
}
function refresh(){if(lang()==='pt-PT')walk(document.body);else restore();}
function queue(){if(busy)return;busy=true;requestAnimationFrame(function(){busy=false;refresh();});}
function init(){refresh();const mo=new MutationObserver(queue);mo.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['title','placeholder','aria-label']});[150,500,1200,2200].forEach(function(ms){setTimeout(refresh,ms);});}
window.addEventListener('sdl:locale-change',function(){setTimeout(refresh,0);});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.SDLCoreExtendedI18N={refresh:refresh,dictionary:T};
})();
