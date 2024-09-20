import { expect, testStep, dtl } from '@epic-web/workshop-utils/test'
const { screen, waitFor, fireEvent } = dtl

import './index.tsx'

await testStep('Initial ship is loaded', async () => {
	await screen.findByRole('heading', { name: /Dreadnought/i })
	await waitFor(
		() => expect(screen.queryByText('loading')).not.toBeInTheDocument(),
		{ timeout: 5000 },
	)
})

async function findShipDetails() {
	return waitFor(() => {
		const details = document.querySelector('.details')
		if (!(details instanceof HTMLElement)) {
			throw new Error('Details not found')
		}
		return details
	})
}

await testStep('Transition behavior when switching ships', async () => {
	const initialShipDetails = await findShipDetails()
	expect(
		initialShipDetails,
		'🚨 The initial ship details should initially have an opacity of 1',
	).toHaveStyle({ opacity: '1' })

	// Switch to a new ship
	const interceptorButton = screen.getByRole('button', { name: 'Interceptor' })
	fireEvent.click(interceptorButton)

	const loadingElementPromise = Promise.race([
		screen.findByText('loading').catch(() => null),
		new Promise((resolve) => setTimeout(resolve, 1000)).then(() => null),
	])

	// Check for pending state (opacity change)
	await waitFor(async () => {
		const pendingShipDetails = await findShipDetails()
		expect(
			pendingShipDetails,
			'🚨 The opacity is not being applied during the transition',
		).toHaveStyle({ opacity: '0.6' })
	})

	expect(
		await loadingElementPromise,
		'🚨 No loading state should have been shown during the transition',
	).toBeNull()

	// Wait for the new ship to load
	await screen.findByRole('heading', { name: /Interceptor/i })

	// Check that opacity is back to 1 after loading
	await waitFor(async () => {
		const loadedShipDetails = await findShipDetails()
		expect(
			loadedShipDetails,
			'🚨 The opacity is not being applied after the transition',
		).toHaveStyle({ opacity: '1' })
	})

	// Verify that no loading state is shown
	expect(screen.queryByText('loading')).not.toBeInTheDocument()
})
