---
id: publish-twitter-post
name: Publish Twitter Post
version: 1.0.0
description: Publish eligible queued content to Twitter/X.
user_invocable: false
always: false
requires:
  bins: [bash, python3]
  env: [TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET, RUN_ID]
primary_env: TWITTER_API_KEY
input_path: /tmp/read-content-queue_${RUN_ID}.json
output_path: /tmp/publish-twitter-post_${RUN_ID}.json
depends_on: [read-content-queue]
---

## Purpose

Publish an eligible queued post to Twitter/X and capture the returned tweet ID and URL.

## I/O Contract

- **Input:** `/tmp/read-content-queue_${RUN_ID}.json`, with `eligible`, `content`, and `sheet_row_id`.
- **Output:** `/tmp/publish-twitter-post_${RUN_ID}.json`, with `status`, `tweet_id`, `tweet_url`, `published_at`, `sheet_row_id`, and metadata.
- **DB Write:** none. Result persistence is handled by the workflow after `update-content-queue` succeeds.

## Notes

The skill fails fast if Twitter/X does not return a success response. It does not support direct messages.
