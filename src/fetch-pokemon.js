import transactions from './hacks/transactions'
import users from './hacks/users'
import pkg from '../package.json'
// if you need this to work locally then comment out the import above and comment in the next line
// const pkg = {homepage: '/'}

const sleep = time => new Promise(resolve => setTimeout(resolve, time))

const formatDate = date =>
  `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')} ${String(
    date.getSeconds(),
  ).padStart(2, '0')}.${String(date.getMilliseconds()).padStart(3, '0')}`

// the delay argument is for faking things out a bit
function fetchPokemon(name, delay = 1500) {
  const endTime = Date.now() + delay
  const pokemonQuery = `
    query ($name: String) {
      pokemon(name: $name) {
        id
        number
        name
        image
        attacks {
          special {
            name
            type
            damage
          }
        }
      }
    }
  `

  return window
    .fetch('https://graphql-pokemon.now.sh', {
      // learn more about this API here: https://graphql-pokemon.now.sh/
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        query: pokemonQuery,
        variables: {name: name.toLowerCase()},
      }),
    })
    .then(response => response.json())
    .then(async response => {
      await sleep(endTime - Date.now())
      return response
    })
    .then(response => {
      const pokemon = response.data.pokemon
      if (pokemon) {
        pokemon.fetchedAt = formatDate(new Date())
        return pokemon
      } else {
        return Promise.reject(new Error(`No pokemon with the name "${name}"`))
      }
    })
}

function getImageUrlForPokemon(pokemonName) {
  if (fetch.isHacked) {
    return `${pkg.homepage}img/pokemon/${pokemonName.toLowerCase()}.jpg`
  } else {
    return `https://img.pokemondb.net/artwork/${pokemonName.toLowerCase()}.jpg`
  }
}

async function fetchUser(pokemonName, delay = 0) {
  await sleep(delay)
  const lowerName = pokemonName.toLowerCase()
  const pokemonTransactions = transactions.filter(
    t => t.recipient !== lowerName,
  )
  const user = users[lowerName]
  if (!user) {
    throw new Error(
      `${pokemonName} is not a user. Try ${Object.keys(users).join(', ')}`,
    )
  }
  return {
    transactions: pokemonTransactions,
    friends: Object.keys(users)
      .filter(u => lowerName !== u)
      .map(n => upperName(n)),
    ...user,
    name: upperName(lowerName),
  }
}
const upperName = name => `${name.slice(0, 1).toUpperCase()}${name.slice(1)}`

export default fetchPokemon
export {getImageUrlForPokemon, fetchUser}
