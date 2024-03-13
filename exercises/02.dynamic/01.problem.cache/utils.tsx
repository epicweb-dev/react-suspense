import { type Ship } from './api.server.ts'

export type { Ship }

// 🐨 create a shipCache Map that's got string keys and values are Promise<Ship>

// 🐨 export a new function called getShip (you'll rename the one below).
//   - it should take a name and optional delay number
//   - it should check the shipCache for the shipPromise by the name
//   - if it can't find one, it should call getShipImpl and store the promise in the cache
//   - then it should return the shipPromise

// 🐨 rename this function to getShipImpl and remove the export
export async function getShip(name: string, delay?: number) {
	const searchParams = new URLSearchParams({ name })
	if (delay) searchParams.set('delay', String(delay))
	const response = await fetch(`api/get-ship?${searchParams.toString()}`)
	if (!response.ok) {
		return Promise.reject(new Error(await response.text()))
	}
	const ship = await response.json()
	return ship as Ship
}

export function getImageUrlForShip(
	shipName: string,
	{ size }: { size: number },
) {
	return `/img/ships/${shipName.toLowerCase().replaceAll(' ', '-')}.webp?size=${size}`
}
