import { LayoutDashboard, type LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

import OverviewTab from "@/tabs/overview";

export type DashboardRoute = {
  id: string;
  label: string;
  icon?: LucideIcon;
  Component: ComponentType;
  hint?: string;
};

export const routes: DashboardRoute[] = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    Component: OverviewTab,
    hint: "Twitter/X queue, publication results, connector health, and failures"
  }
];

export const defaultRouteId = "overview";
