// http://localhost:3000/isolated/examples/fetch-approaches/lazy/pokemon-info-render-as-you-fetch.data.js

import {createResource, preloadImage} from '../../../utils'
import {fetchPokemon, getImageUrlForPokemon} from '../../../pokemon'

function createPokemonResource(pokemonName) {
  const data = createResource(fetchPokemon(pokemonName))
  const image = createResource(preloadImage(getImageUrlForPokemon(pokemonName)))
  return {data, image}
}

export default createPokemonResource
