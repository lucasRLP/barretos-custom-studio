import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { google } from "googleapis";

/**
 * Helper pra obter GDRIVE_REFRESH_TOKEN via OAuth 2.0 (conta pessoal).
 *
 * Pré-requisitos:
 *   1. No Google Cloud Console (mesmo projeto), criar OAuth 2.0 Client ID
 *      do tipo "Desktop app".
 *   2. Copiar Client ID e Client Secret pro .env:
 *        GDRIVE_CLIENT_ID=...
 *        GDRIVE_CLIENT_SECRET=...
 *   3. Rodar: npm run drive:auth
 *   4. Abrir a URL que aparece no terminal, autorizar com a conta dona da pasta,
 *      copiar o código e colar aqui.
 *   5. O script grava GDRIVE_REFRESH_TOKEN no .env automaticamente.
 */

const CLIENT_ID = process.env.GDRIVE_CLIENT_ID || "";
const CLIENT_SECRET = process.env.GDRIVE_CLIENT_SECRET || "";
const REDIRECT_URI = "urn:ietf:wg:oauth:2.0:oob";
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const ENV_PATH = path.resolve(process.cwd(), ".env");

const upsertEnvVar = (key, value) => {
  let content = "";
  if (fs.existsSync(ENV_PATH)) {
    content = fs.readFileSync(ENV_PATH, "utf8");
  }
  const line = `${key}=${value}`;
  const regex = new RegExp(`^${key}=.*$`, "m");
  if (regex.test(content)) {
    content = content.replace(regex, line);
  } else {
    if (content.length && !content.endsWith("\n")) content += "\n";
    content += line + "\n";
  }
  fs.writeFileSync(ENV_PATH, content, "utf8");
};

const main = async () => {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error("[drive:auth] Faltam GDRIVE_CLIENT_ID e/ou GDRIVE_CLIENT_SECRET no .env");
    console.error("           Crie um OAuth 2.0 Client ID do tipo Desktop app em:");
    console.error("           https://console.cloud.google.com/apis/credentials");
    process.exit(1);
  }

  const oauth2 = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  const authUrl = oauth2.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });

  console.log("\n1) Abra esta URL no navegador e autorize o app com a conta dona da pasta do Drive:\n");
  console.log(authUrl);
  console.log("\n2) Copie o código que aparecer e cole aqui abaixo.\n");

  const rl = readline.createInterface({ input, output });
  const code = (await rl.question("Código: ")).trim();
  rl.close();

  if (!code) {
    console.error("[drive:auth] Código vazio, abortando.");
    process.exit(1);
  }

  try {
    const { tokens } = await oauth2.getToken(code);
    if (!tokens.refresh_token) {
      console.error("[drive:auth] Resposta sem refresh_token. Rode de novo — em 'Permissões de terceiros'");
      console.error("           da sua conta Google, remova o acesso antigo ao app antes de tentar.");
      process.exit(1);
    }
    upsertEnvVar("GDRIVE_REFRESH_TOKEN", tokens.refresh_token);
    console.log("\n[drive:auth] Refresh token salvo no .env ✔");
    console.log("           Agora pode rodar `npm run dev:api` normalmente.");
  } catch (error) {
    console.error("[drive:auth] Falha ao trocar código por token:", error?.message || error);
    process.exit(1);
  }
};

main();
