import {graphql} from 'msw'
import allPokemon from '../data/pokemon.json'

const handlers = [
  graphql.query('Pokemon', async (req, res, ctx) => {
    if (window.useRealAPI) {
      const originalResponse = await ctx.fetch(req)
      if (originalResponse.errors) {
        return res(ctx.errors(originalResponse.errors))
      } else {
        return res(ctx.data(originalResponse.data))
      }
    }
    const {name} = req.variables
    const pokemon = allPokemon[name]
    if (!pokemon) {
      return res(
        ctx.errors([
          {
            message: `🚨 fetch calls are mocked so you can work this workshop offline, so we don't support the pokemon with the name "${name}." We only support: ${Object.keys(
              allPokemon,
            ).join(', ')}`,
            errorType: 'UnsupportedPokemon',
          },
        ]),
      )
    }
    return res(ctx.data({pokemon}))
  }),
]

export {handlers}
