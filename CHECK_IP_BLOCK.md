# How to Check If IP Is Still Blocking Payments

---

## 🎯 Goal: Verify if the IP restriction is still active

---

## 📋 **Step 1: Find Latest Real Webhook**

Run these commands in your **server directory**:

```bash
# List all webhooks by date (newest first)
ls -lt webhooks/

# Find webhooks created in last 10 minutes
find webhooks/ -name "*.json" -mmin -10 -ls

# Or list all JSON files
ls -1 webhooks/*.json
```

**Identify the latest webhook** (not the test one):
- Test webhook: Usually named `test_evt_1.json` or similar
- Real webhooks: Named like `evt_1234567890123.json` (timestamp)

---

## 📖 **Step 2: Read the Latest Webhook**

```bash
# Replace <filename> with the actual latest webhook file
cat webhooks/<latest-filename>.json

# Or with pretty formatting if you have jq:
cat webhooks/<latest-filename>.json | jq .
```

---

## 🔍 **Step 3: Analyze the Webhook**

### ✅ **If IP Is NOT Blocked (Fixed!):**

The webhook will show **successful payment** or **normal failure**:

```json
{
  "type": "transaction.successful",
  "data": {
    "transaction": {
      "status": "SUCCESSFUL"  ← Payment worked!
    }
  }
}
```

Or normal failure (wrong card, etc.):
```json
{
  "type": "transaction.failed",
  "data": {
    "transaction": {
      "status": "FAILED",
      "failure_reason": "insufficient_funds"  ← Normal payment failure
    }
  }
}
```

### ❌ **If IP IS STILL Blocked:**

The webhook will show:

```json
{
  "type": "intent.closed",
  "data": {
    "intent": {
      "status": "CLOSED",
      "flow": "jZB0mLV"
    },
    "transaction": {
      "status": "BLOCKED",           ← BLOCKED!
      "rule": "Block_CARDS_IP_nonUAE_nonKSA"  ← IP RULE!
    },
    "flow_data": {
      "sequence": {
        "alias_name": "non_KSA_Non_UAE_IP_not_permitted"  ← IP NOT ALLOWED!
      }
    },
    "ip": {
      "ip_address": "122.182.x.x",
      "country": {
        "iso_code": "IN",             ← India IP detected
        "name": "India"
      }
    }
  }
}
```

**Key indicators of IP block:**
- `"type": "intent.closed"`
- `"status": "BLOCKED"`
- `"rule": "Block_CARDS_IP_nonUAE_nonKSA"`
- `"country": { "iso_code": "IN" }`

---

## 🌐 **Step 4: Check Ngrok Inspection**

Ngrok shows ALL HTTP requests, including webhooks from MoneyHash.

### **Open Ngrok Web Interface:**

```bash
# In browser, go to:
http://127.0.0.1:4040

# Or open the inspect page:
http://127.0.0.1:4040/inspect/http
```

### **Look for Recent POST to /webhook:**

1. Find the latest `POST /webhook` request
2. Click on it to see details
3. Look at the **Request Body** (what MoneyHash sent)
4. Check for the same JSON as above

---

## 🧪 **Step 5: Test with a Fresh Payment**

To get a NEW webhook:

### **1. Create new payment intent:**
```bash
# Make sure server is running
npm start
```

### **2. In browser:**
- Go to `http://localhost:3000`
- Amount: `1`
- Method: Card
- Click "Create Intent"

### **3. On payment page:**
- Card: `4242 4242 4242 4242`
- Expiry: `12/25`
- CVV: `123`
- **Click "Pay"**

### **4. Immediately check:**

```bash
# In server terminal - watch for webhook log:
# You should see:
# "Webhook saved: evt_XXXXX (intent.closed)" or
# "Webhook saved: evt_XXXXX (transaction.successful)"

# Then read the file:
ls -t webhooks/*.json | head -1 | xargs cat | jq .
```

---

## 📊 **Quick Check Commands:**

Run all these in your **server directory**:

```bash
echo "=== Latest 5 Webhooks ==="
ls -lt webhooks/*.json | head -5

echo ""
echo "=== Reading Latest Webhook ==="
ls -t webhooks/*.json | head -1 | xargs cat

echo ""
echo "=== Checking for IP Block in Latest Webhook ==="
ls -t webhooks/*.json | head -1 | xargs cat | grep -E "(BLOCKED|IP|iso_code|intent.closed)" || echo "No IP block indicators found"

echo ""
echo "=== Checking Webhook Type ==="
ls -t webhooks/*.json | head -1 | xargs cat | grep "\"type\""
```

---

## 🎯 **What Each Result Means:**

| Webhook Type | Status | IP Block? | What It Means |
|--------------|--------|-----------|---------------|
| `intent.closed` + `BLOCKED` + India IP | ❌ | **YES** | MoneyHash still blocking India IPs |
| `transaction.successful` | ✅ | **NO** | Payment worked! IP fixed! |
| `transaction.failed` (normal reason) | ✅ | **NO** | IP fixed, but card/payment failed (normal) |
| No webhook at all | ⚠️ | **Unknown** | Ngrok not working or webhook URL wrong |

---

## 🔧 **If No Webhook Received:**

### Check 1: Is ngrok running?
```bash
curl http://127.0.0.1:4040/api/tunnels
```

### Check 2: Is webhook URL correct in config?
```bash
cat config/config.json | grep MH_WEBHOOK_URL
```

### Check 3: Check ngrok web interface
Open `http://127.0.0.1:4040/inspect/http` and look for POST requests from MoneyHash.

---

## 📝 **Report Template:**

After checking, report:

1. **Latest webhook filename:** `evt_XXXXX.json`
2. **Webhook type:** `intent.closed` or `transaction.successful` or other
3. **Transaction status:** `BLOCKED` or `SUCCESSFUL` or `FAILED`
4. **IP country code (if present):** `IN` (India) or other
5. **Rule name (if present):** `Block_CARDS_IP_nonUAE_nonKSA` or none

---

**Run these checks now and tell me what you find!** 🔍
