import express from 'express';
import handlePostcode from '../lib/handle-postcode.js';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/', async (request, response) => {
	const queries = request.query;

	if (!Object.prototype.hasOwnProperty.call(queries, 'postcode')) {
		return response.render('index');
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
	});
});

export default router;
