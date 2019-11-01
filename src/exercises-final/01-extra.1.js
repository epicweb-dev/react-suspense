// Simple Data-fetching
// 💯 extract complicated bits to getPokemon

// http://localhost:3000/isolated/exercises-final/01-extra.1

import React from 'react'
import fetchPokemon from '../fetch-pokemon'
import {ErrorBoundary} from '../utils'

// if you want to make an actual network call for the pokemon
// then uncomment the following line.
// window.fetch.restoreOriginalFetch()
// and you can adjust the fetch time with this:
// window.FETCH_TIME = 3000

let pokemon
let pokemonError
let pokemonPromise = fetchPokemon('pikachu').then(
  p => (pokemon = p),
  e => (pokemonError = e),
)

function getPokemon() {
  if (pokemonError) {
    throw pokemonError
  }
  if (!pokemon) {
    throw pokemonPromise
  }
  return pokemon
}

function Pokemon() {
  const pokemon = getPokemon()
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

function App() {
  return (
    <div className="pokemon-info">
      <ErrorBoundary>
        <React.Suspense fallback={<div>Loading Pokemon...</div>}>
          <Pokemon />
        </React.Suspense>
      </ErrorBoundary>
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
