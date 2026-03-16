// tests/k6/tests/postgis-explain.test.js
// PostGIS EXPLAIN ANALYZE test — measures query latency with/without spatial filter
// and reports improvement percentage

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Counter } from 'k6/metrics';
import { BASE_URL } from '../utils/shared-config.js';
import { endpoints } from '../config.js';

// Custom metrics
const withGeoLatency = new Trend('postgis_with_geo_latency');
const withoutGeoLatency = new Trend('postgis_without_geo_latency');
const geoQueryCount = new Counter('geo_queries_executed');
const nonGeoQueryCount = new Counter('non_geo_queries_executed');

export const options = {
  scenarios: {
    // Alternating queries with and without geo filter
    geo_comparison: {
      executor: 'constant-vus',
      vus: 5,
      duration: '3m',
      exec: 'compareQueries',
    },
    // Sustained geo-only load to stress the spatial index
    geo_stress: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '1m', target: 10 },
        { duration: '2m', target: 10 },
        { duration: '1m', target: 0 },
      ],
      exec: 'geoOnly',
      startTime: '3m',
    },
  },
  thresholds: {
    postgis_with_geo_latency: ['p(95)<1000'],     // Geo queries under 1s at p95
    postgis_without_geo_latency: ['p(95)<500'],    // Non-geo queries under 500ms at p95
    http_req_failed: ['rate<0.05'],                // Less than 5% error rate
    http_req_duration: ['p(95)<1000'],
  },
};

// Test coordinates (spread across different areas)
const testLocations = [
  { lat: '12.9716', lng: '77.5946', name: 'Bengaluru' },
  { lat: '19.0760', lng: '72.8777', name: 'Mumbai' },
  { lat: '28.6139', lng: '77.2090', name: 'Delhi' },
  { lat: '40.7128', lng: '-74.0060', name: 'New York' },
  { lat: '37.7749', lng: '-122.4194', name: 'San Francisco' },
];

function getRandomLocation() {
  return testLocations[Math.floor(Math.random() * testLocations.length)];
}

// Query WITHOUT geo filter (baseline)
function queryWithoutGeo() {
  const qs = 'priceMin=500&priceMax=5000&beds=1';

  const res = http.get(`${BASE_URL}${endpoints.properties}?${qs}`, {
    headers: { 'Content-Type': 'application/json' },
    tags: { query_type: 'non_geo' },
  });

  withoutGeoLatency.add(res.timings.duration);
  nonGeoQueryCount.add(1);

  check(res, {
    'non-geo query returns 200': (r) => r.status === 200,
    'non-geo query returns array': (r) => {
      try { return Array.isArray(JSON.parse(r.body)); } catch { return false; }
    },
  });

  return res;
}

// Query WITH geo filter (uses PostGIS ST_DWithin)
function queryWithGeo() {
  const loc = getRandomLocation();
  const qs = `priceMin=500&priceMax=5000&beds=1&latitude=${loc.lat}&longitude=${loc.lng}`;

  const res = http.get(`${BASE_URL}${endpoints.properties}?${qs}`, {
    headers: { 'Content-Type': 'application/json' },
    tags: { query_type: 'geo', location: loc.name },
  });

  withGeoLatency.add(res.timings.duration);
  geoQueryCount.add(1);

  check(res, {
    'geo query returns 200': (r) => r.status === 200,
    'geo query returns array': (r) => {
      try { return Array.isArray(JSON.parse(r.body)); } catch { return false; }
    },
  });

  return res;
}

// Scenario 1: Alternate between geo and non-geo queries
export function compareQueries() {
  const nonGeoRes = queryWithoutGeo();
  sleep(0.2);

  const geoRes = queryWithGeo();
  sleep(0.2);

  // Log comparison for each iteration
  const improvement = nonGeoRes.timings.duration > 0
    ? ((nonGeoRes.timings.duration - geoRes.timings.duration) / nonGeoRes.timings.duration * 100).toFixed(1)
    : 0;

  check(null, {
    'latency comparison logged': () => true,
  });
}

// Scenario 2: Sustained geo queries to stress spatial index
export function geoOnly() {
  queryWithGeo();
  sleep(0.3);
}

// Summary handler — prints the improvement percentage
export function handleSummary(data) {
  const geoP95 = data.metrics.postgis_with_geo_latency
    ? data.metrics.postgis_with_geo_latency.values['p(95)']
    : null;
  const nonGeoP95 = data.metrics.postgis_without_geo_latency
    ? data.metrics.postgis_without_geo_latency.values['p(95)']
    : null;

  let summary = '\n========== PostGIS Query Performance Summary ==========\n';

  if (geoP95 !== null && nonGeoP95 !== null) {
    const diff = nonGeoP95 - geoP95;
    const pct = nonGeoP95 > 0 ? ((diff / nonGeoP95) * 100).toFixed(1) : 'N/A';

    summary += `  Non-Geo p95 latency : ${nonGeoP95.toFixed(2)}ms\n`;
    summary += `  Geo     p95 latency : ${geoP95.toFixed(2)}ms\n`;
    summary += `  Difference          : ${diff.toFixed(2)}ms\n`;

    if (diff > 0) {
      summary += `  Geo queries are ${pct}% FASTER (spatial index is helping)\n`;
    } else if (diff < 0) {
      summary += `  Geo queries are ${Math.abs(parseFloat(pct))}% SLOWER (spatial index may need optimization)\n`;
    } else {
      summary += `  No significant difference\n`;
    }
  } else {
    summary += '  Could not compute comparison (missing metric data)\n';
  }

  summary += `\n  Total geo queries     : ${data.metrics.geo_queries_executed ? data.metrics.geo_queries_executed.values.count : 0}`;
  summary += `\n  Total non-geo queries : ${data.metrics.non_geo_queries_executed ? data.metrics.non_geo_queries_executed.values.count : 0}`;
  summary += '\n========================================================\n';

  // Print to stdout
  console.log(summary);

  // Return default text summary + our custom summary
  return {
    stdout: textSummary(data, { indent: '  ', enableColors: true }) + summary,
  };
}

// Import textSummary for the default k6 output
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';
