// tests/k6/utils/shared-config.js
// Shared configuration for k6 load tests

export const BASE_URL = __ENV.BASE_URL || 'http://localhost:8001';

export const defaultHeaders = {
  'Content-Type': 'application/json',
};

// Test user credentials (set via environment variables)
export const testUsers = {
  tenant: {
    cognitoId: __ENV.TEST_TENANT_COGNITO_ID,
    token: __ENV.TEST_TENANT_TOKEN,
  },
  manager: {
    cognitoId: __ENV.TEST_MANAGER_COGNITO_ID,
    token: __ENV.TEST_MANAGER_TOKEN,
  },
};

// Property IDs for testing (comma-separated string from env, parsed to array)
export const testData = {
  propertyIds: __ENV.TEST_PROPERTY_IDS 
    ? __ENV.TEST_PROPERTY_IDS.split(',').map(Number) 
    : [],
};
