import express from 'express';
import handlePostcode from '../lib/handle-postcode.js';
import { retrieveRecentSearches } from '../utils/database.js'; // Import the retrieveRecentSearches function
import { formatRelativeTime } from '../utils/pretty-time.js'; // Import the formatRelativeTime function

const router = express.Router(); // eslint-disable-line new-cap

router.get('/', async (request, response) => {
	const queries = request.query;

	// Retrieve the last 5 postcode searches from the database
	const recentSearches = await retrieveRecentSearches();

	// Format the search times of the recent searches into pretty/relative time
	const formattedSearches = recentSearches.map(search => ({
		postcode: search.postcode,
		searchTime: formatRelativeTime(search.searchTime)
	}));

	if (!Object.prototype.hasOwnProperty.call(queries, 'postcode')) {
		return response.render('index', { recentSearches: formattedSearches });
	}

	let message;

	try {
		message = await handlePostcode(queries.postcode);
	} catch (error) {
		console.log('Unexpected error:', error);

		return response.status(500).render('error', {
			message: 'Sorry, something went wrong',
		});
	}

	return response.render('index', {
		message,
		recentSearches: formattedSearches
	});
});

export default router;
