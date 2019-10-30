import React from 'react'
// import chalk from 'chalk'
import {render} from '@testing-library/react'
import Usage from '../exercises-final/01'
// import Usage from '../exercises/01'

test('loads the tile component asynchronously', async () => {
  render(<Usage />)

  // try {
  //   expect(queryByDisplayValue(tilted)).not.toBeInTheDocument()
  // } catch (error) {
  //   //
  //   //
  //   //
  //   // these comment lines are just here to keep the next line out of the codeframe
  //   // so it doesn't confuse people when they see the error message twice.
  //   error.message = `🚨  ${chalk.red(
  //     'The tilt component must be loaded asynchronously via React.lazy and React.Suspense',
  //   )}`

  //   throw error
  // }
})
