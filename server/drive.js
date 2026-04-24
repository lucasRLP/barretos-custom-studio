import fs from "node:fs";
import path from "node:path";
import { google } from "googleapis";

/**
 * Google Drive integration via OAuth (conta pessoal).
 *
 * Para contas do Google pessoais (não Workspace), Service Accounts não possuem cota
 * de storage em "Meu Drive" e o upload falha. Usamos OAuth com refresh token — assim
 * os arquivos ficam na conta do dono da pasta e contam contra a cota dele.
 *
 * Passo a passo de configuração:
 *   1. Rode `npm run drive:auth` e siga as instruções no terminal (abre o navegador,
 *      você autoriza o app com a conta do Google, cola o código de volta).
 *   2. O script grava GDRIVE_REFRESH_TOKEN no .env automaticamente.
 *   3. A partir daí, `npm run dev:api` faz upload dos pedidos pra pasta do Drive.
 *
 * Variáveis de ambiente usadas:
 *   GDRIVE_FOLDER_ID          → id da pasta de destino
 *   GDRIVE_CLIENT_ID          → OAuth 2.0 Client ID (tipo Desktop app)
 *   GDRIVE_CLIENT_SECRET      → OAuth 2.0 Client Secret
 *   GDRIVE_REFRESH_TOKEN      → obtido via `npm run drive:auth`
 */

const FOLDER_ID = process.env.GDRIVE_FOLDER_ID || "";
const CLIENT_ID = process.env.GDRIVE_CLIENT_ID || "";
const CLIENT_SECRET = process.env.GDRIVE_CLIENT_SECRET || "";
const REFRESH_TOKEN = process.env.GDRIVE_REFRESH_TOKEN || "";

// Compat: caminho antigo do service account (fallback para tentativa inicial)
const LEGACY_SA_KEY_PATH = process.env.GDRIVE_SERVICE_ACCOUNT_KEY_PATH || "";

let driveClient = null;

const getDriveClient = () => {
  if (driveClient) return driveClient;

  if (FOLDER_ID && CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN) {
    const oauth2 = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, "urn:ietf:wg:oauth:2.0:oob");
    oauth2.setCredentials({ refresh_token: REFRESH_TOKEN });
    driveClient = google.drive({ version: "v3", auth: oauth2 });
    return driveClient;
  }

  // Fallback para service account (funciona apenas em Shared Drives / Workspace)
  if (FOLDER_ID && LEGACY_SA_KEY_PATH && fs.existsSync(LEGACY_SA_KEY_PATH)) {
    const auth = new google.auth.GoogleAuth({
      keyFile: LEGACY_SA_KEY_PATH,
      scopes: ["https://www.googleapis.com/auth/drive"],
    });
    driveClient = google.drive({ version: "v3", auth });
    return driveClient;
  }

  return null;
};

export const isDriveEnabled = () => {
  if (!FOLDER_ID) return false;
  if (CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN) return true;
  if (LEGACY_SA_KEY_PATH && fs.existsSync(LEGACY_SA_KEY_PATH)) return true;
  return false;
};

const createFolder = async (drive, name, parentId) => {
  const res = await drive.files.create({
    requestBody: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    },
    fields: "id, name, webViewLink",
    supportsAllDrives: true,
  });
  return res.data;
};

const uploadFile = async (drive, filePath, parentId) => {
  const name = path.basename(filePath);
  const res = await drive.files.create({
    requestBody: {
      name,
      parents: [parentId],
    },
    media: {
      body: fs.createReadStream(filePath),
    },
    fields: "id, name, webViewLink, size",
    supportsAllDrives: true,
  });
  return res.data;
};

const walkDir = (dirPath) => {
  const results = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push({ type: "dir", name: entry.name, path: full });
    } else if (entry.isFile()) {
      results.push({ type: "file", name: entry.name, path: full });
    }
  }
  return results;
};

const uploadFolderRecursive = async (drive, localPath, parentId) => {
  const uploaded = [];
  const entries = walkDir(localPath);

  for (const entry of entries) {
    if (entry.type === "dir") {
      const subFolder = await createFolder(drive, entry.name, parentId);
      const children = await uploadFolderRecursive(drive, entry.path, subFolder.id);
      uploaded.push({ type: "dir", name: entry.name, id: subFolder.id, children });
    } else {
      const file = await uploadFile(drive, entry.path, parentId);
      uploaded.push({ type: "file", name: entry.name, id: file.id, webViewLink: file.webViewLink });
    }
  }

  return uploaded;
};

export const uploadOrderToDrive = async ({ orderCode, orderDir, zipPath }) => {
  if (!isDriveEnabled()) {
    return { uploaded: false, skipped: true };
  }

  const drive = getDriveClient();
  if (!drive) {
    return { uploaded: false, skipped: true, error: "drive client não inicializado" };
  }

  try {
    const folder = await createFolder(drive, orderCode, FOLDER_ID);
    await uploadFolderRecursive(drive, orderDir, folder.id);

    let zipInfo = null;
    if (zipPath && fs.existsSync(zipPath)) {
      zipInfo = await uploadFile(drive, zipPath, folder.id);
    }

    return {
      uploaded: true,
      folderId: folder.id,
      folderLink: folder.webViewLink,
      zipId: zipInfo?.id,
      zipLink: zipInfo?.webViewLink,
    };
  } catch (error) {
    console.error("[drive] upload error:", error);
    return {
      uploaded: false,
      error: error instanceof Error ? error.message : "falha desconhecida no upload para o Drive",
    };
  }
};
