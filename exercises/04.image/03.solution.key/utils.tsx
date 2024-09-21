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

const imgCache = new Map<string, Promise<string>>()

export function imgSrc(src: string) {
	const imgPromise = imgCache.get(src) ?? preloadImage(src)
	imgCache.set(src, imgPromise)
	return imgPromise
}

function preloadImage(src: string) {
	return new Promise<string>(async (resolve, reject) => {
		const img = new Image()
		img.src = src
		img.onload = () => resolve(src)
		img.onerror = reject
	})
}

// added the version to prevent caching to make testing easier
const version = Date.now()

export function getImageUrlForShip(
	shipName: string,
	{ size }: { size: number },
) {
	return `/img/ships/${shipName.toLowerCase().replaceAll(' ', '-')}.webp?size=${size}&version=${version}`
}
