
import express from 'express';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/', async (request, response) => {
	const renderObject = {
		hello: 'hey hey'
	};

	response.render('index', renderObject);
});

export default router;
