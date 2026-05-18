# Step 3 of 5 — Skills

## Added Skills

| #    | Skill ID                  | Skill Name               | Mode   | Risk Level | Description                |
|------|---------------------------|--------------------------|--------|------------|----------------------------|
| S1   | `data-writer` | Data Writer | Auto | Low | Provision, write, and query the agent database schema via scripts/data_writer.py. Use for all PostgreSQL operations and any result-table persistence. |
| S2   | `github-action` | GitHub Action | Auto | Low | Git branch + PR workflow for syncing agent changes to GitHub. Creates feature branches, commits changes, and opens pull requests against main. NEVER pushes to main directly. MANDATORY for every agent. |
| S3   | `read-content-queue` | Read Content Queue | Auto | Low | Read an eligible Twitter/X post row from Google Sheets. |
| S4   | `publish-twitter-post` | Publish Twitter Post | Auto | Low | Publish eligible queued content to Twitter/X. |
| S5   | `update-content-queue` | Update Content Queue | Auto | Low | Write published tweet metadata back to Google Sheets. |

## Skill Dependencies (Execution Order)

```
data-writer
github-action
read-content-queue
publish-twitter-post ← depends on read-content-queue
update-content-queue ← depends on publish-twitter-post
```

## Execution Mode Summary

| Mode  | Count          |
|-------|----------------|
| HiTL  | 0              |
| Auto  | 5 |
