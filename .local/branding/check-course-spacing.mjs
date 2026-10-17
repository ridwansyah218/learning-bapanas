import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const puppeteer=require('../browser/node_modules/puppeteer-core');
const data=JSON.parse(fs.readFileSync('.local/dummy/accounts-and-courses.json','utf8'));
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--disable-gpu']});
try{
 const page=await browser.newPage();
 await page.goto('http://localhost/learning-bapanas/login/index.php',{waitUntil:'networkidle2',timeout:90000});
 await page.type('#username','dummy.student01');await page.type('#password',data.users.find(u=>u.username==='dummy.student01').initial_password);
 await Promise.all([page.waitForNavigation({waitUntil:'networkidle2',timeout:90000}),page.click('#loginbtn')]);
 await page.goto(data.courses[0].url,{waitUntil:'networkidle2',timeout:90000});
 const material=await page.$('a[href*="/mod/page/view.php"]');
 const url=await material.evaluate(e=>e.href);
 await page.goto(url,{waitUntil:'networkidle2',timeout:90000});
 for(const width of [1440,390]){
  await page.setViewport({width,height:900});
  console.log(await page.evaluate(()=>({id:document.body.id,width:innerWidth,padding:getComputedStyle(document.querySelector('.moon-main-content')).paddingBottom,scroll:document.documentElement.scrollWidth})));
 }
}finally{await browser.close();}
