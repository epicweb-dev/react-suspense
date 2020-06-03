// Fetch on render 👎
// http://localhost:3000/isolated/examples/fetch-approaches/fetch-on-render.js

import React from 'react'
import {
  PokemonForm,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../../pokemon'

const PokemonInfo = React.lazy(() =>
  import('./lazy/pokemon-info-fetch-on-render'),
)

window.useRealAPI = true

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div>
      <h1 style={{textAlign: 'center'}}>
        {'Fetch on render '}
        <span role="img" aria-label="thumbs down">
          👎
        </span>
      </h1>
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        {pokemonName ? (
          <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
            <React.Suspense
              fallback={<PokemonInfoFallback name={pokemonName} />}
            >
              <PokemonInfo pokemonName={pokemonName} />
            </React.Suspense>
          </PokemonErrorBoundary>
        ) : (
          'Submit a pokemon'
        )}
      </div>
    </div>
  )
}

export default App
