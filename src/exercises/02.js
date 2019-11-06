// Fetch as you render

// http://localhost:3000/isolated/exercises/02

import React from 'react'
import fetchPokemon from '../fetch-pokemon'
// 💰 I moved the createResource function to the utils directory.
// feel free to check it out if you like, but it's the same one that
// we built earlier.
import {
  ErrorBoundary,
  createResource,
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

function App() {
  const [pokemonName, setPokemonName] = React.useState(null)
  // 🐨 swap this variable for a useState to track the pokemonResource
  const pokemonResource = null

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
    // 💣 you can remove this if you want to
    console.log('submitted', newPokemonName)
    // 🐨 using the createResource function, create a new resource
    // by passing a callback that calls fetchPokemon with the pokemonName
    // 🐨 update the pokemonResource to be that new one you just made
  }

  return (
    <div>
      <PokemonForm onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
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
http://ws.kcd.im/?ws=Concurrent%20React&e=Fetch%20as%20you%20render&em=
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
  no-unused-vars: off
*/
