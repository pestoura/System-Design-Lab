/* Detailed PT-PT content translations for legacy System Design Lab pages. */
(function(){
'use strict';
const STORAGE_KEY='sdl:locale';
const SKIP='script,style,code,pre,kbd,samp,textarea,svg,[data-sdl-no-i18n]';
const O=new WeakMap();
const A=new WeakMap();
let scheduled=false;

const T={
  /* Legacy home cards still present in the core */
  'Every web request travels this path. Understanding each hop is the foundation of system design.':'Todos os pedidos Web percorrem este caminho. Compreender cada etapa é uma base essencial de System Design.',
  'Describe any system and get an interactive architecture diagram with analysis.':'Descreve qualquer sistema e obtém um diagrama de arquitetura interativo acompanhado de análise.',
  'Traffic Simulator':'Simulador de Tráfego',
  'Visualize 100 to 10M RPS flowing through your architecture in real time.':'Visualiza entre 100 e 10 milhões de RPS a percorrer a tua arquitetura em tempo real.',
  'Inject failures — server crash, DB outage, network partition. Build resilience.':'Injeta falhas — crash de servidor, indisponibilidade da BD e Network Partition. Constrói resiliência.',
  'CAP Theorem Lab':'Laboratório do Teorema CAP',
  'Simulate network partitions. See how Cassandra vs MongoDB behave in real time.':'Simula Network Partitions e observa em tempo real como Cassandra e MongoDB reagem.',
  'Timed FAANG interviews with checklist evaluation and detailed feedback.':'Entrevistas cronometradas ao estilo FAANG, com checklist de avaliação e feedback detalhado.',
  'Structured curriculum: Beginner → Intermediate → Advanced → Expert.':'Currículo estruturado: Iniciante → Intermédio → Avançado → Especialista.',

  /* OOP detailed content */
  "Hide implementation details, expose only what's necessary. Define a contract through abstract classes or interfaces.":'Oculta os detalhes de implementação e expõe apenas o necessário. Define um contrato através de classes abstratas ou interfaces.',
  "Like a car's steering wheel — you don't need to know how the engine works to drive.":'Tal como num volante de automóvel: não precisas de conhecer o funcionamento interno do motor para conduzir.',
  'A child class inherits properties and methods from a parent class, enabling code reuse and establishing an IS-A relationship.':'Uma classe filha herda propriedades e métodos de uma classe pai, permitindo reutilização de código e estabelecendo uma relação IS-A.',
  'A Car IS-A Vehicle. A SavingsAccount IS-A BankAccount. Inheritance models real-world hierarchies.':'Um Car IS-A Vehicle. Uma SavingsAccount IS-A BankAccount. A herança permite modelar hierarquias do mundo real.',
  'Same interface, different implementations. One method name behaves differently based on the object type at runtime.':'A mesma interface pode ter implementações diferentes. O mesmo método comporta-se de forma distinta consoante o tipo de objeto em runtime.',
  'Runtime polymorphism:':'Polimorfismo em runtime:',
  'Method dispatch decided at runtime via virtual table lookup.':'O Method Dispatch é decidido em runtime através de Virtual Table Lookup.',
  'UML Class Relationships':'Relações entre Classes UML',
  'Understanding relationship notation is critical for drawing class diagrams in interviews.':'Compreender a notação das relações é essencial para desenhar diagramas de classes em entrevistas.',

  /* SOLID detailed content */
  'Open for extension, Closed for modification.':'Aberto para extensão, fechado para modificação.',
  'Add new behavior by creating new classes, not by modifying existing ones.':'Adiciona novo comportamento criando novas classes, sem modificar as existentes.',
  '❌ Violation — modifying PaymentProcessor for each payment':'❌ Violação — modificar PaymentProcessor para cada método de pagamento',
  '✅ Extend without modifying':'✅ Estender sem modificar',
  'Subtypes must be substitutable for their base types. If S is a subtype of T, using S anywhere T is used should not break the program.':'Os subtipos devem poder substituir os respetivos tipos base. Se S é um subtipo de T, utilizar S onde T é esperado não deve quebrar o programa.',
  "❌ Violation — Penguin IS-A Bird but can't fly":'❌ Violação — Penguin IS-A Bird, mas não consegue voar',
  '✅ Model behavior correctly':'✅ Modelar o comportamento corretamente',
  'No client should be forced to depend on methods it does not use. Split large interfaces into smaller, specific ones.':'Nenhum cliente deve ser obrigado a depender de métodos que não utiliza. Divide interfaces grandes em interfaces menores e específicas.',
  '❌ Fat interface':'❌ Interface demasiado abrangente',
  '✅ Segregated interfaces':'✅ Interfaces segregadas',
  'High-level modules':'Módulos de alto nível',
  'low-level modules':'módulos de baixo nível',
  'abstractions':'abstrações',
  '❌ Direct dependency on low-level':'❌ Dependência direta de baixo nível',
  '✅ Depend on abstraction':'✅ Depender de abstrações',

  /* LLD Advanced */
  'Error Handling Strategies':'Estratégias de Tratamento de Erros',

  /* HLD tabs and architecture evolution */
  'CAP Theorem':'Teorema CAP',
  'Arch Patterns':'Padrões Arquiteturais',
  'Architecture Evolution':'Evolução da Arquitetura',
  'Monolith':'Monólito (Monolith)',
  'Layered (N-Tier)':'Arquitetura em Camadas (N-Tier)',
  'Microservices':'Microserviços (Microservices)',
  'Monolithic Architecture':'Arquitetura Monolítica',
  'all components (UI, business logic, data access) live in ONE deployable unit. The entire application ships as a single artifact: one build, one deploy, one process.':'todos os componentes (UI, lógica de negócio e acesso a dados) residem numa única unidade de deployment. Toda a aplicação é entregue como um único artefacto: um build, um deployment e um processo.',
  'Simple deployment':'Deployment simples',
  'Easy local dev':'Desenvolvimento local simples',
  'Simple debugging':'Debugging simples',
  'Low latency (in-process)':'Baixa latência (in-process)',
  'Hard to scale selectively':'Difícil escalar componentes seletivamente',
  'Tech stack lock-in':'Lock-in da stack tecnológica',
  'Long build/test cycles':'Ciclos de build/teste longos',
  'Deploy risk — all or nothing':'Risco no deployment — tudo ou nada',
  'When to use a Monolith':'Quando utilizar um Monólito',
  'Early-stage startups — move fast, validate product first':'Startups em fase inicial — rapidez e validação do produto primeiro',
  'Small teams (<10 engineers) — microservices overhead not worth it':'Equipas pequenas (<10 engenheiros) — o overhead dos Microservices pode não compensar',
  "Well-understood domain where service boundaries aren't clear yet":'Domínios bem compreendidos em que os limites dos serviços ainda não estão claros',
  'Avoid when components need very different scaling profiles':'Evita quando os componentes exigem perfis de escalabilidade muito diferentes',
  'Avoid when teams need to deploy independently at high velocity':'Evita quando as equipas precisam de efetuar deployments independentes com elevada frequência',
  'Real world:':'Exemplo real:',
  "Instagram, Shopify, and Stack Overflow ran monoliths for years at massive scale. The \"Majestic Monolith\" is a valid, often overlooked pattern. Don't rush to microservices.":'Instagram, Shopify e Stack Overflow operaram monólitos durante anos a grande escala. O padrão "Majestic Monolith" é válido e muitas vezes subestimado. Não evoluas para Microservices sem necessidade.',
  'Layered (N-Tier) Architecture':'Arquitetura em Camadas (N-Tier)',
  'strict separation into horizontal layers. Each layer ONLY communicates with the adjacent layer directly below it. Classic enterprise pattern — MVC is a variant.':'separação rigorosa em camadas horizontais. Cada camada comunica diretamente apenas com a camada adjacente inferior. É um padrão Enterprise clássico; MVC é uma variante.',
  'Clear separation of concerns':'Separação clara de responsabilidades',
  'Testable each layer in isolation':'Cada camada pode ser testada isoladamente',
  'Well-known pattern':'Padrão amplamente conhecido',
  'Sinkhole anti-pattern risk':'Risco de Sinkhole Anti-Pattern',
  'Rigid layer dependency':'Dependência rígida entre camadas',
  'Always traverses all layers':'Percorre sempre todas as camadas',

  /* HLD communication + NFR */
  'Communication Patterns':'Padrões de Comunicação',
  'Synchronous — REST / gRPC':'Síncrono — REST / gRPC',
  'Asynchronous — Events (Kafka/SQS)':'Assíncrono — Eventos (Kafka/SQS)',
  'Direct request-response. Caller waits for reply. gRPC is faster (Protocol Buffers). REST is simpler (JSON). Risk: cascading failures — use circuit breakers.':'Request-response direto. O caller aguarda pela resposta. gRPC é mais eficiente com Protocol Buffers; REST é mais simples com JSON. Risco: falhas em cascata — utiliza Circuit Breakers.',
  'Fire and forget. Best for notifications, analytics, billing. Decouples services, better fault tolerance, eventual consistency. Dead letter queues for failures.':'Fire-and-forget. Adequado para notificações, analítica e billing. Desacopla serviços, melhora a tolerância a falhas e normalmente implica Eventual Consistency. Utiliza Dead Letter Queues para falhas.',
  'Decomposition Strategies':'Estratégias de Decomposição',
  'By Business Capability':'Por Capacidade de Negócio',
  'User, Order, Payment, Notification. Most common.':'User, Order, Payment, Notification. É a abordagem mais comum.',
  'By Domain (DDD Bounded Contexts)':'Por Domínio (DDD Bounded Contexts)',
  'Aligns service boundaries with team ownership.':'Alinha os limites dos serviços com a responsabilidade das equipas.',
  'Incrementally extract from monolith. Lowest risk migration path.':'Extrai funcionalidades do monólito de forma incremental. É uma abordagem de migração de menor risco.',
  "Systems mirror the communication structure of the organization.":'Os sistemas refletem a estrutura de comunicação da organização.',
  'Design your team structure first, then your service boundaries.':'Define primeiro a estrutura das equipas e depois os limites dos serviços.',
  'How fast does the system respond? Always ask about percentile SLOs: p50/p95/p99. Tail latency matters — the 1% of slow requests affect real users.':'Com que rapidez responde o sistema? Avalia sempre SLOs por percentil: p50/p95/p99. A Tail Latency é relevante — o 1% de pedidos mais lentos afeta utilizadores reais.',
  '% of time the system is operational and serving requests. Each additional "9" = 10× less downtime. Most FAANG systems target 99.99%+.':'Percentagem de tempo em que o sistema está operacional e a servir pedidos. Cada "9" adicional representa aproximadamente 10× menos downtime. Sistemas de grande escala apontam frequentemente para 99,99% ou superior.',
  'Ability to handle growing load without degradation. Throughput = requests per second (RPS). Design for 3× peak load.':'Capacidade de suportar aumento de carga sem degradação. Throughput = pedidos por segundo (RPS). Dimensiona com margem para picos de carga.',
  'System continues operating correctly despite component failures. MTBF (Mean Time Between Failures) and MTTR (Mean Time To Recovery) are key engineering metrics.':'O sistema continua a operar corretamente apesar de falhas de componentes. MTBF (Mean Time Between Failures) e MTTR (Mean Time To Recovery) são métricas fundamentais.',
  'Graceful degradation (serve stale data > error)':'Graceful Degradation (servir dados desatualizados pode ser preferível a erro)',
  "Circuit breakers (fail fast, don't cascade)":'Circuit Breakers (Fail Fast e evitar cascatas)',
  'Bulkhead isolation (contain failures)':'Bulkhead Isolation (conter falhas)',
  'Retry with exponential backoff + jitter':'Retry com Exponential Backoff + Jitter',
  'CIA Triad: Confidentiality, Integrity, Availability. Defense-in-depth — multiple layers of controls.':'Tríade CIA: Confidentiality, Integrity e Availability. Defence-in-Depth — múltiplas camadas de controlos.',
  'TLS 1.3 for all data in transit':'TLS 1.3 para todos os dados em trânsito',
  'AES-256 encryption at rest':'Cifragem AES-256 em repouso',
  'OAuth2/JWT for authentication':'OAuth2/JWT para autenticação',
  'Zero-trust network architecture':'Arquitetura de rede Zero Trust',
  'Rate limiting at API gateway':'Rate Limiting no API Gateway',
  'Durability & Data Consistency':'Durabilidade e Consistência de Dados',
  'Data must survive failures. Design RPO (data loss tolerance) and RTO (recovery time). Replication factor ≥ 3 for critical data.':'Os dados devem sobreviver a falhas. Define RPO (tolerância à perda de dados) e RTO (tempo de recuperação). Para dados críticos, considera um Replication Factor adequado ao risco.',
  'Write-ahead logs (WAL) for crash recovery':'Write-Ahead Logs (WAL) para recuperação após crash',
  'Synchronous replication for strong durability':'Replicação síncrona para elevada durabilidade',

  /* 3D lab explanatory text */
  'Network layer (Client, LB, CDN)':'Camada de Rede (Client, LB, CDN)',
  'Service layer (API, Gateway)':'Camada de Serviços (API, Gateway)',
  'Application layer (Microservices)':'Camada Aplicacional (Microservices)',
  'Data layer (DB, Cache)':'Camada de Dados (DB, Cache)',
  'Infrastructure (Queue, Storage)':'Infraestrutura (Queue, Storage)',

  /* Builder help */
  'Drag components from palette onto canvas':'Arrasta componentes da paleta para o canvas',
  'Select Connect tool, then drag between nodes':'Seleciona a ferramenta Connect e liga os nós',
  'Click a node to configure it':'Seleciona um nó para o configurar',
  'Press Simulate to animate traffic flow':'Executa Simulate para animar o fluxo de tráfego',
  'Nodes snap to 40px grid automatically':'Os nós alinham automaticamente numa grelha de 40px',
  'Double-click a node to rename it':'Faz duplo clique num nó para o renomear',
  'Connections show animated request flow':'As ligações mostram o fluxo animado de pedidos',
  'Red glow = bottleneck in simulation mode':'Brilho vermelho = bottleneck no modo de simulação',
  'Architecture Advisor':'Assistente de Arquitetura',
  'Build an architecture to receive AI-powered suggestions.':'Constrói uma arquitetura para receber sugestões assistidas por IA.',

  /* Survival game */
  'Defend your distributed system against real-world failure cascades. Build, scale, and survive 10 progressively harder scenarios.':'Defende o teu sistema distribuído contra cascatas de falhas realistas. Constrói, escala e sobrevive a 10 cenários progressivamente mais exigentes.',
  'Start Game':'Iniciar Jogo',
  'New Game':'Novo Jogo',
  'Node Inspector':'Inspector de Nós',
  'Click any node on the canvas to inspect its real-time metrics.':'Seleciona qualquer nó no canvas para inspecionar as respetivas métricas em tempo real.',
  'Current Challenge':'Desafio Atual',
  'Start the game to receive your first incident brief.':'Inicia o jogo para receberes o primeiro Incident Brief.',
  'Active Incidents':'Incidentes Ativos',
  'No active incidents.':'Sem incidentes ativos.',

  /* Generic explanatory labels */
  'Real world':'Exemplo real',
  'Key tradeoffs':'Principais trade-offs',
  'When to use':'Quando utilizar',
  'When not to use':'Quando evitar',
  'Advantages':'Vantagens',
  'Disadvantages':'Desvantagens',
  'Recommended':'Recomendado',
  'Not recommended':'Não recomendado'
};

function locale(){return localStorage.getItem(STORAGE_KEY)||'pt-PT';}
function norm(v){return String(v||'').replace(/\s+/g,' ').trim();}
function lookup(v){const k=norm(v);return Object.prototype.hasOwnProperty.call(T,k)?T[k]:null;}
function text(n){
 if(!n||!n.parentElement||n.parentElement.closest(SKIP))return;
 const value=lookup(n.nodeValue);if(value===null)return;
 if(!O.has(n))O.set(n,n.nodeValue);
 const src=O.get(n),lead=(src.match(/^\s*/)||[''])[0],tail=(src.match(/\s*$/)||[''])[0];
 const next=lead+value+tail;if(n.nodeValue!==next)n.nodeValue=next;
}
function attrs(el){
 if(!el||!el.getAttribute||el.closest(SKIP))return;
 ['title','placeholder','aria-label'].forEach(function(name){
  if(!el.hasAttribute(name))return;
  const current=el.getAttribute(name),value=lookup(current);if(value===null)return;
  let store=A.get(el);if(!store){store={};A.set(el,store);}if(!(name in store))store[name]=current;
  if(current!==value)el.setAttribute(name,value);
 });
}
function walk(root){
 if(locale()!=='pt-PT'||!root)return;
 if(root.nodeType===3){text(root);return;}
 if(root.nodeType===1&&root.matches&&root.matches(SKIP))return;
 if(root.nodeType===1)attrs(root);
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);let n;
 while((n=w.nextNode())){if(n.nodeType===3)text(n);else attrs(n);}
}
function restore(){
 document.querySelectorAll('*').forEach(function(el){const store=A.get(el);if(store)Object.keys(store).forEach(function(k){el.setAttribute(k,store[k]);});});
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode()))if(O.has(n))n.nodeValue=O.get(n);
}
function refresh(){if(locale()==='pt-PT')walk(document.body);else restore();}
function queue(){if(scheduled)return;scheduled=true;requestAnimationFrame(function(){scheduled=false;refresh();});}
function init(){refresh();const mo=new MutationObserver(queue);mo.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['title','placeholder','aria-label']});[120,420,1000,2000].forEach(function(ms){setTimeout(refresh,ms);});}
window.addEventListener('sdl:locale-change',function(){setTimeout(refresh,0);});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.SDLCoreContentI18N={refresh:refresh,dictionary:T};
})();
