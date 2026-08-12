/* PT-PT dictionary pack for all Gang of Four Design Pattern descriptions. */
(function(){
'use strict';
const PACK={
  'Use when:':'Utilizar quando:',
  'Pattern':'Pattern',

  'Only one instance of a class exists throughout the app lifetime.':'Existe apenas uma instância da classe durante todo o ciclo de vida da aplicação.',
  'Only one instance of a class exists throughout the app ...':'Uma única instância durante todo o ciclo de vida...',
  'Database connection pool, Logger, Config manager':'Database Connection Pool, Logger, Config Manager',

  'Define an interface for creating objects but let subclasses decide which class to instantiate.':'Define uma interface para criação de objetos, deixando às subclasses a decisão sobre a classe concreta a instanciar.',
  'Define an interface for creating objects but let subcla...':'Define uma interface de criação e delega a instanciação...',
  'UI frameworks, Payment gateway selection':'Frameworks de UI, seleção de Payment Gateway',

  'Create families of related objects without specifying concrete classes.':'Cria famílias de objetos relacionados sem especificar diretamente as classes concretas.',
  'Create families of related objects without specifying c...':'Cria famílias de objetos relacionados sem classes concretas...',
  'Cross-platform UI toolkits, Multi-theme apps':'Toolkits de UI Cross-Platform, aplicações Multi-Theme',

  'Separate construction of complex objects from their representation.':'Separa a construção de objetos complexos da respetiva representação.',
  'Separate construction of complex objects from their rep...':'Separa a construção do objeto da sua representação...',
  'SQL query builders, HTTP request builders, Config objects':'SQL Query Builders, HTTP Request Builders, objetos de configuração',

  'Clone existing objects without coupling to their concrete classes.':'Clona objetos existentes sem criar acoplamento às respetivas classes concretas.',
  'Clone existing objects without coupling to their concre...':'Clona objetos sem acoplamento às classes concretas...',
  'Expensive object creation, Undo systems, Game objects':'Criação dispendiosa de objetos, sistemas de Undo, objetos de jogo',

  'Convert the interface of a class into another interface that clients expect.':'Converte a interface de uma classe noutra interface esperada pelos clientes.',
  'Convert the interface of a class into another interface...':'Adapta uma interface àquela que o cliente espera...',
  'Integrating legacy systems, Third-party library wrappers':'Integração de sistemas Legacy, wrappers de bibliotecas Third-Party',

  'Separate abstraction from implementation so both can vary independently.':'Separa a abstração da implementação para que ambas possam evoluir de forma independente.',
  'Separate abstraction from implementation so both can va...':'Separa abstração e implementação para evolução independente...',
  'Cross-platform apps, Different rendering backends':'Aplicações Cross-Platform, diferentes Rendering Backends',

  'Compose objects into tree structures to represent part-whole hierarchies.':'Compõe objetos em estruturas de árvore para representar hierarquias parte-todo.',
  'Compose objects into tree structures to represent part-...':'Compõe objetos em árvores para hierarquias parte-todo...',
  'File systems, UI component trees, Organization charts':'File Systems, árvores de componentes UI, organogramas',

  'Attach additional responsibilities to an object dynamically.':'Adiciona responsabilidades a um objeto dinamicamente, sem alterar a classe base.',
  'Attach additional responsibilities to an object dynamic...':'Adiciona responsabilidades dinamicamente a um objeto...',
  'Java I/O streams, Middleware chains, Feature toggles':'Java I/O Streams, cadeias de Middleware, Feature Toggles',

  'Provide a simplified interface to a complex subsystem.':'Fornece uma interface simplificada para um subsistema complexo.',
  'Provide a simplified interface to a complex subsystem....':'Expõe uma interface simples sobre um subsistema complexo...',
  'API wrappers, SDK facades, Simplified library interfaces':'API Wrappers, facades de SDK, interfaces simplificadas de bibliotecas',

  'Share common state among many fine-grained objects to save memory.':'Partilha estado comum entre muitos objetos granulares para reduzir consumo de memória.',
  'Share common state among many fine-grained objects to s...':'Partilha estado comum para reduzir utilização de memória...',
  'Text editors, Particle systems, Game character instances':'Editores de texto, Particle Systems, instâncias de personagens de jogos',

  'Provide a substitute or placeholder for another object to control access.':'Fornece um substituto ou placeholder para outro objeto, permitindo controlar o acesso.',
  'Provide a substitute or placeholder for another object ...':'Controla o acesso através de um substituto do objeto real...',
  'Lazy loading, Access control, Caching, Virtual proxies':'Lazy Loading, Access Control, Caching, Virtual Proxies',

  'Define a one-to-many dependency so when one object changes, all dependents are notified.':'Define uma dependência um-para-muitos em que alterações num objeto notificam todos os dependentes.',
  'Define a one-to-many dependency so when one object chan...':'Notifica automaticamente vários dependentes sobre alterações...',
  'Event systems, MVC, React state, pub/sub':'Sistemas de eventos, MVC, React State, Pub/Sub',

  'Define a family of algorithms, encapsulate each one, and make them interchangeable.':'Define uma família de algoritmos, encapsula cada um e permite substituí-los de forma transparente.',
  'Define a family of algorithms, encapsulate each one, an...':'Encapsula algoritmos intercambiáveis numa estratégia...',
  'Sorting algorithms, Payment strategies, Compression':'Algoritmos de ordenação, estratégias de pagamento, compressão',

  'Encapsulate a request as an object, enabling undo/redo, queuing, and logging.':'Encapsula um pedido como objeto, permitindo Undo/Redo, Queuing e Logging.',
  'Encapsulate a request as an object, enabling undo/redo,...':'Encapsula pedidos como objetos para Undo/Redo e Queuing...',
  'Undo/redo systems, Task queues, Transaction logs':'Sistemas Undo/Redo, Task Queues, Transaction Logs',

  'Allow an object to alter its behavior when its internal state changes.':'Permite que um objeto altere o seu comportamento quando o estado interno muda.',
  'Allow an object to alter its behavior when its internal...':'Altera o comportamento do objeto consoante o seu estado...',
  'Traffic lights, Order status, User authentication':'Semáforos, estado de encomendas, autenticação de utilizadores',

  'Pass a request along a chain of handlers, each deciding to process or pass it on.':'Encaminha um pedido através de uma cadeia de handlers; cada handler decide processá-lo ou passá-lo ao seguinte.',
  'Pass a request along a chain of handlers, each deciding...':'Encaminha pedidos por uma cadeia de handlers...',
  'Middleware, Auth pipelines, Exception handling':'Middleware, pipelines de autenticação, tratamento de exceções',

  'Define an object that encapsulates how a set of objects interact, promoting loose coupling.':'Define um objeto que encapsula a forma como vários objetos interagem, promovendo Loose Coupling.',
  'Define an object that encapsulates how a set of objects...':'Centraliza interações entre objetos com menor acoplamento...',
  'Chat rooms, Air traffic control, Event buses':'Salas de chat, controlo de tráfego aéreo, Event Buses',

  'Define the skeleton of an algorithm in a base class, deferring steps to subclasses.':'Define o esqueleto de um algoritmo numa classe base, delegando determinados passos às subclasses.',
  'Define the skeleton of an algorithm in a base class, de...':'Define um algoritmo-base e delega passos às subclasses...',
  'Data processing pipelines, Framework hooks, Build systems':'Pipelines de processamento de dados, Framework Hooks, sistemas de Build',

  'Provide a way to sequentially access elements of a collection without exposing its structure.':'Permite aceder sequencialmente aos elementos de uma coleção sem expor a estrutura interna.',
  'Provide a way to sequentially access elements of a coll...':'Percorre coleções sem expor a estrutura interna...',
  'Collections, Database cursors, Stream processing':'Coleções, Database Cursors, Stream Processing',

  'Add new operations to classes without modifying them by separating algorithm from structure.':'Adiciona novas operações a classes sem as modificar, separando o algoritmo da estrutura dos objetos.',
  'Add new operations to classes without modifying them by...':'Adiciona operações sem modificar as classes visitadas...',
  'Compilers, Report generation, Document processing':'Compiladores, geração de relatórios, processamento de documentos',

  "Capture and externalize an object's internal state so it can be restored later.":'Captura e externaliza o estado interno de um objeto para que possa ser restaurado posteriormente.',
  "Capture and externalize an object's internal state so i...":'Captura o estado de um objeto para posterior restauro...',
  'Undo/redo, Snapshots, Game saves':'Undo/Redo, Snapshots, Game Saves',

  'Define a representation for a grammar and an interpreter for it.':'Define uma representação para uma gramática e um interpretador capaz de a processar.',
  'Define a representation for a grammar and an interprete...':'Representa uma gramática e define o seu interpretador...',
  'Regular expressions, SQL parsers, Template engines':'Expressões regulares, SQL Parsers, Template Engines'
};
function install(){
 const engine=window.SDLCoreContentI18N;
 if(!engine||!engine.dictionary){setTimeout(install,50);return;}
 Object.assign(engine.dictionary,PACK);
 if(engine.refresh)engine.refresh();
 window.SDLPatternsPackPT=PACK;
}
install();
})();
