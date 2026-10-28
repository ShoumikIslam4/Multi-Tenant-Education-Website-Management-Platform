import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role, User } from '../types/index.js';
import { dataStore } from '../db/store.js';

const JWT_SECRET = process.env.JWT_SECRET || 'schoolos-enterprise-secret-key-2026';

export interface AuthenticatedRequest extends Request {
  user?: User;
  tenantId?: string;
}

export function generateToken(user: User): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      tenantId: user.tenantId, 
      role: user.role, 
      name: user.name 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // Check Authorization header or Cookie or X-Demo-User-Role (for rapid role testing/simulation in preview)
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.token;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : cookieToken;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const foundUser = dataStore.users.find(u => u.id === decoded.id && u.isActive);
      if (foundUser) {
        req.user = foundUser;
        req.tenantId = foundUser.tenantId;
        return next();
      }
    } catch (e) {
      // Token invalid or expired, continue to check headers
    }
  }

  // Allow explicit demo impersonation header for evaluation/testing if provided
  const demoRole = req.headers['x-demo-role'] as Role;
  const demoTenantId = (req.headers['x-tenant-id'] as string) || 'tenant-dhaka-model';

  if (demoRole) {
    const demoUser = dataStore.users.find(u => 
      (demoRole === 'SUPER_ADMIN' ? u.role === 'SUPER_ADMIN' : (u.tenantId === demoTenantId && u.role === demoRole))
    );
    if (demoUser) {
      req.user = demoUser;
      req.tenantId = demoTenantId;
      return next();
    }
  }

  // Not authenticated
  req.user = undefined;
  next();
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      error: 'Authentication required. Please sign in.' 
    });
  }
  next();
}

export function requireRole(allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized. Sign in required.' });
    }

    if (req.user.role === 'SUPER_ADMIN') {
      return next(); // Platform super admin has universal access
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: `Forbidden: role '${req.user.role}' lacks permission for this operation.` 
      });
    }

    next();
  };
}

export function enforceTenantIsolation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // If user is super admin, they can operate across tenants
  if (req.user?.role === 'SUPER_ADMIN') {
    return next();
  }

  const requestedTenantId = req.params.tenantId || req.headers['x-tenant-id'] || req.query.tenantId;

  if (requestedTenantId && req.user && req.user.tenantId !== requestedTenantId) {
    return res.status(403).json({
      success: false,
      error: 'Cross-tenant access forbidden. You cannot access or modify records of another institution.'
    });
  }

  next();
}
