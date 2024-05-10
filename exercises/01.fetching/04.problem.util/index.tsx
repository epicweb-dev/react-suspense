import { Suspense } from 'react'
import * as ReactDOM from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import { getImageUrlForShip, getShip, type Ship } from './utils.tsx'

// 💰 this will help your TypeScript be nicer:
type UsePromise<Value> = Promise<Value> & {
	status: 'pending' | 'fulfilled' | 'rejected'
	value: Value
	reason: unknown
}

// 🐨 create a function called "use" which accepts a promise and here's what it should do:
// - assign the promise to a variable called "usePromise" as a UsePromise
// - if the usePromise.status is fuilfilled, return usePromise.value
// - if the usePromise.status is rejected, throw usePromise.reason
// - if the usePromise.status is pending, throw usePromise
// - otherwise, set usePromise.status to 'pending' and then add a .then to the promise
//   - if the promise resolves, set usePromise.status to 'fulfilled' and set usePromise.value to the result
//   - if the promise rejects, set usePromise.status to 'rejected' and set usePromise.reason to the rejection reason
//   - then throw usePromise

const shipName = 'Dreadnought'

function App() {
	return (
		<div className="app-wrapper">
			<div className="app">
				<div className="details">
					<ErrorBoundary fallback={<ShipError />}>
						<Suspense fallback={<ShipFallback />}>
							<ShipDetails />
						</Suspense>
					</ErrorBoundary>
				</div>
			</div>
		</div>
	)
}

// 💣 get rid of the ship, error, and status variables
let ship: Ship
let error: unknown
let status: 'pending' | 'rejected' | 'fulfilled' = 'pending'
const shipPromise = getShip(shipName)
	// 💣 get rid of the .then here
	.then(
		result => {
			ship = result
			status = 'fulfilled'
		},
		err => {
			error = err
			status = 'rejected'
		},
	)

function ShipDetails() {
	// 💣 get rid of these if statements
	if (status === 'rejected') throw error
	if (status === 'pending') throw shipPromise
	// 🐨 create a ship variable that's set to use(shipPromise)

	return (
		<div className="ship-info">
			<div className="ship-info__img-wrapper">
				<img
					src={getImageUrlForShip(ship.name, { size: 200 })}
					alt={ship.name}
				/>
			</div>
			<section>
				<h2>
					{ship.name}
					<sup>
						{ship.topSpeed} <small>lyh</small>
					</sup>
				</h2>
			</section>
			<section>
				{ship.weapons.length ? (
					<ul>
						{ship.weapons.map(weapon => (
							<li key={weapon.name}>
								<label>{weapon.name}</label>:{' '}
								<span>
									{weapon.damage} <small>({weapon.type})</small>
								</span>
							</li>
						))}
					</ul>
				) : (
					<p>NOTE: This ship is not equipped with any weapons.</p>
				)}
			</section>
			<small className="ship-info__fetch-time">{ship.fetchedAt}</small>
		</div>
	)
}

function ShipFallback() {
	return (
		<div className="ship-info">
			<div className="ship-info__img-wrapper">
				<img src="/img/fallback-ship.png" alt={shipName} />
			</div>
			<section>
				<h2>
					{shipName}
					<sup>
						XX <small>lyh</small>
					</sup>
				</h2>
			</section>
			<section>
				<ul>
					{Array.from({ length: 3 }).map((_, i) => (
						<li key={i}>
							<label>loading</label>:{' '}
							<span>
								XX <small>(loading)</small>
							</span>
						</li>
					))}
				</ul>
			</section>
		</div>
	)
}

function ShipError() {
	return (
		<div className="ship-info">
			<div className="ship-info__img-wrapper">
				<img src="/img/broken-ship.webp" alt="broken ship" />
			</div>
			<section>
				<h2>There was an error</h2>
			</section>
			<section>There was an error loading "{shipName}"</section>
		</div>
	)
}

const rootEl = document.createElement('div')
document.body.append(rootEl)
ReactDOM.createRoot(rootEl).render(<App />)
