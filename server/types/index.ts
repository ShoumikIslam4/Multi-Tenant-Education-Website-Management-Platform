export type Role = 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'EDITOR' | 'TEACHER' | 'STUDENT' | 'GUARDIAN';

export interface TenantBranding {
  schoolName: string;
  schoolNameBn: string;
  shortName: string;
  tagline: string;
  taglineBn: string;
  logoUrl: string;
  faviconUrl: string;
  establishedYear: number;
  eiinNumber: string; // Educational Institute Identification Number
  boardAffiliation: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  address: string;
  addressBn: string;
  phone: string;
  email: string;
  principalName: string;
  principalNameBn: string;
  principalMessage: string;
  principalMessageBn: string;
  principalImageUrl: string;
}

export interface Tenant {
  id: string;
  subdomain: string;
  customDomain?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';
  branding: TenantBranding;
  features: {
    admissionsEnabled: boolean;
    resultPortalEnabled: boolean;
    attendanceTracking: boolean;
    onlinePayments: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: Role;
  phone?: string;
  avatarUrl?: string;
  isActive: boolean;
  studentId?: string;
  teacherId?: string;
  guardianId?: string;
  createdAt: string;
}

export interface PageSection {
  id: string;
  type: 
    | 'hero' 
    | 'principal_message' 
    | 'programs' 
    | 'stats' 
    | 'notices' 
    | 'events' 
    | 'faculty' 
    | 'gallery' 
    | 'testimonials' 
    | 'cta' 
    | 'contact' 
    | 'rich_text';
  title: string;
  titleBn: string;
  subtitle?: string;
  subtitleBn?: string;
  content?: string;
  contentBn?: string;
  imageUrl?: string;
  order: number;
  isVisible: boolean;
  settings?: Record<string, any>;
}

export interface Page {
  id: string;
  tenantId: string;
  slug: string;
  title: string;
  titleBn: string;
  sections: PageSection[];
  publishedSections: PageSection[];
  isPublished: boolean;
  publishedAt?: string;
  lastEditedBy: string;
  updatedAt: string;
}

export interface PageRevision {
  id: string;
  pageId: string;
  tenantId: string;
  version: number;
  sections: PageSection[];
  author: string;
  timestamp: string;
  summary: string;
}

export interface Notice {
  id: string;
  tenantId: string;
  title: string;
  titleBn: string;
  category: 'Academic' | 'Administrative' | 'Admission' | 'Exam' | 'General';
  content: string;
  contentBn: string;
  publishDate: string;
  expiryDate?: string;
  isPinned: boolean;
  attachmentUrl?: string;
  attachmentName?: string;
}

export interface SchoolEvent {
  id: string;
  tenantId: string;
  title: string;
  titleBn: string;
  date: string;
  time: string;
  location: string;
  locationBn: string;
  description: string;
  descriptionBn: string;
  imageUrl?: string;
  category: 'Sports' | 'Cultural' | 'Academic' | 'National';
}

export interface AdmissionApplication {
  id: string;
  tenantId: string;
  referenceNumber: string;
  studentNameEn: string;
  studentNameBn: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  applyingClass: string;
  academicYear: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string;
  previousSchool?: string;
  address: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'INFO_REQUESTED' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN';
  notes: Array<{
    id: string;
    author: string;
    timestamp: string;
    comment: string;
  }>;
  submittedAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  tenantId: string;
  studentIdNumber: string; // Roll or ID (e.g. STD-2026-101)
  name: string;
  nameBn: string;
  class: string;
  section: string;
  roll: number;
  guardianId: string;
  guardianName: string;
  guardianPhone: string;
  bloodGroup: string;
  attendanceRate: number;
}

export interface Teacher {
  id: string;
  tenantId: string;
  name: string;
  nameBn: string;
  designation: string;
  designationBn: string;
  department: string;
  departmentBn: string;
  email: string;
  phone: string;
  qualification: string;
  imageUrl?: string;
  assignedClasses: string[];
}

export interface AttendanceRecord {
  id: string;
  tenantId: string;
  class: string;
  section: string;
  date: string;
  records: Array<{
    studentId: string;
    studentName: string;
    roll: number;
    status: 'PRESENT' | 'ABSENT' | 'LATE';
    remarks?: string;
  }>;
  recordedBy: string;
}

export interface ExamResult {
  id: string;
  tenantId: string;
  examName: string;
  academicYear: string;
  class: string;
  studentIdNumber: string;
  studentName: string;
  roll: number;
  isPublished: boolean;
  subjects: Array<{
    subjectName: string;
    marksObtained: number;
    totalMarks: number;
    grade: string;
    gpa: number;
  }>;
  totalMarks: number;
  gpa: number;
  grade: string;
}

export interface ClassRoutineItem {
  id: string;
  tenantId: string;
  class: string;
  section: string;
  day: 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday';
  timeSlot: string;
  subject: string;
  teacher: string;
  room: string;
}

export interface MediaAsset {
  id: string;
  tenantId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  altText: string;
  category: 'General' | 'Campus' | 'Faculty' | 'Documents';
  uploadedAt: string;
  usedIn: string[];
}

export interface AuditLogEntry {
  id: string;
  tenantId: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  entity: string;
  entityId?: string;
  ipAddress: string;
  timestamp: string;
  details: string;
}
