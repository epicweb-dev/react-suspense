import React from 'react'
import {createResource, preloadImage} from './utils'

import transactions from './hacks/transactions'
import users from './hacks/users'
import pkg from '../package.json'
// if you need this to work locally then comment out the import above and comment in the next line
// const pkg = {homepage: '/'}

// You really only get the benefit of pre-loading an image when the cache-control
// is set to cache the image for some period of time. We can't do that with our
// local server, but we are hosting the images on netlify so we can use those
// instead. Note our public/_headers file that forces these to cache.
const fallbackImgUrl = `${pkg.homepage}img/pokemon/fallback-pokemon.jpg`
preloadImage(`${pkg.homepage}img/pokeball.png`)
preloadImage(fallbackImgUrl)

window.FETCH_TIME = undefined
window.MIN_FETCH_TIME = 500
window.FETCH_TIME_RANDOM = false

function sleep(t = window.FETCH_TIME) {
  t = window.FETCH_TIME ?? t
  if (window.FETCH_TIME_RANDOM) {
    t = Math.random() * t + window.MIN_FETCH_TIME
  }
  return new Promise(resolve => setTimeout(resolve, t))
}

const formatDate = date =>
  `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')} ${String(
    date.getSeconds(),
  ).padStart(2, '0')}.${String(date.getMilliseconds()).padStart(3, '0')}`

// the delay argument is for faking things out a bit
function fetchPokemon(name, delay = 1500) {
  const endTime = Date.now() + delay
  const pokemonQuery = `
    query ($name: String) {
      pokemon(name: $name) {
        id
        number
        name
        image
        attacks {
          special {
            name
            type
            damage
          }
        }
      }
    }
  `

  return window
    .fetch('https://graphql-pokemon.now.sh', {
      // learn more about this API here: https://graphql-pokemon.now.sh/
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        query: pokemonQuery,
        variables: {name: name.toLowerCase()},
      }),
    })
    .then(response => response.json())
    .then(async response => {
      await sleep(endTime - Date.now())
      return response
    })
    .then(response => {
      const pokemon = response.data.pokemon
      if (pokemon) {
        pokemon.fetchedAt = formatDate(new Date())
        return pokemon
      } else {
        return Promise.reject(new Error(`No pokemon with the name "${name}"`))
      }
    })
}

function getImageUrlForPokemon(pokemonName) {
  if (fetch.isHacked) {
    return `${pkg.homepage}img/pokemon/${pokemonName.toLowerCase()}.jpg`
  } else {
    return `https://img.pokemondb.net/artwork/${pokemonName.toLowerCase()}.jpg`
  }
}

async function fetchUser(pokemonName, delay = 0) {
  await sleep(delay)
  const lowerName = pokemonName.toLowerCase()
  const pokemonTransactions = transactions.filter(
    t => t.recipient !== lowerName,
  )
  const user = users[lowerName]
  if (!user) {
    throw new Error(
      `${pokemonName} is not a user. Try ${Object.keys(users).join(', ')}`,
    )
  }
  return {
    transactions: pokemonTransactions,
    friends: Object.keys(users)
      .filter(u => lowerName !== u)
      .map(n => upperName(n)),
    ...user,
    name: upperName(lowerName),
  }
}
const upperName = name => `${name.slice(0, 1).toUpperCase()}${name.slice(1)}`

function PokemonInfoFallback({name}) {
  const initialName = React.useRef(name).current
  const fallbackPokemonData = {
    name: initialName,
    number: 'XXX',
    attacks: {
      special: [
        {name: 'Loading Attack 1', type: 'Type', damage: 'XX'},
        {name: 'Loading Attack 2', type: 'Type', damage: 'XX'},
      ],
    },
    fetchedAt: 'loading...',
  }
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={fallbackImgUrl} alt={initialName} />
      </div>
      <PokemonDataView pokemon={fallbackPokemonData} />
    </div>
  )
}

function PokemonDataView({pokemon}) {
  return (
    <>
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
    </>
  )
}

function PokemonForm({initialPokemonName = '', onSubmit}) {
  const [pokemonName, setPokemonName] = React.useState(initialPokemonName)

  function handleChange(e) {
    setPokemonName(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(pokemonName)
  }

  function handleSelect(newPokemonName) {
    setPokemonName(newPokemonName)
    onSubmit(newPokemonName)
  }

  return (
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
          className="pokemonName-input"
          id="pokemonName-input"
          name="pokemonName"
          placeholder="Pokemon Name..."
          value={pokemonName}
          onChange={handleChange}
        />
        <button type="submit" disabled={!pokemonName.length}>
          Submit
        </button>
      </div>
    </form>
  )
}

const SUSPENSE_CONFIG = {
  timeoutMs: 4000,
  busyDelayMs: 300, // this time is slightly shorter than our css transition delay
  busyMinDurationMs: 700,
}

const PokemonResourceCacheContext = React.createContext({})

function usePokemonResourceCache() {
  const cache = React.useContext(PokemonResourceCacheContext)
  return React.useCallback(
    name => {
      const lowerName = name.toLowerCase()
      let resource = cache[lowerName]
      if (!resource) {
        resource = createPokemonResource(lowerName)
        cache[lowerName] = resource
      }
      return resource
    },
    [cache],
  )
}

function createPokemonResource(pokemonName) {
  const data = createResource(fetchPokemon(pokemonName))
  const image = createResource(preloadImage(getImageUrlForPokemon(pokemonName)))
  return {data, image}
}

function usePokemonResource(pokemonName) {
  const [pokemonResource, setPokemonResource] = React.useState(null)
  const [startTransition, isPending] = React.useTransition(SUSPENSE_CONFIG)
  const getPokemonResource = usePokemonResourceCache()

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    startTransition(() => {
      setPokemonResource(getPokemonResource(pokemonName))
    })
  }, [getPokemonResource, pokemonName, startTransition])

  return [pokemonResource, isPending]
}

export {
  fetchPokemon,
  getImageUrlForPokemon,
  fetchUser,
  usePokemonResource,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
}
