import { expect, testStep, dtl } from '@epic-web/workshop-utils/test'
const { screen, waitFor, fireEvent } = dtl

import './index.tsx'

await testStep('Initial ship details are loaded', async () => {
	await screen.findByRole('heading', { name: /Dreadnought/i })
	await waitFor(
		() => expect(screen.queryAllByText('loading')).toHaveLength(0),
		{ timeout: 3000 },
	)
	await new Promise((resolve) => {
		screen
			.getByAltText('Dreadnought')
			.addEventListener('load', resolve, { once: true })
	})
	await new Promise((resolve) => setTimeout(resolve, 250))
})

await testStep('Click on a different ship', async () => {
	fireEvent.click(screen.getByRole('button', { name: 'Interceptor' }))
})

await testStep('The suspense boundary should be shown', async () => {
	await waitFor(
		() => {
			const fallbackImg = screen.getByAltText('Interceptor')
			expect(
				fallbackImg.getAttribute('src'),
				'🚨 The fallback image is not shown. Make sure you add a key to the Suspense boundary.',
			).toBe('/img/fallback-ship.png')
		},
		{ timeout: 3000 },
	)
})
