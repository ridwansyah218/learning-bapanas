import fs from 'node:fs';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const {createCanvas, DOMMatrix, ImageData, Path2D} = require('../browser/node_modules/@napi-rs/canvas');
Object.assign(globalThis, {DOMMatrix, ImageData, Path2D});
const pdfjs = await import('../browser/node_modules/pdfjs-dist/legacy/build/pdf.mjs');
const pdf = await pdfjs.getDocument({data:new Uint8Array(fs.readFileSync('.local/branding/logo-guidelines.pdf')),disableFontFace:true,useSystemFonts:true}).promise;
for(const pageNumber of [6,7,8]) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({scale:1.6});
    const canvas = createCanvas(Math.ceil(viewport.width),Math.ceil(viewport.height));
    await page.render({canvasContext:canvas.getContext('2d'),viewport,canvas}).promise;
    fs.writeFileSync(`.local/branding/guide-${pageNumber}.png`,canvas.toBuffer('image/png'));
}
const settings = JSON.parse(fs.readFileSync('.local/branding/settings-before.json')).theme;
console.log('Typography/code settings', Object.fromEntries(Object.entries(settings).filter(([k])=>/code|typography|css|color_mode/.test(k))));
for(const file of ['.local/branding/before-frontpage.json','public/theme/moon/moon/main_layouts/standard.json']) {
    const data=JSON.parse(fs.readFileSync(file));
    const elements=[];
    for(const s of data.data.sections) for(const r of s.rows) for(const c of r.cols) for(const e of c.elements) elements.push({id:e.id,type:e.type,params:e.params?.filter(p=>['title','content','source','html','customclass'].includes(p.name)).map(p=>({name:p.name,value:String(p.value).slice(0,300)}))});
    console.log(file,JSON.stringify(elements,null,2));
}
