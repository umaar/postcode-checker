import fetch from 'node-fetch';

/*
	To validate:
	- SE17QD
	- N200AG
	- SH241AA
	- abc

	also check proper response status codes
	and check when service goes down.
*/

async function validate(postcode) {
	try {
		const allowListPrefixes = ['Lambeth', 'Southwark'];

		const response = await fetch(`https://postcodes.io/postcodes/${postcode}`);
		const json = await response.json();

		const {
			result: {lsoa} = {},
			error
		} = json;

		if (lsoa) {
			return allowListPrefixes.some(allowListPrefix => {
				return lsoa.startsWith(allowListPrefix);
			});
		}

		if (error === 'Postcode not found') {
			return true;
		}

		return false;
	} catch (error) {
		throw error;
	}
}

export default validate;
