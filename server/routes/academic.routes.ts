import { Router } from 'express';
import { AuthenticatedRequest, requireAuth, requireRole, enforceTenantIsolation } from '../middleware/auth.js';
import { resolveTenantMiddleware } from '../middleware/tenant.js';
import { dataStore } from '../db/store.js';

const router = Router();

router.use(resolveTenantMiddleware);

// Students Directory (with role permissions)
router.get('/students', requireAuth, enforceTenantIsolation, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const allStudents = dataStore.getStudents(req.tenantId!);

  // If student role, ONLY return own profile!
  if (user.role === 'STUDENT') {
    const ownStudent = allStudents.filter(s => s.studentIdNumber.toLowerCase() === (user.studentId || '').toLowerCase() || s.id === user.studentId);
    return res.json({ success: true, students: ownStudent });
  }

  // If guardian role, ONLY return linked student!
  if (user.role === 'GUARDIAN') {
    const linkedStudents = allStudents.filter(s => s.guardianId === user.guardianId || s.guardianPhone === user.phone);
    return res.json({ success: true, students: linkedStudents });
  }

  // Teacher & Admin can view class student list
  res.json({ success: true, students: allStudents });
});

// Teachers Directory
router.get('/teachers', requireAuth, enforceTenantIsolation, (req: AuthenticatedRequest, res) => {
  const teachers = dataStore.getTeachers(req.tenantId!);
  res.json({ success: true, teachers });
});

// Get Attendance Records
router.get('/attendance', requireAuth, enforceTenantIsolation, (req: AuthenticatedRequest, res) => {
  const className = req.query.class as string;
  const date = req.query.date as string;
  const records = dataStore.getAttendance(req.tenantId!, className, date);
  res.json({ success: true, records });
});

// Record Attendance (Teacher or Admin)
router.post('/attendance', requireAuth, enforceTenantIsolation, requireRole(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER']), (req: AuthenticatedRequest, res) => {
  const { className, section, date, records } = req.body;

  if (!className || !section || !date || !Array.isArray(records)) {
    return res.status(400).json({ success: false, error: 'Class, Section, Date, and Records array are required.' });
  }

  const savedRecord = dataStore.recordAttendance(req.tenantId!, {
    class: className,
    section,
    date,
    records,
    recordedBy: req.user!.name
  });

  dataStore.addAuditLog({
    tenantId: req.tenantId!,
    actorEmail: req.user!.email,
    actorRole: req.user!.role,
    action: 'RECORD_ATTENDANCE',
    entity: `Attendance: ${className} - ${section}`,
    ipAddress: req.ip || '127.0.0.1',
    details: `Attendance recorded for ${records.length} students on ${date} by ${req.user!.name}.`
  });

  res.status(201).json({ success: true, message: 'Attendance recorded successfully.', record: savedRecord });
});

// Get Examination Results
router.get('/results', requireAuth, enforceTenantIsolation, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  let results = dataStore.getResults(req.tenantId!);

  // Student can only see their own results
  if (user.role === 'STUDENT') {
    results = results.filter(r => r.studentIdNumber.toLowerCase() === (user.studentId || '').toLowerCase());
  }

  res.json({ success: true, results });
});

// Publish/Toggle Result (School Admin or Super Admin)
router.put('/results/:id/publish', requireAuth, enforceTenantIsolation, requireRole(['SUPER_ADMIN', 'SCHOOL_ADMIN']), (req: AuthenticatedRequest, res) => {
  const result = dataStore.results.find(r => r.id === req.params.id && r.tenantId === req.tenantId);
  if (!result) {
    return res.status(404).json({ success: false, error: 'Result record not found.' });
  }

  result.isPublished = !result.isPublished;

  dataStore.addAuditLog({
    tenantId: req.tenantId!,
    actorEmail: req.user!.email,
    actorRole: req.user!.role,
    action: result.isPublished ? 'PUBLISH_EXAM_RESULT' : 'UNPUBLISH_EXAM_RESULT',
    entity: `ExamResult: ${result.studentName} (${result.studentIdNumber})`,
    entityId: result.id,
    ipAddress: req.ip || '127.0.0.1',
    details: `Result for ${result.examName} published state set to ${result.isPublished}.`
  });

  res.json({ success: true, result });
});

export default router;
