import { 
  Tenant, 
  User, 
  Page, 
  PageSection, 
  PageRevision, 
  Notice, 
  SchoolEvent, 
  AdmissionApplication, 
  Student, 
  Teacher, 
  AttendanceRecord, 
  ExamResult, 
  ClassRoutineItem, 
  MediaAsset, 
  AuditLogEntry 
} from '../types/index.js';
import mongoose from 'mongoose';
import { getModels } from '../models/mongoose.js';

// Pre-seeded images generated for this institute
const CAMPUS_IMG = '/src/assets/images/school_campus_exterior_1793173374585.jpg';
const LAB_IMG = '/src/assets/images/school_classroom_stem_1793173375794.jpg';
const PRINCIPAL_IMG = '/src/assets/images/school_principal_portrait_1793173376401.jpg';
const HALL_IMG = '/src/assets/images/school_cultural_campus_1793173376754.jpg';

export class MultiTenantDataStore {
  private isConnectedToMongo: boolean = false;

  // In-memory tenant data stores
  public tenants: Tenant[] = [];
  public users: (User & { passwordHash?: string })[] = [];
  public pages: Page[] = [];
  public revisions: PageRevision[] = [];
  public notices: Notice[] = [];
  public events: SchoolEvent[] = [];
  public applications: AdmissionApplication[] = [];
  public students: Student[] = [];
  public teachers: Teacher[] = [];
  public attendance: AttendanceRecord[] = [];
  public results: ExamResult[] = [];
  public routines: ClassRoutineItem[] = [];
  public media: MediaAsset[] = [];
  public auditLogs: AuditLogEntry[] = [];

  constructor() {
    this.seedInitialData();
  }

  public async initMongo(uri?: string) {
    if (!uri) return;
    try {
      await mongoose.connect(uri);
      this.isConnectedToMongo = true;
      console.log('Successfully connected to MongoDB Atlas');
    } catch (err) {
      console.warn('MongoDB connection failed or not configured, using isolated memory store:', err);
      this.isConnectedToMongo = false;
    }
  }

