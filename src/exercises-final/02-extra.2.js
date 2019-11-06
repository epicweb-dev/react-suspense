// Fetch as you render
// 💯 lazy load pokemon-info-render-as-you-fetch

// http://localhost:3000/isolated/exercises-final/02-extra.2

import React from 'react'
import {ErrorBoundary, PokemonInfoFallback, PokemonForm} from '../utils'
import createPokemonInfoResource from '../lazy/pokemon-info-render-as-you-fetch-02.data'

const PokemonInfo = React.lazy(() =>
  import('../lazy/pokemon-info-render-as-you-fetch-02'),
)

// By default, all fetches are mocked so we can control the time easily.
// You can adjust the fetch time with this:
// window.FETCH_TIME = 3000
// If you want to make an actual network call for the pokemon
// then uncomment the following line
// window.fetch.restoreOriginalFetch()
// Note that by doing this, the FETCH_TIME will no longer be considered
// and if you want to slow things down you should use the Network tab
// in your developer tools to throttle your network to something like "Slow 3G"

function App() {
  const [pokemonName, setPokemonName] = React.useState(null)
  const [pokemonResource, setPokemonResource] = React.useState(null)

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
    setPokemonResource(createPokemonInfoResource(newPokemonName))
  }

  return (
    <div>
      <PokemonForm onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        {pokemonResource ? (
          <ErrorBoundary>
            <React.Suspense
              fallback={<PokemonInfoFallback name={pokemonName} />}
            >
              <PokemonInfo pokemonResource={pokemonResource} />
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
