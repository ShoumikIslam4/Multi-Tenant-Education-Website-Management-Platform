import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  Mail, 
  Languages, 
  ChevronDown, 
  ShieldCheck, 
  UserCircle2, 
  Compass, 
  FileText, 
  GraduationCap, 
  LayoutDashboard,
  Check
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';
import { useTenant } from '../../context/TenantContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { Role } from '../../types/index.js';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const { lang, setLang, t } = useLanguage();
  const { currentTenant, tenants, switchTenant } = useTenant();
  const { user, role, switchRole, logout } = useAuth();
  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  if (!currentTenant) return null;

  const branding = currentTenant.branding;
  const schoolName = lang === 'bn' ? branding.schoolNameBn : branding.schoolName;

  const rolesList: { id: Role; labelBn: string; labelEn: string; desc: string }[] = [
    { id: 'PUBLIC', labelBn: 'সাধারণ পরিদর্শক (পাবলিক)', labelEn: 'Public Visitor', desc: 'Browse public website, apply for admission & search results' },
    { id: 'SCHOOL_ADMIN', labelBn: 'ইনস্টিটিউট প্রধান / অ্যাডমিন', labelEn: 'School Administrator', desc: 'Full CMS, admissions review, branding & attendance' },
    { id: 'EDITOR', labelBn: 'ওয়েবসাইট এডিটর / সিএমএস', labelEn: 'Website Editor', desc: 'Visual page builder, sections edit, draft & publish' },
    { id: 'TEACHER', labelBn: 'শিক্ষক / ফ্যাকাল্টি', labelEn: 'Faculty Teacher', desc: 'Take attendance, enter marks & view class routines' },
    { id: 'STUDENT', labelBn: 'শিক্ষার্থী পোর্টাল', labelEn: 'Enrolled Student', desc: 'View own attendance, routines & exam report card' },
    { id: 'GUARDIAN', labelBn: 'অভিভাবক পোর্টাল', labelEn: 'Parent / Guardian', desc: 'Monitor ward attendance, notices & report cards' },
    { id: 'SUPER_ADMIN', labelBn: 'সিস্টেম সুপার অ্যাডমিন', labelEn: 'Platform Super Admin', desc: 'Multi-tenant creation, platform diagnostics & audit logs' }
  ];

  return (
    <header className="w-full bg-white border-b border-stone-200 sticky top-0 z-40 transition-colors shadow-xs">
      {/* Top Utility Announcement Ribbon */}
      <div className="bg-stone-900 text-stone-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Institutional Identifiers */}
          <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto text-[11px] font-sans">
            <span className="font-medium text-stone-300">
              EIIN: <span className="text-white font-mono">{branding.eiinNumber}</span>
            </span>
            <span className="text-stone-600 hidden sm:inline">·</span>
            <span className="text-stone-300 hidden sm:inline">
              Est. <span className="font-mono">{branding.establishedYear}</span>
            </span>
            <span className="text-stone-600 hidden md:inline">·</span>
            <span className="text-stone-400 hidden md:flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-stone-400" />
              <span>{branding.phone}</span>
            </span>
          </div>

          {/* Controls: Institution Switcher, Language Toggle, Role Persona */}
          <div className="flex items-center gap-3 shrink-0 ml-auto text-xs">
            {/* Institution Switcher (Demonstrating Multi-Tenancy) */}
            <div className="relative">
              <button
                onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
                className="flex items-center gap-1.5 text-stone-200 hover:text-white px-2 py-0.5 rounded transition-colors bg-stone-800/80 hover:bg-stone-800"
                title="Switch Multi-Tenant Institution"
              >
                <Building2 className="w-3 h-3 text-emerald-400" />
                <span className="max-w-[120px] sm:max-w-[180px] truncate font-medium">
                  {branding.shortName}
                </span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {tenantDropdownOpen && (
                <div 
                  className="absolute right-0 mt-1.5 w-72 bg-white rounded-lg shadow-xl border border-stone-200 py-1.5 z-50 text-stone-800"
                  onMouseLeave={() => setTenantDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider border-b border-stone-100">
                    Switch School Tenant
                  </div>
                  {tenants.map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        switchTenant(t.id);
                        setTenantDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-stone-50 transition-colors text-xs ${
                        t.id === currentTenant.id ? 'bg-emerald-50/60 font-semibold text-emerald-900' : ''
                      }`}
                    >
                      <div>
                        <div className="font-medium text-stone-900">{t.branding.schoolName}</div>
                        <div className="text-[11px] text-stone-500 font-sans">{t.subdomain}.schoolos.net · EIIN: {t.branding.eiinNumber}</div>
                      </div>
                      {t.id === currentTenant.id && <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-stone-800/80 rounded px-1.5 py-0.5 text-[11px]">
              <Languages className="w-3 h-3 text-stone-400 mr-1" />
              <button 
                onClick={() => setLang('bn')} 
                className={`px-1.5 py-0.2 rounded transition-colors ${lang === 'bn' ? 'bg-stone-700 text-white font-medium' : 'text-stone-400 hover:text-stone-200'}`}
              >
                বাংলা
              </button>
              <span className="text-stone-600 mx-0.5">/</span>
              <button 
                onClick={() => setLang('en')} 
                className={`px-1.5 py-0.2 rounded transition-colors ${lang === 'en' ? 'bg-stone-700 text-white font-medium' : 'text-stone-400 hover:text-stone-200'}`}
              >
                EN
              </button>
            </div>

            {/* Role Persona Switcher for effortless testing */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 transition-colors"
                title="Select persona to test permissions"
              >
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Role: {role}</span>
                <ChevronDown className="w-2.5 h-2.5 opacity-70" />
              </button>

              {roleDropdownOpen && (
                <div 
                  className="absolute right-0 mt-1.5 w-80 bg-white rounded-lg shadow-2xl border border-stone-200 py-2 z-50 text-stone-800"
                  onMouseLeave={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider border-b border-stone-100 mb-1">
                    Simulate & Test User Roles
                  </div>
                  {rolesList.map(r => (
                    <button
                      key={r.id}
                      onClick={() => {
                        switchRole(r.id);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-stone-50 transition-colors flex items-start gap-2 text-xs ${
                        role === r.id ? 'bg-emerald-50/70 border-l-2 border-emerald-600' : ''
                      }`}
                    >
                      <UserCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${role === r.id ? 'text-emerald-700' : 'text-stone-400'}`} />
                      <div className="flex-1">
                        <div className="font-semibold text-stone-900">
                          {lang === 'bn' ? r.labelBn : r.labelEn}
                        </div>
                        <div className="text-[11px] text-stone-500 leading-tight mt-0.5">{r.desc}</div>
                      </div>
                      {role === r.id && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1 mt-0.5" />}
                    </button>
                  ))}
                  {user && (
                    <div className="border-t border-stone-100 mt-1 pt-1 px-3">
                      <button
                        onClick={() => {
                          logout();
                          setRoleDropdownOpen(false);
                        }}
                        className="w-full text-left py-1 text-xs text-rose-600 hover:text-rose-800 font-medium"
                      >
                        Sign out session
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Top Bar (Strict 3-Zone Contract: Brand Wordmark — 4-5 single line links — 1 primary action) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single line, whitespace-nowrap shrink-0) */}
        <button 
          onClick={() => setCurrentView('public_home')}
          className="flex items-center gap-2.5 text-left text-stone-900 group whitespace-nowrap shrink-0"
        >
          <div 
            className="w-9 h-9 rounded-md flex items-center justify-center text-white font-serif font-bold text-base shadow-xs"
            style={{ backgroundColor: branding.primaryColor || '#0f766e' }}
          >
            {branding.shortName.slice(0, 2)}
          </div>
          <div className="leading-tight">
            <span className="text-base sm:text-lg font-bold tracking-tight text-stone-900 group-hover:text-stone-700 transition-colors whitespace-nowrap">
              {schoolName}
            </span>
            <div className="text-[11px] text-stone-500 hidden sm:block whitespace-nowrap">
              {branding.boardAffiliation}
            </div>
          </div>
        </button>

        {/* Zone 2: 4-5 Concise Navigation Links (whitespace-nowrap shrink-0) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button 
            onClick={() => setCurrentView('public_home')} 
            className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 ${currentView === 'public_home' ? 'text-stone-950 font-semibold' : ''}`}
          >
            {t('nav.home')}
          </button>
          <button 
            onClick={() => setCurrentView('public_notices')} 
            className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 ${currentView === 'public_notices' ? 'text-stone-950 font-semibold' : ''}`}
          >
            {t('nav.notices')}
          </button>
          <button 
            onClick={() => setCurrentView('public_admissions')} 
            className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 ${currentView === 'public_admissions' ? 'text-stone-950 font-semibold' : ''}`}
          >
            {t('nav.admissions')}
          </button>
          <button 
            onClick={() => setCurrentView('public_results')} 
            className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 ${currentView === 'public_results' ? 'text-stone-950 font-semibold' : ''}`}
          >
            {t('nav.results')}
          </button>
          <button 
            onClick={() => setCurrentView('public_faculty')} 
            className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 ${currentView === 'public_faculty' ? 'text-stone-950 font-semibold' : ''}`}
          >
            {t('nav.faculty')}
          </button>
        </nav>

        {/* Zone 3: Exactly 1 Primary Action (whitespace-nowrap shrink-0) */}
        <div className="flex items-center gap-3 shrink-0">
          {role === 'PUBLIC' ? (
            <button
              onClick={() => setCurrentView('public_admissions')}
              className="px-4 py-2 text-xs font-semibold text-white rounded-md transition-all shadow-xs hover:opacity-95 whitespace-nowrap shrink-0"
              style={{ backgroundColor: branding.primaryColor || '#0f766e' }}
            >
              {t('btn.applyNow')}
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white rounded-md transition-all shadow-xs hover:opacity-95 whitespace-nowrap shrink-0"
              style={{ backgroundColor: branding.primaryColor || '#0f766e' }}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{role === 'TEACHER' || role === 'STUDENT' || role === 'GUARDIAN' ? t('nav.portal') : t('nav.dashboard')}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
