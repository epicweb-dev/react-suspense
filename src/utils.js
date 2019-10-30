import React from 'react'

// this is just a hacky error boundary for handling any errors in the app
// it just shows "there was an error" with a button to try and re-render
// the whole app over again.
// In a regular app, I recommend using https://npm.im/react-error-boundary
// and reporting errors to a monitoring service.
class ErrorBoundary extends React.Component {
  state = {hasError: false}
  static getDerivedStateFromError() {
    return {hasError: true}
  }
  componentDidCatch() {
    // log the error to the server
  }
  tryAgain = () => this.setState({hasError: false})
  render() {
    return this.state.hasError ? (
      <div>
        There was an error. <button onClick={this.tryAgain}>try again</button>
      </div>
    ) : (
      this.props.children
    )
  }
}

export {ErrorBoundary}
