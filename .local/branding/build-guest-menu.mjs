import fs from 'node:fs';
let template=fs.readFileSync('public/lib/templates/user_menu.mustache','utf8');
template=template.replace('{{#str}} loggedinasguest, core {{/str}}','<span class="padi-guest-badge" title="{{#str}}loggedinasguest, core{{/str}}">{{#str}}guest, core{{/str}}</span>');
template=template.replace('<div class="divider border-start h-75 align-self-center mx-2"></div>','');
template=template.replace('<span class="login ps-2">','<span class="login ps-2 padi-auth-actions">');
template=template.replace('<a href="{{url}}">','<a class="padi-login-link" href="{{url}}">');
template=template.replace('        </span>',`            {{#guest}}
                {{#guestlogouturl}}
                    <a class="padi-guest-logout" href="{{guestlogouturl}}">{{#str}}logout, core{{/str}}</a>
                {{/guestlogouturl}}
            {{/guest}}
        </span>`);
fs.writeFileSync('public/theme/moon/templates/core/user_menu.mustache',template);
