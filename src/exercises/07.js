// Coordinate Suspending components with SuspenseList

// http://localhost:3000/isolated/exercises/07

import React from 'react'
import fetchPokemon, {getImageUrlForPokemon} from '../fetch-pokemon'
import {
  ErrorBoundary,
  createResource,
  PokemonInfoFallback,
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

// 🐨 once you finish adding the SuspenseList component below, come back here
// and try these different things out.
// Try this:
// const favoritePokemon = [
//   {name: 'charizard', delay: 1000},
//   {name: 'bulbasaur', delay: 500},
// ]
// Then switch between revealOrder of "together" "forwards" and "backwards"
//
// The try this:
// const favoritePokemon = [
//   {name: 'charizard', delay: 1000},
//   {name: 'bulbasaur', delay: 500},
//   {name: 'ditto', delay: 2000},
// ]
// and do the same there. Also try without revealOrder (default behavior as if you have no SuspenseList).

// there's also a prop called "tail" which can be either "collapsed" or "hidden"
// play around with that too.

const favoritePokemon = [
  {name: 'charizard', delay: 1000},
  {name: 'bulbasaur', delay: 500},
  {name: 'ditto', delay: 2000},
  {name: 'mewtwo', delay: 500},
  {name: 'mew', delay: 2500},
  {name: 'pikachu', delay: 400},
  // if you are using the graphql endpoint, then try these:
  // {name: 'eevee', delay: 200},
  // {name: 'snorlax', delay: 700},
  // {name: 'charmander', delay: 400},
  // {name: 'gengar', delay: 100},
  // {name: 'squirtle', delay: 1500},
  // {name: 'dragonite', delay: 4500},
  // {name: 'jigglypuff', delay: 6000},
  // {name: 'gyarados', delay: 500},
  // {name: 'raichu', delay: 500},
  // {name: 'psyduck', delay: 500},
  // {name: 'vulpix', delay: 500},
  // {name: 'ninetales', delay: 500},
]

const SUSPENSE_CONFIG = {
  timeoutMs: 4000, // play around with this number as well..
  busyDelayMs: 300, // this time is the same as our css transition delay
  busyMinDurationMs: 500,
}

function createPokemonResource(pokemonName, delay) {
  const lowerName = pokemonName
  const data = createResource(() => fetchPokemon(lowerName, delay))
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

function App() {
  const [
    favoritePokemonResources,
    setFavoritePokemonResources,
  ] = React.useState([])
  const [startTransition, isPending] = React.useTransition(SUSPENSE_CONFIG)

  function handleGoClick() {
    startTransition(() => {
      const newResources = favoritePokemon.map(({name, delay}) => ({
        name,
        resource: createPokemonResource(name, delay),
      }))

      setFavoritePokemonResources(newResources)
    })
  }

  return (
    <div>
      <div>
        <button onClick={handleGoClick}>Go!</button>
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          opacity: isPending ? 0.6 : 1,
        }}
      >
        {/*
          🐨 wrap this in a <React.SuspenseList /> component
          🐨 Try out all different combinations of the SuspenseList props:
              revealOrder: {undefined} "together" "forwards" "backwards"
              tail: "hidden" "collapsed"
          🐨 also make sure to adjust the delay on the pokemon above as well
        */}
        {favoritePokemonResources.map(({name, resource}) => (
          <div
            key={name}
            className="pokemon-info"
            style={{margin: 20, height: 'auto'}}
          >
            <ErrorBoundary>
              <React.Suspense fallback={<PokemonInfoFallback name={name} />}>
                <PokemonInfo pokemonResource={resource} />
              </React.Suspense>
            </ErrorBoundary>
          </div>
        ))}
      </div>
    </div>
  )
}

/*
🦉 Elaboration & Feedback
After the instruction, copy the URL below into your browser and fill out the form:
http://ws.kcd.im/?ws=Concurrent%20React&e=Coordinate%20Suspending%20components%20with%20SuspenseList&em=
*/

////////////////////////////////////////////////////////////////////
//                                                                //
//                 Don't make changes below here.                 //
// But do look at it to see how your code is intended to be used. //
//                                                                //
////////////////////////////////////////////////////////////////////

export default App
