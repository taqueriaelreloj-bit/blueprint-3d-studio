import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

function StartupError({ error, details = "" }) {
  const message = error?.message || String(error || "Unknown startup error");
  const stack = error?.stack || "";
  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#e2e8f0", padding: 32, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", background: "#111827", border: "1px solid #334155", borderRadius: 16, padding: 24 }}>
        <h1 style={{ marginTop: 0 }}>Blueprint 3D Studio — startup error</h1>
        <p>The application could not finish loading. The exact Vite transform error is shown below.</p>
        <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", background: "#020617", padding: 16, borderRadius: 10, border: "1px solid #334155", maxHeight: "65vh", overflow: "auto" }}>{message}{stack ? `\n\n${stack}` : ""}{details ? `\n\n--- VITE RESPONSE ---\n${details}` : ""}</pre>
        <p style={{ opacity: 0.8 }}>Send a screenshot of the first error lines shown above.</p>
      </div>
    </div>
  );
}

async function renderDetailedError(error) {
  let details = "";
  try {
    const response = await fetch(`/src/App.jsx?diagnostic=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) {
      details = await response.text();
      details = details.replace(/<[^>]+>/g, " ").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
      details = details.slice(0, 12000);
    } else {
      details = `App.jsx returned HTTP ${response.status}, but dynamic import still failed.`;
    }
  } catch (diagnosticError) {
    details = `Could not fetch Vite diagnostic response: ${diagnosticError?.message || diagnosticError}`;
  }
  root.render(<StartupError error={error} details={details} />);
}

window.addEventListener("error", (event) => {
  if (event?.error) renderDetailedError(event.error);
});
window.addEventListener("unhandledrejection", (event) => {
  renderDetailedError(event.reason);
});

root.render(
  <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "system-ui, sans-serif" }}>
    Loading Blueprint 3D Studio…
  </div>
);

import("./App.jsx")
  .then(({ default: App }) => {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  })
  .catch((error) => {
    console.error("Blueprint 3D Studio startup failed", error);
    renderDetailedError(error);
  });
