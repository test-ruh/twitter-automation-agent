# Step 5 of 5 — Access

## User Access

### Authorized Teams

| Team               | Access Level | Members (approx) |
|--------------------|-------------|-------------------|
| Solo creator/founder | Owner | The workspace owner who manages the Google Sheets queue and Twitter/X posting account. |

### Restricted From

| Team / Role          | Reason                          |
|----------------------|---------------------------------|
| Unauthenticated users | They must not publish posts or access Google Sheets queue data. |
| Direct-message workflows | Direct messages are outside this agent's approved scope. |

## HiTL Approvers

| Skill                | Action                         | Approver             | Fallback Approver    |
|----------------------|--------------------------------|----------------------|----------------------|
| publish-twitter-post | Automatic publishing of eligible queued content | Workspace owner | Stop the workflow if credentials or row eligibility cannot be confirmed. |

## Model Configuration

| Field                | Value                          |
|----------------------|--------------------------------|
| **Primary Model**    | gpt-4.1-mini   |
| **Fallback Model**   | gpt-4.1  |

## Token Budget

| Field                  | Value                  |
|------------------------|------------------------|
| **Monthly Budget**     | 500000 tokens |
| **Alert Threshold**    | 400000 tokens |
| **Auto-Pause on Limit**| Yes |

## Security & Permissions

| Permission                         | Allowed    |
|------------------------------------|------------|
| Read Google Sheets queue rows | ✅ |
| Update Google Sheets queue rows | ✅ |
| Publish posts to Twitter/X | ✅ |
| Send Twitter/X direct messages | ❌ |
| Read RSS or blog feeds | ❌ |
| Write dashboard result records | ✅ |
