// Cache resources
// 💯 Cache in Context

// http://localhost:3000/isolated/exercises-final/05-extra.1

import React from 'react'
import fetchPokemon, {getImageUrlForPokemon} from '../fetch-pokemon'
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

function createPokemonResource(pokemonName) {
  const lowerName = pokemonName
  const data = createResource(() => fetchPokemon(lowerName))
  const image = createResource(
    () =>
      new Promise(resolve => {
        const img = document.createElement('img')
        const src = getImageUrlForPokemon(lowerName)
        img.src = src
        img.onload = () => resolve(src)
      }),
  )
  return {data, image}
}

function PokemonInfo({pokemonResource}) {
  const pokemon = pokemonResource.data.read()
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemonResource.image.read()} alt={pokemon.name} />
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

function PokemonInfoContainer({pokemonName}) {
  const [pokemonResource, isPending] = usePokemonResource(pokemonName)
  return (
    <div className={`pokemon-info ${isPending ? 'pokemon-loading' : ''}`}>
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
  )
}

const SUSPENSE_CONFIG = {
  timeoutMs: 4000,
  busyDelayMs: 300, // this time is the same as our css transition delay
  busyMinDurationMs: 500,
}

const pokemonResourceCache = {}

const PokemonResourceContext = React.createContext()

function usePokemonResource() {
  return React.useContext(PokemonResourceContext)
}

function getPokemonResource(name) {
  const lowerName = name.toLowerCase()
  let resource = pokemonResourceCache[lowerName]
  if (!resource) {
    resource = createPokemonResource(lowerName)
    pokemonResourceCache[lowerName] = resource
  }
  return resource
}

function App() {
  const [startTransition, isPending] = React.useTransition(SUSPENSE_CONFIG)
  const [pokemonName, setPokemonName] = React.useState('')
  const [pokemonResource, setPokemonResource] = React.useState(null)

  function handleChange(e) {
    setPokemonName(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    startTransition(() => {
      setPokemonResource(getPokemonResource(pokemonName))
    })
  }

  function handleSelect(newPokemonName) {
    startTransition(() => {
      setPokemonResource(getPokemonResource(newPokemonName))
    })
    setPokemonName(newPokemonName)
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
      <PokemonResourceContext.Provider value={[pokemonResource, isPending]}>
        <PokemonInfoContainer />
      </PokemonResourceContext.Provider>
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
