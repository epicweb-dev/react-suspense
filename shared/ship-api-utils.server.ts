import fs from 'node:fs'
import path from 'node:path'
import { invariant, invariantResponse } from '@epic-web/invariant'
import shipData from './ships.json'

const MIN_DELAY = 200
const MAX_DELAY = 500

export type Ship = (typeof shipData)[number]

const { EPICSHOP_CONTEXT_CWD } = process.env
invariant(
	typeof EPICSHOP_CONTEXT_CWD === 'string',
	'EPICSHOP_CONTEXT_CWD not set',
)

const atRoot = (...paths: Array<string>) =>
	path.join(EPICSHOP_CONTEXT_CWD, ...paths)

const formatDate = (date: Date) =>
	`${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')} ${String(
		date.getSeconds(),
	).padStart(2, '0')}.${String(date.getMilliseconds()).padStart(3, '0')}`

function getDelay(request: Request) {
	return Number(
		new URL(request.url).searchParams.get('delay') ||
			Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY,
	)
}

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

export async function createShip(request: Request) {
	const endTime = Date.now() + getDelay(request)
	const formData = await request.formData()
	const name = formData.get('name')
	const image = formData.get('image')
	const topSpeed = Number(formData.get('topSpeed'))
	const hyperdrive = formData.get('hyperdrive') === 'on'
	invariantResponse(typeof name === 'string' && name, 'Name incorrect type')
	invariantResponse(image instanceof File, 'Image incorrect type')
	invariantResponse(
		typeof topSpeed === 'number' && topSpeed,
		'Top speed incorrect type',
	)
	invariantResponse(
		typeof hyperdrive === 'boolean',
		'Hyperdrive incorrect type',
	)

	const filePath = atRoot('public', 'img', 'custom-ships', image.name)

	await fs.promises.mkdir(path.dirname(filePath), { recursive: true })
	await fs.promises.writeFile(filePath, Buffer.from(await image.arrayBuffer()))

	const ship = {
		name,
		image: `/img/custom-ships/${image.name}`,
		topSpeed,
		hyperdrive,
		weapons: [],
	}

	shipData.push(ship)

	await new Promise(resolve => setTimeout(resolve, endTime - Date.now()))

	return new Response('OK', { status: 201 })
}
