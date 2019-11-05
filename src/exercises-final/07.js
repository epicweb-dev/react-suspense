// Simple Data-fetching
// 💯 make more generic createResource

// http://localhost:3000/isolated/exercises-final/07

import React from 'react'
import fetchPokemon, {getImageUrlForPokemon} from '../fetch-pokemon'
import {ErrorBoundary} from '../utils'

// preloads our fallback image
document.createElement('img').src = '/img/pokemon/fallback-pokemon.jpg'

// if you want to make an actual network call for the pokemon
// then uncomment the following line.
// window.fetch.restoreOriginalFetch()
// and you can adjust the fetch time with this:
window.FETCH_TIME = 12000
window.FETCH_TIME_RANDOM = true
window.MIN_FETCH_TIME = 5000

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

const favoritePokemon = [
  'charizard',
  'bulbasaur',
  'ditto',
  'mewtwo',
  'mew',
  'pikachu',
  // if you are using the graphql endpoint, then try these:
  // 'eevee',
  // 'snorlax',
  // 'charmander',
  // 'gengar',
  // 'squirtle',
  // 'dragonite',
  // 'jigglypuff',
  // 'gyarados',
  // 'raichu',
  // 'psyduck',
  // 'vulpix',
  // 'ninetales',
]

function shuffle(array) {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = newArray[i]
    newArray[i] = newArray[j]
    newArray[j] = temp
  }
  return newArray
}

const SUSPENSE_CONFIG = {timeoutMs: 500}

function PlaceholderPokemon({name}) {
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src="/img/pokemon/fallback-pokemon.jpg" alt={name} />
      </div>
      <section>
        <h2>
          {name}
          <sup>loading...</sup>
        </h2>
      </section>
    </div>
  )
}

function App() {
  const [
    favoritePokemonResources,
    setFavoritePokemonResources,
  ] = React.useState([])
  const [startTransition, isPending] = React.useTransition(SUSPENSE_CONFIG)

  function handleGoClick() {
    startTransition(() => {
      const newResources = shuffle(favoritePokemon).map(name => ({
        name,
        resource: createPokemonResource(name),
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
        <React.SuspenseList revealOrder="forwards">
          {favoritePokemonResources.map(({name, resource}) => (
            <div
              key={name}
              className="pokemon-info"
              style={{margin: 20, height: 'auto'}}
            >
              <ErrorBoundary>
                <React.Suspense fallback={<PlaceholderPokemon name={name} />}>
                  <PokemonInfo pokemonResource={resource} />
                </React.Suspense>
              </ErrorBoundary>
            </div>
          ))}
        </React.SuspenseList>
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
