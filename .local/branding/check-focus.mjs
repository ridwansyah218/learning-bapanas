import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const puppeteer=require('../browser/node_modules/puppeteer-core');
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--disable-gpu']});
try{
const page=await browser.newPage();
for(const route of ['login/index.php','']){
 await page.goto('http://localhost/learning-bapanas/'+route,{waitUntil:'networkidle2',timeout:90000});
 console.log(route,await page.evaluate(()=>{
 const link=document.querySelector('.login-form-forgotpassword a,.coursename a');
 link.focus();const before=getComputedStyle(link).backgroundColor;
 document.documentElement.style.setProperty('--moon-link-focus-background','#fff3cc');
 return {link:link.textContent,defaultBackground:before,configuredBackground:getComputedStyle(link).backgroundColor};
 }));
}
}finally{await browser.close();}
