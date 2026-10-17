import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const puppeteer=require('../browser/node_modules/puppeteer-core');
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--disable-gpu']});
try{
 const page=await browser.newPage();
 await page.goto('http://localhost/learning-bapanas/login/index.php',{waitUntil:'networkidle2',timeout:90000});
 console.log(await page.evaluate(()=>({branded:!!document.querySelector('.padi-login-shell'),heading:document.querySelector('.padi-login-welcome h1')?.textContent,forgot:!!document.querySelector('.login-form-forgotpassword a'),guest:!!document.querySelector('#guestlogin'),language:!!document.querySelector('.login-languagemenu'),home:document.querySelector('.padi-login-home')?.href})));
 for(const width of [1440,390,320]){
  await page.setViewport({width,height:1000});
  console.log(await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,form:!!document.querySelector('#login input[name=username]'),submit:!!document.querySelector('#login button[type=submit]')})));
  await page.screenshot({path:`.local/branding/login-new-${width}.png`,fullPage:true});
 }
}finally{await browser.close();}
