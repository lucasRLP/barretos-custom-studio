// Configuração do WhatsApp
export const WHATSAPP_NUMBER = "5521993652442";

// Categorias de produtos
export const CATEGORIES = [
  {
    id: "t-shirt",
    name: "T-Shirt",
    description: "Camisetas personalizadas para todos os estilos",
    idealFor: "Eventos, uniformes casuais e promocionais",
    tags: ["Alta durabilidade", "Custo-benefício", "Várias cores"],
    image: "/placeholder.svg",
  },
  {
    id: "camisa-polo",
    name: "Camisa Polo",
    description: "Polos elegantes para sua equipe",
    idealFor: "Empresas, equipes comerciais e eventos corporativos",
    tags: ["Visual profissional", "Conforto", "Premium"],
    image: "/placeholder.svg",
  },
  {
    id: "camisa-social",
    name: "Camisa Social",
    description: "Camisas sociais personalizadas com qualidade",
    idealFor: "Uniformes corporativos e eventos formais",
    tags: ["Elegância", "Personalização discreta", "Alta qualidade"],
    image: "/placeholder.svg",
  },
  {
    id: "moletom-careca",
    name: "Moletom Careca",
    description: "Moletom sem capuz, clássico e confortável",
    idealFor: "Uniformes de inverno e brindes premium",
    tags: ["Conforto", "Durabilidade", "Entrega Brasil"],
    image: "/placeholder.svg",
  },
  {
    id: "moletom-ziper",
    name: "Moletom Zíper",
    description: "Moletom com zíper frontal prático",
    idealFor: "Uniformes funcionais e brindes corporativos",
    tags: ["Praticidade", "Versatilidade", "Premium"],
    image: "/placeholder.svg",
  },
  {
    id: "moletom-canguru",
    name: "Moletom Canguru",
    description: "Moletom com capuz e bolso canguru",
    idealFor: "Eventos, equipes e moda promocional",
    tags: ["Estilo jovem", "Conforto", "Popular"],
    image: "/placeholder.svg",
  },
  {
    id: "calcas-bermudas",
    name: "Calças e Bermudas",
    description: "Calças e bermudas para uniformes completos",
    idealFor: "Uniformes completos e equipes esportivas",
    tags: ["Conjunto completo", "Resistência", "Conforto"],
    image: "/placeholder.svg",
  },
  {
    id: "fitness-dry-fit",
    name: "Fitness Dry Fit",
    description: "Roupas esportivas com tecnologia Dry Fit",
    idealFor: "Academias, corridas e eventos esportivos",
    tags: ["Alta performance", "Secagem rápida", "Conforto térmico"],
    image: "/placeholder.svg",
  },
  {
    id: "jaleco-avental",
    name: "Jaleco e Avental",
    description: "Jalecos e aventais profissionais",
    idealFor: "Clínicas, restaurantes e indústrias",
    tags: ["Profissional", "Resistente", "Fácil higienização"],
    image: "/placeholder.svg",
  },
  {
    id: "ecobag",
    name: "Ecobag",
    description: "Sacolas ecológicas personalizadas",
    idealFor: "Brindes sustentáveis e eventos",
    tags: ["Sustentável", "Grande área de impressão", "Custo-benefício"],
    image: "/placeholder.svg",
  },
  {
    id: "sacochila",
    name: "Sacochila",
    description: "Sacochilas práticas e versáteis",
    idealFor: "Eventos, escolas e brindes promocionais",
    tags: ["Prático", "Leve", "Ótimo custo-benefício"],
    image: "/placeholder.svg",
  },
  {
    id: "bones",
    name: "Bonés",
    description: "Bonés personalizados para ações promocionais e equipes",
    idealFor: "Brindes, merchandising e uniformes",
    tags: ["Alta visibilidade", "Estilo", "Personalização total"],
    image: "/placeholder.svg",
  },
  {
    id: "almofadas",
    name: "Almofadas",
    description: "Almofadas personalizadas para brindes e decoração",
    idealFor: "Brindes, eventos e ações promocionais",
    tags: ["Conforto", "Versatilidade", "Personalização total"],
    image: "/placeholder.svg",
  },
  {
    id: "copos-garrafas",
    name: "Copos e Garrafas",
    description: "Copos e garrafas para brindes e uso diário",
    idealFor: "Brindes corporativos e eventos",
    tags: ["Uso diário", "Marca sempre visível", "Diversos modelos"],
    image: "/placeholder.svg",
  },
  {
    id: "brindes",
    name: "Brindes",
    description: "Diversos brindes personalizados",
    idealFor: "Campanhas promocionais e fidelização",
    tags: ["Variedade", "Personalização", "Impacto"],
    image: "/placeholder.svg",
  },
  {
    id: "uniformes-profissionais",
    name: "Uniformes Profissionais",
    description: "Soluções completas em uniformes empresariais",
    idealFor: "Empresas, indústrias e comércios",
    tags: ["Solução completa", "Consultoria", "Escala"],
    image: "/placeholder.svg",
  },
] as const;

