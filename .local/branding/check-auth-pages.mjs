import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const puppeteer=require('../browser/node_modules/puppeteer-core');
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--disable-gpu']});
try{
const page=await browser.newPage();
for(const name of ['index','forgot_password']){
 await page.goto(`http://localhost/learning-bapanas/login/${name}.php`,{waitUntil:'networkidle2',timeout:90000});
 console.log('ancestors',await page.evaluate(()=>{let e=document.querySelector('.padi-login-shell');const a=[];while(e){const c=getComputedStyle(e);a.push({tag:e.tagName,class:e.className,id:e.id,padding:c.padding,margin:c.margin});e=e.parentElement;}return a;}));
 for(const [width,height] of [[1366,768],[1440,900],[390,844],[320,700]]){
  await page.setViewport({width,height});
  console.log(name,await page.evaluate(()=>({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,brand:!!document.querySelector('.padi-login-shell'),formBorder:document.querySelector('.padi-login-form')&&getComputedStyle(document.querySelector('.padi-login-form')).borderWidth,username:!!document.querySelector('input[name=username]'),email:!!document.querySelector('input[name=email]')})));
  await page.screenshot({path:`.local/branding/auth-${name}-${width}.png`,fullPage:true});
 }
}
}finally{await browser.close();}
