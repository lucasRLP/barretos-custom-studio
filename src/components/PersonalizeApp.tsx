
import { useEffect, useMemo, useRef, useState } from "react";
import { Group, Image as KonvaImage, Layer, Rect, Stage, Text, Transformer } from "react-konva";
import { Button } from "@/components/ui/button";
import { WHATSAPP_NUMBER, trackWhatsAppClick, STOCK_COLORS, CUSTOM_COLOR_MIN_QTY } from "@/lib/constants";
import { getProductImage } from "@/lib/productImages";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  MessageCircle,
  Palette,
  Shirt,
  UserRound,
} from "lucide-react";

const CANVAS_W = 900;
const CANVAS_H = 900;

type Side = "front" | "back";
type StepId = "product" | "details" | "customize" | "contact";

type TextDesignItem = {
  id: string;
  type: "text";
  text: string;
  x: number;
  y: number;
  width: number;
  fontSize: number;
  fill: string;
  align: "left" | "center" | "right";
  rotation: number;
  fontFamily: string;
};

type ImageDesignItem = {
  id: string;
  type: "image";
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

type DesignItem = TextDesignItem | ImageDesignItem;

type CanvasNode = {
  getClientRect: (config?: unknown) => { x: number; y: number; width: number; height: number };
  x: (value?: number) => number;
  y: (value?: number) => number;
  scaleX: (value?: number) => number;
  scaleY: (value?: number) => number;
  width: (value?: number) => number;
  height: (value?: number) => number;
  rotation: (value?: number) => number;
};

type StageRefShape = {
  findOne: (selector: string) => unknown;
  toDataURL?: (config?: { pixelRatio?: number }) => string;
};

type TransformerRefShape = {
  nodes: (nodes: unknown[]) => void;
  getLayer: () => { batchDraw: () => void } | null;
};

type ProductOption = {
  id: string;
  name: string;
  subtitle: string;
  unitPrice: number;
  sizes: string[];
  sides: Side[];
  catalogImageId: string;
};

type PrintProfilesBySide = Record<
  Side,
  Record<string, { label: string; rect: { x: number; y: number; w: number; h: number } }>
>;

type UploadedArtwork = {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  dataUrl: string;
  objectUrl: string;
  side: Side;
  addedAt: string;
};

type ArtworkForBackend = Omit<UploadedArtwork, "objectUrl">;

type OrderApiPayload = {
  orderCode: string;
  submittedAt: string;
  source: string;
  product: {
    id: string;
    name: string;
    unitPrice: number;
    colorHex: string;
  };
  quantities: Record<string, number>;
  totals: {
    totalQty: number;
    totalPrice: number;
  };
  shipping: {
    freight: "to_be_calculated";
    note: string;
  };
  customization: {
    sideProfiles: Record<Side, string>;
    sidePrintAreas: Record<Side, { label: string; rect: { x: number; y: number; w: number; h: number } }>;
    sideItemsCount: Record<Side, number>;
    sideItems: Record<Side, DesignItem[]>;
    stage: { width: number; height: number };
    mockups: Partial<Record<Side, string>>;
    previews: Partial<Record<Side, string>>;
  };
  assets: {
    artworks: ArtworkForBackend[];
  };
  requestedOutputs: {
    package: "zip";
    documents: string[];
  };
  customer: {
    name: string;
    whatsapp: string;
    email: string;
    city: string;
    notes: string;
  };
};

type OrderApiResponse = {
  id?: string;
  orderId?: string;
  reference?: string;
  message?: string;
  drive?: {
    uploaded?: boolean;
    link?: string;
  };
};

type OrderApiResult = {
  ok: boolean;
  skipped?: boolean;
  orderId?: string;
  error?: string;
  message?: string;
};

const DEFAULT_SIDES: Side[] = ["front", "back"];
const IS_LOCALHOST =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);
const ORDER_API_URL = String(
  import.meta.env.VITE_ORDER_API_URL ?? (IS_LOCALHOST ? "/api/orders" : ""),
).trim();
const ORDER_API_HEALTH_URL = ORDER_API_URL ? ORDER_API_URL.replace(/\/orders\/?$/, "/health") : "";

// Preços de referência (a partir de, por peça, 1 unidade) — confirme no orçamento final
const PRODUCTS: ProductOption[] = [
  {
    id: "tshirt",
    name: "Camiseta",
    subtitle: "Malha premium e caimento leve.",
    unitPrice: 59.9,
    sizes: ["P", "M", "G", "GG"],
    sides: ["front", "back"],
    catalogImageId: "t-shirt",
  },
  {
    id: "polo",
    name: "Camisa polo",
    subtitle: "Visual elegante para equipes.",
    unitPrice: 79.9,
    sizes: ["P", "M", "G", "GG"],
    sides: ["front", "back"],
    catalogImageId: "camisa-polo",
  },
  {
    id: "bone",
    name: "Boné",
    subtitle: "Alta visibilidade para marca.",
    unitPrice: 39.9,
    sizes: ["UN"],
    sides: ["front", "back"],
    catalogImageId: "bones",
  },
  {
    id: "ecobag",
    name: "Ecobag",
    subtitle: "Sustentável e com boa área de estampa.",
    unitPrice: 34.9,
    sizes: ["UN"],
    sides: ["front", "back"],
    catalogImageId: "ecobag",
  },
  {
    id: "moletom",
    name: "Moletom",
    subtitle: "Conforto para uniformes e campanhas.",
    unitPrice: 109.9,
    sizes: ["P", "M", "G", "GG"],
    sides: ["front", "back"],
    catalogImageId: "moletom-canguru",
  },
];

const STEP_ORDER: { id: StepId; label: string; icon: React.ElementType }[] = [
  { id: "product", label: "Produto", icon: Shirt },
  { id: "details", label: "Detalhes do pedido", icon: ClipboardList },
  { id: "customize", label: "Personalizar", icon: Palette },
  { id: "contact", label: "Seus dados", icon: UserRound },
];

const MOCKUP_URLS: Record<Side, string> = {
  front: "/assets/tshirt-front.png",
  back: "/assets/tshirt-back.png",
};

const MASK_URLS: Record<Side, string> = {
  front: "/assets/tshirt-front-mask-soft.png",
  back: "/assets/tshirt-back-mask.png",
};

const SIDE_LABEL: Record<Side, string> = {
  front: "Frente",
  back: "Costas",
};

const FONT_OPTIONS: string[] = [
  "Plus Jakarta Sans",
  "Arial",
  "Roboto",
  "Poppins",
  "Montserrat",
  "Open Sans",
  "Lato",
  "Nunito",
  "Merriweather",
  "Playfair Display",
  "Oswald",
  "Bebas Neue",
  "Anton",
  "Verdana",
  "Tahoma",
  "Trebuchet MS",
  "Georgia",
  "Times New Roman",
  "Courier New",
  "Impact",
  "Comic Sans MS",
];

