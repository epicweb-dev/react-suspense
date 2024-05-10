import { Suspense, use, useOptimistic, useState, useTransition } from 'react'
import { useFormStatus } from 'react-dom'
import * as ReactDOM from 'react-dom/client'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'
import { useSpinDelay } from 'spin-delay'
import { type Ship, getShip, createShip } from './utils.tsx'

function App() {
	const [shipName, setShipName] = useState('Dreadnought')
	const [isTransitionPending, startTransition] = useTransition()
	const isPending = useSpinDelay(isTransitionPending, {
		delay: 300,
		minDuration: 350,
	})
	const [optimistiShip, setOptimisticShip] = useOptimistic<Ship | null>(null)

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
							<ShipDetails shipName={shipName} optimistiShip={optimistiShip} />
						</Suspense>
					</ErrorBoundary>
				</div>
			</div>
			<CreateForm
				setOptimisticShip={setOptimisticShip}
				setShipName={setShipName}
			/>
		</div>
	)
}

function CreateForm({
	setOptimisticShip,
	setShipName,
}: {
	setOptimisticShip: (ship: Ship | null) => void
	setShipName: (name: string) => void
}) {
	const [message, setMessage] = useOptimistic('Create')
	return (
		<div>
			<p>Create a new ship</p>
			<ErrorBoundary FallbackComponent={FormErrorFallback}>
				<form
					action={async formData => {
						setMessage('Creating...')
						setOptimisticShip(await createOptimisticShip(formData))

						await createShip(formData, 2000)

						setMessage('Created! Loading...')

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
					<CreateButton>{message}</CreateButton>
				</form>
			</ErrorBoundary>
		</div>
	)
}

function CreateButton({ children }: { children: React.ReactNode }) {
	const { pending } = useFormStatus()
	return (
		<button type="submit" disabled={pending}>
			{children}
		</button>
	)
}

async function createOptimisticShip(formData: FormData) {
	return {
		name: formData.get('name') as string,
		topSpeed: Number(formData.get('topSpeed')),
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

function ShipDetails({
	shipName,
	optimistiShip,
}: {
	shipName: string
	optimistiShip: Ship | null
}) {
	// 🦉 you can change this delay to control how long loading the resource takes:
	const delay = 2000
	const ship = optimistiShip ?? use(getShip(shipName, delay))
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
