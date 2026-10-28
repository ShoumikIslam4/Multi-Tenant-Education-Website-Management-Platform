import { Router } from 'express';
import { AuthenticatedRequest, generateToken } from '../middleware/auth.js';
import { dataStore } from '../db/store.js';

const router = Router();

// Demo accounts for quick review across all roles
router.get('/demo-accounts', (req, res) => {
  const accounts = dataStore.users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    tenantId: u.tenantId,
    institution: dataStore.getTenant(u.tenantId)?.branding.schoolName || 'Platform Headquarters'
  }));

  res.json({ success: true, accounts });
});

// Login
router.post('/login', (req, res) => {
  const { email, password, tenantId } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email address is required.' });
  }

  // Find user (tenant-scoped or platform admin)
  const user = dataStore.users.find(u => 
    u.email.toLowerCase() === email.toLowerCase() &&
    (!tenantId || u.tenantId === 'platform' || u.tenantId === tenantId)
  );

  if (!user || !user.isActive) {
    return res.status(401).json({ success: false, error: 'Invalid credentials or inactive account.' });
  }

  const token = generateToken(user);
  const tenant = dataStore.getTenant(user.tenantId);

  // Set secure HTTP-only cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  // Audit log
  dataStore.addAuditLog({
    tenantId: user.tenantId,
    actorEmail: user.email,
    actorRole: user.role,
    action: 'USER_LOGIN',
    entity: 'User',
    entityId: user.id,
    ipAddress: req.ip || '127.0.0.1',
    details: `User ${user.email} successfully authenticated with role ${user.role}.`
  });

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      phone: user.phone,
      studentId: user.studentId,
      teacherId: user.teacherId,
      guardianId: user.guardianId
    },
    tenant: tenant ? {
      id: tenant.id,
      subdomain: tenant.subdomain,
      branding: tenant.branding,
      features: tenant.features
    } : null
  });
});

// Current User Session
router.get('/me', (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.json({ success: true, user: null });
  }

  const tenant = dataStore.getTenant(req.user.tenantId);
  res.json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      tenantId: req.user.tenantId,
      phone: req.user.phone,
      studentId: req.user.studentId,
      teacherId: req.user.teacherId,
      guardianId: req.user.guardianId
    },
    tenant: tenant ? {
      id: tenant.id,
      subdomain: tenant.subdomain,
      branding: tenant.branding,
      features: tenant.features
    } : null
  });
});

// Logout
router.post('/logout', (req: AuthenticatedRequest, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully.' });
});

export default router;
