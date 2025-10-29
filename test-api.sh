#!/bin/bash

# Test script to verify the API request format

echo "Testing Payment Intent API..."
echo ""

# Test if backend is running
echo "1. Checking if backend is running on port 8080..."
if curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo "   ✅ Backend is responding"
else
    echo "   ❌ Backend is NOT running on port 8080"
    echo "   Please start your backend server first"
    exit 1
fi

echo ""
echo "2. Sending test payment intent request..."
echo ""

# Send test request
RESPONSE=$(curl -s -X POST http://localhost:8080/api/payments/intent \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1,
    "tag": "card_success",
    "success_url": "http://localhost:3000/success",
    "failed_url": "http://localhost:3000/failed",
    "closed_url": "http://localhost:3000/closed"
  }' \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
BODY=$(echo "$RESPONSE" | grep -v "HTTP_STATUS")

echo "Response Status: $HTTP_STATUS"
echo "Response Body:"
echo "$BODY" | jq . 2>/dev/null || echo "$BODY"

echo ""
if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ API request successful"
    
    # Check if embed_url exists
    if echo "$BODY" | grep -q "embed_url"; then
        echo "✅ Response contains embed_url"
        EMBED_URL=$(echo "$BODY" | jq -r '.embed_url' 2>/dev/null)
        echo "   Redirect URL: $EMBED_URL"
    else
        echo "❌ Response missing embed_url field"
        echo "   Backend needs to return { embed_url: '...' }"
    fi
else
    echo "❌ API request failed with status $HTTP_STATUS"
    echo "   Check backend logs for errors"
fi
