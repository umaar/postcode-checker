import quibble from 'quibble';
import test from 'ava';

/*
	ES Modules do not play well with mocking, so as a workaround:
		- Use one test file per test, when mocking is used
	See: https://github.com/testdouble/quibble/issues/39
*/

async function mocked() {}

test('Postcode cleaning', async t => {
	const spy = new Proxy(mocked, {
		apply(target, _, arguments_) {
			target.lastCalledArgument = arguments_[0];
		}
	});

	await quibble.esm('../../../src/server/lib/validate-lsoa.js', null, spy);

	// eslint-disable-next-line node/no-unsupported-features/es-syntax
	const {default: handlePostcode} = await import('../../../src/server/lib/handle-postcode.js');

	await handlePostcode('ABC D E F');
	t.is(mocked.lastCalledArgument, 'ABCDEF', 'spaces are removed from a postcode');

	await handlePostcode('a!b£c%');
	t.is(mocked.lastCalledArgument, 'abc', 'symbols are removed from a postcode');

	quibble.reset();
});
