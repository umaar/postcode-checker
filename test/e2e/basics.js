import test from 'ava';
import withPage from './_with-page.js';

test.before(async t => {
	const {default: startServer} = await import('../../src/server/index.js');
	const server = await startServer;
	t.context.baseURL = `http://localhost:${server.address().port}`;
	t.context.server = server;
});

test.after(t => {
	t.context.server.close();
});

async function submitPostcode({postcode, page}) {
	await page.type('#postcode', postcode);
	await Promise.all([
		page.click('[type="submit"]'),
		page.waitForNavigation(['load']),
	]);
}

test('page title should be correct', withPage, async (t, page) => {
	await page.goto(t.context.baseURL);
	t.is(await page.title(), 'Postcode Checker', 'Page title is correct');
});

test('Searching for a postcode within the service area', withPage, async (t, page) => {
	await page.goto(t.context.baseURL);
	await submitPostcode({
		postcode: 'SE1 7QD',
		page,
	});
	const message = await page.$eval('.message', element => element.textContent);
	t.is(message, 'The postcode "SE17QD" is in the service area', 'Message informs that the postcode is within the service area');
});

test('Searching for an unknown postcode', withPage, async (t, page) => {
	await page.goto(t.context.baseURL);
	await submitPostcode({
		postcode: 'aaa',
		page,
	});
	const message = await page.$eval('.message', element => element.textContent);
	t.is(message, 'The postcode "AAA" is not in the service area', 'Message informs that the postcode is not in the service area');
});

test('Searching for postcodes consecutively', withPage, async (t, page) => {
	await page.goto(t.context.baseURL);
	await submitPostcode({
		postcode: 'SH24 1AB',
		page,
	});
	const message1 = await page.$eval('.message', element => element.textContent);
	t.is(message1, 'The postcode "SH241AB" is in the service area', 'Message confirms postcode is in the service area');

	await submitPostcode({
		postcode: 'N2 00 AG',
		page,
	});
	const message2 = await page.$eval('.message', element => element.textContent);
	t.is(message2, 'The postcode "N200AG" is not in the service area', 'Message confirms postcode is not in the service area');

	await submitPostcode({
		postcode: ' SE1 7QA ',
		page,
	});
	const message3 = await page.$eval('.message', element => element.textContent);
	t.is(message3, 'The postcode "SE17QA" is in the service area', 'Message confirms postcode is in the service area');
});

test('Searching for postcode within the allowlist', withPage, async (t, page) => {
	await page.goto(t.context.baseURL);
	await submitPostcode({
		postcode: 'SH24 1AA',
		page,
	});
	const message = await page.$eval('.message', element => element.textContent);
	t.is(message, 'The postcode "SH241AA" is in the service area', 'A postcode from the allowlist is allowed');
});
