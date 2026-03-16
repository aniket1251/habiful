// tests/k6/tests/application-api.test.js
// Application API endpoint tests - requires authentication

import { get, post, checkStatus } from '../utils/http-helpers.js';
import { getAuthHeaders, getTenantCognitoId } from '../utils/auth.js';
import { BASE_URL, testData } from '../utils/shared-config.js';
import { generateApplicationData, getRandomPropertyId } from '../utils/data-generators.js';
import { defaultOptions, endpoints } from '../config.js';

export const options = defaultOptions;

export function setup() {
  return {
    tenantCognitoId: getTenantCognitoId(),
    tenantHeaders: getAuthHeaders('tenant'),
    managerHeaders: getAuthHeaders('manager'),
  };
}

export default function(data) {
  // Test GET /applications (tenant access)
  const tenantListResponse = get(`${BASE_URL}${endpoints.applications}`, {
    headers: data.tenantHeaders,
  });
  checkStatus(tenantListResponse, 200);

  // Test GET /applications (manager access)
  const managerListResponse = get(`${BASE_URL}${endpoints.applications}`, {
    headers: data.managerHeaders,
  });
  checkStatus(managerListResponse, 200);

  // Test POST /applications (tenant submitting application)
  const propertyId = getRandomPropertyId(testData.propertyIds);
  const applicationData = generateApplicationData(propertyId, data.tenantCognitoId);
  const createResponse = post(
    `${BASE_URL}${endpoints.applications}`,
    applicationData,
    { headers: data.tenantHeaders }
  );
  checkStatus(createResponse, 201);
}
