# Twitter Automation Agent Dashboard — Design

## Agent

- **ID:** `twitter-automation-agent`
- **Name:** Twitter Automation Agent
- **Description:** Event-driven automation for solo creators and founders that reads eligible Twitter/X posts from a Google Sheets content queue, publishes them publicly to Twitter/X, and writes tweet IDs, tweet URLs, timestamps, and statuses back to the sheet.

## Tabs

### Overview

The dashboard uses a single focused Overview tab because the PRD calls for a simple monitoring surface rather than separate operator workspaces. It shows queue health, successful publications, failed workflows, and the recent success rate at the top so the operator can immediately tell whether the sheet-to-Twitter/X loop is healthy. The Google Sheets content queue table displays queued post content, row status, and brand-voice notes. The publication results table mirrors the `result_published_tweets` schema with `sheet_row_id`, `tweet_id`, `tweet_url`, `published_at`, `status`, and metadata-oriented context. A right-hand column summarizes connector health for Google Sheets and Twitter/X API credentials, includes the no-direct-message constraint, and lists workflow activity for row detection, publish attempts, successful updates, and failures that should not mark a row complete.

## Triggers

- New eligible Google Sheets row event: reads the row, confirms eligibility, publishes the queued content to Twitter/X, captures the returned tweet ID and URL, and updates the source Google Sheets row with publication metadata.

## Sidebar Additions

None. The PRD only requires dashboard monitoring, and the single Overview surface covers queue status, publication results, connector health, workflow activity, and failure visibility.

## v2 Deferrals

No v2-tagged Custom Features were present in the PRD.
