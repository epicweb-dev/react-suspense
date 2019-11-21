// Simple Data-fetching
// 💯 add error handling with an Error Boundary

// http://localhost:3000/isolated/exercises-final/01-extra.1

import React from 'react'
import fetchPokemon from '../fetch-pokemon'
import {ErrorBoundary, PokemonDataView} from '../utils'

// By default, all fetches are mocked so we can control the time easily.
// You can adjust the fetch time with this:
// window.FETCH_TIME = 3000
// If you want to make an actual network call for the pokemon
// then uncomment the following line
// window.fetch.restoreOriginalFetch()
// Note that by doing this, the FETCH_TIME will no longer be considered
// and if you want to slow things down you should use the Network tab
// in your developer tools to throttle your network to something like "Slow 3G"

let pokemon
let pokemonError
let pokemonPromise = fetchPokemon('pikachu').then(
  p => (pokemon = p),
  e => (pokemonError = e),
)

function PokemonInfo() {
  if (pokemonError) {
    throw pokemonError
  }
  if (!pokemon) {
    throw pokemonPromise
  }
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
}

function App() {
  return (
    <div className="pokemon-info">
      <ErrorBoundary>
        <React.Suspense fallback={<div>Loading Pokemon...</div>}>
          <PokemonInfo />
        </React.Suspense>
      </ErrorBoundary>
    </div>
  )
}

export default App
