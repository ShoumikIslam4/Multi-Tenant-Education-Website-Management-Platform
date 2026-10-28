import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  FileCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Check, 
  Filter, 
  Search, 
  ShieldCheck, 
  Image as ImageIcon, 
  Upload, 
  BookOpen, 
  Layers,
  ArrowRight,
  Plus
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';
import { useTenant } from '../../context/TenantContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { 
  AdmissionApplication, 
  Student, 
  Teacher, 
  AttendanceRecord, 
  ExamResult, 
  MediaAsset, 
  AuditLogEntry 
} from '../../types/index.js';

export const AdminDashboard: React.FC = () => {
  const { lang, t } = useLanguage();
  const { currentTenant, switchTenant, refreshTenantData } = useTenant();
  const { user, role } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'admissions' | 'attendance' | 'results' | 'students' | 'media' | 'audit' | 'tenants'
  >('overview');

  // Admissions state
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<AdmissionApplication | null>(null);
  const [appReviewNote, setAppReviewNote] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Attendance state
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [attendanceDate, setAttendanceDate] = useState('2026-10-28');
  const [attendanceSheet, setAttendanceSheet] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'LATE'>>({
    'std-101': 'PRESENT',
    'std-102': 'PRESENT',
    'std-103': 'LATE',
  });
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);
  const [attendanceSuccess, setAttendanceSuccess] = useState(false);

  // Results state
  const [results, setResults] = useState<ExamResult[]>([]);

  // Media state
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaName, setNewMediaName] = useState('');

  // Audit state
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  // Super Admin: New Tenant form
  const [newTenantSubdomain, setNewTenantSubdomain] = useState('');
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantNameBn, setNewTenantNameBn] = useState('');
  const [newTenantColor, setNewTenantColor] = useState('#1e3a8a');
  const [isCreatingTenant, setIsCreatingTenant] = useState(false);

  useEffect(() => {
    if (currentTenant) {
      loadDashboardData();
    }
  }, [currentTenant, activeTab]);

  const loadDashboardData = async () => {
    if (!currentTenant) return;
    const headers = { 'x-tenant-id': currentTenant.id };

    try {
      if (activeTab === 'overview' || activeTab === 'admissions') {
        const res = await fetch('/api/v1/admissions/applications', { headers });
        const d = await res.json();
        if (d.success) setApplications(d.applications || []);
      }

      if (activeTab === 'overview' || activeTab === 'attendance' || activeTab === 'students') {
        const res = await fetch('/api/v1/academic/students', { headers });
        const d = await res.json();
        if (d.success) setStudents(d.students || []);
      }

      if (activeTab === 'results') {
        const res = await fetch('/api/v1/academic/results', { headers });
        const d = await res.json();
        if (d.success) setResults(d.results || []);
      }

      if (activeTab === 'media') {
        const res = await fetch('/api/v1/media', { headers });
        const d = await res.json();
        if (d.success) setMedia(d.media || []);
      }

      if (activeTab === 'audit') {
        const res = await fetch('/api/v1/audit-logs', { headers });
        const d = await res.json();
        if (d.success) setAuditLogs(d.logs || []);
      }
    } catch (e) {
      console.error('Error fetching dashboard tab data:', e);
    }
  };

  const handleUpdateAppStatus = async (appId: string, status: AdmissionApplication['status']) => {
    if (!currentTenant) return;
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`/api/v1/admissions/applications/${appId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': currentTenant.id
        },
        body: JSON.stringify({
          status,
          note: appReviewNote
        })
      });
      const data = await res.json();
      if (data.success && data.application) {
        setApplications(applications.map(a => a.id === appId ? data.application : a));
        setSelectedApp(data.application);
        setAppReviewNote('');
      }
    } catch (e) {
      alert('Failed to update status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSaveAttendance = async () => {
    if (!currentTenant) return;
    setIsSavingAttendance(true);
    setAttendanceSuccess(false);

    const records = students.map(s => ({
      studentId: s.id,
      studentName: s.name,
      roll: s.roll,
      status: attendanceSheet[s.id] || 'PRESENT'
    }));

    try {
      const res = await fetch('/api/v1/academic/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': currentTenant.id
        },
        body: JSON.stringify({
          className: selectedClass,
          section: 'Section A (Science)',
          date: attendanceDate,
          records
        })
      });
      const data = await res.json();
      if (data.success) {
        setAttendanceSuccess(true);
        setTimeout(() => setAttendanceSuccess(false), 3000);
      }
    } catch (e) {
      alert('Error saving attendance');
    } finally {
      setIsSavingAttendance(false);
    }
  };

  const handleTogglePublishResult = async (resultId: string) => {
    if (!currentTenant) return;
    try {
      const res = await fetch(`/api/v1/academic/results/${resultId}/publish`, {
        method: 'PUT',
        headers: { 'x-tenant-id': currentTenant.id }
      });
      const data = await res.json();
      if (data.success && data.result) {
        setResults(results.map(r => r.id === resultId ? data.result : r));
      }
    } catch (e) {
      alert('Error updating result publication state');
    }
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant || !newMediaUrl || !newMediaName) return;
    try {
      const res = await fetch('/api/v1/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': currentTenant.id
        },
        body: JSON.stringify({
          fileName: newMediaName,
          url: newMediaUrl,
          category: 'Campus',
          fileSize: 420000,
          mimeType: 'image/jpeg'
        })
      });
      const data = await res.json();
      if (data.success && data.asset) {
        setMedia([data.asset, ...media]);
        setNewMediaUrl('');
        setNewMediaName('');
      }
    } catch (e) {
      alert('Failed to upload media asset');
    }
  };

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantSubdomain || !newTenantName) return;
    setIsCreatingTenant(true);
    try {
      const res = await fetch('/api/v1/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subdomain: newTenantSubdomain,
          schoolName: newTenantName,
          schoolNameBn: newTenantNameBn || newTenantName,
          primaryColor: newTenantColor
        })
      });
      const data = await res.json();
      if (data.success && data.tenant) {
        alert(`New institution tenant '${data.tenant.branding.schoolName}' registered successfully!`);
        refreshTenantData();
        switchTenant(data.tenant.id);
        setNewTenantSubdomain('');
        setNewTenantName('');
        setNewTenantNameBn('');
      } else {
        alert(data.error || 'Failed to create tenant');
      }
    } catch (e) {
      alert('Network error creating tenant');
    } finally {
      setIsCreatingTenant(false);
    }
  };

  return (
    <div className="bg-stone-100 min-h-screen pb-16 font-sans">
      
      {/* Dashboard Sub-Header */}
      <div className="bg-white border-b border-stone-200 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg text-stone-900">
                {lang === 'bn' ? currentTenant?.branding.schoolNameBn : currentTenant?.branding.schoolName}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
                {role}
              </span>
            </div>
            <div className="text-xs text-stone-500 mt-0.5">
              Logged in as: <span className="font-semibold text-stone-800">{user?.name || 'Authorized Official'}</span> ({user?.email || 'session@schoolos'})
            </div>
          </div>

          {/* Module Navigation Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                activeTab === 'overview' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              {lang === 'bn' ? 'সারসংক্ষেপ' : 'Overview'}
            </button>
            <button
              onClick={() => setActiveTab('admissions')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                activeTab === 'admissions' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              {lang === 'bn' ? 'ভর্তি আবেদন সেল' : 'Admissions Pipeline'}
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                activeTab === 'attendance' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              {lang === 'bn' ? 'ডিজিটাল হাজিরা' : 'Attendance'}
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                activeTab === 'results' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              {lang === 'bn' ? 'ফলাফল প্রকাশ' : 'Result Publishing'}
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                activeTab === 'media' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              {lang === 'bn' ? 'মিডিয়া লাইব্রেরি' : 'Media Assets'}
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                activeTab === 'audit' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              {lang === 'bn' ? 'নিরাপত্তা অডিট লগ' : 'Audit Logs'}
            </button>
            {role === 'SUPER_ADMIN' && (
              <button
                onClick={() => setActiveTab('tenants')}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                  activeTab === 'tenants' ? 'bg-emerald-800 text-white' : 'text-emerald-800 hover:bg-emerald-100 font-semibold'
                }`}
              >
                + New Tenant
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">

        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs space-y-1">
                <div className="text-xs text-stone-500 font-medium">{lang === 'bn' ? 'মোট শিক্ষার্থী' : 'Enrolled Students'}</div>
                <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">2,480</div>
                <div className="text-[11px] text-emerald-700">Verified academic enrollment</div>
              </div>

              <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs space-y-1">
                <div className="text-xs text-stone-500 font-medium">{lang === 'bn' ? 'অপেক্ষমান ভর্তি আবেদন' : 'Pending Applications'}</div>
                <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">{applications.length}</div>
                <div className="text-[11px] text-amber-700">Session 2026-2027 Pipeline</div>
              </div>

              <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs space-y-1">
                <div className="text-xs text-stone-500 font-medium">{lang === 'bn' ? 'আজকের সামগ্রিক উপস্থিতি' : 'Today Attendance'}</div>
                <div className="text-2xl font-serif font-bold text-emerald-700 tabular-nums">96.8%</div>
                <div className="text-[11px] text-stone-500">Date: 2026-10-28</div>
              </div>

              <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs space-y-1">
                <div className="text-xs text-stone-500 font-medium">{lang === 'bn' ? 'সক্রিয় অনুষদ শিক্ষক' : 'Teaching Faculty'}</div>
                <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">96</div>
                <div className="text-[11px] text-stone-500">Science, Arts & Commerce</div>
              </div>
            </div>

            {/* Quick Action Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Recent Admissions Review (7 cols) */}
              <div className="lg:col-span-7 bg-white rounded-lg border border-stone-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <h3 className="font-serif font-bold text-stone-900 text-sm">
                    {lang === 'bn' ? 'সাম্প্রতিক ভর্তি আবেদনসমূহ' : 'Recent Admissions Queue'}
                  </h3>
                  <button onClick={() => setActiveTab('admissions')} className="text-xs text-emerald-800 font-medium hover:underline">
                    View All
                  </button>
                </div>

                <div className="divide-y divide-stone-100">
                  {applications.slice(0, 3).map(app => (
                    <div key={app.id} className="py-3 flex items-center justify-between text-xs gap-3">
                      <div>
                        <div className="font-semibold text-stone-900">{app.studentNameEn}</div>
                        <div className="text-[11px] text-stone-500 font-sans">
                          {app.applyingClass} · Ref: <span className="font-mono text-stone-700">{app.referenceNumber}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-[11px] font-semibold text-stone-800">{app.status}</span>
                        <div className="text-[10px] text-stone-400">{new Date(app.submittedAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security & System Status (5 cols) */}
              <div className="lg:col-span-5 bg-white rounded-lg border border-stone-200 p-5 shadow-xs space-y-4">
                <div className="border-b border-stone-200 pb-3">
                  <h3 className="font-serif font-bold text-stone-900 text-sm">
                    {lang === 'bn' ? 'সিস্টেম স্ট্যাটাস ও তথ্য সুরক্ষা' : 'Institution Security & Tenancy'}
                  </h3>
                </div>

                <div className="text-xs space-y-2 text-stone-600">
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Tenant Domain:</span>
                    <span className="font-mono font-medium text-stone-900">{currentTenant?.subdomain}.schoolos.net</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Data Isolation:</span>
                    <span className="text-emerald-700 font-semibold">Strict Tenant Scope Enforced</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Database Engine:</span>
                    <span className="font-mono text-stone-800">MongoDB / Mongoose Repository</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-500">RBAC Enforcement:</span>
                    <span className="font-mono text-emerald-800 font-medium">Server-side Guard (Level 1)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ADMISSIONS WORKFLOW */}
        {activeTab === 'admissions' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Applications List (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-lg border border-stone-200 p-5 shadow-xs space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h3 className="font-serif font-bold text-stone-900 text-sm">
                  {lang === 'bn' ? 'ভর্তি আবেদনকারী তালিকা' : 'Applicant Pipeline Table'}
                </h3>
                <span className="text-stone-500 font-mono">{applications.length} Records</span>
              </div>

              <div className="divide-y divide-stone-100">
                {applications.map(app => (
                  <div 
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`p-3 rounded-md cursor-pointer transition-colors flex items-center justify-between ${
                      selectedApp?.id === app.id ? 'bg-emerald-50/70 border border-emerald-500' : 'hover:bg-stone-50'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-stone-900">{app.studentNameEn}</div>
                      <div className="text-[11px] text-stone-500">
                        {app.applyingClass} · Ref: <span className="font-mono text-stone-700">{app.referenceNumber}</span>
                      </div>
                      <div className="text-[11px] text-stone-400">Guardian: {app.guardianName} ({app.guardianPhone})</div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                        app.status === 'UNDER_REVIEW' ? 'bg-amber-100 text-amber-800' :
                        app.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-stone-200 text-stone-800'
                      }`}>
                        {app.status}
                      </span>
                      <div className="text-[10px] text-stone-400 mt-1 font-mono">{new Date(app.submittedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Reviewer Panel (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-lg border border-stone-200 p-5 shadow-xs text-xs space-y-4">
              {selectedApp ? (
                <div className="space-y-4">
                  <div className="border-b border-stone-200 pb-3">
                    <span className="text-stone-400 uppercase tracking-wider text-[10px]">Reviewing Dossier</span>
                    <h4 className="font-serif font-bold text-base text-stone-900">{selectedApp.studentNameEn}</h4>
                    <span className="font-mono text-emerald-800 font-bold">{selectedApp.referenceNumber}</span>
                  </div>

                  <div className="space-y-2 text-stone-700">
                    <div><span className="text-stone-500">Applying Class:</span> <span className="font-semibold">{selectedApp.applyingClass}</span></div>
                    <div><span className="text-stone-500">Date of Birth:</span> <span>{selectedApp.dateOfBirth} ({selectedApp.gender})</span></div>
                    <div><span className="text-stone-500">Guardian:</span> <span>{selectedApp.guardianName} ({selectedApp.guardianPhone})</span></div>
                    <div><span className="text-stone-500">Previous School:</span> <span>{selectedApp.previousSchool || 'N/A'}</span></div>
                    <div><span className="text-stone-500">Address:</span> <span>{selectedApp.address}</span></div>
                  </div>

                  {/* Internal Evaluation Notes History */}
                  <div className="pt-2 border-t border-stone-200">
                    <div className="font-semibold text-stone-800 mb-2">Internal Review Notes:</div>
                    {selectedApp.notes && selectedApp.notes.length > 0 ? (
                      <div className="space-y-1.5 max-h-32 overflow-y-auto">
                        {selectedApp.notes.map((n, i) => (
                          <div key={i} className="p-2 rounded bg-stone-50 border border-stone-200 text-[11px]">
                            <div className="font-medium text-stone-800">{n.comment}</div>
                            <div className="text-[10px] text-stone-400 font-mono mt-0.5">By {n.author} · {new Date(n.timestamp).toLocaleDateString()}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-stone-400 italic text-[11px]">No internal remarks recorded yet.</div>
                    )}
                  </div>

                  {/* Add Note & Update Status */}
                  <div className="space-y-2 pt-2 border-t border-stone-200">
                    <label className="block text-stone-600 font-medium">Add Official Decision Remark:</label>
                    <textarea
                      rows={2}
                      value={appReviewNote}
                      onChange={e => setAppReviewNote(e.target.value)}
                      placeholder="e.g. Verified transcripts. Marks sheet cleared."
                      className="w-full p-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => handleUpdateAppStatus(selectedApp.id, 'APPROVED')}
                        disabled={isUpdatingStatus}
                        className="py-1.5 rounded bg-emerald-800 text-white font-semibold hover:bg-emerald-700 transition-colors"
                      >
                        Approve Admission
                      </button>
                      <button
                        onClick={() => handleUpdateAppStatus(selectedApp.id, 'UNDER_REVIEW')}
                        disabled={isUpdatingStatus}
                        className="py-1.5 rounded bg-amber-700 text-white font-semibold hover:bg-amber-600 transition-colors"
                      >
                        Set Under Review
                      </button>
                      <button
                        onClick={() => handleUpdateAppStatus(selectedApp.id, 'INFO_REQUESTED')}
                        disabled={isUpdatingStatus}
                        className="py-1.5 rounded bg-stone-700 text-white hover:bg-stone-600 transition-colors"
                      >
                        Request Documents
                      </button>
                      <button
                        onClick={() => handleUpdateAppStatus(selectedApp.id, 'REJECTED')}
                        disabled={isUpdatingStatus}
                        className="py-1.5 rounded bg-rose-700 text-white hover:bg-rose-600 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-stone-400">
                  Select an applicant on the left to review details and record decisions.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ATTENDANCE MANAGEMENT */}
        {activeTab === 'attendance' && (
          <div className="bg-white rounded-lg border border-stone-200 p-6 shadow-xs space-y-6 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200 pb-4 gap-4">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  {lang === 'bn' ? 'দৈনিক ডিজিটাল হাজিরা খাতা' : 'Daily Digital Attendance Register'}
                </h3>
                <span className="text-stone-500">Record and persist daily attendance for classes</span>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={e => setAttendanceDate(e.target.value)}
                  className="px-2 py-1 rounded border border-stone-300 font-mono"
                />
                <button
                  onClick={handleSaveAttendance}
                  disabled={isSavingAttendance}
                  className="px-4 py-1.5 rounded bg-stone-900 text-white hover:bg-stone-800 font-semibold transition-colors"
                >
                  {isSavingAttendance ? 'Saving...' : 'Save Roll Call'}
                </button>
              </div>
            </div>

            {attendanceSuccess && (
              <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Attendance successfully persisted in MongoDB datastore.</span>
              </div>
            )}

            {/* Attendance Table */}
            <div className="border border-stone-200 rounded-md overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-700 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="py-2.5 px-4 w-16">Roll</th>
                    <th className="py-2.5 px-4">Student ID & Name</th>
                    <th className="py-2.5 px-4">Guardian Contact</th>
                    <th className="py-2.5 px-4 text-center">Mark Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {students.map(s => {
                    const currentStatus = attendanceSheet[s.id] || 'PRESENT';
                    return (
                      <tr key={s.id} className="hover:bg-stone-50">
                        <td className="py-3 px-4 font-mono font-bold text-stone-800">{s.roll}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-stone-900">{s.name} ({s.nameBn})</div>
                          <div className="text-[11px] text-stone-500 font-mono">{s.studentIdNumber}</div>
                        </td>
                        <td className="py-3 px-4 text-stone-600 font-mono text-[11px]">
                          {s.guardianPhone}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex rounded-md border border-stone-300 p-0.5 bg-stone-50">
                            <button
                              onClick={() => setAttendanceSheet({ ...attendanceSheet, [s.id]: 'PRESENT' })}
                              className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors ${
                                currentStatus === 'PRESENT' ? 'bg-emerald-700 text-white' : 'text-stone-600 hover:text-stone-900'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => setAttendanceSheet({ ...attendanceSheet, [s.id]: 'LATE' })}
                              className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors ${
                                currentStatus === 'LATE' ? 'bg-amber-600 text-white' : 'text-stone-600 hover:text-stone-900'
                              }`}
                            >
                              Late
                            </button>
                            <button
                              onClick={() => setAttendanceSheet({ ...attendanceSheet, [s.id]: 'ABSENT' })}
                              className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors ${
                                currentStatus === 'ABSENT' ? 'bg-rose-700 text-white' : 'text-stone-600 hover:text-stone-900'
                              }`}
                            >
                              Absent
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: RESULT PUBLISHING */}
        {activeTab === 'results' && (
          <div className="bg-white rounded-lg border border-stone-200 p-6 shadow-xs space-y-6 text-xs">
            <div className="border-b border-stone-200 pb-4">
              <h3 className="font-serif font-bold text-base text-stone-900">
                {lang === 'bn' ? 'পরীক্ষার ফলাফল প্রকাশনা কন্ট্রোল' : 'Exam Result Publication & Visibility Control'}
              </h3>
              <p className="text-stone-500 mt-0.5">
                Only records flagged as <span className="font-mono text-emerald-800 font-bold">Published</span> are queryable by public students and parents.
              </p>
            </div>

            <div className="space-y-4">
              {results.map(r => (
                <div key={r.id} className="p-4 rounded-md border border-stone-200 bg-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-sm text-stone-900">{r.studentName} (Roll {r.roll})</div>
                    <div className="text-[11px] text-stone-500 font-mono">
                      ID: {r.studentIdNumber} · {r.examName} ({r.academicYear})
                    </div>
                    <div className="text-xs text-stone-700 mt-1">
                      GPA: <span className="font-bold text-emerald-800">{Number(r.gpa).toFixed(2)}</span> · Grade: <span className="font-bold">{r.grade}</span> (Total: {r.totalMarks})
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${r.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'}`}>
                      {r.isPublished ? 'Publicly Live' : 'Unpublished (Private)'}
                    </span>

                    <button
                      onClick={() => handleTogglePublishResult(r.id)}
                      className={`px-3 py-1.5 rounded text-xs font-semibold text-white transition-colors ${
                        r.isPublished ? 'bg-stone-700 hover:bg-stone-800' : 'bg-emerald-800 hover:bg-emerald-700'
                      }`}
                    >
                      {r.isPublished ? 'Unpublish Result' : 'Publish to Public'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: MEDIA ASSETS */}
        {activeTab === 'media' && (
          <div className="bg-white rounded-lg border border-stone-200 p-6 shadow-xs space-y-6 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200 pb-4 gap-4">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  {lang === 'bn' ? 'ইনস্টিটিউট মিডিয়া লাইব্রেরি' : 'Media Library & Digital Assets'}
                </h3>
                <span className="text-stone-500">Manage high-resolution institutional imagery</span>
              </div>
            </div>

            {/* Quick Add Asset Form */}
            <form onSubmit={handleAddMedia} className="p-4 rounded-md bg-stone-50 border border-stone-200 flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-stone-600 font-medium mb-1">Asset Title / File Name</label>
                <input
                  type="text"
                  required
                  value={newMediaName}
                  onChange={e => setNewMediaName(e.target.value)}
                  placeholder="e.g. new_lab_equipment.jpg"
                  className="w-full px-2 py-1.5 rounded border border-stone-300 font-mono text-xs"
                />
              </div>

              <div className="flex-1 min-w-[260px]">
                <label className="block text-stone-600 font-medium mb-1">Image URL / Path</label>
                <input
                  type="text"
                  required
                  value={newMediaUrl}
                  onChange={e => setNewMediaUrl(e.target.value)}
                  placeholder="/src/assets/images/..."
                  className="w-full px-2 py-1.5 rounded border border-stone-300 font-mono text-xs"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-stone-900 text-white hover:bg-stone-800 font-semibold transition-colors"
              >
                Register Asset
              </button>
            </form>

            {/* Assets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {media.map(m => (
                <div key={m.id} className="rounded border border-stone-200 overflow-hidden bg-stone-50">
                  <div className="aspect-16/10 bg-stone-200 overflow-hidden">
                    <img src={m.url} alt={m.altText} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 space-y-1">
                    <div className="font-bold text-stone-900 truncate">{m.fileName}</div>
                    <div className="text-[11px] text-stone-500 font-mono truncate">{m.url}</div>
                    <div className="text-[10px] text-stone-400">Used in: {m.usedIn.join(', ')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-lg border border-stone-200 p-6 shadow-xs space-y-4 text-xs font-sans">
            <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  {lang === 'bn' ? 'নিরাপত্তা ও অপারেশন অডিট লগ' : 'Security Audit & Compliance Logs'}
                </h3>
                <span className="text-stone-500">Immutable ledger of state modifications</span>
              </div>
              <span className="text-xs font-mono text-stone-400">{auditLogs.length} Events</span>
            </div>

            <div className="divide-y divide-stone-100">
              {auditLogs.map(l => (
                <div key={l.id} className="py-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-emerald-800">{l.action}</span>
                    <span className="text-[11px] text-stone-400 font-mono">{new Date(l.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="text-stone-700">{l.details}</div>
                  <div className="text-[10px] text-stone-400 font-mono">
                    Actor: {l.actorEmail} ({l.actorRole}) · IP: {l.ipAddress} · Entity: {l.entity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: SUPER ADMIN MULTI-TENANT PROVISIONING */}
        {activeTab === 'tenants' && role === 'SUPER_ADMIN' && (
          <div className="bg-white rounded-lg border border-stone-200 p-6 sm:p-8 shadow-xs max-w-2xl mx-auto space-y-6 text-xs">
            <div className="border-b border-stone-200 pb-3">
              <h3 className="font-serif font-bold text-base text-stone-900">
                Register New Institution Tenant
              </h3>
              <p className="text-stone-500 mt-0.5">
                Provisions independent branding, subdomain mapping, and separate pages & student databases.
              </p>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Subdomain Slug (e.g. rajshahi-cadet) *</label>
                <input
                  type="text"
                  required
                  value={newTenantSubdomain}
                  onChange={e => setNewTenantSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="e.g. sylhet-college"
                  className="w-full p-2 border border-stone-300 rounded font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Institution Full Name (English) *</label>
                <input
                  type="text"
                  required
                  value={newTenantName}
                  onChange={e => setNewTenantName(e.target.value)}
                  placeholder="e.g. Sylhet Collegiate Model School"
                  className="w-full p-2 border border-stone-300 rounded font-medium"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Institution Full Name (Bangla)</label>
                <input
                  type="text"
                  value={newTenantNameBn}
                  onChange={e => setNewTenantNameBn(e.target.value)}
                  placeholder="e.g. সিলেট কলেজিয়েট মডেল স্কুল"
                  className="w-full p-2 border border-stone-300 rounded"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Primary Theme Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newTenantColor}
                    onChange={e => setNewTenantColor(e.target.value)}
                    className="w-8 h-8 rounded border cursor-pointer"
                  />
                  <span className="font-mono">{newTenantColor}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreatingTenant}
                className="w-full py-2.5 rounded bg-emerald-800 text-white font-bold hover:bg-emerald-700 transition-colors"
              >
                {isCreatingTenant ? 'Provisioning...' : 'Provision New Institution'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
