// Coordinate Suspending components with SuspenseList
// 💯 eagerly load modules as resources

// http://localhost:3000/isolated/exercises-final/07-extra.1

import React from 'react'
import '../suspense-list/style-overrides.css'
import * as cn from '../suspense-list/app.module.css'
import Spinner from '../suspense-list/spinner'
import {createResource} from '../utils'

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
  const [loggedIn, setLoggedIn] = React.useState(false)
  const [lazyResources, setLazyResources] = React.useState({})
  function handleLogin() {
    startTransition(() => {
      setLoggedIn(true)
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
