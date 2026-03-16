// tests/k6/tests/auth-rbac.test.js
// Auth middleware RBAC test — measures unauthorized/forbidden block rate

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';
import { BASE_URL } from '../utils/shared-config.js';
import { getAuthHeaders } from '../utils/auth.js';
import { endpoints } from '../config.js';

// Custom metrics
const unauthorizedBlocks = new Counter('unauthorized_blocks');
const forbiddenBlocks = new Counter('forbidden_blocks');
const blockRate = new Rate('rbac_block_rate');
const authLatency = new Trend('auth_check_latency');

export const options = {
  scenarios: {
    // Scenario 1: No token — should get 401
    no_token: {
      executor: 'constant-vus',
      vus: 3,
      duration: '2m',
      exec: 'noToken',
    },
    // Scenario 2: Wrong role — should get 403
    wrong_role: {
      executor: 'constant-vus',
      vus: 3,
      duration: '2m',
      exec: 'wrongRole',
    },
    // Scenario 3: Valid token — should get 200
    valid_auth: {
      executor: 'constant-vus',
      vus: 3,
      duration: '2m',
      exec: 'validAuth',
    },
  },
  thresholds: {
    unauthorized_blocks: ['count>0'],
    forbidden_blocks: ['count>0'],
    rbac_block_rate: ['rate>0.5'],       // At least 50% of invalid requests are blocked
    auth_check_latency: ['p(95)<200'],   // Auth check under 200ms at p95
    http_req_duration: ['p(95)<500'],
  },
};

// Routes that require specific roles
const managerOnlyRoutes = [
  `${endpoints.managers}/some-cognito-id`,
  `${endpoints.managers}/some-cognito-id/properties`,
];

const tenantOnlyRoutes = [
  `${endpoints.tenants}/some-cognito-id`,
  `${endpoints.tenants}/some-cognito-id/current-residences`,
];

// Scenario 1: Requests with no auth token — expect 401
export function noToken() {
  const routes = [
    `${BASE_URL}${endpoints.managers}/test-id`,
    `${BASE_URL}${endpoints.tenants}/test-id`,
    `${BASE_URL}${endpoints.leases}`,
    `${BASE_URL}${endpoints.applications}`,
  ];

  for (const url of routes) {
    const res = http.get(url, {
      headers: { 'Content-Type': 'application/json' },
    });

    authLatency.add(res.timings.duration);

    const blocked = check(res, {
      'no-token returns 401': (r) => r.status === 401,
    });

    if (res.status === 401) {
      unauthorizedBlocks.add(1);
      blockRate.add(true);
    } else {
      blockRate.add(false);
    }
  }

  sleep(0.5);
}

// Scenario 2: Tenant token hitting manager-only routes — expect 403
export function wrongRole() {
  const tenantHeaders = getAuthHeaders('tenant');
  const managerHeaders = getAuthHeaders('manager');

  // Tenant trying manager routes
  for (const route of managerOnlyRoutes) {
    const res = http.get(`${BASE_URL}${route}`, {
      headers: tenantHeaders,
    });

    authLatency.add(res.timings.duration);

    check(res, {
      'tenant on manager route returns 403': (r) => r.status === 403,
    });

    if (res.status === 403) {
      forbiddenBlocks.add(1);
      blockRate.add(true);
    } else {
      blockRate.add(false);
    }
  }

  // Manager trying tenant routes
  for (const route of tenantOnlyRoutes) {
    const res = http.get(`${BASE_URL}${route}`, {
      headers: managerHeaders,
    });

    authLatency.add(res.timings.duration);

    check(res, {
      'manager on tenant route returns 403': (r) => r.status === 403,
    });

    if (res.status === 403) {
      forbiddenBlocks.add(1);
      blockRate.add(true);
    } else {
      blockRate.add(false);
    }
  }

  sleep(0.5);
}

// Scenario 3: Valid tokens on correct routes — expect 200
export function validAuth() {
  const tenantHeaders = getAuthHeaders('tenant');
  const managerHeaders = getAuthHeaders('manager');

  // Tenant on shared route
  const leaseRes = http.get(`${BASE_URL}${endpoints.leases}`, {
    headers: tenantHeaders,
  });
  authLatency.add(leaseRes.timings.duration);
  check(leaseRes, {
    'valid tenant gets 200 on leases': (r) => r.status === 200,
  });
  blockRate.add(false);

  // Manager on shared route
  const appRes = http.get(`${BASE_URL}${endpoints.applications}`, {
    headers: managerHeaders,
  });
  authLatency.add(appRes.timings.duration);
  check(appRes, {
    'valid manager gets 200 on applications': (r) => r.status === 200,
  });
  blockRate.add(false);

  sleep(0.5);
}
