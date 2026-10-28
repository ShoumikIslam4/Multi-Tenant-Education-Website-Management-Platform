import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { authMiddleware } from './server/middleware/auth.js';
import authRoutes from './server/routes/auth.routes.js';
import tenantRoutes from './server/routes/tenants.routes.js';
import publicRoutes from './server/routes/public.routes.js';
import pagesRoutes from './server/routes/pages.routes.js';
import admissionsRoutes from './server/routes/admissions.routes.js';
import academicRoutes from './server/routes/academic.routes.js';
import mediaRoutes from './server/routes/media.routes.js';
import auditRoutes from './server/routes/audit.routes.js';
import { dataStore } from './server/db/store.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  // Initialize MongoDB Atlas if URI is provided
  if (process.env.MONGODB_URI) {
    await dataStore.initMongo(process.env.MONGODB_URI);
  } else {
    console.log('MongoDB Atlas URI not set in environment. Running with high-fidelity tenant repository store.');
  }

  // Security and request parsing middlewares
  app.use(cors({
    origin: true,
    credentials: true,
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(cookieParser());

  // Security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Global Auth context resolver
  app.use(authMiddleware as any);

  // Health and System Diagnostics
  app.get('/api/v1/health', (req, res) => {
    res.json({
      status: 'UP',
      platform: 'SchoolOS Multi-Tenant Architecture v1.0',
      timestamp: new Date().toISOString(),
      tenantsCount: dataStore.tenants.length,
      activeTenantDefault: 'dhaka-model',
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Mount versioned REST API routes under /api/v1
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/tenants', tenantRoutes);
  app.use('/api/v1/public', publicRoutes);
  app.use('/api/v1/pages', pagesRoutes);
  app.use('/api/v1/admissions', admissionsRoutes);
  app.use('/api/v1/academic', academicRoutes);
  app.use('/api/v1/media', mediaRoutes);
  app.use('/api/v1/audit-logs', auditRoutes);

  // Centralized Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled Server Error:', err);
    res.status(err.status || 500).json({
      success: false,
      error: isProduction ? 'Internal Server Error' : err.message || 'An unexpected error occurred.'
    });
  });

  // Vite integration: Dev Middleware or Production Static Delivery
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n======================================================`);
    console.log(`  SchoolOS Server running on port ${PORT}`);
    console.log(`  Dev URL: http://localhost:${PORT}`);
    console.log(`  API Base: http://localhost:${PORT}/api/v1`);
    console.log(`  Active Tenants: ${dataStore.tenants.map(t => t.subdomain).join(', ')}`);
    console.log(`======================================================\n`);
  });
}

startServer().catch(err => {
  console.error('Failed to bootstrap SchoolOS server:', err);
  process.exit(1);
});
