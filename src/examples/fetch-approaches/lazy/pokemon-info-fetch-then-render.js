import React from 'react'
import {PokemonDataView} from '../../../utils'

function PokemonInfo({pokemon}) {
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
}

export default PokemonInfo
