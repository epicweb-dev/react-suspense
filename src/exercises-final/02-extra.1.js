// Refactor useEffect to Suspense
// 💯 Suspense and Error Boundary positioning

// http://localhost:3000/isolated/exercises-final/02-extra.1

import React from 'react'
import fetchPokemon from '../fetch-pokemon'
import {
  ErrorBoundary,
  createResource,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
} from '../utils'

// By default, all fetches are mocked so we can control the time easily.
// You can adjust the fetch time with this:
// window.FETCH_TIME = 3000
// If you want to make an actual network call for the pokemon
// then uncomment the following line
// window.fetch.restoreOriginalFetch()
// Note that by doing this, the FETCH_TIME will no longer be considered
// and if you want to slow things down you should use the Network tab
// in your developer tools to throttle your network to something like "Slow 3G"

function PokemonInfo({pokemonResource}) {
  const pokemon = pokemonResource.read()
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
}

function createPokemonResource(pokemonName) {
  return createResource(() => fetchPokemon(pokemonName))
}

function App() {
  const [pokemonName, setPokemonName] = React.useState(null)
  const [pokemonResource, setPokemonResource] = React.useState(null)

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
    setPokemonResource(createPokemonResource(newPokemonName))
  }

  return (
    <div>
      <PokemonForm onSubmit={handleSubmit} />
      <hr />
      <React.Suspense
        fallback={
          <div className="pokemon-info">
            <PokemonInfoFallback name={pokemonName} />
          </div>
        }
      >
        <div className="pokemon-info">
          {pokemonResource ? (
            <ErrorBoundary>
              <PokemonInfo pokemonResource={pokemonResource} />
            </ErrorBoundary>
          ) : (
            'Submit a pokemon'
          )}
        </div>
      </React.Suspense>
    </div>
  )
}

export default App
