import { Component, type ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  retrying: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, retrying: false, error: undefined };

  static getDerivedStateFromError(error: Error): State {
    console.error('[ErrorBoundary] Caught error:', error);
    return { hasError: true, retrying: false, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Error details:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  handleRetry = () => {
    console.log('[ErrorBoundary] User triggered retry');
    this.setState({ retrying: true });
    setTimeout(() => this.setState({ hasError: false, retrying: false, error: undefined }), 600);
  };

  render() {
    if (this.state.hasError) {
      const isDev = process.env.NODE_ENV === 'development';
      
      return (
        <div className={styles.fallback}>
          <h3>Failed to load</h3>
          <p>{this.props.fallbackMessage || 'The remote module could not be loaded.'}</p>
          {isDev && this.state.error && (
            <details style={{ margin: '12px 0', fontSize: '12px', color: '#666' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Error details (dev)</summary>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '8px', 
                borderRadius: '4px', 
                overflow: 'auto',
                maxHeight: '200px'
              }}>
                {this.state.error.message}
              </pre>
            </details>
          )}
          <button
            className={styles.retry}
            onClick={this.handleRetry}
            disabled={this.state.retrying}
          >
            {this.state.retrying ? 'Retrying...' : 'Try again'}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
