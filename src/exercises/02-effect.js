// Fetch as you render
// 💯 Refactor from useEffect

// http://localhost:3000/isolated/exercises/02-effect

import React from 'react'
import fetchPokemon from '../fetch-pokemon'
import {
  // ErrorBoundary,
  // createResource,
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

// 🐨 Your goal is to refactor this traditional useEffect-style async
// interaction to suspense with resources. Enjoy!
// 💰 When you're done, it should look like `src/exercises-final/02.js`

function PokemonInfo({pokemonName}) {
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

  if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  }

  if (status === 'error') {
    return (
      <div>
        There was an error.
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div>
        <div className="pokemon-info__img-wrapper">
          <img src={pokemon.image} alt={pokemon.name} />
        </div>
        <PokemonDataView pokemon={pokemon} />
      </div>
    )
  }

  throw new Error('this should never happen!')
}

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
          <PokemonInfo pokemonName={pokemonName} />
        ) : (
          'Submit a pokemon'
        )}
      </div>
    </div>
  )
}

/*
🦉 Elaboration & Feedback
After the instruction, copy the URL below into your browser and fill out the form:
http://ws.kcd.im/?ws=Concurrent%20React&e=TODO&em=
*/

////////////////////////////////////////////////////////////////////
//                                                                //
//                 Don't make changes below here.                 //
// But do look at it to see how your code is intended to be used. //
//                                                                //
////////////////////////////////////////////////////////////////////

export default App
