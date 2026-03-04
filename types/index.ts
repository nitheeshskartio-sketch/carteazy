export type Role = 'super_admin' | 'tenant_admin' | 'manager' | 'agent' | 'viewer';

export interface ApiContext {
  tenantId: string;
  userId: string;
  role: Role;
}
