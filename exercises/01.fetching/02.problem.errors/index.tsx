import { Suspense } from 'react'
import * as ReactDOM from 'react-dom/client'
// 💰 you're gonna want this
// (unless you want to implement your own error boundary from scratch! 😅)
// import { ErrorBoundary } from 'react-error-boundary'
import { getImageUrlForShip, getShip, type Ship } from './utils.tsx'

// 🐨 change this to a ship that doesn't exist (like 'Dreadyacht' 😆)
const shipName = 'Dreadnought'

function App() {
	return (
		<div className="app-wrapper">
			<div className="app">
				<div className="details">
					{/* 🐨 wrap this in an ErrorBoundary */}
					{/* 💰 you can use the ShipError component below as the fallback prop */}
					<Suspense fallback={<ShipFallback />}>
						<ShipDetails />
					</Suspense>
				</div>
			</div>
		</div>
	)
}

let ship: Ship
// 🐨 create an error variable here
const shipPromise = getShip(shipName).then(
	result => (ship = result),
	// 🐨 add an error handler here to assign the error to
)

function ShipDetails() {
	// 🐨 if there was an error, throw it.
	if (!ship) throw shipPromise

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

// 🧝‍♂️ here you go!
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
