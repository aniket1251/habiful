// tests/k6/utils/auth.js
// Authentication utilities for k6 load tests

import { testUsers } from './shared-config.js';

export function getAuthHeaders(role) {
  const user = role === 'tenant' ? testUsers.tenant : testUsers.manager;
  
  return {
    Authorization: `Bearer ${user.token}`,
    'Content-Type': 'application/json',
  };
}

export function getTenantCognitoId() {
  return testUsers.tenant.cognitoId;
}

export function getManagerCognitoId() {
  return testUsers.manager.cognitoId;
}
