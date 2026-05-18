---
id: read-content-queue
name: Read Content Queue
version: 1.0.0
description: Read an eligible Twitter/X post row from Google Sheets.
user_invocable: false
always: false
requires:
  bins: [bash, python3, openssl]
  env: [GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY, RUN_ID]
primary_env: GOOGLE_SHEETS_CLIENT_EMAIL
input_path: /dev/stdin
output_path: /tmp/read-content-queue_${RUN_ID}.json
depends_on: []
---

## Purpose

Read a Google Sheets queue row, confirm it is ready to publish, and return the post text with the source row identifier. Rows that are already published are not returned as eligible.

## I/O Contract

- **Input:** `/dev/stdin` or `INPUT_FILE`, with a trigger payload containing row data or Google Sheets details such as `spreadsheet_id`, `range`, `row_number`, `content`, and `status`.
- **Output:** `/tmp/read-content-queue_${RUN_ID}.json`, with `eligible`, `sheet_row_id`, `content`, `status`, and source Google Sheets metadata.
- **DB Write:** none.

## Notes

No direct message behavior is included. This skill only reads queue content for Twitter/X publishing.
