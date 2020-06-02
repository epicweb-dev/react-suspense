// Simple Data-fetching
// 💯 Use utils
// http://localhost:3000/isolated/final/01.extra-3.js

import React from 'react'
import {fetchPokemon, PokemonDataView, PokemonInfoFallback} from '../pokemon'
import {ErrorBoundary, createResource} from '../utils'

let pokemonResource = createResource(fetchPokemon('pikachu'))

function Pokemon() {
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

function App() {
  return (
    <div className="pokemon-info-app">
      <div className="pokemon-info">
        <ErrorBoundary>
          <React.Suspense fallback={<PokemonInfoFallback name="Pikachu" />}>
            <Pokemon />
          </React.Suspense>
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
