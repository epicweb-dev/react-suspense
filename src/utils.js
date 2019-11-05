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

function PlaceholderPokemon({name}) {
  return (
    <div className="pokemon-info__flex-container">
      <div className="pokemon-info__img-wrapper">
        <img src="/img/pokemon/fallback-pokemon.jpg" alt={name} />
      </div>
      <section>
        <h2>
          {name}
          <sup>XXX</sup>
        </h2>
      </section>
      <section>
        <ul>
          <li>
            <label>Loading Attack</label>:{' '}
            <span>
              XX <small>(Type)</small>
            </span>
          </li>
          <li>
            <label>Loading Attack</label>:{' '}
            <span>
              XX <small>(Type)</small>
            </span>
          </li>
        </ul>
      </section>
      <section className="pokemon-info__notes-container">
        <h3>Notes:</h3>
        <textarea disabled placeholder="Loading notes..." />
      </section>
      <small className="pokemon-info__fetch-time">loading...</small>
    </div>
  )
}

export {ErrorBoundary, PlaceholderPokemon}
