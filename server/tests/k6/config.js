// tests/k6/config.js
// Global test configuration and thresholds for k6 load tests

export const defaultOptions = {
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],  // 95th percentile < 500ms, 99th < 1000ms
    http_req_failed: ['rate<0.01'],                   // Error rate < 1%
    http_reqs: ['rate>1'],                            // Minimum throughput
  },
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
};

export const endpoints = {
  properties: '/properties',
  tenants: '/tenants',
  managers: '/managers',
  applications: '/applications',
  leases: '/leases',
};
