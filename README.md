# SchoolOS — Multi-Tenant School & Institute Platform

SchoolOS is an enterprise-grade multi-tenant web platform and CMS architected for independent schools, colleges, madrasas, and coaching institutes.

---

## Key Features

1. **Strict Multi-Tenant Architecture**:
   - Shared MongoDB database collections with mandatory `tenantId` constraints and tenant-scoped compound indexes.
   - Hostname, subdomain, or explicit context resolution.
   - Cross-tenant data isolation enforced by server-side authorization middleware (`enforceTenantIsolation`).

2. **Dynamic Visual Website Builder & CMS**:
   - Zero-code drag-and-drop section management (Hero, Principal Message, Curricula, Statistics, Notice Board, Gallery, CTA).
   - Atomic Draft and Publish system with revision history and one-click rollback.
   - Real-time device frame preview for Desktop, Tablet, and Mobile viewports.
   - Full branding customizer (Primary & secondary color tokens, school names, typography, EIIN, contact coordinates).

3. **Admissions Workflow**:
   - Public online admission application form with validation.
   - Automated reference generation (e.g. `DMRA-ADM-XXXX`).
   - Secure reference tracking portal with masked contact details.
   - Administrative review pipeline with status transitions (`SUBMITTED`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`, `INFO_REQUESTED`) and internal evaluation audit notes.

4. **Academic Operations**:
   - Daily digital attendance roll register with live persistence.
   - Verified examination results publication with official grade sheets and GPA 5.0 calculations.
   - Weekly class routines and schedule viewer.
   - Public faculty and staff directory.

5. **Role-Based Access Control (RBAC)**:
   - **Super Admin**: Platform-wide tenant creation and global audit logs.
   - **School Admin**: Full institute management, admissions pipeline, attendance, and branding.
   - **Website Editor**: Visual website builder, draft/publish workflow, and media assets.
   - **Teacher**: Daily roll-call attendance, class routines, and mark entry.
   - **Student**: Private academic dossier, attendance rate, and report cards.
   - **Guardian**: Linked student attendance and examination tracking.
   - **Public Visitor**: Published notices, programs, admission forms, and approved results.

6. **Bilingual Support (Bangla & English)**:
   - Authentic Bengali typography (`Hind Siliguri`) alongside Latin display faces (`Plus Jakarta Sans`).
   - Seamless one-click bilingual toggle across all views and database models.

---

## Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide icons, Motion.
- **Backend**: Node.js, Express, TypeScript (`server.ts` entry point).
- **Database**: MongoDB Atlas with Mongoose schemas and isolated in-memory repository fallback.
- **Security**: JWT authentication, HttpOnly cookies, RBAC authorization middleware, and immutable audit logs.

---

## Configuration & Environment Variables

Copy `.env.example` to `.env`:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/schoolos?retryWrites=true&w=majority
JWT_SECRET=your-256-bit-secret-key-here
```

### Pre-Seeded Institutions for Testing:
1. **Dhaka Model Residential Academy** (`tenant-dhaka-model`)
2. **Chittagong Science & Technology College** (`tenant-cstc`)

---

## API Endpoints Overview (/api/v1)

- `GET /api/v1/health` - Platform diagnostics and active tenants count.
- `POST /api/v1/auth/login` - Authenticate with email and password.
- `GET /api/v1/auth/me` - Inspect active session and role permissions.
- `GET /api/v1/tenants` - List active institution tenants.
- `PUT /api/v1/tenants/:id/branding` - Update colors, titles, and logos.
- `GET /api/v1/public/site` - Returns published website configuration for tenant.
- `POST /api/v1/public/verify-result` - Secure student exam transcript query.
- `PUT /api/v1/pages/:slug/draft` - Save section revisions.
- `POST /api/v1/pages/:slug/publish` - Atomically promote draft to live site.
- `POST /api/v1/pages/:slug/rollback` - Revert to verified historical revision.
- `POST /api/v1/admissions/apply` - Submit admission dossier.
- `GET /api/v1/admissions/track/:ref` - Public status lookup.
- `PUT /api/v1/admissions/applications/:id/status` - Record administrative decision.
- `POST /api/v1/academic/attendance` - Record daily class roll call.
- `PUT /api/v1/academic/results/:id/publish` - Control public transcript visibility.
