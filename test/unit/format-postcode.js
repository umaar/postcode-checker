import test from 'ava';
import 'quibble'; // eslint-disable-line import/no-unassigned-import

test('Formatting postcodes', async t => {
	// eslint-disable-next-line node/no-unsupported-features/es-syntax
	const {default: formatPostcode} = await import('../../src/server/utils/format-postcode.js');

	t.is(formatPostcode('aaBBcc'), 'AABBCC', 'Uppercases the post');
	t.is(formatPostcode('   '), '', 'Space characters are removed');
	t.is(formatPostcode(' a s  d'), 'ASD', 'Space characters are removed in between postcodes');
	t.is(formatPostcode('*'), '', 'Symbols are removed');
	t.is(formatPostcode('&a*b*c*'), 'ABC', 'Symbols are removed');
	t.is(formatPostcode('a1b2c3'), 'A1B2C3', 'Numbers are left alone');
});
