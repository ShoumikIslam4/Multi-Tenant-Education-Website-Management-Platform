import React from 'react';
import { useLanguage } from '../../context/LanguageContext.js';
import { PageSection } from '../../types/index.js';

interface GallerySectionProps {
  section?: PageSection;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ section }) => {
  const { lang } = useLanguage();

  const title = lang === 'bn' 
    ? (section?.titleBn || 'ক্যাম্পাস জীবন ও আধুনিক সুযোগ-সুবিধা') 
    : (section?.title || 'Campus Life & State-of-the-Art Facilities');

  const subtitle = lang === 'bn'
    ? (section?.subtitleBn || 'সমৃদ্ধ কেন্দ্রীয় লাইব্রেরি, ডিজিটাল ল্যাবরেটরি ও সাংস্কৃতিক কর্মকাণ্ড')
    : (section?.subtitle || 'Glimpses of academic laboratories, sporting pavilions, and cultural exhibitions');

  const items = [
    {
      url: '/src/assets/images/school_campus_exterior_1793173374585.jpg',
      titleEn: 'Academic Clock Tower & Quadrangle Lawn',
      titleBn: 'ঐতিহাসিক লাল ইটের মূল ভবন ও খেলার মাঠ',
      categoryEn: 'Infrastructure · 18 Acres Campus',
      categoryBn: 'অবকাঠামো · ১৮ একর ক্যাম্পাস',
      aspect: 'aspect-16/10 md:col-span-8'
    },
    {
      url: '/src/assets/images/school_classroom_stem_1793173375794.jpg',
      titleEn: 'Interactive Biotechnology & Robotics Lab',
      titleBn: 'রোবটিক্স ও বায়োটেকনোলজি স্মার্ট ল্যাব',
      categoryEn: 'STEM Facilities · Modern Equipment',
      categoryBn: 'বিজ্ঞানাগার · আধুনিক যন্ত্রপাতি',
      aspect: 'aspect-4/3 md:col-span-4'
    },
    {
      url: '/src/assets/images/school_cultural_campus_1793173376754.jpg',
      titleEn: 'Annual Science Fair & Cultural Pavilion',
      titleBn: 'বার্ষিক বিজ্ঞান মেলা ও সাংস্কৃতিক প্রদর্শনী',
      categoryEn: 'Student Projects · Innovation Atrium',
      categoryBn: 'শিক্ষার্থী উদ্ভাবন · প্রদর্শনী কেন্দ্র',
      aspect: 'aspect-16/9 md:col-span-12'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="max-w-2xl mb-12">
          <div className="text-xs uppercase tracking-widest text-emerald-800 font-semibold mb-1">
            {lang === 'bn' ? 'ফটো গ্যালারি' : 'Campus Archives'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight text-balance">
            {title}
          </h2>
          <p className="mt-2 text-stone-600 font-sans text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Asymmetric Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {items.map((item, idx) => (
            <div 
              key={idx}
              className={`${item.aspect} relative rounded-lg overflow-hidden bg-stone-100 border border-stone-200 group shadow-xs`}
            >
              <img
                src={item.url}
                alt={item.titleEn}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 select-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
              
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-[11px] font-mono text-emerald-300 uppercase tracking-wider mb-1">
                  {lang === 'bn' ? item.categoryBn : item.categoryEn}
                </div>
                <h3 className="text-base sm:text-lg font-serif font-semibold leading-snug">
                  {lang === 'bn' ? item.titleBn : item.titleEn}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
