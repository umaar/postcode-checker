import quibble from 'quibble';
import test from 'ava';
import createFetchMock from './utils/_fetch-mock.js';

test('lambeth', async t => {
	await quibble('node-fetch', createFetchMock({
		result: {
			lsoa: 'Lambeth'
		}
	}));
	// eslint-disable-next-line node/no-unsupported-features/es-syntax
	const {default: validateLsoa} = await import('../../../src/server/lib/validate-lsoa.js');

	const result = await validateLsoa('quibbled: ');
	t.is(result, true, 'When an `lsoa` matches a pre-defined allowlist, true is returned');
	quibble.reset();
});
