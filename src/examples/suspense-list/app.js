import './style-overrides.css'
import React from 'react'
import Spinner from './spinner'
import * as cn from './app.module.css'
import fakeLazy from './fake-lazy'

// http://localhost:3000/isolated/examples/suspense-list/app

// fakeLazy is just like React.lazy, except it accepts a second argument called
// "delay" which allows us to simulate the module taking some extra time to load
const NavBar = fakeLazy(() => import('./nav-bar'), 1500)
const LeftNav = fakeLazy(() => import('./left-nav'), 3000)
const MainContent = fakeLazy(() => import('./main-content'), 4000)
const RightNav = fakeLazy(() => import('./right-nav'), 500)

const fallback = (
  <div className={cn.spinnerContainer}>
    <Spinner />
  </div>
)

function App() {
  return (
    <div className={cn.root}>
      <React.SuspenseList revealOrder="forwards" tail="collapsed">
        <React.Suspense fallback={fallback}>
          <NavBar />
        </React.Suspense>
        <div className={cn.mainContentArea}>
          <React.SuspenseList revealOrder="forwards">
            <React.Suspense fallback={fallback}>
              <LeftNav />
            </React.Suspense>
            <React.SuspenseList revealOrder="together">
              <React.Suspense fallback={fallback}>
                <MainContent />
              </React.Suspense>
              <React.Suspense fallback={fallback}>
                <RightNav />
              </React.Suspense>
            </React.SuspenseList>
          </React.SuspenseList>
        </div>
      </React.SuspenseList>
    </div>
  )
}

// don't bother looking below this point...
// this is just to make things work in our app
window.reactRoot.render(<App />)

export default () => null
