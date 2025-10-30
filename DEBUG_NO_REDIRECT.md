# Debug: Payment Not Redirecting

## ❌ Issue: Payment completed but no redirect happened

---

## 🔍 **What We Need to Check:**

### 1. **Did you get any error message?**
   - "Intent Closed"?
   - "Payment Failed"?
   - Or just stayed on the payment page?

### 2. **Check for new webhooks**

In your server directory, run:
```bash
# Find webhook files
ls -lt webhooks/ | head -5

# Read the latest webhook
cat webhooks/<latest-file>.json
```

This will tell us what MoneyHash did with the payment.

---

## 🐛 **Enable Full Debug Logging:**

We need to see the ACTUAL payload sent to MoneyHash API.

### **Edit: `moneyhashService.js`**

Find line 119 (currently commented):
```javascript
// console.log('[MoneyHash API] Creating intent:', JSON.stringify(body, null, 2));
```

**Uncomment it:**
```javascript
console.log('[MoneyHash API] Creating intent:', JSON.stringify(body, null, 2));
```

### **Restart Server:**
```bash
# Stop server (Ctrl+C)
# Start again
npm start
```

### **Test Again:**
1. Create a new payment intent
2. Look at server logs - you should see the FULL payload
3. Check if `redirect_urls` is in the payload

---

## 🎯 **Expected Payload to MoneyHash:**

Should look like this:
```json
{
  "flow_id": "jZB0mLV",
  "partner_code": "LA08",
  "amount": 1,
  "amount_currency": "SAR",
  "webhook_url": "https://...ngrok.../webhook",
  "redirect_urls": {
    "success_url": "http://localhost:3000/success",
    "failed_url": "http://localhost:3000/failed",
    "closed_url": "http://localhost:3000/closed"
  },
  "billing_data": { ... },
  "live": false,
  "metadata": { ... }
}
```

**KEY:** Check if `redirect_urls` is present!

---

## 🚨 **Possible Issues:**

### **Issue 1: Redirect URLs Not in Payload**
If you DON'T see `redirect_urls` in the payload, the problem is in `paymentsController.js`.

**Fix:** Verify these lines exist:
```javascript
// Line 31
const { amount, tag, currency, success_url, failed_url, closed_url } = req.body || {};

// Lines 55-59 (approx)
redirect_urls: {
  success_url: success_url || global.CONFIG.MH_SUCCESS_URL,
  failed_url: failed_url || global.CONFIG.MH_FAILED_URL,
  closed_url: closed_url || global.CONFIG.MH_CLOSED_URL,
},
```

### **Issue 2: MoneyHash Ignoring Redirect URLs**
If `redirect_urls` IS in the payload but still no redirect, check webhook for errors.

### **Issue 3: Intent Closed Again**
Webhook will show:
```json
{
  "type": "intent.closed",
  "transaction": {
    "status": "BLOCKED"
  }
}
```

---

## 📋 **Quick Checklist:**

Run these commands in your server directory:

```bash
# 1. Check for new webhooks
ls -lt webhooks/ | head -5

# 2. Read latest webhook
cat webhooks/<latest-file>.json | jq .

# 3. Check paymentsController has the fix
grep "success_url, failed_url, closed_url" paymentsController.js

# 4. Verify redirect_urls is in payload code
grep -A 5 "redirect_urls:" paymentsController.js
```

---

## 🔧 **Steps to Debug:**

1. **Uncomment debug line in `moneyhashService.js`** (line 119)
2. **Restart server**
3. **Create new payment** and check logs for full payload
4. **Check if `redirect_urls` is in the payload**
5. **Complete payment** and click Pay
6. **Check webhooks** for what happened
7. **Report back:**
   - Is `redirect_urls` in the payload? (YES/NO)
   - What does the webhook say?
   - What happened on the payment page?

---

## 💡 **What to Look For:**

### ✅ **Good Signs:**
```
[MoneyHash API] Creating intent: {
  ...
  "redirect_urls": {
    "success_url": "http://localhost:3000/success",
    ...
  }
  ...
}
```

### ❌ **Bad Signs:**
```json
{
  // NO redirect_urls field!
  "flow_id": "jZB0mLV",
  "amount": 1,
  ...
  // Missing redirect_urls!
}
```

---

**Let's enable that debug log and see what's actually being sent to MoneyHash!** 🔍
