// Example k6 test configuration
// Copy this file and customize for your needs

export const testConfig = {
  // Base URL of your API
  baseUrl: 'https://cryptoverse.games',
  
  // Admin credentials for authenticated endpoints
  admin: {
    username: 'superadmin@admin.com',
    password: 'superadmin123'
  },
  
  // Load test stages
  // Each stage defines: duration (how long) and target (how many virtual users)
  stages: [
    { duration: '30s', target: 10 },  // Ramp up to 10 users
    { duration: '1m', target: 10 },    // Stay at 10 users
    { duration: '30s', target: 20 },   // Ramp up to 20 users
    { duration: '1m', target: 20 },    // Stay at 20 users
    { duration: '30s', target: 0 },    // Ramp down
  ],
  
  // Performance thresholds
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests should be below 2s
    http_req_failed: ['rate<0.1'],     // Error rate should be less than 10%
  },
  
  // Test scenarios
  scenarios: {
    // Default scenario - all endpoints
    all_endpoints: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 10 },
        { duration: '30s', target: 20 },
        { duration: '1m', target: 20 },
        { duration: '30s', target: 0 },
      ],
    },
    
    // Spike test scenario
    spike_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 100 },  // Sudden spike to 100 users
        { duration: '1m', target: 100 },
        { duration: '10s', target: 0 },
      ],
    },
    
    // Stress test scenario
    stress_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 50 },
        { duration: '5m', target: 50 },
        { duration: '2m', target: 100 },
        { duration: '5m', target: 100 },
        { duration: '2m', target: 0 },
      ],
    },
  }
};

// Usage example:
// import { testConfig } from './config.js';
// export const options = testConfig;

