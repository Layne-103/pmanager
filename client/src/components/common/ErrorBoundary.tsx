import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component that catches React errors
 * and displays a user-friendly error message
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console for debugging
    console.error('Uncaught error:', error);
    console.error('Error info:', errorInfo);

    // Update state with error info
    this.setState({ errorInfo });

    // TODO: Log to error reporting service (e.g., Sentry)
  }

  private handleReload = () => {
    // Clear error state and reload
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleReset = () => {
    // Try to recover without full reload
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center"
          >
            {/* Error Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4"
            >
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </motion.div>

            {/* Error Message */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
            </p>

            {/* Error Details (Development Only) */}
            {import.meta.env.DEV && this.state.errorInfo && (
              <details className="text-left mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                  Error Details (Dev Only)
                </summary>
                <pre className="text-xs text-gray-600 overflow-auto max-h-40">
                  {this.state.error?.stack}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={this.handleReset}
                variant="outline"
                className="flex-1"
              >
                Try Again
              </Button>
              <Button
                onClick={this.handleReload}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Reload Page
              </Button>
            </div>

            {/* Help Text */}
            <p className="mt-6 text-sm text-gray-500">
              If this problem persists, please contact support.
            </p>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
