import quibble from 'quibble';
import test from 'ava';
import createFetchMock from './utils/_fetch-mock.js';

test('lambeth', async t => {
	await quibble('node-fetch', createFetchMock({
		result: {
			lsoa: 'abc'
		}
	}));
	// eslint-disable-next-line node/no-unsupported-features/es-syntax
	const {default: validateLsoa} = await import('../../../src/server/lib/validate-lsoa.js');

	const result = await validateLsoa('hello');
	t.is(result, false, 'When an lsoa is present, but does not match the allowlist, false is returned');
	quibble.reset();
});
