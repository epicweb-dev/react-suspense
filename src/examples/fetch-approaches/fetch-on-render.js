// Fetch on render 👎

// http://localhost:3000/isolated/examples/fetch-approaches/fetch-on-render

import React from 'react'
import {PokemonForm} from '../../utils'

const PokemonInfo = React.lazy(() =>
  import('./lazy/pokemon-info-fetch-on-render'),
)

window.fetch.restoreOriginalFetch()

function App() {
  const [pokemonName, setPokemonName] = React.useState(null)

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div>
      <PokemonForm onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        {pokemonName ? (
          <PokemonInfo pokemonName={pokemonName} />
        ) : (
          'Submit a pokemon'
        )}
      </div>
    </div>
  )
}

export default App
