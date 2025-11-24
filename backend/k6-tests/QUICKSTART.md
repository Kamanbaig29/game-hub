# k6 Testing - Quick Start Guide

## Step 1: Install k6

**Windows:**
```powershell
# Using Chocolatey (recommended)
choco install k6

# Or download from: https://k6.io/docs/getting-started/installation/
```

**macOS:**
```bash
brew install k6
```

**Linux:**
```bash
# Ubuntu/Debian
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D9B
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

## Step 2: Run the Tests

**Note**: The default configuration tests your production server at `https://cryptoverse.games`

### Production Test (Default - Tests https://cryptoverse.games)
```bash
npm run test:k6
```
This will test your production server with default credentials (superadmin@admin.com)

### Local Development Test
```bash
npm run test:k6:local
```
This tests your local server at `http://localhost:5000` (make sure to start it with `npm run dev` first)

### Custom Test (Full Control)
```bash
npm run test:k6:custom
```
Or manually specify all parameters:
```bash
k6 run -e BASE_URL=https://cryptoverse.games -e ADMIN_USERNAME=superadmin@admin.com -e ADMIN_PASSWORD=superadmin123 k6-tests/all-endpoints.js
```

## Step 4: Understand the Results

After running, you'll see:

✅ **Checks**: Individual endpoint validations
- Green ✓ = Passed
- Red ✗ = Failed

📊 **Metrics**:
- `http_req_duration`: Response time statistics
- `http_req_failed`: Error rate percentage
- `http_reqs`: Total requests made
- `vus`: Virtual users (concurrent users)

🎯 **Thresholds**:
- Tests pass if 95% of requests complete in < 2 seconds
- Tests pass if error rate is < 10%

## What Gets Tested?

The test automatically tests **ALL** your endpoints:

1. **Admin**: Login, Profile
2. **Games**: Get all, Get by ID
3. **Categories**: Get all, Get active, Get by ID, Hide status
4. **Tags**: Get all, Get by ID, Hide status
5. **Feature Games**: Get all, Get active, Hide status
6. **Coming Soon**: Get all, Get active, Get by ID, Hide status
7. **Contact**: Send message

## Test Flow

1. **Setup**: Logs in as admin to get authentication token
2. **Main Test**: Runs all endpoints in sequence
3. **Cleanup**: Reports final statistics

## Common Issues

### ❌ "Connection refused"
- **Fix**: Make sure your backend server is running on the correct port

### ❌ "401 Unauthorized"
- **Fix**: Check your admin credentials in the environment variables

### ❌ "High error rate"
- **Fix**: Check server logs, verify database connection, check environment variables

### ❌ "Slow response times"
- **Fix**: Check database queries, server resources, consider adding indexes

## Next Steps

1. ✅ Run basic test to verify everything works
2. 📈 Adjust load in `all-endpoints.js` if needed
3. 🔧 Customize thresholds based on your requirements
4. 📊 Export results: `k6 run --out json=results.json k6-tests/all-endpoints.js`

For detailed documentation, see [README.md](./README.md)

