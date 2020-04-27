import React from 'react'

// this is just a hacky error boundary for handling any errors in the app
// it just shows "there was an error" with a button to try and re-render
// the whole app over again.
// In a regular app, I recommend using https://npm.im/react-error-boundary
// and reporting errors to a monitoring service.
class ErrorBoundary extends React.Component {
  state = {error: null}
  static getDerivedStateFromError(error) {
    return {error}
  }
  componentDidCatch() {
    // log the error to the server
  }
  tryAgain = () => this.setState({error: null})
  render() {
    return this.state.error ? (
      <div>
        There was an error. <button onClick={this.tryAgain}>try again</button>
        <pre style={{whiteSpace: 'normal'}}>{this.state.error.message}</pre>
      </div>
    ) : (
      this.props.children
    )
  }
}

// 🚨 This should NOT be copy/pasted for production code and is only here
// for experimentation purposes. The API for suspense (currently throwing a
// promise) is likely to change before suspense is officially released.
// This was strongly inspired by work done in the React Docs by Dan Abramov
function createResource(asyncFn, data) {
  let status = 'pending'
  let result
  let promise = asyncFn().then(
    r => {
      status = 'success'
      result = r
    },
    e => {
      status = 'error'
      result = e
    },
  )
  return {
    read() {
      if (status === 'pending') throw promise
      if (status === 'error') throw result
      if (status === 'success') return result
      throw new Error('This should be impossible')
    },
    ...data,
  }
}

function preloadImage(src) {
  return new Promise(resolve => {
    const img = document.createElement('img')
    img.src = src
    img.onload = () => resolve(src)
  })
}

export {ErrorBoundary, createResource, preloadImage}
