import { expect, testStep, dtl } from '@epic-web/workshop-utils/test'
const { screen, waitFor, fireEvent } = dtl

import './index.tsx'

await testStep('Initial render', async () => {
	await screen.findByAltText(/dreadnought/i)
	await waitFor(() => expect(screen.queryAllByText('loading')).toHaveLength(0))
})

let imageLoadStartTime: number | null = null
let dataFetchStartTime: number | null = null

const observer = new PerformanceObserver((list) => {
	list.getEntries().forEach((entry) => {
		if (entry.entryType === 'resource') {
			const resourceEntry = entry as PerformanceResourceTiming
			if (
				resourceEntry.initiatorType === 'img' &&
				resourceEntry.name.includes('infinity') &&
				resourceEntry.name.includes('size=200')
			) {
				imageLoadStartTime = resourceEntry.startTime
			} else if (resourceEntry.name.includes('api/get-ship')) {
				dataFetchStartTime = resourceEntry.startTime
			}
		}
	})
})

observer.observe({ type: 'resource' })

await testStep('click on a ship', async () => {
	await screen.findByAltText(/infinity/i)
	fireEvent.click(screen.getByText(/infinity/i))
})

await testStep('Verify parallel loading', async () => {
	await waitFor(() => {
		expect(
			imageLoadStartTime,
			'🚨 Image load start time should be recorded',
		).not.toBeNull()
		expect(
			dataFetchStartTime,
			'🚨 Data fetch start time should be recorded',
		).not.toBeNull()
	})

	if (imageLoadStartTime && dataFetchStartTime) {
		const timeDifference = Math.abs(imageLoadStartTime - dataFetchStartTime)

		expect(
			timeDifference,
			'🚨 Image and data fetch should start within 10ms of each other',
		).toBeLessThan(10)
	}
})
