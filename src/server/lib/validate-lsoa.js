import fetch from 'node-fetch';
import config from 'config';

const allowListPrefixes = config.get('postcodeAllowListPrefixes');

async function validate(postcode) {
	const response = await fetch(`https://postcodes.io/postcodes/${postcode}`);
	const json = await response.json();

	const {
		result: {lsoa} = {}
	} = json;

	if (lsoa) {
		return allowListPrefixes.some(allowListPrefix => {
			return lsoa.startsWith(allowListPrefix);
		});
	}

	return false;
}

export default validate;
