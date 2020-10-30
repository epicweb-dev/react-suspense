import * as React from 'react'
import {render} from '@testing-library/react'
import Usage from '../final/01'
// import Usage from '../exercise/01'

test('loads the tile component asynchronously', async () => {
  render(<Usage />)
})
