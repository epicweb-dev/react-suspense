// Coordinate Suspending components with SuspenseList

// http://localhost:3000/isolated/exercises-final/07-extra.1

import React from 'react'
import '../suspense-list/style-overrides.css'
import * as cn from '../suspense-list/app.module.css'
import Spinner from '../suspense-list/spinner'
import {createResource} from '../utils'

const sleep = time => new Promise(resolve => setTimeout(resolve, time))

function createDelayedResource(fn, delay) {
  return createResource(async () => {
    const result = await fn()
    await sleep(delay)
    return result
  })
}

function Lazy({moduleResource, ...props}) {
  const Comp = moduleResource.read()
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
  const [loggedIn, setLoggedIn] = React.useState(false)
  const [lazyResources, setLazyResources] = React.useState({})
  function handleLogin() {
    startTransition(() => {
      setLoggedIn(true)
      setLazyResources({
        navBar: createDelayedResource(
          () => import('../suspense-list/nav-bar').then(c => c.default),
          500,
        ),
        leftNav: createDelayedResource(
          () => import('../suspense-list/left-nav').then(c => c.default),
          2000,
        ),
        mainContent: createDelayedResource(
          () => import('../suspense-list/main-content').then(c => c.default),
          1500,
        ),
        rightNav: createDelayedResource(
          () => import('../suspense-list/right-nav').then(c => c.default),
          1000,
        ),
      })
    })
  }
  if (!loggedIn) {
    return (
      <div className="totally-centered" style={{height: '100vh'}}>
        <button onClick={handleLogin}>Login</button>
      </div>
    )
  }
  return (
    <div className={cn.root}>
      <React.SuspenseList revealOrder="forwards" tail="collapsed">
        <React.Suspense fallback={fallback}>
          <Lazy moduleResource={lazyResources.navBar} />
        </React.Suspense>
        <div className={cn.mainContentArea}>
          <React.SuspenseList revealOrder="forwards">
            <React.Suspense fallback={fallback}>
              <Lazy moduleResource={lazyResources.leftNav} />
            </React.Suspense>
            <React.SuspenseList revealOrder="together">
              <React.Suspense fallback={fallback}>
                <Lazy moduleResource={lazyResources.mainContent} />
              </React.Suspense>
              <React.Suspense fallback={fallback}>
                <Lazy moduleResource={lazyResources.rightNav} />
              </React.Suspense>
            </React.SuspenseList>
          </React.SuspenseList>
        </div>
      </React.SuspenseList>
    </div>
  )
}

export default App
