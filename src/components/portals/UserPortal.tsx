import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  Award, 
  Clock, 
  CheckCircle2, 
  BookOpen, 
  FileText, 
  UserCheck, 
  Phone, 
  AlertCircle 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';
import { useTenant } from '../../context/TenantContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { Student, Teacher, ExamResult, ClassRoutineItem } from '../../types/index.js';

export const UserPortal: React.FC = () => {
  const { lang, t } = useLanguage();
  const { currentTenant } = useTenant();
  const { user, role } = useAuth();

  const [studentData, setStudentData] = useState<Student | null>(null);
  const [routines, setRoutines] = useState<ClassRoutineItem[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentTenant) {
      loadPortalData();
    }
  }, [currentTenant, role]);

  const loadPortalData = async () => {
    if (!currentTenant) return;
    setIsLoading(true);
    const headers = { 'x-tenant-id': currentTenant.id };

    try {
      // Load routines
      const rRes = await fetch('/api/v1/public/routines?class=Class%2010', { headers });
      const rData = await rRes.json();
      if (rData.success) setRoutines(rData.routines || []);

      // Load results
      const resRes = await fetch('/api/v1/academic/results', { headers });
      const resData = await resRes.json();
      if (resData.success) setResults(resData.results || []);

      // Load student profile if student or guardian
      const sRes = await fetch('/api/v1/academic/students', { headers });
      const sData = await sRes.json();
      if (sData.success && sData.students?.length > 0) {
        setStudentData(sData.students[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentTenant) return null;
  const branding = currentTenant.branding;

  return (
    <div className="py-10 bg-stone-100 min-h-screen font-sans text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Portal Greeting Banner */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-stone-900 text-white flex items-center justify-center text-lg font-serif font-bold">
              {user?.name.slice(0, 2).toUpperCase() || 'ST'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-xl text-stone-900">{user?.name}</h1>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                  {role} Portal
                </span>
              </div>
              <p className="text-stone-500 text-xs mt-0.5">
                {branding.schoolName} · Academic Session 2026-2027
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-stone-600 border-t md:border-t-0 md:border-l border-stone-100 pt-2 md:pt-0 md:pl-6">
            <div>
              <span className="text-stone-400 block text-[10px] uppercase">Status</span>
              <span className="text-emerald-700 font-bold">Enrolled & Active</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase">EIIN Verified</span>
              <span className="font-bold">{branding.eiinNumber}</span>
            </div>
          </div>
        </div>

        {/* STUDENT & GUARDIAN VIEW */}
        {(role === 'STUDENT' || role === 'GUARDIAN') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 4 cols: Attendance & Ward Stats */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
                <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                  <span className="font-serif font-bold text-stone-900 text-sm">
                    {lang === 'bn' ? 'শিক্ষার্থী বিবরণী' : 'Student Academic Dossier'}
                  </span>
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                </div>

                {studentData ? (
                  <div className="space-y-2 text-stone-700">
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Student ID:</span>
                      <span className="font-mono font-bold">{studentData.studentIdNumber}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Class & Wing:</span>
                      <span className="font-semibold">{studentData.class} ({studentData.section})</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Class Roll:</span>
                      <span className="font-mono font-bold text-stone-900">{studentData.roll}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Attendance Rate:</span>
                      <span className="font-mono font-bold text-emerald-800">{studentData.attendanceRate}%</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-stone-500">Guardian Name:</span>
                      <span>{studentData.guardianName}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-stone-400">Loading profile records...</div>
                )}
              </div>

              {/* Attendance Indicator */}
              <div className="bg-emerald-900 text-white rounded-xl p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-300 font-mono uppercase tracking-wider">Today Attendance</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-serif font-bold">Recorded: PRESENT</div>
                <p className="text-xs text-emerald-200 font-sans">
                  Morning roll-call verified on 2026-10-28 for Class 10 (Science Wing).
                </p>
              </div>
            </div>

            {/* Right 8 cols: Class Routine & Exam Transcript */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Routine Card */}
              <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
                <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-stone-500" />
                    <h3 className="font-serif font-bold text-stone-900 text-sm">
                      {lang === 'bn' ? 'সাপ্তাহিক ক্লাস রুটিন ও সময়সূচি' : 'Weekly Class Routine'}
                    </h3>
                  </div>
                  <span className="font-mono text-stone-400 text-[11px]">Class 10 - Science Wing</span>
                </div>

                <div className="border border-stone-200 rounded-md overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-100 text-stone-700 font-semibold border-b border-stone-200">
                      <tr>
                        <th className="py-2.5 px-3">Day</th>
                        <th className="py-2.5 px-3">Time Slot</th>
                        <th className="py-2.5 px-3">Subject</th>
                        <th className="py-2.5 px-3">Faculty Instructor</th>
                        <th className="py-2.5 px-3">Room / Lab</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {routines.map(rt => (
                        <tr key={rt.id} className="hover:bg-stone-50/70">
                          <td className="py-2.5 px-3 font-semibold text-stone-800">{rt.day}</td>
                          <td className="py-2.5 px-3 font-mono text-stone-600">{rt.timeSlot}</td>
                          <td className="py-2.5 px-3 font-medium text-stone-900">{rt.subject}</td>
                          <td className="py-2.5 px-3 text-stone-600">{rt.teacher}</td>
                          <td className="py-2.5 px-3 font-mono text-stone-500">{rt.room}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Term Exam Transcript Card */}
              <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
                <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-700" />
                    <h3 className="font-serif font-bold text-stone-900 text-sm">
                      {lang === 'bn' ? 'পরীক্ষার গ্রেড ও ট্রান্সক্রিপ্ট' : 'Published Examination Results'}
                    </h3>
                  </div>
                  <span className="text-emerald-700 font-bold font-mono">GPA 5.00 (Grade A+)</span>
                </div>

                {results.length > 0 ? (
                  <div className="border border-stone-200 rounded-md overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-100 text-stone-700 font-semibold border-b border-stone-200">
                        <tr>
                          <th className="py-2.5 px-3">Course / Subject</th>
                          <th className="py-2.5 px-3 text-right">Marks</th>
                          <th className="py-2.5 px-3 text-center">Letter Grade</th>
                          <th className="py-2.5 px-3 text-right">GPA Point</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {results[0].subjects.map((sub, i) => (
                          <tr key={i} className="hover:bg-stone-50/70">
                            <td className="py-2.5 px-3 font-medium text-stone-900">{sub.subjectName}</td>
                            <td className="py-2.5 px-3 text-right tabular-nums font-mono">{sub.marksObtained} / {sub.totalMarks}</td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-800">{sub.grade}</td>
                            <td className="py-2.5 px-3 text-right tabular-nums font-mono">{Number(sub.gpa).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-stone-400 p-4 text-center">No results published for your profile.</div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TEACHER VIEW */}
        {role === 'TEACHER' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
            <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Faculty Instructor Dashboard
                </h3>
                <span className="text-stone-500">Department of Physics & Applied Science</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 space-y-2">
                <div className="text-xs text-stone-500 font-medium">Assigned Classes</div>
                <div className="text-lg font-serif font-bold text-stone-900">Class 10 - Section A</div>
                <div className="text-[11px] text-stone-500">Laboratory 201 (Sunday & Monday)</div>
              </div>

              <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 space-y-2">
                <div className="text-xs text-stone-500 font-medium">Enrolled Scholars in Class</div>
                <div className="text-lg font-serif font-bold text-stone-900 tabular-nums">48 Students</div>
                <div className="text-[11px] text-emerald-700">98.2% Average Attendance</div>
              </div>

              <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 space-y-2">
                <div className="text-xs text-stone-500 font-medium">Upcoming Midterm Exam</div>
                <div className="text-lg font-serif font-bold text-stone-900">Nov 15, 2026</div>
                <div className="text-[11px] text-amber-700">Question Paper Submitted</div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-dashed border-stone-300 text-stone-600 flex items-center justify-between">
              <div>
                <div className="font-semibold text-stone-900">Ready to take roll-call for today?</div>
                <div className="text-stone-500 text-[11px]">Open the central attendance registry to mark presence or absence.</div>
              </div>
              <button
                onClick={() => alert('Attendance register launched. You can mark attendance directly in the admin dashboard tab!')}
                className="px-4 py-2 rounded bg-stone-900 text-white font-semibold hover:bg-stone-800 transition-colors"
              >
                Open Roll Register
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
