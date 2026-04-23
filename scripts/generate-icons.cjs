#!/usr/bin/env node
// Erstellt icon-192.png und icon-512.png in public/
// Reines Node.js, keine externen Abhängigkeiten nötig.
//
// Aufbau: dunkles Quadrat (#1a1a2e) + lila Kreis (#a78bfa) + "E" in weiß
// Als Platzhalter bis echte Icons vorhanden sind.

const zlib = require('zlib')
const fs   = require('fs')
const path = require('path')

// ─── CRC32 für PNG-Chunks ─────────────────────────────────────────────────────
const crcTable = new Uint32Array(256)
for (let n = 0; n < 256; n++) {
  let c = n
  for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
  crcTable[n] = c
}
function crc32(buf) {
  let crc = 0xFFFFFFFF
  for (const byte of buf) crc = crcTable[(crc ^ byte) & 0xFF] ^ (crc >>> 8)
  return (crc ^ 0xFFFFFFFF) >>> 0
}
function pngChunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length)
  const t   = Buffer.from(type, 'ascii')
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])))
  return Buffer.concat([len, t, data, crc])
}

// ─── PNG erzeugen aus einem Uint8Array mit RGB-Pixeln (width × height × 3) ───
function buildPNG(width, height, pixels) {
  const sig  = Buffer.from([137,80,78,71,13,10,26,10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width,  0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8; ihdr[9] = 2  // 8-bit RGB

  // Scanlines: je 1 Filter-Byte (0 = None) + RGB-Pixel
  const raw = Buffer.alloc(height * (1 + width * 3))
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 3)] = 0  // filter: None
    for (let x = 0; x < width; x++) {
      const src = (y * width + x) * 3
      const dst = y * (1 + width * 3) + 1 + x * 3
      raw[dst]     = pixels[src]
      raw[dst + 1] = pixels[src + 1]
      raw[dst + 2] = pixels[src + 2]
    }
  }
  const idat = zlib.deflateSync(raw)
  return Buffer.concat([sig, pngChunk('IHDR', ihdr), pngChunk('IDAT', idat), pngChunk('IEND', Buffer.alloc(0))])
}

// ─── Pixel-Zeichenfunktionen ──────────────────────────────────────────────────
function setPixel(pixels, w, x, y, r, g, b) {
  if (x < 0 || y < 0 || x >= w || y >= w) return
  const i = (y * w + x) * 3
  pixels[i] = r; pixels[i+1] = g; pixels[i+2] = b
}

function fillRect(pixels, w, x0, y0, x1, y1, r, g, b) {
  for (let y = y0; y < y1; y++)
    for (let x = x0; x < x1; x++)
      setPixel(pixels, w, x, y, r, g, b)
}

// Anti-aliased Kreis
function fillCircle(pixels, w, cx, cy, radius, r, g, b) {
  for (let y = cy - radius; y <= cy + radius; y++) {
    for (let x = cx - radius; x <= cx + radius; x++) {
      const dx = x - cx, dy = y - cy
      const dist = Math.sqrt(dx*dx + dy*dy)
      if (dist < radius - 0.5) {
        setPixel(pixels, w, x, y, r, g, b)
      } else if (dist < radius + 0.5) {
        // Rand: mische mit Hintergrund
        const alpha = radius + 0.5 - dist
        const bi    = (Math.max(0, Math.min(w-1, y)) * w + Math.max(0, Math.min(w-1, x))) * 3
        const br = pixels[bi], bg = pixels[bi+1], bb = pixels[bi+2]
        setPixel(pixels, w, x, y,
          Math.round(r * alpha + br * (1 - alpha)),
          Math.round(g * alpha + bg * (1 - alpha)),
          Math.round(b * alpha + bb * (1 - alpha)),
        )
      }
    }
  }
}

// Einfache Bitmap-Schrift: 5×7 Pixel für "E"
// Jede Zeile ist ein Bitmuster (Bit 4 = links)
const GLYPH_E = [
  0b11111,
  0b10000,
  0b11110,
  0b10000,
  0b11111,
]

function drawE(pixels, w, ox, oy, scale, r, g, b) {
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (GLYPH_E[row] & (1 << (4 - col))) {
        fillRect(pixels, w,
          ox + col * scale,
          oy + row * scale,
          ox + col * scale + scale,
          oy + row * scale + scale,
          r, g, b)
      }
    }
  }
}

// ─── Icon rendern ─────────────────────────────────────────────────────────────
function renderIcon(size) {
  const pixels = new Uint8Array(size * size * 3)

  // Hintergrund: #1a1a2e
  fillRect(pixels, size, 0, 0, size, size, 0x1a, 0x1a, 0x2e)

  // Lila Kreis: #a78bfa  (Radius 40% des Icons, mittig)
  const radius = Math.round(size * 0.38)
  fillCircle(pixels, size, size >> 1, size >> 1, radius, 0xa7, 0x8b, 0xfa)

  // "E" in weiß, skaliert und mittig
  const scale   = Math.max(1, Math.round(size / 32))
  const glyphW  = 5 * scale
  const glyphH  = 5 * scale
  const ox      = Math.round((size - glyphW) / 2)
  const oy      = Math.round((size - glyphH) / 2)
  drawE(pixels, size, ox, oy, scale, 0xff, 0xff, 0xff)

  return buildPNG(size, size, pixels)
}

// ─── Dateien schreiben ────────────────────────────────────────────────────────
const publicDir = path.resolve(__dirname, '..', 'public')

fs.writeFileSync(path.join(publicDir, 'icon-192.png'), renderIcon(192))
console.log('✓ public/icon-192.png')

fs.writeFileSync(path.join(publicDir, 'icon-512.png'), renderIcon(512))
console.log('✓ public/icon-512.png')
