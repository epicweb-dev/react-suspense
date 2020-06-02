// Render as you fetch
// http://localhost:3000/isolated/exercise/02.js

import React from 'react'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  // 🐨 you'll need PokemonErrorBoundary here
} from '../pokemon'
// 🐨 you'll need createResource from ../utils

// 🐨 Your goal is to refactor this traditional useEffect-style async
// interaction to suspense with resources. Enjoy!

function PokemonInfo({pokemonName}) {
  // 💣 you're pretty much going to delete all this stuff except for the one
  // place where 🐨 appears
  const [state, setState] = React.useReducer((s, a) => ({...s, ...a}), {
    pokemon: null,
    error: null,
    status: 'pending',
  })

  const {pokemon, error, status} = state

  React.useEffect(() => {
    let current = true
    setState({status: 'pending'})
    fetchPokemon(pokemonName).then(
      p => {
        if (current) setState({pokemon: p, status: 'success'})
      },
      e => {
        if (current) setState({error: e, status: 'error'})
      },
    )
    return () => (current = false)
  }, [pokemonName])

  // 💰 This will be the fallback prop of <React.Suspense />
  if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  }

  // 💰 This is the same thing the PokemonErrorBoundary renders
  if (status === 'error') {
    return (
      <div>
        There was an error.
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
    )
  }

  // 💰 this is the part that will suspend
  if (status === 'success') {
    // 🐨 instead of accpeting the pokemonName as a prop to this component
    // you'll accept a pokemonResource.
    // 💰 you'll get the pokemon from: pokemonResource.read()
    // 🐨 This will be the return value of this component. You wont need it
    // to be in this if statement anymore thought!
    return (
      <div>
        <div className="pokemon-info__img-wrapper">
          <img src={pokemon.image} alt={pokemon.name} />
        </div>
        <PokemonDataView pokemon={pokemon} />
      </div>
    )
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')
  // 🐨 add a useState here to keep track of the current pokemonResource

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
    // 🐨 set the pokemon resource right here
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        {pokemonName ? ( // 🐨 instead of pokemonName, use pokemonResource here
          // 🐨 wrap PokemonInfo in an ErrorBoundary and React.Suspense component
          // to manage the error and loading states that PokemonInfo was managing
          // before your changes.
          <PokemonInfo pokemonName={pokemonName} />
        ) : (
          'Submit a pokemon'
        )}
      </div>
    </div>
  )
}

export default App
