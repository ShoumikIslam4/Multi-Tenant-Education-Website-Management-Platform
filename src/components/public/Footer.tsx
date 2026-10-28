import React from 'react';
import { Building2, Phone, Mail, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';
import { useTenant } from '../../context/TenantContext.js';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { lang, t } = useLanguage();
  const { currentTenant } = useTenant();

  if (!currentTenant) return null;
  const branding = currentTenant.branding;

  return (
    <footer className="bg-stone-900 text-stone-300 font-sans text-xs border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Institutional Bio (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div 
                className="w-8 h-8 rounded flex items-center justify-center text-white font-serif font-bold text-sm"
                style={{ backgroundColor: branding.primaryColor || '#0f766e' }}
              >
                {branding.shortName.slice(0, 2)}
              </div>
              <span className="text-base sm:text-lg font-serif font-bold text-white tracking-tight">
                {lang === 'bn' ? branding.schoolNameBn : branding.schoolName}
              </span>
            </div>

            <p className="text-stone-400 font-sans leading-relaxed text-xs sm:text-sm max-w-sm">
              {lang === 'bn' ? branding.taglineBn : branding.tagline}
            </p>

            <div className="pt-2 text-[11px] text-stone-500 space-y-1">
              <div>EIIN Number: <span className="font-mono text-stone-300">{branding.eiinNumber}</span></div>
              <div>Established: <span className="font-mono text-stone-300">{branding.establishedYear}</span></div>
              <div>Affiliation: <span className="text-stone-300">{branding.boardAffiliation}</span></div>
            </div>
          </div>

          {/* Academic Portals & Quick Navigation (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs uppercase tracking-widest text-stone-200 font-semibold">
              {t('footer.quickLinks')}
            </div>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button onClick={() => onNavigate('public_home')} className="hover:text-white transition-colors">
                  {t('nav.home')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('public_admissions')} className="hover:text-white transition-colors">
                  {t('nav.admissions')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('public_notices')} className="hover:text-white transition-colors">
                  {t('nav.notices')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('public_results')} className="hover:text-white transition-colors">
                  {t('nav.results')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('public_faculty')} className="hover:text-white transition-colors">
                  {t('nav.faculty')}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details & Location (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs uppercase tracking-widest text-stone-200 font-semibold">
              {lang === 'bn' ? 'ঠিকানা ও যোগাযোগ' : 'Campus Location & Contact'}
            </div>
            <div className="space-y-2.5 text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{lang === 'bn' ? branding.addressBn : branding.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono">{branding.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono">{branding.email}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Hairline Divider & Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <div>
            © {new Date().getFullYear()} {branding.schoolName}. {t('footer.rights')}
          </div>
          <div className="flex items-center gap-3">
            <span>Powered by SchoolOS Multi-Tenant Architecture</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">Enterprise Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
