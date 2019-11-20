// Coordinate Suspending components with SuspenseList

// http://localhost:3000/isolated/exercises/07

import React from 'react'
import '../suspense-list/style-overrides.css'
import * as cn from '../suspense-list/app.module.css'
import Spinner from '../suspense-list/spinner'
import fakeLazy from '../suspense-list/fake-lazy'

// fakeLazy is just like React.lazy, except it accepts a second argument called
// "delay" which allows us to simulate the module taking some extra time to load

// 🐨 feel free to play around with the delay timings.
const NavBar = fakeLazy(() => import('../suspense-list/nav-bar'), 500)
const LeftNav = fakeLazy(() => import('../suspense-list/left-nav'), 2000)
const MainContent = fakeLazy(
  () => import('../suspense-list/main-content'),
  1500,
)
const RightNav = fakeLazy(() => import('../suspense-list/right-nav'), 1000)

const fallback = (
  <div className={cn.spinnerContainer}>
    <Spinner />
  </div>
)
const SUSPENSE_CONFIG = {timeoutMs: 4000}

function App() {
  const [startTransition] = React.useTransition(SUSPENSE_CONFIG)
  const [loggedIn, setLoggedIn] = React.useState(false)
  if (!loggedIn) {
    return (
      <div className="totally-centered" style={{height: '100vh'}}>
        <button onClick={() => startTransition(() => setLoggedIn(true))}>
          Login
        </button>
      </div>
    )
  }

  // 🐨 Use React.SuspenseList throughout these Suspending components to make
  // them load in a way that is not jaring to the user.
  // 💰 there's not really a specifically "right" answer for this.
  return (
    <div className={cn.root}>
      <React.Suspense fallback={fallback}>
        <NavBar />
      </React.Suspense>
      <div className={cn.mainContentArea}>
        <React.Suspense fallback={fallback}>
          <LeftNav />
        </React.Suspense>
        <React.Suspense fallback={fallback}>
          <MainContent />
        </React.Suspense>
        <React.Suspense fallback={fallback}>
          <RightNav />
        </React.Suspense>
      </div>
    </div>
  )
}

/*
🦉 Elaboration & Feedback
After the instruction, copy the URL below into your browser and fill out the form:
http://ws.kcd.im/?ws=Concurrent%20React&e=Coordinate%20Suspending%20components%20with%20SuspenseList&em=
*/

////////////////////////////////////////////////////////////////////
//                                                                //
//                 Don't make changes below here.                 //
// But do look at it to see how your code is intended to be used. //
//                                                                //
////////////////////////////////////////////////////////////////////

export default App
