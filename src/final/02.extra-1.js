// Refactor useEffect to Suspense
// 💯 Suspense and Error Boundary positioning
// http://localhost:3000/isolated/final/02.extra-1.js

import React from 'react'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
} from '../pokemon'
import {ErrorBoundary, createResource} from '../utils'

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
  return createResource(fetchPokemon(pokemonName))
}

function App() {
  const [pokemonName, setPokemonName] = React.useState(null)
  const [pokemonResource, setPokemonResource] = React.useState(null)

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    setPokemonResource(createPokemonResource(pokemonName))
  }, [pokemonName])

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
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
