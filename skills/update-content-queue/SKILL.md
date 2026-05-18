---
id: update-content-queue
name: Update Content Queue
version: 1.0.0
description: Write published tweet metadata back to Google Sheets.
user_invocable: false
always: false
requires:
  bins: [bash, python3, openssl]
  env: [GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY, RUN_ID]
primary_env: GOOGLE_SHEETS_CLIENT_EMAIL
input_path: /tmp/publish-twitter-post_${RUN_ID}.json
output_path: /tmp/update-content-queue_${RUN_ID}.json
depends_on: [publish-twitter-post]
---

## Purpose

Update the source Google Sheets row with the published tweet ID, tweet URL, and published status so the row is not published again.

## I/O Contract

- **Input:** `/tmp/publish-twitter-post_${RUN_ID}.json`, with `sheet_row_id`, `tweet_id`, `tweet_url`, `published_at`, `status`, and Google Sheets row metadata.
- **Output:** `/tmp/update-content-queue_${RUN_ID}.json`, with the update status and Google Sheets API response.
- **DB Write:** none.

## Notes

The workflow should only be marked complete after this Google Sheets update succeeds. No direct message behavior is included.
