import { Router } from 'express';
import { AuthenticatedRequest, requireAuth, requireRole, enforceTenantIsolation } from '../middleware/auth.js';
import { dataStore } from '../db/store.js';

const router = Router();

// Public / client list of active institutions (for directory or switching)
router.get('/', (req, res) => {
  const tenants = dataStore.tenants.map(t => ({
    id: t.id,
    subdomain: t.subdomain,
    customDomain: t.customDomain,
    status: t.status,
    branding: t.branding,
    features: t.features,
    createdAt: t.createdAt
  }));
  res.json({ success: true, tenants });
});

// Single tenant detail
router.get('/:tenantId', (req, res) => {
  const tenant = dataStore.getTenant(req.params.tenantId) || dataStore.getTenantByDomain(req.params.tenantId);
  if (!tenant) {
    return res.status(404).json({ success: false, error: 'Tenant not found.' });
  }
  res.json({ success: true, tenant });
});

// Create tenant (SUPER_ADMIN only)
router.post('/', requireAuth, requireRole(['SUPER_ADMIN']), (req: AuthenticatedRequest, res) => {
  const { subdomain, schoolName, schoolNameBn, shortName, tagline, taglineBn, primaryColor } = req.body;

  if (!subdomain || !schoolName) {
    return res.status(400).json({ success: false, error: 'Subdomain and School Name are required.' });
  }

  // Check unique subdomain
  if (dataStore.getTenant(subdomain)) {
    return res.status(409).json({ success: false, error: `Subdomain '${subdomain}' is already registered.` });
  }

  const newTenant = dataStore.addTenant({
    subdomain: subdomain.toLowerCase().trim(),
    status: 'ACTIVE',
    branding: {
      schoolName,
      schoolNameBn: schoolNameBn || schoolName,
      shortName: shortName || subdomain.toUpperCase(),
      tagline: tagline || '',
      taglineBn: taglineBn || '',
      logoUrl: '/favicon.ico',
      faviconUrl: '/favicon.ico',
      establishedYear: new Date().getFullYear(),
      eiinNumber: '100000',
      boardAffiliation: 'Dhaka Board',
      primaryColor: primaryColor || '#0f766e',
      secondaryColor: '#b45309',
      accentColor: '#0284c7',
      fontFamily: 'Plus Jakarta Sans',
      address: 'Dhaka, Bangladesh',
      addressBn: 'ঢাকা, বাংলাদেশ',
      phone: '+880 1700-000000',
      email: `info@${subdomain}.edu.bd`,
      principalName: 'Academic Principal',
      principalNameBn: 'অধ্যক্ষ',
      principalMessage: 'Welcome to our institution.',
      principalMessageBn: 'আমাদের প্রতিষ্ঠানে স্বাগতম।',
      principalImageUrl: '/src/assets/images/school_principal_portrait_1793173376401.jpg',
    },
    features: {
      admissionsEnabled: true,
      resultPortalEnabled: true,
      attendanceTracking: true,
      onlinePayments: false,
    }
  });

  dataStore.addAuditLog({
    tenantId: 'platform',
    actorEmail: req.user!.email,
    actorRole: req.user!.role,
    action: 'CREATE_TENANT',
    entity: 'Tenant',
    entityId: newTenant.id,
    ipAddress: req.ip || '127.0.0.1',
    details: `Created new educational tenant '${schoolName}' with subdomain '${subdomain}'.`
  });

  res.status(201).json({ success: true, tenant: newTenant });
});

// Update Branding & Theme Settings
router.put('/:tenantId/branding', requireAuth, enforceTenantIsolation, requireRole(['SUPER_ADMIN', 'SCHOOL_ADMIN']), (req: AuthenticatedRequest, res) => {
  const tenantId = req.params.tenantId;
  const brandingData = req.body;

  const updatedTenant = dataStore.updateTenantBranding(tenantId, brandingData);
  if (!updatedTenant) {
    return res.status(404).json({ success: false, error: 'Tenant not found.' });
  }

  dataStore.addAuditLog({
    tenantId,
    actorEmail: req.user!.email,
    actorRole: req.user!.role,
    action: 'UPDATE_BRANDING',
    entity: 'TenantBranding',
    entityId: tenantId,
    ipAddress: req.ip || '127.0.0.1',
    details: `Updated branding configurations (colors, typography, contact details).`
  });

  res.json({ success: true, branding: updatedTenant.branding });
});

export default router;
