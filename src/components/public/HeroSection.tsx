import React from 'react';
import { ArrowRight, Calendar, Sparkles, Award, Users, BookOpen } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';
import { useTenant } from '../../context/TenantContext.js';
import { Notice, PageSection } from '../../types/index.js';

interface HeroSectionProps {
  section?: PageSection;
  recentNotices: Notice[];
  onNavigate: (view: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ section, recentNotices, onNavigate }) => {
  const { lang, t } = useLanguage();
  const { currentTenant } = useTenant();

  if (!currentTenant) return null;
  const branding = currentTenant.branding;

  const title = lang === 'bn' 
    ? (section?.titleBn || branding.schoolNameBn) 
    : (section?.title || branding.schoolName);
  
  const subtitle = lang === 'bn' 
    ? (section?.subtitleBn || branding.taglineBn) 
    : (section?.subtitle || branding.tagline);

  const heroImage = section?.imageUrl || '/src/assets/images/school_campus_exterior_1793173374585.jpg';

  return (
    <section className="relative overflow-hidden bg-stone-900 text-white">
      {/* Hero Visual Background with measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt={branding.schoolName}
          className="w-full h-full object-cover object-center opacity-30 select-none scale-105 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/90 to-stone-950/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-28">
        <div className="max-w-3xl space-y-6">
          {/* Unboxed Metadata Kicker (Anti-slop rule: zero pills!) */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-emerald-400">
            <span>{branding.boardAffiliation}</span>
            <span aria-hidden="true" className="text-stone-500">·</span>
            <span>EIIN: {branding.eiinNumber}</span>
            <span aria-hidden="true" className="text-stone-500">·</span>
            <span>Est. {branding.establishedYear}</span>
          </div>

          {/* Hero Headline with text-wrap: balance */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-stone-50 leading-[1.18] text-balance">
            {title}
          </h1>

          {/* Subtitle / Narrative */}
          <p className="text-base sm:text-lg text-stone-300 font-sans leading-relaxed max-w-2xl">
            {subtitle}
          </p>

          {/* Action Points */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('public_admissions')}
              className="px-6 py-3 rounded-md text-sm font-semibold text-white transition-all shadow-md hover:brightness-110 flex items-center gap-2"
              style={{ backgroundColor: branding.primaryColor || '#0f766e' }}
            >
              <span>{t('btn.applyNow')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('public_notices')}
              className="px-5 py-3 rounded-md text-sm font-medium text-stone-200 bg-stone-800/80 hover:bg-stone-800 hover:text-white border border-stone-700 transition-colors"
            >
              {lang === 'bn' ? 'জরুরি নোটিশ সমূহ' : 'Official Circulars'}
            </button>
          </div>
        </div>

        {/* Notice Ticker Strip Directly Integrated */}
        {recentNotices.length > 0 && (
          <div className="mt-12 pt-6 border-t border-stone-800/80 flex flex-col md:flex-row items-start md:items-center gap-4 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold uppercase tracking-wider shrink-0">
              <Calendar className="w-4 h-4" />
              <span>{lang === 'bn' ? 'বিজ্ঞপ্তি সংবাদ' : 'Notice Board'}</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-stone-300 truncate">
                <span className="font-medium text-stone-100 mr-2">
                  [{recentNotices[0].category}]
                </span>
                {lang === 'bn' ? recentNotices[0].titleBn : recentNotices[0].title}
              </p>
            </div>
            <button
              onClick={() => onNavigate('public_notices')}
              className="text-stone-400 hover:text-stone-200 underline shrink-0 whitespace-nowrap"
            >
              {t('btn.viewAll')}
            </button>
          </div>
        )}
      </div>

      {/* 4-Column Metric Strip Below Hero (Full-width row) */}
      <div className="border-t border-stone-800 bg-stone-950/80 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-stone-200 font-sans">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-white tabular-nums">2,480+</div>
            <div className="text-xs text-stone-400">{lang === 'bn' ? 'নিয়মিত শিক্ষার্থী' : 'Enrolled Scholars'}</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-white tabular-nums">96</div>
            <div className="text-xs text-stone-400">{lang === 'bn' ? 'প্রাজ্ঞ শিক্ষকমণ্ডলী' : 'Dedicated Faculty'}</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-400 tabular-nums">99.4%</div>
            <div className="text-xs text-stone-400">{lang === 'bn' ? 'জিপিএ-৫ পাসের হার' : 'GPA 5.0 Success'}</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-white tabular-nums">18</div>
            <div className="text-xs text-stone-400">{lang === 'bn' ? 'একর সবুজ ক্যাম্পাস' : 'Acres Green Campus'}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
