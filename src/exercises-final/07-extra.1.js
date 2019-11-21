// Coordinate Suspending components with SuspenseList
// 💯 eagerly load modules as resources

// http://localhost:3000/isolated/exercises-final/07-extra.1

import React from 'react'
import '../suspense-list/style-overrides.css'
import * as cn from '../suspense-list/app.module.css'
import Spinner from '../suspense-list/spinner'
import {createResource, ErrorBoundary, PokemonForm} from '../utils'
import {fetchUser} from '../fetch-pokemon'

function createDelayedResource(fn, delay) {
  return createResource(async () => {
    const result = await fn()
    await new Promise(resolve => setTimeout(resolve, delay))
    return result
  })
}

function Lazy({moduleResource, ...props}) {
  const Comp = moduleResource.read().default
  return <Comp {...props} />
}

const fallback = (
  <div className={cn.spinnerContainer}>
    <Spinner />
  </div>
)

const SUSPENSE_CONFIG = {timeoutMs: 4000}

function App() {
  const [startTransition] = React.useTransition(SUSPENSE_CONFIG)
  const [lazyResources, setLazyResources] = React.useState({})
  const [pokemonResource, setPokemonResource] = React.useState(null)

  function handleSubmit(pokemonName) {
    startTransition(() => {
      setPokemonResource(createResource(() => fetchUser(pokemonName)))
      setLazyResources({
        navBar: createDelayedResource(
          () => import('../suspense-list/nav-bar'),
          500,
        ),
        leftNav: createDelayedResource(
          () => import('../suspense-list/left-nav'),
          2000,
        ),
        mainContent: createDelayedResource(
          () => import('../suspense-list/main-content'),
          1500,
        ),
        rightNav: createDelayedResource(
          () => import('../suspense-list/right-nav'),
          1000,
        ),
      })
    })
  }

  if (!pokemonResource) {
    return (
      <div className={`${cn.root} totally-centered`} style={{height: '100vh'}}>
        <PokemonForm onSubmit={handleSubmit} />
      </div>
    )
  }

  return (
    <div className={cn.root}>
      <ErrorBoundary>
        <React.SuspenseList revealOrder="forwards" tail="collapsed">
          <React.Suspense fallback={fallback}>
            <Lazy
              moduleResource={lazyResources.navBar}
              pokemonResource={pokemonResource}
            />
          </React.Suspense>
          <div className={cn.mainContentArea}>
            <React.SuspenseList revealOrder="forwards">
              <React.Suspense fallback={fallback}>
                <Lazy moduleResource={lazyResources.leftNav} />
              </React.Suspense>
              <React.SuspenseList revealOrder="together">
                <React.Suspense fallback={fallback}>
                  <Lazy
                    moduleResource={lazyResources.mainContent}
                    pokemonResource={pokemonResource}
                  />
                </React.Suspense>
                <React.Suspense fallback={fallback}>
                  <Lazy moduleResource={lazyResources.rightNav} />
                </React.Suspense>
              </React.SuspenseList>
            </React.SuspenseList>
          </div>
        </React.SuspenseList>
      </ErrorBoundary>
    </div>
  )
}

export default App
