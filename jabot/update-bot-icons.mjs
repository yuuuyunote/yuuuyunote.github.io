// scripts/update-bot-icons.mjs
//
// bots.json の各Botの "id"（Discord Application/Client ID）を使って、
// 認証不要のRPC公開エンドポイントからアイコン情報を取得し、
// "icon" フィールドにCDNの画像URLを書き込むスクリプト。
// GitHub Actions から定期実行される想定（.github/workflows/update-bot-icons.yml）。
//
// 実行: node scripts/update-bot-icons.mjs

import { readFile, writeFile } from "node:fs/promises";

const BOTS_JSON_PATH = new URL("../bots.json", import.meta.url);
const REQUEST_DELAY_MS = 400; // Discord側のレート制限を避けるための間隔
const SNOWFLAKE_RE = /^\d{15,20}$/; // Discordのapplication idの形式（数字15〜20桁）

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchAppIcon(applicationId) {
  const res = await fetch(
    `https://discord.com/api/v10/applications/${applicationId}/rpc`,
    {
      headers: {
        "User-Agent": "KakehashiIconUpdater/1.0 (+https://github.com/)",
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = await res.json();

  if (!data || !data.icon) {
    return null;
  }

  return `https://cdn.discordapp.com/app-icons/${applicationId}/${data.icon}.png?size=128`;
}

async function main() {
  const raw = await readFile(BOTS_JSON_PATH, "utf8");
  const bots = JSON.parse(raw);

  let updatedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const bot of bots) {
    const appId = bot.id;

    if (typeof appId !== "string" || !SNOWFLAKE_RE.test(appId)) {
      console.warn(
        `[skip] ${bot.name}: id "${appId}" is not a valid Discord application id — replace it with the real one in bots.json.`
      );
      skippedCount++;
      continue;
    }

    try {
      const iconUrl = await fetchAppIcon(appId);

      if (iconUrl && iconUrl !== bot.icon) {
        bot.icon = iconUrl;
        updatedCount++;
        console.log(`[updated] ${bot.name}: ${iconUrl}`);
      } else if (!iconUrl) {
        console.log(`[no-icon] ${bot.name}: application has no icon set`);
      } else {
        console.log(`[unchanged] ${bot.name}`);
      }
    } catch (err) {
      console.error(`[failed] ${bot.name} (id: ${appId}): ${err.message}`);
      failedCount++;
    }

    await sleep(REQUEST_DELAY_MS);
  }

  await writeFile(BOTS_JSON_PATH, JSON.stringify(bots, null, 2) + "\n", "utf8");

  console.log(
    `\nDone. updated=${updatedCount} skipped=${skippedCount} failed=${failedCount}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
