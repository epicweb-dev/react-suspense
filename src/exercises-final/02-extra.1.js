// Fetch as you render
// 💯 handle useTransition

// http://localhost:3000/isolated/exercises-final/02

import React from 'react'
import fetchPokemon from '../fetch-pokemon'
import {ErrorBoundary} from '../utils'

// if you want to make an actual network call for the pokemon
// the uncomment the following line.
// window.fetch.restoreOriginalFetch()

function createResource(asyncFn) {
  let result
  let error
  let promise = asyncFn().then(r => (result = r), e => (error = e))
  return {
    read() {
      if (error) {
        throw error
      }
      if (!result) {
        throw promise
      }
      return result
    },
  }
}

function PokemonInfo({pokemonResource}) {
  const pokemon = pokemonResource.read()
  return <pre>{JSON.stringify(pokemon, null, 2)}</pre>
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
    <div style={{display: 'flex', flexDirection: 'column'}}>
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
      <div
        style={{
          height: 300,
          width: 300,
          overflow: 'scroll',
          backgroundColor: '#eee',
          borderRadius: 4,
          padding: 10,
          opacity: isPending ? 0.6 : 1,
        }}
      >
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
