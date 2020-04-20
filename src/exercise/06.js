// Suspense with a custom hook
// http://localhost:3000/isolated/exercise/06.js

import React from 'react'
import fetchPokemon, {getImageUrlForPokemon} from '../fetch-pokemon'
import {
  ErrorBoundary,
  createResource,
  preloadImage,
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
  const lowerName = pokemonName
  const data = createResource(() => fetchPokemon(lowerName), {id: lowerName})
  const image = createResource(() =>
    preloadImage(getImageUrlForPokemon(lowerName), {id: lowerName}),
  )
  return {data, image}
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')
  // 🐨 move these two lines to a custom hook called usePokemonResource

  // 🐨 call usePokemonResource with the pokemonName.
  //    It should return both the pokemonResource and isPending
  const [startTransition, isPending] = React.useTransition(SUSPENSE_CONFIG)
  const [pokemonResource, setPokemonResource] = React.useState(null)

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
    // 🐨 move this startTransition call to a useEffect inside your
    //    custom usePokemonResource hook (it should list pokemonName as a
    //    dependency).
    startTransition(() => {
      setPokemonResource(getPokemonResource(newPokemonName))
    })
    // 💰 tip: in your effect callback, if pokemonName is an empty string,
    //    return early.
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm onSubmit={handleSubmit} />
      <hr />
      <div className={`pokemon-info ${isPending ? 'pokemon-loading' : ''}`}>
        {pokemonResource ? (
          <ErrorBoundary key={pokemonResource.id}>
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

export default App
