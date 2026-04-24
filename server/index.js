import archiver from "archiver";
import express from "express";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { uploadOrderToDrive, isDriveEnabled } from "./drive.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const ORDERS_DIR = path.join(ROOT_DIR, "backend", "orders");
const PORT = Number(process.env.PORT || process.env.ORDER_API_PORT || 8787);

const app = express();

// CORS — libera as origens do site (produção e localhost).
// Configure ALLOWED_ORIGINS no .env como lista separada por vírgula, ex:
// ALLOWED_ORIGINS=https://barretosconfeccao.com.br,https://www.barretosconfeccao.com.br
const DEFAULT_ALLOWED_ORIGINS = [
  "https://barretosconfeccao.com.br",
  "https://www.barretosconfeccao.com.br",
  "http://localhost:5173",
  "http://localhost:8080",
];
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const allowedOrigins = ALLOWED_ORIGINS.length ? ALLOWED_ORIGINS : DEFAULT_ALLOWED_ORIGINS;

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json({ limit: "80mb" }));

const round = (value) => Math.round(Number(value || 0) * 100) / 100;

const toSlug = (value) =>
  String(value || "")
    .trim()
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toUpperCase();

const safeFilePart = (value, fallbackName) => {
  const parsed = path.parse(String(value || ""));
  const base = toSlug(parsed.name || fallbackName).toLowerCase();
  const ext = parsed.ext.replace(/[^a-zA-Z0-9.]/g, "");
  return `${base || fallbackName}${ext || ""}`;
};

const parseDataUrl = (dataUrl) => {
  if (typeof dataUrl !== "string") return null;
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return {
    mimeType: match[1],
    buffer: Buffer.from(match[2], "base64"),
  };
};

const extFromMime = (mimeType) => {
  if (mimeType === "image/png") return ".png";
  if (mimeType === "image/jpeg" || mimeType === "image/jpg") return ".jpg";
  if (mimeType === "image/webp") return ".webp";
  if (mimeType === "image/svg+xml") return ".svg";
  if (mimeType === "application/pdf") return ".pdf";
  return ".bin";
};

const ensureDir = async (dirPath) => {
  await fsp.mkdir(dirPath, { recursive: true });
};

const fitInside = (maxWidth, maxHeight, width, height) => {
  if (!width || !height) return { width: maxWidth, height: maxHeight };
  const ratio = Math.min(maxWidth / width, maxHeight / height);
  return {
    width: width * ratio,
    height: height * ratio,
  };
};

const writeDataUrlFile = async ({ dataUrl, outputBasePath }) => {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return null;

  const filePath = `${outputBasePath}${extFromMime(parsed.mimeType)}`;
  await fsp.writeFile(filePath, parsed.buffer);
  return {
    path: filePath,
    mimeType: parsed.mimeType,
    size: parsed.buffer.byteLength,
  };
};

const drawPreviewPage = async ({ pdf, title, imageDataUrl }) => {
  const page = pdf.addPage([595.28, 841.89]);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  page.drawText(title, {
    x: 40,
    y: 808,
    size: 18,
    font: fontBold,
    color: rgb(0.05, 0.14, 0.26),
  });

  page.drawRectangle({
    x: 36,
    y: 32,
    width: 523,
    height: 741,
    borderColor: rgb(0.8, 0.84, 0.89),
    borderWidth: 1,
  });

  if (!imageDataUrl) {
    page.drawText("Preview não enviado.", {
      x: 48,
      y: 780,
      size: 11,
      font,
      color: rgb(0.45, 0.45, 0.45),
    });
    return;
  }

  const parsed = parseDataUrl(imageDataUrl);
  if (!parsed) {
    page.drawText("Preview inválido.", {
      x: 48,
      y: 780,
      size: 11,
      font,
      color: rgb(0.7, 0.1, 0.1),
    });
    return;
  }

  let embedded;
  try {
    if (parsed.mimeType === "image/jpeg" || parsed.mimeType === "image/jpg") {
      embedded = await pdf.embedJpg(parsed.buffer);
    } else {
      embedded = await pdf.embedPng(parsed.buffer);
    }
  } catch {
    page.drawText(`Formato de preview não suportado (${parsed.mimeType}).`, {
      x: 48,
      y: 780,
      size: 11,
      font,
      color: rgb(0.7, 0.1, 0.1),
    });
    return;
  }

  const fitted = fitInside(500, 710, embedded.width, embedded.height);
  const x = (595.28 - fitted.width) / 2;
  const y = 40 + (710 - fitted.height) / 2;

  page.drawImage(embedded, {
    x,
    y,
    width: fitted.width,
    height: fitted.height,
  });
};

