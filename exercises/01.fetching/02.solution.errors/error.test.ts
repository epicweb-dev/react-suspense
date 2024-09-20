import { expect, testStep, dtl } from '@epic-web/workshop-utils/test'
const { screen, waitForElementToBeRemoved } = dtl

import './index.tsx'

await testStep(
	'Error boundary renders ShipError when ship is not found',
	async () => {
		// Check for the error message
		const errorMessage = await screen.findByText('There was an error')
		expect(errorMessage).toBeInTheDocument()

		// Check for the specific error message including the ship name
		const specificErrorMessage = await screen.findByText(
			'There was an error loading "Dreadyacht"',
		)
		expect(specificErrorMessage).toBeInTheDocument()

		// Check for the broken ship image
		const brokenShipImage = await screen.findByAltText('broken ship')
		if (!(brokenShipImage instanceof HTMLImageElement)) {
			throw new Error('Broken ship image not found')
		}
		expect(brokenShipImage.src).toContain('/img/broken-ship.webp')
	},
)
