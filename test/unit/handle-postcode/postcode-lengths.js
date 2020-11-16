import quibble from 'quibble';
import test from 'ava';

test.beforeEach(async () => {
	await quibble.esm('../../../src/server/lib/validate-lsoa.js', undefined, {});
});

test.afterEach(() => {
	quibble.reset();
});

test('Postcode lengths out of bounds', async t => {
	// eslint-disable-next-line node/no-unsupported-features/es-syntax
	const {default: handlePostcode} = await import('../../../src/server/lib/handle-postcode.js');

	t.is(await handlePostcode('a'), 'The postcode "A" looks too short, please try again', 'Informs that the postcode is too short');

	t.is(await handlePostcode(''), 'Please enter a postcode', 'Prompt to insert a postcode when none has been supplied');

	const longPostcode = 'a'.repeat(50);
	t.is(
		await handlePostcode(longPostcode),
		`The postcode "${longPostcode.toUpperCase()}" looks too long, please try again`,
		'Informs that the postcode is too long'
	);
});

test('Invalid postcodes', async t => {
	// eslint-disable-next-line node/no-unsupported-features/es-syntax
	const {default: handlePostcode} = await import('../../../src/server/lib/handle-postcode.js');

	t.is(await handlePostcode('&&'), 'That postcode does not look valid, please try again', 'Informs of an invalid postcode');
	t.is(await handlePostcode('%^*'), 'That postcode does not look valid, please try again', 'Informs of an invalid postcode');
});
