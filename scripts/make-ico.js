// Wrap a PNG into a .ico file (modern ICO with embedded PNG)
const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '..');
const pngPath = path.join(dir, 'favicon32.png');
const icoPath = path.join(dir, 'favicon.ico');

const png = fs.readFileSync(pngPath);
const pngSize = png.length;

// ICONDIR (6 bytes) + ICONDIRENTRY (16 bytes) + PNG data
const ico = Buffer.alloc(6 + 16 + pngSize);

// ICONDIR
ico.writeUInt16LE(0, 0);         // reserved
ico.writeUInt16LE(1, 2);         // type: 1 = icon
ico.writeUInt16LE(1, 4);         // count

// ICONDIRENTRY
ico.writeUInt8(32, 6);           // width
ico.writeUInt8(32, 7);           // height
ico.writeUInt8(0, 8);            // colorCount
ico.writeUInt8(0, 9);            // reserved
ico.writeUInt16LE(1, 10);        // planes
ico.writeUInt16LE(32, 12);       // bitCount
ico.writeUInt32LE(pngSize, 14);  // bytes in resource
ico.writeUInt32LE(22, 18);       // offset to image data (6+16)

// Embed PNG
png.copy(ico, 22);

fs.writeFileSync(icoPath, ico);
console.log(`Written ${icoPath}: ${ico.length} bytes (PNG: ${pngSize} bytes)`);

fs.unlinkSync(pngPath);
console.log('Removed temp favicon32.png');
