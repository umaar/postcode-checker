import quibble from 'quibble';
import test from 'ava';
import createFetchMock from './utils/_fetch-mock.js';

/*
	ES Modules do not play well with mocking, so as a workaround:
		- Use one test file per test, when mocking is used
	See: https://github.com/testdouble/quibble/issues/39
*/

test.beforeEach(async () => {
	await quibble('node-fetch', createFetchMock({
		result: {
			lsoa: 'random lsoa'
		}
	}));
	await quibble.esm('config', null, {
		get() {
			return ['abc', 'def'];
		}
	});
});

test.afterEach(() => {
	quibble.reset();
});

test('lambeth', async t => {
	const {default: validateLsoa} = await import('../../../src/server/lib/validate-lsoa.js');

	const result = await validateLsoa();
	t.is(result, false, 'When an lsoa is present, but does not match the allowlist, false is returned');
});
