import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const puppeteer=require('../browser/node_modules/puppeteer-core');
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--disable-gpu']});
try{
const page=await browser.newPage();
await page.setViewport({width:1440,height:900});
await page.goto('http://localhost/learning-bapanas/login/index.php',{waitUntil:'networkidle2',timeout:90000});
if(!await page.$('#loginguestbtn'))throw new Error('Guest access button is disabled');
await Promise.all([page.waitForNavigation({waitUntil:'networkidle2',timeout:90000}),page.click('#loginguestbtn')]);
await page.goto('http://localhost/learning-bapanas/',{waitUntil:'networkidle2',timeout:90000});
console.log('Guest menu',await page.evaluate(()=>({logout:!!document.querySelector('.padi-guest-logout'),text:document.querySelector('.usermenu')?.innerText})));
for(const width of [1440,1024]){
 await page.setViewport({width,height:900});
 console.log('header',await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,actionsHeight:document.querySelector('.padi-auth-actions')?.getBoundingClientRect().height})));
 const header=await page.$('.moon-header');if(header)await header.screenshot({path:`.local/branding/guest-header-${width}.png`});
}
await page.setViewport({width:1440,height:900});
await Promise.all([page.waitForNavigation({waitUntil:'networkidle2',timeout:90000}),page.click('.padi-guest-logout')]);
console.log('After logout',await page.evaluate(()=>({url:location.pathname,loginForm:!!document.querySelector('#login'),guestLogout:!!document.querySelector('.padi-guest-logout')})));
await page.goto('http://localhost/learning-bapanas/',{waitUntil:'networkidle2',timeout:90000});
console.log('Home after logout',await page.evaluate(()=>({guestBadge:!!document.querySelector('.padi-guest-badge'),guestLogout:!!document.querySelector('.padi-guest-logout')})));
}finally{await browser.close();}
