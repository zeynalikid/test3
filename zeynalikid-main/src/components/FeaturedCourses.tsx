/**
 * FeaturedCourses — بخش دوره‌های ویژه در صفحه اصلی
 *
 * نمایش یک دوره اصلی (Hero) به‌صورت بزرگ و دوره‌های دیگر کوچک‌تر.
 * با کلیک روی هر دوره، کاربر به صفحه معرفی دوره‌ها هدایت می‌شود.
 *
 * امکانات جدید:
 * - قیمت تخفیفی + درصد تخفیف خودکار
 * - نمایش موجودی با قابلیت فعال/غیرفعال از پنل
 * - تگ با override مستقل در بخش پرطرفدارترین‌ها
 */

import CourseCard from './CourseCard';

interface FeaturedCourse {
  id: string;
  tabId: string;
  title: string;
  titleEn?: string;
  desc?: string;
  descEn?: string;
  image?: string;
  price?: string;
  priceNum?: number;
  discountedPrice?: number;
  showDiscount?: boolean;
  stock?: number;
  showStock?: boolean;
  tagOverride?: string;
  popular?: boolean;
  bestseller?: boolean;
  trending?: boolean;
  ageBadge?: boolean;
  features?: string[];
}

interface FeaturedCoursesProps {
  courses: FeaturedCourse[];
  heroCourseId: string;
  title: string;
  T: any;
  lang: string;
  showStock?: boolean;
  showDiscount?: boolean;
}

export default function FeaturedCourses({
  courses,
  heroCourseId,
  title,
  T,
  lang,
  showStock = true,
  showDiscount = true,
}: FeaturedCoursesProps) {
  if (!courses || courses.length === 0) return null;

  const heroCourse = courses.find(c => c.id === heroCourseId) || courses[0];
  const otherCourses = courses.filter(c => c.id !== heroCourseId);

  return (
    <section style={{ marginTop: 26, width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, gap: 8 }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: T.ttl, margin: 0, textAlign: 'center' }}>{title}</h2>
        <span style={{ fontSize: 10, background: T.acc, color: '#fff', padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>
          {lang === 'en' ? 'Featured' : 'منتخب'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, minHeight: 220 }}>
        {/* دوره اصلی (بزرگ‌تر - ستون بزرگتر) */}
        <div className="hero-course-wrapper">
          <CourseCard
            course={heroCourse}
            size="hero"
            showStock={showStock}
            showDiscount={showDiscount}
            onTagOverride={heroCourse.tagOverride}
            T={T}
            lang={lang}
          />
        </div>

        {/* دوره‌های کوچک‌تر */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {otherCourses.slice(0, 2).map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              size="normal"
              showStock={showStock}
              showDiscount={showDiscount}
              onTagOverride={course.tagOverride}
              T={T}
              lang={lang}
            />
          ))}
        </div>
      </div>

      {/* استایل واکنش‌گرا برای موبایل */}
      <style>{`
        @media (max-width: 768px) {
          .hero-course-wrapper .course-card.hero .course-content h3 { font-size: 1.4rem; }
        }
      `}</style>
    </section>
  );
}
