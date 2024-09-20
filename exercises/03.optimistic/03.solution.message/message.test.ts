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

const createButton = await testStep(
	'Create form renders correctly',
	async () => {
		expect(screen.getByLabelText('Ship Name')).toBeInTheDocument()
		expect(screen.getByLabelText('Top Speed')).toBeInTheDocument()
		expect(screen.getByLabelText('Image')).toBeInTheDocument()
		const createButton = screen.getByRole('button', { name: /Create/i })
		expect(createButton).toBeInTheDocument()
		return createButton
	},
)

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

	fireEvent.click(createButton)
})

await testStep(
	'Create button shows "Creating..." during submission',
	async () => {
		await waitFor(() => {
			expect(
				createButton,
				'🚨 The create button should show "Creating..." when the form is submitted',
			).toHaveTextContent('Creating...')
		})
	},
)

await testStep(
	'Create button shows "Created! Loading..." after creation',
	async () => {
		await waitFor(
			() => {
				expect(
					createButton,
					'🚨 The create button should show "Created! Loading..." after the ship is created',
				).toHaveTextContent('Created! Loading...')
			},
			{ timeout: 5000 },
		)
	},
)

await testStep(
	'Create button shows "Create" after full submission',
	async () => {
		await waitFor(
			() => {
				expect(
					createButton,
					'🚨 The create button should show "Create" when the request is complete',
				).toHaveTextContent('Create')
			},
			{ timeout: 5000 },
		)
	},
)

await testStep('New ship is displayed', async () => {
	await screen.findByRole('heading', { name: new RegExp(shipName, 'i') })
})
