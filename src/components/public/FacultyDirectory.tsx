import React from 'react';
import { Mail, Phone, GraduationCap, Award } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';
import { useTenant } from '../../context/TenantContext.js';
import { Teacher } from '../../types/index.js';

interface FacultyDirectoryProps {
  teachers: Teacher[];
}

export const FacultyDirectory: React.FC<FacultyDirectoryProps> = ({ teachers }) => {
  const { lang, t } = useLanguage();
  const { currentTenant } = useTenant();

  if (!currentTenant) return null;
  const branding = currentTenant.branding;

  return (
    <div className="py-12 sm:py-16 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="text-xs uppercase tracking-widest text-emerald-800 font-semibold mb-1">
            {lang === 'bn' ? 'ফ্যাকাল্টি ডিরেক্টরি' : 'Faculty & Staff'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            {lang === 'bn' ? 'প্রাজ্ঞ শিক্ষকমণ্ডলী ও অনুষদ' : 'Distinguished Faculty & Academic Mentors'}
          </h1>
          <p className="mt-2 text-stone-600 font-sans text-sm sm:text-base leading-relaxed">
            {lang === 'bn'
              ? 'আমাদের অভিজ্ঞ শিক্ষকমণ্ডলী শিক্ষার্থীদের মেধা, মানবিক মূল্যবোধ ও বিশ্বমানের জ্ঞানে সমৃদ্ধ করতে নিবেদিত।'
              : 'Our accomplished faculty members guide scholars toward intellectual maturity, analytical rigour, and moral leadership.'}
          </p>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
          {teachers.map((teacher) => (
            <div 
              key={teacher.id}
              className="bg-white rounded-lg border border-stone-200 p-6 flex flex-col justify-between hover:border-stone-300 transition-colors shadow-xs"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
                    <img
                      src={teacher.imageUrl || '/src/assets/images/school_principal_portrait_1793173376401.jpg'}
                      alt={teacher.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-serif font-bold text-stone-900 leading-snug">
                      {lang === 'bn' ? teacher.nameBn : teacher.name}
                    </h3>
                    <div className="text-xs text-emerald-800 font-medium mt-0.5">
                      {lang === 'bn' ? teacher.designationBn : teacher.designation}
                    </div>
                    <div className="text-[11px] text-stone-500 font-sans">
                      {lang === 'bn' ? teacher.departmentBn : teacher.department}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 text-xs text-stone-600 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{teacher.qualification}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate font-mono text-[11px]">{teacher.email}</span>
                  </div>
                </div>
              </div>

              {/* Assigned classes unboxed list */}
              {teacher.assignedClasses && teacher.assignedClasses.length > 0 && (
                <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500">
                  <span className="font-medium text-stone-700">{lang === 'bn' ? 'পাঠদান শাখা: ' : 'Assigned: '}</span>
                  <span>{teacher.assignedClasses.join(', ')}</span>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