// Categorias destacadas para a home
export const FEATURED_CATEGORIES = [
  "t-shirt",
  "camisa-polo",
  "moletom-canguru",
  "bones",
  "almofadas",
  "fitness-dry-fit",
  "uniformes-profissionais",
  "brindes",
];

// Técnicas de personalização
export const TECHNIQUES = [
  {
    id: "dtf",
    name: "DTF",
    fullName: "Direct to Film",
    description: "Impressão digital de alta definição transferida para o tecido. Ideal para designs coloridos e detalhados.",
    idealFor: "Fotos, degradês, designs multicoloridos",
    pros: ["Alta definição", "Cores vibrantes", "Qualquer quantidade", "Toque macio"],
    cons: ["Não indicado para tecidos muito escuros sem base branca"],
    artChecklist: ["Imagem em alta resolução (300 DPI)", "Formato PNG ou PDF", "Cores em CMYK"],
  },
  {
    id: "silk-screen",
    name: "Silk Screen",
    fullName: "Serigrafia",
    description: "Técnica tradicional de impressão com telas e tintas especiais. Excelente para grandes quantidades.",
    idealFor: "Grandes tiragens, cores chapadas, uniformes",
    pros: ["Durabilidade extrema", "Cores vivas", "Custo baixo em escala", "Toque quase imperceptível"],
    cons: ["Custo inicial por cor", "Limitação de cores por peça"],
    artChecklist: ["Arquivo vetorial (AI, EPS, CDR)", "Cores separadas", "Máximo 6 cores recomendado"],
  },
  {
    id: "sublimacao",
    name: "Sublimação",
    fullName: "Sublimação",
    description: "Impressão que penetra no tecido através de calor. Perfeita para tecidos claros de poliéster.",
    idealFor: "Camisas esportivas, uniformes Dry Fit, full print",
    pros: ["Não descasca", "Full print possível", "Cores ilimitadas", "Toque zero"],
    cons: ["Apenas tecidos claros de poliéster", "Não funciona em algodão"],
    artChecklist: ["Arquivo em alta resolução", "Cores em CMYK", "Sangra de 2cm para full print"],
  },
  {
    id: "bordado",
    name: "Bordado",
    fullName: "Bordado Computadorizado",
    description: "Técnica premium com linhas bordadas no tecido. Elegância e durabilidade máxima.",
    idealFor: "Logos corporativos, uniformes premium, polos",
    pros: ["Extrema durabilidade", "Visual premium", "Tridimensionalidade", "Resistente a lavagens"],
    cons: ["Custo maior", "Limitação de detalhes finos", "Não indicado para fotos"],
    artChecklist: ["Logo vetorizado", "Definição de cores de linha", "Tamanho mínimo 3cm"],
  },
  {
    id: "transfer",
    name: "Transfer",
    fullName: "Transfer Digital",
    description: "Impressão transferida por calor. Versátil e econômica para pequenas quantidades.",
    idealFor: "Baixas quantidades, protótipos, fotos",
    pros: ["Qualquer quantidade", "Fotos e degradês", "Rápida produção"],
    cons: ["Menor durabilidade que silk", "Toque perceptível"],
    artChecklist: ["Imagem em alta resolução", "Formato PNG com fundo transparente"],
  },
] as const;

// Depoimentos
export const TESTIMONIALS = [
  {
    id: 1,
    name: "Ricardo Mendes",
    company: "Tech Solutions",
    city: "São Paulo, SP",
    text: "Uniformes impecáveis para toda a equipe. Atendimento consultivo fez toda diferença na escolha do material.",
  },
  {
    id: 2,
    name: "Carla Oliveira",
    company: "Escola Nova Era",
    city: "Campinas, SP",
    text: "Fornecedor oficial da nossa escola há 5 anos. Qualidade constante e entregas sempre no prazo.",
  },
  {
    id: 3,
    name: "Fernando Santos",
    company: "CrossFit Arena",
    city: "Ribeirão Preto, SP",
    text: "As camisetas Dry Fit aguentam treinos intensos. Nossos alunos amam a qualidade.",
  },
  {
    id: 4,
    name: "Amanda Costa",
    company: "Evento Conexões",
    city: "Belo Horizonte, MG",
    text: "Entrega para 500 camisetas em tempo recorde. Salvaram nosso evento corporativo!",
  },
  {
    id: 5,
    name: "Lucas Pereira",
    company: "Distribuidora LP",
    city: "Curitiba, PR",
    text: "Brindes personalizados que realmente impressionam nossos clientes. Parceria de sucesso.",
  },
];

