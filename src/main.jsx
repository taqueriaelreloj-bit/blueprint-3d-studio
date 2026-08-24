import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

class StartupBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Blueprint 3D Studio render failed", error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;
    const error = this.state.error;
    return (
      <div style={{ minHeight: "100vh", background: "#0f172a", color: "#e2e8f0", padding: 32, fontFamily: "system-ui, sans-serif" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", background: "#111827", border: "1px solid #334155", borderRadius: 16, padding: 24 }}>
          <h1 style={{ marginTop: 0 }}>Blueprint 3D Studio — render error</h1>
          <p>The application module loaded, but React hit an error while rendering.</p>
          <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", background: "#020617", padding: 16, borderRadius: 10, border: "1px solid #334155" }}>
            {error?.stack || error?.message || String(error)}
          </pre>
        </div>
      </div>
    );
  }
}

root.render(
  <React.StrictMode>
    <StartupBoundary>
      <App />
    </StartupBoundary>
  </React.StrictMode>
);
