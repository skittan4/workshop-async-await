// Use some client-side caching, otherwise Githubs API rate limiter will kick our asses.
// You shouldn't need to edit this file.
// Hammer time! Can't touch this!

const CACHE_TIMEOUT = 30 * 60 * 1000; // 30 minutes

const cache = {
	get(url) {
		let item = false;

		try {
			item = JSON.parse(localStorage.getItem(url) || false);

			if (item && item.timestamp) {
				if (Date.now() - item.timestamp < CACHE_TIMEOUT) {
					return item.data;
				}

				// Outdated
				cache.remove(url);
				item = false;
			}
		} catch (err) {
			console.error(err);
		}

		return item;
	},

	set(url, data) {
		const value = {
			timestamp: Date.now(),
			data,
		};

		try {
			localStorage.setItem(url, JSON.stringify(value));
		} catch (err) {
			console.error(err);
		}
	},

	remove(url) {
		localStorage.removeItem(url);
	},
};

export default cache;
