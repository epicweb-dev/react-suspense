import './style-overrides.css'
import React from 'react'
import * as cn from './app.module.css'
import fakeLazy from './fake-lazy'

const NavBar = fakeLazy(() => import('./nav-bar'), 500)
const LeftNav = fakeLazy(() => import('./left-nav'), 1000)
const MainContent = fakeLazy(() => import('./main-content'), 3000)
const RightNav = fakeLazy(() => import('./right-nav'), 2000)

// http://localhost:3000/isolated/examples/suspense-list/app

function App() {
  return (
    <div className={cn.root}>
      <React.SuspenseList revealOrder="forwards">
        <React.Suspense fallback="loading NavBar">
          <NavBar />
        </React.Suspense>
        <div className={cn.mainContentArea}>
          <React.SuspenseList revealOrder="forwards">
            <React.Suspense fallback="loading LeftNav">
              <LeftNav />
            </React.Suspense>
            <React.SuspenseList revealOrder="together">
              <React.Suspense fallback="loading MainContent">
                <MainContent />
              </React.Suspense>
              <React.Suspense fallback="loading RightNav">
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
