import {createResource} from '../utils'
import fetchPokemon from '../fetch-pokemon'

export default pokemonName => createResource(() => fetchPokemon(pokemonName))
