import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { deflateSync } from "node:zlib";

const outputDir = path.resolve("public/assets");
mkdirSync(outputDir, { recursive: true });

const sizes = [16, 32, 80];

for (const size of sizes) {
  writeFileSync(
    path.join(outputDir, `icon-${size}.png`),
    createIcon(size, size),
  );
}

writeFileSync(path.join(outputDir, "favicon-32.png"), createIcon(32, 32));

function createIcon(width, height) {
  const raw = Buffer.alloc((width * 4 + 1) * height);

  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * (width * 4 + 1);
    raw[rowOffset] = 0;

    for (let x = 0; x < width; x += 1) {
      const offset = rowOffset + 1 + x * 4;
      const isBand = y > height * 0.72;
      const isBarA =
        x > width * 0.2 &&
        x < width * 0.34 &&
        y > height * 0.5 &&
        y < height * 0.75;
      const isBarB =
        x > width * 0.39 &&
        x < width * 0.53 &&
        y > height * 0.37 &&
        y < height * 0.75;
      const isBarC =
        x > width * 0.58 &&
        x < width * 0.72 &&
        y > height * 0.24 &&
        y < height * 0.75;

      let r = 15;
      let g = 23;
      let b = 42;

      if (isBand) {
        r = 245;
        g = 158;
        b = 11;
      }

      if (isBarA) {
        r = 248;
        g = 250;
        b = 252;
      }

      if (isBarB) {
        r = 219;
        g = 234;
        b = 254;
      }

      if (isBarC) {
        r = 125;
        g = 211;
        b = 252;
      }

      raw[offset] = r;
      raw[offset + 1] = g;
      raw[offset + 2] = b;
      raw[offset + 3] = 255;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuffer = Buffer.from(type, "ascii");
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, checksum]);
}

function crc32(buffer) {
  let crc = 0xffffffff;

  for (const byte of buffer) {
    crc ^= byte;

    for (let bit = 0; bit < 8; bit += 1) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}
