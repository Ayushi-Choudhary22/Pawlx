import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Surface the real error in the console so it's actually diagnosable,
    // instead of the app just silently going blank.
    console.error('PAWLX crashed:', error, errorInfo);
  }

  handleReset = () => {
    // Clear potentially-corrupted client state and reload fresh, rather than
    // leaving the person stuck on a dead page with no way forward.
    localStorage.removeItem('pawlx_token');
    localStorage.removeItem('pawlx_user');
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface px-4">
          <div className="max-w-md text-center">
            <h1 className="text-xl font-bold text-ink mb-2">Something went wrong</h1>
            <p className="text-sm text-ink-muted mb-1">
              PAWLX hit an unexpected error and couldn't continue rendering this page.
            </p>
            <p className="text-xs text-ink-muted mb-6 font-mono bg-white border border-border rounded-lg p-3 text-left overflow-auto max-h-32">
              {this.state.error?.message || 'Unknown error'}
            </p>
            <button
              onClick={this.handleReset}
              className="btn-primary px-5 py-2.5 rounded-lg text-sm font-medium"
            >
              Reset and reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
