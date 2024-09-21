import { Suspense, use, useDeferredValue, useState, useTransition } from 'react'
import * as ReactDOM from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import { useSpinDelay } from 'spin-delay'
import { getImageUrlForShip, getShip, imgSrc, searchShips } from './utils.tsx'

const shipFallbackSrc = '/img/fallback-ship.png'

function App() {
	const [shipName, setShipName] = useState('Dreadnought')
	const [isTransitionPending, startTransition] = useTransition()
	const isPending = useSpinDelay(isTransitionPending, {
		delay: 300,
		minDuration: 350,
	})
	return (
		<div className="app-wrapper">
			<div className="app">
				<ErrorBoundary
					fallback={
						<div className="app-error">
							<p>Something went wrong!</p>
						</div>
					}
				>
					<Suspense
						fallback={<img style={{ maxWidth: 400 }} src={shipFallbackSrc} />}
					>
						<div className="search">
							<ShipSearch
								onSelection={(selection) => {
									startTransition(() => setShipName(selection))
								}}
							/>
						</div>
						<div className="details" style={{ opacity: isPending ? 0.6 : 1 }}>
							<ErrorBoundary fallback={<ShipError shipName={shipName} />}>
								{shipName ? (
									<Suspense fallback={<ShipFallback shipName={shipName} />}>
										<ShipDetails shipName={shipName} />
									</Suspense>
								) : (
									<p>Select a ship from the list to see details</p>
								)}
							</ErrorBoundary>
						</div>
					</Suspense>
				</ErrorBoundary>
			</div>
		</div>
	)
}

function ShipSearch({
	onSelection,
}: {
	onSelection: (shipName: string) => void
}) {
	const [search, setSearch] = useState('')
	const deferredSearch = useDeferredValue(search)
	const isPending = useSpinDelay(search !== deferredSearch)
	return (
		<>
			<div>
				<input
					placeholder="Filter ships..."
					type="search"
					value={search}
					onChange={(event) => {
						setSearch(event.currentTarget.value)
					}}
				/>
			</div>
			<ErrorBoundary
				fallback={
					<div style={{ padding: 6, color: '#CD0DD5' }}>
						There was an error retrieving results
					</div>
				}
			>
				<ul style={{ opacity: isPending ? 0.6 : 1 }}>
					<Suspense fallback={<SearchResultsFallback />}>
						<SearchResults search={deferredSearch} onSelection={onSelection} />
					</Suspense>
				</ul>
			</ErrorBoundary>
		</>
	)
}

function SearchResultsFallback() {
	return Array.from({ length: 12 }).map((_, i) => (
		<li key={i}>
			<button>
				<img src={shipFallbackSrc} alt="loading" />
				... loading
			</button>
		</li>
	))
}

function SearchResults({
	search,
	onSelection,
}: {
	search: string
	onSelection: (shipName: string) => void
}) {
	const shipResults = use(searchShips(search))
	return shipResults.ships.map((ship) => (
		<li key={ship.name}>
			<button onClick={() => onSelection(ship.name)}>
				<ShipImg
					src={getImageUrlForShip(ship.name, { size: 20 })}
					alt={ship.name}
				/>
				{ship.name}
			</button>
		</li>
	))
}

function ShipDetails({ shipName }: { shipName: string }) {
	const shipImgSrc = getImageUrlForShip(shipName, { size: 200 })
	imgSrc(shipImgSrc)
	// 🦉 play with the delay to see how it affects the loading experience
	const ship = use(getShip(shipName, 300))
	return (
		<div className="ship-info">
			<div className="ship-info__img-wrapper">
				<ShipImg src={shipImgSrc} alt={ship.name} />
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

function ShipFallback({ shipName }: { shipName: string }) {
	return (
		<div className="ship-info">
			<div className="ship-info__img-wrapper">
				<ShipImg
					src={getImageUrlForShip(shipName, { size: 200 })}
					alt={shipName}
				/>
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
				<ShipImg src="/img/broken-ship.webp" alt="broken ship" />
			</div>
			<section>
				<h2>There was an error</h2>
			</section>
			<section>There was an error loading "{shipName}"</section>
		</div>
	)
}

function ShipImg(props: React.ComponentProps<'img'>) {
	return (
		<ErrorBoundary fallback={<img {...props} />} key={props.src}>
			<Suspense fallback={<img {...props} src={shipFallbackSrc} />}>
				<Img {...props} />
			</Suspense>
		</ErrorBoundary>
	)
}

function Img({ src = '', ...props }: React.ComponentProps<'img'>) {
	src = use(imgSrc(src))
	return <img src={src} {...props} />
}

const rootEl = document.createElement('div')
document.body.append(rootEl)
ReactDOM.createRoot(rootEl).render(<App />)
