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

await testStep('Spin-delay prevents loading states from flashing', async () => {
	const shipDetails = await findShipDetails()
	expect(shipDetails).toHaveStyle({ opacity: '1' })

	// Switch to a new ship with a 200ms delay (less than 300ms threshold)
	const interceptorButton = screen.getByRole('button', { name: 'Interceptor' })
	fireEvent.click(interceptorButton)

	const shipDetailsLoadingStatePromise = waitFor(() => {
		expect(shipDetails).toHaveStyle({ opacity: '0.6' })
	})

	const loadingStateWasShownPromise = Promise.race([
		shipDetailsLoadingStatePromise.then(
			() => true,
			() => false,
		),
		new Promise((resolve) => setTimeout(resolve, 1000)).then(() => false),
	])

	// Wait for the new ship to load
	await screen.findByRole('heading', { name: /Interceptor/i })

	if (await loadingStateWasShownPromise) {
		throw new Error('🚨 The loading state was shown too quickly')
	}
})

await testStep(
	'Spin-delay still shows loading states when the switch takes too long',
	async () => {
		const shipDetails = await findShipDetails()
		// Switch to another ship with a 400ms delay (more than 300ms threshold)
		const galaxyCruiserButton = screen.getByRole('button', {
			name: 'Galaxy Cruiser',
		})
		fireEvent.click(galaxyCruiserButton)

		// Check that the loading state is shown after 300ms
		await waitFor(() => {
			expect(
				shipDetails,
				'🚨 The opacity is not being applied during the transition',
			).toHaveStyle({ opacity: '0.6' })
		})

		// Wait for the minimum duration (350ms) and check if loading state is still present
		await new Promise((resolve) => setTimeout(resolve, 250))
		expect(
			shipDetails,
			'🚨 The opacity is not being applied long enough',
		).toHaveStyle({ opacity: '0.6' })
	},
)
