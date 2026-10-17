import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const puppeteer=require('../browser/node_modules/puppeteer-core');
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--disable-gpu']});
const page=await browser.newPage();
const failures=[];
page.on('pageerror',e=>failures.push(e.message));
for(const width of [1440,768,390,320]) {
    await page.setViewport({width,height:900});
    await page.goto('http://localhost/learning-bapanas/',{waitUntil:'networkidle2',timeout:60000});
    const result=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth,hero:!!document.querySelector('.padi-hero'),logo:getComputedStyle(document.querySelector('a.moon-logo'),'::before').backgroundImage}));
    if(result.scroll>result.viewport) {
        failures.push(`Horizontal overflow at ${width}`);
        console.log('Overflow elements', await page.evaluate(()=>Array.from(document.querySelectorAll('body *')).filter(e=>e.getBoundingClientRect().right>innerWidth+2&&e.getBoundingClientRect().width>0).slice(-15).map(e=>({tag:e.tagName,class:e.className,width:e.getBoundingClientRect().width,text:e.textContent.slice(0,70)}))));
    }
    console.log('Viewport',width,result);
}
const buttons=await page.evaluate(()=>Array.from(document.querySelectorAll('header button, .moon-header button, .moon-mobile-menu button, [data-bs-toggle="offcanvas"]')).map(e=>({tag:e.tagName,class:e.className,label:e.getAttribute('aria-label'),target:e.getAttribute('data-bs-target')})));
console.log('Mobile controls',buttons);
await page.click('.navbar-toggler');
await new Promise(resolve=>setTimeout(resolve,500));
console.log('Mobile menu visible', await page.evaluate(()=>Array.from(document.querySelectorAll('.drawer')).filter(e=>e.getBoundingClientRect().left>=0&&e.getBoundingClientRect().left<innerWidth).map(e=>e.id)));
const links=['course/index.php','course/index.php?categoryid=1','course/index.php?categoryid=2','my/','my/courses.php','admin/tool/dataprivacy/summary.php','login/index.php'];
for(const path of links) {
    const response=await page.goto('http://localhost/learning-bapanas/'+path,{waitUntil:'networkidle2',timeout:60000});
    console.log('Link',path,response.status(),page.url());
    if(response.status()!==200) failures.push(`${path}: ${response.status()}`);
}
console.log('Failures',failures);
await browser.close();
if(failures.length) process.exitCode=1;
