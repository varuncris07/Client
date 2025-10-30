# Server Config File Instructions

## 📁 File: `config/config.json`

### ⚡ Quick Apply:

**Copy this file to your server:**
```bash
cp /workspace/server-config.json /path/to/your/server/config/config.json
```

---

## 📝 Full Config File Content:

Replace your **entire** `config/config.json` with this:

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

---

## 🔍 What Changed from Your Original:

### BEFORE (LIVE Credentials):
```json
{
  "MH_ACCOUNT_KEY": "Fg6gzX4r.FElC5ENesQRlKl2Y685Q2CKT6XTvFutM",
  "MH_ORG_SECRET": "",
  "MH_ACCOUNT_ID": "",
  "MH_FLOW_ID": "4ZDKjgm",
  "MH_LIVE": true
}
```

### AFTER (SANDBOX Credentials):
```json
{
  "MH_ACCOUNT_KEY": "zDAWr6iF.l2BSWDL1tDAI9t66J2iyX3visb927U2I",
  "MH_ORG_SECRET": "oTPlFG4s.MAD3pEmeUTbqFRjJzASZzgVPwsY2FVzw",
  "MH_ACCOUNT_ID": "gQnaK3Z",
  "MH_FLOW_ID": "jZB0mLV",
  "MH_LIVE": false
}
```

### Key Changes:
1. ✅ **MH_ACCOUNT_KEY**: Changed to sandbox key (zDAWr6iF...)
2. ✅ **MH_ORG_SECRET**: Added sandbox org secret (oTPlFG4s...)
3. ✅ **MH_ACCOUNT_ID**: Added sandbox account ID (gQnaK3Z)
4. ✅ **MH_FLOW_ID**: Changed from 4ZDKjgm (LIVE) → jZB0mLV (SANDBOX)
5. ✅ **MH_LIVE**: Changed from true → false
6. ✅ **HMAC_SECRET_FALLBACK**: Updated to match sandbox org secret

---

## ⚠️ Important Notes:

### Webhook URL:
```json
"MH_WEBHOOK_URL": "https://beatrice-foliiferous-subcorymbosely.ngrok-free.dev/webhook"
```

**Update this if your ngrok URL changes!**

To get your current ngrok URL:
```bash
curl http://127.0.0.1:4040/api/tunnels | jq -r '.tunnels[0].public_url'
```

### Redirect URLs (Can be overridden by client):
```json
"MH_SUCCESS_URL": "http://localhost:3000/success.html",
"MH_FAILED_URL": "http://localhost:3000/failed.html",
"MH_CLOSED_URL": "http://localhost:3000/closed.html"
```

These are **fallback values**. Your client now sends dynamic URLs which override these.

---

## 📋 Apply Steps:

### Option 1: Copy the ready file
```bash
# The file is ready in your workspace
cp /workspace/server-config.json /path/to/your/server/config/config.json
```

### Option 2: Manual edit
1. Open your server's `config/config.json`
2. Replace entire content with the JSON above
3. Save

### Option 3: From /tmp
```bash
cp /tmp/la08-server/config/config.json /path/to/your/server/config/config.json
```

---

## ✅ Verify After Applying:

```bash
cd /path/to/your/server
cat config/config.json | grep "MH_LIVE"
# Should show: "MH_LIVE": false

cat config/config.json | grep "MH_FLOW_ID"
# Should show: "MH_FLOW_ID": "jZB0mLV"

cat config/config.json | grep "MH_ACCOUNT_KEY"
# Should show: "MH_ACCOUNT_KEY": "zDAWr6iF.l2BSWDL1tDAI9t66J2iyX3visb927U2I"
```

---

## 🔐 Security Warning:

**DO NOT commit API keys to public repositories!**

If your server repo is public:
1. Add `config/config.json` to `.gitignore`
2. Create `config/config.example.json` with placeholder values
3. Keep actual `config.json` local only

---

## 🎯 After Updating Config:

1. Restart your server: `npm start`
2. Check debug logs show:
   ```
   MH_LIVE: false
   MH_FLOW_ID: jZB0mLV
   ```
3. Test creating an intent
4. Verify sandbox mode is active

---

**Your config file is ready at: `/workspace/server-config.json`** ✅
