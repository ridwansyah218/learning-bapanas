import fs from 'node:fs';
const login=fs.readFileSync('public/theme/moon/templates/core/loginform.mustache','utf8');
const brand=login.slice(login.indexOf('<div class="padi-login-brand">'),login.indexOf('<div class="loginform padi-login-form">')).trim();
let template=fs.readFileSync('public/local/moon/templates/main_content.mustache','utf8');
template=template.replace('{{{ output.main_content }}}',`{{#padi_password_page}}
    <div class="padi-login-shell padi-password-shell">${brand}
        <div class="padi-password-form"><h1>{{#str}}passwordforgotten, core{{/str}}</h1>
    {{/padi_password_page}}
    {{{ output.main_content }}}
    {{#padi_password_page}}
        <a class="padi-back-login" href="index.php">{{#str}}login, core{{/str}}</a></div>
    </div>
    {{/padi_password_page}}`);
fs.mkdirSync('public/theme/moon/templates/local_moon',{recursive:true});
fs.writeFileSync('public/theme/moon/templates/local_moon/main_content.mustache',template);
