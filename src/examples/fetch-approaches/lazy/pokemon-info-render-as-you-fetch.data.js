// http://localhost:3000/isolated/examples/fetch-approaches/lazy/pokemon-info-render-as-you-fetch.data.js

import {createResource, preloadImage} from '../../../utils'
import fetchPokemon, {getImageUrlForPokemon} from '../../../fetch-pokemon'

function createPokemonResource(pokemonName) {
  const lowerName = pokemonName
  const data = createResource(() => fetchPokemon(lowerName), {id: lowerName})
  const image = createResource(() =>
    preloadImage(getImageUrlForPokemon(lowerName), {id: lowerName}),
  )
  return {data, image}
}

export default createPokemonResource
