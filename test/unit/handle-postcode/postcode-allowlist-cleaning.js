import quibble from 'quibble';
import test from 'ava';

/*
	ES Modules do not play well with mocking, so as a workaround:
		- Use one test file per test, when mocking is used
	See: https://github.com/testdouble/quibble/issues/39
*/

test('Postcode allowlist cleaning', async t => {
	const mockConfig = {
		postcodeValidationMinLength: 1,
		postcodeValidationMaxLength: 10,
		postcodeAllowList: [
			'abc def',
			'a e I ou'
		]
	};
	await quibble.esm('../../../src/server/lib/validate-lsoa.js', null, {});
	await quibble.esm('config', null, {
		get(property) {
			return mockConfig[property];
		}
	});

	// eslint-disable-next-line node/no-unsupported-features/es-syntax
	const {default: handlePostcode} = await import('../../../src/server/lib/handle-postcode.js');

	t.is(await handlePostcode('abc D ef'), 'The postcode "ABCDEF" is in the service area', 'A postcode in the allowlist is part of the service area');
	t.is(await handlePostcode('aeiou'), 'The postcode "AEIOU" is in the service area', 'A postcode in the allowlist is part of the service area');

	quibble.reset();
});
