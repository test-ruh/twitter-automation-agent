import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BookOpen,
  Boxes,
  Key,
  MessageSquare,
  Network,
  Sparkles,
  Store
} from "lucide-react";

/**
 * The eight standard left-sidebar sections.
 *
 * Every agent's dashboard ships with these eight items in this order, with
 * the agent-dashboard ("Mission Control") section active by default. Per
 * AB-370 / the wireframe, additional agent-specific items can be appended
 * to this base set via `spec.sidebarAdditions` — but the standard eight are
 * always present.
 */

export type SidebarItemId =
  | "mission-control"
  | "session"
  | "skills"
  | "agents"
  | "workflow"
  | "knowledge"
  | "api-keys"
  | "marketplace";

export type SidebarItem = {
  id: SidebarItemId;
  label: string;
  icon: LucideIcon;
  /** Hover description surfaced on the icon-only sidebar. */
  hint: string;
};

export const STANDARD_SIDEBAR_ITEMS: readonly SidebarItem[] = [
  {
    id: "mission-control",
    label: "Mission Control",
    icon: Activity,
    hint: "The agent's dashboard — KPIs, runs, and triggers."
  },
  {
    id: "session",
    label: "Session",
    icon: MessageSquare,
    hint: "Live chat session with the agent."
  },
  {
    id: "skills",
    label: "Skills",
    icon: Sparkles,
    hint: "The agent's runtime skills (read-only view)."
  },
  {
    id: "agents",
    label: "Agents",
    icon: Boxes,
    hint: "Other agents in this workspace."
  },
  {
    id: "workflow",
    label: "Workflow",
    icon: Network,
    hint: "Workflow graph for this agent's main pipeline."
  },
  {
    id: "knowledge",
    label: "Knowledge",
    icon: BookOpen,
    hint: "Agent soul, identity, and reference docs."
  },
  {
    id: "api-keys",
    label: "API Keys",
    icon: Key,
    hint: "Required env vars and how to obtain them."
  },
  {
    id: "marketplace",
    label: "Marketplace",
    icon: Store,
    hint: "Public agent listings."
  }
] as const;

export const DEFAULT_SIDEBAR_ITEM: SidebarItemId = "mission-control";
