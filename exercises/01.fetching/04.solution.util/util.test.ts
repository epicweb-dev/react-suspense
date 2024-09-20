import { expect, testStep, dtl } from '@epic-web/workshop-utils/test'
const { screen, waitForElementToBeRemoved } = dtl

import './index.tsx'

const shipName = await Promise.race([
	screen.findByText('Dreadnought').then(() => 'Dreadnought'),
	screen.findByText('Dreadyacht').then(() => 'Dreadyacht'),
])

if (shipName === 'Dreadyacht') {
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
} else {
	const fallbackImage = await testStep(
		'Suspense boundary renders ShipFallback',
		async () => {
			const image = await screen.findByAltText('Dreadnought')
			if (!(image instanceof HTMLImageElement)) {
				throw new Error('Fallback image not found')
			}
			expect(
				image.src,
				'🚨 make sure to render the suspense boundary with the fallback',
			).toContain('/img/fallback-ship.png')
			return image
		},
	)

	await testStep('ShipFallback contains loading placeholders', async () => {
		const [loadingItem] = await screen.findAllByText('loading')
		expect(loadingItem).toBeInTheDocument()
	})

	await testStep('Actual content loads and replaces fallback', async () => {
		await waitForElementToBeRemoved(() => screen.queryAllByText('loading'), {
			timeout: 5000,
		})
	})

	await testStep('Actual ship details are rendered', async () => {
		const image = await screen.findByAltText('Dreadnought')
		if (!(image instanceof HTMLImageElement)) {
			throw new Error('Ship image not found')
		}
		expect(image.src).not.toContain('/img/fallback-ship.png')
		expect(image).not.toBe(fallbackImage)
	})

	await testStep('Weapon items are displayed', async () => {
		const weaponItems = await screen.findAllByRole('listitem')
		expect(weaponItems.length).toBeGreaterThan(0)
	})
}
