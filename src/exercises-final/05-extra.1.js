// Cache resources
// 💯 Cache in Context
// This one's really experimental and doesn't work right now. I think it's probably a bad idea.

// http://localhost:3000/isolated/exercises-final/05-extra.1

import React from 'react'
import fetchPokemon, {getImageUrlForPokemon} from '../fetch-pokemon'
import {ErrorBoundary} from '../utils'

// By default, all fetches are mocked so we can control the time easily.
// You can adjust the fetch time with this:
// window.FETCH_TIME = 3000
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

function PokemonInfo({pokemonName}) {
  const pokemonResource = usePokemonResource(pokemonName)
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

function App() {
  const [addPokemonResource, isPending] = useAddPokemonResource()
  const [{submittedPokemonName, pokemonName}, setState] = React.useReducer(
    (state, action) => ({...state, ...action}),
    {submittedPokemonName: '', pokemonName: ''},
  )

  React.useEffect(() => {
    addPokemonResource(submittedPokemonName)
  }, [addPokemonResource, submittedPokemonName])

  function handleChange(e) {
    setState({pokemonName: e.target.value})
  }

  function handleSubmit(e) {
    e.preventDefault()
    setState({submittedPokemonName: pokemonName})
  }

  function handleSelect(newPokemonName) {
    setState({
      submittedPokemonName: newPokemonName,
      pokemonName: newPokemonName,
    })
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
      <div className={`pokemon-info ${isPending ? 'pokemon-loading' : ''}`}>
        <ErrorBoundary>
          <React.Suspense fallback={<div>Loading Pokemon...</div>}>
            {submittedPokemonName ? (
              <PokemonInfo pokemonName={submittedPokemonName} />
            ) : (
              'Submit a pokemon'
            )}
          </React.Suspense>
        </ErrorBoundary>
      </div>
    </div>
  )
}

const PokemonResourcesContext = React.createContext()
const AddPokemonResourceContext = React.createContext()

function PokemonProvider({children}) {
  const [startTransition, isPending] = React.useTransition(SUSPENSE_CONFIG)
  const [resources, setResources] = React.useState({})

  const addResource = React.useCallback(name => {
    if (!name) {
      return
    }
    startTransition(() => {
      setResources(currentResources => {
        const lowerName = name.toLowerCase()
        if (currentResources[lowerName]) {
          return currentResources
        } else {
          return {
            ...currentResources,
            [lowerName]: createPokemonResource(lowerName),
          }
        }
      })
    })
    // ESLint wants me to add startTransition to the dependency list. I'm
    // excluding it like we are because of a known bug which will be fixed
    // before the stable release of Concurrent React:
    // https://github.com/facebook/react/issues/17273
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addResourceContextValue = React.useMemo(
    () => [addResource, isPending],
    [addResource, isPending],
  )
  return (
    <PokemonResourcesContext.Provider value={resources}>
      <AddPokemonResourceContext.Provider value={addResourceContextValue}>
        {children}
      </AddPokemonResourceContext.Provider>
    </PokemonResourcesContext.Provider>
  )
}

function usePokemonResource(pokemonName) {
  const resources = React.useContext(PokemonResourcesContext)
  if (!resources) {
    throw new Error(
      'usePokemonResource must be used within the <PokemonProvider />',
    )
  }
  return resources[pokemonName]
}

function useAddPokemonResource() {
  const addResourceContextValue = React.useContext(AddPokemonResourceContext)
  if (!addResourceContextValue) {
    throw new Error(
      'useAddPokemonResource must be used within the <PokemonProvider />',
    )
  }
  return addResourceContextValue
}

function AppWithProviders() {
  return (
    <PokemonProvider>
      <App />
    </PokemonProvider>
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

export default AppWithProviders

/*
eslint
  jsx-a11y/alt-text: off
*/
