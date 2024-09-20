import { expect, testStep, dtl } from '@epic-web/workshop-utils/test'
const { screen, waitFor, fireEvent } = dtl

import './index.tsx'

await testStep(
	'Create button shows correct messages during form submission',
	async () => {
		const createButton = screen.getByRole('button', { name: /Create/i })
		expect(createButton).toBeInTheDocument()

		// Mock form submission
		fireEvent.click(createButton)

		// Check for "Creating..." message
		await waitFor(() => {
			expect(
				screen.getByRole('button', { name: /Creating.../i }),
			).toBeInTheDocument()
		})

		// Check for "Created! Loading..." message
		await waitFor(
			() => {
				expect(
					screen.getByRole('button', { name: /Created! Loading.../i }),
				).toBeInTheDocument()
			},
			{ timeout: 5000 },
		)

		// Wait for submission to complete and button to return to initial state
		await screen.findByRole('button', { name: /Create/i }, { timeout: 5000 })
	},
)

await testStep('Optimistic UI updates with correct messages', async () => {
	const shipName = 'Message Test Ship'
	const topSpeed = '8888'

	fireEvent.change(screen.getByLabelText('Ship Name'), {
		target: { value: shipName },
	})
	fireEvent.change(screen.getByLabelText('Top Speed'), {
		target: { value: topSpeed },
	})

	// Mock file input
	const file = new File(['dummy content'], 'test.png', { type: 'image/png' })
	fireEvent.change(screen.getByLabelText('Image'), {
		target: { files: [file] },
	})

	fireEvent.click(screen.getByRole('button', { name: /Create/i }))

	// Check for optimistic update with "Creating..." message
	await screen.findByRole('heading', { name: new RegExp(shipName, 'i') })
	await screen.findByText(new RegExp(topSpeed, 'i'))
	expect(
		screen.getByRole('button', { name: /Creating.../i }),
	).toBeInTheDocument()

	// Check for "Created! Loading..." message
	await waitFor(
		() => {
			expect(
				screen.getByRole('button', { name: /Created! Loading.../i }),
			).toBeInTheDocument()
		},
		{ timeout: 5000 },
	)

	// Wait for the actual data to load and button to return to initial state
	await screen.findByRole('button', { name: /Create/i }, { timeout: 5000 })
})
