// useTransition for improved loading states
// http://localhost:3000/isolated/exercise/03.js

import React from 'react'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  PokemonErrorBoundary,
} from '../pokemon'
import {createResource} from '../utils'

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

// try a few of these fetch times:
// shows busy indicator
// window.FETCH_TIME = 450

// shows busy indicator, then suspense fallback
// window.FETCH_TIME = 5000

// shows busy indicator for a split second
// 💯 this is what the extra credit improves
// window.FETCH_TIME = 200

// 🐨 create a SUSPENSE_CONFIG variable right here and configure timeoutMs to
// whatever feels right to you, then try it out and tweek it until you're happy
// with the experience.

function createPokemonResource(pokemonName) {
  return createResource(fetchPokemon(pokemonName))
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')
  // 🐨 add a useTransition hook here
  const [pokemonResource, setPokemonResource] = React.useState(null)

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
    // 🐨 wrap this next line in a startTransition call
    setPokemonResource(createPokemonResource(newPokemonName))
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      {/*
        🐨 add inline styles here to set the opacity to 0.6 if the
        useTransition above is pending
      */}
      <div className="pokemon-info">
        {pokemonResource ? (
          <PokemonErrorBoundary
            onReset={handleReset}
            resetKeys={[pokemonResource]}
          >
            <React.Suspense
              fallback={<PokemonInfoFallback name={pokemonName} />}
            >
              <PokemonInfo pokemonResource={pokemonResource} />
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
