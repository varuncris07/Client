# How to Run the LA08 Payment Integration

## 🎉 MoneyHash IP Restriction Fixed - Ready to Test!

---

## 📋 **Prerequisites:**

1. ✅ Server changes applied (config.json + paymentsController.js)
2. ✅ Client changes committed
3. ✅ MoneyHash IP restriction removed
4. ✅ Node.js installed

---

## 🚀 **Step-by-Step Instructions:**

### **Step 1: Start the Server**

```bash
# Navigate to your server directory
cd /path/to/your/server

# Install dependencies (if not already done)
npm install

# Start the server
npm start
```

**Expected output:**
```
Server listening on port 8080
CONFIG loaded:
  MH_LIVE: false
  MH_FLOW_ID: jZB0mLV
  MH_ACCOUNT_ID: gQnaK3Z
Ready to accept requests
```

**Verify server is running:**
```bash
# In a new terminal:
curl http://localhost:8080/health
# Should return: OK or health check response
```

---

### **Step 2: Start the Client**

```bash
# Navigate to your client directory
cd /workspace

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

---

### **Step 3: Open in Browser**

Open your browser and go to:
```
http://localhost:3000
```

You should see the LA08 Checkout Launcher page!

---

## 🧪 **Testing the Payment Flow:**

### **Test 1: Card Payment**

1. **Fill the form:**
   - Amount: `1` (or any amount)
   - Select: **Card**

2. **Click "Create Intent"**
   - New tab opens with MoneyHash payment page
   - You'll see the payment form

3. **Check Server Logs:**
   ```
   ╔════════════════════════════════════════╗
   ║        DEBUG: CREATE INTENT            ║
   ╚════════════════════════════════════════╝
   FROM CLIENT:
     amount: 1
     tag: card_success
     success_url: http://localhost:3000/success  ✅
     failed_url: http://localhost:3000/failed   ✅
     closed_url: http://localhost:3000/closed   ✅
   
   WILL SEND TO MONEYHASH:
     success_url: http://localhost:3000/success  ✅
     failed_url: http://localhost:3000/failed   ✅
     closed_url: http://localhost:3000/closed   ✅
   ```

4. **Enter Test Card Details:**
   - Card Number: `4242 4242 4242 4242` (or use MoneyHash's test cards)
   - Expiry: Any future date (e.g., `12/25`)
   - CVV: Any 3 digits (e.g., `123`)
   - Name: `Test User`

5. **Click "Pay"**
   - Payment processes
   - **MoneyHash redirects** to `http://localhost:3000/success`

6. **Verify Success Page:**
   - Should see green background
   - Message: "Payment Successful! ✅"
   - Current URL displayed

---

### **Test 2: Failed Payment**

1. Use MoneyHash's **test card for failures** (check their docs)
2. Should redirect to `http://localhost:3000/failed`
3. Red background with failure message

---

### **Test 3: Closed Payment**

1. Create intent
2. Close the payment window without paying
3. Should redirect to `http://localhost:3000/closed`
4. Gray background with "closed" message

---

## 🔍 **What to Look For:**

### ✅ **Success Indicators:**

1. **Server Console:**
   ```
   ╔════════════════════════════════════════╗
   ║        DEBUG: CREATE INTENT            ║
   ╚════════════════════════════════════════╝
   FROM CLIENT:
     success_url: http://localhost:3000/success  ✅
   
   POST /api/payments/intent 201 - XX ms
   ```

2. **Browser Console (F12):**
   ```
   Response status: 200
   Response data: { intent_id: "...", embed_url: "..." }
   Redirecting to: https://embed.moneyhash.io/embed/payment/...
   ```

3. **After Payment:**
   - Browser URL changes to `http://localhost:3000/success`
   - Success page displays
   - **No "Intent Closed" error!** ✅

---

## ❌ **Common Issues:**

### **Issue 1: Server not starting**
```bash
# Check if port 8080 is in use
lsof -i :8080
# Or
netstat -an | grep 8080

# Kill the process if needed
kill -9 <PID>
```

### **Issue 2: Client can't connect to server**
```bash
# Verify server is running
curl http://localhost:8080/api/health

# Check vite.config.js has proxy:
# server: {
#   proxy: {
#     '/api': 'http://localhost:8080'
#   }
# }
```

### **Issue 3: Payment page opens but redirect fails**
- Check server logs for the debug output
- Verify redirect URLs are being sent
- Check browser console for errors

---

## 🎯 **Expected Flow (Now Fixed!):**

```
1. User fills form (localhost:3000)
   ↓
2. Click "Create Intent"
   ↓
3. Client sends request with redirect URLs
   ↓
4. Server creates intent with MoneyHash
   ↓
5. New tab opens: embed.moneyhash.io
   ↓
6. User enters card details
   ↓
7. Click "Pay"
   ↓
8. ✅ Payment processes (NO IP BLOCK!)
   ↓
9. ✅ MoneyHash redirects to localhost:3000/success
   ↓
10. ✅ Success page displays!
```

---

## 📊 **Monitoring:**

### **Watch Server Logs:**
```bash
cd /path/to/server
npm start | tee payment-test.log
```

### **Watch Client Logs:**
```bash
cd /workspace
npm run dev
# Then open browser console (F12)
```

### **Check Webhooks:**
```bash
# Server should save webhook files:
ls -lt /path/to/server/webhooks/
cat /path/to/server/webhooks/<latest-webhook>.json
```

Expected webhook for success:
```json
{
  "type": "transaction.successful",
  "data": {
    "transaction": {
      "status": "SUCCESSFUL"
    }
  }
}
```

---

## 🎉 **Success Criteria:**

- ✅ Intent created (HTTP 201)
- ✅ Payment page opens
- ✅ Payment processes without "Intent Closed"
- ✅ Redirect to `http://localhost:3000/success`
- ✅ Success page displays
- ✅ Webhook received with "transaction.successful"

---

## 📸 **Take Screenshots:**

Document your successful test:
1. Screenshot of payment form
2. Screenshot of successful payment
3. Screenshot of redirect to success page
4. Screenshot of server debug logs
5. Screenshot of webhook JSON

This proves your implementation works! 🎉

---

## 🚀 **Quick Start (TL;DR):**

```bash
# Terminal 1: Start Server
cd /path/to/server && npm start

# Terminal 2: Start Client
cd /workspace && npm run dev

# Browser:
# 1. Open http://localhost:3000
# 2. Enter amount: 1
# 3. Select: Card
# 4. Click "Create Intent"
# 5. Enter test card: 4242 4242 4242 4242
# 6. Click "Pay"
# 7. ✅ See success page!
```

---

**Now test it and enjoy your working payment integration!** 🎉
