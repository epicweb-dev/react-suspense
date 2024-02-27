import { type Ship, type ShipSearch } from './api.server'

export type { Ship, ShipSearch }

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

export function preloadImage(src: string) {
	return new Promise<string>(async (resolve, reject) => {
		await new Promise(r => setTimeout(r, 1000))
		const img = document.createElement('img')
		img.src = src
		img.onload = () => resolve(src)
		img.onerror = reject
	})
}

export function getImageUrlForShip(
	shipName: string,
	{ size }: { size: number },
) {
	return `/img/ships/${shipName.toLowerCase().replaceAll(' ', '-')}.webp?size=${size}`
}
