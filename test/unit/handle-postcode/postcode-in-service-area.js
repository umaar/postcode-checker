import quibble from 'quibble';
import test from 'ava';

/*
	ES Modules do not play well with mocking, so as a workaround:
		- Use one test file per test, when mocking is used
	See: https://github.com/testdouble/quibble/issues/39
*/

test.beforeEach(async () => {
	await quibble.esm('../../../src/server/lib/validate-lsoa.js', undefined, {});
	await quibble.esm('../../../src/server/utils/postcode-allow-list.js', undefined, () => true);
	await quibble.esm('../../../src/server/utils/format-postcode.js', undefined, postcode => postcode);

	await quibble.esm('config', null, {
		get(property) {
			if (property === 'postcodeValidationMinLength') {
				return 2;
			}

			if (property === 'postcodeValidationMaxLength') {
				return 5;
			}
		}
	});
});

test.afterEach(() => {
	quibble.reset();
});

test('Postcode in a service area', async t => {
	// eslint-disable-next-line node/no-unsupported-features/es-syntax
	const {default: handlePostcode} = await import('../../../src/server/lib/handle-postcode.js');

	t.is(await handlePostcode('aaa'), 'The postcode "aaa" is in the service area', 'Informs the postcode is in a service area, with enough passing conditions');
});
