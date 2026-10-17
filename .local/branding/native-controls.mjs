import fs from 'node:fs';
const path='public/branding/bapanas/padi.css';
let css=fs.readFileSync(path,'utf8');
fs.writeFileSync('.local/branding/padi-before-native.css',css);
// Remove branding injected over Moon's native logo and typography controls.
css=css.replace(/[^{}]*(?:moon-logo|site-title|site-tagline)[^{}]*\{[^{}]*\}/g,'');
css=css.replace(/\.moon-layout h1, \.moon-layout h2, \.moon-layout h3, \.moon-layout h4\s*\{[^}]*\}/,'');
css=css.replace(/\.moon-layout a \{[^}]*\}/,'');
css=css.replace(/\.moon-layout \.btn-primary(?::hover)? \{[^}]*\}/g,'');
css=css.replace(/\.moon-layout \.moon-header a \{[^}]*\}/,'');
css=css.replace(/#page-login-index \.login-logo::after \{[^}]*\}/,'');
css=css.replace(/font-family: "Segoe UI", Arial, sans-serif;/g,'');
css=css.replace(/body\.moon-layout \{[\s\S]*?\n\}/,`body.moon-layout {
    --padi-green: var(--bs-primary);
    --padi-forest: var(--bs-secondary);
    --padi-gold: var(--bs-yellow);
    --padi-ink: var(--bs-body-color);
    --padi-muted: color-mix(in srgb, var(--bs-body-color) 65%, var(--bs-body-bg));
    --padi-line: color-mix(in srgb, var(--bs-primary) 14%, var(--bs-body-bg));
    overflow-x: clip;
}`);
const replacements={
 '#1e7816':'var(--padi-green)', '#194d14':'var(--padi-forest)', '#ecbc33':'var(--padi-gold)',
 '#183127':'var(--padi-ink)', '#153c12':'color-mix(in srgb, var(--padi-forest) 85%, #000)',
 '#f5f8f1':'color-mix(in srgb, var(--padi-green) 5%, var(--bs-body-bg))',
 '#f5f7f2':'color-mix(in srgb, var(--padi-green) 4%, var(--bs-body-bg))',
 '#f2f6ee':'color-mix(in srgb, var(--bs-primary) 5%, var(--bs-body-bg))',
 '#e0e8df':'var(--padi-line)', '#e0e8d9':'var(--padi-line)', '#dfe7d9':'var(--padi-line)',
 '#e0e8da':'var(--padi-line)', '#dce5d8':'var(--padi-line)',
 '#f1f6ed':'color-mix(in srgb, var(--padi-green) 7%, var(--bs-body-bg))',
 '#f1f6ee':'color-mix(in srgb, var(--padi-green) 7%, var(--bs-body-bg))',
 '#f8faf5':'color-mix(in srgb, var(--padi-green) 3%, var(--bs-body-bg))',
 '#edf5e9':'color-mix(in srgb, var(--padi-green) 8%, var(--bs-body-bg))',
 '#fcf5de':'color-mix(in srgb, var(--padi-gold) 16%, var(--bs-body-bg))',
 '#f5cb54':'color-mix(in srgb, var(--padi-gold) 80%, #fff)',
 '#8b6500':'color-mix(in srgb, var(--padi-gold) 45%, #000)',
 '#19370f':'color-mix(in srgb, var(--padi-forest) 70%, #000)',
 '#b98606':'var(--padi-gold)',
 '#fff':'var(--bs-body-bg)', '#ffffff':'var(--bs-body-bg)'
};
css=css.replace(/#[0-9a-fA-F]{3,8}\b/g,color=>replacements[color.toLowerCase()]??color);
// Preserve contrast on the dark hero/footer, independent of the body background.
css=css.replace(/(\.padi-hero \{[^}]*color: )var\(--bs-body-bg\)/,'$1#fff');
css=css.replace(/(\.padi-topbar a \{[^}]*color: )var\(--bs-body-bg\)/,'$1#fff');
css=css.replace(/(\.moon-layout \.padi-hero h1 \{[^}]*color: )var\(--bs-body-bg\)/,'$1#fff');
css=css.replace(/(\.padi-footer \.padi-footer-brand \{[^}]*color: )var\(--bs-body-bg\)/,'$1#fff');
css=css.replace(/(\.moon-layout \.padi-button-outline(?::hover)? \{[^}]*color: )var\(--bs-body-bg\)/g,'$1#fff');
// Native h1/h2/h3 typography has priority over component fallback sizes.
css=css.replace(/([^{}]*\b(?:h1|h2|h3|h4)\b[^{}]*)\{([^{}]*)\}/g,(rule,selector,body)=>{
    if(selector.includes(':focus')||selector.includes('@'))return rule;
    return selector.trim().split(',').map(s=>`:where(${s.trim()})`).join(', ')+' {'+body+'}';
});
fs.writeFileSync(path,css);
const image=fs.readFileSync('public/branding/bapanas/logo-bapanas.png').toString('base64');
fs.writeFileSync('public/branding/bapanas/logo-padi.svg',`<svg xmlns="http://www.w3.org/2000/svg" width="350" height="64" viewBox="0 0 350 64" role="img" aria-label="Badan Pangan Nasional — PADI"><image href="data:image/png;base64,${image}" x="0" y="7" width="119" height="50"/><path d="M135 6v52" stroke="#dce4da"/><text x="151" y="31" font-family="Segoe UI,Arial,sans-serif" font-size="28" font-weight="800" fill="#194d14">PADI</text><text x="151" y="51" font-family="Segoe UI,Arial,sans-serif" font-size="10" fill="#5c6c62">Pangan Akademi Digital Indonesia</text></svg>`);
console.log('CSS now uses Moon/Bootstrap colours; logo exported as a native image asset.');
