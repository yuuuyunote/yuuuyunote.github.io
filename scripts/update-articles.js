/**
 * update-articles.js
 * note の RSS (https://note.com/yuuuyugbp/rss) を取得し、
 * articles.json に存在しない新着記事のみを先頭に追記する。
 *
 * 既存の「最新3記事をポートフォリオに表示する Action」とは
 * 完全に独立しており、articles.json 以外のファイルには触れない。
 */

const fs = require('fs');
const path = require('path');
const { XMLParser } = require('fast-xml-parser');

const RSS_URL = 'https://note.com/yuuuyugbp/rss';
const ARTICLES_PATH = path.join(__dirname, '..', 'articles.json');

function unwrap(value) {
  // fast-xml-parser は CDATA を { __cdata: "..." } の形にする場合があるため吸収する
  if (value && typeof value === 'object' && '__cdata' in value) {
    return value.__cdata;
  }
  return value;
}

function toIsoZ(pubDateRaw) {
  const d = new Date(pubDateRaw);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().replace(/\.\d{3}Z$/, '.000Z');
}

async function fetchRssItems() {
  const res = await fetch(RSS_URL, {
    headers: { 'User-Agent': 'Mozilla/5.0 (GitHub Actions note-search bot)' },
  });
  if (!res.ok) {
    throw new Error(`RSS の取得に失敗しました: HTTP ${res.status}`);
  }
  const xml = await res.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    cdataPropName: '__cdata',
  });
  const parsed = parser.parse(xml);

  const items = parsed?.rss?.channel?.item;
  if (!items) return [];
  const itemList = Array.isArray(items) ? items : [items];

  return itemList
    .map((item) => {
      const title = (unwrap(item.title) || '').toString().trim();
      const url = (unwrap(item.link) || '').toString().trim();
      const pubDate = toIsoZ(unwrap(item.pubDate));
      return { title, url, pubDate };
    })
    .filter((a) => a.url && a.title && a.pubDate);
}

function loadExisting() {
  if (!fs.existsSync(ARTICLES_PATH)) return [];
  const raw = fs.readFileSync(ARTICLES_PATH, 'utf-8');
  if (!raw.trim()) return [];
  return JSON.parse(raw);
}

function saveArticles(articles) {
  fs.writeFileSync(
    ARTICLES_PATH,
    JSON.stringify(articles, null, 2) + '\n',
    'utf-8'
  );
}

async function main() {
  const existing = loadExisting();
  const existingUrls = new Set(existing.map((a) => a.url));

  const rssItems = await fetchRssItems();

  // 重複排除：既に articles.json に存在する url は除外
  const newArticles = rssItems.filter((a) => !existingUrls.has(a.url));

  if (newArticles.length === 0) {
    console.log('新着記事はありませんでした。articles.json は更新しません。');
    return;
  }

  // RSS 内で複数の新着がある場合は新しい順に並べてから先頭に追加
  newArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  const updated = [...newArticles, ...existing];
  saveArticles(updated);

  console.log(
    `新着記事 ${newArticles.length} 件を articles.json の先頭に追加しました:`
  );
  newArticles.forEach((a) => console.log(` - ${a.title} (${a.url})`));
}

main().catch((err) => {
  console.error('update-articles.js でエラーが発生しました:', err);
  process.exit(1);
});
