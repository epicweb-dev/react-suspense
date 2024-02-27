import { Suspense, use, useState, useTransition } from 'react'
import * as ReactDOM from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import { useSpinDelay } from 'spin-delay'
import { getImageUrlForShip, getShip, imgSrc } from './utils'

function App() {
	const [shipName, setShipName] = useState('Dreadnought')
	const [isTransitionPending, startTransition] = useTransition()
	const isPending = useSpinDelay(isTransitionPending)

	function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
		startTransition(() => {
			setShipName(e.currentTarget.textContent!)
		})
	}

	return (
		<div className="app-wrapper">
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<button onClick={handleClick}>Interceptor</button>
				<button onClick={handleClick}>Dreadnought</button>
				<button onClick={handleClick}>Galaxy Cruiser</button>
			</div>
			<div className="app">
				<div className="details" style={{ opacity: isPending ? 0.6 : 1 }}>
					<ErrorBoundary fallback={<ShipError shipName={shipName} />}>
						<Suspense fallback={<ShipFallback shipName={shipName} />}>
							<ShipDetails shipName={shipName} />
						</Suspense>
					</ErrorBoundary>
				</div>
			</div>
		</div>
	)
}

function ShipDetails({ shipName }: { shipName: string }) {
	const ship = use(getShip(shipName))
	return (
		<div className="ship-info">
			<div className="ship-info__img-wrapper">
				{/* 🐨 change this to the ShipImg component */}
				<Img
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

function ShipFallback({ shipName }: { shipName: string }) {
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

function ShipError({ shipName }: { shipName: string }) {
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

// 🐨 create a ShipImg component which accepts all the props of a regular img element
// and it should forward all props to the Img component and be wrapped by an
// ErrorBoundary with the fallback being a regular img element with the same props
// and a Suspense boundary with the fallback being an img element but the src should be "/img/fallback-ship.png"

function Img({
	src = '',
	...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
	src = use(imgSrc(src))
	return <img src={src} {...props} />
}

const rootEl = document.createElement('div')
document.body.append(rootEl)
ReactDOM.createRoot(rootEl).render(<App />)
