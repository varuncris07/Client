# Add Debug Logging to Verify Redirect URLs

## Temporary Debug Code

Add this logging to your `paymentsController.js` to see what's happening:

### In createIntentController function, add after line 31:

```javascript
async function createIntentController(req, res, next) {
  try {
    const { amount, tag, currency, success_url, failed_url, closed_url } = req.body || {};
    
    // ADD THIS DEBUG LOGGING:
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 DEBUG: Redirect URLs received from client:');
    console.log('  success_url:', success_url || '(not provided, using config)');
    console.log('  failed_url:', failed_url || '(not provided, using config)');
    console.log('  closed_url:', closed_url || '(not provided, using config)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const payload = {
      // ... rest of code
```

### Also add after building the payload (around line 47):

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
    
    // ADD THIS DEBUG LOGGING:
    console.log('🚀 DEBUG: Sending to MoneyHash:');
    console.log('  redirect_urls:', JSON.stringify(payload.redirect_urls, null, 2));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
```

## What You Should See:

### If the fix is applied correctly:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 DEBUG: Redirect URLs received from client:
  success_url: http://localhost:3000/success
  failed_url: http://localhost:3000/failed
  closed_url: http://localhost:3000/closed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 DEBUG: Sending to MoneyHash:
  redirect_urls: {
    "success_url": "http://localhost:3000/success",
    "failed_url": "http://localhost:3000/failed",
    "closed_url": "http://localhost:3000/closed"
  }
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### If the fix is NOT applied:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 DEBUG: Redirect URLs received from client:
  success_url: (not provided, using config)
  failed_url: (not provided, using config)
  closed_url: (not provided, using config)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 DEBUG: Sending to MoneyHash:
  redirect_urls: {
    "success_url": "https://beatrice-foliiferous-subcorymbosely.ngrok-free.dev/success.html",
    "failed_url": "https://beatrice-foliiferous-subcorymbosely.ngrok-free.dev/failed.html",
    "closed_url": "https://beatrice-foliiferous-subcorymbosely.ngrok-free.dev/closed.html"
  }
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## After Testing:

Once you confirm it's working, you can remove these debug console.log statements.
