import quibble from 'quibble';
import test from 'ava';
import createFetchMock from './utils/_fetch-mock.js';

test('When a postcode is not found via the API', async t => {
	await quibble('node-fetch', createFetchMock({
		error: 'Postcode not found'
	}));
	// eslint-disable-next-line node/no-unsupported-features/es-syntax
	const {default: validateLsoa} = await import('../../../src/server/lib/validate-lsoa.js');

	const result = await validateLsoa('quibbled: ');
	t.is(result, true, 'When a postcode is not found via the API, the validate function returns true');
	quibble.reset();
});
