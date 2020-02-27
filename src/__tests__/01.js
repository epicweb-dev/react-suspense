import React from 'react'
import {render} from '@testing-library/react'
import Usage from '../exercises-final/01'
// import Usage from '../exercises/01'

test('loads the tile component asynchronously', async () => {
  render(<Usage />)
})
