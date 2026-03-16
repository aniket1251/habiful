// tests/k6/scenarios/load.js
// Load test scenario - normal traffic simulation

export const loadScenario = {
  executor: 'ramping-vus',
  stages: [
    { duration: '2m', target: 10 },   // Ramp up
    { duration: '5m', target: 10 },   // Steady state
    { duration: '2m', target: 0 },    // Ramp down
  ],
};
