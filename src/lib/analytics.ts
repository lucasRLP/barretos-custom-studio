/**
 * Analytics helper para Google Tag Manager (dataLayer).
 * Todos os eventos são enviados pro GTM container e de lá distribuídos
 * pra GA4, Google Ads (conversões), etc.
 *
 * Convenção de eventos: GA4-recomendados quando possível
 * (https://support.google.com/analytics/answer/9267735).
 */

// Categorias de produto rastreáveis no personalizador (= product.id no PersonalizeApp)
export type ProductCategory =
  | "tshirt"
  | "polo"
  | "bone"
  | "ecobag"
  | "moletom";

// Valor estimado de lead (R$) por peça — usado pra Google Ads bidding
const PRODUCT_VALUES: Record<ProductCategory, number> = {
  tshirt: 35,
  polo: 70,
  bone: 40,
  ecobag: 30,
  moletom: 110,
};

// Nome legível por categoria
const PRODUCT_NAMES: Record<ProductCategory, string> = {
  tshirt: "Camiseta",
  polo: "Polo",
  bone: "Boné",
  ecobag: "Ecobag",
  moletom: "Moletom",
};

/** Verifica se um string é uma ProductCategory válida */
export function isProductCategory(id: string): id is ProductCategory {
  return id in PRODUCT_VALUES;
}

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

function push(event: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
  if (import.meta.env?.DEV) {
    // eslint-disable-next-line no-console
    console.log("[analytics]", event);
  }
}

// ============================================================
// Eventos de funil (informativos)
// ============================================================

/** Usuário clicou em um CTA pra abrir o personalizador */
export function trackSelectPersonalizer(source: string): void {
  push({
    event: "select_personalizer",
    source, // ex: "home_hero", "header_button", "produto_camiseta"
  });
}

/** Usuário escolheu um produto dentro do personalizador */
export function trackViewItem(category: ProductCategory): void {
  push({
    event: "view_item",
    ecommerce: {
      currency: "BRL",
      value: PRODUCT_VALUES[category],
      items: [
        {
          item_id: category,
          item_name: PRODUCT_NAMES[category],
          item_category: category,
          price: PRODUCT_VALUES[category],
          quantity: 1,
        },
      ],
    },
    product_category: category,
    product_name: PRODUCT_NAMES[category],
  });
}

/** Usuário entrou na tela de customização (canvas) */
export function trackBeginCustomize(category: ProductCategory): void {
  push({
    event: "begin_customize",
    product_category: category,
    product_name: PRODUCT_NAMES[category],
  });
}

/** Usuário entrou na tela de checkout (preencher dados) */
export function trackBeginCheckout(
  category: ProductCategory,
  quantity: number,
): void {
  const value = PRODUCT_VALUES[category] * quantity;
  push({
    event: "begin_checkout",
    ecommerce: {
      currency: "BRL",
      value,
      items: [
        {
          item_id: category,
          item_name: PRODUCT_NAMES[category],
          item_category: category,
          price: PRODUCT_VALUES[category],
          quantity,
        },
      ],
    },
    product_category: category,
    product_name: PRODUCT_NAMES[category],
    quantity,
  });
}

// ============================================================
// CONVERSÃO PRINCIPAL ⭐
// ============================================================

/** Pedido enviado com sucesso pelo personalizador (lead qualificado) */
export function trackGenerateLead(params: {
  category: ProductCategory;
  quantity: number;
  /** dados pra Enhanced Conversions (são hashed pelo GTM antes de enviar pra Ads) */
  email?: string;
  phone?: string;
  name?: string;
}): void {
  const { category, quantity, email, phone, name } = params;
  const value = PRODUCT_VALUES[category] * quantity;

  push({
    event: "generate_lead",
    ecommerce: {
      currency: "BRL",
      value,
      items: [
        {
          item_id: category,
          item_name: PRODUCT_NAMES[category],
          item_category: category,
          price: PRODUCT_VALUES[category],
          quantity,
        },
      ],
    },
    product_category: category,
    product_name: PRODUCT_NAMES[category],
    quantity,
    // Enhanced Conversions: dados PII, GTM faz o hash antes de enviar pro Ads
    user_data: {
      email_address: email,
      phone_number: phone,
      address: name ? { first_name: name.split(" ")[0] } : undefined,
    },
  });
}

/** Falha ao enviar pedido (rastreio pra debug, não é conversão) */
export function trackLeadError(
  category: ProductCategory,
  errorMessage: string,
): void {
  push({
    event: "generate_lead_error",
    product_category: category,
    error_message: errorMessage,
  });
}

// ============================================================
// Micro-conversões
// ============================================================

/** Clique em qualquer botão de WhatsApp */
export function trackWhatsAppClick(params: {
  /** categoria/contexto: "Geral", "T-Shirt", "Polo", "Personalize - Sucesso", etc */
  category: string;
  /** nome da página/seção: "Home Hero", "Floating Button", "Header", etc */
  pageName: string;
  /** posição do botão na página: "float", "header", "cta", "footer", etc */
  position: string;
}): void {
  push({
    event: "whatsapp_click",
    whatsapp_category: params.category,
    page_name: params.pageName,
    position: params.position,
  });
}

/** Clique em botão de telefone (tel: link) */
export function trackPhoneClick(pageName: string, position: string): void {
  push({
    event: "phone_click",
    page_name: pageName,
    position,
  });
}
