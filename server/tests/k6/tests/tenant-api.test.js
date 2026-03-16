// tests/k6/tests/tenant-api.test.js
// Tenant API endpoint tests - requires tenant authentication

import { get, checkStatus } from '../utils/http-helpers.js';
import { getAuthHeaders, getTenantCognitoId } from '../utils/auth.js';
import { BASE_URL } from '../utils/shared-config.js';
import { defaultOptions, endpoints } from '../config.js';

export const options = defaultOptions;

export function setup() {
  return {
    cognitoId: getTenantCognitoId(),
    headers: getAuthHeaders('tenant'),
  };
}

export default function(data) {
  // Test GET /tenants/:cognitoId
  const tenantResponse = get(
    `${BASE_URL}${endpoints.tenants}/${data.cognitoId}`,
    { headers: data.headers }
  );
  checkStatus(tenantResponse, 200);

  // Test GET /tenants/:cognitoId/current-residences
  const residencesResponse = get(
    `${BASE_URL}${endpoints.tenants}/${data.cognitoId}/current-residences`,
    { headers: data.headers }
  );
  checkStatus(residencesResponse, 200);
}
