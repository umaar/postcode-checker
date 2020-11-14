import config from 'config';
import validateLSOA from './validate-lsoa.js';

const postcodeValidationMinLength = config.get('postcodeValidationMinLength');
const postcodeValidationMaxLength = config.get('postcodeValidationMaxLength');

async function handle(postcode) {
	const cleansedPostcode = postcode
		.replace(/[^\da-zA-Z]/g, '')
		.replaceAll(' ', '');

	let message = '';

	if (postcode.length === 0) {
		message = 'Please enter a postcode';
	} else if (!cleansedPostcode.length > 0) {
		message = `The postcode "${postcode}" does not look valid, please try again`;
	} else if (cleansedPostcode.length < postcodeValidationMinLength) {
		message = `The postcode "${postcode}" looks too short, please try again`;
	} else if (cleansedPostcode.length > postcodeValidationMaxLength) {
		message = `The postcode "${postcode}" looks too long, please try again`;
	}

	if (!message) {
		message = (await validateLSOA(cleansedPostcode)) ? `The postcode "${postcode}" is in the service area` : `The postcode "${postcode}" is not in the service area`;
	}

	return message;
}

export default handle;
