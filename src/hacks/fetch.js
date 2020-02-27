import allPokemon from './pokemon.json'

export default [
  {
    test: url => url.includes('pokemon'),
    handler: async (url, config) => {
      const body = JSON.parse(config.body)
      const pokemonName = body.variables.name
      const pokemon = allPokemon[pokemonName]
      if (!pokemon) {
        throw new Error(
          `🚨 fetch calls are "hacked" so you can work this workshop offline, so we don't support the pokemon with the name "${pokemonName}." We only support: ${Object.keys(
            allPokemon,
          ).join(', ')}`,
        )
      }
      return {
        status: 200,
        json: async () => ({data: {pokemon}}),
      }
    },
  },
]
