// tests/k6/scenarios/spike.js
// Spike test scenario - sudden traffic burst to test system resilience

export const spikeScenario = {
  executor: 'ramping-vus',
  stages: [
    { duration: '1m', target: 10 },
    { duration: '30s', target: 100 },  // Spike
    { duration: '1m', target: 100 },
    { duration: '30s', target: 10 },   // Recovery
    { duration: '1m', target: 0 },
  ],
};
