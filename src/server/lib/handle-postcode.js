import config from 'config';
import validateLSOA from './validate-lsoa.js';

const postcodeValidationMinLength = config.get('postcodeValidationMinLength');
const postcodeValidationMaxLength = config.get('postcodeValidationMaxLength');
const postcodeAllowList = config.get('postcodeAllowList');

function isAllowListedPostcode(postcode) {
	return postcodeAllowList.some(allowedPostcode => {
		return formatPostcode(allowedPostcode) === postcode;
	});
}

function formatPostcode(postcode) {
	return postcode.replace(/[^\da-zA-Z]/g, '')
		.replaceAll(' ', '')
		.toUpperCase();
}

async function handle(postcode) {
	const cleansedPostcode = formatPostcode(postcode);

	let message = '';

	if (postcode.length === 0) {
		message = 'Please enter a postcode';
	} else if (!cleansedPostcode.length > 0) {
		message = 'That postcode does not look valid, please try again';
	} else if (cleansedPostcode.length < postcodeValidationMinLength) {
		message = `The postcode "${cleansedPostcode}" looks too short, please try again`;
	} else if (cleansedPostcode.length > postcodeValidationMaxLength) {
		message = `The postcode "${cleansedPostcode}" looks too long, please try again`;
	} else if (isAllowListedPostcode(cleansedPostcode)) {
		message = `The postcode "${cleansedPostcode}" is in the service area`;
	} else {
		message = (await validateLSOA(cleansedPostcode)) ? `The postcode "${cleansedPostcode}" is in the service area` : `The postcode "${cleansedPostcode}" is not in the service area`;
	}

	return message;
}

export default handle;
