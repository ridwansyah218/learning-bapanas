import fs from 'node:fs';
let template=fs.readFileSync('public/lib/templates/loginform.mustache','utf8');
const brand=`<div class="padi-login-shell">
    <div class="padi-login-brand">
        <a href="../" class="padi-login-home">PADI<span>.</span></a>
        <p class="padi-login-subtitle">Pangan Akademi Digital Indonesia</p>
        <div class="padi-login-message"><p class="padi-login-eyebrow">PORTAL PEMBELAJARAN</p><h2>Belajar hari ini.<br>Berdaya untuk<br><span>pangan Indonesia.</span></h2><p>Ruang belajar dan pengembangan kompetensi Badan Pangan Nasional.</p></div>
        <p class="padi-login-signature">Belajar. Berkembang. Berkontribusi.</p>
    </div>
    <div class="loginform padi-login-form">
        <div class="padi-login-welcome"><h1>{{#str}}loginto, core, {{sitename}}{{/str}}</h1><p>Gunakan akun Anda untuk melanjutkan pembelajaran.</p></div>`;
template=template.replace('<div class="loginform">',brand).replace('{{#js}}','</div>\n\n{{#js}}');
fs.mkdirSync('public/theme/moon/templates/core',{recursive:true});
fs.writeFileSync('public/theme/moon/templates/core/loginform.mustache',template);
