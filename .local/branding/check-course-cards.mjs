import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const puppeteer=require('../browser/node_modules/puppeteer-core');
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--disable-gpu']});
try {
 const page=await browser.newPage();
 await page.setViewport({width:1440,height:1000});
 await page.goto('http://localhost/learning-bapanas/',{waitUntil:'networkidle2',timeout:90000});
 console.log(await page.evaluate(()=>({filters:document.querySelector('.padi-course-filters')?.innerText,categories:[...document.querySelectorAll('.padi-course-filters select option')].map(e=>e.textContent.trim()),search:document.querySelector('.padi-course-filters form.simplesearchform')?.action,errors:document.querySelector('.alert-danger')?.innerText})));
 console.log('Category boxes',await page.evaluate(()=>[...document.querySelectorAll('#frontpage-category-names .category > .info')].map(e=>({text:e.textContent.trim(),width:e.getBoundingClientRect().width,container:e.parentElement.getBoundingClientRect().width}))));
 for(const width of [1440,768,390,320]) {
  await page.setViewport({width,height:1000});
  console.log(await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,filterAboveCourses:!!(document.querySelector('.padi-course-filters')?.compareDocumentPosition(document.querySelector('#frontpage-available-course-list')) & Node.DOCUMENT_POSITION_FOLLOWING),categoryWidth:document.querySelector('.padi-course-filters select')?.getBoundingClientRect().width,cards:[...document.querySelectorAll('.frontpage-course-list-all .coursebox')].map(e=>({width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height}))})));
  const el=await page.$('#frontpage-available-course-list');
  if(el)await el.screenshot({path:`.local/branding/courses-${width}.png`});
  const filters=await page.$('.padi-course-filters');
  if(filters)await filters.screenshot({path:`.local/branding/home-filters-${width}.png`});
 }
}finally{await browser.close();}
