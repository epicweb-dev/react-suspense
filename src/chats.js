import faker from 'faker'

const getResource = {
  link: () => ({
    id: faker.random.uuid(),
    url: 'https://www.dropbox.com/s/bfb3lx0hggqy22g/who-pokemon.png?raw=1',
    title: `Who's that pokemon?`,
  }),
  image: () => ({
    id: faker.random.uuid(),
    url: `https://www.dropbox.com/s/wikynrx5x9xyafg/ash.png?raw=1`,
    title: 'Ash looking toward the sky',
  }),
  video: () => ({
    id: faker.random.uuid(),
    url: `https://www.dropbox.com/s/vu6281f0wt0inmg/pokemon-theme.mp4?raw=1`,
    title: `Pokemon Theme Song Music Video`,
  }),
  audio: () => ({
    id: faker.random.uuid(),
    url: `https://www.dropbox.com/s/mzkp1sbr6ewbwec/pokemon-theme.m4a?raw=1`,
    title: `Pokemon Theme Song`,
  }),
  event: () => ({
    id: faker.random.uuid(),
    url: `https://www.dropbox.com/s/6i7qiqa3jotlak7/pokemon-go-event.jpg?raw=1`,
    title: `Pokemon Go tournament!`,
  }),
}

const getLink = {
  link: () => `https://www.youtube.com/watch?v=EE-xtCF3T94`,
}

function createChat(overrides = {}) {
  const type =
    overrides.type ??
    faker.random.arrayElement([
      'text',
      'link',
      'video',
      'audio',
      'image',
      'event',
    ])
  return {
    id: faker.random.uuid(),
    type,
    message: faker.lorem.paragraph(),
    link: getLink[type]?.() ?? faker.internet.url(),
    resource: getResource[type]?.() ?? {},
    ...overrides,
  }
}

export {createChat}
