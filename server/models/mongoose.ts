import mongoose, { Schema } from 'mongoose';

// Tenant Schema
export const TenantSchema = new Schema({
  subdomain: { type: String, required: true, unique: true, index: true },
  customDomain: { type: String, sparse: true, index: true },
  status: { type: String, enum: ['ACTIVE', 'SUSPENDED', 'ARCHIVED'], default: 'ACTIVE' },
  branding: {
    schoolName: { type: String, required: true },
    schoolNameBn: { type: String, required: true },
    shortName: { type: String, required: true },
    tagline: { type: String, default: '' },
    taglineBn: { type: String, default: '' },
    logoUrl: { type: String, default: '' },
    faviconUrl: { type: String, default: '' },
    establishedYear: { type: Number, default: 1985 },
    eiinNumber: { type: String, default: '108420' },
    boardAffiliation: { type: String, default: 'Dhaka Board' },
    primaryColor: { type: String, default: '#0f766e' },
    secondaryColor: { type: String, default: '#b45309' },
    accentColor: { type: String, default: '#0284c7' },
    fontFamily: { type: String, default: 'Plus Jakarta Sans' },
    address: { type: String, default: '' },
    addressBn: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    principalName: { type: String, default: '' },
    principalNameBn: { type: String, default: '' },
    principalMessage: { type: String, default: '' },
    principalMessageBn: { type: String, default: '' },
    principalImageUrl: { type: String, default: '' },
  },
  features: {
    admissionsEnabled: { type: Boolean, default: true },
    resultPortalEnabled: { type: Boolean, default: true },
    attendanceTracking: { type: Boolean, default: true },
    onlinePayments: { type: Boolean, default: false },
  }
}, { timestamps: true });

// User Schema with compound tenant index
export const UserSchema = new Schema({
  tenantId: { type: String, required: true, index: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'EDITOR', 'TEACHER', 'STUDENT', 'GUARDIAN'], 
    required: true 
  },
  phone: { type: String },
  avatarUrl: { type: String },
  isActive: { type: Boolean, default: true },
  studentId: { type: String },
  teacherId: { type: String },
  guardianId: { type: String }
}, { timestamps: true });

UserSchema.index({ tenantId: 1, email: 1 }, { unique: true });

// Page Schema
export const PageSchema = new Schema({
  tenantId: { type: String, required: true, index: true },
  slug: { type: String, required: true },
  title: { type: String, required: true },
  titleBn: { type: String, required: true },
  sections: { type: Array, default: [] },
  publishedSections: { type: Array, default: [] },
  isPublished: { type: Boolean, default: true },
  publishedAt: { type: Date },
  lastEditedBy: { type: String, default: 'admin' },
}, { timestamps: true });

PageSchema.index({ tenantId: 1, slug: 1 }, { unique: true });

// Page Revision Schema
export const PageRevisionSchema = new Schema({
  tenantId: { type: String, required: true, index: true },
  pageId: { type: String, required: true, index: true },
  version: { type: Number, required: true },
  sections: { type: Array, required: true },
  author: { type: String, required: true },
  summary: { type: String, default: 'Updated sections' }
}, { timestamps: true });

// Notice Schema
export const NoticeSchema = new Schema({
  tenantId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  titleBn: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Academic', 'Administrative', 'Admission', 'Exam', 'General'],
    default: 'General'
  },
  content: { type: String, required: true },
  contentBn: { type: String, required: true },
  publishDate: { type: Date, default: Date.now },
  expiryDate: { type: Date },
  isPinned: { type: Boolean, default: false },
  attachmentUrl: { type: String },
  attachmentName: { type: String }
}, { timestamps: true });

NoticeSchema.index({ tenantId: 1, publishDate: -1 });

// Event Schema
export const EventSchema = new Schema({
  tenantId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  titleBn: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  locationBn: { type: String, required: true },
  description: { type: String, required: true },
  descriptionBn: { type: String, required: true },
  imageUrl: { type: String },
  category: { type: String, default: 'Academic' }
}, { timestamps: true });

// Admission Application Schema
export const AdmissionApplicationSchema = new Schema({
  tenantId: { type: String, required: true, index: true },
  referenceNumber: { type: String, required: true },
  studentNameEn: { type: String, required: true },
  studentNameBn: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'], required: true },
  applyingClass: { type: String, required: true },
  academicYear: { type: String, required: true },
  guardianName: { type: String, required: true },
  guardianPhone: { type: String, required: true },
  guardianEmail: { type: String },
  previousSchool: { type: String },
  address: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['SUBMITTED', 'UNDER_REVIEW', 'INFO_REQUESTED', 'APPROVED', 'REJECTED', 'WITHDRAWN'], 
    default: 'SUBMITTED' 
  },
  notes: [{
    author: String,
    timestamp: { type: Date, default: Date.now },
    comment: String
  }]
}, { timestamps: true });

