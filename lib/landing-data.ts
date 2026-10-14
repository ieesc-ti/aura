import { LandingPageConfig } from './types';

export const DEFAULT_LANDING_CONFIG: LandingPageConfig = {
  heroBadge: 'GESTÃO COMERCIAL DE REGISTRO MUSICAL & ROYALTIES',
  heroTitle: 'O CRM Especializado para',
  heroHighlight: 'Registro de Música',
  heroSubtitle:
    'Controle o ciclo completo das suas composições e fonogramas: cadastro oficial no ECAD & Associações, geração de códigos ISRC internacionais, divisão de Split Sheets e pipeline comercial de cotações para sincronização em streaming, filmes e publicidade.',
  heroCtaPrimary: 'Acessar Painel Administrativo',
  heroCtaSecondary: '+ Nova Cotação',
  heroTrack: {
    title: 'Mar Aberto (Versão Acústica)',
    album: 'Álbum: Horizontes 2024 • Edcarlos Lima & Marina Sol',
    artist: 'Edcarlos Lima & Marina Sol',
    isrc: 'BR-S9M-24-00182',
    iswc: 'T-312.459.882-1',
    status: 'Homologado ECAD',
    royaltiesTracked: 42890,
    splits: [
      { label: 'Autor (Edcarlos)', percentage: 50, color: 'bg-indigo-600' },
      { label: 'Produtor', percentage: 30, color: 'bg-purple-500' },
      { label: 'Intérprete', percentage: 20, color: 'bg-sky-500' },
    ],
  },
  metrics: [
    { id: 'm-1', value: '+52.000', label: 'Fonogramas Registrados com ISRC' },
    { id: 'm-2', value: '100%', label: 'Conformidade ECAD & Associações' },
    { id: 'm-3', value: 'R$ 14,8 M+', label: 'Em Royalties & Sincronizações no CRM' },
    { id: 'm-4', value: '+2.800', label: 'Compositores, Selos & Produtores' },
  ],
  servicesTitle: 'Tudo o que sua Música Precisa para Existir Legalmente e Gerar Receita',
  servicesSubtitle:
    'Nossa tecnologia conecta as pontas burocráticas da indústria fonográfica brasileira diretamente ao seu funil comercial no CRM.',
  services: [
    {
      id: 'srv-1',
      number: '1',
      title: 'Registro de Obras & Composição (ISWC)',
      description:
        'Proteja a autoria das suas letras, melodias e partituras antes do lançamento. Emissão de certificado com hash criptográfico de anterioridade contra plágio e homologação autoral.',
      linkText: 'Proteção autoral jurídica ✓',
      iconName: 'music',
    },
    {
      id: 'srv-2',
      number: '2',
      title: 'Emissão de ISRC para Fonogramas',
      description:
        'Gere os códigos ISRC oficiais para cada gravação, master, versão acústica ou remix. Cadastre os produtores fonográficos, intérpretes e músicos executantes no padrão IFPI.',
      linkText: 'Código ISRC homologado ✓',
      iconName: 'disc',
    },
    {
      id: 'srv-3',
      number: '3',
      title: 'Split Sheets & Divisão de Royalties',
      description:
        'Formalize com rapidez os percentuais entre múltiplos compositores, letristas e produtores. Contratos digitais com assinatura em nuvem para prevenir disputas judiciais de autoria.',
      linkText: 'Assinatura digital válida ✓',
      iconName: 'file-text',
    },
    {
      id: 'srv-4',
      number: '4',
      title: 'Homologação & Arrecadação ECAD',
      description:
        'Envio de repertório para as associações de gestão coletiva (UBC, ABRAMUS, SOCINPRO, AMAR, etc.) para recebimento de execução pública em rádio, TV, shows e plataformas digitais.',
      linkText: 'Rastreamento nacional ✓',
      iconName: 'radio',
    },
    {
      id: 'srv-5',
      number: '5',
      title: 'Pipeline de Sincronização (Sync)',
      description:
        'Gestão comercial de cotações para colocar suas músicas em filmes, novelas, séries de streaming (Netflix, Globoplay, Prime Video), publicidade e videogames.',
      linkText: 'Funil de cotações ativo ✓',
      iconName: 'dollar-sign',
    },
    {
      id: 'srv-6',
      number: '6',
      title: 'Auditoria de Streaming & Relatórios',
      description:
        'Conciliação de relatórios de distribuidoras digitais com projeção de receita líquida e controle de repasses para autores, intérpretes e produtores.',
      linkText: 'Auditoria e conciliação ✓',
      iconName: 'trending-up',
    },
  ],
  stepsTitle: 'Como Funciona o Registro no Aura HUB',
  stepsSubtitle:
    'Transformamos um processo tradicionalmente burocrático em um fluxo ágil de 4 etapas digitais.',
  steps: [
    {
      id: 'step-1',
      step: '01',
      title: 'Envio de Áudio & Letra',
      description:
        'Faça o upload do master (WAV/MP3), informe os títulos, versão e metadados dos participantes da gravação.',
    },
    {
      id: 'step-2',
      step: '02',
      title: 'Split Sheet & Assinatura',
      description:
        'Defina os percentuais exatos de cada compositor, intérprete e produtor com assinatura eletrônica por link.',
    },
    {
      id: 'step-3',
      step: '03',
      title: 'Geração ISRC & ECAD',
      description:
        'Emitimos o código ISRC oficial e protocolamos o fonograma e obra junto às associações arrecadadoras.',
    },
    {
      id: 'step-4',
      step: '04',
      title: 'Painel de Royalties & Sync',
      description:
        'Acompanhe execuções, cotações de sincronização para audiovisual e receba seus repasses com clareza.',
    },
  ],
  plansTitle: 'Escolha o Melhor Plano para a sua Música',
  plansSubtitle: 'Desde compositores independentes até gravadoras e grandes editoras musicais.',
  plans: [
    {
      id: 'plan-artista',
      name: 'COMPOSITOR INDEPENDENTE',
      tagline: 'Para artistas e autores que lançam singles e EPs pontuais.',
      price: 49,
      period: '/mês',
      description: 'Ideal para quem está iniciando ou possui poucos lançamentos anuais.',
      features: [
        'Até 5 ISRCs inclusos por mês',
        'Split Sheets ilimitadas',
        'Homologação no ECAD / UBC',
        'Certificado de anterioridade',
      ],
      popular: false,
      buttonText: 'Começar no Plano Artista',
      buttonVariant: 'outline',
      active: true,
    },
    {
      id: 'plan-selo',
      name: 'SELO & PRODUTORA (LABEL)',
      tagline: 'Para estúdios e selos com casting de múltiplos artistas.',
      price: 149,
      period: '/mês',
      description: 'O plano mais procurado por produtoras e selos independentes.',
      features: [
        'Até 30 ISRCs mensais',
        'Split sheets com assinaturas',
        'Cadastro no Banco de Sync',
        'Acesso multiusuários no CRM',
      ],
      popular: true,
      popularBadge: 'MAIS POPULAR • SELOS & ESTÚDIOS',
      buttonText: 'Contratar Plano Selo',
      buttonVariant: 'primary',
      active: true,
    },
    {
      id: 'plan-enterprise',
      name: 'EDITORA & ENTERPRISE',
      tagline: 'Para editoras musicais, gravadoras e catálogos corporativos.',
      price: 389,
      period: '/mês',
      description: 'Infraestrutura completa e dedicada para grandes operações de catálogo.',
      features: [
        'ISRCs Ilimitados',
        'Integração com sistemas ECAD',
        'Consultoria em Direito Autoral',
        'Relatórios customizados',
      ],
      popular: false,
      buttonText: 'Falar com Especialista',
      buttonVariant: 'outline',
      active: true,
    },
  ],
  faqsTitle: 'Perguntas Frequentes sobre Registro de Música',
  faqs: [
    {
      id: 'faq-1',
      question: 'O que é o código ISRC e por que toda gravação precisa dele?',
      answer:
        'O ISRC (International Standard Recording Code) é o RG exclusivo de cada gravação sonora (fonograma). Ele identifica a gravação exata, o intérprete, os músicos e o produtor fonográfico. Sem o ISRC, é impossível rastrear execuções no rádio, TV e plataformas digitais como Spotify e Apple Music para arrecadação de direitos conexos.',
    },
    {
      id: 'faq-2',
      question: 'Qual é a diferença entre o registro da Obra (ISWC) e do Fonograma (ISRC)?',
      answer:
        'A Obra (ISWC) protege a composição musical (letra e melodia) criada pelos compositores. O Fonograma (ISRC) protege a gravação sonora específica dessa obra (o master gravado em estúdio). Ambas geram arrecadações distintas no ECAD (Direito Autoral para a Obra e Direitos Conexos para o Fonograma).',
    },
    {
      id: 'faq-3',
      question: 'Como o CRM auxilia na geração e cumprimento da Split Sheet?',
      answer:
        'A Split Sheet formaliza a divisão de porcentagens entre compositores, letristas e produtores. O Aura HUB gera o documento oficial com validade jurídica e permite assinaturas eletrônicas seguras, evitando litígios e retenção de pagamentos nas associações arrecadadoras.',
    },
    {
      id: 'faq-4',
      question: 'Como funciona o recolhimento do ECAD e das Associações (UBC, ABRAMUS, etc.)?',
      answer:
        'O ECAD arrecada a execução pública de músicas e repassa os valores para as associações de gestão coletiva de cada titular (UBC, ABRAMUS, SOCINPRO, etc.). O Aura conecta seu catálogo aos metadados oficiais para garantir que todo centavo devido seja identificado e pago.',
    },
    {
      id: 'faq-5',
      question: 'Posso gerenciar negociações de Sincronização (Sync) e cotações no CRM?',
      answer:
        'Sim! O sistema possui um pipeline comercial Kanban especializado em licenciamento para cinema, publicidade, streaming e games, com controle de propostas, minutas contratuais e histórico de negociações.',
    },
  ],
  ctaTitle: 'Pronto para Registrar e Proteger seu Catálogo Musical?',
  ctaSubtitle:
    'Acesse o painel do CRM para cadastrar fonogramas, assinar split sheets e acompanhar seus royalties em tempo real.',
  theme: 'light',
};