const drawTechnicalPage = async ({ pdf, payload }) => {
  const page = pdf.addPage([595.28, 841.89]);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  let y = 808;
  page.drawText("Ficha técnica do pedido", {
    x: 40,
    y,
    size: 18,
    font: fontBold,
    color: rgb(0.05, 0.14, 0.26),
  });
  y -= 28;

  const pushLine = (text) => {
    if (y < 40) return;
    page.drawText(text, {
      x: 40,
      y,
      size: 10,
      font,
      color: rgb(0.13, 0.13, 0.13),
    });
    y -= 13;
  };

  const product = payload.product || {};
  const totals = payload.totals || {};
  const customer = payload.customer || {};
  const customization = payload.customization || {};
  const sidePrintAreas = customization.sidePrintAreas || {};
  const sideItems = customization.sideItems || {};

  pushLine(`Código do pedido: ${payload.orderCode || "-"}`);
  pushLine(`Data de envio: ${payload.submittedAt || "-"}`);
  pushLine("");
  pushLine(`Produto: ${product.name || "-"} (${product.id || "-"})`);
  pushLine(`Cor base: ${product.colorHex || "-"}`);
  pushLine(`Valor unitário: ${product.unitPrice ?? "-"}`);
  pushLine(`Quantidade total: ${totals.totalQty ?? "-"}`);
  pushLine(`Total estimado (produtos): ${totals.totalPrice ?? "-"} + frete`);
  pushLine("");
  pushLine(`Cliente: ${customer.name || "-"}`);
  pushLine(`WhatsApp: ${customer.whatsapp || "-"}`);
  pushLine(`Email: ${customer.email || "-"}`);
  pushLine(`Cidade: ${customer.city || "-"}`);
  pushLine(`Observações: ${customer.notes || "-"}`);
  pushLine("");
  pushLine("Quantidades por tamanho:");
  Object.entries(payload.quantities || {}).forEach(([size, qty]) => {
    pushLine(`  - ${size}: ${qty}`);
  });
  pushLine("");
  pushLine("Áreas de impressão (x, y, w, h):");
  Object.entries(sidePrintAreas).forEach(([side, info]) => {
    const rect = info?.rect || {};
    pushLine(
      `  - ${side}: ${info?.label || "-"} | x=${round(rect.x)} y=${round(rect.y)} w=${round(rect.w)} h=${round(
        rect.h,
      )}`,
    );
  });
  pushLine("");
  pushLine("Elementos na arte:");
  Object.entries(sideItems).forEach(([side, items]) => {
    pushLine(`  ${side.toUpperCase()}:`);
    if (!Array.isArray(items) || items.length === 0) {
      pushLine("    - sem elementos");
      return;
    }
    items.forEach((item) => {
      if (item.type === "text") {
        pushLine(
          `    - [texto] ${item.id} | "${item.text || ""}" | fonte=${item.fontFamily || "-"} | tamanho=${
            item.fontSize || "-"
          } | x=${round(item.x)} y=${round(item.y)}`,
        );
      } else {
        pushLine(
          `    - [imagem] ${item.id} | arquivo=${item.fileName || item.id || "-"} | x=${round(item.x)} y=${round(
            item.y,
          )} | w=${round(item.width)} h=${round(item.height)}`,
        );
      }
    });
  });
};

const createOrderPdf = async ({ payload, outputPath }) => {
  const pdf = await PDFDocument.create();
  const previews = payload.customization?.previews || {};

  await drawPreviewPage({
    pdf,
    title: "Frente - preview da estampa",
    imageDataUrl: previews.front,
  });
  await drawPreviewPage({
    pdf,
    title: "Costas - preview da estampa",
    imageDataUrl: previews.back,
  });
  await drawTechnicalPage({ pdf, payload });

  const bytes = await pdf.save();
  await fsp.writeFile(outputPath, bytes);
  return outputPath;
};

const createZipFromFolder = (sourceFolder, zipOutputPath) =>
  new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipOutputPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => resolve(zipOutputPath));
    output.on("error", reject);
    archive.on("error", reject);

    archive.pipe(output);
    archive.directory(sourceFolder, path.basename(sourceFolder));
    archive.finalize();
  });

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "orders-api", drive: isDriveEnabled() });
});

