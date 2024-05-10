import { type Ship } from './api.server.ts'

export type { Ship }

export async function createShip(formData: FormData, delay?: number) {
	const searchParams = new URLSearchParams()
	if (delay) searchParams.set('delay', String(delay))
	const r = await fetch(`api/create-ship?${searchParams.toString()}`, {
		method: 'POST',
		body: formData,
	})
	if (!r.ok) {
		throw new Error(await r.text())
	}
}

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

export function getImageUrlForShip(
	shipName: string,
	{ size }: { size: number },
) {
	return `/img/ships/${shipName.toLowerCase().replaceAll(' ', '-')}.webp?size=${size}`
}
