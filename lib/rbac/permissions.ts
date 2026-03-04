import type { Role } from '@/types';

const rank: Record<Role, number> = {
  super_admin: 5,
  tenant_admin: 4,
  manager: 3,
  agent: 2,
  viewer: 1
};

export function hasPermission(role: Role, minimum: Role) {
  return rank[role] >= rank[minimum];
}
