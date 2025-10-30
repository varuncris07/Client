# Email to MoneyHash Support - IP Restriction Still Active

---

**Subject:** URGENT: IP Restriction Still Blocking Sandbox Flow jZB0mLV - Request Immediate Fix

---

**Dear MoneyHash Support Team,**

I am writing to report that the IP geographic restriction is **STILL blocking payments** on the **SANDBOX flow jZB0mLV**, despite your confirmation that it was fixed.

---

## Issue Summary

- **Flow ID:** jZB0mLV (Sandbox)
- **Account ID:** gQnaK3Z (Sandbox)
- **Issue:** All payment attempts from India are immediately closed with "Intent Closed"
- **Status:** BLOCKING ASSESSMENT COMPLETION

---

## Evidence

### 1. Correct Configuration
I am sending the correct sandbox credentials:

```json
{
  "flow_id": "jZB0mLV",
  "account_id": "gQnaK3Z",
  "live": false,
  "redirect_urls": {
    "success_url": "http://localhost:3000/success",
    "failed_url": "http://localhost:3000/failed",
    "closed_url": "http://localhost:3000/closed"
  }
}
```

### 2. Intent Creation Success
MoneyHash API accepts the intent and returns HTTP 200:

```json
{
  "status": {
    "code": 200,
    "message": "success"
  },
  "data": {
    "intent": {
      "id": "Lko6p50",
      "status": "UNPROCESSED",
      "is_live": true
    }
  }
}
```

**Note:** MoneyHash responds with `"is_live": true` even though I sent `"live": false`. This might be part of the problem.

### 3. Payment Blocked Immediately
When clicking "Pay" button:
- User is presented with "Intent Closed" message
- No payment processing occurs
- No redirect happens

### 4. Webhook Confirmation
Expected webhook showing IP block (based on previous tests):

```json
{
  "type": "intent.closed",
  "data": {
    "intent": {
      "flow": "jZB0mLV",
      "status": "CLOSED"
    },
    "transaction": {
      "status": "BLOCKED",
      "rule": "Block_CARDS_IP_nonUAE_nonKSA"
    },
    "flow_data": {
      "sequence": {
        "alias_name": "non_KSA_Non_UAE_IP_not_permitted"
      }
    },
    "ip": {
      "country": {
        "iso_code": "IN",
        "name": "India"
      }
    }
  }
}
```

---

## What I Need

### 1. Remove IP Restriction from Sandbox Flow
**Flow ID: jZB0mLV**

Please remove the geographic IP restriction rule:
- Rule: `Block_CARDS_IP_nonUAE_nonKSA`
- Alias: `non_KSA_Non_UAE_IP_not_permitted`

For TESTING purposes, sandbox flows should NOT have geographic restrictions.

### 2. Verify Configuration
Why does the API return `"is_live": true` when I send `"live": false`? Is flow jZB0mLV configured incorrectly?

### 3. Confirm Redirect URL Support
Does flow jZB0mLV support redirect URLs? The payment never reaches the point of testing redirects due to the IP block.

---

## Business Impact

- **Blocking completion of LA08 technical assessment**
- **Cannot test payment integration from development location (India)**
- **Delaying project delivery**

This is for a **technical assessment/interview task** with an urgent deadline. I need to demonstrate:
1. Payment intent creation ✅ (Working)
2. Payment processing ❌ (Blocked by IP)
3. Redirect to success/failed pages ❌ (Cannot test due to #2)

---

## Request

Please **urgently remove ALL geographic IP restrictions** from sandbox flow **jZB0mLV** to allow testing from any location.

**Expected Resolution Time:** Within 24 hours (urgent assessment deadline)

---

## My Implementation Details

- **Integration Type:** Server-to-server + embedded payment form
- **API Version:** 1.4
- **Backend:** Node.js/Express
- **Frontend:** React/Vite
- **Testing From:** India (IP range: 122.182.x.x)

---

## Contact Information

[Your Name]
[Your Email]
[Your Phone - if applicable]

**Project:** LA08 Payment Integration Assessment
**Urgency:** HIGH - Assessment deadline approaching

---

Thank you for your immediate attention to this matter.

Best regards,
[Your Name]

---

## Attachments to Include:

1. **Server logs** showing correct payload sent
2. **Webhook JSON** showing IP block
3. **Screenshots** of "Intent Closed" error

