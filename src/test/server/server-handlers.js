import {graphql, rest} from 'msw'
import allPokemon from '../data/pokemon.json'

const handlers = [
  graphql.query('Pokemon', async (req, res, ctx) => {
    const endTime = Number(req.headers.get('delay') || '0') + Date.now()
    const {name} = req.variables
    const pokemon = allPokemon[name]
    if (!pokemon) {
      return res(
        ctx.delay(endTime - Date.now()),
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
    return res(ctx.delay(endTime - Date.now()), ctx.data({pokemon}))
  }),
  rest.get('/sw-test.json', async (req, res, ctx) => {
    return res(ctx.json({serviceWorker: 'enabled'}))
  }),
]

export {handlers}