const DEFAULT_PRINT_PROFILES: PrintProfilesBySide = {
  front: {
    center: { label: "Centro", rect: { x: 310, y: 260, w: 280, h: 360 } },
    chest: { label: "Peito esquerdo", rect: { x: 480, y: 220, w: 125, h: 125 } },
    full: { label: "Frente grande", rect: { x: 270, y: 230, w: 360, h: 430 } },
  },
  back: {
    center: { label: "Centro", rect: { x: 310, y: 250, w: 280, h: 380 } },
    upper: { label: "Costas superior", rect: { x: 290, y: 230, w: 320, h: 260 } },
    full: { label: "Costas grande", rect: { x: 270, y: 220, w: 360, h: 440 } },
  },
};

const POLO_PRINT_PROFILES: PrintProfilesBySide = {
  front: {
    center: { label: "Centro", rect: { x: 320, y: 285, w: 260, h: 330 } },
    chest: { label: "Peito esquerdo", rect: { x: 470, y: 250, w: 120, h: 115 } },
    full: { label: "Frente grande", rect: { x: 285, y: 255, w: 330, h: 390 } },
  },
  back: {
    center: { label: "Centro", rect: { x: 320, y: 275, w: 260, h: 340 } },
    upper: { label: "Costas superior", rect: { x: 290, y: 250, w: 320, h: 230 } },
    full: { label: "Costas grande", rect: { x: 275, y: 240, w: 350, h: 410 } },
  },
};

const MOLETOM_PRINT_PROFILES: PrintProfilesBySide = {
  front: {
    center: { label: "Centro", rect: { x: 315, y: 300, w: 270, h: 330 } },
    upperLeft: { label: "Superior esquerdo", rect: { x: 455, y: 255, w: 125, h: 125 } },
  },
  back: DEFAULT_PRINT_PROFILES.back,
};

const BONE_PRINT_PROFILES: PrintProfilesBySide = {
  front: {
    main: { label: "Frente", rect: { x: 295, y: 254, w: 311, h: 206 } },
  },
  back: {
    main: { label: "Costas", rect: { x: 288, y: 209, w: 324, h: 231 } },
  },
};

const ECOBAG_PRINT_PROFILES: PrintProfilesBySide = {
  front: {
    main: { label: "Frente", rect: { x: 282, y: 342, w: 360, h: 400 } },
  },
  back: {
    main: { label: "Costas", rect: { x: 282, y: 342, w: 360, h: 400 } },
  },
};

const PRODUCT_PRINT_PROFILES: Record<string, PrintProfilesBySide> = {
  tshirt: DEFAULT_PRINT_PROFILES,
  polo: POLO_PRINT_PROFILES,
  moletom: MOLETOM_PRINT_PROFILES,
  bone: BONE_PRINT_PROFILES,
  ecobag: ECOBAG_PRINT_PROFILES,
};

type ProductMockupConfig = {
  front: string;
  back?: string;
  masks?: Partial<Record<Side, string>>;
  editorScale?: number;
};

const PRODUCT_MOCKUPS: Record<string, ProductMockupConfig> = {
  tshirt: {
    front: MOCKUP_URLS.front,
    back: MOCKUP_URLS.back,
    masks: {
      front: MASK_URLS.front,
      back: MASK_URLS.back,
    },
  },
  polo: {
    front: "/assets/polo-front.png",
    back: "/assets/polo-back.png",
    masks: {
      front: "/assets/polo-front-mask.png",
      back: "/assets/polo-back-mask.png",
    },
    editorScale: 0.88,
  },
  moletom: {
    front: "/assets/moletom-front.png",
    back: "/assets/moletom-back.png",
    masks: {
      front: "/assets/moletom-front-mask.png",
      back: "/assets/moletom-back-mask.png",
    },
  },
  bone: {
    front: "/assets/bone-front.png",
    back: "/assets/bone-back.png",
    masks: {
      front: "/assets/bone-front-mask.png",
      back: "/assets/bone-back-mask.png",
    },
  },
  ecobag: {
    front: "/assets/ecobag-front.png",
    back: "/assets/ecobag-back.png",
    masks: {
      front: "/assets/ecobag-front-mask.png",
      back: "/assets/ecobag-back-mask.png",
    },
  },
};

function money(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function generateOrderCode(): string {
  const now = new Date();
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate(),
  ).padStart(2, "0")}`;
  const randomCode = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BCS-${ymd}-${randomCode}`;
}

function waitForNextPaint(): Promise<void> {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => resolve());
    });
  });
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Falha ao ler arquivo para envio ao backend."));
    reader.readAsDataURL(file);
  });
}

function createQtyMap(sizes: string[]): Record<string, number> {
  return sizes.reduce((acc, size) => {
    acc[size] = 0;
    return acc;
  }, {} as Record<string, number>);
}

function useHtmlImage(src?: string | null) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!src) {
      setImg(null);
      return;
    }

    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.src = src;
    image.onload = () => setImg(image);
    image.onerror = () => setImg(null);
  }, [src]);

  return img;
}

function useAlphaMaskImage(src?: string | null) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!src) {
      setImg(null);
      return;
    }

    const base = new window.Image();
    base.crossOrigin = "anonymous";
    base.src = src;

    base.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = base.width;
      canvas.height = base.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(base, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const cornerLum = data[0] * 0.299 + data[1] * 0.587 + data[2] * 0.114;
      const shouldInvert = cornerLum > 200;

      for (let index = 0; index < data.length; index += 4) {
        const lum = data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114;
        let alpha = shouldInvert ? 255 - lum : lum;

        if (alpha < 6) alpha = 0;
        if (alpha > 250) alpha = 255;

        data[index] = 255;
        data[index + 1] = 255;
        data[index + 2] = 255;
        data[index + 3] = alpha;
      }

      ctx.putImageData(imageData, 0, 0);

      const out = new window.Image();
      out.crossOrigin = "anonymous";
      out.src = canvas.toDataURL("image/png");
      out.onload = () => setImg(out);
    };

    base.onerror = () => setImg(null);
  }, [src]);

  return img;
}

function useAlphaFromBaseImage(baseImg: HTMLImageElement | null) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!baseImg) return;

    const canvas = document.createElement("canvas");
    canvas.width = baseImg.width;
    canvas.height = baseImg.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(baseImg, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let index = 0; index < data.length; index += 4) {
      const alpha = data[index + 3];
      data[index] = 255;
      data[index + 1] = 255;
      data[index + 2] = 255;
      data[index + 3] = alpha;
    }

    ctx.putImageData(imageData, 0, 0);

    const out = new window.Image();
    out.crossOrigin = "anonymous";
    out.src = canvas.toDataURL("image/png");
    out.onload = () => setImg(out);
  }, [baseImg]);

  return img;
}

