# Server Fix for Redirect URLs Issue

## File to Change:
`paymentsController.js` in your server repository

## Changes Required:

### 1. Line 31 - Add redirect URL parameters
**Before:**
```javascript
const { amount, tag, currency } = req.body || {};
```

**After:**
```javascript
const { amount, tag, currency, success_url, failed_url, closed_url } = req.body || {};
```

### 2. Lines 40-42 - Use request redirect URLs
**Before:**
```javascript
redirect_urls: {
  success_url: global.CONFIG.MH_SUCCESS_URL,
  failed_url: global.CONFIG.MH_FAILED_URL,
  closed_url: global.CONFIG.MH_CLOSED_URL,
},
```

**After:**
```javascript
redirect_urls: {
  success_url: success_url || global.CONFIG.MH_SUCCESS_URL,
  failed_url: failed_url || global.CONFIG.MH_FAILED_URL,
  closed_url: closed_url || global.CONFIG.MH_CLOSED_URL,
},
```

## Complete Fixed Function:
```javascript
async function createIntentController(req, res, next) {
  try {
    const { amount, tag, currency, success_url, failed_url, closed_url } = req.body || {};
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
    
    const opts = {};
    if (tag === 'risk_blocked') opts.forwardedFor = '23.49.58.1';
    
    const resp = await createIntent(payload, opts);

    const embedUrl = resp?.data?.embed_url;
    const intentId = resp?.data?.intent?.id;

    return res.status(201).json({
      merchant_reference: payload.merchant_reference,
      intent_id: intentId,
      embed_url: "https://embed.moneyhash.io/embed/payment/" + intentId,
    });
  } catch (err) {
    return next(err);
  }
}
```

## What This Does:
- ✅ Reads redirect URLs from the client request
- ✅ Passes them to MoneyHash payment gateway
- ✅ Falls back to config values if not provided
- ✅ Allows client to control where users are redirected after payment

## After Fixing:
1. Save the file in your server repo
2. Restart your server: `npm run dev` or `npm start`
3. Test the payment flow from your client
4. Users will now be redirected back to your React app after payment!
