import { Suspense, useState } from 'react'
import * as ReactDOM from 'react-dom/client'
import {
	usePokemonResource,
	PokemonInfoFallback,
	PokemonForm,
	PokemonDataView,
	PokemonErrorBoundary,
} from '#shared/pokemon'

function PokemonInfo({ pokemonResource }: { pokemonResource: any }) {
	const pokemon = pokemonResource.data.read()
	return (
		<div>
			<div className="pokemon-info__img-wrapper">
				<img src={pokemonResource.image.read()} alt={pokemon.name} />
			</div>
			<PokemonDataView pokemon={pokemon} />
		</div>
	)
}

function App() {
	const [pokemonName, setPokemonName] = useState('')

	const [pokemonResource, isPending] = usePokemonResource(pokemonName)

	function handleSubmit(newPokemonName: string) {
		setPokemonName(newPokemonName)
	}

	function handleReset() {
		setPokemonName('')
	}

	return (
		<div className="pokemon-info-app">
			<PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
			<hr />
			<div className={`pokemon-info ${isPending ? 'pokemon-loading' : ''}`}>
				{pokemonResource ? (
					<PokemonErrorBoundary
						onReset={handleReset}
						resetKeys={[pokemonResource]}
					>
						<Suspense fallback={<PokemonInfoFallback name={pokemonName} />}>
							<PokemonInfo pokemonResource={pokemonResource} />
						</Suspense>
					</PokemonErrorBoundary>
				) : (
					'Submit a pokemon'
				)}
			</div>
		</div>
	)
}

const rootEl = document.createElement('div')
document.body.append(rootEl)
ReactDOM.createRoot(rootEl).render(<App />)
