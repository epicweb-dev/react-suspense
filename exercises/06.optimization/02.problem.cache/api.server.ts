import { getShip, searchShips } from '#shared/ship-api-utils.server'

export type Ship = Awaited<ReturnType<typeof getShip>>
export type ShipSearch = Awaited<ReturnType<typeof searchShips>>

export async function loader({
	request,
	params,
}: {
	request: Request
	params: Record<string, string>
}) {
	const path = params['*']
	switch (path) {
		case 'search-ships': {
			const result = await searchShips(request)
			return new Response(JSON.stringify(result), {
				headers: {
					'content-type': 'application/json',
					// 🐨 add a cache-control header with a max-age=300
					// to cache this response for 300 seconds (5 minutes)
				},
			})
		}
		case 'get-ship': {
			const result = await getShip(request)
			return new Response(JSON.stringify(result), {
				headers: {
					'content-type': 'application/json',
					// 🐨 add a cache-control header with a max-age=300
					// to cache this response for 300 seconds (5 minutes)
				},
			})
		}
		default: {
			return new Response('Not found', { status: 404 })
		}
	}
}
