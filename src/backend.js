import {graphql, rest} from '@kentcdodds/react-workshop-app/server'

const pokemonApi = graphql.link('https://graphql-pokemon2.vercel.app/')

export const handlers = [
  rest.get('/pokemoney/:pokemonName', (req, res, ctx) => {
    // there's no "real API" for this, so we can't react to this setting
    // if (window.useRealAPI) return ctx.fetch(req)

    const {pokemonName} = req.params

    const upperName = name =>
      `${name.slice(0, 1).toUpperCase()}${name.slice(1)}`

    const pokemonTransactions = allTransactions.filter(
      t => t.recipient !== pokemonName,
    )
    const user = allUsers[pokemonName]
    if (!user) {
      throw new Error(
        `${pokemonName} is not a user. Try ${Object.keys(allUsers).join(', ')}`,
      )
    }
    return res(
      ctx.json({
        transactions: pokemonTransactions,
        friends: Object.keys(allUsers)
          .filter(u => pokemonName !== u)
          .map(n => upperName(n)),
        ...user,
        name: upperName(pokemonName),
      }),
    )
  }),
  pokemonApi.query('PokemonInfo', (req, res, ctx) => {
    if (window.useRealAPI) return ctx.fetch(req)

    const pokemon = allPokemon[req.variables.name.toLowerCase()]
    if (pokemon) {
      return res(ctx.status(200), ctx.data({pokemon}))
    } else {
      const pokemonNames = Object.keys(allPokemon)
      const randomName =
        pokemonNames[Math.floor(pokemonNames.length * Math.random())]
      return res(
        ctx.status(404),
        ctx.data({
          errors: [
            {
              message: `Unsupported pokemon: "${req.variables.name}". Try "${randomName}"`,
            },
          ],
        }),
      )
    }
  }),
]

const allPokemon = {
  pikachu: {
    id: 'UG9rZW1vbjowMjU=',
    number: '025',
    name: 'Pikachu',
    image: '/img/pokemon/pikachu.jpg',
    attacks: {
      special: [
        {
          name: 'Discharge',
          type: 'Electric',
          damage: 35,
        },
        {
          name: 'Thunder',
          type: 'Electric',
          damage: 100,
        },
        {
          name: 'Thunderbolt',
          type: 'Electric',
          damage: 55,
        },
      ],
    },
  },
  mew: {
    id: 'UG9rZW1vbjoxNTE=',
    number: '151',
    image: '/img/pokemon/mew.jpg',
    name: 'Mew',
    attacks: {
      special: [
        {
          name: 'Dragon Pulse',
          type: 'Dragon',
          damage: 65,
        },
        {
          name: 'Earthquake',
          type: 'Ground',
          damage: 100,
        },
        {
          name: 'Fire Blast',
          type: 'Fire',
          damage: 100,
        },
        {
          name: 'Hurricane',
          type: 'Flying',
          damage: 80,
        },
        {
          name: 'Hyper Beam',
          type: 'Normal',
          damage: 120,
        },
        {
          name: 'Moonblast',
          type: 'Fairy',
          damage: 85,
        },
        {
          name: 'Psychic',
          type: 'Psychic',
          damage: 55,
        },
        {
          name: 'Solar Beam',
          type: 'Grass',
          damage: 120,
        },
        {
          name: 'Thunder',
          type: 'Electric',
          damage: 100,
        },
      ],
    },
  },
  mewtwo: {
    id: 'UG9rZW1vbjoxNTA=',
    number: '150',
    image: '/img/pokemon/mewtwo.jpg',
    name: 'Mewtwo',
    attacks: {
      special: [
        {
          name: 'Hyper Beam',
          type: 'Normal',
          damage: 120,
        },
        {
          name: 'Psychic',
          type: 'Psychic',
          damage: 55,
        },
        {
          name: 'Shadow Ball',
          type: 'Ghost',
          damage: 45,
        },
      ],
    },
  },
  ditto: {
    id: 'UG9rZW1vbjoxMzI=',
    number: '132',
    image: '/img/pokemon/ditto.jpg',
    name: 'Ditto',
    attacks: {
      special: [
        {
          name: 'Struggle',
          type: 'Normal',
          damage: 15,
        },
      ],
    },
  },
  charizard: {
    id: 'UG9rZW1vbjowMDY=',
    number: '006',
    name: 'Charizard',
    image: '/img/pokemon/charizard.jpg',
    attacks: {
      special: [
        {
          name: 'Dragon Claw',
          type: 'Dragon',
          damage: 35,
        },
        {
          name: 'Fire Blast',
          type: 'Fire',
          damage: 100,
        },
        {
          name: 'Flamethrower',
          type: 'Fire',
          damage: 55,
        },
      ],
    },
  },
  bulbasaur: {
    id: 'UG9rZW1vbjowMDE=',
    number: '001',
    name: 'Bulbasaur',
    image: '/img/pokemon/bulbasaur.jpg',
    attacks: {
      special: [
        {
          name: 'Power Whip',
          type: 'Grass',
          damage: 70,
        },
        {
          name: 'Seed Bomb',
          type: 'Grass',
          damage: 40,
        },
        {
          name: 'Sludge Bomb',
          type: 'Poison',
          damage: 55,
        },
      ],
    },
  },
}

const allTransactions = [
  {
    id: '4P812765GHI029827',
    recipient: 'mew',
    amount: '$ 15.34',
    message: 'Thanks for the salad 🥗',
  },
  {
    id: '90X21040KL118401T',
    recipient: 'charizard',
    amount: '$ 20.00',
    message:
      'Thanks for the tip about Gyarados 🌊. I never would have won otherwise 😈',
  },
  {
    id: '89UI190WJJ2240023',
    recipient: 'bulbasaur',
    amount: '$ 25.00',
    message: 'That play was awesome 🎭. Thanks again for inviting me.',
  },
  {
    id: '0A6FJI65K8173802P',
    recipient: 'ditto',
    amount: '$ 12.21',
    message: 'blub.',
  },
  {
    id: '9CF911038X034441W',
    recipient: 'mewtwo',
    amount: '$ 35.00',
    message:
      "Still can't believe 🔥 Charizard 🔥 won. That's the last time I bet against him.",
  },
  {
    id: '48L3561JH8132451D',
    recipient: 'pikachu',
    amount: '$ 91.10',
    message: 'That was ELECTRIC ⚡',
  },
  {
    id: '6CG59877V61376422',
    recipient: 'ditto',
    amount: '$ 98.89',
    message: 'blub.',
  },
  {
    id: 'U8991IJW02J204032',
    recipient: 'bulbasaur',
    amount: '$ 15.98',
    message: 'Thanks again for the loan 💵',
  },
  {
    id: '8XS08JI93J918102S',
    recipient: 'charizard',
    amount: '$ 45.14',
    message: 'Lunch was delicious, thank you!',
  },
  {
    id: '21CWW205ND917964J',
    recipient: 'mew',
    amount: '$ 12.87',
    message: 'Thanks again for the ride 🍃',
  },
]

const allUsers = {
  pikachu: {
    name: 'Pikachu',
    color: '#EDD37E',
  },
  mew: {
    name: 'Mew',
    color: '#ECC4D0',
  },
  mewtwo: {
    name: 'Mewtwo',
    color: '#BAABBA',
  },
  ditto: {
    name: 'Ditto',
    color: '#BDAED1',
  },
  charizard: {
    name: 'Charizard',
    color: '#EAC492',
  },
  bulbasaur: {
    name: 'Bulbasaur',
    color: '#7DAD96',
  },
}
