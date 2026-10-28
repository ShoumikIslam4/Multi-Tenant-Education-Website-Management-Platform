import React from 'react';
import { Quote } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';
import { useTenant } from '../../context/TenantContext.js';
import { PageSection } from '../../types/index.js';

interface PrincipalMessageProps {
  section?: PageSection;
}

export const PrincipalMessage: React.FC<PrincipalMessageProps> = ({ section }) => {
  const { lang } = useLanguage();
  const { currentTenant } = useTenant();

  if (!currentTenant) return null;
  const branding = currentTenant.branding;

  const title = lang === 'bn' 
    ? (section?.titleBn || 'অধ্যক্ষের বাণী') 
    : (section?.title || "Principal's Welcome Address");

  const message = lang === 'bn'
    ? (section?.contentBn || branding.principalMessageBn)
    : (section?.content || branding.principalMessage);

  const principalName = lang === 'bn' ? branding.principalNameBn : branding.principalName;
  const principalImage = section?.imageUrl || branding.principalImageUrl || '/src/assets/images/school_principal_portrait_1793173376401.jpg';

  return (
    <section className="py-16 sm:py-24 bg-stone-100/70 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Portrait Column (4 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center sm:items-start">
            <div className="relative w-full max-w-sm aspect-4/5 rounded-lg overflow-hidden bg-stone-200 shadow-md border border-stone-300/80">
              <img
                src={principalImage}
                alt={principalName}
                className="w-full h-full object-cover object-top select-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <div className="font-serif font-bold text-base sm:text-lg">{principalName}</div>
                <div className="text-xs text-stone-300 font-sans">
                  {lang === 'bn' ? 'অধ্যক্ষ ও সদস্য সচিব' : 'Principal & Head of Institution'}
                </div>
              </div>
            </div>
          </div>

          {/* Editorial Message Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-widest text-emerald-800 font-semibold">
                {lang === 'bn' ? 'নেতৃত্ব ও দর্শন' : 'Scholastic Leadership'}
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-900 tracking-tight text-balance">
                {title}
              </h2>
            </div>

            {/* Editorial Reading Prose with Drop Cap */}
            <div className="relative pl-0 sm:pl-2">
              <p className="text-stone-700 font-sans text-base sm:text-lg leading-relaxed first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-stone-900">
                {message}
              </p>
            </div>

            {/* Attributable Sign-off */}
            <div className="pt-4 border-t border-stone-300 flex items-center justify-between">
              <div>
                <div className="font-serif font-semibold text-stone-900">{principalName}</div>
                <div className="text-xs text-stone-500 font-sans">
                  {lang === 'bn' 
                    ? `${branding.schoolNameBn}, গভর্নিং বডি` 
                    : `${branding.schoolName}, Governing Body`}
                </div>
              </div>
              <div className="text-xs text-stone-400 font-mono">
                {branding.shortName} · Ref: 2026/LDR
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
