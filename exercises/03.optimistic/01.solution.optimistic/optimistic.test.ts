import { expect, testStep, dtl } from '@epic-web/workshop-utils/test'
const { screen, waitFor, fireEvent } = dtl

import './index.tsx'

await testStep('Initial ship details are loaded', async () => {
	await screen.findByRole('heading', { name: /Dreadnought/i })
	await waitFor(
		() => expect(screen.queryByText('loading')).not.toBeInTheDocument(),
		{ timeout: 5000 },
	)
})

await testStep('Create form renders correctly', async () => {
	expect(screen.getByLabelText('Ship Name')).toBeInTheDocument()
	expect(screen.getByLabelText('Top Speed')).toBeInTheDocument()
	expect(screen.getByLabelText('Image')).toBeInTheDocument()
	expect(screen.getByRole('button', { name: /Create/i })).toBeInTheDocument()
})

await testStep('Optimistic UI updates when creating a new ship', async () => {
	const shipName = 'New Test Ship'
	const topSpeed = '9999'

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

	// Check for optimistic update
	await screen.findByRole('heading', { name: new RegExp(shipName, 'i') })
	await screen.findByText(new RegExp(topSpeed, 'i'))

	// Wait for the actual data to load
	await waitFor(
		() => expect(screen.queryByText('...')).not.toBeInTheDocument(),
		{ timeout: 5000 },
	)
})
