'use client'

import React from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    // Log to console; could be replaced with analytics
    console.error('ErrorBoundary caught an error:', error)
  }

  handleReset = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto max-w-2xl px-4 py-16 text-center">
          <h2 className="text-2xl font-semibold mb-3">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">Please try again. If the issue persists, contact me.</p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={this.handleReset} className="px-4 py-2 rounded bg-primary text-primary-foreground">
              Try again
            </button>
            <a href="/" className="px-4 py-2 rounded border">Go Home</a>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}


