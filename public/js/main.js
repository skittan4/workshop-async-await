import cache from './lib/cache.js';
import {
	render,
	renderError,
	orgTpl,
	reposTpl,
	repoTpl,
	contributorsTpl,
} from './templates.js';

const API_URL = 'https://api.github.com';
const USE_CACHE = true;

// TODO: refactor into something more elegant.
// Luke, use the fetch!
const getJSON = async (url, callback) => {
	const isError = Math.floor(Math.random() * 10) === 0; // 10% error chance

	if (isError) {
		return callback(new Error('Network error!'));
	}

	const fromCache = USE_CACHE && cache.get(url);

	if (fromCache) {
		return callback(null, fromCache);
	}

	const res = await fetch(url)
    const resj = await res.json()
	if (USE_CACHE) {
		cache.set(url, resj);
	}
	callback(null, resj);
		// .then((res) => {
		// 	res.json()
		// 		.then((json) => {
		// 			if (USE_CACHE) {
		// 				cache.set(url, json);
		// 			}

					// callback(null, json);
		// 		});
		// });
};

const getRepos = (url, callback) => {
	getJSON(url, (err, repos = []) => {
		if (err) {
			return callback(new Error('They took my repos. Dook err derr!'));
		}

		repos = repos
			.filter(r => r.fork === false) // No forks, no forks!
			.sort(r => new Date(r.updated_at).getTime());

		callback(null, repos);
	});
};

// IIFE to kick it all off
(() => {
	getJSON(`${API_URL}/orgs/vicompany`, (err, org) => {
		const el = document.querySelector('#org');

		if (err) {
			return renderError(err);
		}

		render(el, org, orgTpl);

		const { repos_url: reposUrl } = org;

		getRepos(reposUrl, (err, repos) => {
			const reposEl = document.querySelector('#repos');

			if (err) {
				return renderError(err);
			}

			render(reposEl, repos, reposTpl);
		});
	});

	document
		.querySelector('main')
		.addEventListener('click', (e) => {
			const { target } = e;
			const modal = document.querySelector('#modal');

			if (target.classList.contains('js-repo')) {
				e.preventDefault();

				getJSON(target.href, (err, repo) => {
					if (err) {
						return renderError(err);
					}

					render(modal, repo, repoTpl);

					modal.querySelector('dialog').showModal();
				});
			}

			if (target.classList.contains('js-contributors')) {
				e.preventDefault();

				getJSON(target.href, (err, contributors = []) => {
					if (err) {
						return renderError(err);
					}
                    
					// TODO: get user data from all contributers e.g. https://api.github.com/users/svensigmond
					// and replace the 'users' array with this real data.
					const data = {
						contributors,
						users: contributors.map(c => ({
							url: c.url,
							avatar: c.avatar_url,
							login: c.login,
						})),
					};

					render(modal, data, contributorsTpl);

					modal.querySelector('dialog').showModal();
				});
			}

			if (target.classList.contains('js-modal-close')) {
				e.preventDefault();
				target.closest('dialog').close();
			}
		});
})();
