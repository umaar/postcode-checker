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
		get() {
			return ['ABC', 'XYZ'];
		},
	});
});

test.afterEach(() => {
	quibble.reset();
});

test('Postcode allow list check', async t => {
	const {default: isAllowListedPostcode} = await import('../../../src/server/utils/postcode-allow-list.js');

	t.is(await isAllowListedPostcode('111'), false, 'When not part of the allow list, false is returned');
	t.is(await isAllowListedPostcode('ABC'), true, 'When part of the allow list, true is returned');
	t.is(await isAllowListedPostcode('XYZ'), true, 'When part of the allow list, true is returned');
});
