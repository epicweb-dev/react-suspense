// Simple Data-fetching
// 💯 add error handling with an Error Boundary
// http://localhost:3000/isolated/final/01.extra-1.js

import React from 'react'
import {fetchPokemon, PokemonDataView, PokemonErrorBoundary} from '../pokemon'

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
    <div className="pokemon-info-app">
      <div className="pokemon-info">
        <PokemonErrorBoundary>
          <React.Suspense fallback={<div>Loading Pokemon...</div>}>
            <PokemonInfo />
          </React.Suspense>
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

export default App
