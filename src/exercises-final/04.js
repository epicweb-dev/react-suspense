// Suspense Image

// http://localhost:3000/isolated/exercises-final/04

import React from 'react'
import fetchPokemon from '../fetch-pokemon'
import {ErrorBoundary} from '../utils'

// if you want to make an actual network call for the pokemon
// then uncomment the following line.
// window.fetch.restoreOriginalFetch()
// and you can adjust the fetch time with this:
// window.FETCH_TIME = 3000

function createResource(asyncFn) {
  let status = 'pending'
  let result
  let promise = asyncFn().then(
    r => {
      status = 'success'
      result = r
    },
    e => {
      status = 'error'
      result = e
    },
  )
  return {
    read() {
      if (status === 'pending') throw promise
      if (status === 'error') throw result
      if (status === 'success') return result
      throw new Error('This should be impossible')
    },
  }
}

const imgSrcResourceCache = {}

function Img({src, ...props}) {
  if (!imgSrcResourceCache[src]) {
    imgSrcResourceCache[src] = createResource(
      () =>
        new Promise(resolve => {
          const img = new Image()
          img.src = src
          img.onload = () => resolve(src)
        }),
    )
  }
  return <img src={imgSrcResourceCache[src].read()} {...props} />
}

function PokemonInfo({pokemonResource}) {
  const pokemon = pokemonResource.read()
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <Img src={pokemon.image} alt={pokemon.name} />
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
    </div>
  )
}

function App() {
  const [startTransition, isPending] = React.useTransition({timeoutMs: 3000})
  const [{pokemonResource, pokemonName}, setState] = React.useReducer(
    (state, action) => ({...state, ...action}),
    {pokemonResource: null, pokemonName: ''},
  )

  function handleChange(e) {
    setState({pokemonName: e.target.value})
  }

  function handleSubmit(e) {
    e.preventDefault()
    const pokemonResource = createResource(() => fetchPokemon(pokemonName))
    setState({pokemonResource})
  }

  function handleSelect(pokemonName) {
    setState({pokemonName})
    startTransition(() => {
      const pokemonResource = createResource(() => fetchPokemon(pokemonName))
      setState({pokemonResource})
    })
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
          <button type="submit">Submit</button>
        </div>
      </form>
      <hr />
      <div style={{opacity: isPending ? 0.6 : 1}} className="pokemon-info">
        <ErrorBoundary>
          <React.Suspense fallback={<div>Loading Pokemon...</div>}>
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

/*
eslint
  jsx-a11y/alt-text: off
*/
