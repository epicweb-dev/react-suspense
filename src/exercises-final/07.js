// Coordinate suspending components with SuspenseList

// http://localhost:3000/isolated/exercises-final/07

import React from 'react'
import fetchPokemon, {getImageUrlForPokemon} from '../fetch-pokemon'
import {ErrorBoundary} from '../utils'

const PokemonForm = React.lazy(() => import('../pokemon-form'))

// By default, all fetches are mocked so we can control the time easily.
// You can adjust the fetch time with this:
window.FETCH_TIME = 0
// If you want to make an actual network call for the pokemon
// then uncomment the following line
// window.fetch.restoreOriginalFetch()
// Note that by doing this, the FETCH_TIME will no longer be considered
// and if you want to slow things down you should use the Network tab
// in your developer tools to throttle your network to something like "Slow 3G"

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

function createPokemonResource(pokemonName) {
  const lowerName = pokemonName
  const data = createResource(() => fetchPokemon(lowerName))
  const image = createResource(
    () =>
      new Promise(resolve => {
        const img = new Image()
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
    </div>
  )
}

const SUSPENSE_CONFIG = {
  timeoutMs: 4000,
  busyDelayMs: 300, // this time is the same as our css transition delay
  busyMinDurationMs: 500,
}
const pokemonResourceCache = {}

function usePokemonResource(pokemonName) {
  const [pokemonResource, setPokemonResource] = React.useState(null)
  const [startTransition, isPending] = React.useTransition(SUSPENSE_CONFIG)
  const lowerName = pokemonName.toLowerCase()

  React.useLayoutEffect(() => {
    if (!lowerName) {
      return
    }
    let resource = pokemonResourceCache[lowerName]
    if (!resource) {
      resource = createPokemonResource(lowerName)
      pokemonResourceCache[lowerName] = resource
    }
    startTransition(() => setPokemonResource(resource))

    // ESLint wants me to add startTransition to the dependency list. I'm
    // excluding it like we are because of a known bug which will be fixed
    // before the stable release of Concurrent React:
    // https://github.com/facebook/react/issues/17273
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lowerName])

  return [pokemonResource, isPending]
}

function App() {
  const initialPokemonName = 'pikachu'
  const [submittedPokemonName, setSubmittedPokemonName] = React.useState(
    initialPokemonName,
  )

  const [pokemonResource, isPending] = usePokemonResource(submittedPokemonName)

  return (
    <div>
      <React.SuspenseList revealOrder="together">
        <ErrorBoundary>
          <React.Suspense fallback={<div>Loading pokemon form...</div>}>
            <PokemonForm
              initialPokemonName={initialPokemonName}
              onSubmit={newPokemonName =>
                setSubmittedPokemonName(newPokemonName)
              }
            />
          </React.Suspense>
        </ErrorBoundary>
        <hr />
        <div className={`pokemon-info ${isPending ? 'pokemon-loading' : ''}`}>
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
      </React.SuspenseList>
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
