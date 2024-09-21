import { expect, testStep } from '@epic-web/workshop-utils/test'

const searchResult = await testStep(
	'Cache control headers are present for search ships',
	async () => {
		const response = await fetch('api/search-ships')
		const cacheControl = response.headers.get('cache-control')
		if (!cacheControl) {
			throw new Error(
				'🚨 No cache-control header found. Make sure to add a cache-control header with a max-age to the search ships response',
			)
		}
		expect(
			cacheControl,
			'🚨 make sure to add a cache-control header with a max-age to the search ships response',
		).toMatch(/max-age=\d+/)
		const result = await response.json()
		return result as any
	},
)

await testStep('Cache control headers are present for get ship', async () => {
	const searchParams = new URLSearchParams({ name: searchResult.ships[0].name })
	const response = await fetch(`api/get-ship?${searchParams.toString()}`)
	const cacheControl = response.headers.get('cache-control')
	if (!cacheControl) {
		throw new Error(
			'🚨 No cache-control header found. Make sure to add a cache-control header with a max-age to the get ship response',
		)
	}
	expect(
		cacheControl,
		'🚨 make sure to add a cache-control header with a max-age to the get ship response',
	).toMatch(/max-age=\d+/)
})
