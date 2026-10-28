import React, { useState } from 'react';
import { 
  CheckCircle2, 
  FileCheck, 
  Search, 
  Clock, 
  AlertCircle, 
  GraduationCap, 
  Printer, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';
import { useTenant } from '../../context/TenantContext.js';

export const AdmissionsPortal: React.FC = () => {
  const { lang, t } = useLanguage();
  const { currentTenant } = useTenant();

  const [activeTab, setActiveTab] = useState<'apply' | 'track'>('apply');

  // Application form fields
  const [formData, setFormData] = useState({
    studentNameEn: '',
    studentNameBn: '',
    dateOfBirth: '2012-06-15',
    gender: 'MALE',
    applyingClass: 'Class 6',
    academicYear: '2026-2027',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    previousSchool: '',
    address: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    referenceNumber: string;
    studentName: string;
    applyingClass: string;
    academicYear: string;
    submittedAt: string;
  } | null>(null);

  // Tracking fields
  const [trackRef, setTrackRef] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [trackResult, setTrackResult] = useState<any>(null);
  const [trackError, setTrackError] = useState<string | null>(null);

  if (!currentTenant) return null;
  const branding = currentTenant.branding;

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentNameEn || !formData.guardianName || !formData.guardianPhone) {
      alert(lang === 'bn' ? 'অনুগ্রহ করে সকল তারকাচিহ্নিত তথ্য পূরণ করুন।' : 'Please fill in all mandatory fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/v1/admissions/apply', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-tenant-id': currentTenant.id 
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success && data.application) {
        setSubmissionSuccess(data.application);
      } else {
        alert(data.error || 'Submission failed.');
      }
    } catch (err) {
      alert('Network error while submitting application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackRef.trim()) return;

    setIsSearching(true);
    setTrackError(null);
    setTrackResult(null);

    try {
      const res = await fetch(`/api/v1/admissions/track/${encodeURIComponent(trackRef.trim())}`, {
        headers: { 'x-tenant-id': currentTenant.id }
      });
      const data = await res.json();
      if (data.success && data.application) {
        setTrackResult(data.application);
      } else {
        setTrackError(data.error || 'No application record found.');
      }
    } catch (err) {
      setTrackError('Could not connect to the admissions registry.');
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <span className="text-emerald-700 font-semibold">{lang === 'bn' ? 'ভর্তি অনুমোদিত (Approved)' : 'Approved'}</span>;
      case 'UNDER_REVIEW':
        return <span className="text-amber-700 font-semibold">{lang === 'bn' ? 'যাচাই প্রক্রিয়াধীন (Under Review)' : 'Under Review'}</span>;
      case 'INFO_REQUESTED':
        return <span className="text-orange-700 font-semibold">{lang === 'bn' ? 'অতিরিক্ত তথ্যের প্রয়োজন' : 'More Info Requested'}</span>;
      case 'REJECTED':
        return <span className="text-rose-700 font-semibold">{lang === 'bn' ? 'আবেদন বাতিল' : 'Rejected'}</span>;
      default:
        return <span className="text-stone-700 font-semibold">{lang === 'bn' ? 'আবেদন দাখিল সম্পন্ন (Submitted)' : 'Submitted'}</span>;
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-stone-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header Banner */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-widest font-sans">
            <GraduationCap className="w-4 h-4" />
            <span>{branding.schoolName} · Admission Session 2026-2027</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            {lang === 'bn' ? 'অনলাইন ভর্তি ও আবেদন ট্র্যাকিং পোর্টাল' : 'Online Admission & Application Tracking'}
          </h1>
          <p className="text-stone-600 font-sans text-sm sm:text-base max-w-xl mx-auto">
            {lang === 'bn' 
              ? 'নতুন শিক্ষাবর্ষে ভর্তির জন্য অনলাইন আবেদন দাখিল করুন অথবা পূর্বে দাখিলকৃত আবেদনের বর্তমান অবস্থা জানুন।'
              : 'Submit your enrollment credentials or verify the real-time evaluation status of your submitted dossier.'}
          </p>
        </div>

        {/* Tab Selector (Segmented control) */}
        <div className="flex items-center justify-center mb-8">
          <div className="p-1 bg-stone-200/80 rounded-lg flex items-center gap-1 shadow-inner">
            <button
              onClick={() => setActiveTab('apply')}
              className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'apply'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {lang === 'bn' ? '১. নতুন ভর্তি আবেদন' : '1. New Application'}
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'track'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {lang === 'bn' ? '২. আবেদনের অবস্থা জানুন' : '2. Track Status'}
            </button>
          </div>
        </div>

        {/* TAB 1: NEW APPLICATION */}
        {activeTab === 'apply' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 sm:p-10 shadow-xs">
            {submissionSuccess ? (
              <div className="space-y-6 text-center py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-bold text-stone-900">
                    {lang === 'bn' ? 'আবেদন সফলভাবে দাখিল হয়েছে!' : 'Application Successfully Submitted!'}
                  </h3>
                  <p className="text-stone-600 font-sans text-sm max-w-md mx-auto">
                    {lang === 'bn'
                      ? 'আপনার আবেদন নম্বরটি সতর্কতার সাথে সংরক্ষণ করুন। পরবর্তীতে ফলাফল ও অগ্রগতি জানতে এটি প্রয়োজন হবে।'
                      : 'Please preserve your unique admission reference voucher. You will need it to track your admission review.'}
                  </p>
                </div>

                {/* Voucher Card */}
                <div className="max-w-md mx-auto p-6 rounded-lg bg-stone-50 border border-stone-300 text-left space-y-3 font-sans">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                    <span className="text-xs text-stone-500 uppercase tracking-wider">{lang === 'bn' ? 'রেফারেন্স নম্বর' : 'Reference No.'}</span>
                    <span className="font-mono text-base font-bold text-emerald-800">{submissionSuccess.referenceNumber}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500">{lang === 'bn' ? 'শিক্ষার্থীর নাম' : 'Student Name'}</span>
                    <span className="font-semibold text-stone-900">{submissionSuccess.studentName}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500">{lang === 'bn' ? 'আবেদিত শ্রেণী' : 'Class Applied'}</span>
                    <span className="font-semibold text-stone-900">{submissionSuccess.applyingClass} ({submissionSuccess.academicYear})</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500">{lang === 'bn' ? 'দাখিলের সময়' : 'Submission Time'}</span>
                    <span className="text-stone-700 font-mono">{new Date(submissionSuccess.submittedAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                  <button
                    onClick={() => {
                      setTrackRef(submissionSuccess.referenceNumber);
                      setActiveTab('track');
                    }}
                    className="px-5 py-2.5 rounded-md text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors flex items-center gap-2"
                  >
                    <span>{lang === 'bn' ? 'আবেদনের অবস্থা দেখুন' : 'Check Status Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setSubmissionSuccess(null);
                      setFormData({
                        studentNameEn: '',
                        studentNameBn: '',
                        dateOfBirth: '2012-06-15',
                        gender: 'MALE',
                        applyingClass: 'Class 6',
                        academicYear: '2026-2027',
                        guardianName: '',
                        guardianPhone: '',
                        guardianEmail: '',
                        previousSchool: '',
                        address: '',
                      });
                    }}
                    className="px-5 py-2.5 rounded-md text-xs font-medium border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors"
                  >
                    {lang === 'bn' ? 'আরেকটি আবেদন দাখিল করুন' : 'Submit Another Application'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-6">
                <div className="border-b border-stone-200 pb-4">
                  <h3 className="text-lg font-serif font-bold text-stone-900">
                    {lang === 'bn' ? 'শিক্ষার্থীর ব্যক্তিগত তথ্য' : 'Student Personal Credentials'}
                  </h3>
                  <p className="text-xs text-stone-500 font-sans mt-0.5">
                    {lang === 'bn' ? 'জন্মনিবন্ধন সনদ অনুযায়ী সঠিক বানান লিখুন' : 'Exact spellings as listed on birth certificate'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-sans text-xs">
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      {lang === 'bn' ? 'শিক্ষার্থীর পূর্ণ নাম (ইংরেজিতে) *' : 'Student Full Name (English) *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.studentNameEn}
                      onChange={e => setFormData({ ...formData, studentNameEn: e.target.value })}
                      placeholder="e.g. Tanvir Ahmed Chowdhury"
                      className="w-full px-3 py-2 rounded-md border border-stone-300 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      {lang === 'bn' ? 'শিক্ষার্থীর নাম (বাংলায়)' : 'Student Name (Bangla)'}
                    </label>
                    <input
                      type="text"
                      value={formData.studentNameBn}
                      onChange={e => setFormData({ ...formData, studentNameBn: e.target.value })}
                      placeholder="যেমন: তানভীর আহমেদ চৌধুরী"
                      className="w-full px-3 py-2 rounded-md border border-stone-300 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      {lang === 'bn' ? 'জন্ম তারিখ *' : 'Date of Birth *'}
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full px-3 py-2 rounded-md border border-stone-300 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      {lang === 'bn' ? 'লিঙ্গ *' : 'Gender *'}
                    </label>
                    <select
                      value={formData.gender}
                      onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-md border border-stone-300 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                    >
                      <option value="MALE">{lang === 'bn' ? 'ছাত্র (Male)' : 'Male'}</option>
                      <option value="FEMALE">{lang === 'bn' ? 'ছাত্রী (Female)' : 'Female'}</option>
                      <option value="OTHER">{lang === 'bn' ? 'অন্যান্য (Other)' : 'Other'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      {lang === 'bn' ? 'আবেদিত শ্রেণী *' : 'Applying Class *'}
                    </label>
                    <select
                      value={formData.applyingClass}
                      onChange={e => setFormData({ ...formData, applyingClass: e.target.value })}
                      className="w-full px-3 py-2 rounded-md border border-stone-300 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400 font-medium"
                    >
                      <option value="Class 6">Class 6 (৬ষ্ঠ শ্রেণী)</option>
                      <option value="Class 7">Class 7 (৭ম শ্রেণী)</option>
                      <option value="Class 8">Class 8 (৮ম শ্রেণী)</option>
                      <option value="Class 9 (Science)">Class 9 - Science (৯ম বিজ্ঞান)</option>
                      <option value="Class 9 (Business)">Class 9 - Business Studies (৯ম ব্যবসায় শিক্ষা)</option>
                      <option value="Class 11 (Science)">Class 11 - College Science (একাদশ বিজ্ঞান)</option>
                      <option value="Class 11 (Business)">Class 11 - College Commerce (একাদশ ব্যবসায়)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      {lang === 'bn' ? 'শিক্ষাবর্ষ' : 'Academic Session'}
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={formData.academicYear}
                      className="w-full px-3 py-2 rounded-md border border-stone-200 bg-stone-100 text-stone-500 font-mono"
                    />
                  </div>
                </div>

                {/* Guardian Details */}
                <div className="border-b border-stone-200 pb-4 pt-4">
                  <h3 className="text-lg font-serif font-bold text-stone-900">
                    {lang === 'bn' ? 'অভিভাবকের যোগাযোগ তথ্য' : 'Guardian Contact & Address'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-sans text-xs">
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      {lang === 'bn' ? 'পিতা/অভিভাবকের নাম *' : 'Guardian Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.guardianName}
                      onChange={e => setFormData({ ...formData, guardianName: e.target.value })}
                      placeholder="e.g. Engr. Masud Alam"
                      className="w-full px-3 py-2 rounded-md border border-stone-300 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      {lang === 'bn' ? 'সচল মোবাইল নম্বর (এসএমএস প্রাপ্তির জন্য) *' : 'Active Mobile Phone (For SMS Updates) *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.guardianPhone}
                      onChange={e => setFormData({ ...formData, guardianPhone: e.target.value })}
                      placeholder="+880 1700-000000"
                      className="w-full px-3 py-2 rounded-md border border-stone-300 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      {lang === 'bn' ? 'ইমেইল এড্রেস (ঐচ্ছিক)' : 'Guardian Email (Optional)'}
                    </label>
                    <input
                      type="email"
                      value={formData.guardianEmail}
                      onChange={e => setFormData({ ...formData, guardianEmail: e.target.value })}
                      placeholder="guardian@example.com"
                      className="w-full px-3 py-2 rounded-md border border-stone-300 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      {lang === 'bn' ? 'পূর্ববর্তী স্কুলের নাম' : 'Previous Educational Institute'}
                    </label>
                    <input
                      type="text"
                      value={formData.previousSchool}
                      onChange={e => setFormData({ ...formData, previousSchool: e.target.value })}
                      placeholder="e.g. Model Primary School"
                      className="w-full px-3 py-2 rounded-md border border-stone-300 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-medium text-stone-700 mb-1">
                      {lang === 'bn' ? 'বর্তমান পূর্ণ ঠিকানা *' : 'Present Residence Address *'}
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      placeholder="House, Road, Area, City"
                      className="w-full px-3 py-2 rounded-md border border-stone-300 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                  <div className="text-[11px] text-stone-500 font-sans flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>{lang === 'bn' ? 'তথ্য গোপনীয়তা আইন অনুসারে সংরক্ষিত' : 'Secure encrypted admission processing'}</span>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-md text-xs font-semibold text-white transition-opacity shadow-xs"
                    style={{ backgroundColor: branding.primaryColor || '#0f766e' }}
                  >
                    {isSubmitting ? (lang === 'bn' ? 'দাখিল হচ্ছে...' : 'Submitting...') : t('adm.submit')}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: TRACK STATUS */}
        {activeTab === 'track' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 sm:p-10 shadow-xs space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <h3 className="text-lg font-serif font-bold text-stone-900">
                {lang === 'bn' ? 'ভর্তি আবেদনের অবস্থা অনুসন্ধান' : 'Track Application Status'}
              </h3>
              <p className="text-xs text-stone-500 font-sans mt-0.5">
                {lang === 'bn' 
                  ? 'ফর্ম পূরণের সময় প্রাপ্ত রেফারেন্স নম্বর প্রদান করুন (যেমন: DMRA-ADM-7821)' 
                  : 'Enter your assigned application voucher reference (e.g., DMRA-ADM-7821)'}
              </p>
            </div>

            <form onSubmit={handleTrack} className="flex gap-3 max-w-lg">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={trackRef}
                  onChange={e => setTrackRef(e.target.value)}
                  placeholder="e.g. DMRA-ADM-7821"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-stone-300 font-mono focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="px-5 py-2 rounded-md text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 transition-colors"
              >
                {isSearching ? (lang === 'bn' ? 'অনুসন্ধান...' : 'Searching...') : (lang === 'bn' ? 'যাচাই করুন' : 'Verify')}
              </button>
            </form>

            {/* Quick Demo Pre-filled suggestions */}
            <div className="text-xs text-stone-500 font-sans flex items-center gap-2">
              <span>Try test reference:</span>
              <button
                type="button"
                onClick={() => setTrackRef('DMRA-ADM-7821')}
                className="font-mono text-emerald-700 underline"
              >
                DMRA-ADM-7821
              </button>
              <span>or</span>
              <button
                type="button"
                onClick={() => setTrackRef('DMRA-ADM-7822')}
                className="font-mono text-emerald-700 underline"
              >
                DMRA-ADM-7822
              </button>
            </div>

            {trackError && (
              <div className="p-4 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2 font-sans">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{trackError}</span>
              </div>
            )}

            {trackResult && (
              <div className="p-6 rounded-lg bg-stone-50 border border-stone-200 space-y-4 font-sans text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 gap-2">
                  <div>
                    <span className="text-stone-500 block text-[11px] uppercase tracking-wider">{lang === 'bn' ? 'রেফারেন্স আইডি' : 'Reference ID'}</span>
                    <span className="font-mono font-bold text-base text-stone-900">{trackResult.referenceNumber}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px] uppercase tracking-wider">{lang === 'bn' ? 'বর্তমান অবস্থা' : 'Current Status'}</span>
                    <div className="text-sm">{getStatusBadge(trackResult.status)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-stone-500 block">{lang === 'bn' ? 'শিক্ষার্থীর নাম' : 'Student Name'}</span>
                    <span className="font-semibold text-stone-900">{trackResult.studentNameEn}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">{lang === 'bn' ? 'আবেদিত শ্রেণী' : 'Applied Class'}</span>
                    <span className="font-semibold text-stone-900">{trackResult.applyingClass} ({trackResult.academicYear})</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">{lang === 'bn' ? 'অভিভাবকের নাম' : 'Guardian Name'}</span>
                    <span className="font-semibold text-stone-900">{trackResult.guardianName}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">{lang === 'bn' ? 'যোগাযোগ নম্বর' : 'Phone (Masked)'}</span>
                    <span className="font-mono text-stone-700">{trackResult.guardianPhoneMasked}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">{lang === 'bn' ? 'দাখিলের তারিখ' : 'Submitted Date'}</span>
                    <span className="font-mono text-stone-700">{new Date(trackResult.submittedAt).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">{lang === 'bn' ? 'সর্বশেষ আপডেট' : 'Last Updated'}</span>
                    <span className="font-mono text-stone-700">{new Date(trackResult.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
