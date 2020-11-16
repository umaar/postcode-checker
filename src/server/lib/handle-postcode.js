import config from 'config';
import validateLSOA from './validate-lsoa.js';
import isAllowListedPostcode from '../utils/postcode-allow-list.js';

import formatPostcode from '../utils/format-postcode.js';

const postcodeValidationMinLength = config.get('postcodeValidationMinLength');
const postcodeValidationMaxLength = config.get('postcodeValidationMaxLength');

async function handle(postcode) {
	if (postcode.length === 0) {
		return 'Please enter a postcode';
	}

	const formattedPostcode = formatPostcode(postcode);

	if (!formattedPostcode.length > 0) {
		return 'That postcode does not look valid, please try again';
	}

	if (formattedPostcode.length < postcodeValidationMinLength) {
		return `The postcode "${formattedPostcode}" looks too short, please try again`;
	}

	if (formattedPostcode.length > postcodeValidationMaxLength) {
		return `The postcode "${formattedPostcode}" looks too long, please try again`;
	}

	if (isAllowListedPostcode(formattedPostcode) || await validateLSOA(formattedPostcode)) {
		return `The postcode "${formattedPostcode}" is in the service area`;
	}

	return `The postcode "${formattedPostcode}" is not in the service area`;
}

export default handle;
