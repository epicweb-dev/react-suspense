// Suspense Fundamentals

// http://localhost:3000/isolated/exercises-final/04

import React from 'react'

// this initialPosition is the "cache". It's not at all sophisticated and
// has all the normal problems with caching that you might expect.
// but it hopefully gives you the right idea
let initialPosition
let initialPositionPromise
function getGeoPosition(options) {
  if (!initialPosition) {
    if (!initialPositionPromise) {
      initialPositionPromise = new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          position => {
            initialPosition = position
            resolve(position)
          },
          error => reject(error),
          options,
        )
      })
    }
    // supsense magic...
    throw initialPositionPromise
  }
  return initialPosition
}

function App() {
  return (
    <div>
      Your position is: <Position />
    </div>
  )
}

function Position() {
  // retrieving the geoposition is asynchronous
  // but getGeoPosition uses suspense to give you a sychronous API! 🤯
  const position = getGeoPosition()
  const {latitude, longitude} = position.coords
  return <pre>{JSON.stringify({latitude, longitude}, null, 2)}</pre>
}

// this is just a hacky error boundary for handling any errors in the app
// it just shows "there was an error" with a button to try and re-render
// the whole app over again.
// In a regular app, I recommend using https://npm.im/react-error-boundary
// and reporting errors to a monitoring service.
class ErrorBoundary extends React.Component {
  state = {hasError: false}
  componentDidCatch() {
    this.setState({hasError: true})
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

function Usage() {
  return (
    <ErrorBoundary>
      <React.Suspense fallback={<div>loading position...</div>}>
        <App />
      </React.Suspense>
    </ErrorBoundary>
  )
}

export default Usage
