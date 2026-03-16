// tests/k6/tests/manager-api.test.js
// Manager API endpoint tests - requires manager authentication

import { get, checkStatus } from '../utils/http-helpers.js';
import { getAuthHeaders, getManagerCognitoId } from '../utils/auth.js';
import { BASE_URL } from '../utils/shared-config.js';
import { defaultOptions, endpoints } from '../config.js';

export const options = defaultOptions;

export function setup() {
  return {
    cognitoId: getManagerCognitoId(),
    headers: getAuthHeaders('manager'),
  };
}

export default function(data) {
  // Test GET /managers/:cognitoId
  const managerResponse = get(
    `${BASE_URL}${endpoints.managers}/${data.cognitoId}`,
    { headers: data.headers }
  );
  checkStatus(managerResponse, 200);

  // Test GET /managers/:cognitoId/properties
  const propertiesResponse = get(
    `${BASE_URL}${endpoints.managers}/${data.cognitoId}/properties`,
    { headers: data.headers }
  );
  checkStatus(propertiesResponse, 200);
}
