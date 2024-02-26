import { invariantResponse } from '@epic-web/invariant'
import shipData from './ships.json'

export type Ship = (typeof shipData)[number]

const formatDate = (date: Date) =>
	`${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')} ${String(
		date.getSeconds(),
	).padStart(2, '0')}.${String(date.getMilliseconds()).padStart(3, '0')}`

const getDelay = (request: Request) =>
	Number(
		new URL(request.url).searchParams.get('delay') || Math.random() * 200 + 300,
	)

export async function searchShips(request: Request) {
	const url = new URL(request.url)
	const query = url.searchParams.get('query') ?? ''
	const endTime = Date.now() + getDelay(request)
	const ships = shipData
		.filter(ship => ship.name.toLowerCase().includes(query.toLowerCase()))
		.slice(0, 13)
	await new Promise(resolve => setTimeout(resolve, endTime - Date.now()))
	return {
		ships: ships.map(ship => ({ name: ship.name })),
		fetchedAt: formatDate(new Date()),
	}
}

export async function getShip(request: Request) {
	const url = new URL(request.url)
	const name = url.searchParams.get('name')
	const endTime = Date.now() + getDelay(request)
	invariantResponse(name, 'No name provided', { status: 400 })
	const ship = shipData.find(
		ship => ship.name.toLowerCase() === name.toLowerCase(),
	)
	await new Promise(resolve => setTimeout(resolve, endTime - Date.now()))
	invariantResponse(ship, `No ship with the name "${name}"`, {
		status: 404,
	})
	return { ...ship, fetchedAt: formatDate(new Date()) }
}
