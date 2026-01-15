import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary to catch and display React errors gracefully
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "2rem",
            textAlign: "center",
            background: "#0f172a",
            color: "#f1f5f9",
          }}
        >
          <h1
            style={{ fontSize: "2rem", marginBottom: "1rem", color: "#ef4444" }}
          >
            Oops! Something went wrong
          </h1>
          <p
            style={{
              fontSize: "1.125rem",
              marginBottom: "2rem",
              color: "#94a3b8",
            }}
          >
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <button
            onClick={this.handleReload}
            style={{
              padding: "0.75rem 2rem",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              border: "none",
              borderRadius: "0.5rem",
              color: "white",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
