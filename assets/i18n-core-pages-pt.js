/* System Design Lab — Core pages PT-PT localisation
 * Translates the original learning/simulation pages while preserving technical terminology.
 */
(function(){
'use strict';

const STORAGE_KEY='sdl:locale';
const SKIP='script,style,code,pre,kbd,samp,textarea,svg,[data-sdl-no-i18n]';
const originalText=new WeakMap();
const originalAttrs=new WeakMap();
let observer=null;
let queued=false;

const T={
  /* Page titles + subtitles */
  'LLD Fundamentals':'Fundamentos de LLD (Low-Level Design)',
  'Object-Oriented Programming — the foundation of clean low-level design':'Programação Orientada a Objetos (OOP) — a base para um Low-Level Design limpo',
  'SOLID Principles':'Princípios SOLID',
  'Five principles for writing maintainable, scalable object-oriented code':'Cinco princípios para escrever código orientado a objetos manutenível e extensível',
  'Design Patterns':'Padrões de Design (Design Patterns)',
  'All 23 Gang of Four patterns — interactive animations and code examples':'Os 23 padrões Gang of Four (GoF) — animações interativas e exemplos de código',
  'LLD Advanced':'LLD Avançado',
  'Concurrency, API design, database normalization, and error handling':'Concorrência, design de APIs, normalização de bases de dados e tratamento de erros',
  'High-Level Design':'High-Level Design (HLD)',
  'System architecture, scalability, reliability, and CAP theorem':'Arquitetura de sistemas, escalabilidade, fiabilidade e Teorema CAP',
  'Infrastructure Components':'Componentes de Infraestrutura',
  'The building blocks that make production systems reliable and fast':'Os blocos fundamentais que tornam sistemas de produção rápidos e fiáveis',
  'Distributed Systems':'Sistemas Distribuídos (Distributed Systems)',
  'Sharding, replication, consistency, leader election, and observability':'Sharding, replicação, consistência, eleição de líder e observabilidade',
  'Interview Playground':'Playground de Entrevista',
  'Design real systems — click a system to see full animated architecture':'Desenha sistemas reais — seleciona um sistema para veres a arquitetura completa animada',
  '3D Architecture Lab':'Laboratório de Arquitetura 3D',
  'Explore system architectures in interactive 3D space — rotate, zoom, and click components':'Explora arquiteturas de sistemas num espaço 3D interativo — roda, amplia e seleciona componentes',
  'Distributed Systems Simulator':'Simulador de Sistemas Distribuídos',
  'Live simulation of distributed system behaviors — interact in real time':'Simulação em tempo real de comportamentos de sistemas distribuídos — interage diretamente com o sistema',
  'Interview Practice Mode':'Modo de Prática de Entrevista',
  'Simulate real FAANG system design interviews with guided steps and AI evaluation':'Simula entrevistas reais de System Design ao estilo FAANG, com passos orientados e avaliação por IA',
  'Architecture Builder':'Construtor de Arquitetura (Architecture Builder)',
  'Drag, drop and connect components to design your own system architecture':'Arrasta, larga e liga componentes para desenhares a tua própria arquitetura de sistema',
  'Interview Question Bank':'Banco de Perguntas de Entrevista',
  'Real FAANG system design questions with animated solutions':'Perguntas reais de System Design ao estilo FAANG com soluções animadas',
  'System Architect Survival':'Sobrevivência do Arquiteto de Sistemas',
  'Defend your distributed system against real-world failure cascades':'Defende o teu sistema distribuído contra cascatas de falhas realistas',
  'Architecture Whiteboard':'Whiteboard de Arquitetura',
  'Sketch system architectures freely — like Excalidraw for engineers':'Desenha arquiteturas de sistemas livremente — um Excalidraw orientado a engenharia',
  'Performance Analyzer':'Analisador de Desempenho (Performance Analyzer)',
  'Latency heatmaps, scalability analysis, and bottleneck detection for your architecture':'Heatmaps de latência, análise de escalabilidade e deteção de bottlenecks na tua arquitetura',
  'AI Architecture Generator':'Gerador de Arquitetura com IA',
  'Describe any system — instantly generate an interactive architecture diagram':'Descreve qualquer sistema — gera imediatamente um diagrama de arquitetura interativo',
  'Real-Time Traffic Simulator':'Simulador de Tráfego em Tempo Real',
  'Visualize requests flowing through your architecture — watch bottlenecks emerge in real time':'Visualiza pedidos a percorrer a arquitetura e observa bottlenecks a surgir em tempo real',
  'Chaos Engineering Lab':'Laboratório de Chaos Engineering',
  'Inject failures. Break things deliberately. Build resilient systems.':'Injeta falhas. Provoca disrupções deliberadamente. Constrói sistemas resilientes.',
  'CAP Theorem Playground':'Playground do Teorema CAP',
  'Simulate network partitions and see how real databases sacrifice Consistency vs Availability':'Simula partições de rede e observa como bases de dados reais equilibram Consistency vs Availability',
  'Global Traffic Map':'Mapa Global de Tráfego',
  'Visualize CDN edge nodes, data centers, and live request routing across the world':'Visualiza nós Edge de CDN, Data Centers e encaminhamento de pedidos em tempo real pelo mundo',
  'Infrastructure Cost Estimator':'Estimador de Custos de Infraestrutura',
  'Model your system, estimate monthly cloud spend across AWS, GCP, and Azure':'Modela o teu sistema e estima o custo mensal de Cloud em AWS, GCP e Azure',
  'Mock Interview Coach':'Coach de Mock Interview',
  'Timed system design sessions with real evaluation criteria':'Sessões cronometradas de System Design com critérios reais de avaliação',
  'Learning Path':'Percurso de Aprendizagem (Learning Path)',
  'Structured curriculum from zero to distributed systems expert':'Currículo estruturado desde os fundamentos até especialista em sistemas distribuídos',

  /* LLD / OOP */
  'Encapsulation':'Encapsulamento (Encapsulation)',
  'Abstraction':'Abstração (Abstraction)',
  'Inheritance':'Herança (Inheritance)',
  'Polymorphism':'Polimorfismo (Polymorphism)',
  'Bundle data and methods that operate on that data within a single unit. Restrict direct access to internal state using access modifiers.':'Agrupa dados e os métodos que operam sobre esses dados numa única unidade. Restringe o acesso direto ao estado interno através de modificadores de acesso.',
  "Think of a capsule — what's inside is hidden. Only defined openings (getters/setters) allow controlled access.":'Pensa numa cápsula: o conteúdo interno fica oculto. Apenas interfaces definidas (getters/setters) permitem acesso controlado.',
  'Single Responsibility Principle':'Single Responsibility Principle (SRP)',
  'Open/Closed Principle':'Open/Closed Principle (OCP)',
  'Liskov Substitution Principle':'Liskov Substitution Principle (LSP)',
  'Interface Segregation Principle':'Interface Segregation Principle (ISP)',
  'Dependency Inversion Principle':'Dependency Inversion Principle (DIP)',
  'A class should have only one reason to change. If a class does too much, modifying one responsibility risks breaking another.':'Uma classe deve ter apenas uma razão para mudar. Se uma classe assumir demasiadas responsabilidades, alterar uma delas pode comprometer as restantes.',
  '❌ Violation':'❌ Violação',
  '✅ Correct':'✅ Correto',
  '✅ Better':'✅ Melhor',
  'Creational (5)':'Criacionais (Creational) (5)',
  'Structural (7)':'Estruturais (Structural) (7)',
  'Behavioral (11)':'Comportamentais (Behavioral) (11)',
  'Concurrency':'Concorrência (Concurrency)',
  'Database Design':'Design de Base de Dados (Database Design)',
  'API Design':'Design de API',
  'Error Handling':'Tratamento de Erros (Error Handling)',

  /* HLD */
  'Architecture':'Arquitetura',
  'Scalability & NFRs':'Escalabilidade e NFRs',
  'Non-Functional Requirements (NFRs)':'Requisitos Não Funcionais (NFRs)',
  "NFRs define how well the system performs — not what it does. They're the quality attributes that separate a production system from a toy. In FAANG interviews, always clarify NFRs before designing.":'Os NFRs definem quão bem o sistema funciona — não o que faz. São os atributos de qualidade que distinguem um sistema de produção de um protótipo. Em entrevistas de System Design, clarifica sempre os NFRs antes de desenhar a solução.',
  'Performance / Latency':'Desempenho / Latência',
  'Availability / SLA':'Disponibilidade / SLA',
  'Scalability / Throughput':'Escalabilidade / Throughput',
  'Fault Tolerance':'Tolerância a Falhas (Fault Tolerance)',
  'Communication Patterns':'Padrões de Comunicação',
  'Synchronous — REST / gRPC':'Síncrono — REST / gRPC',
  'Asynchronous — Events (Kafka/SQS)':'Assíncrono — Eventos (Kafka/SQS)',
  'Decomposition Strategies':'Estratégias de Decomposição',
  'By Business Capability':'Por Capacidade de Negócio',
  'By Domain (DDD Bounded Contexts)':'Por Domínio (DDD Bounded Contexts)',
  'Strangler Fig Pattern':'Strangler Fig Pattern',

  /* Infra + distributed systems */
  'Load Balancer':'Balanceador de Carga (Load Balancer)',
  'Caching':'Caching',
  'Message Queue':'Fila de Mensagens (Message Queue)',
  'Sharding':'Particionamento (Sharding)',
  'Replication':'Replicação (Replication)',
  'Consistency':'Consistência (Consistency)',
  'Leader Election':'Eleição de Líder (Leader Election)',
  'Observability':'Observabilidade (Observability)',
  'Consistent Hashing':'Consistent Hashing',
  'Load Balancing':'Balanceamento de Carga (Load Balancing)',
  'A hashing technique that minimizes key remapping when nodes are added or removed. Each node owns a range on the hash ring. Virtual nodes (vnodes) ensure even distribution.':'Uma técnica de hashing que minimiza o remapeamento de chaves quando são adicionados ou removidos nós. Cada nó é responsável por um intervalo no Hash Ring. Virtual Nodes (vnodes) ajudam a garantir uma distribuição equilibrada.',
  'Add Node':'Adicionar Nó',
  'Kill Node':'Desativar Nó',
  'Send Request':'Enviar Pedido',
  'Burst (10x)':'Burst (10x)',
  'Network Partition':'Partição de Rede (Network Partition)',
  'Reset':'Repor',
  'Active Nodes':'Nós Ativos',
  'Total Requests':'Total de Pedidos',
  'Avg Latency':'Latência Média',
  'Errors':'Erros',
  'Event Log':'Registo de Eventos (Event Log)',

  /* 3D lab */
  'LAYERS:':'CAMADAS:',
  'Services':'Serviços',
  'Network':'Rede',
  'Infra':'Infra',
  'Drag to rotate · Scroll to zoom · Click node for info':'Arrasta para rodar · Scroll para zoom · Seleciona um nó para obter informação',
  'Click a component':'Seleciona um componente',
  'Rotate the scene and click any 3D node to see what it does, when to use it, and the key tradeoffs.':'Roda a cena e seleciona qualquer nó 3D para perceberes o que faz, quando deve ser utilizado e quais os principais trade-offs.',
  'Navigation':'Navegação',
  'Left drag':'Arrastar esquerdo',
  'Right drag':'Arrastar direito',
  'Scroll':'Scroll',
  'Click node':'Selecionar nó',
  'Rotate camera':'Rodar câmara',
  'Pan view':'Deslocar vista',
  'Zoom in/out':'Zoom in/out',
  'Show component info':'Mostrar informação do componente',
  'Color Legend':'Legenda de Cores',
  'Animated Flows':'Fluxos Animados',
  'Glowing particles travel along connection edges showing live request paths. Thicker edges = higher traffic volume. Pulsing nodes = active processing.':'Partículas luminosas percorrem as ligações representando os caminhos dos pedidos. Ligações mais espessas indicam maior volume de tráfego; nós pulsantes indicam processamento ativo.',

  /* Interview practice */
  'Design Twitter':'Desenhar Twitter',
  'Design YouTube':'Desenhar YouTube',
  'Design Uber':'Desenhar Uber',
  'Design WhatsApp':'Desenhar WhatsApp',
  'Design Netflix':'Desenhar Netflix',
  'URL Shortener':'Encurtador de URLs (URL Shortener)',
  'Chat System':'Sistema de Chat (Chat System)',
  '1.Requirements':'1. Requisitos',
  '2.Scale':'2. Escala',
  '3.Architecture':'3. Arquitetura',
  '4.Components':'4. Componentes',
  '5.Scaling':'5. Escalabilidade',
  '6.Failures':'6. Falhas',
  '7.Evaluate':'7. Avaliar',
  'Requirements':'Requisitos',
  'Scale':'Escala',
  'Components':'Componentes',
  'Scaling':'Escalabilidade',
  'Failures':'Falhas',
  'Evaluate':'Avaliar',

  /* Builder */
  'TOOL:':'FERRAMENTA:',
  'Select':'Selecionar',
  'Connect':'Ligar',
  'Simulate Traffic':'Simular Tráfego',
  'Clear All':'Limpar Tudo',
  'Export SVG':'Exportar SVG',
  'Click palette to add · Connect tool to wire components':'Seleciona a paleta para adicionar · Usa Connect para ligar componentes',
  'Client':'Cliente',
  'Mobile App':'Aplicação Móvel (Mobile App)',
  'Web Server':'Servidor Web (Web Server)',
  'Microservice':'Microserviço (Microservice)',
  'Auth Service':'Serviço de Autenticação (Auth Service)',
  'Database':'Base de Dados (Database)',
  'Search (ES)':'Pesquisa (Elasticsearch)',
  'Object Storage':'Object Storage',
  'Stream Processor':'Processador de Streams (Stream Processor)',
  'Monitor':'Monitorização',
  'Component Config':'Configuração do Componente',
  'Select a component to configure its properties.':'Seleciona um componente para configurar as respetivas propriedades.',
  'How to Use':'Como Utilizar',
  'Scaling Decisions':'Decisões de Escalabilidade',
  'Back-of-envelope':'Estimativa Back-of-the-Envelope',

  /* Whiteboard */
  'Pen (P)':'Caneta (P)',
  'Line (L)':'Linha (L)',
  'Arrow (A)':'Seta (A)',
  'Rectangle (R)':'Retângulo (R)',
  'Circle (C)':'Círculo (C)',
  'Text (T)':'Texto (T)',
  'Select (S)':'Selecionar (S)',
  'Eraser (E)':'Borracha (E)',
  'Server':'Servidor',
  'Queue':'Fila (Queue)',
  'Undo (Ctrl+Z)':'Desfazer (Ctrl+Z)',
  'Export PNG':'Exportar PNG',
  'Keyboard Shortcuts':'Atalhos de Teclado',
  'Shape Stamps':'Componentes Pré-definidos',
  'Export':'Exportar',
  'Click SVR/DB/CAC/QUE/LB/CLI toolbar buttons to stamp pre-drawn system components at cursor position. Then connect with Arrow tool.':'Seleciona SVR/DB/CAC/QUE/LB/CLI na toolbar para inserir componentes pré-desenhados na posição do cursor. Depois liga-os com a ferramenta Arrow.',
  'Click 💾 to export the whiteboard as PNG. Great for saving your architecture sketches to share with your team.':'Seleciona 💾 para exportar o Whiteboard em PNG. Útil para guardar e partilhar os teus esquemas de arquitetura.',

  /* Performance */
  'Latency Heatmap':'Heatmap de Latência',
  'Scalability Analysis':'Análise de Escalabilidade',
  'Capacity Planning':'Planeamento de Capacidade (Capacity Planning)',
  'Load':'Carga',
  'Cache':'Cache',
  'Replicas':'Réplicas',
  'Low':'Baixa',
  'High':'Alta',
  'Est. RPS Capacity':'Capacidade RPS Estimada',
  'requests/second':'pedidos/segundo',
  'DB Write Load':'Carga de Escrita na BD',
  'of capacity':'da capacidade',
  'Cache Hit Ratio':'Cache Hit Ratio',
  'estimated':'estimado',
  'P99 Latency':'Latência P99',
  'under peak load':'sob carga de pico',
  'Network Egress':'Egress de Rede',
  'estimated bandwidth':'largura de banda estimada',
  'single node failure: OK':'falha de um único nó: OK',
  'Bottleneck Analysis':'Análise de Bottlenecks',
  'Database Write Throughput':'Throughput de Escrita da Base de Dados',
  'API Gateway Single Point':'API Gateway como Single Point',
  'Cache Eviction Under Load':'Cache Eviction sob Carga',
  'Throughput vs. Latency Curve':'Curva Throughput vs. Latência',
  'Capacity Calculator':'Calculadora de Capacidade',
  'Daily Active Users':'Utilizadores Ativos Diários (DAU)',
  'Avg Requests per User per Day':'Média de Pedidos por Utilizador/Dia',
  'Avg Record Size (bytes)':'Tamanho Médio de Registo (bytes)',
  'Data Retention (years)':'Retenção de Dados (anos)',

  /* AI */
  'Generate':'Gerar',
  'Quick prompts:':'Prompts rápidos:',
  'Distributed Cache':'Cache Distribuída (Distributed Cache)',
  'Try: "Design a scalable chat system" or "Design Instagram"':'Experimenta: "Desenhar um sistema de chat escalável" ou "Desenhar Instagram"',

  /* Traffic / chaos / CAP / global map */
  'Simulate CDN Routing':'Simular Routing de CDN',
  'Simulate Region Failover':'Simular Failover de Região',
  'Show Latency Heatmap':'Mostrar Heatmap de Latência',
  'Live Traffic Flow':'Fluxo de Tráfego em Tempo Real',
  'Active Requests':'Pedidos Ativos',
  'Active Regions':'Regiões Ativas',
  'Avg CDN Latency':'Latência Média da CDN',
  'PACELC Trade-off':'Trade-off PACELC',
  'Availability':'Disponibilidade (Availability)',
  'AP System: Prefers availability over consistency':'Sistema AP: privilegia Availability em relação a Consistency',

  /* Cost estimator */
  'System Parameters':'Parâmetros do Sistema',
  'Daily Active Users (DAU)':'Utilizadores Ativos Diários (DAU)',
  'Requests per user per day':'Pedidos por utilizador/dia',
  'Average response size (KB)':'Tamanho médio da resposta (KB)',
  'Data stored per user (MB)':'Dados armazenados por utilizador (MB)',
  'Cache hit ratio (%)':'Cache Hit Ratio (%)',
  'Deployment regions':'Regiões de Deployment',
  'Single region':'Região única',
  '2 regions (active-passive)':'2 regiões (Active-Passive)',
  '3 regions (active-active)':'3 regiões (Active-Active)',
  '5 regions (global)':'5 regiões (Global)',
  'Monthly Estimate':'Estimativa Mensal',

  /* Mock interview */
  'Junior':'Júnior',
  'Senior':'Sénior',
  'Staff/Principal':'Staff / Principal',
  'Basic system design. 30 min sessions. Graded on fundamentals.':'System Design básico. Sessões de 30 minutos. Avaliação centrada nos fundamentos.',
  'Complex distributed systems. 45 min. Full FAANG criteria.':'Sistemas distribuídos complexos. 45 minutos. Critérios completos ao estilo FAANG.',
  'Org-level design, ambiguity, leadership. 60 min.':'Design ao nível organizacional, ambiguidade e liderança. 60 minutos.',
  'Start Mock Interview':'Iniciar Mock Interview',
  'Question':'Pergunta',
  'System Design Question':'Pergunta de System Design',
  'Evaluation Checklist — check each as you cover it':'Checklist de Avaliação — assinala cada ponto à medida que o abordas',
  'Next Question':'Pergunta Seguinte',
  'Finish & Grade':'Concluir e Avaliar',
  'Interview Score':'Pontuação da Entrevista',
  'New Interview':'Nova Entrevista',

  /* Learning path */
  'Choose Your Track':'Escolhe o Teu Percurso',
  'Beginner':'Iniciante',
  'Intermediate':'Intermédio',
  'Advanced':'Avançado',
  'Expert':'Especialista',
  'OOP + LLD fundamentals':'Fundamentos de OOP + LLD',
  'System design fundamentals':'Fundamentos de System Design',
  'Large-scale architecture':'Arquitetura de Grande Escala',
  'Curriculum —':'Currículo —',
  'Track Progress':'Progresso do Percurso',
  'Completed':'Concluído',
  'Active':'Ativo',
  'Locked':'Bloqueado',

  /* Generic UI */
  'All':'Todos',
  'FILTER:':'FILTRO:',
  'Level':'Nível',
  'Score':'Pontuação',
  'Latency':'Latência',
  'Requests':'Pedidos',
  'Start':'Iniciar',
  'Stop':'Parar',
  'Run':'Executar',
  'Next':'Seguinte',
  'Previous':'Anterior',
  'Close':'Fechar',
  'Save':'Guardar',
  'Delete':'Eliminar',
  'Settings':'Definições',
  'Configuration':'Configuração',
  'Status':'Estado',
  'Success':'Sucesso',
  'Warning':'Aviso',
  'Failed':'Falhou',
  'Ready':'Pronto',
  'Running':'Em execução',
  'Stopped':'Parado'
};

const ATTRS=['title','placeholder','aria-label'];

function locale(){return localStorage.getItem(STORAGE_KEY)||'pt-PT';}
function key(v){return String(v||'').replace(/\s+/g,' ').trim();}
function translated(v){const k=key(v);return Object.prototype.hasOwnProperty.call(T,k)?T[k]:null;}

function translateNode(node){
  if(!node||!node.parentElement||node.parentElement.closest(SKIP))return;
  if(!originalText.has(node))originalText.set(node,node.nodeValue);
  const original=originalText.get(node);
  const compact=key(original);
  if(!compact)return;
  const result=translated(compact);
  if(result===null)return;
  const lead=(original.match(/^\s*/)||[''])[0];
  const tail=(original.match(/\s*$/)||[''])[0];
  const next=lead+result+tail;
  if(node.nodeValue!==next)node.nodeValue=next;
}

function translateAttrs(el){
  if(!el||!el.getAttribute||el.closest(SKIP))return;
  let store=originalAttrs.get(el);
  if(!store){store={};originalAttrs.set(el,store);}
  ATTRS.forEach(function(name){
    if(!el.hasAttribute(name))return;
    if(!(name in store))store[name]=el.getAttribute(name);
    const result=translated(store[name]);
    if(result!==null&&el.getAttribute(name)!==result)el.setAttribute(name,result);
  });
}

function walk(root){
  if(locale()!=='pt-PT')return;
  if(!root)return;
  if(root.nodeType===3){translateNode(root);return;}
  if(root.nodeType!==1&&root.nodeType!==9&&root.nodeType!==11)return;
  if(root.nodeType===1&&root.matches&&root.matches(SKIP))return;
  if(root.nodeType===1)translateAttrs(root);
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);
  let n;
  while((n=walker.nextNode())){
    if(n.nodeType===3)translateNode(n);
    else translateAttrs(n);
  }
}

function restore(){
  document.querySelectorAll('*').forEach(function(el){
    const store=originalAttrs.get(el);
    if(store)Object.keys(store).forEach(function(name){if(el.getAttribute(name)!==store[name])el.setAttribute(name,store[name]);});
  });
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  let n;
  while((n=walker.nextNode())){
    if(originalText.has(n)&&n.nodeValue!==originalText.get(n))n.nodeValue=originalText.get(n);
  }
}

function refresh(){if(locale()==='pt-PT')walk(document.body);else restore();}
function queue(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;refresh();});}

function observe(){
  if(observer)return;
  observer=new MutationObserver(function(mutations){
    if(locale()!=='pt-PT')return;
    let needed=false;
    mutations.forEach(function(m){
      if(m.type==='childList'&&m.addedNodes.length)needed=true;
      else if(m.type==='characterData')needed=true;
      else if(m.type==='attributes')needed=true;
    });
    if(needed)queue();
  });
  observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:ATTRS});
}

function init(){refresh();observe();[100,350,900,1800].forEach(function(ms){setTimeout(refresh,ms);});}
window.addEventListener('sdl:locale-change',function(){setTimeout(refresh,0);});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();

window.SDLCoreI18N={refresh:refresh,dictionary:T};
})();