AdmissionApplicationSchema.index({ tenantId: 1, referenceNumber: 1 }, { unique: true });
AdmissionApplicationSchema.index({ tenantId: 1, status: 1 });

// Student Schema
export const StudentSchema = new Schema({
  tenantId: { type: String, required: true, index: true },
  studentIdNumber: { type: String, required: true },
  name: { type: String, required: true },
  nameBn: { type: String, required: true },
  class: { type: String, required: true },
  section: { type: String, required: true },
  roll: { type: Number, required: true },
  guardianId: { type: String },
  guardianName: { type: String, required: true },
  guardianPhone: { type: String, required: true },
  bloodGroup: { type: String, default: 'A+' },
  attendanceRate: { type: Number, default: 95 }
}, { timestamps: true });

StudentSchema.index({ tenantId: 1, class: 1, section: 1, roll: 1 }, { unique: true });
StudentSchema.index({ tenantId: 1, studentIdNumber: 1 }, { unique: true });

// Teacher Schema
export const TeacherSchema = new Schema({
  tenantId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  nameBn: { type: String, required: true },
  designation: { type: String, required: true },
  designationBn: { type: String, required: true },
  department: { type: String, required: true },
  departmentBn: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  qualification: { type: String, required: true },
  imageUrl: { type: String },
  assignedClasses: [{ type: String }]
}, { timestamps: true });

TeacherSchema.index({ tenantId: 1, email: 1 }, { unique: true });

// Attendance Schema
export const AttendanceSchema = new Schema({
  tenantId: { type: String, required: true, index: true },
  class: { type: String, required: true },
  section: { type: String, required: true },
  date: { type: String, required: true },
  records: [{
    studentId: String,
    studentName: String,
    roll: Number,
    status: { type: String, enum: ['PRESENT', 'ABSENT', 'LATE'] },
    remarks: String
  }],
  recordedBy: { type: String, required: true }
}, { timestamps: true });

AttendanceSchema.index({ tenantId: 1, class: 1, section: 1, date: 1 }, { unique: true });

// Exam Result Schema
export const ExamResultSchema = new Schema({
  tenantId: { type: String, required: true, index: true },
  examName: { type: String, required: true },
  academicYear: { type: String, required: true },
  class: { type: String, required: true },
  studentIdNumber: { type: String, required: true },
  studentName: { type: String, required: true },
  roll: { type: Number, required: true },
  isPublished: { type: Boolean, default: false },
  subjects: [{
    subjectName: String,
    marksObtained: Number,
    totalMarks: Number,
    grade: String,
    gpa: Number
  }],
  totalMarks: Number,
  gpa: Number,
  grade: String
}, { timestamps: true });

ExamResultSchema.index({ tenantId: 1, examName: 1, studentIdNumber: 1 }, { unique: true });

// Audit Log Schema
export const AuditLogSchema = new Schema({
  tenantId: { type: String, required: true, index: true },
  actorEmail: { type: String, required: true },
  actorRole: { type: String, required: true },
  action: { type: String, required: true },
  entity: { type: String, required: true },
  entityId: { type: String },
  ipAddress: { type: String, default: '127.0.0.1' },
  details: { type: String }
}, { timestamps: true });

AuditLogSchema.index({ tenantId: 1, createdAt: -1 });

export const getModels = () => {
  return {
    Tenant: mongoose.models.Tenant || mongoose.model('Tenant', TenantSchema),
    User: mongoose.models.User || mongoose.model('User', UserSchema),
    Page: mongoose.models.Page || mongoose.model('Page', PageSchema),
    PageRevision: mongoose.models.PageRevision || mongoose.model('PageRevision', PageRevisionSchema),
    Notice: mongoose.models.Notice || mongoose.model('Notice', NoticeSchema),
    SchoolEvent: mongoose.models.SchoolEvent || mongoose.model('SchoolEvent', EventSchema),
    AdmissionApplication: mongoose.models.AdmissionApplication || mongoose.model('AdmissionApplication', AdmissionApplicationSchema),
    Student: mongoose.models.Student || mongoose.model('Student', StudentSchema),
    Teacher: mongoose.models.Teacher || mongoose.model('Teacher', TeacherSchema),
    Attendance: mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema),
    ExamResult: mongoose.models.ExamResult || mongoose.model('ExamResult', ExamResultSchema),
    AuditLog: mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema),
  };
};
