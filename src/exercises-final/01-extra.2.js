// Simple Data-fetching
// 💯 make more generic createResource

// http://localhost:3000/isolated/exercises-final/01-extra.2

import React from 'react'
import fetchPokemon from '../fetch-pokemon'
import {ErrorBoundary} from '../utils'

// if you want to make an actual network call for the pokemon
// the uncomment the following line.
// window.fetch.restoreOriginalFetch()

let pikachuResource = createResource(() => fetchPokemon('pikachu'))

function createResource(asyncFn) {
  let status = 'pending'
  let result
  let promise = asyncFn().then(
    r => {
      status = 'success'
      result = r
    },
    e => {
      status = 'error'
      result = e
    },
  )
  return {
    read() {
      switch (status) {
        case 'pending':
          throw promise
        case 'error':
          throw result
        case 'success':
          return result
        default:
          throw new Error('Impossible state!')
      }
    },
  }
}

function Pikachu() {
  const pikachu = pikachuResource.read()
  return <pre>{JSON.stringify(pikachu, null, 2)}</pre>
}

function App() {
  return (
    <div
      style={{
        height: 300,
        width: 300,
        overflow: 'scroll',
        backgroundColor: '#eee',
        borderRadius: 4,
        padding: 10,
      }}
    >
      <ErrorBoundary>
        <React.Suspense fallback={<div>Loading Pikachu...</div>}>
          <Pikachu />
        </React.Suspense>
      </ErrorBoundary>
    </div>
  )
}

/*
🦉 Elaboration & Feedback
After the instruction, copy the URL below into your browser and fill out the form:
http://ws.kcd.im/?ws=Concurrent%20React&e=TODO&em=
*/

////////////////////////////////////////////////////////////////////
//                                                                //
//                 Don't make changes below here.                 //
// But do look at it to see how your code is intended to be used. //
//                                                                //
////////////////////////////////////////////////////////////////////

export default App
