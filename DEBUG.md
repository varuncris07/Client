# Debugging Guide for LA08 Checkout Redirect Issue

## Current Status
✅ Frontend code has been updated with redirect URLs
❌ Need to verify both servers are running

## Steps to Debug:

### 1. Start the Frontend Dev Server
```bash
npm run dev
```
- Should start on http://localhost:3000
- Wait for "ready" message

### 2. Start the Backend Server
The backend needs to run on port 8080 (as configured in vite.config.js proxy).
- Verify backend is running: `curl http://localhost:8080`
- Check backend logs for errors

### 3. Clear Browser Cache
Since code was updated, clear cache:
- Open DevTools (F12)
- Right-click refresh button → "Empty Cache and Hard Reload"
- Or use Incognito/Private mode

### 4. Test the Payment Flow

Open browser DevTools Console (F12) and:

1. Go to http://localhost:3000
2. Fill in the form:
   - Amount: 1 (or any amount)
   - Method: CARD
3. Click "Create Intent"

### 5. Check Console Logs

You should see these logs:
```
Response status: 200
Response data: { embed_url: "..." }
Redirecting to: https://...
```

### 6. Verify the API Request

In DevTools Network tab:
1. Look for the `/api/payments/intent` request
2. Check the "Payload" tab
3. Verify it includes:
```json
{
  "amount": 1,
  "tag": "card_success",
  "success_url": "http://localhost:3000/success",
  "failed_url": "http://localhost:3000/failed",
  "closed_url": "http://localhost:3000/closed"
}
```

## Common Issues:

### Issue 1: Backend Not Running
**Symptom:** Error "Failed to fetch" or "Network Error"
**Solution:** Start your backend server on port 8080

### Issue 2: Backend Returns Error
**Symptom:** Console shows error status (400, 401, 500)
**Solution:** Check backend logs - likely missing payment gateway credentials

### Issue 3: No `embed_url` in Response
**Symptom:** "No redirect URL returned by API"
**Solution:** Backend needs to return `{ embed_url: "..." }` in the response

### Issue 4: Old Code Still Running
**Symptom:** Request doesn't include redirect URLs
**Solution:** 
- Stop dev server (Ctrl+C)
- Clear cache
- Restart with `npm run dev`

### Issue 5: Backend Doesn't Use Redirect URLs
**Symptom:** Payment gateway doesn't redirect back to your app
**Solution:** Backend must pass these URLs to the payment gateway API when creating the intent

## Backend Requirements

Your backend (port 8080) must:

1. Accept POST to `/api/payments/intent` with body:
```json
{
  "amount": 1,
  "tag": "card_success",
  "success_url": "http://localhost:3000/success",
  "failed_url": "http://localhost:3000/failed",
  "closed_url": "http://localhost:3000/closed"
}
```

2. Create payment intent with LA08/payment gateway

3. Pass the redirect URLs to the payment gateway

4. Return response:
```json
{
  "embed_url": "https://payment-gateway.com/checkout/xxx"
}
```

## Example Backend Issue

If your backend creates the intent but doesn't pass the URLs:
```javascript
// ❌ WRONG - Backend ignores the URLs
const intent = await paymentGateway.createIntent({
  amount: req.body.amount
  // Missing: success_url, failed_url, closed_url
});

// ✅ CORRECT - Backend passes the URLs
const intent = await paymentGateway.createIntent({
  amount: req.body.amount,
  success_url: req.body.success_url,
  failed_url: req.body.failed_url,
  closed_url: req.body.closed_url
});
```

## Next Steps

1. Start both servers (frontend + backend)
2. Test with browser console open
3. Share the console output if issue persists
4. Share backend logs if available
