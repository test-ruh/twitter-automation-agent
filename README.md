# 📣 Twitter Automation Agent

A simple Twitter/X automation agent that reads a Google Sheets content queue, publishes eligible posts, and records tweet URLs and IDs back to the sheet.

## Quick Start

```bash
git clone git@github.com:${GITHUB_OWNER}/twitter-automation-agent.git
cd twitter-automation-agent

# 1. Configure
cp .env.example .env
# Edit .env with your credentials (see "Required Environment Variables" below)

# 2. One-shot setup: validates env, installs deps, provisions DB, registers cron
chmod +x setup.sh
./setup.sh
```

## Manual Setup (if you prefer step-by-step)

```bash
cp .env.example .env             # then edit it
set -a; source .env; set +a       # load vars into the current shell
bash check-environment.sh         # verify everything required is set
bash install-dependencies.sh      # pip install psycopg2-binary, pyyaml
python3 scripts/data_writer.py provision   # create tables in your schema
openclaw cron add --file cron/google-sheets-row-event.json
```

## Running

```bash
bash test-workflow.sh             # run every skill in order locally (smoke test)
openclaw cron run --name google-sheets-row-event    # trigger manually
openclaw cron list                # see registered jobs
openclaw cron runs                # see run history
```

## Required Environment Variables

| Variable | Description |
|----------|-------------|
| `GOOGLE_SHEETS_CLIENT_EMAIL` | Google Sheets client email |
| `GOOGLE_SHEETS_PRIVATE_KEY` | Google Sheets private key |
| `TWITTER_API_KEY` | Twitter/X API key |
| `TWITTER_API_SECRET` | Twitter/X API secret |
| `TWITTER_ACCESS_TOKEN` | Twitter/X access token |
| `TWITTER_ACCESS_TOKEN_SECRET` | Twitter/X access token secret |
| `TWITTER_API_KEY` | Twitter/X publishing API key |
| `TWITTER_API_SECRET` | Twitter/X publishing API secret |
| `TWITTER_ACCESS_TOKEN` | Twitter/X publishing access token |
| `TWITTER_ACCESS_TOKEN_SECRET` | Twitter/X publishing access token secret |

## Skills

| Skill | Mode | Description |
|-------|------|-------------|
| `data-writer` | Auto | Provision, write, and query the agent database schema via scripts/data_writer.py. Use for all PostgreSQL operations and any result-table persistence. |
| `github-action` | User-invocable | Git branch + PR workflow for syncing agent changes to GitHub. Creates feature branches, commits changes, and opens pull requests against main. NEVER pushes to main directly. MANDATORY for every agent. |
| `read-content-queue` | Auto | Read an eligible Twitter/X post row from Google Sheets. |
| `publish-twitter-post` | Auto | Publish eligible queued content to Twitter/X. |
| `update-content-queue` | Auto | Write published tweet metadata back to Google Sheets. |

## Scheduled Jobs

| Job Name | Schedule | Notes |
|----------|----------|-------|
| `google-sheets-row-event` | `` | Timezone: UTC |


## Architecture

- **Runtime**: OpenClaw AI agent framework
- **Data Layer**: PostgreSQL via `scripts/data_writer.py`
- **Scheduling**: OpenClaw cron
- **Schema**: `org_{org_id}_a_twitter_automation_agent`

## Directory Structure

```
twitter-automation-agent/
├── README.md
├── openclaw.json
├── result-schema.yml
├── env-manifest.yml
├── .env.example
├── requirements.txt
├── .gitignore
├── check-environment.sh
├── install-dependencies.sh
├── test-workflow.sh
├── cron/
├── workflows/
├── scripts/
│   ├── data_writer.py
│   └── github_action.py
├── skills/
└── workspace/
    ├── SOUL.md
    ├── 01_IDENTITY.md
    ├── 02_RULES.md
    ├── 03_SKILLS.md
    ├── 04_TRIGGERS.md
    ├── 05_ACCESS.md
    ├── 06_WORKFLOW.md
    └── 07_REVIEW.md
```
