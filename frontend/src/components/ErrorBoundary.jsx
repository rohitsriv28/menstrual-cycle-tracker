import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center mt-10">
          <h2 className="text-2xl font-bold">Something went Wwrong</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
