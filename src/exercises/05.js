// Suspense Image

// http://localhost:3000/isolated/exercises/05

import React from 'react'
import fetchPokemon from '../fetch-pokemon'
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

// 🦉 On this one, make sure that you uncheck the "Disable cache" checkbox.
// We're relying on that cache for this approach to work!

// we need to make a place to store the resources outside of render so
// 🐨 create "cache" object here.

// 🐨 create an Img component that renders a regular <img /> and accepts a src
// prop and forwards on any remaining props.
// 🐨 The first thing you do in this component is check wither your
// imgSrcResourceCache already has a resource for the given src prop. If it does
// not, then you need to create one (💰 using createResource).
// 🐨 Once you have the resource, then render the <img />.
// 💰 Here's what rendering the <img /> should look like:
// <img src={imgSrcResource.read()} {...props} />

function PokemonInfo({pokemonResource}) {
  const pokemon = pokemonResource.read()
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        {/* 🐨 swap this img for your new Img component */}
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
}

const SUSPENSE_CONFIG = {
  timeoutMs: 4000,
  busyDelayMs: 300, // this time is slightly shorter than our css transition delay
  busyMinDurationMs: 700,
}

const pokemonResourceCache = {}

function getPokemonResource(name) {
  const lowerName = name.toLowerCase()
  let resource = pokemonResourceCache[lowerName]
  if (!resource) {
    resource = createPokemonResource(lowerName)
    pokemonResourceCache[lowerName] = resource
  }
  return resource
}

function createPokemonResource(pokemonName) {
  return createResource(() => fetchPokemon(pokemonName))
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')
  const [startTransition, isPending] = React.useTransition(SUSPENSE_CONFIG)
  const [pokemonResource, setPokemonResource] = React.useState(null)

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
    startTransition(() => {
      setPokemonResource(getPokemonResource(newPokemonName))
    })
  }

  return (
    <div>
      <PokemonForm onSubmit={handleSubmit} />
      <hr />
      <div className={`pokemon-info ${isPending ? 'pokemon-loading' : ''}`}>
        {pokemonResource ? (
          <ErrorBoundary>
            <React.Suspense
              fallback={<PokemonInfoFallback name={pokemonName} />}
            >
              <PokemonInfo pokemonResource={pokemonResource} />
            </React.Suspense>
          </ErrorBoundary>
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
http://ws.kcd.im/?ws=Concurrent%20React&e=Suspense%20Image&em=
*/

////////////////////////////////////////////////////////////////////
//                                                                //
//                 Don't make changes below here.                 //
// But do look at it to see how your code is intended to be used. //
//                                                                //
////////////////////////////////////////////////////////////////////

export default App
