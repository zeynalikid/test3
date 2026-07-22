import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ConsultIcon, CoursesIcon, VideoIcon, LicensesIcon, ContactIcon } from '../components/Icons';
import ServicesSection from '../components/ServicesSection';
import FeaturedCourses from '../components/FeaturedCourses';
import TaggedCoursesSection from '../components/TaggedCoursesSection';
import HeroSection from '../components/HeroSection';
import TrustBoxWithImage from '../components/TrustBoxWithImage';
import TrustBoxNew from '../components/TrustBoxNew';

export default function HomePage({app}:{app:any}){
 const {cfg,T,css,lang,setView,APP_A_URL,publicText,Footer,showContactOn,ContactPanel}=app;
 const isRtl=lang==='fa';
 const servicesMode=(cfg.servicesDisplayMode?.home==='carousel'?'carousel':'list') as 'list'|'carousel';
 const shortcutsBase:Record<string,{icon:React.ReactNode;title:string;desc:string;to?:string;fn?:()=>void}>={
  consult:{icon:<ConsultIcon size={24} color={T.acc}/>,title:lang==='en'?'Request consultation':'ثبت درخواست مشاوره',desc:lang==='en'?'A clear first step for your child':'قدم اول برای شناخت بهتر شرایط فرزند',fn:()=>{window.location.href=APP_A_URL}},
  courses:{icon:<CoursesIcon size={24} color={T.acc}/>,title:publicText('menuCourses','معرفی دوره‌ها'),desc:lang==='en'?'View available courses':'مشاهده و ثبت‌نام دوره‌ها',to:'/courses'},
  experience:{icon:<VideoIcon size={24} color={T.acc}/>,title:lang==='en'?"Parents' experience":'تجربه والدین',desc:lang==='en'?'Stories and answers for parents':'تجربه‌ها و پاسخ‌های والدین',to:'/experience'},
  licenses:{icon:<LicensesIcon size={24} color={T.acc}/>,title:publicText('menuLicenses','مجوزها'),desc:lang==='en'?'Documents and information':'اطلاعات و مستندات مجموعه',to:'/licenses'},
  contact:{icon:<ContactIcon size={24} color={T.acc}/>,title:publicText('menuContact','ارتباط با ما'),desc:lang==='en'?'Contact the support team':'ارتباط با تیم پشتیبانی',to:'/contact'},
 };
 const homeLayout=(cfg.homeLayout&&cfg.homeLayout.length?cfg.homeLayout:[{id:'consult',show:true},{id:'courses',show:true},{id:'experience',show:true},{id:'licenses',show:true},{id:'contact',show:true}]);
 const shortcuts=homeLayout.filter((x:any)=>x.show!==false&&shortcutsBase[x.id]).map((x:any)=>shortcutsBase[x.id]);
 const heroImage=cfg.images?.hero||{}; const trustBoxImage=cfg.images?.trustBox||{};
 const allCourses:any[]=[];(cfg.courseTabs||[]).forEach((tab:any)=>(tab.courses||[]).forEach((c:any)=>{if(c.active!==false)allCourses.push({...c,tabId:tab.id})}));
 const fc=cfg.featuredCourses||{}; const featuredCourseIds=Array.isArray(fc.courseIds)?fc.courseIds:[];
 const selectedCourses=featuredCourseIds.length>0?allCourses.filter(c=>featuredCourseIds.includes(c.id)):allCourses.slice(0,3); const heroId=fc.heroCourseId||selectedCourses[0]?.id;
 return <main className="zk-home-page" dir={isRtl?'rtl':'ltr'} style={{...app.S?.page,paddingBottom:92,flexDirection:'column',alignItems:'center',background:T.bg,color:T.txt,overflowX:'hidden'}}>
  <Helmet><title>زینالیکید | مشاوره رشد قد و تغذیه کودک و نوجوان</title><meta name="description" content="مشاوره و آموزش والدین درباره رشد، تغذیه، اشتها، قد، وزن و تمرکز کودک و نوجوان."/><meta name="keywords" content="رشد قد کودک, تغذیه کودک, بی‌اشتهایی کودک, بدغذایی, مشاوره رشد کودک"/><meta property="og:title" content="زینالیکید | رشد و تغذیه کودک و نوجوان"/><meta property="og:description" content="مسیر آرام‌تر و آگاهانه‌تر برای همراهی با رشد و تغذیه فرزند شما"/></Helmet>
  <style>{css}{` .zk-home-page{width:100%;}.zk-home-container{width:100%;max-width:680px;margin-inline:auto;padding-inline:16px}.zk-home-section{width:100%;margin-top:26px}.zk-home-section-title{font-size:20px;color:var(--zk-text-primary);margin:0 0 12px;font-weight:800}.zk-home-section-heading{display:flex;align-items:end;justify-content:space-between;gap:10px;margin-bottom:12px}.zk-home-section-link{color:var(--zk-action-primary);font-size:13px;font-weight:700;text-decoration:none;white-space:nowrap}@media(min-width:481px){.zk-home-container{padding-inline:20px}}`}</style>
  <div className="zk-home-container" style={{paddingTop:8}}>
   <section className="zk-home-specialist-note" style={{display:'flex',flexDirection:isRtl?'row-reverse':'row',alignItems:'center',gap:12,marginBottom:14,padding:'12px 14px',background:T.card,border:`1px solid ${T.brd}`,borderRadius:16,boxShadow:T.neuOut}}>
    {cfg.showSpecialistPhoto&&<img src={cfg.photoUrl} alt={cfg.specialistName||'کارشناس زینالیکید'} style={{width:56,height:56,objectFit:'cover',borderRadius:'50%',border:`2px solid ${T.brd}`,flexShrink:0}}/>}
    <div style={{minWidth:0,textAlign:isRtl?'right':'left'}}><strong style={{display:'block',fontSize:14,color:T.ttl,lineHeight:1.7,overflowWrap:'anywhere'}}>{(cfg.siteTitle||'زینالیکید')+' - '+(lang==='en'?(cfg.specialistTitleEn||cfg.specialistName||'Child growth and nutrition specialist'):(cfg.specialistTitle||cfg.specialistName||'کارشناس رشد و تغذیه کودک و نوجوان'))}</strong><span style={{fontSize:12,color:T.mut,lineHeight:1.7}}>{lang==='en'?'Support for a more informed parenting path':'همراهی آگاهانه‌تر برای مسیر رشد فرزند شما'}</span></div>
   </section>

   {heroImage.enabled!==false&&<HeroSection title={lang==='en'?(cfg.heroTitleEn||cfg.heroTitle||'A clearer path for your child’s growth'):(cfg.heroTitle||'مسیر روشن‌تری برای رشد فرزند شما')} subtitle={lang==='en'?(cfg.heroSubtitleEn||cfg.heroSubtitle||'Understand growth, nutrition and daily needs with calm, expert guidance.'):(cfg.heroSubtitle||'با شناخت بهتر رشد، تغذیه و نیازهای روزانه، آگاهانه‌تر کنار فرزندتان باشید.')} imageUrl={heroImage.url||'/images/hero-default.jpg'} imageAlt={heroImage.alt||'کودک شاد و سالم'} ctaText={lang==='en'?'Request consultation':'ثبت درخواست مشاوره'} ctaLink={APP_A_URL} secondaryCtaText={lang==='en'?'View courses':'مشاهده دوره‌ها'} secondaryCtaLink="/courses" T={T} lang={lang}/>}

   {trustBoxImage.enabled!==false&&cfg.trustMessages?.health?.length>0&&<section className="zk-home-section" style={{marginTop:0}}><TrustBoxWithImage text={cfg.trustMessages.health[0]?.title||''} imageUrl={trustBoxImage.url||'/images/trust-default.jpg'} imageAlt={trustBoxImage.alt||'مادر و کودک'} imagePosition={isRtl?'right':'left'} T={T}/></section>}

   {shortcuts.length>0&&<section className="zk-home-section" aria-label={lang==='en'?'Quick access':'دسترسی سریع'}><div className="zk-home-section-heading"><h2 className="zk-home-section-title" style={{margin:0}}>{lang==='en'?'Quick access':'دسترسی سریع'}</h2></div><div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:10}}>{shortcuts.map((item:any,i:number)=>{const Comp:any=item.to?Link:'button';const props=item.to?{to:item.to}:{onClick:item.fn,type:'button'};const wide=shortcuts.length%2===1&&i===shortcuts.length-1;return <Comp key={item.title} {...props} style={{gridColumn:wide?'1/-1':undefined,display:'flex',alignItems:'center',gap:10,minHeight:78,padding:'11px 12px',background:T.card,border:`1px solid ${T.brd}`,borderRadius:16,boxShadow:T.neuOut,color:T.txt,textDecoration:'none',fontFamily:'inherit',textAlign:isRtl?'right':'left',cursor:'pointer'}}><span style={{display:'flex',alignItems:'center',justifyContent:'center',width:42,height:42,borderRadius:12,background:T.soft,flexShrink:0}}>{item.icon}</span><span style={{minWidth:0}}><strong style={{display:'block',fontSize:12.5,lineHeight:1.6}}>{item.title}</strong><small style={{display:'block',fontSize:10.5,color:T.mut,lineHeight:1.6}}>{item.desc}</small></span></Comp>})}</div></section>}

   {cfg.trustBoxes?.enabled!==false&&cfg.trustBoxes?.home?.enabled!==false&&<section className="zk-home-section"><TrustBoxNew sentences={cfg.trustBoxes?.sentences?.health||[]} interval={cfg.trustBoxes?.home?.interval||cfg.trustBoxes?.defaultInterval||8} T={T} design="classic"/></section>}

   {fc.enabled!==false&&selectedCourses.length>0&&<section className="zk-home-section"><div className="zk-home-section-heading"><h2 className="zk-home-section-title">{lang==='en'?(fc.titleEn||'Featured courses'):(fc.title||'دوره‌های منتخب')}</h2><Link className="zk-home-section-link" to="/courses">{lang==='en'?'View all':'مشاهده همه'}</Link></div><FeaturedCourses courses={selectedCourses} heroCourseId={heroId} title="" T={T} lang={lang} showStock={fc.showStock!==false} showDiscount={fc.showDiscount!==false}/></section>}

   {cfg.servicesVisibility?.home!==false&&<section className="zk-home-section"><div className="zk-home-section-heading"><h2 className="zk-home-section-title">{publicText('ourServicesTitle','خدمات ما')}</h2></div><ServicesSection T={T} lang={lang} publicText={publicText} mode={servicesMode} listItems={cfg.listSettings?.items||[]} carouselSettings={cfg.carouselSettings||{columns:2,autoScrollInterval:8,autoScrollEnabled:true,pauseOnSwipe:3,columnsData:[]}}/></section>}

   {cfg.taggedCourses?.enabled!==false&&<section className="zk-home-section"><TaggedCoursesSection courses={(cfg.courseTabs||[]).flatMap((tab:any)=>(tab.courses||[]).map((c:any)=>({...c,tabId:tab.id})))} title={cfg.taggedCourses?.title||'پرفروش‌ترین دوره‌ها'} titleEn={cfg.taggedCourses?.titleEn||'Popular courses'} tags={cfg.taggedCourses?.tags||['پرفروش','پرطرفدار','محبوب']} maxCourses={cfg.taggedCourses?.maxCourses||6} lang={lang} T={T}/></section>}

   <section className="zk-home-section"><div className="zk-home-section-heading"><h2 className="zk-home-section-title">{lang==='en'?'For parents':'برای والدین'}</h2><Link className="zk-home-section-link" to="/education">{lang==='en'?'Explore education':'مشاهده آموزش‌ها'}</Link></div><div style={{padding:'15px 16px',borderRadius:16,background:T.soft,border:`1px solid ${T.brd}`,color:T.txt,fontSize:13,lineHeight:1.9}}>{lang==='en'?'Articles, videos and podcasts to answer parents’ questions about growth, nutrition, appetite and focus.':'مقاله‌ها، ویدیوها و پادکست‌هایی برای پاسخ به پرسش‌های والدین درباره رشد، تغذیه، اشتها و تمرکز.'}</div></section>

   {cfg.pageContentOrder?.home?.order==='contactFirst'
    ? <>{showContactOn('home')&&<section className="zk-home-section"><ContactPanel cfg={cfg} T={T} lang={lang}/></section>}{cfg.pageContentOrder?.home?.showIntro!==false&&<FAQSection app={app}/>}</>
    : <>{cfg.pageContentOrder?.home?.showIntro!==false&&<FAQSection app={app}/>} {showContactOn('home')&&<section className="zk-home-section"><ContactPanel cfg={cfg} T={T} lang={lang}/></section>}</>}
   <Footer cfg={cfg} T={T} lang={lang} setView={setView}/>
  </div>
 </main>;
}

