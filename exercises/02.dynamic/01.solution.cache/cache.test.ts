import { expect, testStep, dtl } from '@epic-web/workshop-utils/test'
const { screen, waitFor, waitForElementToBeRemoved, fireEvent } = dtl

import './index.tsx'

await testStep('Data is loaded', async () => {
	await screen.findByRole('heading', { name: /Dreadnought/i })
	await waitFor(
		() => expect(screen.queryByText('loading')).not.toBeInTheDocument(),
		{ timeout: 5000 },
	)
})

await testStep('Counter increments without suspending', async () => {
	const counterButton = await screen.findByText(/Click to re-render/)
	const initialCount = Number(
		counterButton.textContent?.match(/\d+/)?.[0] || '0',
	)

	fireEvent.click(counterButton)

	await waitFor(() => {
		const updatedCount = Number(
			counterButton.textContent?.match(/\d+/)?.[0] || '0',
		)
		expect(updatedCount).toBe(initialCount + 1)
	})

	// Verify that no loading state is shown
	expect(
		screen.queryByText('loading'),
		'🚨 The loading state is shown after clicking increment',
	).not.toBeInTheDocument()
})

await testStep(
	'Switching ships uses cache for previously loaded ships',
	async () => {
		// Switch to a new ship
		const interceptorButton = screen.getByRole('button', {
			name: 'Interceptor',
		})
		fireEvent.click(interceptorButton)

		await waitFor(
			() => expect(screen.queryByText('loading')).not.toBeInTheDocument(),
			{ timeout: 5000 },
		)

		// Switch back to the original ship
		const dreadnoughtButton = screen.getByRole('button', {
			name: 'Dreadnought',
		})
		fireEvent.click(dreadnoughtButton)

		// Verify there's no loading state
		const loadingElement = await Promise.race([
			screen.findByText('loading').catch(() => null),
			new Promise((resolve) => setTimeout(resolve, 1000)).then(() => null),
		])
		expect(loadingElement).toBeNull()

		const dreadnoughtImage = await screen.findByAltText('Dreadnought')
		if (!(dreadnoughtImage instanceof HTMLImageElement)) {
			throw new Error('Dreadnought image not found')
		}
		expect(dreadnoughtImage.src).not.toContain('/img/fallback-ship.png')
	},
)
