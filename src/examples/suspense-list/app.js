import React from 'react'
import fakeLazy from './fake-lazy'

const NavBar = fakeLazy(() => import('./nav-bar'), 2000)
const LeftNav = fakeLazy(() => import('./left-nav'), 1500)
const MainContent = fakeLazy(() => import('./main-content'), 1000)
const RightNav = fakeLazy(() => import('./right-nav'), 500)

// http://localhost:3000/isolated/examples/suspense-list/app

function App() {
  return (
    <div>
      <React.SuspenseList>
        <React.Suspense fallback="loading NavBar">
          <NavBar />
        </React.Suspense>
        <div>
          <React.Suspense fallback="loading LeftNav">
            <LeftNav />
          </React.Suspense>
          <React.Suspense fallback="loading MainContent">
            <MainContent />
          </React.Suspense>
          <React.Suspense fallback="loading RightNav">
            <RightNav />
          </React.Suspense>
        </div>
      </React.SuspenseList>
    </div>
  )
}

// don't bother looking below this point...
// this is just to make things work in our app
window.reactRoot.render(<App />)

export default () => null
