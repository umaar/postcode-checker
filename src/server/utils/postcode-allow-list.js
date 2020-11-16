import config from 'config';
import formatPostcode from './format-postcode.js';

const allowList = config.get('postcodeAllowList') || [];

const postcodeAllowList = new Set(allowList
	.map(postcode => formatPostcode(postcode)));

function isAllowListedPostcode(postcode) {
	return postcodeAllowList.has(postcode);
}

export default isAllowListedPostcode;
