// Rebuild standalone assets. Run: node build.cjs (no dependencies).
const fs=require('node:fs');
const path=require('node:path');
const zlib=require('node:zlib');
require('./renderer.js');
for(const palette of Object.keys(SVGMaterial.palettes)){
  const text=SVGMaterial.create({id:'pro',palette});
  const name=palette==='original'?'pro.svg':`pro-${palette}.svg`;
  fs.writeFileSync(path.join(__dirname,name),text);
  console.log(name,`${Buffer.byteLength(text)} bytes; gzip ${zlib.gzipSync(text).length} bytes`);
}
let still=SVGMaterial.create({intro:false});
still=still.replace(/<animateTransform[^>]*\/>/g,'').replace(/gradientTransform="rotate\(-35 168 64\)"/g,'gradientTransform="rotate(-35 168 64) translate(418.27 0)"');
still=still.replace('PRO · SVG material study','PRO · static material study').replace('PRO — animated SVG material','PRO — static SVG material');
fs.writeFileSync(path.join(__dirname,'pro-static.svg'),still.replace(/[ \t]+$/gm,''));
