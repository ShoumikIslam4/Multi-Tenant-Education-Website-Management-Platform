import { Router } from 'express';
import { AuthenticatedRequest, requireAuth, requireRole, enforceTenantIsolation } from '../middleware/auth.js';
import { resolveTenantMiddleware } from '../middleware/tenant.js';
import { dataStore } from '../db/store.js';

const router = Router();

router.use(resolveTenantMiddleware);

// Get Audit Logs (School Admin or Super Admin)
router.get('/', requireAuth, enforceTenantIsolation, requireRole(['SUPER_ADMIN', 'SCHOOL_ADMIN']), (req: AuthenticatedRequest, res) => {
  const logs = dataStore.getAuditLogs(req.tenantId!);
  res.json({ success: true, logs });
});

export default router;
