// Fetch then render 👎
// http://localhost:3000/isolated/examples/fetch-approaches/fetch-then-render.js

import * as React from 'react'
import {fetchPokemon, PokemonForm, PokemonInfoFallback} from '../../pokemon'

const PokemonInfo = React.lazy(() =>
  import('./lazy/pokemon-info-fetch-then-render'),
)

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
  const [pokemonName, setPokemonName] = React.useState('')
  const {pokemon, error, status} = usePokemon(pokemonName)

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div>
      <h1 style={{textAlign: 'center'}}>
        {'Fetch then render '}
        <span role="img" aria-label="thumbs down">
          👎
        </span>
      </h1>
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
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
            <React.Suspense
              fallback={<PokemonInfoFallback name={pokemonName} />}
            >
              <PokemonInfo pokemon={pokemon} />
            </React.Suspense>
          ) : null
        ) : (
          'Submit a pokemon'
        )}
      </div>
    </div>
  )
}

export default App