function useMaskedBaseImage(baseImg: HTMLImageElement | null, alphaMaskImg: HTMLImageElement | null) {
  const [out, setOut] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!baseImg || !alphaMaskImg) return;

    const canvas = document.createElement("canvas");
    canvas.width = baseImg.width;
    canvas.height = baseImg.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(alphaMaskImg, 0, 0, canvas.width, canvas.height);

    const outImg = new window.Image();
    outImg.crossOrigin = "anonymous";
    outImg.src = canvas.toDataURL("image/png");
    outImg.onload = () => setOut(outImg);
  }, [baseImg, alphaMaskImg]);

  return out;
}

function useTintedMaskImage(
  baseImg: HTMLImageElement | null,
  alphaMaskImg: HTMLImageElement | null,
  colorHex: string,
) {
  const [out, setOut] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!baseImg || !alphaMaskImg || !colorHex) return;

    const canvas = document.createElement("canvas");
    canvas.width = baseImg.width;
    canvas.height = baseImg.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = colorHex;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(alphaMaskImg, 0, 0, canvas.width, canvas.height);

    const outImg = new window.Image();
    outImg.crossOrigin = "anonymous";
    outImg.src = canvas.toDataURL("image/png");
    outImg.onload = () => setOut(outImg);
  }, [baseImg, alphaMaskImg, colorHex]);

  return out;
}

function CanvasImageItem({
  item,
  onSelect,
  onUpdate,
  onClamp,
}: {
  item: ImageDesignItem;
  onSelect: (id: string) => void;
  onUpdate: (id: string, patch: Partial<ImageDesignItem>) => void;
  onClamp: (node: CanvasNode) => void;
}) {
  const image = useHtmlImage(item.src);
  if (!image) return null;

  return (
    <KonvaImage
      id={item.id}
      image={image}
      x={item.x}
      y={item.y}
      width={item.width}
      height={item.height}
      rotation={item.rotation}
      draggable
      onClick={() => onSelect(item.id)}
      onTap={() => onSelect(item.id)}
      onDragMove={(event) => onClamp(event.target as CanvasNode)}
      onDragEnd={(event) => onUpdate(item.id, { x: event.target.x(), y: event.target.y() })}
      onTransformEnd={(event) => {
        const node = event.target as CanvasNode;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        const width = Math.max(10, node.width() * scaleX);
        const height = Math.max(10, node.height() * scaleY);

        node.scaleX(1);
        node.scaleY(1);
        node.width(width);
        node.height(height);

        onUpdate(item.id, {
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          width,
          height,
        });

        onClamp(node);
      }}
    />
  );
}

