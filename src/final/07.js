// Coordinate Suspending components with SuspenseList
// http://localhost:3000/isolated/final/07.js

import * as React from 'react'
import '../suspense-list/style-overrides.css'
import * as cn from '../suspense-list/app.module.css'
import Spinner from '../suspense-list/spinner'
import {createResource} from '../utils'
import {fetchUser, PokemonForm, PokemonErrorBoundary} from '../pokemon'

const delay = time => promiseResult =>
  new Promise(resolve => setTimeout(() => resolve(promiseResult), time))

const NavBar = React.lazy(() =>
  import('../suspense-list/nav-bar').then(delay(500)),
)
const LeftNav = React.lazy(() =>
  import('../suspense-list/left-nav').then(delay(2000)),
)
const MainContent = React.lazy(() =>
  import('../suspense-list/main-content').then(delay(1500)),
)
const RightNav = React.lazy(() =>
  import('../suspense-list/right-nav').then(delay(1000)),
)

const fallback = (
  <div className={cn.spinnerContainer}>
    <Spinner />
  </div>
)

const SUSPENSE_CONFIG = {timeoutMs: 4000}

function App() {
  const [startTransition] = React.useTransition(SUSPENSE_CONFIG)
  const [pokemonResource, setPokemonResource] = React.useState(null)

  function handleSubmit(pokemonName) {
    startTransition(() => {
      setPokemonResource(createResource(fetchUser(pokemonName)))
    })
  }

  if (!pokemonResource) {
    return (
      <div className="pokemon-info-app">
        <div
          className={`${cn.root} totally-centered`}
          style={{height: '100vh'}}
        >
          <PokemonForm onSubmit={handleSubmit} />
        </div>
      </div>
    )
  }

  function handleReset() {
    setPokemonResource(null)
  }

  return (
    <div className="pokemon-info-app">
      <div className={cn.root}>
        <PokemonErrorBoundary
          onReset={handleReset}
          resetKeys={[pokemonResource]}
        >
          <React.SuspenseList revealOrder="forwards" tail="collapsed">
            <React.Suspense fallback={fallback}>
              <NavBar pokemonResource={pokemonResource} />
            </React.Suspense>
            <div className={cn.mainContentArea}>
              <React.SuspenseList revealOrder="forwards">
                <React.Suspense fallback={fallback}>
                  <LeftNav />
                </React.Suspense>
                <React.SuspenseList revealOrder="together">
                  <React.Suspense fallback={fallback}>
                    <MainContent pokemonResource={pokemonResource} />
                  </React.Suspense>
                  <React.Suspense fallback={fallback}>
                    <RightNav pokemonResource={pokemonResource} />
                  </React.Suspense>
                </React.SuspenseList>
              </React.SuspenseList>
            </div>
          </React.SuspenseList>
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

export default App