// Logos de clientes (placeholder)
export const CLIENT_LOGOS = [
  { name: "Cliente 1", logo: "/placeholder.svg" },
  { name: "Cliente 2", logo: "/placeholder.svg" },
  { name: "Cliente 3", logo: "/placeholder.svg" },
  { name: "Cliente 4", logo: "/placeholder.svg" },
  { name: "Cliente 5", logo: "/placeholder.svg" },
  { name: "Cliente 6", logo: "/placeholder.svg" },
];

// FAQs
export const FAQS = [
  {
    question: "Qual a quantidade mínima de pedido (MOQ)?",
    answer: "Para a maioria dos produtos, trabalhamos a partir de 10 unidades. Para alguns itens específicos como bordados, o mínimo pode variar. Entre em contato para sua demanda específica.",
  },
  {
    question: "Qual o prazo de produção e entrega?",
    answer: "O prazo médio de produção é de 7 a 15 dias úteis, dependendo da quantidade e técnica escolhida. Entregas expressas podem ser negociadas. Enviamos para todo o Brasil.",
  },
  {
    question: "Preciso ter a arte pronta?",
    answer: "Não necessariamente! Podemos trabalhar com sua arte pronta ou nossa equipe de design pode criar ou adaptar seu logo/arte. Basta nos enviar suas referências.",
  },
  {
    question: "Quais formas de pagamento vocês aceitam?",
    answer: "Trabalhamos com PIX, boleto bancário, transferência e cartão de crédito (para alguns casos). Condições especiais para pedidos recorrentes.",
  },
  {
    question: "Como escolher a melhor técnica de personalização?",
    answer: "Depende do seu objetivo, quantidade e tipo de arte. Nossa equipe faz uma consultoria gratuita para indicar a melhor opção para seu projeto.",
  },
  {
    question: "Posso fazer uma amostra antes do pedido completo?",
    answer: "Sim! Oferecemos produção de amostras para aprovação antes da produção em escala. Consulte valores e prazos.",
  },
];

// Filtros do catálogo
export const CATALOG_FILTERS = {
  intention: [
    { id: "empresa", label: "Empresa" },
    { id: "evento", label: "Evento" },
    { id: "brinde", label: "Brinde" },
    { id: "esporte", label: "Esporte" },
    { id: "uniforme", label: "Uniforme Profissional" },
  ],
  type: [
    { id: "vestuario", label: "Vestuário" },
    { id: "acessorios", label: "Acessórios" },
    { id: "brindes", label: "Brindes" },
  ],
};

// Mapeamento de categorias para filtros
export const CATEGORY_FILTERS: Record<string, { intentions: string[]; type: string }> = {
  "t-shirt": { intentions: ["empresa", "evento", "brinde"], type: "vestuario" },
  "camisa-polo": { intentions: ["empresa"], type: "vestuario" },
  "camisa-social": { intentions: ["empresa"], type: "vestuario" },
  "moletom-careca": { intentions: ["empresa", "brinde"], type: "vestuario" },
  "moletom-ziper": { intentions: ["empresa", "brinde"], type: "vestuario" },
  "moletom-canguru": { intentions: ["evento", "brinde"], type: "vestuario" },
  "calcas-bermudas": { intentions: ["uniforme", "esporte"], type: "vestuario" },
  "fitness-dry-fit": { intentions: ["esporte", "evento"], type: "vestuario" },
  "jaleco-avental": { intentions: ["uniforme", "empresa"], type: "vestuario" },
  "ecobag": { intentions: ["brinde", "evento"], type: "acessorios" },
  "sacochila": { intentions: ["brinde", "evento"], type: "acessorios" },
  "bones": { intentions: ["brinde", "evento"], type: "acessorios" },
  "almofadas": { intentions: ["brinde", "evento"], type: "acessorios" },
  "copos-garrafas": { intentions: ["brinde"], type: "brindes" },
  "brindes": { intentions: ["brinde", "evento"], type: "brindes" },
  "uniformes-profissionais": { intentions: ["uniforme", "empresa"], type: "vestuario" },
};

// Função para gerar link do WhatsApp
export function generateWhatsAppLink(
  category: string,
  pageName: string,
  position: string = "cta"
): string {
  const message = `Olá! Vim pelo site da BARRETOS e quero orçamento.

Produto/Categoria: ${category}
Quantidade: ______
Tenho arte: ( ) sim  ( ) não
Cidade/UF: ______
Prazo desejado: ______
Observações: ______

Origem: ${pageName} - ${position}`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

// Função para tracking de eventos
export function trackWhatsAppClick(
  category: string,
  pageName: string,
  position: string
): void {
  // Disparar evento de analytics
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "whatsapp_click", {
      category,
      page_name: pageName,
      position,
    });
  }
  
  // Console log para debug
  console.log("WhatsApp Click:", { category, pageName, position });
}