export function PersonalizeApp() {
  const [step, setStep] = useState<StepId>("product");
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [side, setSide] = useState<Side>("front");
  const [productColor, setProductColor] = useState("#ffffff");
  const [printProfile, setPrintProfile] = useState<Record<Side, string>>({
    front: "center",
    back: "center",
  });
  const [qtyBySize, setQtyBySize] = useState<Record<string, number>>({});
  const [designs, setDesigns] = useState<Record<Side, { items: DesignItem[] }>>({
    front: { items: [] },
    back: { items: [] },
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [customer, setCustomer] = useState({
    name: "",
    whatsapp: "",
    email: "",
    city: "",
    notes: "",
  });

  const [editorError, setEditorError] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [backendMessage, setBackendMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendViaWhatsApp, setSendViaWhatsApp] = useState(true);
  const [uploadedArtworks, setUploadedArtworks] = useState<Record<string, UploadedArtwork>>({});
  const [stagePreviews, setStagePreviews] = useState<Partial<Record<Side, string>>>({});

  const stageRef = useRef<unknown>(null);
  const trRef = useRef<unknown>(null);

  const selectedProduct = useMemo(
    () => PRODUCTS.find((product) => product.id === selectedProductId) ?? null,
    [selectedProductId],
  );

  const sides = useMemo<Side[]>(() => selectedProduct?.sides ?? DEFAULT_SIDES, [selectedProduct]);
  const unitPrice = selectedProduct?.unitPrice ?? 0;
  const hasOrderApi = Boolean(ORDER_API_URL);
  const activeProductId = selectedProduct?.id ?? "tshirt";

  const totalQty = useMemo(
    () => Object.values(qtyBySize).reduce((sum, value) => sum + Number(value || 0), 0),
    [qtyBySize],
  );

  const totalPrice = totalQty * unitPrice;

  const mockupConfig = PRODUCT_MOCKUPS[activeProductId] ?? PRODUCT_MOCKUPS.tshirt;
  const frontMockupSrc = mockupConfig.front;
  const backMockupSrc = mockupConfig.back ?? mockupConfig.front;
  const frontMaskSrc = mockupConfig.masks?.front;
  const backMaskSrc = mockupConfig.masks?.back;

  const frontBase = useHtmlImage(frontMockupSrc);
  const backBase = useHtmlImage(backMockupSrc);
  const manualFrontMask = useAlphaMaskImage(frontMaskSrc);
  const manualBackMask = useAlphaMaskImage(backMaskSrc);
  const autoFrontMask = useAlphaFromBaseImage(frontBase);
  const autoBackMask = useAlphaFromBaseImage(backBase);

  const frontMask = manualFrontMask ?? autoFrontMask;
  const backMask = manualBackMask ?? autoBackMask;

  const frontMasked = useMaskedBaseImage(frontBase, frontMask);
  const backMasked = useMaskedBaseImage(backBase, backMask);
  const frontTint = useTintedMaskImage(frontBase, frontMask, productColor);
  const backTint = useTintedMaskImage(backBase, backMask, productColor);

  const shirtMasked = side === "front" ? frontMasked : backMasked;
  const tintMasked = side === "front" ? frontTint : backTint;

  const sideItems = designs[side].items;
  const selectedItem = sideItems.find((item) => item.id === selectedId);
  const selectedText = selectedItem?.type === "text" ? selectedItem : null;

  const productPrintProfiles = PRODUCT_PRINT_PROFILES[activeProductId] ?? DEFAULT_PRINT_PROFILES;
  const defaultPrintKey = Object.keys(productPrintProfiles[side])[0] ?? "center";
  const selectedPrintKey = printProfile[side];
  const printKey =
    selectedPrintKey && selectedPrintKey in productPrintProfiles[side]
      ? selectedPrintKey
      : defaultPrintKey;
  const printArea = productPrintProfiles[side][printKey].rect;
  const printOptions = productPrintProfiles[side];

  const resolvePrintProfileBySide = (targetSide: Side) => {
    const sideProfiles = productPrintProfiles[targetSide];
    const fallbackKey = Object.keys(sideProfiles)[0] ?? "center";
    const chosenKey = printProfile[targetSide];
    const profileKey =
      chosenKey && chosenKey in sideProfiles
        ? chosenKey
        : fallbackKey;
    const profile = sideProfiles[profileKey];

    return {
      profileKey,
      label: profile.label,
      rect: profile.rect,
    };
  };

  const currentStepIndex = STEP_ORDER.findIndex((stepItem) => stepItem.id === step);

  const canProceedFromStep = (stepId: StepId) => {
    if (stepId === "product") return Boolean(selectedProduct);
    if (stepId === "details") return totalQty > 0;
    if (stepId === "customize") return true;
    if (stepId === "contact") return Boolean(customer.name.trim() && customer.whatsapp.trim());
    return false;
  };

  const canOpenStep = (stepId: StepId) => {
    const targetIndex = STEP_ORDER.findIndex((stepItem) => stepItem.id === stepId);

    if (targetIndex <= currentStepIndex) return true;

    for (let index = 0; index < targetIndex; index += 1) {
      if (!canProceedFromStep(STEP_ORDER[index].id)) return false;
    }

    return true;
  };

  const captureCustomizePreviews = async (): Promise<Partial<Record<Side, string>>> => {
    const stage = stageRef.current as StageRefShape | null;
    if (!stage || !stage.toDataURL) return {};

    const previews: Partial<Record<Side, string>> = {};
    const originalSide = side;
    const sidesToCapture = selectedProduct?.sides ?? DEFAULT_SIDES;

    setSelectedId(null);

    for (const sideName of sidesToCapture) {
      setSide(sideName);
      await waitForNextPaint();

      const activeStage = stageRef.current as StageRefShape | null;
      if (activeStage?.toDataURL) {
        previews[sideName] = activeStage.toDataURL({ pixelRatio: 2 });
      }
    }

    setSide(originalSide);
    await waitForNextPaint();

    return previews;
  };

  const goNext = async () => {
    if (!canProceedFromStep(step)) return;

    if (step === "customize") {
      const previews = await captureCustomizePreviews();
      if (Object.keys(previews).length > 0) {
        setStagePreviews(previews);
      }
    }

    const next = STEP_ORDER[currentStepIndex + 1];
    if (next) setStep(next.id);
  };

  const goBack = () => {
    const prev = STEP_ORDER[currentStepIndex - 1];
    if (prev) setStep(prev.id);
  };

  useEffect(() => {
    if (!selectedProduct) return;

    setUploadedArtworks((previous) => {
      Object.values(previous).forEach((artwork) => {
        if (artwork.objectUrl) URL.revokeObjectURL(artwork.objectUrl);
      });
      return {};
    });
    setStagePreviews({});
    setQtyBySize(createQtyMap(selectedProduct.sizes));
    setSide(selectedProduct.sides[0] ?? "front");
    setPrintProfile({ front: "center", back: "center" });
    setDesigns({ front: { items: [] }, back: { items: [] } });
    setSelectedId(null);
    setProductColor("#ffffff");
    setEditorError("");
    setFormError("");
    setSuccessMessage("");
    setBackendMessage("");
    setSendViaWhatsApp(true);
    setStep((current) => (current === "product" ? current : "details"));
  }, [selectedProduct]);

  useEffect(() => {
    if (!sides.includes(side)) {
      setSide(sides[0] ?? "front");
    }
  }, [sides, side]);

  useEffect(() => {
    const stage = stageRef.current as StageRefShape | null;
    const transformer = trRef.current as TransformerRefShape | null;
    if (!stage || !transformer) return;

    const node = selectedId ? stage.findOne(`#${selectedId}`) : null;
    transformer.nodes(node ? [node] : []);
    transformer.getLayer()?.batchDraw();
  }, [selectedId, side, sideItems.length]);

  const updateItem = (id: string, patch: Partial<DesignItem>) => {
    setDesigns((previous) => ({
      ...previous,
      [side]: {
        items: previous[side].items.map((item) =>
          item.id === id ? ({ ...item, ...patch } as DesignItem) : item,
        ),
      },
    }));
  };

  const addText = () => {
    const id = `txt_${Date.now()}`;
    const newItem: TextDesignItem = {
      id,
      type: "text",
      text: "Sua marca",
      x: printArea.x + 20,
      y: printArea.y + 30,
      width: Math.min(280, printArea.w - 20),
      fontSize: 36,
      fill: "#111111",
      align: "left",
      rotation: 0,
      fontFamily: FONT_OPTIONS[0],
    };

    setDesigns((previous) => ({
      ...previous,
      [side]: {
        items: [...previous[side].items, newItem],
      },
    }));

    setSelectedId(id);
  };

  const removeSelected = () => {
    if (!selectedId) return;

    setDesigns((previous) => ({
      ...previous,
      [side]: {
        items: previous[side].items.filter((item) => item.id !== selectedId),
      },
    }));

    setUploadedArtworks((previous) => {
      const artwork = previous[selectedId];
      if (artwork?.objectUrl) {
        URL.revokeObjectURL(artwork.objectUrl);
      }

      const next = { ...previous };
      delete next[selectedId];
      return next;
    });

    setSelectedId(null);
  };

  const onUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uploadSide = side;
    const src = URL.createObjectURL(file);
    const dataUrl = await readFileAsDataUrl(file).catch(() => "");
    const id = `img_${Date.now()}`;

    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.src = src;

    image.onload = () => {
      const maxWidth = printArea.w * 0.85;
      const maxHeight = printArea.h * 0.55;
      const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);

      const newItem: ImageDesignItem = {
        id,
        type: "image",
        src,
        x: printArea.x + (printArea.w - image.width * scale) / 2,
        y: printArea.y + 30,
        width: image.width * scale,
        height: image.height * scale,
        rotation: 0,
      };

      setDesigns((previous) => ({
        ...previous,
        [uploadSide]: {
          items: [...previous[uploadSide].items, newItem],
        },
      }));

      setUploadedArtworks((previous) => ({
        ...previous,
        [id]: {
          id,
          name: file.name,
          mimeType: file.type || "application/octet-stream",
          size: file.size,
          dataUrl,
          objectUrl: src,
          side: uploadSide,
          addedAt: new Date().toISOString(),
        },
      }));

      setSelectedId(id);
      setEditorError("");
    };

    image.onerror = () => {
      URL.revokeObjectURL(src);
      setEditorError("Falha ao carregar a imagem enviada.");
    };
    event.target.value = "";
  };

  const clampDrag = (node: CanvasNode) => {
    const box = node.getClientRect({ skipStroke: true, skipShadow: true });
    const dx = node.x() - box.x;
    const dy = node.y() - box.y;

    const minX = printArea.x + dx;
    const minY = printArea.y + dy;
    const maxX = printArea.x + printArea.w - box.width + dx;
    const maxY = printArea.y + printArea.h - box.height + dy;

    node.x(clamp(node.x(), minX, maxX));
    node.y(clamp(node.y(), minY, maxY));
    const transformer = trRef.current as TransformerRefShape | null;
    transformer?.getLayer()?.batchDraw();
  };

  const changeQty = (size: string, delta: number) => {
    setQtyBySize((previous) => ({
      ...previous,
      [size]: Math.max(0, (previous[size] ?? 0) + delta),
    }));
  };

  const filledSizes = selectedProduct
    ? selectedProduct.sizes
        .map((size) => ({ size, value: qtyBySize[size] ?? 0 }))
        .filter((item) => item.value > 0)
    : [];

  const buildOrderPayload = (orderCode: string): OrderApiPayload | null => {
    if (!selectedProduct) return null;

    const frontProfile = resolvePrintProfileBySide("front");
    const backProfile = resolvePrintProfileBySide("back");
    const artworks = Object.values(uploadedArtworks).map(({ objectUrl: _discardedObjectUrl, ...asset }) => asset);

    return {
      orderCode,
      submittedAt: new Date().toISOString(),
      source: "personalizador-online",
      product: {
        id: selectedProduct.id,
        name: selectedProduct.name,
        unitPrice,
        colorHex: productColor,
      },
      quantities: qtyBySize,
      totals: {
        totalQty,
        totalPrice,
      },
      shipping: {
        freight: "to_be_calculated",
        note: "Frete calculado separadamente apos validacao do pedido.",
      },
      customization: {
        sideProfiles: {
          front: frontProfile.profileKey,
          back: backProfile.profileKey,
        },
        sidePrintAreas: {
          front: { label: frontProfile.label, rect: frontProfile.rect },
          back: { label: backProfile.label, rect: backProfile.rect },
        },
        sideItemsCount: {
          front: designs.front.items.length,
          back: designs.back.items.length,
        },
        sideItems: {
          front: designs.front.items,
          back: designs.back.items,
        },
        stage: { width: CANVAS_W, height: CANVAS_H },
        mockups: {
          front: frontMockupSrc,
          back: backMockupSrc,
        },
        previews: stagePreviews,
      },
      assets: {
        artworks,
      },
      requestedOutputs: {
        package: "zip",
        documents: [
          "pdf_front_page",
          "pdf_back_page",
          "pdf_print_positions",
          "order_spec_json",
          "artwork_originals",
        ],
      },
      customer: {
        name: customer.name,
        whatsapp: customer.whatsapp,
        email: customer.email,
        city: customer.city,
        notes: customer.notes,
      },
    };
  };

  const downloadOrderBackup = (payload: OrderApiPayload, orderCode: string) => {
    try {
      const fileName = `${orderCode || "pedido"}-backup.json`;
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } catch {
      return false;
    }
  };

  const submitOrderToApi = async (payload: OrderApiPayload): Promise<OrderApiResult> => {
    if (!hasOrderApi) return { ok: false, skipped: true };

    try {
      if (ORDER_API_HEALTH_URL) {
        const health = await fetch(ORDER_API_HEALTH_URL, { method: "GET" });
        if (!health.ok) {
          return {
            ok: false,
            error: `Backend indisponivel (${health.status}). Rode \`npm run dev:api\` para salvar localmente.`,
          };
        }
      }

      const response = await fetch(ORDER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const rawText = await response.text();
      let body: OrderApiResponse = {};

      if (rawText) {
        try {
          body = JSON.parse(rawText) as OrderApiResponse;
        } catch {
          body = {};
        }
      }

      if (!response.ok) {
        return {
          ok: false,
          error: body.message || `Falha no backend (${response.status}).`,
        };
      }

      return {
        ok: true,
        orderId: body.orderId || body.id || body.reference,
        message: body.message || (body.drive?.uploaded ? "Pedido salvo e enviado ao Google Drive." : "Pedido salvo no backend."),
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao enviar pedido para o backend.";
      const isNetworkFailure = /Failed to fetch|NetworkError|ERR_CONNECTION_REFUSED/i.test(message);
      return {
        ok: false,
        error: isNetworkFailure
          ? "Falha de conexao com o backend. Inicie a API com `npm run dev:api` (ou `npm run dev:full`)."
          : message,
      };
    }
  };

  const buildWhatsAppMessage = (orderCode: string) => {
    if (!selectedProduct) return "";

    const qtyLines =
      filledSizes.map((item) => `${item.size}: ${item.value}`).join("\n") ||
      "Nenhuma quantidade escolhida";

    return (
      `Ola! Vim pelo Personalizador Online da BARRETOS e quero fechar meu pedido.\n\n` +
      `Codigo do pedido: ${orderCode}\n` +
      `Produto: ${selectedProduct.name}\n` +
      `Quantidade por tamanho:\n${qtyLines}\n` +
      `Valor unitario: ${money(unitPrice)}\n` +
      `Total estimado (produtos): ${money(totalPrice)} + frete\n` +
      `Frete: calculado separadamente\n\n` +
      `Personalizacao:\n` +
      `- Cor base: ${productColor}\n` +
      `- Frente: ${designs.front.items.length} elemento(s)\n` +
      `- Costas: ${designs.back.items.length} elemento(s)\n\n` +
      `Dados do cliente:\n` +
      `Nome: ${customer.name}\n` +
      `WhatsApp: ${customer.whatsapp}\n` +
      `Email: ${customer.email || "Nao informado"}\n` +
      `Cidade: ${customer.city || "Nao informado"}\n` +
      `${customer.notes ? `Observacoes: ${customer.notes}\n` : ""}\n` +
      `Origem: Personalizador Online`
    );
  };

  const handleSubmitOrder = async () => {
    if (!selectedProduct) {
      setFormError("Escolha um produto para continuar.");
      return;
    }

    if (!customer.name.trim() || !customer.whatsapp.trim()) {
      setFormError("Preencha nome e WhatsApp para enviar o pedido.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");
    setSuccessMessage("");
    setBackendMessage("");

    // Pré-abre janela do WhatsApp AGORA (dentro do clique) para escapar do popup blocker.
    // A URL real é setada depois que tivermos o código do pedido.
    const shouldOpenWhatsAppNow = !hasOrderApi || sendViaWhatsApp;
    const whatsappWindow = shouldOpenWhatsAppNow ? window.open("about:blank", "_blank") : null;

    const localOrderCode = generateOrderCode();
    let apiResult: OrderApiResult = { ok: false, skipped: true };
    const payload = buildOrderPayload(localOrderCode);
    let backupDownloaded = false;

    if (payload && hasOrderApi) {
      apiResult = await submitOrderToApi(payload);
      const finalOrderCode = apiResult.orderId || payload.orderCode;

      if (apiResult.ok) {
        setBackendMessage(
          `${apiResult.message || "Pedido salvo no backend."} Codigo: ${finalOrderCode}.`,
        );
      } else {
        setFormError(apiResult.error || "Nao foi possivel salvar no backend.");
        backupDownloaded = downloadOrderBackup(payload, finalOrderCode);
        if (backupDownloaded) {
          setBackendMessage(
            `Backend indisponivel. Backup local baixado (${finalOrderCode}-backup.json).`,
          );
        }
      }
    }

    const shouldOpenWhatsApp = !hasOrderApi || sendViaWhatsApp;
    const finalOrderCode = apiResult.orderId || payload?.orderCode || localOrderCode;

    if (shouldOpenWhatsApp) {
      const message = buildWhatsAppMessage(finalOrderCode);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      trackWhatsAppClick(selectedProduct.name, "Personalize", "order-submit");

      if (whatsappWindow && !whatsappWindow.closed) {
        // Usa a janela pré-aberta (não é bloqueada por popup blocker)
        whatsappWindow.location.href = whatsappUrl;
      } else {
        // Fallback: tenta abrir agora mesmo
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      }

      if (apiResult.ok) {
        setSuccessMessage("Pedido salvo e enviado no WhatsApp com sucesso.");
      } else if (hasOrderApi) {
        setSuccessMessage(
          backupDownloaded
            ? "Pedido enviado no WhatsApp. O backend falhou, mas um backup .json foi baixado."
            : "Pedido enviado no WhatsApp. O backend nao confirmou o salvamento.",
        );
      } else {
        setSuccessMessage("Pedido enviado para o WhatsApp com sucesso.");
      }
    } else if (apiResult.ok) {
      setSuccessMessage(`Pedido salvo com sucesso. Código: ${finalOrderCode}.`);
    }

    // Fecha janela pré-aberta que não foi usada
    if (whatsappWindow && !shouldOpenWhatsApp && !whatsappWindow.closed) {
      whatsappWindow.close();
    }

    setIsSubmitting(false);
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-xl)" }}>
      <div className="bg-muted/40 p-4 border-b border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {STEP_ORDER.map((stepItem, index) => {
            const isCurrent = stepItem.id === step;
            const isDone = index < currentStepIndex;
            const canClick = canOpenStep(stepItem.id);

            return (
              <button
                key={stepItem.id}
                type="button"
                className={`rounded-xl px-3 py-2 text-left border transition-colors ${
                  isCurrent
                    ? "border-secondary bg-secondary/10"
                    : isDone
                      ? "border-secondary/40 bg-secondary/5"
                      : "border-border bg-background"
                } ${canClick ? "cursor-pointer" : "cursor-not-allowed opacity-70"}`}
                onClick={() => canClick && setStep(stepItem.id)}
                disabled={!canClick}
              >
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <stepItem.icon className="h-4 w-4" />
                  <span className="truncate">{stepItem.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {step === "product" && (
          <section className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-foreground">Escolha o produto</h3>
              <p className="text-sm text-muted-foreground">
                Selecione o item principal para montar o pedido no fluxo novo.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {PRODUCTS.map((product) => {
                const selected = selectedProductId === product.id;
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => setSelectedProductId(product.id)}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      selected
                        ? "border-secondary bg-secondary/10 ring-2 ring-secondary/20"
                        : "border-border hover:border-secondary/40"
                    }`}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-2">
                      <img
                        src={getProductImage(product.catalogImageId)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.subtitle}</p>
                      <p className="text-sm font-bold text-secondary">{money(product.unitPrice)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {step === "details" && selectedProduct && (
          <section className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-foreground">Detalhes do pedido</h3>
              <p className="text-sm text-muted-foreground">
                Quantidades por tamanho com padrao em zero e total calculado automaticamente.
              </p>
            </div>

            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-4">
              <div className="rounded-xl border border-border bg-background/80 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground">{selectedProduct.name}</p>
                  <p className="text-sm text-muted-foreground">Unitario: {money(unitPrice)}</p>
                </div>

                <div className="space-y-2">
                  {selectedProduct.sizes.map((size) => (
                    <div
                      key={size}
                      className="flex items-center justify-between rounded-lg border border-border p-2.5"
                    >
                      <span className="font-semibold text-sm">{size}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="h-8 w-8 rounded-md border border-border bg-muted text-sm font-semibold"
                          onClick={() => changeQty(size, -1)}
                          disabled={(qtyBySize[size] ?? 0) === 0}
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{qtyBySize[size] ?? 0}</span>
                        <button
                          type="button"
                          className="h-8 w-8 rounded-md border border-border bg-muted text-sm font-semibold"
                          onClick={() => changeQty(size, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="rounded-xl border border-border bg-muted/40 p-4 space-y-2">
                <h4 className="font-semibold text-foreground">Resumo rapido</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Produto</span>
                  <span className="font-semibold">{selectedProduct.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quantidade total</span>
                  <span className="font-semibold">{totalQty}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Preco unitario</span>
                  <span className="font-semibold">{money(unitPrice)}</span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-secondary font-bold">{money(totalPrice)}</span>
                </div>
              </aside>
            </div>
          </section>
        )}

        {step === "customize" && selectedProduct && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-xl font-bold text-foreground">Personalizar</h3>
                <p className="text-sm text-muted-foreground">
                  Agora ajuste cor, logo, texto e posicao da estampa antes de ir para seus dados.
                </p>
              </div>
              <Button
                variant="cta"
                onClick={goNext}
                disabled={isSubmitting || !canProceedFromStep(step)}
                className="gap-2 flex-shrink-0 w-full sm:w-auto"
              >
                Próximo
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid xl:grid-cols-[330px_1fr] gap-4">
              <aside className="rounded-xl border border-border bg-background/80 p-4 space-y-3">
                {sides.length > 1 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {sides.map((sideName) => (
                      <Button
                        key={sideName}
                        type="button"
                        variant={side === sideName ? "secondary" : "outline"}
                        onClick={() => {
                          setSelectedId(null);
                          setSide(sideName);
                        }}
                      >
                        {SIDE_LABEL[sideName]}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
                    Produto com estampa em lado unico (frente).
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Local da estampa</label>
                  <select
                    value={printKey}
                    onChange={(event) =>
                      setPrintProfile((previous) => ({ ...previous, [side]: event.target.value }))
                    }
                    className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm"
                  >
                    {Object.entries(printOptions).map(([key, option]) => (
                      <option key={key} value={key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">Cor do produto</label>
                  <div className="grid grid-cols-6 gap-2">
                    {STOCK_COLORS.map((c) => {
                      const active = productColor.toLowerCase() === c.hex.toLowerCase();
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setProductColor(c.hex)}
                          title={c.name}
                          aria-label={c.name}
                          className={`h-9 w-full rounded-md border-2 transition-all ${
                            active ? "border-secondary ring-2 ring-secondary/30 scale-105" : "border-border hover:border-muted-foreground"
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 flex items-center gap-2 h-9 rounded-md border border-dashed border-border px-2 text-xs cursor-pointer hover:bg-muted/40">
                      <span
                        className="h-5 w-5 rounded border border-border flex-shrink-0"
                        style={{ backgroundColor: productColor }}
                      />
                      <span className="truncate">
                        {STOCK_COLORS.some((c) => c.hex.toLowerCase() === productColor.toLowerCase())
                          ? "Outra cor (personalizada)"
                          : `Cor personalizada • ${productColor.toUpperCase()}`}
                      </span>
                      <input
                        type="color"
                        value={productColor}
                        onChange={(event) => setProductColor(event.target.value)}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  {!STOCK_COLORS.some((c) => c.hex.toLowerCase() === productColor.toLowerCase()) && (
                    <p className="text-[11px] leading-snug rounded-md bg-brand-yellow/15 border border-brand-yellow/40 text-foreground px-2 py-1.5">
                      Cores fora da paleta de pronta-entrega exigem pedido mínimo de {CUSTOM_COLOR_MIN_QTY} peças (tingimento sob medida).
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Upload de logo/arte</label>
                  <input
                    type="file"
                    accept="image/*,.svg"
                    onChange={onUpload}
                    className="w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-secondary-foreground"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button type="button" variant="outline" onClick={addText}>
                    Adicionar texto
                  </Button>
                  <Button type="button" variant="outline" onClick={removeSelected} disabled={!selectedId}>
                    Remover item
                  </Button>
                </div>

                {selectedText && (
                  <div className="rounded-lg border border-border p-3 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">Texto selecionado</p>

                    <input
                      value={selectedText.text}
                      onChange={(event) => updateItem(selectedText.id, { text: event.target.value })}
                      className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm"
                    />

                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Fonte</label>
                      <select
                        value={selectedText.fontFamily}
                        onChange={(event) =>
                          updateItem(selectedText.id, {
                            fontFamily: event.target.value,
                          })
                        }
                        className="w-full h-9 rounded-md border border-border bg-background px-2 text-sm"
                      >
                        {FONT_OPTIONS.map((fontName) => (
                          <option key={fontName} value={fontName}>
                            {fontName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="color"
                        value={selectedText.fill}
                        onChange={(event) => updateItem(selectedText.id, { fill: event.target.value })}
                        className="w-full h-9 rounded-md border border-border bg-background p-1"
                      />
                      <select
                        value={selectedText.align}
                        onChange={(event) =>
                          updateItem(selectedText.id, {
                            align: event.target.value as "left" | "center" | "right",
                          })
                        }
                        className="w-full h-9 rounded-md border border-border bg-background px-2 text-sm"
                      >
                        <option value="left">Esquerda</option>
                        <option value="center">Centro</option>
                        <option value="right">Direita</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Tamanho: {selectedText.fontSize}px</p>
                      <input
                        type="range"
                        min={12}
                        max={120}
                        value={selectedText.fontSize}
                        onChange={(event) =>
                          updateItem(selectedText.id, { fontSize: Number(event.target.value) })
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                )}

                {editorError && <p className="text-xs font-medium text-destructive">{editorError}</p>}
                <p className="text-xs text-muted-foreground">
                  Mockup ajustado por produto. Alguns itens usam o mesmo visual na frente e costas.
                </p>
              </aside>

              <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full border border-border px-3 py-1 bg-background">{selectedProduct.name}</span>
                  <span className="rounded-full border border-border px-3 py-1 bg-background">Vista: {SIDE_LABEL[side]}</span>
                  <span className="rounded-full border border-border px-3 py-1 bg-background">
                    Area: {printArea.w} x {printArea.h}
                  </span>
                </div>

                <div className="rounded-xl border border-border bg-background overflow-auto">
                  <Stage
                    width={CANVAS_W}
                    height={CANVAS_H}
                    ref={stageRef}
                    onMouseDown={(event) => {
                      const clickedOnEmpty = event.target === event.target.getStage();
                      if (clickedOnEmpty) setSelectedId(null);
                    }}
                  >
                    <Layer>
                      <Rect x={0} y={0} width={CANVAS_W} height={CANVAS_H} fill="#E2E8F0" />

                      {shirtMasked && tintMasked && (() => {
                        const targetWidth = CANVAS_W * 0.78;
                        const baseScale = targetWidth / shirtMasked.width;
                        const scale = baseScale * (mockupConfig.editorScale ?? 1);

                        const width = shirtMasked.width * scale;
                        const height = shirtMasked.height * scale;
                        const x = (CANVAS_W - width) / 2;
                        const y = (CANVAS_H - height) / 2 - 10;

                        return (
                          <>
                            <KonvaImage
                              image={shirtMasked}
                              x={x}
                              y={y}
                              width={width}
                              height={height}
                              listening={false}
                            />
                            <KonvaImage
                              image={tintMasked}
                              x={x}
                              y={y}
                              width={width}
                              height={height}
                              opacity={0.95}
                              globalCompositeOperation="multiply"
                              listening={false}
                            />
                          </>
                        );
                      })()}

                      <Rect
                        x={printArea.x}
                        y={printArea.y}
                        width={printArea.w}
                        height={printArea.h}
                        stroke="rgba(15,23,42,0.55)"
                        dash={[8, 6]}
                        fill="rgba(255,255,255,0.08)"
                      />
                    </Layer>

                    <Layer>
                      <Group
                        clipX={printArea.x}
                        clipY={printArea.y}
                        clipWidth={printArea.w}
                        clipHeight={printArea.h}
                      >
                        {sideItems.map((item) => {
                          if (item.type === "text") {
                            return (
                              <Text
                                key={item.id}
                                id={item.id}
                                text={item.text}
                                x={item.x}
                                y={item.y}
                                width={item.width}
                                fontSize={item.fontSize}
                                fill={item.fill}
                                align={item.align}
                                fontFamily={item.fontFamily}
                                rotation={item.rotation}
                                draggable
                                onClick={() => setSelectedId(item.id)}
                                onTap={() => setSelectedId(item.id)}
                                onDragMove={(event) => clampDrag(event.target)}
                                onDragEnd={(event) =>
                                  updateItem(item.id, { x: event.target.x(), y: event.target.y() })
                                }
                                onTransformEnd={(event) => {
                                  const node = event.target as CanvasNode;
                                  const scaleX = node.scaleX();
                                  const scaleY = node.scaleY();
                                  const width = Math.max(70, node.width() * scaleX);
                                  const fontSize = Math.max(12, item.fontSize * scaleY);

                                  node.scaleX(1);
                                  node.scaleY(1);

                                  updateItem(item.id, {
                                    x: node.x(),
                                    y: node.y(),
                                    rotation: node.rotation(),
                                    width,
                                    fontSize,
                                  });

                                  clampDrag(node);
                                }}
                              />
                            );
                          }

                          return (
                            <CanvasImageItem
                              key={item.id}
                              item={item}
                              onSelect={setSelectedId}
                              onUpdate={updateItem}
                              onClamp={clampDrag}
                            />
                          );
                        })}
                      </Group>

                      <Transformer
                        ref={trRef}
                        rotateEnabled
                        keepRatio={false}
                        anchorSize={10}
                        enabledAnchors={[
                          "top-left",
                          "top-right",
                          "bottom-left",
                          "bottom-right",
                          "middle-left",
                          "middle-right",
                          "top-center",
                          "bottom-center",
                        ]}
                        boundBoxFunc={(oldBox, newBox) => {
                          if (newBox.width < 20 || newBox.height < 20) return oldBox;
                          return newBox;
                        }}
                      />
                    </Layer>
                  </Stage>
                </div>

                <p className="text-xs text-muted-foreground">
                  Clique no item para mover, redimensionar e rotacionar.
                </p>
              </div>
            </div>
          </section>
        )}

        {step === "contact" && selectedProduct && (
          <section className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-foreground">Seus dados</h3>
              <p className="text-sm text-muted-foreground">
                Última etapa: preencha seus dados para finalizarmos o pedido e entrarmos em contato.
              </p>
            </div>

            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-4">
              <div className="rounded-xl border border-border bg-background/80 p-4">
                <div className="grid md:grid-cols-2 gap-3">
                  <label className="text-sm text-muted-foreground">
                    Nome completo
                    <input
                      value={customer.name}
                      onChange={(event) =>
                        setCustomer((previous) => ({ ...previous, name: event.target.value }))
                      }
                      placeholder="Digite seu nome"
                      className="mt-1 w-full h-10 rounded-lg border border-border bg-background px-3 text-sm"
                    />
                  </label>

                  <label className="text-sm text-muted-foreground">
                    WhatsApp
                    <input
                      value={customer.whatsapp}
                      onChange={(event) =>
                        setCustomer((previous) => ({ ...previous, whatsapp: event.target.value }))
                      }
                      placeholder="(00) 00000-0000"
                      className="mt-1 w-full h-10 rounded-lg border border-border bg-background px-3 text-sm"
                    />
                  </label>

                  <label className="text-sm text-muted-foreground">
                    Email
                    <input
                      value={customer.email}
                      onChange={(event) =>
                        setCustomer((previous) => ({ ...previous, email: event.target.value }))
                      }
                      placeholder="voce@empresa.com"
                      className="mt-1 w-full h-10 rounded-lg border border-border bg-background px-3 text-sm"
                    />
                  </label>

                  <label className="text-sm text-muted-foreground">
                    Cidade
                    <input
                      value={customer.city}
                      onChange={(event) =>
                        setCustomer((previous) => ({ ...previous, city: event.target.value }))
                      }
                      placeholder="Cidade e UF"
                      className="mt-1 w-full h-10 rounded-lg border border-border bg-background px-3 text-sm"
                    />
                  </label>

                  <label className="text-sm text-muted-foreground md:col-span-2">
                    Observacoes
                    <textarea
                      rows={4}
                      value={customer.notes}
                      onChange={(event) =>
                        setCustomer((previous) => ({ ...previous, notes: event.target.value }))
                      }
                      placeholder="Prazo, referencia de arte, detalhes extras"
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    />
                  </label>
                </div>

                {backendMessage && <p className="mt-3 text-sm font-semibold text-secondary">{backendMessage}</p>}
                {formError && <p className="mt-3 text-sm font-semibold text-destructive">{formError}</p>}
                {successMessage && <p className="mt-3 text-sm font-semibold text-green-700">{successMessage}</p>}
              </div>

              <aside className="rounded-xl border border-border bg-muted/40 p-4 space-y-2">
                <h4 className="font-semibold text-foreground">Resumo final</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Produto</span>
                  <span className="font-semibold">{selectedProduct.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quantidade total</span>
                  <span className="font-semibold">{totalQty}</span>
                </div>

                <div className="pt-1 border-t border-border">
                  {filledSizes.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Nenhum tamanho selecionado.</p>
                  ) : (
                    <div className="space-y-1">
                      {filledSizes.map((item) => (
                        <div key={item.size} className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{item.size}</span>
                          <span className="font-semibold">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Preço a partir de</span>
                  <span className="font-semibold">{money(unitPrice)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-border pt-2">
                  <span>Estimativa + frete</span>
                  <span className="text-secondary">{money(totalPrice)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Valores de referência. Orçamento final confirmado pela equipe conforme técnica, arte e quantidade. Frete cotado à parte.
                </p>
              </aside>
            </div>
          </section>
        )}
      </div>

      <div className="px-6 md:px-8 pb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        {currentStepIndex > 0 ? (
          <Button variant="outline" onClick={goBack} className="gap-2 w-full sm:w-auto">
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Button>
        ) : (
          <div />
        )}

        {step !== "contact" ? (
          <Button
            variant="cta"
            onClick={goNext}
            disabled={isSubmitting || !canProceedFromStep(step)}
            className="gap-2 w-full sm:w-auto"
          >
            Proximo
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant={!hasOrderApi || sendViaWhatsApp ? "whatsapp" : "cta"}
            onClick={handleSubmitOrder}
            disabled={isSubmitting || !canProceedFromStep("contact")}
            className="gap-2 w-full sm:w-auto"
          >
            <MessageCircle className="h-4 w-4" />
            {isSubmitting
              ? "Enviando..."
              : !hasOrderApi
                ? "Enviar pedido no WhatsApp"
                : sendViaWhatsApp
                  ? "Salvar e enviar no WhatsApp"
                  : "Salvar pedido no backend"}
          </Button>
        )}
      </div>
    </div>
  );
}



