import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const puppeteer=require('../browser/node_modules/puppeteer-core');
const data=JSON.parse(fs.readFileSync('.local/dummy/accounts-and-courses.json','utf8'));
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--disable-gpu']});
try{
for(const username of ['dummy.teacher01','dummy.student01']){
 const context=await browser.createBrowserContext();const page=await context.newPage();
 await page.goto('http://localhost/learning-bapanas/login/index.php',{waitUntil:'networkidle2',timeout:90000});
 await page.type('#username',username);await page.type('#password',data.users.find(u=>u.username===username).initial_password);
 await Promise.all([page.waitForNavigation({waitUntil:'networkidle2',timeout:90000}),page.click('#loginbtn')]);
 await page.goto(data.courses[0].url,{waitUntil:'networkidle2',timeout:90000});
 const result=await page.evaluate(()=>({url:location.pathname,material:document.body.innerText.includes('Materi Demo:'),error:document.querySelector('.alert-danger')?.innerText}));
 if(!result.material||result.error)throw new Error(`${username}: ${JSON.stringify(result)}`);
 console.log(username,result);
 const material=await page.$('a[href*="/mod/page/view.php"]');
 if(!material)throw new Error('Missing material link');
 const href=await material.evaluate(e=>e.href);await page.goto(href,{waitUntil:'networkidle2',timeout:90000});
 if(!await page.evaluate(()=>document.body.innerText.includes('Latihan mandiri')))throw new Error('Material content inaccessible');
 console.log(username,'material readable');await context.close();
}
const page=await browser.newPage();await page.goto('http://localhost/learning-bapanas/',{waitUntil:'networkidle2',timeout:90000});
console.log('Home',await page.evaluate(()=>({demoCourses:[...document.querySelectorAll('.coursename')].filter(e=>e.textContent.includes('Demo')).length,announcements:document.body.innerText.includes('[DUMMY] Selamat datang di portal PADI')})));
}finally{await browser.close();}
