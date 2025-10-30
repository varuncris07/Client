# 🚨 URGENT DEBUG STEPS

## Step 1: Verify Server Has the Changes

### In your SERVER terminal, run:
```bash
node -e "require('./config'); console.log('MH_LIVE:', global.CONFIG.MH_LIVE);"
```

**Expected output:** `MH_LIVE: false`

If it shows `true`, the config wasn't reloaded.

---

## Step 2: Add Debug Logging to Server

### Edit `paymentsController.js` and add this RIGHT AFTER line 31:

```javascript
async function createIntentController(req, res, next) {
  try {
    const { amount, tag, currency, success_url, failed_url, closed_url } = req.body || {};
    
    // ADD THESE LINES:
    console.log('\n=== DEBUG START ===');
    console.log('FROM CLIENT:');
    console.log('  success_url:', success_url);
    console.log('  failed_url:', failed_url);
    console.log('  closed_url:', closed_url);
    console.log('WILL SEND TO MONEYHASH:');
    console.log('  success_url:', success_url || global.CONFIG.MH_SUCCESS_URL);
    console.log('  failed_url:', failed_url || global.CONFIG.MH_FAILED_URL);
    console.log('  closed_url:', closed_url || global.CONFIG.MH_CLOSED_URL);
    console.log('MH_LIVE:', global.CONFIG.MH_LIVE);
    console.log('=== DEBUG END ===\n');
    
    const payload = {
      // ... rest of code
```

### Save and restart server

---

## Step 3: Test and Copy Output

### In browser:
1. Go to http://localhost:3000
2. Open Console (F12)
3. Click "Create Intent"
4. Copy EVERYTHING from browser console and paste here

### In server terminal:
1. Look for the `=== DEBUG START ===` section
2. Copy that entire section and paste here

---

## Step 4: Check What's Happening

### Tell me:

**A. Does the payment page open in a new tab?**
- [ ] Yes
- [ ] No

**B. If yes, what do you see on the payment page?**
- [ ] Card input form
- [ ] "Intent Closed" message
- [ ] Error message (what does it say?)
- [ ] Loading forever
- [ ] Something else (describe)

**C. After selecting Card payment method, what happens?**
- [ ] Shows card input form
- [ ] Shows "Intent Closed" immediately  
- [ ] Shows error
- [ ] Nothing happens

---

## Expected Debug Output

### If working correctly, you should see:

**Server Console:**
```
=== DEBUG START ===
FROM CLIENT:
  success_url: http://localhost:3000/success
  failed_url: http://localhost:3000/failed
  closed_url: http://localhost:3000/closed
WILL SEND TO MONEYHASH:
  success_url: http://localhost:3000/success
  failed_url: http://localhost:3000/failed
  closed_url: http://localhost:3000/closed
MH_LIVE: false
=== DEBUG END ===
```

**Browser Console:**
```
Response status: 201
Response data: { merchant_reference: "...", intent_id: "...", embed_url: "..." }
Redirecting to: https://embed.moneyhash.io/embed/payment/...
```

---

## If URLs are NOT showing (undefined):

That means the client isn't sending them. Check your client's `Home.jsx` has:

```javascript
body: JSON.stringify({
  amount,
  tag,
  success_url: `${baseUrl}/success`,  // ← These lines
  failed_url: `${baseUrl}/failed`,    // ← Must be present
  closed_url: `${baseUrl}/closed`,    // ← Must be present
}),
```

---

## Quick Verification Commands

Run these in your terminals:

### Server:
```bash
# Check config
grep "MH_LIVE" config/config.json

# Should show: "MH_LIVE": false,
```

### Client:
```bash
# Check if client has the fix
grep -A 3 "success_url" src/components/Home.jsx

# Should show the three URL lines
```
