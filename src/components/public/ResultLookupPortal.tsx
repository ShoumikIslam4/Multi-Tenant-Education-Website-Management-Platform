import React, { useState } from 'react';
import { Search, Award, CheckCircle2, FileText, AlertCircle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';
import { useTenant } from '../../context/TenantContext.js';

export const ResultLookupPortal: React.FC = () => {
  const { lang, t } = useLanguage();
  const { currentTenant } = useTenant();

  const [studentIdNumber, setStudentIdNumber] = useState('DMRA-2026-101');
  const [roll, setRoll] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [resultData, setResultData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!currentTenant) return null;
  const branding = currentTenant.branding;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentIdNumber.trim() && !roll.trim()) return;

    setIsSearching(true);
    setErrorMsg(null);
    setResultData(null);

    try {
      const res = await fetch('/api/v1/public/verify-result', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-tenant-id': currentTenant.id 
        },
        body: JSON.stringify({
          studentIdNumber: studentIdNumber.trim(),
          roll: roll.trim()
        })
      });
      const data = await res.json();
      if (data.success && data.result) {
        setResultData(data.result);
      } else {
        setErrorMsg(data.error || 'No published result found.');
      }
    } catch (err) {
      setErrorMsg('Could not query results registry.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-stone-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-widest font-sans">
            <Award className="w-4 h-4" />
            <span>{branding.schoolName} · Examination Registry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            {lang === 'bn' ? 'অনলাইন পরীক্ষার ফলাফল অনুসন্ধান' : 'Online Examination Results & Transcript'}
          </h1>
          <p className="text-stone-600 font-sans text-sm sm:text-base max-w-xl mx-auto">
            {lang === 'bn' 
              ? 'শিক্ষার্থীর আইডি অথবা ক্লাস রোল নম্বর প্রদান করে অনুমোদিত মূল্যায়ন ফলাফল দেখুন।'
              : 'Enter student enrollment identification or roll number to inspect verified term report cards.'}
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 sm:p-8 shadow-xs mb-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end font-sans text-xs">
            <div className="sm:col-span-5">
              <label className="block font-medium text-stone-700 mb-1">
                {lang === 'bn' ? 'শিক্ষার্থী আইডি / রেজিস্ট্রেশন নম্বর' : 'Student ID / Registration'}
              </label>
              <input
                type="text"
                value={studentIdNumber}
                onChange={e => setStudentIdNumber(e.target.value)}
                placeholder="e.g. DMRA-2026-101"
                className="w-full px-3 py-2 rounded-md border border-stone-300 font-mono focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block font-medium text-stone-700 mb-1">
                {lang === 'bn' ? 'অথবা ক্লাস রোল নম্বর' : 'Or Class Roll Number'}
              </label>
              <input
                type="number"
                value={roll}
                onChange={e => setRoll(e.target.value)}
                placeholder="e.g. 1"
                className="w-full px-3 py-2 rounded-md border border-stone-300 font-mono focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>

            <div className="sm:col-span-3">
              <button
                type="submit"
                disabled={isSearching}
                className="w-full py-2 px-4 rounded-md text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{isSearching ? (lang === 'bn' ? 'অনুসন্ধান...' : 'Searching...') : (lang === 'bn' ? 'ফলাফল দেখুন' : 'Lookup')}</span>
              </button>
            </div>
          </form>

          {/* Quick Demo Pre-filled buttons */}
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-500 font-sans">
            <span>Quick test:</span>
            <button
              type="button"
              onClick={() => { setStudentIdNumber('DMRA-2026-101'); setRoll('1'); }}
              className="font-mono text-emerald-800 underline"
            >
              Roll 1 (Tahmid Hasan)
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => { setStudentIdNumber('DMRA-2026-102'); setRoll('2'); }}
              className="font-mono text-emerald-800 underline"
            >
              Roll 2 (Nusrat Jahan)
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2 font-sans mb-8">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Official Transcript Result Card */}
        {resultData && (
          <div className="bg-white rounded-xl border border-stone-300 shadow-sm overflow-hidden font-sans">
            {/* Transcript Official Header */}
            <div className="p-6 bg-stone-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs text-stone-400 font-mono uppercase tracking-wider">{branding.boardAffiliation}</div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-white mt-1">
                  {lang === 'bn' ? branding.schoolNameBn : branding.schoolName}
                </h3>
                <div className="text-xs text-emerald-400 mt-0.5">{resultData.examName} ({resultData.academicYear})</div>
              </div>

              <div className="text-right sm:border-l sm:border-stone-800 sm:pl-6">
                <div className="text-xs text-stone-400">{lang === 'bn' ? 'জিপিএ স্কোর' : 'Grade Point Average'}</div>
                <div className="text-3xl font-serif font-bold text-emerald-400 tabular-nums">
                  {Number(resultData.gpa).toFixed(2)}
                </div>
                <div className="text-xs text-stone-300 font-semibold">{lang === 'bn' ? `গ্রেড: ${resultData.grade}` : `Grade: ${resultData.grade}`}</div>
              </div>
            </div>

            {/* Student Metadata Strip */}
            <div className="p-5 bg-stone-50 border-b border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-stone-500 block">{lang === 'bn' ? 'শিক্ষার্থীর নাম' : 'Student Name'}</span>
                <span className="font-semibold text-stone-900">{resultData.studentName}</span>
              </div>
              <div>
                <span className="text-stone-500 block">{lang === 'bn' ? 'আইডি নম্বর' : 'Student ID'}</span>
                <span className="font-mono text-stone-900">{resultData.studentIdNumber}</span>
              </div>
              <div>
                <span className="text-stone-500 block">{lang === 'bn' ? 'শ্রেণী' : 'Class'}</span>
                <span className="font-semibold text-stone-900">{resultData.class}</span>
              </div>
              <div>
                <span className="text-stone-500 block">{lang === 'bn' ? 'রোল' : 'Roll'}</span>
                <span className="font-mono text-stone-900 font-bold">{resultData.roll}</span>
              </div>
            </div>

            {/* Subject Marks Table */}
            <div className="p-6">
              <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
                {lang === 'bn' ? 'বিষয়ভিত্তিক নম্বর ও গ্রেড বিবরণী' : 'Course Grade Breakdown'}
              </div>
              <div className="border border-stone-200 rounded-md overflow-hidden">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-stone-100 text-stone-700 font-semibold border-b border-stone-200">
                    <tr>
                      <th className="py-2.5 px-4">{lang === 'bn' ? 'বিষয়' : 'Subject'}</th>
                      <th className="py-2.5 px-4 text-right tabular-nums">{lang === 'bn' ? 'পূর্ণ নম্বর' : 'Total Marks'}</th>
                      <th className="py-2.5 px-4 text-right tabular-nums">{lang === 'bn' ? 'প্রাপ্ত নম্বর' : 'Marks Obtained'}</th>
                      <th className="py-2.5 px-4 text-center">{lang === 'bn' ? 'লেটার গ্রেড' : 'Grade'}</th>
                      <th className="py-2.5 px-4 text-right tabular-nums">{lang === 'bn' ? 'জিপিএ' : 'GPA'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {resultData.subjects.map((sub: any, idx: number) => (
                      <tr key={idx} className="hover:bg-stone-50/60">
                        <td className="py-2.5 px-4 font-medium text-stone-900">{sub.subjectName}</td>
                        <td className="py-2.5 px-4 text-right tabular-nums text-stone-600">{sub.totalMarks}</td>
                        <td className="py-2.5 px-4 text-right tabular-nums font-semibold text-stone-900">{sub.marksObtained}</td>
                        <td className="py-2.5 px-4 text-center">
                          <span className="font-mono font-bold text-emerald-800">{sub.grade}</span>
                        </td>
                        <td className="py-2.5 px-4 text-right tabular-nums font-mono text-stone-800">{Number(sub.gpa).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-stone-50 font-semibold text-stone-900 border-t border-stone-200">
                    <tr>
                      <td className="py-2.5 px-4">{lang === 'bn' ? 'মোট প্রাপ্ত নম্বর' : 'Aggregate Score'}</td>
                      <td className="py-2.5 px-4 text-right tabular-nums">500</td>
                      <td className="py-2.5 px-4 text-right tabular-nums text-emerald-800">{resultData.totalMarks}</td>
                      <td className="py-2.5 px-4 text-center">{resultData.grade}</td>
                      <td className="py-2.5 px-4 text-right tabular-nums font-mono text-emerald-800">{Number(resultData.gpa).toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Official Certification Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500 font-sans">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>{lang === 'bn' ? 'ডিজিটাল রেজাল্ট পাবলিকেশন অথরিটি কর্তৃক স্বীকৃত' : 'Digitally Certified by SchoolOS Academic Board'}</span>
              </div>
              <div className="font-mono text-stone-400">
                EIIN: {branding.eiinNumber} · Ver: {new Date().getFullYear()}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
