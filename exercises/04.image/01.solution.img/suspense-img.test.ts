import { expect, testStep, dtl } from '@epic-web/workshop-utils/test'
const { screen, waitFor, fireEvent } = dtl

import './index.tsx'

function onLoad(img: HTMLElement, cb?: () => void) {
	return new Promise<void>((resolve) => {
		img.addEventListener(
			'load',
			() => {
				cb?.()
				resolve()
			},
			{ once: true },
		)
	})
}

await testStep('Initial ship details are loaded', async () => {
	await screen.findByRole('heading', { name: /Dreadnought/i })
	await waitFor(
		() => expect(screen.queryAllByText('loading')).toHaveLength(0),
		{ timeout: 5000 },
	)
	await onLoad(screen.getByAltText('Dreadnought'))
	await new Promise((resolve) => setTimeout(resolve, 250))
})

const img = await testStep('Initial image is loaded', async () => {
	const img = await screen.findByAltText('Dreadnought')
	expect(img, '🚨 Initial image should be present').toBeInTheDocument()
	return img
})

const initialSrc = img.getAttribute('src')

let loadTime = 0,
	srcChangeTime = 0

const loadAndSrcChange = Promise.all([
	onLoad(img).then(() => {
		loadTime = Date.now()
	}),
	waitFor(
		() => {
			expect(img.getAttribute('src')).not.toBe(initialSrc)
			srcChangeTime = Date.now()
		},
		{ timeout: 4000 },
	),
])

await testStep('Click on a different ship', async () => {
	fireEvent.click(screen.getByRole('button', { name: 'Interceptor' }))
})

await testStep('New ship details are loaded', async () => {
	await screen.findByRole(
		'heading',
		{ name: /Interceptor/i },
		{ timeout: 4000 },
	)
})

const newImg = await testStep('New image element is present', async () => {
	const img = await screen.findByAltText('Interceptor')
	expect(img, '🚨 New image element should be present').toBeInTheDocument()
	return img
})

await testStep('Verify image src has changed', async () => {
	await waitFor(() => {
		expect(
			newImg.getAttribute('src'),
			'🚨 Image src should change after load event',
		).not.toBe(initialSrc)
		expect(
			newImg.getAttribute('src'),
			'🚨 New image src should contain "interceptor"',
		).toMatch(/interceptor/)
	})
})

// put this last so it doesn't affect the other steps
await testStep('img was loaded before the src changed.', async () => {
	await loadAndSrcChange
	console.log(loadTime - srcChangeTime)
	expect(
		loadTime - srcChangeTime,
		'🚨 the img should be loaded before the src changes. Make sure to suspend until the img is loaded.',
	).toBeLessThan(4)
})
