import { expect, testStep, dtl } from '@epic-web/workshop-utils/test'
const { screen, waitForElementToBeRemoved } = dtl

import './index.tsx'

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
