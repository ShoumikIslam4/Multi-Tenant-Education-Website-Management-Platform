import React from 'react';
import { Microscope, BookOpen, Compass, Code, GraduationCap, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';
import { PageSection } from '../../types/index.js';

interface AcademicProgramsProps {
  section?: PageSection;
}

export const AcademicPrograms: React.FC<AcademicProgramsProps> = ({ section }) => {
  const { lang } = useLanguage();

  const title = lang === 'bn' 
    ? (section?.titleBn || 'শিক্ষা কার্যক্রম ও বিভাগসমূহ') 
    : (section?.title || 'Academic Curricula & Wings');

  const subtitle = lang === 'bn'
    ? (section?.subtitleBn || 'উচ্চশিক্ষার প্রস্তুতি ও মানবিক মূল্যবোধ বিকাশে সুবিন্যস্ত কারিকুলাম')
    : (section?.subtitle || 'Rigorous academic tracks designed for national competitive success');

  const labImage = section?.imageUrl || '/src/assets/images/school_classroom_stem_1793173375794.jpg';

  const wings = [
    {
      id: 'middle',
      icon: BookOpen,
      name: 'Junior Wing (Grades 6 - 8)',
      nameBn: 'নিম্ন মাধ্যমিক শাখা (৬ষ্ঠ - ৮ম শ্রেণী)',
      desc: 'Cultivating strong linguistic and mathematical foundations, basic scientific inquiry, and ethical civic values.',
      descBn: 'গণিত ও বিজ্ঞানের মৌলিক ভিত্তি গঠন, ভাষা দক্ষতা এবং নৈতিক মূল্যবোধের সুষম বিকাশ।',
      features: ['Bangla & English Medium Versions', 'Robotics & Coding Starter Kit', 'Inter-House Debating'],
      featuresBn: ['বাংলা ও ইংরেজি মাধ্যম সংস্করণ', 'রোবটিক্স ও কোডিং প্রাথমিক প্রশিক্ষণ', 'আন্তঃহাউস বিতর্ক প্রতিযোগিতা']
    },
    {
      id: 'ssc',
      icon: Microscope,
      name: 'Secondary SSC Wing (Science & Business)',
      nameBn: 'মাধ্যমিক এস.এস.সি শাখা (বিজ্ঞান ও ব্যবসায় শিক্ষা)',
      desc: 'Dedicated physics, chemistry, and biology labs with intensive preparation for national board examinations.',
      descBn: 'পদার্থ, রসায়ন ও জীববিজ্ঞানের আধুনিক ল্যাবরেটরি এক্সপেরিমেন্ট এবং বোর্ড পরীক্ষার বিশেষ প্রস্তুতি।',
      features: ['Modern Physics & Chemistry Labs', 'ICT & Software Literacy', 'Olympiad Training Camps'],
      featuresBn: ['আধুনিক পদার্থ ও রসায়ন ল্যাবরেটরি', 'আইসিটি ও কম্পিউটার সাক্ষরতা', 'জাতীয় অলিম্পিয়াড প্রস্তুতি সেল']
    },
    {
      id: 'hsc',
      icon: GraduationCap,
      name: 'Higher Secondary College Wing (Class 11 - 12)',
      nameBn: 'উচ্চ মাধ্যমিক কলেজ শাখা (একাদশ ও দ্বাদশ)',
      desc: 'Advanced collegiate training targeting premier university entrance (Engineering BUET, Medical, and Public Universities).',
      descBn: 'বুয়েট, মেডিকেল ও ঢাকা বিশ্ববিদ্যালয় সহ শীর্ষ উচ্চশিক্ষা প্রতিষ্ঠানে ভর্তির উপযোগী পাঠদান।',
      features: ['BUET / Medical Foundation Classes', 'Research Project Mentorship', 'Career Guidance Cell'],
      featuresBn: ['বুয়েট ও মেডিকেল ভর্তি ফাউন্ডেশন', 'গবেষণা প্রজেক্ট মেন্টরশিপ', 'ক্যারিয়ার কাউন্সিলিং সেন্টার']
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="text-xs uppercase tracking-widest text-emerald-800 font-semibold mb-1">
            {lang === 'bn' ? 'অ্যাকাডেমিক কারিকুলাম' : 'Academic Rigor'}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-900 tracking-tight text-balance">
            {title}
          </h2>
          <p className="mt-2 text-stone-600 font-sans text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* 2-Column Split: Wings Grid + STEM Facility Feature */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Wings List (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {wings.map((wing) => {
              const Icon = wing.icon;
              return (
                <div 
                  key={wing.id}
                  className="p-6 rounded-lg border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-md bg-stone-900 text-stone-100 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-lg font-serif font-semibold text-stone-900">
                        {lang === 'bn' ? wing.nameBn : wing.name}
                      </h3>
                      <p className="text-sm text-stone-600 font-sans leading-relaxed">
                        {lang === 'bn' ? wing.descBn : wing.desc}
                      </p>
                      
                      {/* Quiet unboxed feature list */}
                      <div className="pt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500 font-sans">
                        {(lang === 'bn' ? wing.featuresBn : wing.features).map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <span className="text-emerald-700">✓</span>
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* STEM Facility Callout (5 cols) */}
          <div className="lg:col-span-5 rounded-lg border border-stone-200 overflow-hidden bg-stone-900 text-white flex flex-col justify-between">
            <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-800">
              <img
                src={labImage}
                alt="STEM Robotics & Science Lab"
                className="w-full h-full object-cover select-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-xs font-mono text-stone-300">
                Figure: DMRA STEM Laboratory Module
              </div>
            </div>

            <div className="p-6 space-y-3 flex-1 flex flex-col justify-center">
              <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">
                {lang === 'bn' ? 'গবেষণাগার ও উদ্ভাবন' : 'Lab Infrastructure'}
              </div>
              <h4 className="text-xl font-serif font-bold text-white leading-snug">
                {lang === 'bn' 
                  ? 'ব্যবহারিক বিজ্ঞান ও রোবটিক্স প্রশিক্ষণ ল্যাবরেটরি' 
                  : 'Practical Biotechnology & Autonomous Robotics Lab'}
              </h4>
              <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
                {lang === 'bn'
                  ? 'শিক্ষার্থীরা কেবল তত্ত্বীয় শিক্ষাই নয়, বরং নিয়মিত মাইক্রোস্কোপি, সেন্সর প্রোগ্রামিং ও পদার্থবিজ্ঞানের বাস্তব পরীক্ষা-নিরীক্ষায় অংশ নেয়।'
                  : 'Scholars conduct real microscopy, clean-energy chemistry, and microcontroller circuits under faculty supervision.'}
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
