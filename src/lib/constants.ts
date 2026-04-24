// Configuração do WhatsApp
export const WHATSAPP_NUMBER = "5521993652442";

// Informações de contato
export const COMPANY_INFO = {
  name: "Barreto's Cia da Confecção",
  shortName: "Barreto's",
  phone: "(21) 99365-2442",
  email: "barretosuniformes@gmail.com",
  address: "Rua Senador Nabuco 40, Vila Isabel, Rio de Janeiro - RJ",
  hours: "Seg - Sex: 9h às 16h30",
  productionLeadTime: "5 dias úteis",
  foundedYearsAgo: "30+",
};

// Faixa informativa (strip banner) — aparece no topo do site
export const INFO_STRIPS = [
  "Prazo de produção: 5 dias úteis",
  "Sem pedido mínimo",
  "Envio para todo o Brasil",
  "Seg-Sex 9h às 16h30",
];

// Cores padrão disponíveis em estoque (customizador)
export const STOCK_COLORS = [
  { id: "preto",        name: "Preto",        hex: "#2A2A2E" },
  { id: "branco",       name: "Branco",       hex: "#FFFFFF" },
  { id: "off-white",    name: "Off-white",    hex: "#F5EFE0" },
  { id: "azul-marinho", name: "Azul Marinho", hex: "#0A1E3F" },
  { id: "azul-royal",   name: "Azul Royal",   hex: "#1E4BA8" },
  { id: "vermelho",     name: "Vermelho",     hex: "#C8102E" },
] as const;

export const CUSTOM_COLOR_MIN_QTY = 10;

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

// Técnicas de personalização — agora com foto ilustrativa
export const TECHNIQUES = [
  {
    id: "dtf",
    name: "DTF",
    fullName: "Direct to Film",
    image: "/techniques/dtf.png",
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
    image: "/techniques/silk-screen.png",
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
    image: "/techniques/sublimacao.png",
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
    image: "/techniques/bordado.png",
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
    image: "/techniques/transfer.png",
    description: "Impressão transferida por calor. Versátil e econômica para pequenas quantidades.",
    idealFor: "Baixas quantidades, protótipos, fotos",
    pros: ["Qualquer quantidade", "Fotos e degradês", "Rápida produção"],
    cons: ["Menor durabilidade que silk", "Toque perceptível"],
    artChecklist: ["Imagem em alta resolução", "Formato PNG com fundo transparente"],
  },
] as const;

// Depoimentos reais (textos literais extraídos de prints de WhatsApp)
export const TESTIMONIALS = [
  {
    id: "marcel-levels",
    name: "Marcel",
    company: "Levels",
    city: "Rio de Janeiro, RJ",
    text: "Fala amigo! Chegaram as camisas aqui, fiz a contagem e tá tudo certinho! O pessoal aqui se amarrou nas blusas, esse tecido de suedine é muito bom!! A estampa também ficou num tamanho bom e linda na camisa, a estampa fica muito boa nessa técnica que você me indicou, só vamos fazer nessa a partir de agora.",
    highlight: "Só vamos fazer nessa técnica a partir de agora.",
    proof: "/testimonials/marcel-levels.jpg",
    productTag: "Camisetas em suedine",
  },
  {
    id: "barbara-froneri",
    name: "Bárbara",
    company: "Froneri",
    city: "Rio de Janeiro, RJ",
    text: "Camisa do Faustino ficou ótima! Agradece o fornecedor!",
    highlight: "Camisa do Faustino ficou ótima!",
    proof: "/testimonials/barbara-froneri.jpg",
    productTag: "Uniforme Froneri",
  },
];

// Cases reais — fotos de clientes usando Barreto's
export const CASES = [
  {
    id: "higino-jerj",
    title: "Colégio Higino",
    subtitle: "JERJ 2025 — Basquete Juvenil",
    image: "/cases/higino-jerj.jpg",
    tag: "Uniforme esportivo",
  },
  {
    id: "rio-international-school",
    title: "Rio International School",
    subtitle: "Sports Day",
    image: "/cases/rio-international-school.jpg",
    tag: "Evento escolar",
  },
  {
    id: "lp-glass",
    title: "LP Glass",
    subtitle: "Uniforme operacional",
    image: "/cases/lp-glass.jpg",
    tag: "Uniforme corporativo",
  },
  {
    id: "yoga-voya",
    title: "Voya",
    subtitle: "Retiro de yoga",
    image: "/cases/voya-yoga.jpg",
    tag: "Evento",
  },
  {
    id: "portal-natural",
    title: "Portal Natural",
    subtitle: "Retiro de yoga",
    image: "/cases/portal-natural.jpg",
    tag: "Evento",
  },
];

// Logos de clientes confirmados
export const CLIENT_LOGOS = [
  { name: "NESTLÉ",                   logo: "/clients/nestle.png" },
  { name: "Rio International School", logo: "/clients/rio-international-school.png" },
  { name: "RJDI",                     logo: "/clients/rjdi.png" },
];

// Menções de marca — para badge "Trusted by" / mencionadas na reunião
export const NOTABLE_CLIENTS = ["NESTLÉ", "Rio International School", "RJDI"];

// FAQs — revisado com dados reais da reunião (prazo 5 dias, sem pedido mínimo, PIX/transferência/cartão, amostra física mín. 50 peças, horário, cores em estoque)
export const FAQS = [
  {
    question: "Qual é o pedido mínimo?",
    answer:
      "Não temos pedido mínimo! Produzimos a partir de 1 peça. Apenas cores fora do nosso estoque padrão exigem mínimo de 10 peças, pois precisam ser fabricadas sob encomenda.",
  },
  {
    question: "Qual o prazo de produção?",
    answer:
      "5 dias úteis após aprovação da arte. Envio para todo o Brasil por transportadora ou Correios (prazo de frete à parte). Em casos urgentes, consulte a produção expressa.",
  },
  {
    question: "Quais formas de pagamento vocês aceitam?",
    answer:
      "PIX, transferência bancária e cartão de crédito. Condições especiais para pedidos recorrentes.",
  },
  {
    question: "Preciso ter a arte pronta?",
    answer:
      "Não é obrigatório — mas arte pronta agiliza a produção e reduz o custo. Caso não tenha, nossa equipe de design cria ou adapta seu logo/arte a partir de referências.",
  },
  {
    question: "Posso pedir uma amostra antes?",
    answer:
      "Sim. Amostra virtual (mockup digital) é enviada gratuitamente em todo pedido, para aprovação antes da produção. Amostra física requer pedido mínimo de 50 peças.",
  },
  {
    question: "Quais cores estão em pronta entrega?",
    answer:
      "Preto, branco, off-white, azul marinho, azul royal e vermelho — produção imediata. Outras cores sob encomenda, com mínimo de 10 peças.",
  },
  {
    question: "Qual o horário de atendimento?",
    answer:
      "Segunda a sexta, das 9h às 16h30. Fora desse horário, deixe mensagem no WhatsApp — respondemos no próximo dia útil.",
  },
  {
    question: "Como escolher a melhor técnica de personalização?",
    answer:
      "Depende do objetivo, quantidade e tipo de arte. Nossa equipe faz uma consultoria gratuita para indicar a melhor técnica (DTF, Silk Screen, Sublimação, Bordado ou Transfer) para cada projeto.",
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
  const message = `Olá! Vim pelo site da BARRETO'S e quero orçamento.

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
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "whatsapp_click", {
      category,
      page_name: pageName,
      position,
    });
  }

  // eslint-disable-next-line no-console
  console.log("WhatsApp Click:", { category, pageName, position });
}