  private seedInitialData() {
    // Tenant 1: Dhaka Model Residential Academy (Primary Tenant)
    const tenant1: Tenant = {
      id: 'tenant-dhaka-model',
      subdomain: 'dhaka-model',
      customDomain: 'dhakamodel.edu.bd',
      status: 'ACTIVE',
      branding: {
        schoolName: 'Dhaka Model Residential Academy',
        schoolNameBn: 'ঢাকা মডেল রেসিডেনসিয়াল একাডেমি',
        shortName: 'DMRA',
        tagline: 'Excellence in Academic Rigor, Character & Modern Science',
        taglineBn: 'জ্ঞান, চরিত্র ও আধুনিক বিজ্ঞানের অনন্য মিলনমেলা',
        logoUrl: '/favicon.ico',
        faviconUrl: '/favicon.ico',
        establishedYear: 1984,
        eiinNumber: '108420',
        boardAffiliation: 'Secondary & Higher Secondary Education Board, Dhaka',
        primaryColor: '#0f766e', // Deep scholarly teal
        secondaryColor: '#b45309', // Warm bronze
        accentColor: '#0284c7', // Sky cyan
        fontFamily: 'Plus Jakarta Sans',
        address: 'Mirpur Road, Mohammadpur, Dhaka-1207, Bangladesh',
        addressBn: 'মিরপুর রোড, মোহাম্মদপুর, ঢাকা-১২০৭, বাংলাদেশ',
        phone: '+880 2-8114521',
        email: 'info@dhakamodel.edu.bd',
        principalName: 'Prof. Dr. M. Masudur Rahman',
        principalNameBn: 'অধ্যাপক ড. এম. মাসুদুর রহমান',
        principalMessage: 'Welcome to Dhaka Model Residential Academy. For over four decades, our campus has nurtured inquisitive minds, moral integrity, and national leadership. We blend rigorous national curriculum standards with contemporary laboratory innovation, robotics, and cultural humanities.',
        principalMessageBn: 'ঢাকা মডেল রেসিডেনসিয়াল একাডেমিতে আপনাকে স্বাগতম। চার দশকেরও বেশি সময় ধরে আমাদের ঐতিহ্যবাহী বিদ্যাপীঠ জ্ঞানের আলো ছড়াচ্ছে। নৈতিক শৃঙ্খলা, আধুনিক বিজ্ঞান গবেষণা ও প্রযুক্তিগত উৎকর্ষ সাধনে আমরা নিবেদিতপ্রাণ।',
        principalImageUrl: PRINCIPAL_IMG,
      },
      features: {
        admissionsEnabled: true,
        resultPortalEnabled: true,
        attendanceTracking: true,
        onlinePayments: false,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Tenant 2: Chittagong Science & Technology College (Secondary Tenant for multi-tenancy verification)
    const tenant2: Tenant = {
      id: 'tenant-cstc',
      subdomain: 'cstc',
      customDomain: 'cstc.edu.bd',
      status: 'ACTIVE',
      branding: {
        schoolName: 'Chittagong Science & Technology College',
        schoolNameBn: 'চট্টগ্রাম বিজ্ঞান ও প্রযুক্তি কলেজ',
        shortName: 'CSTC',
        tagline: 'Pioneering Higher Secondary Science & Applied Computing',
        taglineBn: 'উচ্চ মাধ্যমিক বিজ্ঞান ও তথ্যপ্রযুক্তিতে অগ্রগামী বিদ্যাপীঠ',
        logoUrl: '/favicon.ico',
        faviconUrl: '/favicon.ico',
        establishedYear: 1998,
        eiinNumber: '132910',
        boardAffiliation: 'Chittagong Education Board',
        primaryColor: '#1e3a8a', // Deep royal navy
        secondaryColor: '#78350f', // Antique leather
        accentColor: '#059669', // Emerald
        fontFamily: 'Outfit',
        address: 'Nasirabad CDA Avenue, Chattogram, Bangladesh',
        addressBn: 'নাসিরাবাদ সিডিএ এভিনিউ, চট্টগ্রাম, বাংলাদেশ',
        phone: '+880 31-654890',
        email: 'contact@cstc.edu.bd',
        principalName: 'Dr. Shahriar Kabir',
        principalNameBn: 'ড. শাহরিয়ার কবির',
        principalMessage: 'At CSTC, we empower young scientific talent through dedicated biotech and computational physics workshops.',
        principalMessageBn: 'সিএসটিসিতে আমরা তথ্যপ্রযুক্তি ও আধুনিক গবেষণাগারের মাধ্যমে শিক্ষার্থীদের মেধা বিকাশে বদ্ধপরিকর।',
        principalImageUrl: PRINCIPAL_IMG,
      },
      features: {
        admissionsEnabled: true,
        resultPortalEnabled: true,
        attendanceTracking: true,
        onlinePayments: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.tenants = [tenant1, tenant2];

    // Seed Users
    this.users = [
      {
        id: 'usr-super-admin',
        tenantId: 'platform',
        email: 'superadmin@schoolos.net',
        name: 'Platform Super Admin',
        role: 'SUPER_ADMIN',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr-dhaka-admin',
        tenantId: 'tenant-dhaka-model',
        email: 'admin@dhakamodel.edu.bd',
        name: 'Rashid Al Mamun (Admin)',
        role: 'SCHOOL_ADMIN',
        phone: '+880 1711-223344',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr-dhaka-editor',
        tenantId: 'tenant-dhaka-model',
        email: 'editor@dhakamodel.edu.bd',
        name: 'Tania Sultana (Webmaster)',
        role: 'EDITOR',
        phone: '+880 1819-556677',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr-dhaka-teacher',
        tenantId: 'tenant-dhaka-model',
        email: 'teacher@dhakamodel.edu.bd',
        name: 'Dr. Anisur Rahman',
        role: 'TEACHER',
        teacherId: 'tch-01',
        phone: '+880 1912-334455',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr-dhaka-student',
        tenantId: 'tenant-dhaka-model',
        email: 'student@dhakamodel.edu.bd',
        name: 'Tahmid Hasan',
        role: 'STUDENT',
        studentId: 'std-101',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr-dhaka-guardian',
        tenantId: 'tenant-dhaka-model',
        email: 'guardian@dhakamodel.edu.bd',
        name: 'Golam Kibria (Father of Tahmid)',
        role: 'GUARDIAN',
        guardianId: 'grd-01',
        phone: '+880 1715-998877',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      // CSTC Admin to test cross-tenant protection
      {
        id: 'usr-cstc-admin',
        tenantId: 'tenant-cstc',
        email: 'admin@cstc.edu.bd',
        name: 'CSTC Principal Admin',
        role: 'SCHOOL_ADMIN',
        isActive: true,
        createdAt: new Date().toISOString(),
      }
    ];

    // Seed Homepage for Dhaka Model
    const homepageSections: PageSection[] = [
      {
        id: 'sec-hero',
        type: 'hero',
        title: 'Shaping Inquiring Minds for Academic Excellence & Leadership',
        titleBn: 'জ্ঞানের অন্বেষণ ও চরিত্র গঠনে চার দশকের আস্থার প্রতীক',
        subtitle: 'Admissions Open for Session 2026-2027 • Grades 6 to 12 • National Curriculum (English & Bangla Versions)',
        subtitleBn: '২০২৬-২০২৭ শিক্ষাবর্ষে ৬ষ্ঠ থেকে ১২শ শ্রেণীতে ভর্তি চলছে • জাতীয় শিক্ষাক্রম (বাংলা ও ইংরেজি মাধ্যম)',
        content: 'Providing holistic residential and day-school education with modern STEM laboratories, rich cultural heritage, and exceptional university matriculation records.',
        contentBn: 'আধুনিক বিজ্ঞান ল্যাব, অভিজ্ঞ শিক্ষকমণ্ডলী এবং সমৃদ্ধ সাংস্কৃতিক পরিমণ্ডলে গড়ে উঠুক আপনার সন্তানের আগামী।',
        imageUrl: CAMPUS_IMG,
        order: 1,
        isVisible: true,
        settings: {
          showCta: true,
          ctaText: 'Apply for Admission',
          ctaTextBn: 'ভর্তির আবেদন করুন',
          ctaLink: '/admissions',
          secondaryCtaText: 'View Class Routines',
          secondaryCtaTextBn: 'ক্লাস রুটিন দেখুন',
          secondaryCtaLink: '/routines'
        }
      },
      {
        id: 'sec-principal',
        type: 'principal_message',
        title: 'Message from the Principal',
        titleBn: 'অধ্যক্ষের বাণী',
        subtitle: 'Leadership with vision, empathy and scholastic integrity',
        subtitleBn: 'নৈতিকতা ও প্রজ্ঞার সমন্বয়ে আগামীর নেতৃত্ব বিকাশ',
        content: tenant1.branding.principalMessage,
        contentBn: tenant1.branding.principalMessageBn,
        imageUrl: PRINCIPAL_IMG,
        order: 2,
        isVisible: true,
        settings: {
          authorName: tenant1.branding.principalName,
          authorNameBn: tenant1.branding.principalNameBn,
          authorTitle: 'Principal & Secretary, Board of Governors',
          authorTitleBn: 'অধ্যক্ষ ও সদস্য সচিব, গভর্নিং বডি'
        }
      },
      {
        id: 'sec-stats',
        type: 'stats',
        title: 'Institutional Highlights & Achievements',
        titleBn: 'আমাদের অর্জন ও বিশেষ বৈশিষ্ট্য',
        subtitle: 'Four decades of scholastic distinction',
        subtitleBn: '৪০ বছরের গৌরবোজ্জ্বল পথচলা',
        order: 3,
        isVisible: true,
        settings: {
          metrics: [
            { label: 'Enrolled Scholars', labelBn: 'নিয়মিত শিক্ষার্থী', value: '2,480+' },
            { label: 'Faculty Members', labelBn: 'প্রাজ্ঞ শিক্ষকমণ্ডলী', value: '96' },
            { label: 'GPA 5.00 Rate (HSC/SSC)', labelBn: 'জিপিএ-৫ পাসের হার', value: '99.4%' },
            { label: 'Campus Area', labelBn: 'ক্যাম্পাস আয়তন', value: '18 Acres' },
          ]
        }
      },
      {
        id: 'sec-programs',
        type: 'programs',
        title: 'Academic Curricula & Wings',
        titleBn: 'শিক্ষা কার্যক্রম ও বিভাগসমূহ',
        subtitle: 'Comprehensive pathways designed for university readiness and moral growth',
        subtitleBn: 'উচ্চশিক্ষার প্রস্তুতি ও মানবিক মূল্যবোধ বিকাশে সুবিন্যস্ত কারিকুলাম',
        order: 4,
        isVisible: true,
        imageUrl: LAB_IMG,
        settings: {
          programs: [
            {
              name: 'Middle School (Class 6 - 8)',
              nameBn: 'নিম্ন মাধ্যমিক শাখা (৬ষ্ঠ - ৮ম শ্রেণী)',
              desc: 'Rigorous foundation in mathematics, general science, language fluency, and creative arts.',
              descBn: 'গণিত, বিজ্ঞান, ভাষাজ্ঞান ও চারুকলার সুষম ভিত্তি গঠন।'
            },
            {
              name: 'Secondary SSC (Science & Business)',
              nameBn: 'মাধ্যমিক এস.এস.সি শাখা (বিজ্ঞান ও ব্যবসায় শিক্ষা)',
              desc: 'High standard science laboratory experiments, computer programming, and commerce case studies.',
              descBn: 'আধুনিক ল্যাবরেটরি এক্সপেরিমেন্ট, আইসিটি ও ব্যবসায়িক বিশ্লেষণ।'
            },
            {
              name: 'Higher Secondary College HSC',
              nameBn: 'উচ্চ মাধ্যমিক এইচ.এস.সি শাখা (একাদশ ও দ্বাদশ)',
              desc: 'Advanced placement prep for Engineering (BUET), Medical Colleges, and Top Global Universities.',
              descBn: 'বুয়েট, মেডিকেল ও শীর্ষ বিশ্ববিদ্যালয়ে ভর্তির বিশেষ প্রস্তুতি।'
            }
          ]
        }
      },
      {
        id: 'sec-notices',
        type: 'notices',
        title: 'Official Circulars & Notice Board',
        titleBn: 'জরুরি বিজ্ঞপ্তি ও নোটিশ বোর্ড',
        subtitle: 'Latest circulars from the academic administration',
        subtitleBn: 'অ্যাকাডেমিক ও প্রশাসনিক সাম্প্রতিক তথ্যাবলি',
        order: 5,
        isVisible: true,
      },
      {
        id: 'sec-gallery',
        type: 'gallery',
        title: 'Campus Life & State-of-the-Art Facilities',
        titleBn: 'ক্যাম্পাস জীবন ও আধুনিক সুযোগ-সুবিধা',
        subtitle: 'Explore our library, interactive STEM laboratories, and annual science fair',
        subtitleBn: 'সমৃদ্ধ কেন্দ্রীয় লাইব্রেরি, ডিজিটাল ল্যাবরেটরি ও সাংস্কৃতিক কর্মকাণ্ড',
        order: 6,
        isVisible: true,
        settings: {
          items: [
            { image: CAMPUS_IMG, caption: 'Historic Academic Building & Quadrangle Lawn', captionBn: 'ঐতিহাসিক লাল ইটের মূল ভবন ও খেলার মাঠ' },
            { image: LAB_IMG, caption: 'Interactive Robotics & Biotechnology Laboratory', captionBn: 'রোবটিক্স ও বায়োটেকনোলজি স্মার্ট ল্যাব' },
            { image: HALL_IMG, caption: 'Annual Science Fair & Cultural Pavilion', captionBn: 'বার্ষিক বিজ্ঞান মেলা ও সাংস্কৃতিক প্রদর্শনী' }
          ]
        }
      },
      {
        id: 'sec-cta',
        type: 'cta',
        title: 'Begin Your Journey Toward Scholastic Distinction',
        titleBn: 'আপনার সন্তানের উজ্জ্বল ভবিষ্যতের সূচনা হোক এখানে',
        subtitle: 'Online applications for the upcoming 2026-2027 session are currently being accepted.',
        subtitleBn: '২০২৬-২০২৭ শিক্ষাবর্ষের অনলাইন ভর্তি আবেদন প্রক্রিয়া চলমান রয়েছে।',
        order: 7,
        isVisible: true,
        settings: {
          buttonText: 'Submit Admission Application',
          buttonTextBn: 'অনলাইন ভর্তি ফর্ম পূরণ করুন',
          buttonLink: '/admissions'
        }
      }
    ];

    this.pages = [
      {
        id: 'page-dhaka-home',
        tenantId: 'tenant-dhaka-model',
        slug: 'home',
        title: 'Home',
        titleBn: 'মূল পাতা',
        sections: JSON.parse(JSON.stringify(homepageSections)),
        publishedSections: JSON.parse(JSON.stringify(homepageSections)),
        isPublished: true,
        publishedAt: new Date().toISOString(),
        lastEditedBy: 'admin@dhakamodel.edu.bd',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'page-dhaka-about',
        tenantId: 'tenant-dhaka-model',
        slug: 'about',
        title: 'About Our Institution',
        titleBn: 'প্রতিষ্ঠান পরিচিতি',
        sections: [
          {
            id: 'sec-about-intro',
            type: 'rich_text',
            title: 'Heritage, Mission & Vision',
            titleBn: 'আমাদের ইতিহাস, রূপকল্প ও লক্ষ্য',
            content: 'Founded in 1984 under the guidance of visionary scholars, Dhaka Model Residential Academy was established to provide peerless secondary and higher secondary education in a serene, residential environment.',
            contentBn: '১৯৮৪ সালে প্রতিষ্ঠিত এই প্রতিষ্ঠান দীর্ঘ চার দশক ধরে বাংলাদেশের অন্যতম শীর্ষ শিক্ষাপ্রতিষ্ঠান হিসেবে সুনাম ধরে রেখেছে।',
            order: 1,
            isVisible: true,
            imageUrl: CAMPUS_IMG
          }
        ],
        publishedSections: [
          {
            id: 'sec-about-intro',
            type: 'rich_text',
            title: 'Heritage, Mission & Vision',
            titleBn: 'আমাদের ইতিহাস, রূপকল্প ও লক্ষ্য',
            content: 'Founded in 1984 under the guidance of visionary scholars, Dhaka Model Residential Academy was established to provide peerless secondary and higher secondary education in a serene, residential environment.',
            contentBn: '১৯৮৪ সালে প্রতিষ্ঠিত এই প্রতিষ্ঠান দীর্ঘ চার দশক ধরে বাংলাদেশের অন্যতম শীর্ষ শিক্ষাপ্রতিষ্ঠান হিসেবে সুনাম ধরে রেখেছে।',
            order: 1,
            isVisible: true,
            imageUrl: CAMPUS_IMG
          }
        ],
        isPublished: true,
        publishedAt: new Date().toISOString(),
        lastEditedBy: 'admin@dhakamodel.edu.bd',
        updatedAt: new Date().toISOString(),
      }
    ];

    // Seed Notices
    this.notices = [
      {
        id: 'not-01',
        tenantId: 'tenant-dhaka-model',
        title: 'Commencement of Admission Process for Academic Year 2026-2027',
        titleBn: '২০২৬-২০২৭ শিক্ষাবর্ষের ভর্তি কার্যক্রম ও আবেদন প্রক্রিয়া সংক্রান্ত বিজ্ঞপ্তি',
        category: 'Admission',
        content: 'Online applications for Class 6, Class 9, and Class 11 (Science & Business Studies) are open until November 25, 2026. Applicants must submit their online form and download the admit voucher.',
        contentBn: '২০২৬-২০২৭ শিক্ষাবর্ষে ৬ষ্ঠ, ৯ম ও একাদশ শ্রেণীতে ভর্তিচ্ছু শিক্ষার্থীদের জন্য অনলাইনে আবেদন গ্রহণ শুরু হয়েছে। আগামী ২৫ নভেম্বর ২০২৬ তারিখ পর্যন্ত আবেদন করা যাবে।',
        publishDate: '2026-10-20',
        isPinned: true,
        attachmentName: 'Admission_Prospectus_2026.pdf',
        attachmentUrl: '#'
      },
      {
        id: 'not-02',
        tenantId: 'tenant-dhaka-model',
        title: 'Mid-Term Examination Schedule & Syllabus Circular',
        titleBn: 'অর্ধবার্ষিক মূল্যায়ন পরীক্ষা ২০২৬ এর সময়সূচি ও সিলেবাস',
        category: 'Exam',
        content: 'The Mid-Term Examinations will commence from November 15, 2026. Students are advised to verify their seating arrangement and admit clearance.',
        contentBn: 'সকল শ্রেণীর শিক্ষার্থীদের জানানো যাচ্ছে যে আগামী ১৫ নভেম্বর ২০২৬ থেকে অর্ধবার্ষিক মূল্যায়ন পরীক্ষা অনুষ্ঠিত হবে। বিস্তারিত রুটিন প্রকাশিত হয়েছে।',
        publishDate: '2026-10-24',
        isPinned: true,
        attachmentName: 'Exam_Routine_Nov_2026.pdf',
        attachmentUrl: '#'
      },
      {
        id: 'not-03',
        tenantId: 'tenant-dhaka-model',
        title: 'Annual Science Fair & Inter-School Robotics Competition',
        titleBn: 'বার্ষিক বিজ্ঞান মেলা ও আন্তঃস্কুল রোবটিক্স অলিম্পিয়াড ২০২৬',
        category: 'Academic',
        content: 'Registration for student project stalls (Biotechnology, Clean Energy, and Autonomous Robotics) is now open at the Department of Science.',
        contentBn: 'বিজ্ঞান ক্লাবের উদ্যোগে বার্ষিক বিজ্ঞান প্রদর্শনী ও রোবটিক্স অলিম্পিয়াডের প্রজেক্ট জমা দেওয়ার শেষ তারিখ আগামী ৫ নভেম্বর।',
        publishDate: '2026-10-26',
        isPinned: false
      }
    ];

    // Seed Events
    this.events = [
      {
        id: 'evt-01',
        tenantId: 'tenant-dhaka-model',
        title: 'Annual Inter-House Athletics & Sports Meet',
        titleBn: 'বার্ষিক ক্রীড়া ও দৌড় প্রতিযোগিতা ২০২৬',
        date: '2026-11-10',
        time: '08:30 AM - 04:00 PM',
        location: 'Central Campus Stadium, DMRA',
        locationBn: 'কেন্দ্রীয় খেলার মাঠ, ডিএমআরএ ক্যাম্পাস',
        description: 'Track and field events, sprint relays, high jump, gymnastics, and prize distribution by the Chief Guest.',
        descriptionBn: 'দৌড়, লং জাম্প, রিলে রেস ও মার্চপাস্ট সহ বার্ষিক ক্রীড়া প্রতিযোগিতার উদ্বোধনী ও পুরস্কার বিতরণী অনুষ্ঠান।',
        imageUrl: HALL_IMG,
        category: 'Sports'
      },
      {
        id: 'evt-02',
        tenantId: 'tenant-dhaka-model',
        title: 'Science Olympiad & Digital Exhibition 2026',
        titleBn: 'জাতীয় বিজ্ঞান অলিম্পিয়াড ও ডিজিটাল প্রদর্শনী',
        date: '2026-11-22',
        time: '09:00 AM - 05:00 PM',
        location: 'Auditorium & STEM Complex',
        locationBn: 'অডিটোরিয়াম ও বিজ্ঞান ভবন',
        description: 'Over 60 innovative student projects in biotechnology, green energy, and microcontroller programming on display.',
        descriptionBn: 'শিক্ষার্থীদের তৈরি ৬০টিরও বেশি বিজ্ঞান প্রজেক্ট ও রোবটিক্স প্রদর্শন।',
        imageUrl: LAB_IMG,
        category: 'Academic'
      }
    ];

    // Seed Teachers
    this.teachers = [
      {
        id: 'tch-01',
        tenantId: 'tenant-dhaka-model',
        name: 'Dr. Anisur Rahman',
        nameBn: 'ড. আনিসুর রহমান',
        designation: 'Senior Teacher & Head of Department',
        designationBn: 'সিনিয়র শিক্ষক ও বিভাগীয় প্রধান',
        department: 'Physics & Applied Science',
        departmentBn: 'পদার্থবিজ্ঞান ও ফলিত বিজ্ঞান',
        email: 'teacher@dhakamodel.edu.bd',
        phone: '+880 1912-334455',
        qualification: 'M.Sc (DU), Ph.D (Tokyo Tech)',
        imageUrl: PRINCIPAL_IMG,
        assignedClasses: ['Class 10 - Section A', 'Class 12 - Science Wing']
      },
      {
        id: 'tch-02',
        tenantId: 'tenant-dhaka-model',
        name: 'Mahmuda Khatun',
        nameBn: 'মাহমুদা খাতুন',
        designation: 'Assistant Headmistress',
        designationBn: 'সহকারী প্রধান শিক্ষিকা',
        department: 'Mathematics & Computing',
        departmentBn: 'উচ্চতর গণিত ও তথ্যপ্রযুক্তি',
        email: 'mahmuda.k@dhakamodel.edu.bd',
        phone: '+880 1718-229900',
        qualification: 'M.Sc in Applied Mathematics, BUET',
        assignedClasses: ['Class 9 - Section B', 'Class 11 - Science']
      },
      {
        id: 'tch-03',
        tenantId: 'tenant-dhaka-model',
        name: 'Kazi Faruk Ahmed',
        nameBn: 'কাজী ফারুক আহমেদ',
        designation: 'Senior Faculty Member',
        designationBn: 'প্রভাষক',
        department: 'English Language & Literature',
        departmentBn: 'ইংরেজি ভাষা ও সাহিত্য',
        email: 'faruk.ahmed@dhakamodel.edu.bd',
        phone: '+880 1675-443322',
        qualification: 'M.A. in English (University of Dhaka)',
        assignedClasses: ['Class 8 - Section A', 'Class 10 - Section B']
      }
    ];

    // Seed Students
    this.students = [
      {
        id: 'std-101',
        tenantId: 'tenant-dhaka-model',
        studentIdNumber: 'DMRA-2026-101',
        name: 'Tahmid Hasan',
        nameBn: 'তাহমিদ হাসান',
        class: 'Class 10',
        section: 'Section A (Science)',
        roll: 1,
        guardianId: 'grd-01',
        guardianName: 'Golam Kibria',
        guardianPhone: '+880 1715-998877',
        bloodGroup: 'B+',
        attendanceRate: 98.2
      },
      {
        id: 'std-102',
        tenantId: 'tenant-dhaka-model',
        studentIdNumber: 'DMRA-2026-102',
        name: 'Nusrat Jahan',
        nameBn: 'নুসরাত জাহান',
        class: 'Class 10',
        section: 'Section A (Science)',
        roll: 2,
        guardianId: 'grd-02',
        guardianName: 'Dr. Rafiqul Islam',
        guardianPhone: '+880 1712-445566',
        bloodGroup: 'O+',
        attendanceRate: 96.5
      },
      {
        id: 'std-103',
        tenantId: 'tenant-dhaka-model',
        studentIdNumber: 'DMRA-2026-103',
        name: 'Arifur Rahman',
        nameBn: 'আরিফুর রহমান',
        class: 'Class 10',
        section: 'Section A (Science)',
        roll: 3,
        guardianId: 'grd-03',
        guardianName: 'Shahina Akhter',
        guardianPhone: '+880 1819-223311',
        bloodGroup: 'A+',
        attendanceRate: 94.0
      }
    ];

    // Seed Admission Applications
    this.applications = [
      {
        id: 'app-2026-001',
        tenantId: 'tenant-dhaka-model',
        referenceNumber: 'DMRA-ADM-7821',
        studentNameEn: 'Zubair Al Masud',
        studentNameBn: 'জুবায়ের আল মাসুদ',
        dateOfBirth: '2012-05-14',
        gender: 'MALE',
        applyingClass: 'Class 6',
        academicYear: '2026-2027',
        guardianName: 'Dr. Masudur Rahman',
        guardianPhone: '+880 1711-889900',
        guardianEmail: 'masud.doc@gmail.com',
        previousSchool: 'Saint Joseph Primary School, Dhaka',
        address: 'House 42, Road 9/A, Dhanmondi, Dhaka',
        status: 'UNDER_REVIEW',
        notes: [
          {
            id: 'n-1',
            author: 'Rashid Al Mamun (Admin)',
            timestamp: new Date().toISOString(),
            comment: 'Primary report card verified. Eligible for admission written assessment.'
          }
        ],
        submittedAt: '2026-10-22T10:15:00.000Z',
        updatedAt: '2026-10-23T14:20:00.000Z',
      },
      {
        id: 'app-2026-002',
        tenantId: 'tenant-dhaka-model',
        referenceNumber: 'DMRA-ADM-7822',
        studentNameEn: 'Samiha Afreen',
        studentNameBn: 'সামিহা আফরিন',
        dateOfBirth: '2010-09-02',
        gender: 'FEMALE',
        applyingClass: 'Class 9',
        academicYear: '2026-2027',
        guardianName: 'Engr. Nazmul Huda',
        guardianPhone: '+880 1817-334411',
        guardianEmail: 'nazmul.eng@yahoo.com',
        previousSchool: 'Viqarunnisa Noon School & College',
        address: 'Block C, Lalmatia Housing, Dhaka',
        status: 'APPROVED',
        notes: [
          {
            id: 'n-2',
            author: 'Rashid Al Mamun (Admin)',
            timestamp: new Date().toISOString(),
            comment: 'Passed entrance test with 92% marks. Seat allocated in Section A.'
          }
        ],
        submittedAt: '2026-10-21T08:30:00.000Z',
        updatedAt: '2026-10-25T11:00:00.000Z',
      },
      {
        id: 'app-2026-003',
        tenantId: 'tenant-dhaka-model',
        referenceNumber: 'DMRA-ADM-7823',
        studentNameEn: 'Tanvir Hossain',
        studentNameBn: 'তানভীর হোসেন',
        dateOfBirth: '2009-02-18',
        gender: 'MALE',
        applyingClass: 'Class 11',
        academicYear: '2026-2027',
        guardianName: 'Kabir Hossain',
        guardianPhone: '+880 1914-776655',
        previousSchool: 'Mirpur Govt High School',
        address: 'Section 10, Mirpur, Dhaka',
        status: 'SUBMITTED',
        notes: [],
        submittedAt: '2026-10-27T16:45:00.000Z',
        updatedAt: '2026-10-27T16:45:00.000Z',
      }
    ];

    // Seed Attendance
    this.attendance = [
      {
        id: 'att-2026-10-28',
        tenantId: 'tenant-dhaka-model',
        class: 'Class 10',
        section: 'Section A (Science)',
        date: '2026-10-28',
        records: [
          { studentId: 'std-101', studentName: 'Tahmid Hasan', roll: 1, status: 'PRESENT' },
          { studentId: 'std-102', studentName: 'Nusrat Jahan', roll: 2, status: 'PRESENT' },
          { studentId: 'std-103', studentName: 'Arifur Rahman', roll: 3, status: 'LATE', remarks: 'Medical visit' }
        ],
        recordedBy: 'Dr. Anisur Rahman'
      }
    ];

    // Seed Exam Results
    this.results = [
      {
        id: 'res-101',
        tenantId: 'tenant-dhaka-model',
        examName: 'First Term Assessment 2026',
        academicYear: '2026',
        class: 'Class 10',
        studentIdNumber: 'DMRA-2026-101',
        studentName: 'Tahmid Hasan',
        roll: 1,
        isPublished: true,
        subjects: [
          { subjectName: 'Physics', marksObtained: 94, totalMarks: 100, grade: 'A+', gpa: 5.0 },
          { subjectName: 'Higher Mathematics', marksObtained: 98, totalMarks: 100, grade: 'A+', gpa: 5.0 },
          { subjectName: 'Chemistry', marksObtained: 89, totalMarks: 100, grade: 'A+', gpa: 5.0 },
          { subjectName: 'English First Paper', marksObtained: 84, totalMarks: 100, grade: 'A+', gpa: 5.0 },
          { subjectName: 'Bangla Sahitya', marksObtained: 82, totalMarks: 100, grade: 'A+', gpa: 5.0 }
        ],
        totalMarks: 447,
        gpa: 5.00,
        grade: 'A+'
      },
      {
        id: 'res-102',
        tenantId: 'tenant-dhaka-model',
        examName: 'First Term Assessment 2026',
        academicYear: '2026',
        class: 'Class 10',
        studentIdNumber: 'DMRA-2026-102',
        studentName: 'Nusrat Jahan',
        roll: 2,
        isPublished: true,
        subjects: [
          { subjectName: 'Physics', marksObtained: 91, totalMarks: 100, grade: 'A+', gpa: 5.0 },
          { subjectName: 'Higher Mathematics', marksObtained: 95, totalMarks: 100, grade: 'A+', gpa: 5.0 },
          { subjectName: 'Chemistry', marksObtained: 92, totalMarks: 100, grade: 'A+', gpa: 5.0 },
          { subjectName: 'English First Paper', marksObtained: 88, totalMarks: 100, grade: 'A+', gpa: 5.0 },
          { subjectName: 'Bangla Sahitya', marksObtained: 85, totalMarks: 100, grade: 'A+', gpa: 5.0 }
        ],
        totalMarks: 451,
        gpa: 5.00,
        grade: 'A+'
      }
    ];

    // Seed Routines
    this.routines = [
      { id: 'rt-1', tenantId: 'tenant-dhaka-model', class: 'Class 10', section: 'Section A (Science)', day: 'Sunday', timeSlot: '08:30 - 09:20', subject: 'Physics', teacher: 'Dr. Anisur Rahman', room: 'Lab 201' },
      { id: 'rt-2', tenantId: 'tenant-dhaka-model', class: 'Class 10', section: 'Section A (Science)', day: 'Sunday', timeSlot: '09:25 - 10:15', subject: 'Higher Mathematics', teacher: 'Mahmuda Khatun', room: 'Room 304' },
      { id: 'rt-3', tenantId: 'tenant-dhaka-model', class: 'Class 10', section: 'Section A (Science)', day: 'Sunday', timeSlot: '10:35 - 11:25', subject: 'English Literature', teacher: 'Kazi Faruk Ahmed', room: 'Room 304' },
      { id: 'rt-4', tenantId: 'tenant-dhaka-model', class: 'Class 10', section: 'Section A (Science)', day: 'Monday', timeSlot: '08:30 - 09:20', subject: 'Chemistry Lab', teacher: 'Dr. Anisur Rahman', room: 'Lab 103' },
      { id: 'rt-5', tenantId: 'tenant-dhaka-model', class: 'Class 10', section: 'Section A (Science)', day: 'Monday', timeSlot: '09:25 - 10:15', subject: 'ICT & Programming', teacher: 'Mahmuda Khatun', room: 'Comp Lab 1' },
    ];

    // Seed Media
    this.media = [
      {
        id: 'med-01',
        tenantId: 'tenant-dhaka-model',
        fileName: 'school_campus_exterior.jpg',
        fileSize: 482000,
        mimeType: 'image/jpeg',
        url: CAMPUS_IMG,
        altText: 'Dhaka Model Residential Academy Campus Front Lawn',
        category: 'Campus',
        uploadedAt: '2026-10-15',
        usedIn: ['Homepage Hero', 'About Page']
      },
      {
        id: 'med-02',
        tenantId: 'tenant-dhaka-model',
        fileName: 'school_classroom_stem.jpg',
        fileSize: 521000,
        mimeType: 'image/jpeg',
        url: LAB_IMG,
        altText: 'STEM Robotics & Biotech Classroom',
        category: 'Campus',
        uploadedAt: '2026-10-16',
        usedIn: ['Academic Curricula & Wings', 'Events']
      },
      {
        id: 'med-03',
        tenantId: 'tenant-dhaka-model',
        fileName: 'principal_portrait.jpg',
        fileSize: 310000,
        mimeType: 'image/jpeg',
        url: PRINCIPAL_IMG,
        altText: 'Principal Prof. Dr. M. Masudur Rahman',
        category: 'Faculty',
        uploadedAt: '2026-10-18',
        usedIn: ['Principal Message']
      },
      {
        id: 'med-04',
        tenantId: 'tenant-dhaka-model',
        fileName: 'cultural_exhibition.jpg',
        fileSize: 615000,
        mimeType: 'image/jpeg',
        url: HALL_IMG,
        altText: 'Annual Science Fair & Cultural Pavilion',
        category: 'Campus',
        uploadedAt: '2026-10-19',
        usedIn: ['Photo Gallery', 'Events']
      }
    ];

    // Seed Audit Logs
    this.auditLogs = [
      {
        id: 'log-01',
        tenantId: 'tenant-dhaka-model',
        actorEmail: 'admin@dhakamodel.edu.bd',
        actorRole: 'SCHOOL_ADMIN',
        action: 'PUBLISH_PAGE',
        entity: 'Page: home',
        entityId: 'page-dhaka-home',
        ipAddress: '192.168.1.10',
        timestamp: '2026-10-27T10:00:00.000Z',
        details: 'Published homepage revision v4 with updated 2026-2027 admission announcements.'
      },
      {
        id: 'log-02',
        tenantId: 'tenant-dhaka-model',
        actorEmail: 'admin@dhakamodel.edu.bd',
        actorRole: 'SCHOOL_ADMIN',
        action: 'UPDATE_ADMISSION_STATUS',
        entity: 'AdmissionApplication: DMRA-ADM-7822',
        entityId: 'app-2026-002',
        ipAddress: '192.168.1.10',
        timestamp: '2026-10-25T11:00:00.000Z',
        details: 'Approved applicant Samiha Afreen after merit verification.'
      }
    ];
  }

  // --- Strict Tenant-Aware Operations ---

  public getTenant(tenantId: string): Tenant | undefined {
    return this.tenants.find(t => t.id === tenantId || t.subdomain === tenantId);
  }

  public getTenantByDomain(domainOrSubdomain: string): Tenant | undefined {
    return this.tenants.find(t => 
      t.subdomain === domainOrSubdomain || 
      t.customDomain === domainOrSubdomain ||
      t.id === domainOrSubdomain
    );
  }

  public updateTenantBranding(tenantId: string, branding: Partial<Tenant['branding']>): Tenant | undefined {
    const tenant = this.getTenant(tenantId);
    if (!tenant) return undefined;
    tenant.branding = { ...tenant.branding, ...branding };
    tenant.updatedAt = new Date().toISOString();
    return tenant;
  }

  public addTenant(newTenant: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>): Tenant {
    const id = `tenant-${newTenant.subdomain}`;
    const tenant: Tenant = {
      ...newTenant,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.tenants.push(tenant);

    // Create an initial default homepage for the new tenant
    const defaultPage: Page = {
      id: `page-${newTenant.subdomain}-home`,
      tenantId: id,
      slug: 'home',
      title: 'Home',
      titleBn: 'মূল পাতা',
      sections: [
        {
          id: `sec-${newTenant.subdomain}-hero`,
          type: 'hero',
          title: `Welcome to ${newTenant.branding.schoolName}`,
          titleBn: `${newTenant.branding.schoolNameBn}-এ আপনাকে স্বাগতম`,
          subtitle: newTenant.branding.tagline,
          subtitleBn: newTenant.branding.taglineBn,
          content: 'Excellence in learning and personal development.',
          contentBn: 'জ্ঞান ও মানবিক মূল্যবোধের অনন্য প্রতিষ্ঠান।',
          imageUrl: CAMPUS_IMG,
          order: 1,
          isVisible: true
        }
      ],
      publishedSections: [
        {
          id: `sec-${newTenant.subdomain}-hero`,
          type: 'hero',
          title: `Welcome to ${newTenant.branding.schoolName}`,
          titleBn: `${newTenant.branding.schoolNameBn}-এ আপনাকে স্বাগতম`,
          subtitle: newTenant.branding.tagline,
          subtitleBn: newTenant.branding.taglineBn,
          content: 'Excellence in learning and personal development.',
          contentBn: 'জ্ঞান ও মানবিক মূল্যবোধের অনন্য প্রতিষ্ঠান।',
          imageUrl: CAMPUS_IMG,
          order: 1,
          isVisible: true
        }
      ],
      isPublished: true,
      publishedAt: new Date().toISOString(),
      lastEditedBy: 'system',
      updatedAt: new Date().toISOString(),
    };
    this.pages.push(defaultPage);

    return tenant;
  }

  // --- Page CMS & Builder Operations ---

  public getPages(tenantId: string): Page[] {
    return this.pages.filter(p => p.tenantId === tenantId);
  }

  public getPageBySlug(tenantId: string, slug: string): Page | undefined {
    return this.pages.find(p => p.tenantId === tenantId && p.slug === slug);
  }

  public savePageDraft(tenantId: string, slug: string, sections: PageSection[], userEmail: string): Page | undefined {
    let page = this.getPageBySlug(tenantId, slug);
    if (!page) {
      page = {
        id: `page-${tenantId}-${slug}-${Date.now()}`,
        tenantId,
        slug,
        title: slug.charAt(0).toUpperCase() + slug.slice(1),
        titleBn: slug,
        sections,
        publishedSections: [],
        isPublished: false,
        lastEditedBy: userEmail,
        updatedAt: new Date().toISOString()
      };
      this.pages.push(page);
    } else {
      page.sections = sections;
      page.lastEditedBy = userEmail;
      page.updatedAt = new Date().toISOString();
    }

    // Record revision
    const existingRevs = this.revisions.filter(r => r.tenantId === tenantId && r.pageId === page!.id);
    const rev: PageRevision = {
      id: `rev-${Date.now()}`,
      pageId: page.id,
      tenantId,
      version: existingRevs.length + 1,
      sections: JSON.parse(JSON.stringify(sections)),
      author: userEmail,
      timestamp: new Date().toISOString(),
      summary: `Draft autosave / update by ${userEmail}`
    };
    this.revisions.push(rev);

    return page;
  }

  public publishPage(tenantId: string, slug: string, userEmail: string): Page | undefined {
    const page = this.getPageBySlug(tenantId, slug);
    if (!page) return undefined;

    // Atomically promote current sections to publishedSections
    page.publishedSections = JSON.parse(JSON.stringify(page.sections));
    page.isPublished = true;
    page.publishedAt = new Date().toISOString();
    page.lastEditedBy = userEmail;
    page.updatedAt = new Date().toISOString();

    // Log revision publication
    const rev: PageRevision = {
      id: `rev-pub-${Date.now()}`,
      pageId: page.id,
      tenantId,
      version: this.revisions.filter(r => r.tenantId === tenantId && r.pageId === page.id).length + 1,
      sections: JSON.parse(JSON.stringify(page.publishedSections)),
      author: userEmail,
      timestamp: new Date().toISOString(),
      summary: `Published live to public website by ${userEmail}`
    };
    this.revisions.push(rev);

    // Audit log
    this.addAuditLog({
      tenantId,
      actorEmail: userEmail,
      actorRole: 'EDITOR',
      action: 'PUBLISH_PAGE',
      entity: `Page: ${slug}`,
      entityId: page.id,
      ipAddress: '127.0.0.1',
      details: `Atomic publish of page ${slug} containing ${page.sections.length} sections.`
    });

    return page;
  }

  public rollbackPage(tenantId: string, slug: string, revisionId: string, userEmail: string): Page | undefined {
    const page = this.getPageBySlug(tenantId, slug);
    if (!page) return undefined;
    const rev = this.revisions.find(r => r.id === revisionId && r.tenantId === tenantId && r.pageId === page.id);
    if (!rev) return undefined;

    page.sections = JSON.parse(JSON.stringify(rev.sections));
    page.lastEditedBy = userEmail;
    page.updatedAt = new Date().toISOString();

    this.addAuditLog({
      tenantId,
      actorEmail: userEmail,
      actorRole: 'EDITOR',
      action: 'ROLLBACK_PAGE',
      entity: `Page: ${slug}`,
      entityId: page.id,
      ipAddress: '127.0.0.1',
      details: `Reverted page ${slug} to version ${rev.version} from ${rev.timestamp}`
    });

    return page;
  }

  public getPageRevisions(tenantId: string, pageId: string): PageRevision[] {
    return this.revisions
      .filter(r => r.tenantId === tenantId && r.pageId === pageId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // --- Notices ---
  public getNotices(tenantId: string): Notice[] {
    return this.notices
      .filter(n => n.tenantId === tenantId)
      .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }

  public createNotice(tenantId: string, noticeData: Omit<Notice, 'id' | 'tenantId'>): Notice {
    const notice: Notice = {
      ...noticeData,
      id: `not-${Date.now()}`,
      tenantId
    };
    this.notices.unshift(notice);
    return notice;
  }

  // --- Events ---
  public getEvents(tenantId: string): SchoolEvent[] {
    return this.events.filter(e => e.tenantId === tenantId).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  public createEvent(tenantId: string, eventData: Omit<SchoolEvent, 'id' | 'tenantId'>): SchoolEvent {
    const event: SchoolEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      tenantId
    };
    this.events.push(event);
    return event;
  }

  // --- Admissions ---
  public getApplications(tenantId: string, statusFilter?: string): AdmissionApplication[] {
    return this.applications
      .filter(a => a.tenantId === tenantId && (!statusFilter || a.status === statusFilter))
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }

  public getApplicationByRef(tenantId: string, ref: string): AdmissionApplication | undefined {
    return this.applications.find(a => a.tenantId === tenantId && a.referenceNumber.toLowerCase() === ref.toLowerCase());
  }

  public submitApplication(tenantId: string, data: Omit<AdmissionApplication, 'id' | 'tenantId' | 'referenceNumber' | 'status' | 'notes' | 'submittedAt' | 'updatedAt'>): AdmissionApplication {
    const tenant = this.getTenant(tenantId);
    const prefix = tenant?.branding.shortName || 'ADM';
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceNumber = `${prefix}-ADM-${randomSuffix}`;

    const application: AdmissionApplication = {
      ...data,
      id: `app-${Date.now()}`,
      tenantId,
      referenceNumber,
      status: 'SUBMITTED',
      notes: [],
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.applications.unshift(application);
    return application;
  }

  public updateApplicationStatus(tenantId: string, applicationId: string, newStatus: AdmissionApplication['status'], noteText: string, actor: string): AdmissionApplication | undefined {
    const app = this.applications.find(a => a.id === applicationId && a.tenantId === tenantId);
    if (!app) return undefined;

    app.status = newStatus;
    app.updatedAt = new Date().toISOString();
    if (noteText) {
      app.notes.push({
        id: `note-${Date.now()}`,
        author: actor,
        timestamp: new Date().toISOString(),
        comment: noteText
      });
    }

    this.addAuditLog({
      tenantId,
      actorEmail: actor,
      actorRole: 'SCHOOL_ADMIN',
      action: 'UPDATE_ADMISSION_STATUS',
      entity: `AdmissionApplication: ${app.referenceNumber}`,
      entityId: app.id,
      ipAddress: '127.0.0.1',
      details: `Status set to ${newStatus}. Note: "${noteText}"`
    });

    return app;
  }

  // --- Academic Data: Students, Teachers, Attendance, Results ---
  public getStudents(tenantId: string): Student[] {
    return this.students.filter(s => s.tenantId === tenantId);
  }

  public getTeachers(tenantId: string): Teacher[] {
    return this.teachers.filter(t => t.tenantId === tenantId);
  }

  public getAttendance(tenantId: string, className?: string, date?: string): AttendanceRecord[] {
    return this.attendance.filter(a => 
      a.tenantId === tenantId && 
      (!className || a.class === className) && 
      (!date || a.date === date)
    );
  }

  public recordAttendance(tenantId: string, record: Omit<AttendanceRecord, 'id' | 'tenantId'>): AttendanceRecord {
    // If attendance for this date + class + section already exists, replace it
    const existingIndex = this.attendance.findIndex(a => 
      a.tenantId === tenantId && 
      a.class === record.class && 
      a.section === record.section && 
      a.date === record.date
    );

    const newRecord: AttendanceRecord = {
      ...record,
      id: `att-${Date.now()}`,
      tenantId
    };

    if (existingIndex >= 0) {
      this.attendance[existingIndex] = newRecord;
    } else {
      this.attendance.unshift(newRecord);
    }
    return newRecord;
  }

  public getResults(tenantId: string, studentIdNumber?: string): ExamResult[] {
    return this.results.filter(r => 
      r.tenantId === tenantId && 
      (!studentIdNumber || r.studentIdNumber.toLowerCase() === studentIdNumber.toLowerCase())
    );
  }

  public getRoutines(tenantId: string, className?: string): ClassRoutineItem[] {
    return this.routines.filter(r => r.tenantId === tenantId && (!className || r.class === className));
  }

  public getMedia(tenantId: string): MediaAsset[] {
    return this.media.filter(m => m.tenantId === tenantId);
  }

  public addMedia(tenantId: string, asset: Omit<MediaAsset, 'id' | 'tenantId' | 'uploadedAt'>): MediaAsset {
    const newAsset: MediaAsset = {
      ...asset,
      id: `med-${Date.now()}`,
      tenantId,
      uploadedAt: new Date().toISOString()
    };
    this.media.unshift(newAsset);
    return newAsset;
  }

  public getAuditLogs(tenantId: string): AuditLogEntry[] {
    return this.auditLogs
      .filter(l => l.tenantId === tenantId || tenantId === 'platform')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
    const log: AuditLogEntry = {
      ...entry,
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
    this.auditLogs.unshift(log);
    return log;
  }
}

export const dataStore = new MultiTenantDataStore();
