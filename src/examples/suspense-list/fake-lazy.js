import React from 'react'

// this is a wrapper around React.lazy so we can add a delay to make our dynamic
// imports take at least a certain amount of time.
function fakeLazy(dynamicImport, delay) {
  const endTime = Date.now() + delay
  return React.lazy(() => {
    return dynamicImport().then(r => {
      return new Promise(resolve => {
        setTimeout(() => resolve(r), endTime - Date.now())
      })
    })
  })
}

export default React.lazy
// export default fakeLazy
