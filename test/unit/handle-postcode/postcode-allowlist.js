import quibble from 'quibble';
import test from 'ava';

test.beforeEach(async () => {
	await quibble.esm('../../../src/server/lib/validate-lsoa.js', undefined, {});
});

test.afterEach(() => {
	quibble.reset();
});

test('Postcode from an allowlist', async t => {
	// eslint-disable-next-line node/no-unsupported-features/es-syntax
	const {default: handlePostcode} = await import('../../../src/server/lib/handle-postcode.js');

	t.is(await handlePostcode('SH24 1AA'), 'The postcode "SH241AA" is in the service area', 'A postcode in the allowlist is part of the service area');
});
