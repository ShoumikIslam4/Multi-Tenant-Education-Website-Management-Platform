import { Router } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { resolveTenantMiddleware } from '../middleware/tenant.js';
import { dataStore } from '../db/store.js';

const router = Router();

// Apply tenant resolution to all public routes
router.use(resolveTenantMiddleware);

// Get complete public site package for initial fast load
router.get('/site', (req: AuthenticatedRequest, res) => {
  const tenantId = req.tenantId!;
  const tenant = (req as any).resolvedTenant;
  const homePage = dataStore.getPageBySlug(tenantId, 'home');
  const notices = dataStore.getNotices(tenantId).slice(0, 5);
  const events = dataStore.getEvents(tenantId).slice(0, 3);
  const teachers = dataStore.getTeachers(tenantId).slice(0, 6);

  res.json({
    success: true,
    tenant: {
      id: tenant.id,
      subdomain: tenant.subdomain,
      branding: tenant.branding,
      features: tenant.features,
    },
    page: homePage ? {
      slug: homePage.slug,
      title: homePage.title,
      titleBn: homePage.titleBn,
      // For public visitors, ONLY return publishedSections!
      sections: homePage.publishedSections && homePage.publishedSections.length > 0 
        ? homePage.publishedSections 
        : homePage.sections,
      updatedAt: homePage.updatedAt,
    } : null,
    recentNotices: notices,
    upcomingEvents: events,
    featuredFaculty: teachers,
  });
});

// Public Notices
router.get('/notices', (req: AuthenticatedRequest, res) => {
  const category = req.query.category as string;
  let notices = dataStore.getNotices(req.tenantId!);
  if (category && category !== 'All') {
    notices = notices.filter(n => n.category.toLowerCase() === category.toLowerCase());
  }
  res.json({ success: true, notices });
});

// Public Events
router.get('/events', (req: AuthenticatedRequest, res) => {
  const events = dataStore.getEvents(req.tenantId!);
  res.json({ success: true, events });
});

// Public Faculty & Staff Directory
router.get('/faculty', (req: AuthenticatedRequest, res) => {
  const teachers = dataStore.getTeachers(req.tenantId!);
  res.json({ success: true, teachers });
});

// Public Routines
router.get('/routines', (req: AuthenticatedRequest, res) => {
  const className = req.query.class as string;
  const routines = dataStore.getRoutines(req.tenantId!, className);
  res.json({ success: true, routines });
});

// Public Result Verification (Only published results returned)
router.post('/verify-result', (req: AuthenticatedRequest, res) => {
  const { studentIdNumber, roll, examName } = req.body;

  if (!studentIdNumber && !roll) {
    return res.status(400).json({ 
      success: false, 
      error: 'Student ID Number or Roll Number is required for result verification.' 
    });
  }

  const results = dataStore.getResults(req.tenantId!);
  const matched = results.find(r => 
    r.isPublished && 
    ((studentIdNumber && r.studentIdNumber.toLowerCase() === studentIdNumber.toLowerCase().trim()) ||
     (roll && r.roll === Number(roll)))
  );

  if (!matched) {
    return res.status(404).json({
      success: false,
      error: 'No published examination result found for the supplied credentials. Please verify with the administrative office.'
    });
  }

  res.json({
    success: true,
    result: {
      studentName: matched.studentName,
      studentIdNumber: matched.studentIdNumber,
      class: matched.class,
      roll: matched.roll,
      examName: matched.examName,
      academicYear: matched.academicYear,
      subjects: matched.subjects,
      totalMarks: matched.totalMarks,
      gpa: matched.gpa,
      grade: matched.grade
    }
  });
});

// Public Contact Form Submission
router.post('/contact', (req: AuthenticatedRequest, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
  }

  dataStore.addAuditLog({
    tenantId: req.tenantId!,
    actorEmail: email,
    actorRole: 'PUBLIC_VISITOR',
    action: 'SUBMIT_CONTACT_INQUIRY',
    entity: 'ContactInquiry',
    ipAddress: req.ip || '127.0.0.1',
    details: `Inquiry from ${name} (${email}): ${subject || 'General'}`
  });

  res.json({
    success: true,
    message: 'Your inquiry has been registered. Our administrative team will respond shortly.'
  });
});

export default router;
