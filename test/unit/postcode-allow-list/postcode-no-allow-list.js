import quibble from 'quibble';
import test from 'ava';

/*
	ES Modules do not play well with mocking, so as a workaround:
		- Use one test file per test, when mocking is used
	See: https://github.com/testdouble/quibble/issues/39
*/

test.beforeEach(async () => {
	await quibble.esm('../../../src/server/utils/format-postcode.js', undefined, postcode => postcode);

	await quibble.esm('config', null, {
		get() {}
	});
});

test.afterEach(() => {
	quibble.reset();
});

test('Postcode allow list check', async t => {
	// eslint-disable-next-line node/no-unsupported-features/es-syntax
	const {default: isAllowListedPostcode} = await import('../../../src/server/utils/postcode-allow-list.js');

	t.is(await isAllowListedPostcode('111'), false, 'A postcode cannot be part of a non-existent allow list');
	t.is(await isAllowListedPostcode('ABC'), false, 'A postcode cannot be part of a non-existent allow list');
	t.is(await isAllowListedPostcode(''), false, 'An empty string does not match a non-existent allow list');
});
