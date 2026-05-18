# Review — Final Summary Before Save

## Agent Card

| Field              | Value                          |
|--------------------|--------------------------------|
| **Name**           | 📣 Twitter Automation Agent |
| **ID**             | `twitter-automation-agent`           |
| **Version**        | 1.0.0 |
| **Scope**          | A simple Twitter/X automation agent that reads a Google Sheets content queue, publishes eligible posts, and records tweet URLs and IDs back to the sheet.      |
| **Tone**           | Clear, concise, and action-oriented.             |
| **Model**          | gpt-4.1-mini (primary), gpt-4.1 (fallback) |
| **Token Budget**   | 500000 tokens/month |

## Skills Summary

| Skill                     | Mode         |
|---------------------------|--------------|
| Data Writer | 🟢 Auto |
| Result Query | 🟢 Auto |
| GitHub Action | 🟢 Auto |
| Read Content Queue | 🟢 Auto |
| Publish Twitter Post | 🟢 Auto |
| Update Content Queue | 🟢 Auto |

## Post-Save Checklist

- [ ] Add Google Sheets service account credentials.
- [ ] Share the content queue sheet with the service account email.
- [ ] Add Twitter/X API credentials with posting permissions.
- [ ] Send a test eligible row payload.
- [ ] Confirm the tweet URL and ID are written back to Google Sheets.
- [ ] Confirm a result appears in result_published_tweets.
