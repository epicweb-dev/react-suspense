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

// 💰 here's a function you can use to wait for the image to be ready to display
// function preloadImage(src: string) {
// 	return new Promise<string>(async (resolve, reject) => {
// 		const img = new Image()
// 		img.src = src
// 		img.onload = () => resolve(src)
// 		img.onerror = reject
// 	})
// }

// added the version to prevent caching to make testing easier
const version = Date.now()

export function getImageUrlForShip(
	shipName: string,
	{ size }: { size: number },
) {
	return `/img/ships/${shipName.toLowerCase().replaceAll(' ', '-')}.webp?size=${size}&v=${version}`
}
