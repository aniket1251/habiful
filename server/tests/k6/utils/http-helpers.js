// tests/k6/utils/http-helpers.js
// HTTP helper utilities for k6 load tests

import http from 'k6/http';
import { check } from 'k6';

export function get(url, params = {}) {
  return http.get(url, params);
}

export function post(url, body, params = {}) {
  return http.post(url, JSON.stringify(body), {
    ...params,
    headers: {
      'Content-Type': 'application/json',
      ...params.headers,
    },
  });
}

export function put(url, body, params = {}) {
  return http.put(url, JSON.stringify(body), {
    ...params,
    headers: {
      'Content-Type': 'application/json',
      ...params.headers,
    },
  });
}

export function del(url, params = {}) {
  return http.del(url, params);
}

export function checkStatus(response, expectedStatus = 200) {
  return check(response, {
    [`status is ${expectedStatus}`]: (r) => r.status === expectedStatus,
  });
}

export function checkResponseTime(response, maxDuration) {
  return check(response, {
    [`response time < ${maxDuration}ms`]: (r) => r.timings.duration < maxDuration,
  });
}
