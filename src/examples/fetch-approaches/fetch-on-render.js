// Fetch on render 👎
// http://localhost:3000/isolated/examples/fetch-approaches/fetch-on-render.js

import React from 'react'
import {ErrorBoundary} from '../../utils'
import {PokemonForm, PokemonInfoFallback} from '../../pokemon'

const PokemonInfo = React.lazy(() =>
  import('./lazy/pokemon-info-fetch-on-render'),
)

window.fetch.restoreOriginalFetch()

function App() {
  const [pokemonName, setPokemonName] = React.useState(null)

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div>
      <PokemonForm onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        {pokemonName ? (
          <ErrorBoundary>
            <React.Suspense
              fallback={<PokemonInfoFallback name={pokemonName} />}
            >
              <PokemonInfo pokemonName={pokemonName} />
            </React.Suspense>
          </ErrorBoundary>
        ) : (
          'Submit a pokemon'
        )}
      </div>
    </div>
  )
}

export default App
