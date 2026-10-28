import { Router } from 'express';
import { AuthenticatedRequest, requireAuth, requireRole, enforceTenantIsolation } from '../middleware/auth.js';
import { resolveTenantMiddleware } from '../middleware/tenant.js';
import { dataStore } from '../db/store.js';

const router = Router();

router.use(resolveTenantMiddleware);

// Get Media Assets
router.get('/', requireAuth, enforceTenantIsolation, requireRole(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'EDITOR']), (req: AuthenticatedRequest, res) => {
  const media = dataStore.getMedia(req.tenantId!);
  res.json({ success: true, media });
});

// Add / Upload Media Asset
router.post('/', requireAuth, enforceTenantIsolation, requireRole(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'EDITOR']), (req: AuthenticatedRequest, res) => {
  const { fileName, url, altText, category, fileSize, mimeType } = req.body;

  if (!url || !fileName) {
    return res.status(400).json({ success: false, error: 'File name and asset URL are required.' });
  }

  const asset = dataStore.addMedia(req.tenantId!, {
    fileName,
    url,
    altText: altText || fileName,
    category: category || 'Campus',
    fileSize: fileSize || 250000,
    mimeType: mimeType || 'image/jpeg',
    usedIn: ['Media Library']
  });

  dataStore.addAuditLog({
    tenantId: req.tenantId!,
    actorEmail: req.user!.email,
    actorRole: req.user!.role,
    action: 'UPLOAD_MEDIA',
    entity: `MediaAsset: ${fileName}`,
    entityId: asset.id,
    ipAddress: req.ip || '127.0.0.1',
    details: `Uploaded media asset '${fileName}' (${category}).`
  });

  res.status(201).json({ success: true, asset });
});

export default router;
