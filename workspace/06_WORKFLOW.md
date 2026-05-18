# Workflow — End-to-End Process Flow

Executed by the [Lobster runtime](https://github.com/openclaw/lobster) via `lobster run workflows/main.yaml`.
Steps run **sequentially** in the order shown below.

## Workflow Steps

1. **provision-schema** → `run: python3 scripts/data_writer.py provision` (timeout_ms=30000)
2. **read-content-queue** → skill `read-content-queue` (stdin=${{ trigger.payload }}, timeout_ms=600000)
3. **publish-twitter-post** → skill `publish-twitter-post` (stdin=${{ steps.read-content-queue.output }}, timeout_ms=600000)
4. **update-content-queue** → skill `update-content-queue` (stdin=${{ steps.publish-twitter-post.output }}, timeout_ms=600000)
5. **persist-result** → `run: python3 scripts/data_writer.py --table result_published_tweets --conflict sheet_row_id < /tmp/publish-twitter-post_${RUN_ID}.json` (timeout_ms=600000)

## Diagram

```
provision-schema → read-content-queue → publish-twitter-post → update-content-queue → persist-result
```
