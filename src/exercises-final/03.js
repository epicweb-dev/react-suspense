// useTransition for improved loading states

// http://localhost:3000/isolated/exercises-final/03

import React from 'react'
import fetchPokemon from '../fetch-pokemon'
import {ErrorBoundary, createResource, PokemonInfoFallback} from '../utils'

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
      <section>
        <h2>
          {pokemon.name}
          <sup>{pokemon.number}</sup>
        </h2>
      </section>
      <section>
        <ul>
          {pokemon.attacks.special.map(attack => (
            <li key={attack.name}>
              <label>{attack.name}</label>:{' '}
              <span>
                {attack.damage} <small>({attack.type})</small>
              </span>
            </li>
          ))}
        </ul>
      </section>
      <small className="pokemon-info__fetch-time">{pokemon.fetchedAt}</small>
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

const SUSPENSE_CONFIG = {
  timeoutMs: 4000,
  busyDelayMs: 300, // this time is the same as our css transition delay
  busyMinDurationMs: 500,
}

function App() {
  const [startTransition, isPending] = React.useTransition(SUSPENSE_CONFIG)
  const [{pokemonResource, pokemonName}, setState] = React.useReducer(
    (state, action) => ({...state, ...action}),
    {pokemonResource: null, pokemonName: ''},
  )

  function setPokemonResource(name) {
    startTransition(() => {
      const pokemonResource = createResource(() => fetchPokemon(name))
      setState({pokemonResource})
    })
  }

  function handleChange(e) {
    setState({pokemonName: e.target.value})
  }

  function handleSubmit(e) {
    e.preventDefault()
    setPokemonResource(pokemonName)
  }

  function handleSelect(newPokemonName) {
    setState({pokemonName: newPokemonName})
    setPokemonResource(newPokemonName)
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="pokemon-form">
        <label htmlFor="pokemonName-input">Pokemon Name</label>
        <small>
          Try{' '}
          <button
            className="invisible-button"
            type="button"
            onClick={() => handleSelect('pikachu')}
          >
            "pikachu"
          </button>
          {', '}
          <button
            className="invisible-button"
            type="button"
            onClick={() => handleSelect('charizard')}
          >
            "charizard"
          </button>
          {', or '}
          <button
            className="invisible-button"
            type="button"
            onClick={() => handleSelect('mew')}
          >
            "mew"
          </button>
        </small>
        <div>
          <input
            id="pokemonName-input"
            name="pokemonName"
            value={pokemonName}
            onChange={handleChange}
          />
          <button type="submit" disabled={!pokemonName.length}>
            Submit
          </button>
        </div>
      </form>
      <hr />
      <div style={{opacity: isPending ? 0.6 : 1}} className="pokemon-info">
        <ErrorBoundary>
          <React.Suspense fallback={<PokemonInfoFallback name={pokemonName} />}>
            {pokemonResource ? (
              <PokemonInfo pokemonResource={pokemonResource} />
            ) : (
              'Submit a pokemon'
            )}
          </React.Suspense>
        </ErrorBoundary>
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
