import React, { useState } from 'react';
import { Calendar, Download, Pin, Filter, Search, FileText } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';
import { Notice } from '../../types/index.js';

interface NoticeBoardSectionProps {
  notices: Notice[];
}

export const NoticeBoardSection: React.FC<NoticeBoardSectionProps> = ({ notices }) => {
  const { lang, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Academic', 'Admission', 'Exam', 'Administrative'];

  const filteredNotices = notices.filter(n => {
    const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory;
    const titleText = (lang === 'bn' ? n.titleBn : n.title).toLowerCase();
    const matchesSearch = !searchQuery || titleText.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-16 sm:py-24 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-emerald-800 font-semibold mb-1">
              {lang === 'bn' ? 'প্রশাসনিক বিজ্ঞপ্তি' : 'Official Circulars'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
              {lang === 'bn' ? 'নোটিশ বোর্ড ও জরুরি পরিপত্র' : 'Notice Board & Administrative Decrees'}
            </h2>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'bn' ? 'বিজ্ঞপ্তি খুঁজুন...' : 'Search circulars...'}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-stone-400 font-sans"
            />
          </div>
        </div>

        {/* Category Filter Tabs (Interactive control: buttons allowed) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 border-b border-stone-200">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              {cat === 'All' ? (lang === 'bn' ? 'সকল নোটিশ' : 'All Circulars') : cat}
            </button>
          ))}
        </div>

        {/* Notices Table / List */}
        <div className="bg-white rounded-lg border border-stone-200 shadow-xs divide-y divide-stone-100">
          {filteredNotices.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500 font-sans">
              {lang === 'bn' ? 'কোন বিজ্ঞপ্তি পাওয়া যায়নি।' : 'No official notices found matching the filter.'}
            </div>
          ) : (
            filteredNotices.map((notice) => (
              <div 
                key={notice.id}
                className="p-5 sm:p-6 hover:bg-stone-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  {/* Unboxed Metadata (Zero pills rule) */}
                  <div className="flex items-center gap-2 text-xs text-stone-500 font-sans">
                    {notice.isPinned && (
                      <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                        <Pin className="w-3 h-3 fill-emerald-800" />
                        <span>{lang === 'bn' ? 'পিনযুক্ত' : 'Pinned'}</span>
                      </span>
                    )}
                    {notice.isPinned && <span aria-hidden="true">·</span>}
                    <span className="font-medium text-stone-700">{notice.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums font-mono">{notice.publishDate}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-snug">
                    {lang === 'bn' ? notice.titleBn : notice.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 font-sans line-clamp-2 leading-relaxed">
                    {lang === 'bn' ? notice.contentBn : notice.content}
                  </p>
                </div>

                {/* Attachment Download Action */}
                {notice.attachmentName ? (
                  <a
                    href={notice.attachmentUrl || '#'}
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Downloading official circular: ${notice.attachmentName}`);
                    }}
                    className="shrink-0 flex items-center gap-2 px-3 py-2 rounded border border-stone-300 hover:border-stone-400 text-stone-700 hover:text-stone-900 text-xs font-medium bg-stone-50 hover:bg-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-stone-500" />
                    <span className="truncate max-w-[140px] font-mono text-[11px]">{notice.attachmentName}</span>
                  </a>
                ) : (
                  <div className="shrink-0 flex items-center gap-1.5 text-stone-400 text-xs font-sans">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'সাধারণ বিজ্ঞপ্তি' : 'Text Notice'}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
};
