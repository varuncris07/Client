# Enable Debug Payload Logging

## 🎯 Goal: See EXACTLY what's being sent to MoneyHash API

Your config is correct, but we need to verify `redirect_urls` is actually in the API payload.

---

## 📝 **Step 1: Edit `moneyhashService.js`**

In your **server directory**, open `moneyhashService.js` and find this line (around line 119):

```javascript
// console.log('[MoneyHash API] Creating intent:', JSON.stringify(body, null, 2));
```

**Uncomment it (remove the //):**

```javascript
console.log('[MoneyHash API] Creating intent:', JSON.stringify(body, null, 2));
```

---

## 🔄 **Step 2: Restart Server**

```bash
# Stop server (Ctrl+C)
npm start
```

---

## 🧪 **Step 3: Create New Payment**

1. Go to `http://localhost:3000`
2. Enter amount: `1`
3. Select: **Card**
4. Click "Create Intent"

---

## 👀 **Step 4: Check Server Logs**

You should see TWO outputs:

### **Output 1: Debug from Controller** (you already see this)
```
╔════════════════════════════════════════╗
║        DEBUG: CREATE INTENT            ║
╚════════════════════════════════════════╝
FROM CLIENT:
  success_url: http://localhost:3000/success
  failed_url: http://localhost:3000/failed
  closed_url: http://localhost:3000/closed

WILL SEND TO MONEYHASH:
  success_url: http://localhost:3000/success
  failed_url: http://localhost:3000/failed
  closed_url: http://localhost:3000/closed
```

### **Output 2: ACTUAL API Payload** (NEW - you need to see this!)
```
[MoneyHash API] Creating intent: {
  "flow_id": "jZB0mLV",
  "partner_code": "LA08",
  "merchant_reference": "LA08_card_success_...",
  "amount": 1,
  "amount_currency": "SAR",
  "webhook_url": "https://...ngrok.../webhook",
  "redirect_urls": {                    ← CHECK THIS!
    "success_url": "http://localhost:3000/success",
    "failed_url": "http://localhost:3000/failed",
    "closed_url": "http://localhost:3000/closed"
  },
  "billing_data": { ... },
  "live": false,
  "metadata": { ... }
}
```

---

## ✅ **What to Look For:**

### **GOOD ✅ - redirect_urls IS present:**
```json
{
  "flow_id": "jZB0mLV",
  "amount": 1,
  "redirect_urls": {         ← EXISTS!
    "success_url": "http://localhost:3000/success",
    "failed_url": "http://localhost:3000/failed",
    "closed_url": "http://localhost:3000/closed"
  }
}
```

**If you see this:** The code is working! Problem is with MoneyHash flow configuration.

---

### **BAD ❌ - redirect_urls is MISSING:**
```json
{
  "flow_id": "jZB0mLV",
  "amount": 1,
  "webhook_url": "...",
  "billing_data": { ... }
  // NO redirect_urls field!
}
```

**If you see this:** The controller code wasn't applied. You need to update `paymentsController.js`.

---

## 🚨 **If redirect_urls is MISSING:**

Your `paymentsController.js` needs these changes:

### **Line 31 - Extract URLs from request:**
```javascript
const { amount, tag, currency, success_url, failed_url, closed_url } = req.body || {};
```

### **Lines ~55-59 - Use URLs in payload:**
```javascript
redirect_urls: {
  success_url: success_url || global.CONFIG.MH_SUCCESS_URL,
  failed_url: failed_url || global.CONFIG.MH_FAILED_URL,
  closed_url: closed_url || global.CONFIG.MH_CLOSED_URL,
},
```

**Reference file:** `/workspace/SERVER_CHANGES_TO_APPLY.md`

---

## 📋 **Quick Commands:**

```bash
# In your server directory:

# 1. Check if paymentsController has the changes
grep "success_url, failed_url, closed_url" paymentsController.js

# Expected output:
# const { amount, tag, currency, success_url, failed_url, closed_url } = req.body || {};

# 2. Check if redirect_urls code exists
grep -A 3 "redirect_urls:" paymentsController.js

# Expected output:
# redirect_urls: {
#   success_url: success_url || global.CONFIG.MH_SUCCESS_URL,
#   failed_url: failed_url || global.CONFIG.MH_FAILED_URL,
#   closed_url: closed_url || global.CONFIG.MH_CLOSED_URL,
```

---

## 🎯 **Report Back:**

After enabling the debug log and testing:

1. **Is `redirect_urls` in the payload?** (YES/NO)
2. **What's the exact payload you see?** (copy-paste)
3. **Did you complete the payment?** (YES/NO)
4. **What happened after clicking Pay?**
   - Intent Closed?
   - Payment Successful?
   - Stayed on payment page?

---

**This will tell us if it's a code issue or a MoneyHash configuration issue!** 🔍
