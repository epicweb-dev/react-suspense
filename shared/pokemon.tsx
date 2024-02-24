import {
	createContext,
	use,
	useCallback,
	useEffect,
	useRef,
	useState,
	useTransition,
} from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { createResource, preloadImage } from './utils'

const fallbackImgUrl = `/img/pokemon/fallback-pokemon.jpg`
preloadImage(`/img/pokeball.png`)
preloadImage(fallbackImgUrl)

const sleep = (t: number) => new Promise(resolve => setTimeout(resolve, t))

const formatDate = (date: Date) =>
	`${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')} ${String(
		date.getSeconds(),
	).padStart(2, '0')}.${String(date.getMilliseconds()).padStart(3, '0')}`

// this gives me syntax highlighting and prettier formatting
// for graphql queries.
const graphql = String.raw

// the delay argument is for faking things out a bit
export function fetchPokemon(name: string, delay = 1500) {
	const endTime = Date.now() + delay
	const pokemonQuery = graphql`
		query PokemonInfo($name: String) {
			pokemon(name: $name) {
				id
				number
				name
				image
				attacks {
					special {
						name
						type
						damage
					}
				}
			}
		}
	`

	return window
		.fetch('https://graphql-pokemon2.vercel.app', {
			// learn more about this API here: https://graphql-pokemon2.vercel.app
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				query: pokemonQuery,
				variables: { name: name.toLowerCase() },
			}),
		})
		.then(response => response.json())
		.then(async response => {
			await sleep(endTime - Date.now())
			return response
		})
		.then((response: any) => {
			if (response.errors) {
				return Promise.reject(
					new Error(response.errors.map((e: any) => e.message).join('\n')),
				)
			}
			const pokemon = response.data.pokemon
			if (pokemon) {
				pokemon.fetchedAt = formatDate(new Date())
				return pokemon
			} else {
				return Promise.reject(new Error(`No pokemon with the name "${name}"`))
			}
		})
}

export function getImageUrlForPokemon(pokemonName: string) {
	return `/img/pokemon/${pokemonName.toLowerCase()}.jpg`
}

export async function fetchUser(pokemonName: string, delay = 0) {
	await sleep(delay)
	const lowerName = pokemonName.toLowerCase()
	const response = await window.fetch(`/pokemoney/${lowerName}`, {
		headers: { 'Content-Type': 'application/json' },
	})
	const result = response.json()
	return result
}

export function PokemonInfoFallback({ name }: { name: string }) {
	const initialName = useRef<string>(name).current
	const fallbackPokemonData = {
		name: initialName,
		number: 'XXX',
		attacks: {
			special: [
				{ name: 'Loading Attack 1', type: 'Type', damage: 'XX' },
				{ name: 'Loading Attack 2', type: 'Type', damage: 'XX' },
			],
		},
		fetchedAt: 'loading...',
	}
	return (
		<div>
			<div className="pokemon-info__img-wrapper">
				<img src={fallbackImgUrl} alt={initialName} />
			</div>
			<PokemonDataView pokemon={fallbackPokemonData} />
		</div>
	)
}

type Pokemon = {
	name: string
	number: string
	attacks: {
		special: Array<{
			name: string
			type: string
			damage: string
		}>
	}
	fetchedAt: string
}

export function PokemonDataView({ pokemon }: { pokemon: Pokemon }) {
	return (
		<>
			<section>
				<h2>
					{pokemon.name}
					<sup>{pokemon.number}</sup>
				</h2>
			</section>
			<section>
				<ul>
					{pokemon.attacks.special.map(attack => (
						<li key={attack.name}>
							<label>{attack.name}</label>:{' '}
							<span>
								{attack.damage} <small>({attack.type})</small>
							</span>
						</li>
					))}
				</ul>
			</section>
			<small className="pokemon-info__fetch-time">{pokemon.fetchedAt}</small>
		</>
	)
}

