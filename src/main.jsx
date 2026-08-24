import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

function StartupError({ error }) {
  const message = error?.message || String(error || "Unknown startup error");
  const stack = error?.stack || "";
  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#e2e8f0", padding: 32, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", background: "#111827", border: "1px solid #334155", borderRadius: 16, padding: 24 }}>
        <h1 style={{ marginTop: 0 }}>Blueprint 3D Studio — startup error</h1>
        <p>The application could not finish loading. The exact error is shown below so it can be fixed instead of leaving a blank white screen.</p>
        <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", background: "#020617", padding: 16, borderRadius: 10, border: "1px solid #334155" }}>{message}{stack ? `\n\n${stack}` : ""}</pre>
        <p style={{ opacity: 0.8 }}>Keep this page open and send a screenshot of this message.</p>
      </div>
    </div>
  );
}

window.addEventListener("error", (event) => {
  if (event?.error) root.render(<StartupError error={event.error} />);
});
window.addEventListener("unhandledrejection", (event) => {
  root.render(<StartupError error={event.reason} />);
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
    root.render(<StartupError error={error} />);
  });
