const formatDate = date =>
  `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')} ${String(
    date.getSeconds(),
  ).padStart(2, '0')}.${String(date.getMilliseconds()).padStart(3, '0')}`

// the delay argument is for faking things out a bit
function fetchPokemon(name, delay) {
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
    .then(r => r.json())
    .then(r => {
      return new Promise(resolve => {
        setTimeout(() => resolve(r), endTime - Date.now())
      })
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
    return `/img/pokemon/${pokemonName.toLowerCase()}.jpg`
  } else {
    return `https://img.pokemondb.net/artwork/${pokemonName.toLowerCase()}.jpg`
  }
}

export default fetchPokemon
export {getImageUrlForPokemon}