function FAQSection({app}:{app:any}){
 const {cfg,T,lang,setView}=app; const [openIndex,setOpenIndex]=useState<number|null>(null); const items=(lang==='fa'?cfg.faqItems:cfg.faqItemsEn)||[]; if(cfg.faqDisplay?.home?.show===false||!items.length)return null; const maxItems=cfg.faqDisplay?.home?.maxItems||4; const shown=items.slice(0,maxItems);
 return <section className="zk-home-section"><div className="zk-home-section-heading"><h2 className="zk-home-section-title">{lang==='fa'?'سوالات متداول':'Frequently asked questions'}</h2><Link className="zk-home-section-link" to="/faq">{lang==='fa'?'همه سوالات':'All questions'}</Link></div><div style={{display:'flex',flexDirection:'column',gap:8}}>{shown.map((item:any,index:number)=><div key={item.id||index} style={{background:T.card,border:`1px solid ${T.brd}`,borderRadius:14,overflow:'hidden'}}><button type="button" onClick={()=>setOpenIndex(openIndex===index?null:index)} aria-expanded={openIndex===index} style={{width:'100%',minHeight:52,padding:'12px 14px',background:'transparent',border:0,cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:'inherit',fontSize:13,fontWeight:700,color:T.txt,textAlign:'start'}}><span style={{minWidth:0}}>{item.question}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.acc} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,marginInlineStart:10,transition:'transform .2s ease',transform:openIndex===index?'rotate(180deg)':'none'}}><polyline points="6 9 12 15 18 9"/></svg></button>{openIndex===index&&<div style={{padding:'0 14px 14px',fontSize:12.5,color:T.mut,lineHeight:1.9,borderTop:`1px solid ${T.brd}`,paddingTop:10}}>{item.answer}</div>}</div>)}</div>{cfg.faqDisplay?.home?.viewAllLink!==false&&items.length>maxItems&&<button type="button" onClick={()=>setView('faq')} style={{display:'block',margin:'12px auto 0',minHeight:44,padding:'9px 18px',borderRadius:12,border:`1px solid ${T.brd}`,background:T.soft,color:T.acc,cursor:'pointer',fontFamily:'inherit',fontSize:13,fontWeight:700}}>{lang==='fa'?'مشاهده همه سوالات':'View all questions'}</button>}</section>;
}
