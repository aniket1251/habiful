// tests/k6/scenarios/smoke.js
// Smoke test scenario - minimal load validation

export const smokeScenario = {
  executor: 'constant-vus',
  vus: 1,
  duration: '1m',
};
