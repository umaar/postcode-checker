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
	await quibble.esm('../../../src/server/utils/format-postcode.js', undefined, postcode => postcode);

	await quibble.esm('config', null, {
		get(property) {
			if (property === 'postcodeValidationMinLength') {
				return 2;
			}

			if (property === 'postcodeValidationMaxLength') {
				return 5;
			}
		},
	});
});

test.afterEach(() => {
	quibble.reset();
});

test('Postcode length out of bounds', async t => {
	const {default: handlePostcode} = await import('../../../src/server/lib/handle-postcode.js');

	t.is(await handlePostcode(''), 'Please enter a postcode', 'Prompts to insert a postcode when none has been supplied');
	t.is(await handlePostcode('A'), 'The postcode "A" looks too short, please try again', 'Informs that the postcode is too short');

	const longPostcode = 'A'.repeat(10);
	t.is(
		await handlePostcode(longPostcode),
		`The postcode "${longPostcode}" looks too long, please try again`,
		'Informs that the postcode is too long',
	);
});
