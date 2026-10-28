import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'bn' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, { bn: string; en: string }> = {
  // Navigation & Core
  'nav.home': { bn: 'মূল পাতা', en: 'Home' },
  'nav.about': { bn: 'পরিচিতি', en: 'About' },
  'nav.academics': { bn: 'শিক্ষা কার্যক্রম', en: 'Academics' },
  'nav.admissions': { bn: 'ভর্তি তথ্য', en: 'Admissions' },
  'nav.notices': { bn: 'বিজ্ঞপ্তি', en: 'Notices' },
  'nav.faculty': { bn: 'শিক্ষকমণ্ডলী', en: 'Faculty' },
  'nav.events': { bn: 'ইভেন্টসমূহ', en: 'Events' },
  'nav.results': { bn: 'ফলাফল', en: 'Results' },
  'nav.routines': { bn: 'রুটিন ও সিলেবাস', en: 'Routines' },
  'nav.contact': { bn: 'যোগাযোগ', en: 'Contact' },
  'nav.portal': { bn: 'পোর্টাল লগইন', en: 'Portal Login' },
  'nav.dashboard': { bn: 'ম্যানেজমেন্ট ড্যাশবোর্ড', en: 'Admin Dashboard' },
  'nav.builder': { bn: 'ওয়েবসাইট বিল্ডার', en: 'Website Builder' },

  // Header & Announcement
  'announcement.badge': { bn: 'জরুরি বিজ্ঞপ্তি', en: 'Announcement' },
  'btn.applyNow': { bn: 'অনলাইন ভর্তি আবেদন', en: 'Apply for Admission' },
  'btn.trackApplication': { bn: 'আবেদনের অবস্থা জানুন', en: 'Track Application' },
  'btn.checkResult': { bn: 'ফলাফল অনুসন্ধান', en: 'Check Results' },
  'btn.viewAll': { bn: 'সকল দেখুন', en: 'View All' },
  'btn.save': { bn: 'সংরক্ষণ করুন', en: 'Save Changes' },
  'btn.publish': { bn: 'লাইভ প্রকাশ করুন', en: 'Publish Live' },
  'btn.preview': { bn: 'প্রিভিউ দেখুন', en: 'Preview' },
  'btn.rollback': { bn: 'পূর্বের সংস্করণে ফেরত যান', en: 'Rollback' },

  // Role names
  'role.SUPER_ADMIN': { bn: 'সিস্টেম সুপার অ্যাডমিন', en: 'Platform Super Admin' },
  'role.SCHOOL_ADMIN': { bn: 'ইনস্টিটিউট প্রধান / অ্যাডমিন', en: 'School Admin' },
  'role.EDITOR': { bn: 'ওয়েবসাইট এডিটর', en: 'Website Editor' },
  'role.TEACHER': { bn: 'শিক্ষক / ফ্যাকাল্টি', en: 'Teacher Portal' },
  'role.STUDENT': { bn: 'শিক্ষার্থী পোর্টাল', en: 'Student Portal' },
  'role.GUARDIAN': { bn: 'অভিভাবক পোর্টাল', en: 'Guardian Portal' },
  'role.PUBLIC': { bn: 'সাধারণ পরিদর্শক', en: 'Public Visitor' },

  // Admissions
  'adm.title': { bn: 'অনলাইন ভর্তি আবেদন ফর্ম', en: 'Online Admission Application' },
  'adm.subtitle': { bn: 'নির্ধারিত তথ্য সঠিকভাবে পূরণ করে আবেদন নিশ্চিত করুন', en: 'Complete the official enrollment form' },
  'adm.studentNameEn': { bn: 'শিক্ষার্থীর নাম (ইংরেজিতে)', en: 'Student Full Name (English)' },
  'adm.studentNameBn': { bn: 'শিক্ষার্থীর নাম (বাংলায়)', en: 'Student Full Name (Bangla)' },
  'adm.dob': { bn: 'জন্ম তারিখ', en: 'Date of Birth' },
  'adm.gender': { bn: 'লিঙ্গ', en: 'Gender' },
  'adm.class': { bn: 'আবেদিত শ্রেণী', en: 'Applying Class' },
  'adm.year': { bn: 'শিক্ষাবর্ষ', en: 'Academic Session' },
  'adm.guardian': { bn: 'পিতা/অভিভাবকের নাম', en: 'Guardian Name' },
  'adm.phone': { bn: 'অভিভাবকের মোবাইল নম্বর', en: 'Contact Phone Number' },
  'adm.email': { bn: 'ইমেইল (ঐচ্ছিক)', en: 'Email Address (Optional)' },
  'adm.prevSchool': { bn: 'পূর্ববর্তী বিদ্যালয়', en: 'Previous School' },
  'adm.address': { bn: 'বর্তমান ঠিকানা', en: 'Present Address' },
  'adm.submit': { bn: 'আবেদন দাখিল করুন', en: 'Submit Application' },

  // Result verification
  'res.title': { bn: 'অনলাইন পরীক্ষার ফলাফল যাচাই', en: 'Online Examination Results' },
  'res.roll': { bn: 'ক্লাস রোল নম্বর', en: 'Class Roll Number' },
  'res.studentId': { bn: 'শিক্ষার্থী আইডি / রেজিস্ট্রেশন', en: 'Student ID / Registration No.' },
  'res.search': { bn: 'ফলাফল দেখুন', en: 'Search Result' },

  // Attendance
  'att.title': { bn: 'দৈনিক ডিজিটাল হাজিরা', en: 'Daily Digital Attendance' },
  'att.markPresent': { bn: 'উপস্থিত', en: 'Present' },
  'att.markAbsent': { bn: 'অনুপস্থিত', en: 'Absent' },
  'att.markLate': { bn: 'বিলম্বে', en: 'Late' },

  // Footer & Institutional
  'footer.accreditation': { bn: 'মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড কর্তৃক অনুমোদিত ও নিয়ন্ত্রিত', en: 'Recognized by the Board of Intermediate & Secondary Education' },
  'footer.rights': { bn: 'সর্বস্বত্ব সংরক্ষিত।', en: 'All rights reserved.' },
  'footer.quickLinks': { bn: 'প্রয়োজনীয় লিংক', en: 'Quick Links' },
  'footer.academicWings': { bn: 'শিক্ষা শাখা', en: 'Academic Wings' },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'bn',
  setLang: () => {},
  t: (key) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('bn');

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][lang] || translations[key].en || key;
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
