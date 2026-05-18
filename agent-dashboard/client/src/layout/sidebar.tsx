import { Button, Tooltip, TooltipContent, TooltipTrigger, Separator } from "@ruh-ai/ruh-design-system";
import { useMemo } from "react";

import {
  STANDARD_SIDEBAR_ITEMS,
  type SidebarItem,
  type SidebarItemId
} from "@/lib/sidebar";

type SidebarProps = {
  active: SidebarItemId;
  /** Extra sidebar items appended after the standard eight, via `spec.sidebarAdditions`. */
  additions?: ReadonlyArray<SidebarItem>;
  onSelect: (id: SidebarItemId) => void;
};

/**
 * Icon-only left sidebar (80px wide).
 *
 * Renders the eight standard sections (Mission Control / Session / Skills /
 * Agents / Workflow / Knowledge / API keys / Marketplace) plus optional
 * agent-specific additions appended underneath a separator.
 *
 * Built on `@ruh-ai/ruh-design-system` `Button` (variant="ghost" /
 * size="icon") + `Tooltip` so hover state, focus ring, and the hint
 * tooltip match the rest of the platform. The active item uses
 * variant="secondary" to read as a selected pill.
 *
 * Per AB-370 / the wireframe, the agent's display label is intentionally
 * NOT shown in the sidebar — the label belongs on the identity card in
 * the header.
 */
export function Sidebar({ active, additions = [], onSelect }: SidebarProps) {
  const items = useMemo(() => [...STANDARD_SIDEBAR_ITEMS, ...additions], [additions]);

  return (
    <nav
      aria-label="Agent dashboard primary navigation"
      className="flex flex-col items-center gap-2 border-r bg-card py-4"
    >
      {items.map((item, index) => {
        const Icon = item.icon;
        const isActive = item.id === active;
        const isFirstAddition = index === STANDARD_SIDEBAR_ITEMS.length;
        return (
          <div key={item.id} className="contents">
            {isFirstAddition && <Separator className="my-1 w-10" />}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="icon"
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => onSelect(item.id)}
                >
                  <Icon size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{item.hint ?? item.label}</TooltipContent>
            </Tooltip>
          </div>
        );
      })}
    </nav>
  );
}

export default Sidebar;
