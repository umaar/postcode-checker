import quibble from 'quibble';
import test from 'ava';

/*
	ES Modules do not play well with mocking, so as a workaround:
		- Use one test file per test, when mocking is used
	See: https://github.com/testdouble/quibble/issues/39
*/

test.beforeEach(async () => {
	await quibble.esm('../../../src/server/lib/validate-lsoa.js', undefined, {});
	await quibble.esm('../../../src/server/utils/postcode-allow-list.js', undefined, {});
	await quibble.esm('../../../src/server/utils/format-postcode.js', undefined, () => '');

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

test('Invalid postcodes', async t => {
	const {default: handlePostcode} = await import('../../../src/server/lib/handle-postcode.js');

	t.is(await handlePostcode('aaa'), 'That postcode does not look valid, please try again', 'Informs of an invalid postcode');
	t.is(await handlePostcode('   	'), 'That postcode does not look valid, please try again', 'Informs of an invalid postcode');
});
