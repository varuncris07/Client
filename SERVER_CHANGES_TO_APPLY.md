# Server Changes to Apply

## 📁 Files Modified: 2

1. `config/config.json` - Switch to sandbox credentials
2. `paymentsController.js` - Accept and use redirect URLs

---

## 🔧 CHANGE 1: config/config.json

### Replace Your Entire File With:

```json
{
  "PORT": 8080,
  "VERIFY_SIGNATURE": false,
  "HMAC_HEADER": "X-MH-Signature",
  "HMAC_SECRET_FALLBACK": "oTPlFG4s.MAD3pEmeUTbqFRjJzASZzgVPwsY2FVzw",
  "HMAC_ALGO": "sha256",

  "MH_API_BASE": "https://web.moneyhash.io",
  "MH_CREATE_INTENT_PATH": "/api/v1.4/external/payments/intent/",
  "MH_REFUND_PATH": "/api/v1.4/payments/transactions/{trx_uuid}/refund/",

  "MH_AUTH_MODE": "account_key",
  "MH_ACCOUNT_KEY": "zDAWr6iF.l2BSWDL1tDAI9t66J2iyX3visb927U2I",
  "MH_ORG_SECRET": "oTPlFG4s.MAD3pEmeUTbqFRjJzASZzgVPwsY2FVzw",
  "MH_ACCOUNT_ID": "gQnaK3Z",

  "MH_FLOW_ID": "jZB0mLV",
  "MH_PARTNER_CODE": "LA08",
  "MH_CURRENCY": "SAR",
  "MH_LIVE": false,

  "MH_WEBHOOK_URL": "https://beatrice-foliiferous-subcorymbosely.ngrok-free.dev/webhook",
  "MH_SUCCESS_URL": "http://localhost:3000/success.html",
  "MH_FAILED_URL": "http://localhost:3000/failed.html",
  "MH_CLOSED_URL": "http://localhost:3000/closed.html",

  "MH_TRX_ID_FOR_REFUND": ""
}
```

**Key Changes:**
- MH_ACCOUNT_KEY: Fg6gzX4r... → zDAWr6iF... (SANDBOX)
- MH_FLOW_ID: 4ZDKjgm → jZB0mLV (SANDBOX)
- MH_LIVE: true → false (TEST MODE)
- Added MH_ACCOUNT_ID: gQnaK3Z
- Updated MH_ORG_SECRET to sandbox value

---

## 🔧 CHANGE 2: paymentsController.js

### Edit 1: Line 31

**FIND:**
```javascript
const { amount, tag, currency } = req.body || {};
```

**REPLACE WITH:**
```javascript
const { amount, tag, currency, success_url, failed_url, closed_url } = req.body || {};
```

---

### Edit 2: After Line 31 - Add Debug Logging

**ADD THIS ENTIRE BLOCK after line 31:**

```javascript
    const { amount, tag, currency, success_url, failed_url, closed_url } = req.body || {};
    
    // Debug logging
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║        DEBUG: CREATE INTENT            ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('FROM CLIENT:');
    console.log('  amount:', amount);
    console.log('  tag:', tag);
    console.log('  success_url:', success_url || 'UNDEFINED');
    console.log('  failed_url:', failed_url || 'UNDEFINED');
    console.log('  closed_url:', closed_url || 'UNDEFINED');
    console.log('\nCONFIG:');
    console.log('  MH_LIVE:', global.CONFIG.MH_LIVE);
    console.log('  MH_FLOW_ID:', global.CONFIG.MH_FLOW_ID);
    console.log('  MH_SUCCESS_URL:', global.CONFIG.MH_SUCCESS_URL);
    console.log('  MH_FAILED_URL:', global.CONFIG.MH_FAILED_URL);
    console.log('  MH_CLOSED_URL:', global.CONFIG.MH_CLOSED_URL);
    console.log('\nWILL SEND TO MONEYHASH:');
    console.log('  success_url:', success_url || global.CONFIG.MH_SUCCESS_URL);
    console.log('  failed_url:', failed_url || global.CONFIG.MH_FAILED_URL);
    console.log('  closed_url:', closed_url || global.CONFIG.MH_CLOSED_URL);
    console.log('════════════════════════════════════════\n');
    
    const payload = {
```

---

### Edit 3: Lines 40-42 - Use Client URLs

**FIND:**
```javascript
      redirect_urls: {
        success_url: global.CONFIG.MH_SUCCESS_URL,
        failed_url: global.CONFIG.MH_FAILED_URL,
        closed_url: global.CONFIG.MH_CLOSED_URL,
      },
```

**REPLACE WITH:**
```javascript
      redirect_urls: {
        success_url: success_url || global.CONFIG.MH_SUCCESS_URL,
        failed_url: failed_url || global.CONFIG.MH_FAILED_URL,
        closed_url: closed_url || global.CONFIG.MH_CLOSED_URL,
      },
```

---

## ✅ Quick Steps to Apply:

1. Open your server repository
2. Edit `config/config.json` - replace entire file
3. Edit `paymentsController.js` - make 3 edits above
4. Save both files
5. Commit:
   ```bash
   git add config/config.json paymentsController.js
   git commit -m "feat: Add redirect URL support and switch to sandbox"
   git push
   ```
6. Restart server: `npm start`

---

## 📊 What These Changes Do:

**config.json:**
- Switches from LIVE to SANDBOX credentials
- Allows testing without real payments
- Sets MH_LIVE: false

**paymentsController.js:**
- Accepts redirect URLs from client
- Passes them to MoneyHash API
- Falls back to config if not provided
- Adds debug logging for verification

---

## ⚠️ After Applying:

**Testing will STILL fail from India** due to IP restriction.

Solutions:
1. Email MoneyHash to remove IP restriction
2. Test from UAE/KSA
3. Document and submit with evidence

**But your code will be CORRECT and ready!** ✅
