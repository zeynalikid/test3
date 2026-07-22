import { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { isValidMediaUrl } from '../utils/detectCountry';
import { detectVpnOn } from '../utils/vpn';
import { VideoIcon, AudioIcon, PhotoIcon, PhoneIcon } from '../components/Icons';
import { maskPhone, pickMediaUrl, ManualEmbed } from '../components/MediaCard';
import ServicesSection from '../components/ServicesSection';
import TrustBoxNew from '../components/TrustBoxNew';

// ─── اصلاح ۱۵: MediaSection بهبودیافته — فونت بزرگ‌تر، سه‌نقطه، دکمه «بیشتر» ───
function MediaSection({cfg,T,lang,activeTabId,publicText}:{cfg:any,T:any,lang:string,activeTabId?:string,publicText:(k:string,fb?:string)=>string}){
 const [vpnOn,setVpnOn]=useState(false);
 useEffect(()=>{let alive=true;const mode=cfg.mediaCountryMode||'auto';if(mode==='iran'){setVpnOn(false);return}if(mode==='intl'){setVpnOn(true);return}detectVpnOn().then(v=>{if(alive)setVpnOn(v)}).catch(()=>{if(alive)setVpnOn(false)});return()=>{alive=false}},[cfg.mediaCountryMode]);
 const md=cfg.mediaItems||{videos:[],audios:[],images:[]};
 const legacyReels=useMemo(()=>((cfg.reels||[]).filter((r:any)=>r.url&&isValidMediaUrl(r.url)).map((r:any)=>({...r,aparatUrl:r.url,type:'video',active:r.active!==false}))),[cfg.reels]);
 const videos=(md.videos&&md.videos.length>0?md.videos:legacyReels);
 const pools:any={video:videos,audio:md.audios||[],image:md.images||[]};
 const matchesTag=(x:any)=>!activeTabId||!['height','appetite','mind'].includes(activeTabId)||!x.tags||x.tags.length===0||x.tags.includes(activeTabId);
 const pick=(type:'video'|'audio'|'image')=>(pools[type]||[]).filter((x:any)=>x.active!==false&&(!!String(x.manualCode||'').trim()||(x.youtubeUrl&&isValidMediaUrl(x.youtubeUrl))||(x.aparatUrl&&isValidMediaUrl(x.aparatUrl))||(x.url&&isValidMediaUrl(x.url)))&&matchesTag(x)).sort((a:any,b:any)=>(a.order||0)-(b.order||0));
 const vids=pick('video'),auds=pick('audio'),imgs=pick('image');
 const tabs:{id:string;label:string;icon:React.ReactNode}[]=[
  ...(vids.length?[{id:'video',label:lang==='en'?'Video':'ویدیو',icon:<VideoIcon size={14} color="currentColor"/>}]:[]),
  ...(auds.length?[{id:'audio',label:lang==='en'?'Voice':'ویس',icon:<AudioIcon size={14} color="currentColor"/>}]:[]),
  ...(imgs.length?[{id:'image',label:lang==='en'?'Photo':'عکس',icon:<PhotoIcon size={14} color="currentColor"/>}]:[]),
 ];
 const [mtab,setMtab]=useState('video');
 const [expandedId,setExpandedId]=useState<string|null>(null);
 const scrollRef=useRef<HTMLDivElement|null>(null);
 useEffect(()=>{if(tabs.length&&!tabs.some(t=>t.id===mtab))setMtab(tabs[0].id)},[tabs.map(t=>t.id).join(','),mtab]);
 if(!tabs.length)return null;
 const items=mtab==='video'?vids:mtab==='audio'?auds:imgs;
 const scroll=(dir:number)=>{const el=scrollRef.current;if(!el)return;const cardWidth=mtab==='image'?312:292;el.scrollBy({left:dir*cardWidth,behavior:'smooth'})};
 const ArrowBtn=({dir}:{dir:number})=><button onClick={()=>scroll(dir)} style={{width:32,height:32,borderRadius:'50%',border:`1px solid ${T.brd}`,background:T.card,color:T.acc,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:T.neuOut,fontSize:18,flexShrink:0}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{transform:dir<0?'scaleX(-1)':'none'}}><polyline points="9 18 15 12 9 6"/></svg></button>;
 return <div style={{marginTop:16}}>
  {/* اصلاح ۱۵: عنوان بخش از ترجمه دوزبانه + دکمه‌های اسکرول */}
  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10,margin:'0 0 10px'}}>
   <h3 style={{color:T.ttl,fontSize:16,margin:0,fontWeight:800}}>{publicText('courseMediaTitle','محتوای چندرسانه‌ای')}</h3>
   <div style={{display:'flex',gap:6}}><ArrowBtn dir={-1}/><ArrowBtn dir={1}/></div>
  </div>
  {tabs.length>1&&<div style={{display:'flex',gap:6,marginBottom:10,flexWrap:'wrap'}}>{tabs.map(tab=><button key={tab.id} onClick={()=>setMtab(tab.id)} style={{padding:'7px 13px',borderRadius:18,border:`1px solid ${mtab===tab.id?T.acc:T.brd}`,background:mtab===tab.id?T.soft:T.card,color:mtab===tab.id?T.acc:T.mut,cursor:'pointer',fontFamily:'inherit',fontSize:12,fontWeight:700,transition:'all .3s ease',display:'flex',alignItems:'center',gap:6,boxShadow:mtab===tab.id?'none':T.neuOut}}><span style={{display:'flex',alignItems:'center'}}>{tab.icon}</span><span>{tab.label}</span></button>)}</div>}
  <div ref={scrollRef} style={{display:'flex',gap:12,overflowX:'auto',paddingBottom:8,WebkitOverflowScrolling:'touch',scrollSnapType:'x mandatory'}}>
   {items.map((it:any)=>{
    const hasManual=!!String(it.manualCode||'').trim();
    const url=pickMediaUrl(it,vpnOn);
    const masked=maskPhone(it.phone);
    const desc=String(it.description||'');
    const isLong=desc.length>80;
    const isOpen=expandedId===it.id;
    return <div key={it.id} style={{flex:'0 0 auto',scrollSnapAlign:'start',width:mtab==='video'?280:mtab==='image'?300:260,borderRadius:14,overflow:'hidden',background:T.card,boxShadow:T.neuOut}}>
     {mtab==='video'&&(hasManual?<ManualEmbed code={it.manualCode} type="video"/>:<div style={{position:'relative',width:'100%',paddingTop:'56.25%',background:'#000'}}><iframe src={url} frameBorder="0" sandbox="allow-scripts allow-same-origin allow-presentation" allowFullScreen allow="autoplay; fullscreen; encrypted-media" referrerPolicy="no-referrer" title={it.title||'video'} style={{position:'absolute',inset:0,width:'100%',height:'100%',border:0,display:'block'}}/></div>)}
     {mtab==='audio'&&<div style={{padding:'12px 10px 4px'}}>{hasManual?<ManualEmbed code={it.manualCode} type="audio"/>:<audio controls controlsList="nodownload noplaybackrate" preload="none" src={url} style={{width:'100%'}}/>}</div>}
     {mtab==='image'&&(hasManual?<ManualEmbed code={it.manualCode} type="image" minHeight={400}/>:<img src={url} alt={it.title||''} loading="lazy" draggable={false} onContextMenu={e=>e.preventDefault()} style={{width:300,height:400,objectFit:'cover',display:'block',background:'#000',pointerEvents:'none'}}/>)}
     {(it.title||desc||masked)&&<div style={{padding:'10px 12px'}}>
      {/* اصلاح ۱۵: فونت عنوان بزرگ‌تر (13→14) */}
      {it.title&&<div style={{fontSize:14,color:T.txt,fontWeight:800,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{it.title}</div>}
      {/* اصلاح ۱۵: توضیحات با سه‌نقطه + دکمه «بیشتر» رنگی */}
      {desc&&<div style={{fontSize:12,color:T.mut,lineHeight:1.7,marginTop:3,...(!isOpen&&isLong?{display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical' as any,overflow:'hidden',textOverflow:'ellipsis'}:{})}}>{desc}</div>}
      {isLong&&<button onClick={()=>setExpandedId(isOpen?null:it.id)} style={{border:0,background:'transparent',color:T.acc,cursor:'pointer',fontFamily:'inherit',fontSize:11,fontWeight:700,padding:'2px 0',marginTop:2,display:'flex',alignItems:'center',gap:4}}>{isOpen?(lang==='en'?'Less':'کمتر'):(lang==='en'?'More...':'بیشتر...')}<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.acc} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{transition:'transform .3s ease',transform:isOpen?'rotate(180deg)':'rotate(0deg)'}}><polyline points="6 9 12 15 18 9"/></svg></button>}
      {masked&&<div dir="ltr" style={{marginTop:5,display:'flex',alignItems:'center',gap:4,fontSize:10.5,color:T.acc,fontFamily:'monospace,-apple-system,"Courier New"'}}><PhoneIcon size={11} color={T.acc}/> {masked}</div>}
     </div>}
    </div>})}
  </div>
 </div>;
}

// ─── اصلاح ۲: سوالات متداول زیر تب‌های دوره (فیلتر بر اساس تب فعال) ───
function CourseFAQ({cfg,T,lang,activeTabId,publicText}:{cfg:any,T:any,lang:string,activeTabId?:string,publicText:(k:string,fb?:string)=>string}){
 const tabMap:Record<string,string>={height:'growth',appetite:'appetite',mind:'intelligence'};
 const targetTab=tabMap[activeTabId||'']||activeTabId||'all';
 const allFaqs:any[]=lang==='en'?(cfg.courseTabFaqsEn||cfg.courseTabFaqs||[]):(cfg.courseTabFaqs||[]);
 const faqs=allFaqs.filter((f:any)=>f.active!==false&&(!f.tab||f.tab==='all'||f.tab===targetTab));
 const [openIdx,setOpenIdx]=useState<number|null>(null);
 if(!faqs.length)return null;
 return <div style={{marginTop:18}}>
  <h3 style={{color:T.ttl,fontSize:15,margin:'0 0 10px',fontWeight:800}}>{publicText('courseFAQTitle','سوالات متداول')}</h3>
  {faqs.map((f:any,i:number)=><div key={f.id||i} style={{borderRadius:14,border:`1px solid ${T.brd}`,marginBottom:8,overflow:'hidden'}}>
   <button onClick={()=>setOpenIdx(openIdx===i?null:i)} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 14px',border:0,background:T.card,cursor:'pointer',fontFamily:'inherit',fontSize:14,fontWeight:700,color:T.txt,textAlign:lang==='fa'?'right':'left'}}>
    <span>{f.question}</span>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.mut} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,transition:'transform .3s ease',transform:openIdx===i?'rotate(180deg)':'rotate(0deg)'}}><polyline points="6 9 12 15 18 9"/></svg>
   </button>
   {openIdx===i&&<div style={{padding:'0 14px 14px',fontSize:13,color:T.mut,lineHeight:1.9,borderTop:`1px solid ${T.brd}`,paddingTop:10}}>{f.answer}</div>}
  </div>)}
 </div>;
}

// ─── Main CoursesPage ───
export default function CoursesPage({app}:{app:any}){
 const {cfg,T,S,css,lang,courseTab,setCourseTab,expandedCourse,setExpandedCourse,shipModal,setShipModal,activeTab,placeholder,publicText,trVal,showContactOn,chooseDest,Stepper,Tag,Modal,ContactPanel,Footer,APP_A_URL}=app;
 const mediaRef=useRef<HTMLDivElement|null>(null);
 const consultTopicFor=(tabId:string)=>['height','appetite','mind'].includes(tabId)?tabId:'';
 const goConsultCourse=(e:any)=>{e.stopPropagation();const t=consultTopicFor(activeTab?.id||'');window.location.href=t?`${APP_A_URL}?topic=${t}`:APP_A_URL};
 const courses=(activeTab?.courses||[]).slice().sort((a:any,b:any)=>(a.order||0)-(b.order||0));
 const [showFullInfo,setShowFullInfo]=useState(false);
 const info=activeTab?.detailedInfo;
 const [typedText,setTypedText]=useState('');
 useEffect(()=>{if(!showFullInfo||!info?.fullText){setTypedText('');return}const full=String(info.fullText);let i=0;setTypedText('');const step=Math.max(1,Math.round(full.length/60));const iv=setInterval(()=>{i=Math.min(full.length,i+step);setTypedText(full.slice(0,i));if(i>=full.length)clearInterval(iv)},36);return()=>clearInterval(iv)},[showFullInfo,info?.fullText]);

 // اصلاح ۳: متن سئو — نسخه کوتاه (بالا) + نسخه کامل (پایین)
 const coursesIntro=lang==='en'?(cfg.coursesIntroTextEn||''):(cfg.coursesIntroText||'');
 const coursesSeoFull=lang==='en'?(cfg.coursesSeoFullTextEn||''):(cfg.coursesSeoFullText||'');

 // اصلاح ۴۰-۴۳: مدل نمایش خدمات فقط list/carousel، گرید حذف شد، یکپارچه با پنل مدیریت
 const servicesMode=(cfg.servicesDisplayMode?.courses==='carousel' ? 'carousel' : 'list') as 'list'|'carousel';
 const showServicesOnCourses=cfg.servicesVisibility?.courses!==false;
 const priceText=(price:any)=>price?`${price} ${cfg.currencyUnit||'تومان'}`:'';
 const moreLabel=publicText('moreInfo',lang==='en'?'More':'بیشتر');
 const coursePageSettings = cfg.coursePageSettings || {};
 const showStockOnCourses = coursePageSettings.showStock !== false;
 const showDiscountOnCourses = coursePageSettings.showDiscount !== false;

 return <div className="zk-courses-page" style={{...S.page,overflowX:'hidden'}}>
  <Helmet>
   <title>{'دوره‌های تخصصی رشد و تغذیه کودکان | زینالیکید'}</title>
   <meta name="description" content="دوره‌های تخصصی رشد قد، بهبود اشتها، تقویت هوش و تمرکز کودکان با روش TC و پشتیبانی کامل"/>
   <meta name="keywords" content="دوره رشد قد, دوره بهبود اشتها, دوره تقویت هوش, زینالیکید"/>
  </Helmet>
  <style>{css}{` .zk-courses-page{overflow-x:hidden}.zk-courses-container{width:100%;max-width:900px;margin-inline:auto}.zk-course-tabs{scrollbar-width:thin;overscroll-behavior-inline:contain}.zk-course-list{grid-template-columns:1fr!important}.zk-course-list>div{min-width:0}.zk-course-list button{min-height:44px}@media(min-width:481px){.zk-course-list{grid-template-columns:repeat(2,minmax(0,1fr))!important}}`}</style>
  <div className="zk-courses-container" style={{...S.card,maxWidth:900}}>
   <Stepper step={1}/>
   <div style={{display:'flex',justifyContent:'space-between',gap:10,alignItems:'center',marginBottom:14}}>
    <h2 style={{color:T.ttl,margin:0,fontSize:18,fontWeight:800}}>{lang==='en'?'Courses':'معرفی دوره‌ها'}</h2>
   </div>

   {/* اصلاح ۳: نسخه کوتاه سئو بالا */}
   {cfg.pageContentOrder?.courses?.showIntro!==false&&coursesIntro&&<div style={{marginBottom:16,padding:'12px 16px',background:T.soft,border:`1px solid ${T.brd}`,borderRadius:14,fontSize:13,color:T.mut,lineHeight:1.9,textAlign:'center'}}>{coursesIntro}</div>}

   {/* تب‌ها */}
   <div className="zk-course-tabs" style={{display:'flex',gap:8,overflowX:'auto',paddingBottom:6,marginBottom:16}}>
    {cfg.courseTabs.map((tab:any)=><button type="button" key={tab.id} onClick={()=>{setCourseTab(tab.id);setExpandedCourse(null);setShowFullInfo(false)}} style={{padding:'9px 15px',minHeight:48,borderRadius:14,border:`1px solid ${courseTab===tab.id?T.acc:T.brd}`,background:courseTab===tab.id?T.soft:T.card,color:courseTab===tab.id?T.acc:T.mut,cursor:'pointer',fontFamily:'inherit',fontSize:14,fontWeight:700,whiteSpace:'nowrap',transition:'all .2s ease',boxShadow:courseTab===tab.id?'none':T.neuOut}}>{lang==='en'?(tab.titleEn||tab.title):tab.title}</button>)}
   </div>

   {/* تصویر تب */}
   {activeTab?.showImage!==false&&<div style={{marginBottom:16,borderRadius:18,overflow:'hidden',boxShadow:T.neuOut}}><img src={activeTab?.image||placeholder} style={{width:'100%',height:180,objectFit:'cover',display:'block'}}/></div>}

   {/* لیست دوره‌ها */}
   {activeTab&&!activeTab.active
    ?<div style={{padding:30,textAlign:'center',background:T.card,borderRadius:18,color:T.mut,boxShadow:T.neuIn}}>{activeTab.inactiveMessage}</div>
    :<div className="zk-course-list" style={{display:'grid',gridTemplateColumns:'1fr',gap:10,animation:'fadeSlide .5s ease both'}}>
      {courses.map((cr:any)=>{const ex=expandedCourse===cr.id;
       return <div key={cr.id} className="zk-course-choice-card" style={{background:T.card,border:`1px solid ${T.brd}`,borderRadius:16,padding:14,transition:'all .2s ease',boxShadow:ex?`0 10px 26px ${T.acc}1f, ${T.neuOut}`:T.neuOut,opacity:cr.active?1:.72}}>
        <div onClick={()=>setExpandedCourse(ex?null:cr.id)} style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer'}}>
         <h3 style={{fontSize:16,color:T.ttl,margin:0,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontWeight:700}}>{lang==='en'?(cr.titleEn||cr.title):cr.title}</h3>
         {cr.price&&<b style={{color:T.ok,fontSize:12,whiteSpace:'nowrap'}}>{priceText(cr.price)}</b>}
         {cr.popular&&<Tag x="محبوب"/>}
         <span style={{color:T.acc,fontSize:12,fontWeight:700,padding:'4px 8px',display:'flex',alignItems:'center',gap:4,cursor:'pointer',borderRadius:10,transition:'background .2s ease'}} onMouseEnter={e=>(e.currentTarget.style.background=T.soft)} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
          <span>{moreLabel}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{transition:'transform .3s ease',transform:ex?'rotate(180deg)':'rotate(0deg)'}}><polyline points="6 9 12 15 18 9"/></svg>
         </span>
        </div>
        <div style={{maxHeight:ex?1200:0,opacity:ex?1:0,overflow:'hidden',transition:'max-height .45s ease, opacity .35s ease',marginTop:ex?10:0}}>
         <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:7}}>{cr.bestseller&&<Tag x="پرفروش"/>}{cr.trending&&<Tag x="پرطرفدار"/>}{cr.ageBadge!==false&&<Tag x="۲ تا ۱۷ سال"/>}</div>
         <p style={{fontSize:13,color:T.mut,lineHeight:1.8,margin:0}}>{lang==='en'?(cr.descEn||cr.desc):cr.desc}</p>
         <ul style={{fontSize:12,color:T.txt,lineHeight:1.9,margin:'7px 0 8px',paddingInlineStart:18}}>{(cr.features||[]).map((f:string)=><li key={f}>{f}</li>)}</ul>
         {cr.price&&<b style={{color:T.ok,fontSize:14,display:'block',marginBottom:8}}>{priceText(cr.price)}</b>}{showDiscountOnCourses && cr.discountedPrice ? <div style={{marginBottom:8,display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}><span style={{color:T.acc,fontSize:15,fontWeight:800}}>{Number(cr.discountedPrice).toLocaleString()} {cfg.currencyUnit||'تومان'}</span><span style={{textDecoration:'line-through',color:T.mut,fontSize:11}}>{cr.price}</span><span style={{background:'#EF4444',color:'#fff',padding:'2px 10px',borderRadius:12,fontSize:10,fontWeight:700}}>%{Math.round(((Number(String(cr.price||'0').replace(/[^0-9]/g,'')||0)-(cr.discountedPrice||0))/Math.max(1,Number(String(cr.price||'0').replace(/[^0-9]/g,'')||1))*100))} تخفیف</span></div> : null}
         {cr.active
          ?<div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <button style={{...S.btnGhost,flex:1,minWidth:140,padding:'12px 8px',fontSize:13,color:T.acc}} onClick={goConsultCourse}>{lang==='en'?'Consultation for this course ':'مشاوره برای این دوره '}<span style={{fontSize:10.5,color:T.mut,fontWeight:700}}>{lang==='en'?'(free consultation)':'(مشاوره رایگان)'}</span></button>
            <button style={{...S.btn,flex:1,minWidth:140,padding:'12px 8px',fontSize:13}} onClick={(e:any)=>{e.stopPropagation();setShipModal(cr)}}>{cr.btnText||publicText('registerCourseDirect','ثبت مستقیم این دوره')}</button>
           </div>
          :<><div style={{marginBottom:6}}>{showStockOnCourses && typeof cr.stock === 'number' ? <span style={{fontSize:11,fontWeight:700,color:cr.stock>0?'#22C55E':'#EF4444'}}>{cr.stock>0 ? `${cr.stock} عدد باقی مانده` : 'ناموجود'}</span> : null}</div><div style={{padding:12,borderRadius:11,background:`${T.err}12`,color:T.err,textAlign:'center',fontSize:13}}>{cr.inactiveMessage||'اتمام موجودی'}</div></>
         }
        </div>
       </div>})}
     </div>
   }

   {/* باکس جملات اعتمادساز جدید — بعد از آخرین دوره، قبل از اطلاعات بیشتر */}
   {(cfg.trustBoxes?.enabled !== false && cfg.trustBoxes?.tabs?.[activeTab?.id]?.enabled !== false) && (() => {
     const tabMap: Record<string, string> = {height: 'height', appetite: 'appetite', mind: 'mind'};
     const catId = tabMap[activeTab?.id || ''] || 'height';
     const tabConfig = cfg.trustBoxes?.tabs?.[activeTab?.id];
     return <div style={{width:'100%',marginTop:16,marginBottom:10}}>
      <TrustBoxNew
       sentences={cfg.trustBoxes?.sentences?.[catId] || []}
       interval={tabConfig?.interval || cfg.trustBoxes?.defaultInterval || 8}
       T={T}
       design={cfg.designSystem?.sections?.public?.design || 'wellness'}
      />
     </div>;
   })()}

   {/* اطلاعات بیشتر تب */}
   {(info?.summary||info?.fullText)&&<div style={{marginTop:14,padding:'4px 2px',textAlign:'center'}}>
    <b style={{display:'block',fontSize:13,color:T.ttl,marginBottom:6}}>{lang==='en'?'More information':'اطلاعات بیشتر'}</b>
    {!showFullInfo&&info?.summary&&<p style={{fontSize:13,color:T.txt,fontWeight:700,lineHeight:1.9,margin:0,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical' as any,overflow:'hidden',textOverflow:'ellipsis'}}>{info.summary}…</p>}
    {info?.fullText&&<>
     {showFullInfo&&<p key={String(courseTab)} style={{fontSize:12,color:T.mut,lineHeight:1.9,margin:'6px 0 0',whiteSpace:'pre-wrap',minHeight:36,animation:'fadeSlide .65s ease both'}}>{typedText}<span style={{opacity:typedText.length<info.fullText.length?1:0,color:T.acc}}>▌</span></p>}
     <div style={{display:'flex',justifyContent:'center'}}>
      <button onClick={()=>setShowFullInfo(v=>!v)} style={{marginTop:8,padding:'6px 16px',borderRadius:18,border:0,background:'transparent',color:T.acc,cursor:'pointer',fontFamily:'inherit',fontSize:12,fontWeight:700,transition:'all 0.3s ease',display:'flex',alignItems:'center',gap:4}}>
       {/* اصلاح ۹: عنوان «اطلاعات بیشتر» در حالت باز نیز حفظ می‌شود */}
       <span>{moreLabel}</span>
       <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{transition:'transform .3s ease',transform:showFullInfo?'rotate(180deg)':'rotate(0deg)'}}><polyline points="6 9 12 15 18 9"/></svg>
      </button>
     </div>
    </>}
   </div>}

   {/* اصلاح ۱۵: محتوای چندرسانه‌ای بهبودیافته */}
   <div ref={mediaRef}><MediaSection cfg={cfg} T={T} lang={lang} activeTabId={activeTab?.id} publicText={publicText}/></div>

   {/* اصلاح ۲: سوالات متداول مرتبط با تب فعال */}
   <CourseFAQ cfg={cfg} T={T} lang={lang} activeTabId={activeTab?.id} publicText={publicText}/>

   {/* اصلاح ۵: بخش خدمات */}
   {showServicesOnCourses&&<div style={{marginTop:18}}>
    <h3 style={{color:T.ttl,fontSize:15,margin:'0 0 10px',fontWeight:800}}>{publicText('ourServicesTitle','خدمات ما')}</h3>
    <ServicesSection T={T} lang={lang} publicText={publicText} mode={servicesMode} listItems={cfg.listSettings?.items||[]} carouselSettings={cfg.carouselSettings||{columns:2,autoScrollInterval:8,autoScrollEnabled:true,pauseOnSwipe:3,columnsData:[]}}/>
   </div>}

   {/* اصلاح ۳: نسخه کامل سئو (بین سوالات متداول و ارتباط با ما) با heading برای سئو */}
   {coursesSeoFull&&<section style={{marginTop:18,padding:'14px 18px',background:T.soft,border:`1px solid ${T.brd}`,borderRadius:14}}>
    <h2 style={{fontSize:15,color:T.ttl,margin:'0 0 8px',fontWeight:800}}>{publicText('coursesSeoFullTitle','درباره دوره‌های زینالیکید')}</h2>
    <p style={{fontSize:12,color:T.mut,lineHeight:2,margin:0}}>{coursesSeoFull}</p>
   </section>}

   {/* ارتباط با ما + فوتر */}
   {showContactOn('courses')&&<ContactPanel cfg={cfg} T={T} lang={lang}/>}
   <Footer cfg={cfg} T={T} lang={lang}/>
  </div>

  {/* Modal مقصد ارسال */}
  {shipModal&&<Modal T={T} onClose={()=>setShipModal(null)} closeLabel={publicText('close','بستن')}>
   <h3 style={{color:T.ttl,marginTop:0}}>{publicText('chooseDest','لطفاً مقصد ارسال را انتخاب کنید.')}</h3>
   <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
    <button style={S.btn} onClick={()=>chooseDest('iran',shipModal)}>{publicText('sendIran','ارسال برای ایران')}</button>
    <button style={S.btnGhost} onClick={()=>chooseDest('intl',shipModal)}>{publicText('sendIntl','ارسال برای خارج از ایران')}</button>
   </div>
  </Modal>}
 </div>;
}
