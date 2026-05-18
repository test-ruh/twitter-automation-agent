import { ThemeProvider, TooltipProvider } from "@ruh-ai/ruh-design-system";
import React from "react";
import { createRoot } from "react-dom/client";

import App from "@/app";
import "@/styles.css";

/**
 * Entry point for the agent-dashboard skeleton.
 *
 * Composes the wireframe-aligned shell (sidebar | center | right rail) via
 * `<App />`. The shell is shared by every agent's dashboard; only the
 * content inside each tab varies per agent.
 *
 * Wraps the app in two Ruh DS providers:
 *   - `ThemeProvider`: surfaces the platform's dark/light state and
 *     applies the matching theme tokens to the DOM.
 *   - `TooltipProvider`: pre-positions every DS Tooltip so the
 *     sidebar / top-tabs / right-rail hover hints render without
 *     having to wrap each one individually.
 */

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Agent Dashboard root element not found");
}

createRoot(rootEl).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider delayDuration={200}>
        <App />
      </TooltipProvider>
    </ThemeProvider>
  </React.StrictMode>
);
