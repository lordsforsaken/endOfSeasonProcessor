export function wait(ms) {
	return new Promise(resolve => {
		setTimeout(() => {
			return resolve()
		}, ms)
	})
}
