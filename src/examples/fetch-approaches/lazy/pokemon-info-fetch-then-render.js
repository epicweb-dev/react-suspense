// http://localhost:3000/isolated/examples/fetch-approaches/lazy/pokemon-info-fetch-then-render.js

import * as React from 'react'
import {PokemonDataView} from '../../../pokemon'

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
