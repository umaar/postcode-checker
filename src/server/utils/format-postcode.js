function formatPostcode(postcode) {
	return postcode.replace(/[^\da-zA-Z]/g, '')
		.replaceAll(' ', '')
		.toUpperCase();
}

export default formatPostcode;
