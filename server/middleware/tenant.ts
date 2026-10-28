import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.js';
import { dataStore } from '../db/store.js';

export function resolveTenantMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const host = req.headers.host || '';
  let tenantIdentifier: string | undefined;

  // 1. Try subdomain parsing (e.g., dhaka-model.schoolos.net)
  const hostParts = host.split('.');
  if (hostParts.length > 2) {
    const sub = hostParts[0].toLowerCase();
    if (sub !== 'www' && sub !== 'app' && sub !== 'api') {
      tenantIdentifier = sub;
    }
  }

  // 2. Explicit header or query param
  if (!tenantIdentifier) {
    tenantIdentifier = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string);
  }

  // 3. Fallback to authenticated user's tenant if logged in
  if (!tenantIdentifier && req.user && req.user.tenantId !== 'platform') {
    tenantIdentifier = req.user.tenantId;
  }

  // 4. Default to first active tenant (Dhaka Model)
  if (!tenantIdentifier) {
    tenantIdentifier = 'tenant-dhaka-model';
  }

  const tenant = dataStore.getTenant(tenantIdentifier) || dataStore.getTenantByDomain(tenantIdentifier);

  if (!tenant) {
    return res.status(404).json({
      success: false,
      error: `Institution tenant '${tenantIdentifier}' was not found on this platform.`
    });
  }

  if (tenant.status === 'SUSPENDED') {
    return res.status(403).json({
      success: false,
      error: 'This institution account is currently suspended. Please contact platform administration.'
    });
  }

  req.tenantId = tenant.id;
  (req as any).resolvedTenant = tenant;
  next();
}
