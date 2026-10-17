import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
const require=createRequire(import.meta.url);
const puppeteer=require('../browser/node_modules/puppeteer-core');
const php=mode=>execFileSync('C:/xampp/php/php.exe',['.local/branding/probe-controls.php',mode],{stdio:'pipe'});
let browser;
try {
    php('test');
    browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--disable-gpu']});
    const page=await browser.newPage();
    await page.setViewport({width:1440,height:900});
    await page.goto('http://localhost/learning-bapanas/',{waitUntil:'networkidle2',timeout:60000});
    const result=await page.evaluate(()=>({
        primary:getComputedStyle(document.querySelector('.padi-icon')).color,
        secondary:getComputedStyle(document.querySelector('.padi-hero')).backgroundColor,
        accent:getComputedStyle(document.querySelector('.padi-hero h1 em')).color,
        bodyFont:getComputedStyle(document.body).fontFamily,
        headingSize:getComputedStyle(document.querySelector('.padi-hero h1')).fontSize,
        logo:document.querySelector('.site-title')?.textContent.trim()
    }));
    console.log('Native Moon changes',result);
    if(result.primary!=='rgb(18, 52, 86)'||result.secondary!=='rgb(52, 86, 120)'||result.accent!=='rgb(255, 221, 136)'||!result.bodyFont.includes('Georgia')||result.headingSize!=='37px'||result.logo!=='Moon control test') throw new Error('A native setting is still overridden.');
} finally {
    php('restore');
    if(browser)await browser.close();
    console.log('Original PADI settings restored.');
}
const finalBrowser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--disable-gpu']});
try {
    const page=await finalBrowser.newPage();
    for(const width of [1440,390,320]){
        await page.setViewport({width,height:900});
        await page.goto('http://localhost/learning-bapanas/',{waitUntil:'networkidle2',timeout:60000});
        const size=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,logo:document.querySelector('.moon-logo-default')?.src}));
        console.log('Restored viewport',size);
        if(size.scroll>size.width)throw new Error('Responsive overflow.');
    }
}finally{await finalBrowser.close();}
