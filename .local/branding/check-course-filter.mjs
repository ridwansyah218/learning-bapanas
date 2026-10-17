import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const puppeteer=require('../browser/node_modules/puppeteer-core');
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--disable-gpu']});
try {
 const page=await browser.newPage();
 for(const path of ['course/index.php?categoryid=1','course/search.php?search=Kursus']){
  await page.goto('http://localhost/learning-bapanas/'+path,{waitUntil:'networkidle2',timeout:90000});
  console.log(await page.evaluate(()=>({id:document.body.id,lists:[...document.querySelectorAll('.coursebox')].map(e=>({parent:e.parentElement.className,html:e.outerHTML.slice(0,1600)})),filters:[...document.querySelectorAll('#region-main select,#region-main form')].map(e=>({html:e.outerHTML.slice(0,1600),parent:e.parentElement.className}))})));
  for(const width of [1440,390,320]){
   await page.setViewport({width,height:1000});
   console.log(await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,cards:[...document.querySelectorAll('.coursebox')].map(e=>Math.round(e.getBoundingClientRect().width))})));
   await page.screenshot({path:`.local/branding/filter-${path.includes('search')?'search':'category'}-${width}.png`,fullPage:true});
  }
 }
}finally{await browser.close();}
