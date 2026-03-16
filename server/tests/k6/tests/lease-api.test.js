// tests/k6/tests/lease-api.test.js
// Lease API endpoint tests - requires authentication

import { get, checkStatus } from '../utils/http-helpers.js';
import { getAuthHeaders } from '../utils/auth.js';
import { BASE_URL } from '../utils/shared-config.js';
import { defaultOptions, endpoints } from '../config.js';

export const options = defaultOptions;

export default function() {
  // Test GET /leases (tenant access)
  const tenantHeaders = getAuthHeaders('tenant');
  const tenantLeasesResponse = get(`${BASE_URL}${endpoints.leases}`, {
    headers: tenantHeaders,
  });
  checkStatus(tenantLeasesResponse, 200);

  // Test GET /leases (manager access)
  const managerHeaders = getAuthHeaders('manager');
  const managerLeasesResponse = get(`${BASE_URL}${endpoints.leases}`, {
    headers: managerHeaders,
  });
  checkStatus(managerLeasesResponse, 200);

  // Test GET /leases/:id/payments (if lease exists)
  if (tenantLeasesResponse.status === 200) {
    const leases = JSON.parse(tenantLeasesResponse.body);
    if (leases && leases.length > 0) {
      const leaseId = leases[0].id;
      const paymentsResponse = get(`${BASE_URL}${endpoints.leases}/${leaseId}/payments`, {
        headers: tenantHeaders,
      });
      checkStatus(paymentsResponse, 200);
    }
  }
}
