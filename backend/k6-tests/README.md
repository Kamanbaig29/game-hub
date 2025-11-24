# k6 Load Testing Guide

This guide explains how to set up and run k6 load tests for all your backend endpoints.

## Prerequisites

1. **Install k6**: 
   - **Windows**: Download from [k6.io](https://k6.io/docs/getting-started/installation/) or use Chocolatey: `choco install k6`
   - **macOS**: `brew install k6`
   - **Linux**: Follow instructions at [k6.io](https://k6.io/docs/getting-started/installation/)

2. **Note**: The default configuration tests your production server at `https://cryptoverse.games`
   - For local testing, use `npm run test:k6:local` (requires server running with `npm run dev`)

## Test Files

- `all-endpoints.js` - Comprehensive test covering all API endpoints

## Running Tests

### Production Test (Default)

**Default Configuration**: Tests `https://cryptoverse.games` with credentials `superadmin@admin.com` / `superadmin123`

```bash
npm run test:k6
```

Or directly:
```bash
k6 run k6-tests/all-endpoints.js
```

### Local Development Test

For testing your local development server:

```bash
npm run test:k6:local
```

Make sure your server is running first:
```bash
npm run dev
```

### Custom Configuration

You can customize the test using environment variables:

```bash
# Test production server with custom credentials
k6 run -e BASE_URL=https://cryptoverse.games -e ADMIN_USERNAME=superadmin@admin.com -e ADMIN_PASSWORD=superadmin123 k6-tests/all-endpoints.js

# Test local server
k6 run -e BASE_URL=http://localhost:5000 -e ADMIN_USERNAME=admin -e ADMIN_PASSWORD=admin123 k6-tests/all-endpoints.js
```

### Using npm scripts

```bash
# Run production test (default)
npm run test:k6

# Run local development test
npm run test:k6:local

# Run with explicit production config
npm run test:k6:custom
```

## Test Configuration

The test uses a **ramp-up/ramp-down** pattern:
- **Stage 1**: Ramp up to 10 users over 30 seconds
- **Stage 2**: Stay at 10 users for 1 minute
- **Stage 3**: Ramp up to 20 users over 30 seconds
- **Stage 4**: Stay at 20 users for 1 minute
- **Stage 5**: Ramp down to 0 users over 30 seconds

### Performance Thresholds

The test expects:
- **95% of requests** should complete in **less than 2 seconds**
- **Error rate** should be **less than 10%**

## Endpoints Tested

### ✅ Admin Endpoints
- `POST /api/admin/login` - Admin login
- `GET /api/admin/profile` - Get admin profile (requires auth)

### ✅ Games Endpoints
- `GET /api/games` - Get all games
- `GET /api/games/:id` - Get single game by ID or slug

### ✅ Categories Endpoints
- `GET /api/categories` - Get all categories
- `GET /api/categories/active` - Get active categories
- `GET /api/categories/:id` - Get single category
- `GET /api/categories/hide-section-status` - Get hide section status

### ✅ Tags Endpoints
- `GET /api/tags` - Get all tags
- `GET /api/tags/:id` - Get single tag
- `GET /api/tags/hide-section-status` - Get hide section status

### ✅ Feature Games Endpoints
- `GET /api/feature-games` - Get all feature games
- `GET /api/feature-games/active` - Get active feature games
- `GET /api/feature-games/hide-section-status` - Get hide section status

### ✅ Coming Soon Endpoints
- `GET /api/coming-soon` - Get all coming soon games
- `GET /api/coming-soon/active` - Get active coming soon games
- `GET /api/coming-soon/:id` - Get single coming soon game
- `GET /api/coming-soon/hide-section-status` - Get hide section status

### ✅ Contact Endpoints
- `POST /api/contact/send` - Send contact form (may fail due to reCAPTCHA, which is expected)

## Understanding Test Results

After running a test, k6 will display:

1. **Summary Statistics**:
   - Total requests made
   - Request duration (min, max, avg, p95, p99)
   - Data transferred
   - HTTP status code distribution

2. **Threshold Results**:
   - ✅ Passed: Thresholds met
   - ❌ Failed: Thresholds not met

3. **Custom Metrics**:
   - Error rate tracking

## Example Output

```
     ✓ admin login status is 200 or 401
     ✓ get all games status is 200
     ✓ games response is array
     ✓ get all categories status is 200
     ✓ categories response is array
     ...

     checks.........................: 95.00% ✓ 19        ✗ 1
     data_received..................: 2.5 MB 42 kB/s
     data_sent......................: 45 kB  750 B/s
     http_req_duration..............: avg=245ms min=120ms med=220ms max=890ms p(95)=520ms
     http_req_failed................: 0.00%  ✓ 0         ✗ 120
     http_reqs......................: 120    2.0/s
     iteration_duration.............: avg=3.2s min=2.1s med=3.0s max=5.4s
     iterations.....................: 40     0.67/s
     vus............................: 1      min=1        max=20
     vus_max........................: 20     min=20       max=20
```

## Troubleshooting

### Test fails with connection errors
- Make sure your backend server is running
- Check that the `BASE_URL` matches your server URL
- Verify the port number is correct

### Authentication errors
- Ensure admin credentials are correct
- Check that `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables are set
- Verify JWT_SECRET is configured in your backend

### High error rates
- Check server logs for errors
- Verify database connection is working
- Ensure all required environment variables are set

### Slow response times
- Check database query performance
- Verify server resources (CPU, memory)
- Consider database indexing for frequently queried fields

## Advanced Usage

### Custom Load Patterns

Edit `all-endpoints.js` and modify the `options.stages` array:

```javascript
export const options = {
  stages: [
    { duration: '1m', target: 50 },   // Spike test: 50 users immediately
    { duration: '2m', target: 50 },
    { duration: '1m', target: 0 },
  ],
};
```

### Testing Specific Endpoints

Create a new test file focusing on specific endpoints:

```javascript
// k6-tests/games-only.js
import http from 'k6/http';
import { check } from 'k6';

export default function () {
  const res = http.get('http://localhost:5000/api/games');
  check(res, { 'status is 200': (r) => r.status === 200 });
}
```

### Exporting Results

Save results to a file:

```bash
k6 run --out json=results.json k6-tests/all-endpoints.js
```

## Next Steps

1. **Baseline Testing**: Run tests to establish performance baselines
2. **Load Testing**: Gradually increase load to find breaking points
3. **Stress Testing**: Test beyond normal capacity
4. **Spike Testing**: Test sudden traffic spikes
5. **Endurance Testing**: Test system stability over extended periods

For more information, visit [k6.io documentation](https://k6.io/docs/).

