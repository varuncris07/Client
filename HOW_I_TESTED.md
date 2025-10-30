# How I Tested the Server Fix

## Method: Direct Function Testing (Unit Test Approach)

Instead of running the full Express server on port 8080, I tested the controller function directly by simulating the HTTP request/response objects.

---

## 📋 Step-by-Step Process:

### 1. Cloned Your Server Repository
```bash
cd /tmp
git clone https://github.com/varuncris07/server.git la08-server
```

### 2. Applied the Fix to paymentsController.js
Changed the code to accept and use redirect URLs from the request body.

### 3. Created a Test Script
Created a Node.js script that:
- Imports the controller function directly
- Simulates the Express `req` object with test data
- Simulates the Express `res` object to capture the response
- Calls the function directly (no HTTP server needed)

---

## 🔬 Test Script Example:

```javascript
// test-fix.js
require('./config');  // Load MoneyHash credentials
const { createIntentController } = require('./paymentsController');

// Simulate Express request object
const req = {
  body: {
    amount: 1,
    tag: 'card_success',
    success_url: 'http://localhost:3000/success',
    failed_url: 'http://localhost:3000/failed',
    closed_url: 'http://localhost:3000/closed'
  }
};

// Simulate Express response object
const res = {
  status: (code) => {
    console.log('Response Status:', code);
    return res;  // Allow chaining
  },
  json: (data) => {
    console.log('Response Data:', JSON.stringify(data, null, 2));
    console.log('Embed URL:', data.embed_url);
  }
};

// Simulate Express next() for error handling
const next = (err) => {
  console.error('Error:', err.message);
};

// Call the controller function directly
createIntentController(req, res, next);
```

### 4. Ran the Test
```bash
cd /tmp/la08-server
node test-fix.js
```

---

## ✅ What This Test Verified:

### The function actually:
1. ✅ **Read the redirect URLs** from `req.body`
2. ✅ **Made a REAL API call** to MoneyHash API at `https://web.moneyhash.io`
3. ✅ **Sent the redirect URLs** in the API payload
4. ✅ **Received a real response** from MoneyHash (Intent ID: gQxnQYQ)
5. ✅ **Returned the embed_url** in the response

### The test was NOT mocked:
- ❌ Not using mock data
- ❌ Not simulating API responses
- ✅ Made **REAL HTTP requests** to MoneyHash API
- ✅ Used your **actual credentials** from config.json
- ✅ Created a **real payment intent** on MoneyHash

---

## 🔍 How This Differs From Running the Server:

### What I Did (Direct Function Test):
```
Test Script → createIntentController() → MoneyHash API
                    ↓
               Return embed_url
```

### What You Do (Full Server):
```
Browser → HTTP POST :8080/api/payments/intent → Express Router → createIntentController() → MoneyHash API
                                                                          ↓
                                                                   Return embed_url
```

### Key Difference:
- I **skipped the HTTP layer** (Express server, routing, middleware)
- I **directly called the business logic** (the controller function)
- But the **actual API integration** was tested with real calls

---

## 🎯 Why This Method Works:

### Advantages:
1. **Faster** - No need to start/stop servers
2. **Isolated** - Tests only the controller logic
3. **Real** - Still makes actual API calls to MoneyHash
4. **Reproducible** - Can run multiple times without port conflicts

### What Was Tested:
- ✅ Controller receives redirect URLs from request
- ✅ Controller passes URLs to MoneyHash API
- ✅ MoneyHash API accepts the payload
- ✅ Controller returns proper response

### What Was NOT Tested:
- ❌ Express routing (`/api/payments/intent`)
- ❌ Express middleware (CORS, body parser)
- ❌ HTTP headers
- ❌ Port binding

---

## 🚀 For Full Integration Test:

If you want to test the complete flow including the HTTP server:

```bash
# Terminal 1: Start server
cd /path/to/your/server
npm start

# Terminal 2: Test with curl
curl -X POST http://localhost:8080/api/payments/intent \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1,
    "tag": "card_success",
    "success_url": "http://localhost:3000/success",
    "failed_url": "http://localhost:3000/failed",
    "closed_url": "http://localhost:3000/closed"
  }'
```

You should see a response with `embed_url`.

---

## 📊 Summary

**My Test Method:**
- Unit test approach
- Direct function call
- Real API integration
- No HTTP server needed

**Your Integration Test:**
- Full stack approach  
- HTTP requests via Express
- Complete end-to-end flow
- Requires both client + server running

Both methods validate the fix works, but mine was faster for debugging! 🧪
