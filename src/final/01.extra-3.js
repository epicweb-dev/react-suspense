// Simple Data-fetching
// 💯 Use utils
// http://localhost:3000/isolated/final/01.extra-3.js

import React from 'react'
import {
  fetchPokemon,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'
import {createResource} from '../utils'

let pokemonResource = createResource(fetchPokemon('pikachu'))

function PokemonInfo() {
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
        <PokemonErrorBoundary>
          <React.Suspense fallback={<PokemonInfoFallback name="Pikachu" />}>
            <PokemonInfo />
          </React.Suspense>
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

export default App
