// tests/k6/tests/public-api.test.js
// Public API endpoint tests - no authentication required

import { get, checkStatus } from '../utils/http-helpers.js';
import { BASE_URL, testData } from '../utils/shared-config.js';
import { generatePropertyQueryParams, getRandomPropertyId } from '../utils/data-generators.js';
import { defaultOptions, endpoints } from '../config.js';

export const options = defaultOptions;

export default function() {
  // Test GET /properties with query params
  const queryParams = generatePropertyQueryParams();
  const propertiesResponse = get(`${BASE_URL}${endpoints.properties}`, {
    params: queryParams,
  });
  checkStatus(propertiesResponse, 200);

  // Test GET /properties/:id
  const propertyId = getRandomPropertyId(testData.propertyIds);
  const propertyResponse = get(`${BASE_URL}${endpoints.properties}/${propertyId}`);
  checkStatus(propertyResponse, 200);

  // Test GET /properties/:id/leases (public endpoint)
  const leasesResponse = get(`${BASE_URL}${endpoints.properties}/${propertyId}/leases`);
  checkStatus(leasesResponse, 200);
}
