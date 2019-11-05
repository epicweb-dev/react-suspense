import React from 'react'
// these imports are just here to make this
// module take a loooonger time to load...
import 'lodash'
import 'moment'
import 'd3'

function PokemonForm({initialPokemonName, onSubmit}) {
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
  )
}

export default PokemonForm
