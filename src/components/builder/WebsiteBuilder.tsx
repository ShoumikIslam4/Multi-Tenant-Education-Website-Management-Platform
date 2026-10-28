import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Save, 
  Send, 
  History, 
  Monitor, 
  Tablet, 
  Smartphone, 
  RotateCcw,
  Palette,
  Layout,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';
import { useTenant } from '../../context/TenantContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { Page, PageSection, PageRevision } from '../../types/index.js';

export const WebsiteBuilder: React.FC = () => {
  const { lang, t } = useLanguage();
  const { currentTenant, updateBrandingLocally, refreshTenantData } = useTenant();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'sections' | 'branding' | 'preview'>('sections');
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const [page, setPage] = useState<Page | null>(null);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Revision history state
  const [revisions, setRevisions] = useState<PageRevision[]>([]);
  const [showRevisionsModal, setShowRevisionsModal] = useState(false);

  // Branding editor state
  const [brandingForm, setBrandingForm] = useState(currentTenant?.branding || {
    schoolName: '',
    schoolNameBn: '',
    shortName: '',
    tagline: '',
    taglineBn: '',
    primaryColor: '#0f766e',
    secondaryColor: '#b45309',
    accentColor: '#0284c7',
    eiinNumber: '108420',
    phone: '',
    email: '',
    address: '',
    addressBn: '',
    principalName: '',
    principalNameBn: '',
    principalMessage: '',
    principalMessageBn: '',
    principalImageUrl: '',
    logoUrl: '',
    faviconUrl: '',
    establishedYear: 1984,
    boardAffiliation: 'Dhaka Board',
    fontFamily: 'Plus Jakarta Sans',
  });

  useEffect(() => {
    if (currentTenant) {
      setBrandingForm(currentTenant.branding);
      loadPageData();
    }
  }, [currentTenant]);

  const loadPageData = async () => {
    if (!currentTenant) return;
    try {
      setIsLoading(true);
      const res = await fetch(`/api/v1/pages/home`, {
        headers: { 'x-tenant-id': currentTenant.id }
      });
      const data = await res.json();
      if (data.success && data.page) {
        setPage(data.page);
        setSections(data.page.sections || []);
        if (data.page.sections?.length > 0) {
          setSelectedSectionId(data.page.sections[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load page for builder:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!currentTenant) return;
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const res = await fetch(`/api/v1/pages/home/draft`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': currentTenant.id
        },
        body: JSON.stringify({ sections })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: 'success', text: 'Draft changes saved successfully.' });
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to save draft.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Network error while saving draft.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishLive = async () => {
    if (!currentTenant) return;
    setIsPublishing(true);
    setStatusMessage(null);
    try {
      // First save draft
      await fetch(`/api/v1/pages/home/draft`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': currentTenant.id
        },
        body: JSON.stringify({ sections })
      });

      // Atomic publish
      const res = await fetch(`/api/v1/pages/home/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': currentTenant.id
        }
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ 
          type: 'success', 
          text: 'Website successfully published! Public visitors now see the updated layout.' 
        });
        setPage(data.page);
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Publishing failed.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Network error while publishing.' });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;
    try {
      const res = await fetch(`/api/v1/tenants/${currentTenant.id}/branding`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': currentTenant.id
        },
        body: JSON.stringify(brandingForm)
      });
      const data = await res.json();
      if (data.success) {
        updateBrandingLocally(brandingForm);
        setStatusMessage({ type: 'success', text: 'Institution branding and theme updated.' });
        refreshTenantData();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to update branding.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Network error while updating branding.' });
    }
  };

  const openRevisions = async () => {
    if (!currentTenant) return;
    try {
      const res = await fetch(`/api/v1/pages/home/revisions`, {
        headers: { 'x-tenant-id': currentTenant.id }
      });
      const data = await res.json();
      if (data.success) {
        setRevisions(data.revisions);
        setShowRevisionsModal(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRollback = async (revisionId: string) => {
    if (!currentTenant) return;
    if (!confirm('Are you sure you want to rollback to this previous version?')) return;

    try {
      const res = await fetch(`/api/v1/pages/home/rollback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': currentTenant.id
        },
        body: JSON.stringify({ revisionId })
      });
      const data = await res.json();
      if (data.success && data.page) {
        setSections(data.page.sections);
        setShowRevisionsModal(false);
        setStatusMessage({ type: 'success', text: 'Successfully rolled back to chosen revision.' });
      }
    } catch (err) {
      alert('Rollback failed.');
    }
  };

  // Section Ordering & Manipulation
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);
    setSections(newSections);
  };

  const toggleSectionVisibility = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, isVisible: !s.isVisible } : s));
  };

  const deleteSection = (id: string) => {
    if (confirm('Delete this section from the page?')) {
      const newSecs = sections.filter(s => s.id !== id);
      setSections(newSecs);
      if (selectedSectionId === id) {
        setSelectedSectionId(newSecs[0]?.id || null);
      }
    }
  };

  const addSection = (type: PageSection['type']) => {
    const newSection: PageSection = {
      id: `sec-${Date.now()}`,
      type,
      title: `New ${type.replace('_', ' ')} Section`,
      titleBn: `নতুন সেকশন (${type})`,
      subtitle: 'Configured via Website Builder',
      subtitleBn: 'ওয়েবসাইট বিল্ডারের মাধ্যমে যুক্ত করা হয়েছে',
      content: 'Custom rich editorial content for this institutional section.',
      contentBn: 'প্রতিষ্ঠান সম্পর্কিত কাস্টম তথ্যাবলি।',
      order: sections.length + 1,
      isVisible: true,
      imageUrl: '/src/assets/images/school_campus_exterior_1793173374585.jpg'
    };
    setSections([...sections, newSection]);
    setSelectedSectionId(newSection.id);
  };

  const selectedSection = sections.find(s => s.id === selectedSectionId);

  return (
    <div className="bg-stone-100 min-h-screen pb-16">
      {/* Top Builder Control Bar */}
      <div className="bg-white border-b border-stone-200 px-4 sm:px-6 py-3 sticky top-14 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 font-sans text-xs">
          
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-emerald-100 text-emerald-800">
              <Layout className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-stone-900 text-sm">
                {lang === 'bn' ? 'ওয়েবসাইট ও পেজ বিল্ডার' : 'Website & Page Builder'}
              </div>
              <div className="text-[11px] text-stone-500 font-mono">
                Editing: <span className="text-stone-800 font-bold">{currentTenant?.branding.schoolName}</span> (Homepage)
              </div>
            </div>
          </div>

          {/* Builder Navigation Mode Tabs */}
          <div className="flex items-center bg-stone-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('sections')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'sections' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {lang === 'bn' ? 'সেকশনসমূহ' : 'Sections Layout'}
            </button>
            <button
              onClick={() => setActiveTab('branding')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'branding' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {lang === 'bn' ? 'ব্র্যান্ডিং ও থিম' : 'Branding & Theme'}
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'preview' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {lang === 'bn' ? 'লাইভ প্রিভিউ' : 'Live Preview'}
            </button>
          </div>

          {/* Action Buttons: Save Draft, Publish, Revision History */}
          <div className="flex items-center gap-2">
            <button
              onClick={openRevisions}
              className="px-3 py-1.5 rounded border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors flex items-center gap-1.5"
              title="View revision history & rollback"
            >
              <History className="w-3.5 h-3.5 text-stone-500" />
              <span>{lang === 'bn' ? 'সংস্করণ ইতিহাস' : 'Revisions'}</span>
            </button>

            <button
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="px-3.5 py-1.5 rounded bg-stone-800 text-white hover:bg-stone-900 transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : (lang === 'bn' ? 'ড্রাফট সংরক্ষণ' : 'Save Draft')}</span>
            </button>

            <button
              onClick={handlePublishLive}
              disabled={isPublishing}
              className="px-4 py-1.5 rounded bg-emerald-800 text-white hover:bg-emerald-700 transition-colors font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isPublishing ? 'Publishing...' : (lang === 'bn' ? 'লাইভ পাবলিশ' : 'Publish Live')}</span>
            </button>
          </div>

        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className={`mt-2 max-w-7xl mx-auto p-2 rounded text-xs flex items-center gap-2 ${
            statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}
      </div>

      {/* MAIN BUILDER BODY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        
        {/* TAB 1: SECTIONS LAYOUT */}
        {activeTab === 'sections' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Rail: Section Reorder & Visibility List (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-lg border border-stone-200 p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <span className="font-serif font-bold text-stone-900 text-sm">
                  {lang === 'bn' ? 'পৃষ্ঠার সেকশন তালিকা' : 'Page Section Flow'}
                </span>
                
                {/* Add Section Dropdown */}
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      addSection(e.target.value as any);
                      e.target.value = '';
                    }
                  }}
                  className="text-xs px-2 py-1 rounded border border-stone-300 bg-stone-50 font-medium"
                >
                  <option value="">+ Add Section</option>
                  <option value="hero">Hero Banner</option>
                  <option value="principal_message">Principal Message</option>
                  <option value="programs">Academic Programs</option>
                  <option value="stats">Institutional Highlights</option>
                  <option value="notices">Notice Board</option>
                  <option value="gallery">Photo Gallery</option>
                  <option value="cta">Admission CTA</option>
                  <option value="rich_text">Rich Text & History</option>
                </select>
              </div>

              {/* Draggable/Reorderable Section Cards */}
              <div className="space-y-2">
                {sections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    onClick={() => setSelectedSectionId(sec.id)}
                    className={`p-3 rounded-md border text-xs cursor-pointer transition-colors flex items-center justify-between gap-3 ${
                      selectedSectionId === sec.id
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                        : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="font-mono text-stone-400 tabular-nums">0{idx + 1}.</span>
                      <div className="truncate">
                        <div className="font-semibold text-stone-900 truncate">
                          {lang === 'bn' ? (sec.titleBn || sec.title) : sec.title}
                        </div>
                        <div className="text-[11px] text-stone-500 font-mono">Type: {sec.type}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                      {/* Move Up */}
                      <button
                        disabled={idx === 0}
                        onClick={() => moveSection(idx, 'up')}
                        className="p-1 text-stone-500 hover:text-stone-900 disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      {/* Move Down */}
                      <button
                        disabled={idx === sections.length - 1}
                        onClick={() => moveSection(idx, 'down')}
                        className="p-1 text-stone-500 hover:text-stone-900 disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      {/* Toggle Visibility */}
                      <button
                        onClick={() => toggleSectionVisibility(sec.id)}
                        className={`p-1 ${sec.isVisible ? 'text-emerald-700' : 'text-stone-400'}`}
                        title={sec.isVisible ? 'Visible on live site' : 'Hidden'}
                      >
                        {sec.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      {/* Delete Section */}
                      <button
                        onClick={() => deleteSection(sec.id)}
                        className="p-1 text-stone-400 hover:text-rose-600"
                        title="Delete Section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Editor: Live Configuration for Selected Section (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-lg border border-stone-200 p-6 shadow-xs font-sans text-xs">
              {selectedSection ? (
                <div className="space-y-5">
                  <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-base text-stone-900">
                        {lang === 'bn' ? 'সেকশন সম্পাদনা' : 'Configure Section Content'}
                      </h3>
                      <span className="text-[11px] text-stone-500 font-mono">ID: {selectedSection.id} · Type: {selectedSection.type}</span>
                    </div>
                    <span className="text-emerald-700 font-medium">Auto-synced to canvas</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Section Title (English)</label>
                      <input
                        type="text"
                        value={selectedSection.title || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setSections(sections.map(s => s.id === selectedSection.id ? { ...s, title: val } : s));
                        }}
                        className="w-full px-3 py-2 rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-400"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Section Title (Bangla)</label>
                      <input
                        type="text"
                        value={selectedSection.titleBn || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setSections(sections.map(s => s.id === selectedSection.id ? { ...s, titleBn: val } : s));
                        }}
                        className="w-full px-3 py-2 rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-400"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Subtitle (English)</label>
                      <input
                        type="text"
                        value={selectedSection.subtitle || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setSections(sections.map(s => s.id === selectedSection.id ? { ...s, subtitle: val } : s));
                        }}
                        className="w-full px-3 py-2 rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-400"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Subtitle (Bangla)</label>
                      <input
                        type="text"
                        value={selectedSection.subtitleBn || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setSections(sections.map(s => s.id === selectedSection.id ? { ...s, subtitleBn: val } : s));
                        }}
                        className="w-full px-3 py-2 rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-400"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-medium text-stone-700 mb-1">Image URL / Media Asset Path</label>
                      <input
                        type="text"
                        value={selectedSection.imageUrl || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setSections(sections.map(s => s.id === selectedSection.id ? { ...s, imageUrl: val } : s));
                        }}
                        className="w-full px-3 py-2 rounded border border-stone-300 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-stone-400"
                      />
                      {selectedSection.imageUrl && (
                        <div className="mt-2 w-32 aspect-16/10 rounded overflow-hidden border border-stone-200">
                          <img src={selectedSection.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-medium text-stone-700 mb-1">Body / Editorial Content (English)</label>
                      <textarea
                        rows={3}
                        value={selectedSection.content || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setSections(sections.map(s => s.id === selectedSection.id ? { ...s, content: val } : s));
                        }}
                        className="w-full px-3 py-2 rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-400"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-medium text-stone-700 mb-1">Body / Editorial Content (Bangla)</label>
                      <textarea
                        rows={3}
                        value={selectedSection.contentBn || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setSections(sections.map(s => s.id === selectedSection.id ? { ...s, contentBn: val } : s));
                        }}
                        className="w-full px-3 py-2 rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-400"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-stone-400">
                  Select a section from the left list to customize its attributes.
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: BRANDING & THEME CONTROL */}
        {activeTab === 'branding' && (
          <div className="bg-white rounded-lg border border-stone-200 p-6 sm:p-8 shadow-xs max-w-4xl mx-auto font-sans text-xs">
            <div className="border-b border-stone-200 pb-4 mb-6">
              <h3 className="text-base font-serif font-bold text-stone-900">
                {lang === 'bn' ? 'প্রাতিষ্ঠানিক ব্র্যান্ডিং ও থিম কাস্টমাইজেশন' : 'Institution Branding, Color Tokens & Typography'}
              </h3>
              <p className="text-stone-500 font-sans text-xs mt-0.5">
                {lang === 'bn' 
                  ? 'বিদ্যালয়ের নাম, লোগো, রঙ এবং অধ্যক্ষের তথ্য পরিবর্তন করুন।' 
                  : 'Customize institution identities, EIIN, primary hex color tokens, and contact coordinates.'}
              </p>
            </div>

            <form onSubmit={handleSaveBranding} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">School Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={brandingForm.schoolName}
                    onChange={e => setBrandingForm({ ...brandingForm, schoolName: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-stone-300 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">School Name (Bangla) *</label>
                  <input
                    type="text"
                    required
                    value={brandingForm.schoolNameBn}
                    onChange={e => setBrandingForm({ ...brandingForm, schoolNameBn: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-stone-300 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Short Code / Acronym</label>
                  <input
                    type="text"
                    value={brandingForm.shortName}
                    onChange={e => setBrandingForm({ ...brandingForm, shortName: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-stone-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">EIIN Identifier</label>
                  <input
                    type="text"
                    value={brandingForm.eiinNumber}
                    onChange={e => setBrandingForm({ ...brandingForm, eiinNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-stone-300 font-mono"
                  />
                </div>

                {/* Color Palette Tokens */}
                <div className="sm:col-span-2 pt-2 border-t border-stone-100">
                  <div className="font-semibold text-stone-800 mb-2 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-stone-500" />
                    <span>Color Palette Design Tokens</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-stone-600 mb-1">Primary Brand Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={brandingForm.primaryColor}
                          onChange={e => setBrandingForm({ ...brandingForm, primaryColor: e.target.value })}
                          className="w-8 h-8 rounded border cursor-pointer"
                        />
                        <input
                          type="text"
                          value={brandingForm.primaryColor}
                          onChange={e => setBrandingForm({ ...brandingForm, primaryColor: e.target.value })}
                          className="w-24 px-2 py-1 rounded border border-stone-300 font-mono text-[11px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1">Secondary Accent</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={brandingForm.secondaryColor}
                          onChange={e => setBrandingForm({ ...brandingForm, secondaryColor: e.target.value })}
                          className="w-8 h-8 rounded border cursor-pointer"
                        />
                        <input
                          type="text"
                          value={brandingForm.secondaryColor}
                          onChange={e => setBrandingForm({ ...brandingForm, secondaryColor: e.target.value })}
                          className="w-24 px-2 py-1 rounded border border-stone-300 font-mono text-[11px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1">Accent Highlight</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={brandingForm.accentColor}
                          onChange={e => setBrandingForm({ ...brandingForm, accentColor: e.target.value })}
                          className="w-8 h-8 rounded border cursor-pointer"
                        />
                        <input
                          type="text"
                          value={brandingForm.accentColor}
                          onChange={e => setBrandingForm({ ...brandingForm, accentColor: e.target.value })}
                          className="w-24 px-2 py-1 rounded border border-stone-300 font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Principal Information */}
                <div className="sm:col-span-2 pt-2 border-t border-stone-100">
                  <div className="font-semibold text-stone-800 mb-2">Principal Details & Speech</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-stone-600 mb-1">Principal Name (English)</label>
                      <input
                        type="text"
                        value={brandingForm.principalName}
                        onChange={e => setBrandingForm({ ...brandingForm, principalName: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-stone-300"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 mb-1">Principal Name (Bangla)</label>
                      <input
                        type="text"
                        value={brandingForm.principalNameBn}
                        onChange={e => setBrandingForm({ ...brandingForm, principalNameBn: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-stone-300"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-stone-600 mb-1">Principal Message (English)</label>
                      <textarea
                        rows={2}
                        value={brandingForm.principalMessage}
                        onChange={e => setBrandingForm({ ...brandingForm, principalMessage: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-stone-300"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-stone-600 mb-1">Principal Message (Bangla)</label>
                      <textarea
                        rows={2}
                        value={brandingForm.principalMessageBn}
                        onChange={e => setBrandingForm({ ...brandingForm, principalMessageBn: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-stone-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact & Address Coordinates */}
                <div className="sm:col-span-2 pt-2 border-t border-stone-100">
                  <div className="font-semibold text-stone-800 mb-2">Campus Location & Contact Coordinates</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-stone-600 mb-1">Official Telephone</label>
                      <input
                        type="text"
                        value={brandingForm.phone}
                        onChange={e => setBrandingForm({ ...brandingForm, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-stone-300 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 mb-1">Official Email</label>
                      <input
                        type="email"
                        value={brandingForm.email}
                        onChange={e => setBrandingForm({ ...brandingForm, email: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-stone-300 font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-stone-600 mb-1">Campus Address (English)</label>
                      <input
                        type="text"
                        value={brandingForm.address}
                        onChange={e => setBrandingForm({ ...brandingForm, address: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-stone-300"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-stone-600 mb-1">Campus Address (Bangla)</label>
                      <input
                        type="text"
                        value={brandingForm.addressBn}
                        onChange={e => setBrandingForm({ ...brandingForm, addressBn: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-stone-300"
                      />
                    </div>
                  </div>
                </div>

              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 rounded bg-stone-900 text-white hover:bg-stone-800 font-semibold transition-colors"
                >
                  {lang === 'bn' ? 'ব্র্যান্ডিং সংরক্ষণ করুন' : 'Update Institution Branding'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: LIVE DEVICE PREVIEW */}
        {activeTab === 'preview' && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 bg-white p-2 rounded-lg border border-stone-200 max-w-xs mx-auto text-xs">
              <button
                onClick={() => setDevicePreview('desktop')}
                className={`p-1.5 rounded flex items-center gap-1 ${devicePreview === 'desktop' ? 'bg-stone-900 text-white' : 'text-stone-600'}`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setDevicePreview('tablet')}
                className={`p-1.5 rounded flex items-center gap-1 ${devicePreview === 'tablet' ? 'bg-stone-900 text-white' : 'text-stone-600'}`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span>Tablet</span>
              </button>
              <button
                onClick={() => setDevicePreview('mobile')}
                className={`p-1.5 rounded flex items-center gap-1 ${devicePreview === 'mobile' ? 'bg-stone-900 text-white' : 'text-stone-600'}`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
            </div>

            {/* Frame Viewport Container */}
            <div className="flex justify-center">
              <div 
                className={`bg-white rounded-lg border-2 border-stone-300 shadow-xl overflow-hidden transition-all duration-300 ${
                  devicePreview === 'desktop' ? 'w-full max-w-6xl' : devicePreview === 'tablet' ? 'w-[768px]' : 'w-[375px]'
                }`}
              >
                <div className="bg-stone-200 px-4 py-2 text-[11px] font-mono text-stone-600 border-b border-stone-300 flex items-center justify-between">
                  <span>Previewing Draft: {currentTenant?.subdomain}.schoolos.net</span>
                  <span>Viewport: {devicePreview.toUpperCase()}</span>
                </div>

                <div className="p-4 sm:p-6 space-y-8 max-h-[700px] overflow-y-auto">
                  {sections.filter(s => s.isVisible).map(sec => (
                    <div key={sec.id} className="border border-dashed border-stone-200 rounded p-4 relative group">
                      <div className="text-[10px] uppercase font-mono text-stone-400 mb-1">Section: {sec.type}</div>
                      <h4 className="text-xl font-serif font-bold text-stone-900">{lang === 'bn' ? sec.titleBn : sec.title}</h4>
                      {sec.subtitle && <p className="text-xs text-stone-500 mt-1">{lang === 'bn' ? sec.subtitleBn : sec.subtitle}</p>}
                      {sec.imageUrl && (
                        <div className="mt-3 aspect-16/9 max-w-md rounded overflow-hidden">
                          <img src={sec.imageUrl} alt={sec.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      {sec.content && <p className="text-xs text-stone-700 font-sans mt-2">{lang === 'bn' ? sec.contentBn : sec.content}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* REVISION HISTORY MODAL */}
      {showRevisionsModal && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-stone-300 max-w-xl w-full p-6 shadow-2xl font-sans text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  {lang === 'bn' ? 'সংস্করণ ইতিহাস ও রোলব্যাক' : 'Page Revision History & Rollback'}
                </h3>
                <span className="text-[11px] text-stone-500">Restore earlier versions verified by editors</span>
              </div>
              <button 
                onClick={() => setShowRevisionsModal(false)}
                className="text-stone-400 hover:text-stone-700 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {revisions.length === 0 ? (
                <div className="p-6 text-center text-stone-400">No previous revisions recorded yet.</div>
              ) : (
                revisions.map((rev) => (
                  <div key={rev.id} className="p-3 rounded border border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-stone-900">v{rev.version}</span>
                        <span className="text-[11px] text-stone-500 font-mono">{new Date(rev.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="text-[11px] text-stone-600 mt-0.5">{rev.summary}</div>
                      <div className="text-[10px] text-stone-400 font-mono">By: {rev.author}</div>
                    </div>

                    <button
                      onClick={() => handleRollback(rev.id)}
                      className="px-3 py-1.5 rounded bg-stone-900 text-white hover:bg-stone-800 transition-colors flex items-center gap-1 font-semibold text-[11px]"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Rollback</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
