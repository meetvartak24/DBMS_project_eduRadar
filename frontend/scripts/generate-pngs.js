import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.resolve(__dirname, '../public');

function crc32(buf) {
  let table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const crcVal = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(crcVal, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createPng(width, height, pixelFn) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const offset = y * rowSize;
    rawData[offset] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelFn(x, y, width, height);
      const pxOffset = offset + 1 + x * 4;
      rawData[pxOffset] = Math.max(0, Math.min(255, Math.round(r)));
      rawData[pxOffset + 1] = Math.max(0, Math.min(255, Math.round(g)));
      rawData[pxOffset + 2] = Math.max(0, Math.min(255, Math.round(b)));
      rawData[pxOffset + 3] = Math.max(0, Math.min(255, Math.round(a)));
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, makeChunk('IHDR', ihdr), idat, iend]);
}

// Draw radar icon
function renderEduRadarIcon(x, y, size, isMaskable) {
  const cx = size / 2;
  const cy = size / 2;
  const scale = size / 512;

  // Background
  let bgA = 1;
  if (!isMaskable) {
    const rx = 104 * scale;
    const dx = Math.max(0, Math.abs(x - cx) - (cx - rx));
    const dy = Math.max(0, Math.abs(y - cy) - (cy - rx));
    const distCorner = Math.hypot(dx, dy);
    if (distCorner > rx) {
      return [0, 0, 0, 0];
    }
  }

  // Dark radial background
  const rDist = Math.hypot(x - cx, y - cy) / (size / 2);
  // Gradient #242e37 -> #12171c
  const bgR = 36 * (1 - rDist * 0.4);
  const bgG = 46 * (1 - rDist * 0.4);
  const bgB = 55 * (1 - rDist * 0.4);

  let r = bgR,
    g = bgG,
    b = bgB,
    a = 255;

  // Radar scope scale (maskable has slightly smaller inner content for safe-area)
  const contentScale = isMaskable ? scale * 0.78 : scale;
  const curDx = x - cx;
  const curDy = y - cy;
  const curDist = Math.hypot(curDx, curDy);

  // Blend helper
  function blend(colorR, colorG, colorB, alpha) {
    r = r * (1 - alpha) + colorR * alpha;
    g = g * (1 - alpha) + colorG * alpha;
    b = b * (1 - alpha) + colorB * alpha;
  }

  // Radar rings: 180, 130, 80
  const rings = [
    { radius: 180 * contentScale, width: 3.5 * scale, alpha: 0.35 },
    { radius: 130 * contentScale, width: 3.5 * scale, alpha: 0.45 },
    { radius: 80 * contentScale, width: 4 * scale, alpha: 0.65 },
  ];

  for (const ring of rings) {
    const diff = Math.abs(curDist - ring.radius);
    if (diff < ring.width) {
      const ringAlpha = (1 - diff / ring.width) * ring.alpha;
      blend(135, 212, 189, ringAlpha);
    }
  }

  // Crosshairs (only inside outer ring)
  const maxR = 180 * contentScale;
  if (curDist < maxR) {
    const lineWidth = 1.5 * scale;
    const diffX = Math.abs(curDx);
    const diffY = Math.abs(curDy);
    if (diffX < lineWidth) {
      blend(135, 212, 189, (1 - diffX / lineWidth) * 0.25);
    }
    if (diffY < lineWidth) {
      blend(135, 212, 189, (1 - diffY / lineWidth) * 0.25);
    }
  }

  // Sweep sector (angle from -90 deg [top] to -45 deg [top-right])
  // In canvas/math coordinates, top is -y, right is +x.
  const angle = Math.atan2(curDy, curDx); // -PI to PI
  // Top is -PI/2 (-1.57), top-right is -PI/4 (-0.785)
  if (curDist < maxR && angle >= -Math.PI / 2 && angle <= -Math.PI / 4) {
    const sweepProgress = (angle - -Math.PI / 2) / (Math.PI / 4); // 0 at top to 1 at beam edge
    const sweepAlpha = sweepProgress * 0.42 * (1 - curDist / (maxR * 1.05));
    blend(135, 212, 189, sweepAlpha);
  }

  // Sweep line at -45 deg
  if (curDist < maxR) {
    // Normal distance to 45 deg line: y = -x, so x + y = 0
    const distToLine = Math.abs(curDx + curDy) / Math.SQRT2;
    if (curDx > 0 && curDy < 0 && distToLine < 2.5 * scale) {
      const lineAlpha = (1 - distToLine / (2.5 * scale)) * 0.85;
      blend(135, 212, 189, lineAlpha);
    }
  }

  // Blip at (340, 172) mapped to center
  const blip1X = cx + (340 - 256) * contentScale;
  const blip1Y = cy + (172 - 256) * contentScale;
  const distBlip1 = Math.hypot(x - blip1X, y - blip1Y);
  if (distBlip1 < 16 * contentScale) {
    blend(135, 212, 189, 0.25);
  }
  if (distBlip1 < 8 * contentScale) {
    blend(135, 212, 189, 0.9);
  }
  if (distBlip1 < 3.5 * contentScale) {
    blend(255, 255, 255, 1.0);
  }

  // Center core dot
  if (curDist < 14 * contentScale) {
    blend(135, 212, 189, 1.0);
  }
  if (curDist < 6 * contentScale) {
    blend(23, 29, 35, 1.0);
  }

  return [r, g, b, a];
}

const targets = [
  { name: 'pwa-192x192.png', size: 192, maskable: false },
  { name: 'pwa-512x512.png', size: 512, maskable: false },
  { name: 'pwa-maskable-192x192.png', size: 192, maskable: true },
  { name: 'pwa-maskable-512x512.png', size: 512, maskable: true },
  { name: 'apple-touch-icon.png', size: 180, maskable: false },
  { name: 'favicon.png', size: 64, maskable: false },
];

for (const t of targets) {
  const buf = createPng(t.size, t.size, (x, y, s) => renderEduRadarIcon(x, y, s, t.maskable));
  const outPath = path.join(outDir, t.name);
  fs.writeFileSync(outPath, buf);
  console.log(`Generated ${t.name} (${t.size}x${t.size}, ${buf.length} bytes)`);
}
