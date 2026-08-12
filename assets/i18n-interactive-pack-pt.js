/* PT-PT dictionary pack: interactive labs, interview/practice, builder, whiteboard, performance and cost. */
(function(){
'use strict';
const PACK={
  /* Simulator */
  '＋ Add Node':'＋ Adicionar Nó',
  '✕ Kill Node':'✕ Desativar Nó',
  '→ Send Request':'→ Enviar Pedido',
  '⚡ Burst (10x)':'⚡ Burst (10x)',
  '⚡ Network Partition':'⚡ Network Partition',
  '↺ Reset':'↺ Repor',
  'A hashing technique that minimizes key remapping when nodes are added or removed. Each node owns a range on the hash ring. Virtual nodes (vnodes) ensure even distribution.':'Uma técnica de hashing que minimiza o remapeamento de chaves quando nós são adicionados ou removidos. Cada nó é responsável por um intervalo no Hash Ring. Virtual Nodes (vnodes) ajudam a obter uma distribuição equilibrada.',

  /* Interview practice */
  'Interview Practice Mode':'Modo de Prática de Entrevista',
  'Simulate real FAANG system design interviews with guided steps and AI evaluation':'Simula entrevistas de System Design ao estilo FAANG com passos orientados e avaliação assistida por IA',
  'Design Twitter':'Desenhar Twitter',
  'Design YouTube':'Desenhar YouTube',
  'Design Uber':'Desenhar Uber',
  'Design WhatsApp':'Desenhar WhatsApp',
  'Design Netflix':'Desenhar Netflix',
  'URL Shortener':'Encurtador de URLs (URL Shortener)',

  /* Builder */
  'Architecture Builder':'Construtor de Arquitetura (Architecture Builder)',
  'Drag, drop and connect components to design your own system architecture':'Arrasta, larga e liga componentes para desenhares a tua própria arquitetura de sistema',
  'Network':'Rede',
  'Data':'Dados',
  'Component Config':'Configuração do Componente',
  'Select a component to configure its properties.':'Seleciona um componente para configurar as respetivas propriedades.',
  'How to Use':'Como Utilizar',
  'Tips':'Dicas',
  'Architecture Stats':'Estatísticas da Arquitetura',
  'Nodes: 0 · Edges: 0':'Nós: 0 · Ligações: 0',
  'Add components to start building.':'Adiciona componentes para começares a construir.',
  'Architecture Advisor':'Assistente de Arquitetura',
  'Build an architecture to receive AI-powered suggestions.':'Constrói uma arquitetura para receber sugestões assistidas por IA.',

  /* Question bank */
  'Interview Question Bank':'Banco de Perguntas de Entrevista',
  'Real FAANG system design questions with animated solutions':'Perguntas de System Design ao estilo FAANG com soluções animadas',
  'FILTER:':'FILTRO:',
  'All':'Todos',
  'Beginner':'Iniciante',
  'Intermediate':'Intermédio',
  'Advanced':'Avançado',

  /* Survival game */
  'System Architect Survival':'Sobrevivência do Arquiteto de Sistemas',
  'Defend your distributed system against real-world failure cascades':'Defende o teu sistema distribuído contra cascatas de falhas realistas',
  'Level':'Nível',
  'Score':'Pontuação',
  'Budget':'Orçamento',
  'Req/sec':'Pedidos/seg',
  '+ DB Replica':'+ Réplica de BD',
  '+ CDN Node':'+ Nó CDN',
  'Easy':'Fácil',
  'Hard':'Difícil',
  'Start Game':'Iniciar Jogo',
  'Node Inspector':'Inspector de Nós',
  'Current Challenge':'Desafio Atual',
  'Active Incidents':'Incidentes Ativos',

  /* Whiteboard */
  'Architecture Whiteboard':'Whiteboard de Arquitetura',
  'Sketch system architectures freely — like Excalidraw for engineers':'Desenha arquiteturas de sistemas livremente — uma experiência semelhante ao Excalidraw orientada a engenharia',
  'Pen (P)':'Caneta (P)',
  'Line (L)':'Linha (L)',
  'Arrow (A)':'Seta (A)',
  'Rectangle (R)':'Retângulo (R)',
  'Circle (C)':'Círculo (C)',
  'Text (T)':'Texto (T)',
  'Select (S)':'Selecionar (S)',
  'Eraser (E)':'Borracha (E)',
  'Undo (Ctrl+Z)':'Desfazer (Ctrl+Z)',
  'Clear All':'Limpar Tudo',
  'Export PNG':'Exportar PNG',
  'Keyboard Shortcuts':'Atalhos de Teclado',
  'Shape Stamps':'Componentes Pré-definidos',
  'Export':'Exportar',
  'Click SVR/DB/CAC/QUE/LB/CLI toolbar buttons to stamp pre-drawn system components at cursor position. Then connect with Arrow tool.':'Seleciona SVR/DB/CAC/QUE/LB/CLI na toolbar para inserir componentes pré-desenhados na posição do cursor. Depois liga-os com a ferramenta Arrow.',
  'Click 💾 to export the whiteboard as PNG. Great for saving your architecture sketches to share with your team.':'Seleciona 💾 para exportar o Whiteboard em PNG. Útil para guardar e partilhar esquemas de arquitetura com a equipa.',

  /* Performance analyzer */
  'Latency Heatmap':'Heatmap de Latência',
  'Scalability Analysis':'Análise de Escalabilidade',
  'Capacity Planning':'Planeamento de Capacidade (Capacity Planning)',
  'Load':'Carga',
  'Replicas':'Réplicas',
  'Low':'Baixa',
  'High':'Alta',
  'Est. RPS Capacity':'Capacidade RPS Estimada',
  'requests/second':'pedidos/segundo',
  'DB Write Load':'Carga de Escrita na BD',
  'of capacity':'da capacidade',
  'estimated':'estimado',
  'under peak load':'sob carga de pico',
  'estimated bandwidth':'largura de banda estimada',
  'single node failure: OK':'falha de um único nó: OK',
  'Bottleneck Analysis':'Análise de Bottlenecks',
  'Database Write Throughput':'Throughput de Escrita da Base de Dados',
  'Single primary at 72% capacity. Add write queue + worker consumers or switch to multi-primary.':'Primary único a 72% da capacidade. Adiciona uma Write Queue com Worker Consumers ou evolui para Multi-Primary.',
  'API Gateway Single Point':'API Gateway como Single Point',
  'API gateway not horizontally scaled. Add 2+ instances behind load balancer.':'O API Gateway não está escalado horizontalmente. Adiciona pelo menos duas instâncias atrás de um Load Balancer.',
  'Cache Eviction Under Load':'Cache Eviction sob Carga',
  'Cache hit ratio drops under 3× load spike. Pre-warm critical keys on startup.':'O Cache Hit Ratio diminui durante um pico de carga 3×. Faz Pre-Warm das chaves críticas no arranque.',
  'Throughput vs. Latency Curve':'Curva Throughput vs. Latência',
  'Capacity Calculator':'Calculadora de Capacidade',
  'Daily Active Users':'Utilizadores Ativos Diários (DAU)',
  'Avg Requests per User per Day':'Média de Pedidos por Utilizador/Dia',
  'Avg Record Size (bytes)':'Tamanho Médio de Registo (bytes)',
  'Data Retention (years)':'Retenção de Dados (anos)',

  /* AI architecture */
  'AI Architecture Generator':'Gerador de Arquitetura com IA',
  'Describe any system — instantly generate an interactive architecture diagram':'Descreve qualquer sistema — gera imediatamente um diagrama de arquitetura interativo',
  'Generate':'Gerar',
  'Quick prompts:':'Prompts rápidos:',
  'Distributed Cache':'Cache Distribuída (Distributed Cache)',
  'Try: "Design a scalable chat system" or "Design Instagram"':'Experimenta: "Desenhar um sistema de chat escalável" ou "Desenhar Instagram"',

  /* CAP / global traffic */
  'Global Traffic Map':'Mapa Global de Tráfego',
  'Visualize CDN edge nodes, data centers, and live request routing across the world':'Visualiza nós Edge de CDN, Data Centers e encaminhamento de pedidos em tempo real pelo mundo',
  'Simulate CDN Routing':'Simular Routing de CDN',
  'Simulate Region Failover':'Simular Failover de Região',
  'Show Latency Heatmap':'Mostrar Heatmap de Latência',
  'Live Traffic Flow':'Fluxo de Tráfego em Tempo Real',
  'Active Requests':'Pedidos Ativos',
  'Active Regions':'Regiões Ativas',
  'Avg CDN Latency':'Latência Média da CDN',
  'PACELC Trade-off':'Trade-off PACELC',
  'AP System: Prefers availability over consistency':'Sistema AP: privilegia Availability em relação a Consistency',

  /* Cost estimator */
  'Infrastructure Cost Estimator':'Estimador de Custos de Infraestrutura',
  'Model your system, estimate monthly cloud spend across AWS, GCP, and Azure':'Modela o teu sistema e estima o custo mensal de Cloud em AWS, GCP e Azure',
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
  'Mock Interview Coach':'Coach de Mock Interview',
  'Timed system design sessions with real evaluation criteria':'Sessões cronometradas de System Design com critérios reais de avaliação',
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
  'Learning Path':'Percurso de Aprendizagem (Learning Path)',
  'Structured curriculum from zero to distributed systems expert':'Currículo estruturado desde os fundamentos até especialista em Sistemas Distribuídos',
  'Choose Your Track':'Escolhe o Teu Percurso',
  'OOP + LLD fundamentals':'Fundamentos de OOP + LLD',
  'System design fundamentals':'Fundamentos de System Design',
  'Large-scale architecture':'Arquitetura de Grande Escala',
  'Curriculum —':'Currículo —',
  'Track Progress':'Progresso do Percurso',
  'Completed':'Concluído',
  'Active':'Ativo',
  'Locked':'Bloqueado'
};
function install(){
 const engine=window.SDLCoreContentI18N;
 if(!engine||!engine.dictionary){setTimeout(install,50);return;}
 Object.assign(engine.dictionary,PACK);
 if(engine.refresh)engine.refresh();
 window.SDLInteractivePackPT=PACK;
}
install();
})();
