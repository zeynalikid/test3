import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  T: any;
  lang: 'fa' | 'en';
}

const HeroSection: React.FC<HeroSectionProps> = ({title,subtitle,imageUrl,imageAlt,ctaText,ctaLink,secondaryCtaText,secondaryCtaLink,T,lang}) => {
  const navigate = useNavigate();
  const go=(link?:string)=>{if(!link)return;if(link.startsWith('/'))navigate(link);else window.location.href=link};
  const isRtl=lang==='fa';
  return <section className="hero-section zk-home-hero" dir={isRtl?'rtl':'ltr'} style={{display:'flex',alignItems:'center',gap:20,padding:'22px 18px',background:T.card,borderRadius:20,boxShadow:T.neuOut,border:`1px solid ${T.brd}`,marginBottom:16,overflow:'hidden'}}>
    <div className="hero-content" style={{flex:1,minWidth:0,textAlign:isRtl?'right':'left'}}>
      <p style={{fontSize:12,color:T.acc,fontWeight:700,margin:'0 0 8px'}}>{isRtl?'همراه والدین در مسیر رشد':'A calmer path for parents'}</p>
      <h1 className="hero-title" style={{fontSize:'clamp(1.55rem,6vw,2.35rem)',fontWeight:800,color:T.ttl,margin:'0 0 9px',lineHeight:1.45,overflowWrap:'anywhere'}}>{title}</h1>
      <p className="hero-subtitle" style={{fontSize:'clamp(.95rem,3.5vw,1.08rem)',color:T.mut,margin:'0 0 16px',lineHeight:1.9}}>{subtitle}</p>
      <div style={{display:'flex',flexWrap:'wrap',gap:9,alignItems:'center'}}>
        {ctaText&&<button type="button" className="hero-cta" onClick={()=>go(ctaLink)} style={{background:T.acc,color:'#fff',border:'none',minHeight:48,padding:'11px 20px',borderRadius:14,fontWeight:700,fontSize:15,cursor:'pointer',fontFamily:'inherit',boxShadow:`0 5px 16px ${T.acc}33`,transition:'transform .2s ease,background .2s ease'}}>{ctaText}</button>}
        {secondaryCtaText&&<button type="button" onClick={()=>go(secondaryCtaLink)} style={{background:T.soft,color:T.acc,border:`1px solid ${T.brd}`,minHeight:48,padding:'10px 17px',borderRadius:14,fontWeight:700,fontSize:14,cursor:'pointer',fontFamily:'inherit'}}>{secondaryCtaText}</button>}
      </div>
    </div>
    <div className="hero-image" style={{flex:'0 0 38%',maxWidth:270,minWidth:108,order:isRtl?0:1}}>
      <img src={imageUrl} alt={imageAlt} loading="eager" style={{display:'block',width:'100%',height:'auto',borderRadius:16,objectFit:'cover',boxShadow:T.neuOut,aspectRatio:'4/3'}} onError={(e)=>{const target=e.currentTarget;if(target.src!=='/images/hero-default.jpg')target.src='/images/hero-default.jpg'}}/>
    </div>
    <style>{`@media (max-width:480px){.zk-home-hero{flex-direction:column-reverse!important;align-items:stretch!important;padding:18px 16px!important;gap:14px!important}.zk-home-hero .hero-image{order:0!important;max-width:none!important;width:100%!important}.zk-home-hero .hero-image img{aspect-ratio:16/9!important}.zk-home-hero .hero-content{text-align:center!important}.zk-home-hero .hero-content>div{justify-content:center}.zk-home-hero .hero-title{font-size:clamp(1.45rem,8vw,2rem)!important}}`}</style>
  </section>;
};
export default HeroSection;
