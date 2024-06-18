import { Suspense } from 'react'
import * as ReactDOM from 'react-dom/client'
import {
	getImageUrlForShip,
	getShip,
	// 💰 you're gonna want this
	// type Ship
} from './utils.tsx'

const shipName = 'Dreadnought'

function App() {
	return (
		<div className="app-wrapper">
			<div className="app">
				<div className="details">
					{/* 🐨 add a Suspense component here with the fallback set to <ShipFallback /> */}
					<ShipDetails />
				</div>
			</div>
		</div>
	)
}

// 🐨 create a new ship variable that's a Ship
// 💰 let ship: Ship
// 🐨 rename this to shipPromise and remove the `await`
// 🐨 add a .then on the shipPromise that assigns the ship to the resolved value
const ship = await getShip(shipName)

function ShipDetails() {
	// 🐨 if the ship hasn't loaded yet, throw the shipPromise

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
						{ship.weapons.map((weapon) => (
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

const rootEl = document.createElement('div')
document.body.append(rootEl)
ReactDOM.createRoot(rootEl).render(<App />)
