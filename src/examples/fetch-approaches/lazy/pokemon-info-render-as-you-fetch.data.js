import {createResource, preloadImage} from '../../../utils'
import fetchPokemon, {getImageUrlForPokemon} from '../../../fetch-pokemon'

function createPokemonResource(pokemonName) {
  const lowerName = pokemonName
  const data = createResource(() => fetchPokemon(lowerName))
  const image = createResource(() =>
    preloadImage(getImageUrlForPokemon(lowerName)),
  )
  return {data, image}
}

export default createPokemonResource