app.post("/api/orders", async (req, res) => {
  try {
    const payload = req.body || {};
    const orderCode = toSlug(payload.orderCode) || `BCS-${Date.now()}`;
    const submittedAt = payload.submittedAt || new Date().toISOString();

    const orderDir = path.join(ORDERS_DIR, orderCode);
    const assetsDir = path.join(orderDir, "assets");
    const previewsDir = path.join(orderDir, "previews");
    const docsDir = path.join(orderDir, "documents");

    await ensureDir(orderDir);
    await ensureDir(assetsDir);
    await ensureDir(previewsDir);
    await ensureDir(docsDir);

    const normalizedPayload = {
      ...payload,
      orderCode,
      submittedAt,
    };

    const savedPreviews = {};
    const frontPreview = await writeDataUrlFile({
      dataUrl: normalizedPayload.customization?.previews?.front,
      outputBasePath: path.join(previewsDir, "front"),
    });
    if (frontPreview) savedPreviews.front = path.relative(orderDir, frontPreview.path);

    const backPreview = await writeDataUrlFile({
      dataUrl: normalizedPayload.customization?.previews?.back,
      outputBasePath: path.join(previewsDir, "back"),
    });
    if (backPreview) savedPreviews.back = path.relative(orderDir, backPreview.path);

    const inputArtworks = Array.isArray(normalizedPayload.assets?.artworks)
      ? normalizedPayload.assets.artworks
      : [];
    const savedArtworks = [];

    for (let i = 0; i < inputArtworks.length; i += 1) {
      const artwork = inputArtworks[i];
      const parsed = parseDataUrl(artwork.dataUrl);
      if (!parsed) continue;

      const fallbackName = `artwork_${String(i + 1).padStart(2, "0")}${extFromMime(parsed.mimeType)}`;
      const outputName = safeFilePart(artwork.name, fallbackName);
      const outputPath = path.join(assetsDir, outputName);
      await fsp.writeFile(outputPath, parsed.buffer);

      savedArtworks.push({
        id: artwork.id || null,
        file: path.relative(orderDir, outputPath),
        mimeType: artwork.mimeType || parsed.mimeType,
        size: artwork.size || parsed.buffer.byteLength,
      });
    }

    const orderJsonPath = path.join(orderDir, "order.json");
    const printPositionsPath = path.join(docsDir, "print-positions.json");
    const pdfPath = path.join(docsDir, `${orderCode}-ficha-tecnica.pdf`);
    const zipPath = path.join(ORDERS_DIR, `${orderCode}.zip`);

    const payloadToSave = {
      ...normalizedPayload,
      backend: {
        savedAt: new Date().toISOString(),
        orderDir,
        previews: savedPreviews,
        artworks: savedArtworks,
      },
    };

    await fsp.writeFile(orderJsonPath, JSON.stringify(payloadToSave, null, 2), "utf8");
    await fsp.writeFile(
      printPositionsPath,
      JSON.stringify(normalizedPayload.customization?.sideItems || {}, null, 2),
      "utf8",
    );
    await createOrderPdf({ payload: normalizedPayload, outputPath: pdfPath });
    await createZipFromFolder(orderDir, zipPath);

    // Upload para Google Drive (opcional — ativado via variáveis de ambiente)
    const driveResult = await uploadOrderToDrive({ orderCode, orderDir, zipPath });

    const driveSummary = driveResult.uploaded
      ? ` Enviado também ao Google Drive (pasta ${orderCode}).`
      : driveResult.error
        ? ` [AVISO] Falha no upload para o Drive: ${driveResult.error}`
        : "";

    res.json({
      ok: true,
      orderId: orderCode,
      message: `Pedido salvo com pacote técnico (PDF + ZIP).${driveSummary}`,
      storage: {
        type: "local",
        orderDir,
        orderJson: orderJsonPath,
        printPositionsJson: printPositionsPath,
        reportPdf: pdfPath,
        zipFile: zipPath,
        previews: savedPreviews,
        artworks: savedArtworks,
      },
      drive: driveResult,
    });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    res.status(500).json({
      ok: false,
      message: "Falha ao salvar pedido no backend local.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[orders-api] running at port ${PORT}`);
});
