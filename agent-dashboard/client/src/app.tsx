import { Activity as FALLBACK_ADDITION_ICON } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { identityCard } from "@/identity-card-data";
import Header from "@/layout/header";
import RightRail from "@/layout/right-rail";
import Sidebar from "@/layout/sidebar";
import TopTabs from "@/layout/top-tabs";
import { DEFAULT_SIDEBAR_ITEM, type SidebarItem, type SidebarItemId } from "@/lib/sidebar";
import { readActiveTab, writeActiveTab, type TabId } from "@/lib/tabs";
import { routes } from "@/routes.config";

/**
 * Root App for the agent-dashboard skeleton.
 *
 * Frame layout (platform-managed):
 *   - Left sidebar (80px): 8 standard platform items + optional
 *     agent-specific sidebar additions
 *   - Center column: identity-card header + top-tabs + active tab body
 *   - Right rail (80px): 4 standard operator tools (Rebuild / Terminal
 *     / Browser / Function), disabled in skeleton-only mode
 *
 * Custom content (agent-owned):
 *   - `routes.config.ts` declares the tabs the operator needs
 *   - Each `tabs/<id>.tsx` is React code the agent-dashboard-builder
 *     writes for the agent's domain
 *   - `identity-card-data.ts` carries the agent's static identity meta
 *
 * The skeleton intentionally does NOT impose widget palettes or layout
 * patterns inside tabs — agents compose whatever UI the operator needs
 * for their specific automation.
 */
export function App() {
  const [activeTab, setActiveTab] = useState<TabId>(readActiveTab);
  const [activeSidebar, setActiveSidebar] = useState<SidebarItemId>(DEFAULT_SIDEBAR_ITEM);

  useEffect(() => {
    const onHashChange = (): void => setActiveTab(readActiveTab());
    globalThis.addEventListener("hashchange", onHashChange);
    return () => globalThis.removeEventListener("hashchange", onHashChange);
  }, []);

  const onSelectTab = (id: TabId): void => {
    writeActiveTab(id);
    setActiveTab(id);
  };

  // Sidebar additions are platform extras the agent declares.
  // The actual list lives in identity-card-data.ts when the agent uses
  // additions; an empty array here means "no additions, just the standard 8".
  const additions = useMemo<SidebarItem[]>(() => [], []);

  const ActiveTabComponent = useMemo(() => {
    const route = routes.find((r) => r.id === activeTab) ?? routes[0];
    return route?.Component ?? null;
  }, [activeTab]);

  // Top tabs are OPTIONAL — only render the tab strip when the agent
  // has more than one route. Single-tab dashboards skip the tab bar
  // entirely; the sidebar handles primary navigation in that case.
  const showTopTabs = routes.length > 1;

  return (
    <>
      <Sidebar active={activeSidebar} additions={additions} onSelect={setActiveSidebar} />
      <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <Header identity={identityCard} />
        {showTopTabs && <TopTabs active={activeTab} onSelect={onSelectTab} />}
        <main style={{ flex: 1, overflow: "auto" }}>
          {activeSidebar === DEFAULT_SIDEBAR_ITEM ? (
            ActiveTabComponent ? <ActiveTabComponent /> : null
          ) : (
            <NonDashboardSection sectionId={activeSidebar} />
          )}
        </main>
      </div>
      <RightRail
        disabledTools={["rebuild", "terminal", "browser", "function"]}
        onSelect={(tool) => console.info(`[agent-dashboard] right-rail tool clicked: ${tool}`)}
      />
    </>
  );
}

function NonDashboardSection({ sectionId }: { sectionId: SidebarItemId }) {
  // Pretty label: kebab-case → Title Case
  const pretty = sectionId
    .split(/[-_\s]+/)
    .map((p) => (p.length > 0 ? p.charAt(0).toUpperCase() + p.slice(1) : p))
    .join(" ");
  return (
    <section
      aria-label={`${sectionId} section`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: "2rem",
        color: "var(--muted-foreground)",
        textAlign: "center",
        gap: "0.5rem"
      }}
    >
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "var(--foreground)" }}>
        {pretty}
      </h2>
      <p style={{ margin: 0, fontSize: 13 }}>
        Open this section from the main navigation.
      </p>
    </section>
  );
}

// Unused fallback icon reserved for the additions feature when the agent
// declares sidebar items without an icon.
void FALLBACK_ADDITION_ICON;

export default App;
