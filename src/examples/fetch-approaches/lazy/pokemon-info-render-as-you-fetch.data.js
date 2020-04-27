// http://localhost:3000/isolated/examples/fetch-approaches/lazy/pokemon-info-render-as-you-fetch.data.js

import {createResource, preloadImage} from '../../../utils'
import {fetchPokemon, getImageUrlForPokemon} from '../../../pokemon'

function createPokemonResource(pokemonName) {
  const data = createResource(() => fetchPokemon(pokemonName), {
    id: pokemonName,
  })
  const image = createResource(() =>
    preloadImage(getImageUrlForPokemon(pokemonName), {id: pokemonName}),
  )
  return {data, image, id: pokemonName}
}

export default createPokemonResource
