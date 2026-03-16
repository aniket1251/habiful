// tests/k6/scenarios/stress.js
// Stress test scenario - progressively increasing load to find breaking points

export const stressScenario = {
  executor: 'ramping-vus',
  stages: [
    { duration: '2m', target: 10 },
    { duration: '5m', target: 50 },
    { duration: '5m', target: 100 },
    { duration: '5m', target: 150 },
    { duration: '2m', target: 0 },
  ],
};
