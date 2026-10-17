import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const puppeteer=require('../browser/node_modules/puppeteer-core');
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--disable-gpu']});
try {
 const page=await browser.newPage();
 await page.goto('http://localhost/learning-bapanas/',{waitUntil:'networkidle2',timeout:90000});
 await page.waitForFunction(()=>document.querySelector('#moon-backtotop')?.style.transition,{timeout:60000});
 const inspect=()=>page.evaluate(()=>({windowY:scrollY,button:document.querySelector('#moon-backtotop')?.outerHTML,scrollers:[...document.querySelectorAll('body, #page, #page-wrapper')].map(e=>({id:e.id,height:e.clientHeight,total:e.scrollHeight,overflow:getComputedStyle(e).overflowY,top:e.scrollTop}))}));
 console.log('before',await inspect());
 await page.evaluate(()=>{window.scrollTo(0,700); const e=document.querySelector('#page'); if(e)e.scrollTop=700;});
 await new Promise(r=>setTimeout(r,600));
 console.log('after',await inspect());
 await page.click('#moon-backtotop');
 await new Promise(r=>setTimeout(r,1100));
 console.log('after click',await page.evaluate(()=>scrollY));
} finally {await browser.close();}
