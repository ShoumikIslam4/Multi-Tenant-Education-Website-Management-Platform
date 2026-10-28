import { Router } from 'express';
import { AuthenticatedRequest, requireAuth, requireRole, enforceTenantIsolation } from '../middleware/auth.js';
import { resolveTenantMiddleware } from '../middleware/tenant.js';
import { dataStore } from '../db/store.js';

const router = Router();

router.use(resolveTenantMiddleware);

// Public Admission Application Submission
router.post('/apply', (req: AuthenticatedRequest, res) => {
  const {
    studentNameEn,
    studentNameBn,
    dateOfBirth,
    gender,
    applyingClass,
    academicYear,
    guardianName,
    guardianPhone,
    guardianEmail,
    previousSchool,
    address
  } = req.body;

  if (!studentNameEn || !guardianName || !guardianPhone || !applyingClass) {
    return res.status(400).json({
      success: false,
      error: 'Student Name, Guardian Name, Contact Phone, and Applying Class are required.'
    });
  }

  const application = dataStore.submitApplication(req.tenantId!, {
    studentNameEn,
    studentNameBn: studentNameBn || studentNameEn,
    dateOfBirth: dateOfBirth || '2012-01-01',
    gender: gender || 'MALE',
    applyingClass,
    academicYear: academicYear || '2026-2027',
    guardianName,
    guardianPhone,
    guardianEmail,
    previousSchool,
    address: address || 'Dhaka, Bangladesh',
  });

  dataStore.addAuditLog({
    tenantId: req.tenantId!,
    actorEmail: guardianPhone,
    actorRole: 'PUBLIC_VISITOR',
    action: 'SUBMIT_ADMISSION_APPLICATION',
    entity: `AdmissionApplication: ${application.referenceNumber}`,
    entityId: application.id,
    ipAddress: req.ip || '127.0.0.1',
    details: `Application submitted for ${studentNameEn} in ${applyingClass}. Reference: ${application.referenceNumber}`
  });

  res.status(201).json({
    success: true,
    message: 'Admission application submitted successfully. Please save your reference number for tracking.',
    referenceNumber: application.referenceNumber,
    application: {
      referenceNumber: application.referenceNumber,
      studentName: application.studentNameEn,
      applyingClass: application.applyingClass,
      academicYear: application.academicYear,
      status: application.status,
      submittedAt: application.submittedAt
    }
  });
});

// Public Application Tracking by Reference Number
router.get('/track/:referenceNumber', (req: AuthenticatedRequest, res) => {
  const ref = req.params.referenceNumber;
  const application = dataStore.getApplicationByRef(req.tenantId!, ref);

  if (!application) {
    return res.status(404).json({
      success: false,
      error: 'No application found with this reference number. Please check the spelling or format (e.g. DMRA-ADM-7821).'
    });
  }

  // Mask sensitive phone/address for public view
  const maskedPhone = application.guardianPhone.replace(/(\+?\d{4})\d+(\d{2})/, '$1****$2');

  res.json({
    success: true,
    application: {
      referenceNumber: application.referenceNumber,
      studentNameEn: application.studentNameEn,
      applyingClass: application.applyingClass,
      academicYear: application.academicYear,
      guardianName: application.guardianName,
      guardianPhoneMasked: maskedPhone,
      status: application.status,
      submittedAt: application.submittedAt,
      updatedAt: application.updatedAt
    }
  });
});

// Admin Applications Review List
router.get('/applications', requireAuth, enforceTenantIsolation, requireRole(['SUPER_ADMIN', 'SCHOOL_ADMIN']), (req: AuthenticatedRequest, res) => {
  const status = req.query.status as string;
  const applications = dataStore.getApplications(req.tenantId!, status);
  res.json({ success: true, applications });
});

// Admin Update Application Status & Notes
router.put('/applications/:id/status', requireAuth, enforceTenantIsolation, requireRole(['SUPER_ADMIN', 'SCHOOL_ADMIN']), (req: AuthenticatedRequest, res) => {
  const { status, note } = req.body;
  if (!status) {
    return res.status(400).json({ success: false, error: 'Status is required.' });
  }

  const updated = dataStore.updateApplicationStatus(
    req.tenantId!, 
    req.params.id, 
    status, 
    note || '', 
    req.user!.email
  );

  if (!updated) {
    return res.status(404).json({ success: false, error: 'Application not found.' });
  }

  res.json({
    success: true,
    message: `Application ${updated.referenceNumber} status updated to ${status}.`,
    application: updated
  });
});

export default router;
