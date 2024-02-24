export function createResource<ResourceType>(promise: Promise<ResourceType>) {
	let status = 'pending'
	let result = promise.then(
		(resolved: ResourceType) => {
			status = 'success'
			// @ts-ignore
			result = resolved
		},
		rejected => {
			status = 'error'
			result = rejected
		},
	)
	return {
		read() {
			if (status === 'pending') throw result
			if (status === 'error') throw result
			if (status === 'success') return result
			throw new Error('This should be impossible')
		},
	}
}

export function preloadImage(src: string) {
	return new Promise(resolve => {
		const img = document.createElement('img')
		img.src = src
		img.onload = () => resolve(src)
	})
}
