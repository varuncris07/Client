# Intent Closed - No Redirection Issue

## 🔍 The Problem

You're able to:
1. ✅ Open payment page
2. ✅ Select Card
3. ✅ Enter payment details
4. ❌ See "Intent Closed" instead of redirect

This means the redirect URLs might NOT be reaching MoneyHash, OR the payment is failing before redirect.

---

## 🚨 CRITICAL: Check Server Debug Output

### Did you add the debug logging I provided?

If YES, look at your SERVER terminal when you create the intent. You should see:

```
========================================
🔍 CLIENT SENT:
  success_url: http://localhost:3000/success
  failed_url: http://localhost:3000/failed
  closed_url: http://localhost:3000/closed
📤 SENDING TO MONEYHASH:
  success_url: http://localhost:3000/success
  failed_url: http://localhost:3000/failed  
  closed_url: http://localhost:3000/closed
⚙️  MH_LIVE: false
========================================
```

**What do YOU actually see?**

---

## 🔬 Additional Debug: Check What MoneyHash Receives

### Add this to your server's `paymentsController.js`:

After the payload is built (around line 47), add:

```javascript
    const payload = {
      flow_id: global.CONFIG.MH_FLOW_ID,
      partner_code: global.CONFIG.MH_PARTNER_CODE,
      merchant_reference: buildMref(tag),
      amount: normalizeAmount(amount || 1),
      amount_currency: currency || global.CONFIG.MH_CURRENCY,
      webhook_url: global.CONFIG.MH_WEBHOOK_URL,
      redirect_urls: {
        success_url: success_url || global.CONFIG.MH_SUCCESS_URL,
        failed_url: failed_url || global.CONFIG.MH_FAILED_URL,
        closed_url: closed_url || global.CONFIG.MH_CLOSED_URL,
      },
      billing_data: addressCycle(Math.floor(Math.random() * 50)),
      live: String(global.CONFIG.MH_LIVE).toLowerCase() === 'true' || global.CONFIG.MH_LIVE === true,
      metadata: { scenario_tag: tag || 'run', source: 'LA08-assessment' },
    };
    
    // ADD THIS:
    console.log('📦 FULL PAYLOAD TO MONEYHASH:');
    console.log(JSON.stringify(payload, null, 2));
    console.log('');
    
    const opts = {};
    if (tag === 'risk_blocked') opts.forwardedFor = '23.49.58.1';
```

---

## 🔍 Check Webhooks

### In your server directory, check:

```bash
ls -la webhooks/
cat webhooks/*.json | tail -100
```

The webhook files show what MoneyHash sent back. Look for:
- Status: "CLOSED" or "FAILED" or "SUCCESS"
- Any error messages

---

## 🎯 Common Causes for "Intent Closed"

### 1. Test Card Declined
If using test mode with a real card number, it will fail.

**Solution:** Use MoneyHash test card numbers:
- **Success:** 5123450000000008 (Mastercard)
- **CVV:** Any 3 digits
- **Expiry:** Any future date

### 2. Flow Misconfiguration
The flow ID might not support the payment method.

**Check:** Your flow_id is `4ZDKjgm` - is this configured correctly in MoneyHash dashboard?

### 3. Redirect URLs Still Wrong
Even though code is fixed, if config is cached or not reloaded.

**Verify:** Run this in your server directory:
```bash
node -e "require('./config'); console.log('Live:', global.CONFIG.MH_LIVE); console.log('Success URL:', global.CONFIG.MH_SUCCESS_URL);"
```

### 4. MoneyHash Rejects Localhost in Test Mode
Some payment gateways reject localhost even in test mode.

**Test:** Try using ngrok URLs even with MH_LIVE: false

---

## 🧪 Definitive Test

### Add this logging to see the ACTUAL API request:

In `moneyhashService.js`, find the `createIntent` function around line 119:

```javascript
async function createIntent(body, opts = {}) {
  if (!body || typeof body !== 'object') {
    throw new Error('Request body is required and must be an object');
  }

  const authHeaders = getAuthHeaders();
  const headers = buildRequestHeaders(authHeaders, opts);

  try {
    const requestBody = JSON.stringify(body);
    
    // ADD THIS:
    console.log('🌐 ACTUAL HTTP REQUEST TO MONEYHASH:');
    console.log('URL:', CREATE_INTENT_URL);
    console.log('Body:', requestBody);
    console.log('');
    
    // console.log('[MoneyHash API] Creating intent:', JSON.stringify(body, null, 2));
```

This shows the EXACT data sent to MoneyHash.

---

## ✅ What You Need to Do RIGHT NOW:

1. **Add all the debug logging above**
2. **Restart server**
3. **Create a new intent**
4. **Copy/paste the ENTIRE server console output**
5. **Tell me what card number you're using**

Without seeing the actual debug output, I can't tell if the URLs are being sent correctly or not.

---

## 💡 Quick Test: Try Ngrok URLs

Even with MH_LIVE: false, try this in your client's `Home.jsx`:

```javascript
async function createIntent(e) {
  e.preventDefault();
  setLoading(true);
  setUrl('');

  try {
    // TEMPORARY TEST: Use ngrok instead of localhost
    const baseUrl = 'https://beatrice-foliiferous-subcorymbosely.ngrok-free.dev';
    const tag = method.toLowerCase() + '_success';
```

But make sure your React app is accessible via that ngrok URL too!
