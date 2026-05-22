import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputPath = path.join(__dirname, "../public/WalkinGames.com.png");
const outputPath = inputPath;

const BLACK_THRESHOLD = 45;
const WHITE_THRESHOLD = 200;
/** Site arka plan dalga rengiyle uyumlu gri (#616161 ≈ 0.38) */
const SITE_GRAY = { r: 97, g: 97, b: 97 };

function isNearBlack(r, g, b) {
  return r <= BLACK_THRESHOLD && g <= BLACK_THRESHOLD && b <= BLACK_THRESHOLD;
}

function isWhite(r, g, b) {
  return r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD;
}

function idx(x, y, width) {
  return y * width + x;
}

async function main() {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  // 1) Kenarlardan ve mevcut şeffaf piksellerden siyaha flood → şeffaf
  const visited = new Uint8Array(width * height);
  const queue = [];

  const pushTransparentFlood = (x, y) => {
    const id = idx(x, y, width);
    if (visited[id]) return;
    const i = id * channels;
    const alpha = data[i + 3];
    if (alpha === 0) {
      visited[id] = 1;
      queue.push(id);
      return;
    }
    if (!isNearBlack(data[i], data[i + 1], data[i + 2])) return;
    visited[id] = 1;
    data[i + 3] = 0;
    queue.push(id);
  };

  for (let x = 0; x < width; x++) {
    pushTransparentFlood(x, 0);
    pushTransparentFlood(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    pushTransparentFlood(0, y);
    pushTransparentFlood(width - 1, y);
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = idx(x, y, width) * channels;
      if (data[i + 3] === 0) pushTransparentFlood(x, y);
    }
  }

  const neighbors4 = (id) => {
    const x = id % width;
    const y = (id - x) / width;
    const list = [];
    if (x > 0) list.push(id - 1);
    if (x < width - 1) list.push(id + 1);
    if (y > 0) list.push(id - width);
    if (y < height - 1) list.push(id + width);
    return list;
  };

  while (queue.length > 0) {
    const id = queue.pop();
    for (const n of neighbors4(id)) {
      if (!visited[n]) pushTransparentFlood(n % width, (n - (n % width)) / width);
    }
  }

  // 2) İçerik sınırları ve alt beyaz "GAMES" şeridini bul
  let minX = width,
    minY = height,
    maxX = 0,
    maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = idx(x, y, width) * channels;
      if (data[i + 3] > 0) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  let gamesBarTop = maxY;
  for (let y = maxY; y >= minY; y--) {
    let whiteCount = 0;
    let total = 0;
    for (let x = minX; x <= maxX; x++) {
      const i = idx(x, y, width) * channels;
      if (data[i + 3] === 0) continue;
      total++;
      if (isWhite(data[i], data[i + 1], data[i + 2])) whiteCount++;
    }
    if (total > 0 && whiteCount / total > 0.45) {
      gamesBarTop = y;
      break;
    }
  }

  const inGamesBar = (y) => y >= gamesBarTop - 2;

  // 3) Beyaza bitişik siyahları işle: WALK içi → şeffaf, GAMES yazısı → site grisi
  const blackVisited = new Uint8Array(width * height);
  const blackQueue = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const id = idx(x, y, width);
      const i = id * channels;
      if (data[i + 3] === 0 || !isWhite(data[i], data[i + 1], data[i + 2])) continue;

      for (const n of neighbors4(id)) {
        const ni = n * channels;
        if (data[ni + 3] === 0 || !isNearBlack(data[ni], data[ni + 1], data[ni + 2])) continue;
        if (blackVisited[n]) continue;
        blackVisited[n] = 1;
        blackQueue.push(n);
      }
    }
  }

  while (blackQueue.length > 0) {
    const id = blackQueue.pop();
    const x = id % width;
    const y = (id - x) / width;
    const i = id * channels;

    if (inGamesBar(y)) {
      data[i] = SITE_GRAY.r;
      data[i + 1] = SITE_GRAY.g;
      data[i + 2] = SITE_GRAY.b;
    } else {
      data[i + 3] = 0;
    }

    for (const n of neighbors4(id)) {
      if (blackVisited[n]) continue;
      const ni = n * channels;
      if (data[ni + 3] === 0 || !isNearBlack(data[ni], data[ni + 1], data[ni + 2])) continue;
      blackVisited[n] = 1;
      blackQueue.push(n);
    }
  }

  // 4) Kalan siyah ve koyu kenar piksellerini temizle
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = idx(x, y, width) * channels;
      if (data[i + 3] === 0) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const maxC = Math.max(r, g, b);
      const minC = Math.min(r, g, b);
      const isDark = maxC <= BLACK_THRESHOLD;
      const isDarkFringe = maxC <= 70 && maxC - minC <= 20;
      if (!isDark && !isDarkFringe) continue;

      if (inGamesBar(y)) {
        data[i] = SITE_GRAY.r;
        data[i + 1] = SITE_GRAY.g;
        data[i + 2] = SITE_GRAY.b;
      } else {
        data[i + 3] = 0;
      }
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png()
    .toFile(outputPath);

  console.log(`Saved logo (${outputPath}), games bar from y=${gamesBarTop}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
