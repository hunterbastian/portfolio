'use client'

import React from 'react'
import Link from 'next/link'
import {
  ERROR_BOUNDARY_DESCRIPTION,
  ERROR_BOUNDARY_HOME_CLASS,
  ERROR_BOUNDARY_RETRY_CLASS,
  ERROR_BOUNDARY_RETRY_LABEL,
  ERROR_BOUNDARY_TITLE,
  getErrorBoundaryHomeAction,
  logErrorBoundaryError,
} from '@/lib/error-boundary'

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
    logErrorBoundaryError(error)
  }

  handleReset = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      const homeAction = getErrorBoundaryHomeAction()

      return (
        <div className="container mx-auto max-w-[560px] px-4 py-16 text-center">
          <h2 className="text-2xl font-semibold mb-3">{ERROR_BOUNDARY_TITLE}</h2>
          <p className="text-muted-foreground mb-6">{ERROR_BOUNDARY_DESCRIPTION}</p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={this.handleReset} className={ERROR_BOUNDARY_RETRY_CLASS}>
              {ERROR_BOUNDARY_RETRY_LABEL}
            </button>
            <Link href={homeAction.href} className={ERROR_BOUNDARY_HOME_CLASS}>{homeAction.label}</Link>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
