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
	const allowListPrefixes = ['Lambeth', 'Southwark'];

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
