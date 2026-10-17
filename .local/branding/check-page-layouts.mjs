import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),puppeteer=require('../browser/node_modules/puppeteer-core');
const data=JSON.parse(fs.readFileSync('.local/dummy/accounts-and-courses.json','utf8'));
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--disable-gpu']});
try{
const page=await browser.newPage();
await page.goto('http://localhost/learning-bapanas/login/index.php',{waitUntil:'networkidle2',timeout:90000});
await page.type('#username','dummy.teacher01');await page.type('#password',data.users.find(u=>u.username==='dummy.teacher01').initial_password);
await Promise.all([page.waitForNavigation({waitUntil:'networkidle2',timeout:90000}),page.click('#loginbtn')]);
await page.goto(data.courses[0].url,{waitUntil:'networkidle2',timeout:90000});
const activity=await page.$eval('a[href*="/mod/page/view.php"]',e=>e.href);
for(const route of [data.courses[0].url,activity,'http://localhost/learning-bapanas/my/','http://localhost/learning-bapanas/my/courses.php','http://localhost/learning-bapanas/user/profile.php','http://localhost/learning-bapanas/course/index.php','http://localhost/learning-bapanas/course/search.php?search=Demo']){
 await page.goto(route,{waitUntil:'networkidle2',timeout:90000});
 for(const width of [1440,390]){
  await page.setViewport({width,height:900});
  const result=await page.evaluate(()=>({page:document.body.id,width:innerWidth,scroll:document.documentElement.scrollWidth,padding:document.querySelector('.padi-app-content')&&getComputedStyle(document.querySelector('.padi-app-content')).paddingBottom,promos:!!document.querySelector('.padi-hero,.padi-journey,.padi-section-intro'),error:document.querySelector('.alert-danger')?.innerText}));
  console.log(result);if(result.promos||result.error||result.padding==='0px')throw new Error('Unexpected layout');
 }
}
await page.goto('http://localhost/learning-bapanas/?redirect=0',{waitUntil:'networkidle2',timeout:90000});
console.log('Home promos',await page.evaluate(()=>!!document.querySelector('.padi-hero')&&!!document.querySelector('.padi-journey')));
}finally{await browser.close();}
