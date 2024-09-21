import { expect, testStep, dtl } from '@epic-web/workshop-utils/test'
const { screen, waitFor, fireEvent, within } = dtl

import './index.tsx'

await testStep('Initial render', async () => {
	await screen.findByRole('heading', { name: /Dreadnought/i })
	await screen.findByPlaceholderText(/filter ships/i)
})

await testStep('Search input is responsive during search', async () => {
	const searchInput = screen.getByPlaceholderText(/filter ships/i)

	// Type slowly to simulate user input
	fireEvent.change(searchInput, { target: { value: 'S' } })
	await new Promise((resolve) => setTimeout(resolve, 100))
	fireEvent.change(searchInput, { target: { value: 'St' } })
	await new Promise((resolve) => setTimeout(resolve, 100))
	fireEvent.change(searchInput, { target: { value: 'Sta' } })

	// Check if the input value updates basically immediately
	await new Promise((resolve) => setTimeout(resolve, 0))
	expect(searchInput).toHaveValue('Sta')

	// Wait for the search results to update
	await waitFor(
		() => {
			expect(screen.getByText(/Star Hopper/i)).toBeInTheDocument()
			expect(screen.getByText(/Star Destroyer/i)).toBeInTheDocument()
		},
		{ timeout: 2000 },
	)
})

await testStep('Pending UI is shown during search', async () => {
	const searchInput = screen.getByPlaceholderText(/filter ships/i)

	fireEvent.change(searchInput, { target: { value: 'Infinity' } })

	const resultsContainer = within(document.querySelector('.search')!).getByRole(
		'list',
	)

	// Check for pending UI (lowered opacity)
	await waitFor(() => {
		expect(resultsContainer).toHaveStyle({ opacity: '0.6' })
	})

	// Wait for the search results to update
	await waitFor(
		() => {
			expect(screen.getByText(/Infinity Drifter/i)).toBeInTheDocument()
			expect(resultsContainer).toHaveStyle({ opacity: '1' })
		},
		{ timeout: 2000 },
	)
})

await testStep('User can interrupt pending state', async () => {
	const searchInput = screen.getByPlaceholderText(/filter ships/i)

	fireEvent.change(searchInput, { target: { value: 'Gal' } })
	await new Promise((resolve) => setTimeout(resolve, 100))
	fireEvent.change(searchInput, { target: { value: 'Pla' } })

	// Check if the input value updates immediately
	expect(searchInput).toHaveValue('Pla')

	// Wait for the search results to update to the latest input
	await waitFor(
		() => {
			expect(screen.getByText(/Planet Hopper/i)).toBeInTheDocument()
		},
		{ timeout: 2000 },
	)
})
