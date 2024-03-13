import { type Ship } from './api.server.ts'

export type { Ship }

const shipCache = new Map<string, Promise<Ship>>()

export function getShip(name: string, delay?: number) {
	const shipPromise = shipCache.get(name) ?? getShipImpl(name, delay)
	shipCache.set(name, shipPromise)
	return shipPromise
}

async function getShipImpl(name: string, delay?: number) {
	const searchParams = new URLSearchParams({ name })
	if (delay) searchParams.set('delay', String(delay))
	const response = await fetch(`api/get-ship?${searchParams.toString()}`)
	if (!response.ok) {
		return Promise.reject(new Error(await response.text()))
	}
	const ship = await response.json()
	return ship as Ship
}

// 🐨 create an imgCache here that's a map of string and Promise<string>

// 🐨 export a function called imgSrc that takes a src string
//   - check if there's a imgPromise in the imgCache for the src, if not, create one with preloadImage(src)
//   - set the imgPromise in the imgCache
//   - return the imgPromise

// 🐨 create a function called preloadImage which accepts a src string
// 🐨 return a promise. Its callback should:
//   - create a new Image
//   - set the src of the image to the src passed to the function
//   - set the onload of the image to resolve the promise with the src
//   - set the onerror of the image to reject the promise

export function getImageUrlForShip(
	shipName: string,
	{ size }: { size: number },
) {
	return `/img/ships/${shipName.toLowerCase().replaceAll(' ', '-')}.webp?size=${size}`
}
