import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@ruh-ai/ruh-design-system";
import { AlertTriangle, CheckCircle2, FileSpreadsheet, Megaphone, ShieldCheck, XCircle } from "lucide-react";

// Stub data — replaced by real fetch when the analytics gateway lands.
// Mirrors `result_published_tweets` records produced after recent Google Sheets row events.
const stubPublishedTweets = [
  {
    id: "7f31b2aa-9c17-4f2a-a2a7-95a5f22a4c10",
    run_id: "run_20260518_0914",
    computed_at: "2026-05-18T09:15:02Z",
    sheet_row_id: "Queue!A42",
    tweet_id: "1791816642084413841",
    tweet_url: "https://x.com/founder/status/1791816642084413841",
    published_at: "2026-05-18T09:14:47Z",
    status: "published",
    metadata: { voice: "clear founder lesson", length: 214 }
  },
  {
    id: "22e7df95-d4dc-427f-bf50-289cb912ade1",
    run_id: "run_20260517_1731",
    computed_at: "2026-05-17T17:32:21Z",
    sheet_row_id: "Queue!A41",
    tweet_id: "1791582014148884488",
    tweet_url: "https://x.com/founder/status/1791582014148884488",
    published_at: "2026-05-17T17:31:54Z",
    status: "published",
    metadata: { voice: "practical build note", length: 188 }
  },
  {
    id: "a8406f85-325f-4d89-98f1-512bb44b403d",
    run_id: "run_20260517_1206",
    computed_at: "2026-05-17T12:06:39Z",
    sheet_row_id: "Queue!A40",
    tweet_id: "",
    tweet_url: "",
    published_at: "",
    status: "failed_twitter_rate_limit",
    metadata: { failed_step: "Twitter/X publish", retryable: true }
  },
  {
    id: "d56dd0ad-68a1-4f91-a7a3-e0816b9b7c82",
    run_id: "run_20260516_1600",
    computed_at: "2026-05-16T16:01:11Z",
    sheet_row_id: "Queue!A39",
    tweet_id: "1791204201029849302",
    tweet_url: "https://x.com/founder/status/1791204201029849302",
    published_at: "2026-05-16T16:00:42Z",
    status: "published",
    metadata: { voice: "short launch update", length: 143 }
  }
];

// Stub data — replaced by real fetch when the analytics gateway lands.
// Represents the source Google Sheets queue columns the agent reads before publishing.
const stubQueueRows = [
  { row: "Queue!A43", content: "A tiny launch checklist beats a giant strategy doc when momentum is the bottleneck.", status: "eligible", voice: "concise founder advice" },
  { row: "Queue!A44", content: "The best automation is boring: clear trigger, one job, visible result, easy rollback.", status: "queued", voice: "practical systems" },
  { row: "Queue!A45", content: "If a workflow cannot tell you where it failed, it is not ready to run unattended.", status: "queued", voice: "calm operations" },
  { row: "Queue!A40", content: "Reminder to leave retry room for API limits before declaring a launch broken.", status: "failed", voice: "transparent lesson" }
];

const stubHealth = [
  { name: "Google Sheets", state: "connected", detail: "Service account can read queue and update tweet metadata" },
  { name: "Twitter/X API", state: "connected", detail: "Publish credentials active; last rate-limit warning on Queue!A40" },
  { name: "Direct messages", state: "not supported", detail: "This agent only publishes public Twitter/X posts" }
];

const publishedCount = stubPublishedTweets.filter((tweet) => tweet.status === "published").length;
const failedCount = stubPublishedTweets.length - publishedCount;
const eligibleCount = stubQueueRows.filter((row) => row.status === "eligible" || row.status === "queued").length;
const successRate = Math.round((publishedCount / stubPublishedTweets.length) * 100);

function StatusBadge({ status }: { status: string }) {
  const isGood = status === "published" || status === "connected";
  const isWarning = status.includes("failed") || status === "eligible";
  return <Badge variant={isGood ? "success" : isWarning ? "warning" : "secondary"}>{status.replaceAll("_", " ")}</Badge>;
}

export function OverviewTab() {
  return (
    <section className="grid gap-5 p-6 xl:grid-cols-[1.35fr_0.65fr]">
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-4">
          <Card size="sm">
            <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm"><FileSpreadsheet size={16} /> Queue ready</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold">{eligibleCount}</p><p className="text-xs text-muted-foreground">eligible or queued rows</p></CardContent>
          </Card>
          <Card size="sm">
            <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm"><Megaphone size={16} /> Published</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold">{publishedCount}</p><p className="text-xs text-muted-foreground">tweet URLs written back</p></CardContent>
          </Card>
          <Card size="sm">
            <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm"><XCircle size={16} /> Failed</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold">{failedCount}</p><p className="text-xs text-muted-foreground">visible workflow failures</p></CardContent>
          </Card>
          <Card size="sm">
            <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm"><ShieldCheck size={16} /> Success</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold">{successRate}%</p><Progress value={successRate} className="mt-3" /></CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Google Sheets content queue</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Sheet row</TableHead><TableHead>Queued post</TableHead><TableHead>Brand voice</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>{stubQueueRows.map((row) => (<TableRow key={row.row}><TableCell className="whitespace-nowrap font-medium">{row.row}</TableCell><TableCell className="max-w-[520px]">{row.content}</TableCell><TableCell>{row.voice}</TableCell><TableCell><StatusBadge status={row.status} /></TableCell></TableRow>))}</TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Twitter/X publication results</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Sheet row</TableHead><TableHead>Tweet ID</TableHead><TableHead>Tweet URL</TableHead><TableHead>Published</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>{stubPublishedTweets.map((tweet) => (<TableRow key={tweet.id}><TableCell className="font-medium">{tweet.sheet_row_id}</TableCell><TableCell className="whitespace-nowrap">{tweet.tweet_id || "not returned"}</TableCell><TableCell className="max-w-[300px] truncate">{tweet.tweet_url || "not written"}</TableCell><TableCell className="whitespace-nowrap">{tweet.published_at ? new Date(tweet.published_at).toLocaleString() : "not published"}</TableCell><TableCell><StatusBadge status={tweet.status} /></TableCell></TableRow>))}</TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-5">
        <Card>
          <CardHeader><CardTitle>Connector health</CardTitle></CardHeader>
          <CardContent className="space-y-4">{stubHealth.map((item) => (<div key={item.name} className="space-y-2"><div className="flex items-center justify-between gap-3"><span className="font-medium">{item.name}</span><StatusBadge status={item.state} /></div><p className="text-sm text-muted-foreground">{item.detail}</p><Separator /></div>))}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Workflow activity</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="flex gap-2"><CheckCircle2 className="mt-0.5 text-green-500" size={16} /> Queue!A42 was read, published, and updated with tweet metadata.</p>
            <p className="flex gap-2"><CheckCircle2 className="mt-0.5 text-green-500" size={16} /> Queue!A41 completed without duplicate posting.</p>
            <p className="flex gap-2"><AlertTriangle className="mt-0.5 text-yellow-500" size={16} /> Queue!A40 failed at Twitter/X publish; the sheet row was not marked complete.</p>
            <p className="rounded-lg border border-border bg-muted/30 p-3 text-muted-foreground">No direct-message automation is available in this agent; only public post publishing is monitored here.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default OverviewTab;
