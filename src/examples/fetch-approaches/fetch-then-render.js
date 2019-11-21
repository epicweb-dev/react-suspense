// Fetch then render 👎

// http://localhost:3000/isolated/examples/fetch-approaches/fetch-then-render

import React from 'react'
import fetchPokemon from '../../fetch-pokemon'
import {PokemonForm, PokemonInfoFallback} from '../../utils'

const PokemonInfo = React.lazy(() =>
  import('./lazy/pokemon-info-fetch-then-render'),
)

window.fetch.restoreOriginalFetch()

function usePokemon(pokemonName) {
  const [state, setState] = React.useReducer((s, a) => ({...s, ...a}), {
    pokemon: null,
    error: null,
    status: 'pending',
  })

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    let current = true
    setState({status: 'pending'})
    fetchPokemon(pokemonName).then(
      p => {
        if (current) setState({pokemon: p, status: 'success'})
      },
      e => {
        if (current) setState({error: e, status: 'error'})
      },
    )
    return () => (current = false)
  }, [pokemonName])

  return state
}

function App() {
  const [pokemonName, setPokemonName] = React.useState(null)
  const {pokemon, error, status} = usePokemon(pokemonName)

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div>
      <PokemonForm onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        {pokemonName ? (
          status === 'pending' ? (
            <PokemonInfoFallback name={pokemonName} />
          ) : status === 'error' ? (
            <div>
              There was an error.
              <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
            </div>
          ) : status === 'success' ? (
            <PokemonInfo pokemon={pokemon} />
          ) : null
        ) : (
          'Submit a pokemon'
        )}
      </div>
    </div>
  )
}

export default App
