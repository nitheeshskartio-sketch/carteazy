# Carteazy Enterprise SaaS eCommerce Admin Portal

Production-oriented Next.js + MongoDB multi-tenant admin platform with modular domain apps.

## Modules
- Catalog
- Products
- Inventory
- Pricing
- Orders
- Logistics
- CRM
- Support
- Booking
- Finance

## Architecture Highlights
- **Multi-tenant**: all business records include tenant isolation via `tenantId`.
- **RBAC**: role hierarchy (`super_admin`, `tenant_admin`, `manager`, `agent`, `viewer`).
- **Audit logs**: every mutation writes an `AuditLog` document.
- **Soft delete**: records use `isDeleted=true` instead of hard delete.
- **Cursor pagination**: list endpoints use `_id` cursor with `limit + 1` strategy.
- **API-first**: independent module APIs under `/api/v1/:module`.
- **Inter-app sync**: event bus workflow for `order.placed` updates inventory, finance, CRM, and logistics.
- **Performance**: lean queries, indexes, and aggregation-based analytics endpoint.

## Folder Structure

```
app/
  (dashboard)/<module>/page.tsx
  api/v1/
    [module]/route.ts
    [module]/[id]/route.ts
    analytics/route.ts
    search/route.ts
    auth/login/route.ts
    auth/refresh/route.ts
components/
  layout/
  dashboard/
lib/
  db/
  auth/
  rbac/
  api/
  events/
  services/
models/
  modules.ts
  tenant.ts
  user.ts
  audit-log.ts
```

## Run

```bash
npm install
cp .env.example .env.local
npm run dev
```

## API examples
- `GET /api/v1/products?limit=20&search=shoe`
- `POST /api/v1/orders`
- `PATCH /api/v1/inventory/:id`
- `GET /api/v1/analytics`
- `GET /api/v1/search?q=john`

## Deployment
- Works on Vercel or containerized Node deployment.
- Set environment variables (`MONGO_URI`, `JWT_SECRET`).
- For horizontal scale, replace in-memory event bus with queue (Kafka/RabbitMQ/SQS).
