// useTransition for improved loading states

// http://localhost:3000/isolated/exercises-final/04

import React from 'react'
import fetchPokemon from '../fetch-pokemon'
import {ErrorBoundary} from '../utils'

// if you want to make an actual network call for the pokemon
// then uncomment the following line.
window.fetch.restoreOriginalFetch()

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
      switch (status) {
        case 'pending':
          throw promise
        case 'error':
          throw result
        case 'success':
          return result
        default:
          throw new Error('Impossible state!')
      }
    },
  }
}

function PokemonInfo({pokemonResource}) {
  const pokemon = pokemonResource.read()
  return (
    <div>
      <section>
        <h2>
          {pokemon.name}
          <sup>{pokemon.number}</sup>
        </h2>
      </section>
      <div className="pokemon-info__img-wrapper">
        <img alt={pokemon.name} src={pokemon.image} />
      </div>
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

function InvisibleButton(props) {
  return (
    <button
      type="button"
      style={{
        border: 'none',
        padding: 'inherit',
        fontSize: 'inherit',
        fontFamily: 'inherit',
        cursor: 'pointer',
        fontWeight: 'inherit',
      }}
      {...props}
    />
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
    const pokemonResource = createResource(() =>
      fetchPokemon(pokemonName.toLowerCase()),
    )
    setState({pokemonResource})
  }

  function handleSelect(pokemonName) {
    setState({pokemonName})
    startTransition(() => {
      const pokemonResource = createResource(() =>
        fetchPokemon(pokemonName.toLowerCase()),
      )
      setState({pokemonResource})
    })
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <label htmlFor="pokemonName-input">Pokemon Name</label>
        <small>
          Try{' '}
          <InvisibleButton onClick={() => handleSelect('pikachu')}>
            "pikachu"
          </InvisibleButton>
          {', '}
          <InvisibleButton onClick={() => handleSelect('charizard')}>
            "charizard"
          </InvisibleButton>
          {', or '}
          <InvisibleButton onClick={() => handleSelect('mew')}>
            "mew"
          </InvisibleButton>
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
      <div className="pokemon-info" style={{opacity: isPending ? 0.6 : 1}}>
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
