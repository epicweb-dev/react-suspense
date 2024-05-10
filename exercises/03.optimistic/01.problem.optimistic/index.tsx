import { Suspense, use, useState, useTransition } from 'react'
import * as ReactDOM from 'react-dom/client'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'
import { useSpinDelay } from 'spin-delay'
import {
	// 💰 you're going to want this
	// type Ship,
	getShip,
	createShip,
} from './utils.tsx'

function App() {
	const [shipName, setShipName] = useState('Dreadnought')
	const [isTransitionPending, startTransition] = useTransition()
	const isPending = useSpinDelay(isTransitionPending, {
		delay: 300,
		minDuration: 350,
	})
	// 🐨 add a useOptimistic call here
	// 🦺 The type should be a Ship | null, (initialized to null)

	function handleShipSelection(newShipName: string) {
		startTransition(() => {
			setShipName(newShipName)
		})
	}

	return (
		<div className="app-wrapper">
			<ShipButtons shipName={shipName} onShipSelect={handleShipSelection} />
			<div className="app">
				<div className="details" style={{ opacity: isPending ? 0.6 : 1 }}>
					<ErrorBoundary fallback={<ShipError shipName={shipName} />}>
						<Suspense fallback={<ShipFallback shipName={shipName} />}>
							{/* 🐨 pass our optimisticShip to ShipDetails here */}
							<ShipDetails shipName={shipName} />
						</Suspense>
					</ErrorBoundary>
				</div>
			</div>
			{/* 🐨 pass the setOptimisticShip function to CreateForm here */}
			<CreateForm setShipName={setShipName} />
		</div>
	)
}

// 🐨 accept setOptimisticShip here
function CreateForm({
	setShipName,
}: {
	// 🦺 I'll give this one to you
	// setOptimisticShip: (ship: Ship | null) => void
	setShipName: (name: string) => void
}) {
	return (
		<div>
			<details>
				<summary>Create a new ship</summary>
				<ErrorBoundary FallbackComponent={FormErrorFallback}>
					<form
						action={async formData => {
							// 🐨 create an optimistic ship based on the formData
							// using the createOptimisticShip utility below

							// 🐨 set the optimistic ship

							await createShip(formData, 2000)

							setShipName(formData.get('name') as string)
						}}
					>
						<div>
							<label htmlFor="shipName">Ship Name</label>
							<input id="shipName" type="text" name="name" />
						</div>
						<div>
							<label htmlFor="topSpeed">Top Speed</label>
							<input id="topSpeed" type="number" name="topSpeed" />
						</div>
						<div>
							<label htmlFor="image">Image</label>
							<input id="image" type="file" name="image" accept="image/*" />
						</div>
						<div>
							<label>
								<input name="hyperdrive" type="checkbox" />
								Hyperdrive
							</label>
						</div>
						<button type="submit">Create</button>
					</form>
				</ErrorBoundary>
			</details>
		</div>
	)
}

async function createOptimisticShip(formData: FormData) {
	return {
		name: formData.get('name') as string,
		topSpeed: Number(formData.get('topSpeed')),
		hyperdrive: formData.get('hyperdrive') === 'on',
		image: await fileToDataUrl(formData.get('image') as File),
		weapons: [],
		fetchedAt: '...',
	}
}

function fileToDataUrl(file: File) {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => resolve(reader.result as string)
		reader.onerror = reject
		reader.readAsDataURL(file)
	})
}

function FormErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
	return (
		<div role="alert">
			There was an error:{' '}
			<pre style={{ color: 'red', whiteSpace: 'normal' }}>{error.message}</pre>
			<button onClick={resetErrorBoundary}>Try again</button>
		</div>
	)
}

function ShipButtons({
	shipName,
	onShipSelect,
}: {
	shipName: string
	onShipSelect: (shipName: string) => void
}) {
	const ships = ['Dreadnought', 'Interceptor', 'Galaxy Cruiser']

	return (
		<div className="ship-buttons">
			{ships.map(ship => (
				<button
					key={ship}
					onClick={() => onShipSelect(ship)}
					className={shipName === ship ? 'active' : ''}
				>
					{ship}
				</button>
			))}
		</div>
	)
}

// 🐨 accept an optimisticShip prop here
function ShipDetails({ shipName }: { shipName: string }) {
	// 🦉 you can change this delay to control how long loading the resource takes:
	const delay = 2000
	// 🐨 if we have an optimisticShip, set the ship to that instead
	const ship = use(getShip(shipName, delay))
	return (
		<div className="ship-info">
			<div className="ship-info__img-wrapper">
				<img src={ship.image} alt={ship.name} />
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

const rootEl = document.createElement('div')
document.body.append(rootEl)
ReactDOM.createRoot(rootEl).render(<App />)
