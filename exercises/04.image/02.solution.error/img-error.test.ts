import { expect, testStep, dtl } from '@epic-web/workshop-utils/test'
const { waitFor } = dtl

import './index.tsx'

await testStep('Error boundary fallback is used for image', async () => {
	await waitFor(
		() => {
			const img = Array.from(document.querySelectorAll('img')).find((img) =>
				img.getAttribute('src')?.includes('typo'),
			)
			expect(
				img,
				'🚨 Image with typo in src should be in the document',
			).toBeTruthy()
		},
		{ timeout: 3000 },
	)
})
