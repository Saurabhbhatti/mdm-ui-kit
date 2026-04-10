import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (typeof this.props.onError === 'function') {
      this.props.onError(error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mdm-errorBoundary">
          <div className="mdm-errorBoundary__card">
            <h2 className="mdm-errorBoundary__title">Something went wrong</h2>
            <p className="mdm-errorBoundary__description">
              The application hit an unexpected error. Please refresh the page and try again.
            </p>
            {this.state.error?.message ? <pre className="mdm-errorBoundary__details">{this.state.error.message}</pre> : null}
            <button className="mdm-button mdm-button--primary" type="button" onClick={() => window.location.reload()}>
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
