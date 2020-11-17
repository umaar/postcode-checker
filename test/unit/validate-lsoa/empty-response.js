import quibble from 'quibble';
import test from 'ava';
import createFetchMock from './utils/_fetch-mock.js';

/*
	ES Modules do not play well with mocking, so as a workaround:
		- Use one test file per test, when mocking is used
	See: https://github.com/testdouble/quibble/issues/39
*/

test.beforeEach(async () => {
	await quibble('node-fetch', createFetchMock({}));
	await quibble.esm('config', null, {
		get() {}
	});
});

test.afterEach(() => {
	quibble.reset();
});

test('An empty API response is handled', async t => {
	const {default: validateLsoa} = await import('../../../src/server/lib/validate-lsoa.js');

	const result = await validateLsoa();
	t.is(result, false, 'An empty JSON response returns false');
});
