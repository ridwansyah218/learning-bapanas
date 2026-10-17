import fs from 'node:fs';
const path='public/branding/bapanas/padi.css';
let css=fs.readFileSync(path,'utf8');
css=css.replace(/:where\(([^)]+) (h[1-6])\)/g,':where($1) $2');
css=css.replace(/grid-template-columns: 1fr 1fr;/g,'grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);');
css+='\n.padi-footer-grid > div { min-width: 0; overflow-wrap: anywhere; }\n';
fs.writeFileSync(path,css);
