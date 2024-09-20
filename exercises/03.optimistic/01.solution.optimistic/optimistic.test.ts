import { expect, testStep, dtl } from '@epic-web/workshop-utils/test'
const { screen, waitFor, fireEvent } = dtl

import './index.tsx'

await testStep('Initial ship details are loaded', async () => {
	await screen.findByRole('heading', { name: /Dreadnought/i })
	await waitFor(
		() => expect(screen.queryAllByText('loading')).toHaveLength(0),
		{ timeout: 5000 },
	)
})

await testStep('Create form renders correctly', async () => {
	expect(screen.getByLabelText('Ship Name')).toBeInTheDocument()
	expect(screen.getByLabelText('Top Speed')).toBeInTheDocument()
	expect(screen.getByLabelText('Image')).toBeInTheDocument()
	expect(screen.getByRole('button', { name: /Create/i })).toBeInTheDocument()
})

const shipName = 'New Test Ship'
const topSpeed = '9999'
await testStep('Form submission functions', async () => {
	fireEvent.change(screen.getByLabelText(/Ship Name/i), {
		target: { value: shipName },
	})
	fireEvent.change(screen.getByLabelText(/Top Speed/i), {
		target: { value: topSpeed },
	})

	// We can't actually select files via JavaScript, so we need to remove the required attribute
	const imageInput = screen.getByLabelText(/Image/i)
	imageInput.removeAttribute('required')

	fireEvent.click(screen.getByRole('button', { name: /Create/i }))
})

await testStep('Optimistic UI updates when creating a new ship', async () => {
	// wait just a bit for the optimistic update to happen
	await new Promise((resolve) => setTimeout(resolve, 100))
	// Check for optimistic update
	expect(
		screen.getByRole('heading', { name: new RegExp(shipName, 'i') }),
		'🚨 The optimistic update for the heading title is missing',
	).toBeInTheDocument()
	expect(
		screen.getByText(new RegExp(topSpeed, 'i'), { exact: false }),
		'🚨 The optimistic update for the top speed is missing',
	).toBeInTheDocument()
	// can't verify the image because we can't select files via JavaScript
})

await testStep(
	'When the form submission succeeds, the final result is displayed',
	async () => {
		// Wait for the actual data to load
		await waitFor(
			() => expect(screen.queryByText('...')).not.toBeInTheDocument(),
			{ timeout: 5000 },
		)

		await screen.findByRole('heading', { name: new RegExp(shipName, 'i') })
		await screen.findByText(new RegExp(topSpeed, 'i'))
	},
)
