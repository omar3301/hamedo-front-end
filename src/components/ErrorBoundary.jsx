import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", minHeight: "60vh", gap: "16px",
          fontFamily: "sans-serif", color: "#333", padding: "24px",
          textAlign: "center",
        }}>
          <span style={{ fontSize: "48px" }}>⚠️</span>
          <h2 style={{ margin: 0, fontSize: "20px" }}>Something went wrong</h2>
          <p style={{ margin: 0, color: "#666", maxWidth: "400px" }}>
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: "10px 24px", background: "#1a1a1a", color: "#fff",
              border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px",
            }}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
