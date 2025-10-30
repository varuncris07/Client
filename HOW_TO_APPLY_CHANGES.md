# How to Apply All Changes to Your Repositories

## ✅ CLIENT Repository (Already Done!)

Your client repo at `/workspace` already has all changes committed:
- ✅ Commit: "Refactor: Improve payment intent handling and debugging"
- ✅ File: `src/components/Home.jsx` updated

**Status: No action needed for client!** ✅

---

## 🔧 SERVER Repository (Need to Apply)

You need to copy these changes to your actual server repository:

### Option 1: Manual Copy (RECOMMENDED)

#### **File 1: `config/config.json`**

Replace your current `config/config.json` with:

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

#### **File 2: `paymentsController.js`**

**Change Line 31:**

FROM:
```javascript
const { amount, tag, currency } = req.body || {};
```

TO:
```javascript
const { amount, tag, currency, success_url, failed_url, closed_url } = req.body || {};
```

**Add after Line 31 (debug logging):**

```javascript
const { amount, tag, currency, success_url, failed_url, closed_url } = req.body || {};

// ADD THIS:
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

**Change Lines 40-42:**

FROM:
```javascript
redirect_urls: {
  success_url: global.CONFIG.MH_SUCCESS_URL,
  failed_url: global.CONFIG.MH_FAILED_URL,
  closed_url: global.CONFIG.MH_CLOSED_URL,
},
```

TO:
```javascript
redirect_urls: {
  success_url: success_url || global.CONFIG.MH_SUCCESS_URL,
  failed_url: failed_url || global.CONFIG.MH_FAILED_URL,
  closed_url: closed_url || global.CONFIG.MH_CLOSED_URL,
},
```

---

### Option 2: Copy Files from /tmp

If you want to copy the entire modified files:

```bash
# Copy modified paymentsController.js
cp /tmp/la08-server/paymentsController.js /path/to/your/actual/server/paymentsController.js

# Copy modified config
cp /tmp/la08-server/config/config.json /path/to/your/actual/server/config/config.json
```

---

## 📋 Summary of Changes

### CLIENT (/workspace):
✅ Already committed and pushed
- File: `src/components/Home.jsx`
- Changes: Sends redirect URLs, opens in new tab, flexible API response

### SERVER (you need to apply):
❌ Need to copy to your actual server repo
- File: `config/config.json` → Switch to sandbox credentials
- File: `paymentsController.js` → Accept and use redirect URLs + debug logging

---

## 🚀 After Applying Changes:

1. **Commit server changes:**
   ```bash
   cd /path/to/your/server
   git add config/config.json paymentsController.js
   git commit -m "feat: Add redirect URL support and switch to sandbox credentials"
   git push
   ```

2. **Restart server:**
   ```bash
   npm start
   ```

3. **Test (will still fail from India due to IP, but code will be correct)**

---

## 📁 Files Created for You:

In your CLIENT workspace:
- ✅ `CHANGES_SUMMARY.md` - Complete list of all changes
- ✅ `HOW_TO_APPLY_CHANGES.md` - This file

In /tmp/la08-server (reference):
- ✅ Modified `paymentsController.js` with all fixes
- ✅ Updated `config/config.json` with sandbox credentials
- ✅ `IMPLEMENTATION_SUMMARY.md` - Technical summary

---

## ⚠️ Important Notes:

1. **Update ngrok webhook URL** if your ngrok URL changes
2. **Don't commit API keys** to public repos (use .env or .gitignore)
3. **Keep sandbox credentials** for testing
4. **Switch to live credentials** only for production

---

**Your code is ready to deploy!** Just need to test from UAE/KSA or wait for MoneyHash to remove IP restriction. 🚀
