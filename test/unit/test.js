import test from 'ava';
import quibble from 'quibble';

test('An empty response does not conform', async t => {
	async function mocked() {
		return {
			async json() {
				return {};
			}
		};
	}

	await quibble('node-fetch', mocked);
	const {default: validateLsoa} = await import('../../src/server/lib/validate-lsoa.js?q=1');

	const result = await validateLsoa('empty response');
	console.log(result);

	t.is(true, true);
	quibble.reset();
});

test('Postcode not found error is handled correctly', async t => {
	async function mocked() {
		return {
			async json() {
				return {noooo: 'yes'};
			}
		};
	}

	await quibble('node-fetch', mocked);

	const {default: validateLsoa} = await import('../../src/server/lib/validate-lsoa.js?q=44');
	const result = await validateLsoa('postcode with error response');
	quibble.reset();
	console.log(result);

	t.is(true, true);
});
