/**
 * MODERATE LOAD TEST CONFIGURATION - 500 Users
 * 
 * This test gradually increases load up to 500 users
 * to find your server's breaking point without overwhelming it.
 * 
 * Test progression:
 * - Starts at 50 users
 * - Gradually increases to 100, 250, then 500 users
 * - Helps identify the exact breaking point
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Moderate test configuration - Gradual ramp to 500 users
export const options = {
  stages: [
    { duration: '1m', target: 50 },     // Ramp up to 50 users
    { duration: '2m', target: 50 },       // Stay at 50 users
    { duration: '1m', target: 100 },      // Ramp up to 100 users
    { duration: '2m', target: 100 },     // Stay at 100 users
    { duration: '1m', target: 250 },    // Ramp up to 250 users
    { duration: '2m', target: 250 },     // Stay at 250 users
    { duration: '2m', target: 500 },    // Ramp up to 500 users
    { duration: '3m', target: 500 },    // Stay at 500 users (find breaking point)
    { duration: '1m', target: 250 },    // Ramp down to 250
    { duration: '1m', target: 100 },    // Ramp down to 100
    { duration: '1m', target: 0 },       // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'], // 95% of requests should be below 3s
    http_req_failed: ['rate<0.1'],     // Error rate should be less than 10%
    errors: ['rate<0.1'],
  },
};

// Base URL
const BASE_URL = __ENV.BASE_URL || 'https://cryptoverse.games';

// Test data storage
let authToken = null;
let gameId = null;
let categoryId = null;
let tagId = null;
let featureGameId = null;
let comingSoonId = null;

// Helper function to make authenticated requests
function makeAuthRequest(method, url, payload = null, params = {}) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  let response;
  if (method === 'GET') {
    response = http.get(url, { headers, ...params });
  } else if (method === 'POST') {
    response = http.post(url, JSON.stringify(payload), { headers, ...params });
  } else if (method === 'PUT') {
    response = http.put(url, JSON.stringify(payload), { headers, ...params });
  } else if (method === 'PATCH') {
    response = http.patch(url, JSON.stringify(payload), { headers, ...params });
  } else if (method === 'DELETE') {
    response = http.del(url, null, { headers, ...params });
  }
  
  return response;
}

// Setup function - runs once before all VUs
export function setup() {
  console.log('Setting up test data...');
  
  // Try to login to get auth token
  const loginPayload = {
    username: __ENV.ADMIN_USERNAME || 'superadmin@admin.com',
    password: __ENV.ADMIN_PASSWORD || 'superadmin123'
  };
  
  const loginResponse = http.post(`${BASE_URL}/api/admin/login`, JSON.stringify(loginPayload), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (loginResponse.status === 200) {
    const loginData = JSON.parse(loginResponse.body);
    return { token: loginData.token };
  }
  
  return { token: null };
}

// Main test function
export default function (data) {
  // Set auth token from setup
  if (data && data.token) {
    authToken = data.token;
  }

  // ============================================
  // ADMIN ENDPOINTS
  // ============================================
  
  // Test admin login
  if (!authToken) {
    const loginPayload = {
      username: __ENV.ADMIN_USERNAME || 'superadmin@admin.com',
      password: __ENV.ADMIN_PASSWORD || 'superadmin123'
    };
    
    const loginRes = http.post(`${BASE_URL}/api/admin/login`, JSON.stringify(loginPayload), {
      headers: { 'Content-Type': 'application/json' },
    });
    
    const loginSuccess = check(loginRes, {
      'admin login status is 200 or 401': (r) => r.status === 200 || r.status === 401,
    });
    
    if (loginRes.status === 200) {
      const loginData = JSON.parse(loginRes.body);
      authToken = loginData.token;
    }
    
    errorRate.add(!loginSuccess);
    sleep(0.5);
  }

  // Test get admin profile (requires auth)
  if (authToken) {
    const profileRes = makeAuthRequest('GET', `${BASE_URL}/api/admin/profile`);
    check(profileRes, {
      'admin profile status is 200': (r) => r.status === 200,
      'admin profile has data': (r) => r.body.length > 0,
    });
    errorRate.add(profileRes.status !== 200);
    sleep(0.5);
  }

  // ============================================
  // GAMES ENDPOINTS
  // ============================================
  
  // GET all games
  const gamesRes = http.get(`${BASE_URL}/api/games`);
  const gamesSuccess = check(gamesRes, {
    'get all games status is 200': (r) => r.status === 200,
    'games response is array': (r) => {
      try {
        const data = JSON.parse(r.body);
        return Array.isArray(data);
      } catch {
        return false;
      }
    },
  });
  errorRate.add(!gamesSuccess);
  
  // Store game ID if available
  if (gamesRes.status === 200) {
    try {
      const games = JSON.parse(gamesRes.body);
      if (games.length > 0) {
        gameId = games[0]._id || games[0].id;
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
  
  sleep(0.5);

  // GET single game by ID or slug
  if (gameId) {
    const gameRes = http.get(`${BASE_URL}/api/games/${gameId}`);
    check(gameRes, {
      'get game by id status is 200 or 404': (r) => r.status === 200 || r.status === 404,
    });
    errorRate.add(gameRes.status >= 500);
    sleep(0.5);
  }

  // ============================================
  // CATEGORIES ENDPOINTS
  // ============================================
  
  // GET all categories
  const categoriesRes = http.get(`${BASE_URL}/api/categories`);
  const categoriesSuccess = check(categoriesRes, {
    'get all categories status is 200': (r) => r.status === 200,
    'categories response is array': (r) => {
      try {
        const data = JSON.parse(r.body);
        return Array.isArray(data);
      } catch {
        return false;
      }
    },
  });
  errorRate.add(!categoriesSuccess);
  
  // Store category ID if available
  if (categoriesRes.status === 200) {
    try {
      const categories = JSON.parse(categoriesRes.body);
      if (categories.length > 0) {
        categoryId = categories[0]._id || categories[0].id;
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
  
  sleep(0.5);

  // GET active categories
  const activeCategoriesRes = http.get(`${BASE_URL}/api/categories/active`);
  check(activeCategoriesRes, {
    'get active categories status is 200': (r) => r.status === 200,
  });
  errorRate.add(activeCategoriesRes.status >= 500);
  sleep(0.5);

  // GET single category
  if (categoryId) {
    const categoryRes = http.get(`${BASE_URL}/api/categories/${categoryId}`);
    check(categoryRes, {
      'get category by id status is 200 or 404': (r) => r.status === 200 || r.status === 404,
    });
    errorRate.add(categoryRes.status >= 500);
    sleep(0.5);
  }

  // GET hide section status
  const hideSectionRes = http.get(`${BASE_URL}/api/categories/hide-section-status`);
  check(hideSectionRes, {
    'get hide section status is 200': (r) => r.status === 200,
  });
  errorRate.add(hideSectionRes.status >= 500);
  sleep(0.5);

  // ============================================
  // TAGS ENDPOINTS
  // ============================================
  
  // GET all tags
  const tagsRes = http.get(`${BASE_URL}/api/tags`);
  const tagsSuccess = check(tagsRes, {
    'get all tags status is 200': (r) => r.status === 200,
    'tags response is array': (r) => {
      try {
        const data = JSON.parse(r.body);
        return Array.isArray(data);
      } catch {
        return false;
      }
    },
  });
  errorRate.add(!tagsSuccess);
  
  // Store tag ID if available
  if (tagsRes.status === 200) {
    try {
      const tags = JSON.parse(tagsRes.body);
      if (tags.length > 0) {
        tagId = tags[0]._id || tags[0].id;
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
  
  sleep(0.5);

  // GET single tag
  if (tagId) {
    const tagRes = http.get(`${BASE_URL}/api/tags/${tagId}`);
    check(tagRes, {
      'get tag by id status is 200 or 404': (r) => r.status === 200 || r.status === 404,
    });
    errorRate.add(tagRes.status >= 500);
    sleep(0.5);
  }

  // GET hide section status for tags
  const tagsHideSectionRes = http.get(`${BASE_URL}/api/tags/hide-section-status`);
  check(tagsHideSectionRes, {
    'get tags hide section status is 200': (r) => r.status === 200,
  });
  errorRate.add(tagsHideSectionRes.status >= 500);
  sleep(0.5);

  // ============================================
  // FEATURE GAMES ENDPOINTS
  // ============================================
  
  // GET all feature games
  const featureGamesRes = http.get(`${BASE_URL}/api/feature-games`);
  const featureGamesSuccess = check(featureGamesRes, {
    'get all feature games status is 200': (r) => r.status === 200,
    'feature games response is array': (r) => {
      try {
        const data = JSON.parse(r.body);
        return Array.isArray(data);
      } catch {
        return false;
      }
    },
  });
  errorRate.add(!featureGamesSuccess);
  
  // Store feature game ID if available
  if (featureGamesRes.status === 200) {
    try {
      const featureGames = JSON.parse(featureGamesRes.body);
      if (featureGames.length > 0) {
        featureGameId = featureGames[0]._id || featureGames[0].id;
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
  
  sleep(0.5);

  // GET active feature games
  const activeFeatureGamesRes = http.get(`${BASE_URL}/api/feature-games/active`);
  check(activeFeatureGamesRes, {
    'get active feature games status is 200': (r) => r.status === 200,
  });
  errorRate.add(activeFeatureGamesRes.status >= 500);
  sleep(0.5);

  // GET hide section status for feature games
  const featureHideSectionRes = http.get(`${BASE_URL}/api/feature-games/hide-section-status`);
  check(featureHideSectionRes, {
    'get feature games hide section status is 200': (r) => r.status === 200,
  });
  errorRate.add(featureHideSectionRes.status >= 500);
  sleep(0.5);

  // ============================================
  // COMING SOON ENDPOINTS
  // ============================================
  
  // GET all coming soon games
  const comingSoonRes = http.get(`${BASE_URL}/api/coming-soon`);
  const comingSoonSuccess = check(comingSoonRes, {
    'get all coming soon status is 200': (r) => r.status === 200,
    'coming soon response is array': (r) => {
      try {
        const data = JSON.parse(r.body);
        return Array.isArray(data);
      } catch {
        return false;
      }
    },
  });
  errorRate.add(!comingSoonSuccess);
  
  // Store coming soon ID if available
  if (comingSoonRes.status === 200) {
    try {
      const comingSoon = JSON.parse(comingSoonRes.body);
      if (comingSoon.length > 0) {
        comingSoonId = comingSoon[0]._id || comingSoon[0].id;
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
  
  sleep(0.5);

  // GET active coming soon games
  const activeComingSoonRes = http.get(`${BASE_URL}/api/coming-soon/active`);
  check(activeComingSoonRes, {
    'get active coming soon status is 200': (r) => r.status === 200,
  });
  errorRate.add(activeComingSoonRes.status >= 500);
  sleep(0.5);

  // GET single coming soon game
  if (comingSoonId) {
    const comingSoonSingleRes = http.get(`${BASE_URL}/api/coming-soon/${comingSoonId}`);
    check(comingSoonSingleRes, {
      'get coming soon by id status is 200 or 404': (r) => r.status === 200 || r.status === 404,
    });
    errorRate.add(comingSoonSingleRes.status >= 500);
    sleep(0.5);
  }

  // GET hide section status for coming soon
  const comingSoonHideSectionRes = http.get(`${BASE_URL}/api/coming-soon/hide-section-status`);
  check(comingSoonHideSectionRes, {
    'get coming soon hide section status is 200': (r) => r.status === 200,
  });
  errorRate.add(comingSoonHideSectionRes.status >= 500);
  sleep(0.5);

  // ============================================
  // CONTACT ENDPOINT
  // ============================================
  
  // POST contact form (may fail if reCAPTCHA is required, that's expected)
  const contactPayload = {
    name: 'Test User',
    email: 'test@example.com',
    message: 'This is a test message from k6 load testing',
    recaptchaToken: 'test-token' // This will likely fail validation, but tests the endpoint
  };
  
  const contactRes = http.post(`${BASE_URL}/api/contact/send`, JSON.stringify(contactPayload), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  // Contact endpoint may return 400 due to reCAPTCHA, which is expected
  check(contactRes, {
    'contact endpoint responds': (r) => r.status >= 200 && r.status < 500,
  });
  errorRate.add(contactRes.status >= 500);
  sleep(0.5);
}

// Teardown function - runs once after all VUs finish
export function teardown(data) {
  console.log('Test completed!');
}

