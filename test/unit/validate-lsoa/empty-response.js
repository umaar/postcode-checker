import quibble from 'quibble';
import test from 'ava';
import createFetchMock from './utils/_fetch-mock.js';

/*
	ES Modules do not play well with mocking, so as a workaround:
		- Use one test file per test, when mocking is used
	See: https://github.com/testdouble/quibble/issues/39
*/

test('An empty response does not conform', async t => {
	await quibble('node-fetch', createFetchMock({}));

	// eslint-disable-next-line node/no-unsupported-features/es-syntax
	const {default: validateLsoa} = await import('../../../src/server/lib/validate-lsoa.js');

	const result = await validateLsoa('empty response');
	t.is(result, false, 'An empty JSON response returns false');
	quibble.reset();
});
