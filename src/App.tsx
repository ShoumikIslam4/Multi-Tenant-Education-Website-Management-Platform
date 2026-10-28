import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext.js';
import { TenantProvider, useTenant } from './context/TenantContext.js';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { Header } from './components/common/Header.js';
import { HeroSection } from './components/public/HeroSection.js';
import { PrincipalMessage } from './components/public/PrincipalMessage.js';
import { AcademicPrograms } from './components/public/AcademicPrograms.js';
import { NoticeBoardSection } from './components/public/NoticeBoardSection.js';
import { GallerySection } from './components/public/GallerySection.js';
import { AdmissionsPortal } from './components/public/AdmissionsPortal.js';
import { ResultLookupPortal } from './components/public/ResultLookupPortal.js';
import { FacultyDirectory } from './components/public/FacultyDirectory.js';
import { Footer } from './components/public/Footer.js';
import { WebsiteBuilder } from './components/builder/WebsiteBuilder.js';
import { AdminDashboard } from './components/admin/AdminDashboard.js';
import { UserPortal } from './components/portals/UserPortal.js';
import { Notice, Teacher, PageSection } from './types/index.js';

function SchoolOSMain() {
  const { lang, t } = useLanguage();
  const { currentTenant, isLoading: isTenantLoading } = useTenant();
  const { role } = useAuth();

  const [currentView, setCurrentView] = useState<string>('public_home');
  const [siteData, setSiteData] = useState<{
    pageSections: PageSection[];
    notices: Notice[];
    teachers: Teacher[];
  }>({
    pageSections: [],
    notices: [],
    teachers: [],
  });

  const [isSiteLoading, setIsSiteLoading] = useState(true);

  useEffect(() => {
    if (currentTenant) {
      loadPublicSite();
    }
  }, [currentTenant]);

  const loadPublicSite = async () => {
    if (!currentTenant) return;
    try {
      setIsSiteLoading(true);
      const res = await fetch('/api/v1/public/site', {
        headers: { 'x-tenant-id': currentTenant.id }
      });
      const data = await res.json();
      if (data.success) {
        setSiteData({
          pageSections: data.page?.sections || [],
          notices: data.recentNotices || [],
          teachers: data.featuredFaculty || [],
        });
      }
    } catch (e) {
      console.error('Failed to load public site data:', e);
    } finally {
      setIsSiteLoading(false);
    }
  };

  if (isTenantLoading || !currentTenant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 font-sans text-xs text-stone-500">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-stone-800 border-t-transparent rounded-full animate-spin mx-auto" />
          <div>Initializing SchoolOS Multi-Tenant Architecture...</div>
        </div>
      </div>
    );
  }

  // Find sections
  const heroSection = siteData.pageSections.find(s => s.type === 'hero' && s.isVisible);
  const principalSection = siteData.pageSections.find(s => s.type === 'principal_message' && s.isVisible);
  const programsSection = siteData.pageSections.find(s => s.type === 'programs' && s.isVisible);
  const gallerySection = siteData.pageSections.find(s => s.type === 'gallery' && s.isVisible);

  return (
    <div className="min-h-screen flex flex-col bg-white text-stone-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Header with Strict 3-Zone Contract & Persona Switcher */}
      <Header currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW 1: DYNAMIC PUBLIC HOME */}
        {currentView === 'public_home' && (
          <div className="space-y-0">
            {/* Hero Banner with Campus Photography */}
            <HeroSection
              section={heroSection}
              recentNotices={siteData.notices}
              onNavigate={setCurrentView}
            />

            {/* Principal's Message with Scholarly Portrait */}
            <PrincipalMessage section={principalSection} />

            {/* Academic Curricula & STEM Laboratories */}
            <AcademicPrograms section={programsSection} />

            {/* Notice Board with Category Filtering */}
            <NoticeBoardSection notices={siteData.notices} />

            {/* Photo Gallery Showcase with High-Res Campus Assets */}
            <GallerySection section={gallerySection} />

            {/* Admissions Banner Callout */}
            <section className="py-16 bg-stone-900 text-white text-center">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-balance">
                  {lang === 'bn' 
                    ? '২০২৬-২০২৭ শিক্ষাবর্ষের ভর্তি কার্যক্রম চলমান রয়েছে' 
                    : 'Admissions Open for Session 2026-2027'}
                </h2>
                <p className="text-stone-300 font-sans text-sm sm:text-base max-w-xl mx-auto">
                  {lang === 'bn'
                    ? 'অনলাইনে আবেদনপত্র পূরণ করুন এবং তাৎক্ষণিক ট্র্যাকিং ভাউচার গ্রহণ করুন।'
                    : 'Submit your online enrollment dossier and receive your verifiable admission voucher.'}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setCurrentView('public_admissions')}
                    className="px-6 py-3 rounded-md text-xs font-semibold text-white transition-opacity shadow-sm"
                    style={{ backgroundColor: currentTenant.branding.primaryColor || '#0f766e' }}
                  >
                    {t('btn.applyNow')}
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: ADMISSIONS PORTAL */}
        {currentView === 'public_admissions' && (
          <AdmissionsPortal />
        )}

        {/* VIEW 3: RESULT VERIFICATION TRANSCRIPT */}
        {currentView === 'public_results' && (
          <ResultLookupPortal />
        )}

        {/* VIEW 4: NOTICES ARCHIVE */}
        {currentView === 'public_notices' && (
          <div className="py-8">
            <NoticeBoardSection notices={siteData.notices} />
          </div>
        )}

        {/* VIEW 5: FACULTY DIRECTORY */}
        {currentView === 'public_faculty' && (
          <FacultyDirectory teachers={siteData.teachers} />
        )}

        {/* VIEW 6: WEBSITE BUILDER & CMS */}
        {currentView === 'builder' && (
          <WebsiteBuilder />
        )}

        {/* VIEW 7: MANAGEMENT DASHBOARD & ADMISSION PIPELINE */}
        {currentView === 'dashboard' && (
          <AdminDashboard />
        )}

        {/* VIEW 8: USER PORTAL (STUDENT / TEACHER / GUARDIAN) */}
        {currentView === 'portal' && (
          <UserPortal />
        )}
      </main>

      {/* Institutional Footer */}
      <Footer onNavigate={setCurrentView} />
    </div>
  );
}

export default function App() {
  return (
    <TenantProvider>
      <LanguageProvider>
        <AuthProvider>
          <SchoolOSMain />
        </AuthProvider>
      </LanguageProvider>
    </TenantProvider>
  );
}
