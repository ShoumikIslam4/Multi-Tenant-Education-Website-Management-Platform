import { Router } from 'express';
import { AuthenticatedRequest, requireAuth, requireRole, enforceTenantIsolation } from '../middleware/auth.js';
import { resolveTenantMiddleware } from '../middleware/tenant.js';
import { dataStore } from '../db/store.js';

const router = Router();

router.use(resolveTenantMiddleware);

// Get all pages for this tenant
router.get('/', (req: AuthenticatedRequest, res) => {
  const pages = dataStore.getPages(req.tenantId!);
  res.json({ success: true, pages });
});

// Get single page by slug (includes draft & published sections for editors)
router.get('/:slug', (req: AuthenticatedRequest, res) => {
  const page = dataStore.getPageBySlug(req.tenantId!, req.params.slug);
  if (!page) {
    return res.status(404).json({ success: false, error: 'Page not found.' });
  }
  res.json({ success: true, page });
});

// Save Page Draft (Editor or Admin)
router.put('/:slug/draft', requireAuth, enforceTenantIsolation, requireRole(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'EDITOR']), (req: AuthenticatedRequest, res) => {
  const { sections } = req.body;
  if (!Array.isArray(sections)) {
    return res.status(400).json({ success: false, error: 'Sections array is required.' });
  }

  const updatedPage = dataStore.savePageDraft(req.tenantId!, req.params.slug, sections, req.user!.email);
  res.json({ success: true, page: updatedPage });
});

// Publish Page (Editor or Admin)
router.post('/:slug/publish', requireAuth, enforceTenantIsolation, requireRole(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'EDITOR']), (req: AuthenticatedRequest, res) => {
  const publishedPage = dataStore.publishPage(req.tenantId!, req.params.slug, req.user!.email);
  if (!publishedPage) {
    return res.status(404).json({ success: false, error: 'Page not found to publish.' });
  }

  res.json({ 
    success: true, 
    message: `Page '${req.params.slug}' successfully published to the live public website.`,
    page: publishedPage 
  });
});

// Get Revisions History
router.get('/:slug/revisions', requireAuth, enforceTenantIsolation, requireRole(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'EDITOR']), (req: AuthenticatedRequest, res) => {
  const page = dataStore.getPageBySlug(req.tenantId!, req.params.slug);
  if (!page) {
    return res.status(404).json({ success: false, error: 'Page not found.' });
  }

  const revisions = dataStore.getPageRevisions(req.tenantId!, page.id);
  res.json({ success: true, revisions });
});

// Rollback to Revision
router.post('/:slug/rollback', requireAuth, enforceTenantIsolation, requireRole(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'EDITOR']), (req: AuthenticatedRequest, res) => {
  const { revisionId } = req.body;
  if (!revisionId) {
    return res.status(400).json({ success: false, error: 'Revision ID is required.' });
  }

  const restoredPage = dataStore.rollbackPage(req.tenantId!, req.params.slug, revisionId, req.user!.email);
  if (!restoredPage) {
    return res.status(404).json({ success: false, error: 'Revision or Page not found.' });
  }

  res.json({ success: true, message: 'Page successfully rolled back to chosen revision.', page: restoredPage });
});

export default router;
