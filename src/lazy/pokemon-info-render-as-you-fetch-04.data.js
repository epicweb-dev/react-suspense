import {createResource} from '../utils'
import fetchPokemon, {getImageUrlForPokemon} from '../fetch-pokemon'

function createPokemonResource(pokemonName) {
  const lowerName = pokemonName
  const data = createResource(() => fetchPokemon(lowerName))
  const image = createResource(
    () =>
      new Promise(resolve => {
        const img = document.createElement('img')
        const src = getImageUrlForPokemon(lowerName)
        img.src = src
        img.onload = () => resolve(src)
      }),
  )
  return {data, image}
}

export default createPokemonResource
