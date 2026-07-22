import { useNavigate } from 'react-router-dom';

interface CourseType {
  id:string; title:string; titleEn?:string; desc?:string; descEn?:string; image?:string; price?:string; priceNum?:number; discountedPrice?:number; showDiscount?:boolean; tags?:string[]; tagOverride?:string; stock?:number; showStock?:boolean; popular?:boolean; bestseller?:boolean; trending?:boolean; ageBadge?:boolean; features?:string[]; rating?:number; students?:number; duration?:string; tabId?:string; active?:boolean;
}
interface CourseCardProps { course:CourseType; size?:'hero'|'normal'|'small'; showStock?:boolean; showDiscount?:boolean; onTagOverride?:string; onCourseClick?:(course:CourseType)=>void; T?:any; lang?:string; }
const FALLBACK_IMAGE='/images/course-default.jpg';

export default function CourseCard({course,size='normal',showStock=true,showDiscount=true,onTagOverride,onCourseClick,T,lang='fa'}:CourseCardProps){
 const navigate=useNavigate(); const isHero=size==='hero'; const isSmall=size==='small';
 const priceNum=course.priceNum||Number(String(course.price||'').replace(/[^0-9]/g,''))||0;
 const discountedPrice=course.discountedPrice||0;
 const discountPercent=discountedPrice&&priceNum>0?Math.round(((priceNum-discountedPrice)/priceNum)*100):0;
 const hasDiscount=showDiscount&&discountedPrice>0&&discountPercent>0;
 const getTag=()=>{if(onTagOverride)return{label:onTagOverride,color:'#B83A3A'};if(course.bestseller)return{label:lang==='en'?'Best seller':'پرفروش‌ترین',color:'#B83A3A'};if(course.popular)return{label:lang==='en'?'Popular':'محبوب',color:'#B56A08'};if(course.trending)return{label:lang==='en'?'Trending':'پرطرفدار',color:'#218653'};return null};
 const tag=getTag();
 const handleClick=()=>{if(onCourseClick)onCourseClick(course);else if(course.tabId)navigate('/courses',{state:{tabId:course.tabId,courseId:course.id}});else navigate('/courses')};
 const stockValue=typeof course.stock==='number'?course.stock:-1;
 const imageStyle={width:'100%',height:'100%',objectFit:(isSmall?'cover':'contain') as any,display:'block',background:T?.surfacePage||T?.inp||'#f7f9fc'};
 return <article className={`zk-course-card zk-course-card--${size}`} onClick={handleClick} style={{background:T?.card||'#fff',border:`1px solid ${T?.brd||'#d9e2ea'}`,borderRadius:isHero?20:16,overflow:'hidden',boxShadow:T?.neuOut||'0 4px 15px rgba(15,38,60,.06)',color:T?.txt||'#17202b',cursor:'pointer',display:isSmall?'flex':'block',minWidth:0,transition:'box-shadow .2s ease, transform .2s ease'}}>
  <div className="zk-course-card__media" style={{position:'relative',height:isSmall?80:isHero?190:148,background:T?.soft||'#f7f9fc',flex:isSmall?'0 0 96px':undefined}}><img src={course.image||FALLBACK_IMAGE} alt={lang==='en'?(course.titleEn||course.title):course.title} loading="lazy" style={imageStyle} onError={(e:any)=>{if(e.currentTarget.src!==FALLBACK_IMAGE)e.currentTarget.src=FALLBACK_IMAGE}}/>{tag&&<span style={{position:'absolute',top:8,insetInlineStart:8,background:tag.color,color:'#fff',padding:'4px 9px',borderRadius:999,fontSize:10,fontWeight:700}}>{tag.label}</span>}</div>
  <div className="zk-course-card__body" style={{padding:isHero?'15px 14px':isSmall?'10px 11px':'13px 12px',minWidth:0}}>
   <h3 style={{fontSize:isHero?17:isSmall?12:14,fontWeight:800,color:T?.ttl||T?.txt||'#17202b',margin:'0 0 6px',lineHeight:1.55,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:isSmall?'nowrap':undefined}}>{lang==='en'?(course.titleEn||course.title):course.title}</h3>
   {isHero&&course.desc&&<p style={{fontSize:12,color:T?.mut||'#6b7b8a',lineHeight:1.75,margin:'0 0 9px'}}>{lang==='en'?(course.descEn||course.desc):course.desc}</p>}
   {!isSmall&&<div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:7}}>{course.ageBadge!==false&&<span style={{fontSize:10,padding:'3px 8px',borderRadius:999,background:T?.soft||'#e7f2fc',color:T?.acc||'#1769c2'}}>{lang==='en'?'2 to 17 years':'۲ تا ۱۷ سال'}</span>}{course.duration&&<span style={{fontSize:10,padding:'3px 8px',borderRadius:999,background:T?.soft||'#e7f2fc',color:T?.mut||'#6b7b8a'}}>{course.duration}</span>}</div>}
   <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap',marginBottom:isSmall?0:6}}>{hasDiscount?<><span style={{color:T?.acc||'#1769c2',fontWeight:800,fontSize:isHero?18:isSmall?11:14}}>{discountedPrice.toLocaleString()} {lang==='en'?'T':'تومان'}</span><span style={{textDecoration:'line-through',color:T?.mut||'#6b7b8a',fontSize:isHero?12:isSmall?9:11}}>{priceNum.toLocaleString()} {lang==='en'?'T':'تومان'}</span><span style={{background:T?.err||'#b83a3a',color:'#fff',padding:'3px 7px',borderRadius:999,fontSize:10,fontWeight:700}}>%{discountPercent} {lang==='en'?'off':'تخفیف'}</span></>:course.price&&<span style={{color:T?.acc||'#1769c2',fontWeight:800,fontSize:isHero?14:isSmall?11:12}}>{course.price} {lang==='en'?'Toman':'تومان'}</span>}</div>
   {!isSmall&&showStock&&stockValue>=0&&<div style={{margin:'4px 0 7px',fontSize:11,fontWeight:700,color:stockValue>0?(T?.ok||'#218653'):(T?.err||'#b83a3a')}}><span aria-hidden="true" style={{display:'inline-block',width:7,height:7,borderRadius:'50%',background:'currentColor',marginInlineEnd:5}}/>{stockValue>0?(lang==='en'?`${stockValue} left`:`${stockValue} عدد باقی مانده`):(lang==='en'?'Sold out':'ناموجود')}</div>}
   {!isSmall&&<div style={{background:T?.acc||'#1769c2',color:'#fff',minHeight:44,padding:'9px 14px',borderRadius:12,fontSize:12,fontWeight:700,textAlign:'center',display:'flex',alignItems:'center',justifyContent:'center'}}>{lang==='en'?'View course':'مشاهده دوره'}</div>}
  </div>
 </article>;
}
