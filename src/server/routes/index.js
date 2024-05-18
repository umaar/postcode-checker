import express from 'express';
import handlePostcode from '../lib/handle-postcode.js';
import { retrieveRecentSearches, deleteSearch } from '../utils/database.js'; // Import the retrieveRecentSearches and deleteSearch functions
import { formatRelativeTime } from '../utils/pretty-time.js'; // Import the formatRelativeTime function

const router = express.Router(); // eslint-disable-line new-cap

router.get('/', async (request, response) => {
	const queries = request.query;

	// Retrieve the last 5 postcode searches from the database
	const recentSearches = await retrieveRecentSearches();

	// Format the search times of the recent searches into pretty/relative time
	const formattedSearches = recentSearches.map(search => ({
		postcode: search.postcode,
		searchTime: formatRelativeTime(search.searchTime),
        id: search.id // Include the search ID for deletion
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

// Add a new route to handle DELETE requests for deleting a recent search
router.post('/delete', async (request, response) => {
    const { id } = request.body; // Extract the search ID from the request body

    try {
        await deleteSearch(id); // Delete the specified search
        response.redirect('/'); // Redirect back to the homepage
    } catch (error) {
        console.error('Error deleting search:', error);
        response.status(500).send('Error deleting search');
    }
});

export default router;
