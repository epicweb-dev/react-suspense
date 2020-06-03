import {setupWorker} from 'msw'
import {handlers} from './server-handlers'
import {homepage} from '../../../package.json'

document.addEventListener('DOMContentLoaded', async () => {
  console.log('loaded')
  const registrations = await navigator.serviceWorker.getRegistrations()
  console.log(registrations)
})

const observer = new MutationObserver(() => {
  stopServer()
})

// Start observing the target node for configured mutations
// observer.observe(targetNode, config)

// // Later, you can stop observing
// observer.disconnect()

async function stopServer() {
  console.log('stopping')
  const registrations = await navigator.serviceWorker.getRegistrations()
  if (registrations.length) {
    await Promise.all(registrations.map(r => r.unregister()))
    // window.location.reload()
  }
}

stopServer()

function startMockServer() {
  console.log('starting mock server')
  const fullUrl = new URL(homepage)

  const server = setupWorker(...handlers)

  if (!navigator.serviceWorker) {
    if (
      window.location.protocol !== 'https:' &&
      window.location.hostname !== 'localhost'
    ) {
      const currentURL = new URL(window.location.toString())
      currentURL.protocol = 'https:'
      window.location.replace(currentURL.toString())
    }
    throw new Error('This app requires service worker support (over HTTPS).')
  }

  const originalFetch = window.fetch

  const serverReady = server
    .start({
      quiet: true,
      serviceWorker: {
        url: fullUrl.pathname + 'mockServiceWorker.js',
      },
    })
    .then(() => {
      window.fetch = originalFetch
    })

  // ensure that the real window.fetch is not called until the server is ready
  window.fetch = async (...args) => {
    await serverReady
    // now that the server is ready, we can restore the original fetch
    window.fetch = originalFetch
    return originalFetch(...args)
  }
  setTimeout(() => {
    server.stop()
    stopServer()
  }, 4000)
  return server
}
export * from 'msw'

window.startMockServer = startMockServer
