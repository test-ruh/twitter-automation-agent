#!/usr/bin/env bash
# Check required environment variables are set.
set -euo pipefail

missing=0
if [ -z "${GOOGLE_SHEETS_CLIENT_EMAIL:-}" ]; then echo "MISSING: GOOGLE_SHEETS_CLIENT_EMAIL"; missing=$((missing+1)); fi
if [ -z "${GOOGLE_SHEETS_PRIVATE_KEY:-}" ]; then echo "MISSING: GOOGLE_SHEETS_PRIVATE_KEY"; missing=$((missing+1)); fi
if [ -z "${TWITTER_API_KEY:-}" ]; then echo "MISSING: TWITTER_API_KEY"; missing=$((missing+1)); fi
if [ -z "${TWITTER_API_SECRET:-}" ]; then echo "MISSING: TWITTER_API_SECRET"; missing=$((missing+1)); fi
if [ -z "${TWITTER_ACCESS_TOKEN:-}" ]; then echo "MISSING: TWITTER_ACCESS_TOKEN"; missing=$((missing+1)); fi
if [ -z "${TWITTER_ACCESS_TOKEN_SECRET:-}" ]; then echo "MISSING: TWITTER_ACCESS_TOKEN_SECRET"; missing=$((missing+1)); fi
if [ -z "${TWITTER_API_KEY:-}" ]; then echo "MISSING: TWITTER_API_KEY"; missing=$((missing+1)); fi
if [ -z "${TWITTER_API_SECRET:-}" ]; then echo "MISSING: TWITTER_API_SECRET"; missing=$((missing+1)); fi
if [ -z "${TWITTER_ACCESS_TOKEN:-}" ]; then echo "MISSING: TWITTER_ACCESS_TOKEN"; missing=$((missing+1)); fi
if [ -z "${TWITTER_ACCESS_TOKEN_SECRET:-}" ]; then echo "MISSING: TWITTER_ACCESS_TOKEN_SECRET"; missing=$((missing+1)); fi

if [ $missing -gt 0 ]; then
    echo "$missing required env var(s) missing"
    exit 1
fi
echo "OK: all required env vars set"
