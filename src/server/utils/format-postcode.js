function formatPostcode(postcode) {
	return postcode.replace(/[^\da-zA-Z]/g, '')
		.toUpperCase();
}

export default formatPostcode;
