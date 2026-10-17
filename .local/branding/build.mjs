import fs from 'node:fs';
const root='@@ROOT@@';
const icon=(name)=>`<i class="fa-solid fa-${name}" aria-hidden="true"></i>`;
const hero=`<section class="padi-hero" aria-labelledby="padi-hero-title"><div class="padi-wrap padi-hero-grid"><div class="padi-hero-copy">
<div class="padi-eyebrow">Pangan Akademi Digital Indonesia</div>
<h1 id="padi-hero-title">Belajar hari ini.<br>Berdaya untuk<br><em>pangan Indonesia.</em></h1>
<p>PADI mendukung pengembangan sumber daya manusia yang kompeten, adaptif, dan berdaya saing untuk mewujudkan ketahanan pangan nasional.</p>
<div class="padi-actions"><a class="padi-button padi-button-gold" href="${root}/course/index.php">Jelajahi kursus ${icon('arrow-right')}</a><a class="padi-button padi-button-outline" href="${root}/my/">Ruang belajar saya ${icon('arrow-up-right-from-square')}</a></div>
<div class="padi-hero-note">${icon('seedling')} Belajar, berkembang, berkontribusi.</div>
</div><aside class="padi-learning-card" aria-label="Fokus pengembangan kompetensi"><div class="padi-card-meta"><span>RUANG TUMBUH BERSAMA</span><span class="padi-pill">PADI</span></div><h2>Kompetensi untuk<br>masa depan pangan.</h2>
<div class="padi-focus"><span class="padi-icon">${icon('seedling')}</span><div><strong>Wawasan pangan</strong><small>Memahami ekosistem pangan nasional.</small></div></div>
<div class="padi-focus"><span class="padi-icon">${icon('users')}</span><div><strong>Sumber daya manusia</strong><small>Mengembangkan kapasitas dan kolaborasi.</small></div></div>
<div class="padi-focus"><span class="padi-icon">${icon('laptop')}</span><div><strong>Kompetensi digital</strong><small>Mendukung kerja yang adaptif dan efektif.</small></div></div>
<div class="padi-card-bottom"><span>BADAN PANGAN NASIONAL</span><b>Belajar sepanjang hayat ${icon('arrow-right')}</b></div></aside></div></section>`;
const quick=`<nav class="padi-quick" aria-label="Akses cepat pembelajaran"><div class="padi-wrap padi-quick-grid">
<a class="padi-quick-link" href="${root}/course/index.php?categoryid=1"><span class="padi-icon">${icon('users')}</span><span><strong>Pengembangan SDM</strong><small>Jelajahi kategori SDM</small></span><span class="padi-arrow">${icon('arrow-right')}</span></a>
<a class="padi-quick-link" href="${root}/course/index.php?categoryid=2"><span class="padi-icon">${icon('laptop-code')}</span><span><strong>Teknologi informasi</strong><small>Jelajahi kategori TI</small></span><span class="padi-arrow">${icon('arrow-right')}</span></a>
<a class="padi-quick-link" href="${root}/my/courses.php"><span class="padi-icon">${icon('book-open')}</span><span><strong>Pembelajaran saya</strong><small>Lanjutkan kursus yang diikuti</small></span><span class="padi-arrow">${icon('arrow-right')}</span></a>
</div></nav>`;
const intro=`<div class="padi-section-intro"><div><div class="padi-eyebrow">Eksplorasi pembelajaran</div><h2>Ruang belajar, ruang bertumbuh.</h2></div><p>Temukan kategori dan informasi pembelajaran untuk mendukung pengembangan kompetensi Anda.</p></div>`;
const journey=`<section class="padi-journey" aria-labelledby="padi-journey-title"><div class="padi-wrap"><div class="padi-journey-title"><h2 id="padi-journey-title">Mulai langkah belajar Anda.</h2><p>Satu ruang untuk terus mengembangkan diri.</p></div><div class="padi-step-grid">
<div class="padi-step"><div class="padi-step-number">01 / TEMUKAN</div><h3>Pilih ruang belajar</h3><p>Jelajahi kategori dan pilih kursus sesuai kebutuhan pengembangan kompetensi.</p></div>
<div class="padi-step"><div class="padi-step-number">02 / PELAJARI</div><h3>Belajar dengan terarah</h3><p>Masuk menggunakan akun Anda, lalu ikuti materi dan kegiatan yang tersedia pada kursus.</p></div>
<div class="padi-step"><div class="padi-step-number">03 / TERAPKAN</div><h3>Berbagi dan berkontribusi</h3><p>Terapkan pengetahuan dalam pekerjaan dan tumbuhkan budaya belajar bersama.</p></div>
</div></div></section>`;
const topbar=`<div class="padi-topbar"><div class="padi-wrap"><span>BADAN PANGAN NASIONAL · PORTAL PEMBELAJARAN</span><a href="https://badanpangan.go.id/" target="_blank" rel="noopener">Situs Badan Pangan Nasional ${icon('arrow-up-right-from-square')}</a></div></div>`;
const footer=`<footer class="padi-footer"><div class="padi-wrap"><div class="padi-footer-grid"><div><div class="padi-footer-brand">PADI<span style="color:#ecbc33">.</span></div><p>Pangan Akademi Digital Indonesia<br>Ruang pembelajaran dan pengembangan kompetensi Badan Pangan Nasional.</p></div><div><h3>Pembelajaran</h3><a href="${root}/course/index.php">Katalog kursus</a><a href="${root}/my/">Dasbor pembelajaran</a><a href="${root}/my/courses.php">Kursus saya</a></div><div><h3>Tautan institusi</h3><a href="https://badanpangan.go.id/" target="_blank" rel="noopener">Badan Pangan Nasional ${icon('arrow-up-right-from-square')}</a><a href="${root}/admin/tool/dataprivacy/summary.php">Ringkasan retensi data</a></div></div><div class="padi-footer-bottom"><div>PADI · Badan Pangan Nasional</div><div>Belajar. Berkembang. Berkontribusi.</div></div></div></footer>`;
let count=0;
const params=(o)=>Object.entries(o).map(([name,value])=>({name,value}));
function element(type,values){return {id:`padi${++count}`,type,state:1,params:params(values)};}
function section(label,el,className='',fluid=false){
    const id=`padi${++count}`;
    return {id,type:'section',state:1,params:params({title:label,customclass:`padi-shell ${className}`,layout_type:fluid?'no-container':'container',moon_element_tag:'div'}),rows:[{id:`padi${++count}`,type:'row',state:1,fill:true,cols:[{id:`padi${++count}`,type:'column',state:1,size:{xxl:12,xl:12,lg:12,md:12,sm:12,xs:12},params:[],elements:el}]}]};
}
// Moodle's text purifier supports div wrappers, but strips HTML5 layout tags.
const text=(label,content)=>element('text',{title:label,heading:'',content:content.replace(/<(\/?)(section|aside|nav|footer)(?=[\s>])/g,'<$1div')});
const standard=JSON.parse(fs.readFileSync('public/theme/moon/moon/main_layouts/standard.json'));
const all=standard.data.sections.flatMap(s=>s.rows.flatMap(r=>r.cols.flatMap(c=>c.elements)));
const header=all.find(e=>e.type==='header');
const main=all.find(e=>e.type==='main_content');
const commonStart=[section('Identitas institusi',[text('Identitas institusi',topbar)],'',true),section('Navigasi portal',[header])];
const commonEnd=[section('Footer PADI',[text('Footer PADI',footer)],'',true)];
const build=(title,sections,name)=>({title,desc:'Identitas korporat PADI / Badan Pangan Nasional',layout:'standard',thumbnail:'',name,data:{sections,devices:standard.data.devices}});
const front=build('Beranda PADI',[...commonStart,section('Pembuka PADI',[text('Pembuka PADI',hero)],'',true),section('Akses cepat',[text('Akses cepat',quick)],'',true),section('Pengantar katalog',[text('Pengantar katalog',intro)]),section('Konten pembelajaran Moodle',[main],'padi-native'),section('Panduan belajar',[text('Panduan belajar',journey)],'',true),...commonEnd],'frontpage');
front.layout='frontpage';
const appMain=structuredClone(main);
const appPadding=Object.fromEntries(['global','larger_desktop','large_desktop','desktop','tablet','landscape_mobile','mobile'].map(device=>[device,{top:['mobile','landscape_mobile'].includes(device)?'24':'32',right:'0',bottom:['mobile','landscape_mobile'].includes(device)?'32':'48',left:'0',unit:'px',lock:false}]));
for(const [name,value] of Object.entries({padding:JSON.stringify(appPadding),customclass:'padi-app-content'})){
 const param=appMain.params.find(p=>p.name===name);if(param)param.value=value;else appMain.params.push({name,value});
}
const general=build('Halaman Standar PADI',[...commonStart,section('Konten halaman Moodle',[appMain]),...commonEnd],'standard');
fs.writeFileSync('.local/branding/frontpage.json',JSON.stringify(front,null,2));
fs.writeFileSync('.local/branding/standard.json',JSON.stringify(general,null,2));
const originalAdmin=JSON.parse(fs.readFileSync('public/theme/moon/moon/main_layouts/admin.json'));
const adminSections=originalAdmin.data.sections.filter(s=>s.rows.some(r=>r.cols.some(c=>c.elements.some(e=>['menu','main_content'].includes(e.type)))));
for(const s of adminSections) {
    const hasMain=s.rows.some(r=>r.cols.some(c=>c.elements.some(e=>e.type==='main_content')));
    s.params=params({title:hasMain?'Konten administrasi Moodle':'Navigasi administrasi',customclass:`padi-shell ${hasMain?'padi-admin-content':'padi-admin-navigation'}`,layout_type:'container'});
}
const admin=build('Administrasi PADI',[...commonStart,...adminSections,...commonEnd],'admin');
admin.layout='admin';
fs.writeFileSync('.local/branding/admin.json',JSON.stringify(admin,null,2));
const colors=(light)=>JSON.stringify({light,dark:light});
const settings={
 theme_primary:'custom',theme_primary_custom:colors('#1e7816'),theme_secondary:'custom',theme_secondary_custom:colors('#194d14'),
 theme_green:'#1e7816',theme_yellow:'#ecbc33',theme_gray800:'#183127',theme_gray100:'#f5f8f1',
 body_background_color:colors('#ffffff'),body_text_color:colors('#183127'),body_heading_color:colors('#183127'),body_link_color:colors('#1e7816'),body_link_hover_color:colors('#194d14'),
 header_background_color:colors('#ffffff'),main_menu_link_color:colors('#183127'),main_menu_link_hover_color:colors('#1e7816'),main_menu_link_active_color:colors('#1e7816'),
 logo_text:'PADI',logo_type:'text',tag_line:'Pangan Akademi Digital Indonesia',enable_tag_line:'1',
 preloader:'0',backtotop:'1',backtotop_icon_bgcolor:colors('#1e7816'),social_profiles:'[]',
 astroid_color_mode_enable:'0',astroid_color_mode_default:'light',enable_color_mode_transform:'0',
 stickyheader:'static',stickyheadermobile:'static',stickyheadertablet:'static',enable_sticky_menu:'0',
 mobile_logo:`${root}/branding/bapanas/logo-bapanas.png`,default_logo:`${root}/branding/bapanas/logo-bapanas.png`,
 apple_touch_icon:'',favicon:'',preloader_image:'',layout_background_image:'',layout:'standard'
};
for(const prefix of ['body','h1','h2','h3','h4','h5','h6','menu','submenu','secondmenu','custom','logo']) settings[`${prefix}_typography`]='default';
settings.logo_type='image';
settings.default_logo=`${root}/branding/bapanas/logo-padi.svg`;
settings.mobile_logo=settings.default_logo;
settings.default_logo_width='350px';
settings.default_logo_height='64px';
settings.mobile_logo_width='220px';
settings.mobile_logo_height='45px';
settings.body_typography='custom';
settings.body_typography_options=JSON.stringify({font_face:'Arial, Helvetica, sans-serif',alt_font_face:'',font_size:{global:'16'},font_size_unit:{global:'px'},line_height:{global:'1.7'},line_height_unit:{global:'em'},font_weight:'400',text_transform:'none'});
settings.sass_overrides=JSON.stringify([{variable:'border-radius',value:'.4rem'}]);
fs.writeFileSync('.local/branding/settings-new.json',JSON.stringify(settings,null,2));
console.log('Native Moon layouts and settings generated.');
