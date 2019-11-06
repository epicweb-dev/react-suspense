// Cache resources
// 💯 Cache in Context

// http://localhost:3000/isolated/exercises-final/05-extra.1

import React from 'react'
import fetchPokemon, {getImageUrlForPokemon} from '../fetch-pokemon'
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
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
}

function PokemonInfoContainer() {
  const {pokemonResource, isPending, pokemonName} = usePokemonResource()
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
      <PokemonResourceContext.Provider
        value={{pokemonResource, isPending, pokemonName}}
      >
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
