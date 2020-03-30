import allPokemon from './pokemon.json'
// Please don't actually do this in a real app
// this is here to make it easy for us to simulate making HTTP calls in this
// little app that doesn't actually have any server element.
const originalFetch = window.fetch

// Allows us to restore the original fetch
originalFetch.restoreOriginalFetch = () => (window.fetch = originalFetch)
originalFetch.overrideFetch = () => (window.fetch = hackFetch)

window.FETCH_TIME = 0
window.MIN_FETCH_TIME = 500
window.FETCH_TIME_RANDOM = false

function sleep(t = window.FETCH_TIME) {
  if (window.FETCH_TIME_RANDOM) {
    t = Math.random() * t + window.MIN_FETCH_TIME
  }
  return new Promise(resolve => setTimeout(resolve, t))
}

const fakeResponses = [
  {
    test: url => url.includes('pokemon'),
    handler: async (url, config) => {
      const body = JSON.parse(config.body)
      await sleep()
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
  // fallback to originalFetch
  {
    test: () => true,
    handler: (...args) => originalFetch(...args),
  },
]

async function hackFetch(...args) {
  const {handler} = fakeResponses.find(({test}) => {
    try {
      return test(...args)
    } catch (error) {
      // ignore the error and hope everything's ok...
      return false
    }
  })
  const groupTitle = `%c ${args[1].method} -> ${args[0]}`
  try {
    const response = await handler(...args)
    console.groupCollapsed(groupTitle, 'color: #0f9d58')
    let parsedBody
    try {
      parsedBody = JSON.parse(args[1].body)
    } catch (error) {
      // ignore
    }
    console.info('REQUEST:', {
      url: args[0],
      ...args[1],
      ...(parsedBody ? {parsedBody} : null),
    })
    console.info('RESPONSE:', {
      ...response,
      ...(response.json ? {json: await response.json()} : {}),
    })
    console.groupEnd()
    return response
  } catch (error) {
    let rejection = error
    if (error instanceof Error) {
      rejection = {
        status: 500,
        message: error.message,
      }
    }
    console.groupCollapsed(groupTitle, 'color: #ef5350')
    console.info('REQUEST:', {url: args[0], ...args[1]})
    console.info('REJECTION:', rejection)
    console.groupEnd()
    return Promise.reject(rejection)
  }
}
hackFetch.isHacked = true
Object.assign(hackFetch, window.fetch)

// alright. Let's hack fetch!
window.fetch.overrideFetch()
