import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {createCanvas}=require('../browser/node_modules/@napi-rs/canvas');
fs.mkdirSync('.local/dummy',{recursive:true});
const names=['Ketahanan Pangan','Keamanan Pangan','Gizi & Konsumsi','Data Pangan','Distribusi Pangan','Komunikasi Publik'];
names.forEach((name,i)=>{
 const canvas=createCanvas(960,540),ctx=canvas.getContext('2d');
 const colors=['#194d14','#286148','#37634e','#244e62','#466033','#39584b'];
 ctx.fillStyle=colors[i];ctx.fillRect(0,0,960,540);
 ctx.fillStyle='#ffffff0b';ctx.beginPath();ctx.arc(880,100,300,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#ecbc33';ctx.fillRect(60,68,62,6);
 ctx.font='bold 24px Arial';ctx.fillStyle='#fff';ctx.fillText('PADI · KURSUS DEMO',60,125);
 ctx.font='bold 52px Arial';ctx.fillText(name,60,285);
 ctx.font='24px Arial';ctx.fillStyle='#e0eadc';ctx.fillText('Badan Pangan Nasional',60,342);
 ctx.font='20px Arial';ctx.fillText('DATA DUMMY · UNTUK SIMULASI PEMBELAJARAN',60,466);
 fs.writeFileSync(`.local/dummy/course-${i+1}.png`,canvas.toBuffer('image/png'));
});