export function PokemonForm({
	pokemonName: externalPokemonName,
	initialPokemonName = externalPokemonName || '',
	onSubmit,
}: {
	pokemonName: string
	initialPokemonName?: string
	onSubmit: (newPokemonName: string) => void
}) {
	const [pokemonName, setPokemonName] = useState(initialPokemonName)

	// this is generally not a great idea. We're synchronizing state when it is
	// normally better to derive it https://kentcdodds.com/blog/dont-sync-state-derive-it
	// however, we're doing things this way to make it easier for the exercises
	// to not have to worry about the logic for this PokemonForm component.
	useEffect(() => {
		// note that because it's a string value, if the externalPokemonName
		// is the same as the one we're managing, this will not trigger a re-render
		if (typeof externalPokemonName === 'string') {
			setPokemonName(externalPokemonName)
		}
	}, [externalPokemonName])

	function handleSelect(newPokemonName: string) {
		setPokemonName(newPokemonName)
		onSubmit(newPokemonName)
	}

	return (
		<form
			onSubmit={e => {
				e.preventDefault()
				onSubmit(pokemonName)
			}}
			className="pokemon-form"
		>
			<label htmlFor="pokemonName-input">Pokemon Name</label>
			<small>
				Try{' '}
				<button
					className="invisible-button"
					type="button"
					onClick={() => handleSelect('pikachu')}
				>
					"pikachu"
				</button>
				{', '}
				<button
					className="invisible-button"
					type="button"
					onClick={() => handleSelect('charizard')}
				>
					"charizard"
				</button>
				{', or '}
				<button
					className="invisible-button"
					type="button"
					onClick={() => handleSelect('mew')}
				>
					"mew"
				</button>
			</small>
			<div>
				<input
					className="pokemonName-input"
					id="pokemonName-input"
					name="pokemonName"
					placeholder="Pokemon Name..."
					value={pokemonName}
					onChange={e => setPokemonName(e.currentTarget.value)}
				/>
				<button type="submit" disabled={!pokemonName.length}>
					Submit
				</button>
			</div>
		</form>
	)
}

type PokemonResource = ReturnType<typeof createPokemonResource>

const PokemonResourceCacheContext = createContext<
	Record<string, PokemonResource>
>({})

function usePokemonResourceCache() {
	const cache = use(PokemonResourceCacheContext)
	return useCallback(
		(name: string) => {
			const lowerName = name.toLowerCase()
			let resource = cache[lowerName]
			if (!resource) {
				resource = createPokemonResource(lowerName)
				cache[lowerName] = resource
			}
			return resource
		},
		[cache],
	)
}

function createPokemonResource(pokemonName: string) {
	const data = createResource(fetchPokemon(pokemonName))
	const image = createResource(preloadImage(getImageUrlForPokemon(pokemonName)))
	return { data, image }
}

export function usePokemonResource(pokemonName: string) {
	const [pokemonResource, setPokemonResource] =
		useState<PokemonResource | null>(null)
	const [isPending, startTransition] = useTransition()
	const getPokemonResource = usePokemonResourceCache()

	useEffect(() => {
		if (!pokemonName) {
			setPokemonResource(null)
			return
		}
		startTransition(() => {
			setPokemonResource(getPokemonResource(pokemonName))
		})
	}, [getPokemonResource, pokemonName, startTransition])

	return [pokemonResource, isPending]
}

function ErrorFallback({
	canReset,
	error,
	resetErrorBoundary,
}: {
	canReset: boolean
	error: Error
	resetErrorBoundary: () => void
}) {
	return (
		<div role="alert">
			There was an error:{' '}
			<pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
			{canReset ? (
				<button onClick={resetErrorBoundary}>Try again</button>
			) : null}
		</div>
	)
}

export function PokemonErrorBoundary({
	onReset,
	resetKeys,
	children,
}: Pick<
	React.ComponentProps<typeof ErrorBoundary>,
	'onReset' | 'resetKeys' | 'children'
>) {
	const canReset = Boolean(onReset || resetKeys)
	return (
		<ErrorBoundary
			fallbackRender={props => <ErrorFallback canReset={canReset} {...props} />}
			onReset={onReset}
			resetKeys={resetKeys}
			children={children}
		/>
	)
}
