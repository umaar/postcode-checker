import express from 'express';
import got from 'got';

/*
	To validate:
	- SE17QD
	- N200AG
	- SH241AA
	- abc
*/

async function validateLSOA(postcode) {

}

const router = express.Router(); // eslint-disable-line new-cap
router.get('/', async (request, response) => {
	const postcode = request.query.postcode || '';
	const postcodeValidationMinLength = response.app.locals.config.postcodeValidationMinLength;
	const postcodeValidationMaxLength = response.app.locals.config.postcodeValidationMaxLength;


	const cleansedPostcode = postcode.replace(/[^a-zA-Z ]/g, '');
	
	let message = '';

	if (!postcode.length) {
		message = `Please enter a postcode`;
	} else if (!cleansedPostcode.length) {
		message = `The postcode "${postcode}" does not look valid, please try again`;
	} else if (cleansedPostcode.length < postcodeValidationMinLength) {
		message = `The postcode "${postcode}" looks too short, please try again`;
	} else if (cleansedPostcode.length > postcodeValidationMaxLength) {
		message = `The postcode "${postcode}" looks too long, please try again`;
	} else {
		message = `The postcode ${postcode} looks good!`;
	}
	const renderObject = {};

	if (message.length) {
		renderObject.message = message;
	}

	console.log('going to search for', cleansedPostcode);
	

	return response.render('index', renderObject);
});

export default router;
