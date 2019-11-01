// TODO
// 💯 Final version

// http://localhost:3000/isolated/exercises-final/04-extra.4

import React from 'react'

function useGeoPosition(options) {
  const [position, setPosition] = React.useState(getInitialPosition(options))

  const setError = useErrorBoundaryError()

  React.useEffect(() => {
    const watch = navigator.geolocation.watchPosition(
      setPosition,
      setError,
      options,
    )

    return () => navigator.geolocation.clearWatch(watch)
  }, [options, setError])

  return position
}

// this initialPosition is the "cache". It's not at all sophisticated and
// has all the normal problems with caching that you might expect.
// but it hopefully gives you the right idea
let initialPosition
let initialPositionPromise
function getInitialPosition(options) {
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

// We want our error boundary to handle errors for our useGeoPosition hook.
// Because we're watching the geolocation over time and we can provide
// an error callback, we need to inform React of this error by throwing
// the error during a regular React callstack. So we put the error inside
// state, then throw it if it's ever set.
function useErrorBoundaryError() {
  const [error, setError] = React.useState(null)

  if (error) {
    // clear out the error
    setError(null)
    // let the error boundary catch this
    throw error
  }

  return setError
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
  // but useGeoPosition uses suspense to give you a sychronous API! 🤯
  const position = useGeoPosition()
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
