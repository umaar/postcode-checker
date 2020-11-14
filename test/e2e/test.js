import test from 'ava';
import config from 'config';
import withPage from './_with-page.js';

const port = config.get('port');
const baseLocalURL = `http://localhost:${port}`;

test.before(async t => {
	// eslint-disable-next-line node/no-unsupported-features/es-syntax
	const {default: serverPromise} = await import('../../src/server/index.js');
	const server = await serverPromise;
	t.context.server = server;
});

test.after(t => {
	t.context.server.close();
});

async function submitPostcode({postcode, page}) {
	await page.type('#postcode', postcode);
	await Promise.all([
		page.click('[type="submit"]'),
		page.waitForNavigation(['load'])
	]);
}

test('page title should be correct', withPage, async (t, page) => {
	await page.goto(baseLocalURL);
	t.is(await page.title(), 'Postcode Checker', 'Page title is correct');
});

test('Searching for a postcode within the service area', withPage, async (t, page) => {
	await page.goto(baseLocalURL);
	await submitPostcode({
		postcode: 'SE1 7QD',
		page
	});
	const message = await page.$eval('.message', element => element.textContent);
	t.is(message, 'The postcode "SE1 7QD" is in the service area');
});

test('Searching for an invalid postcode', withPage, async (t, page) => {
	await page.goto(baseLocalURL);
	await submitPostcode({
		postcode: 'aaa',
		page
	});
	const message = await page.$eval('.message', element => element.textContent);
	t.is(message, 'The postcode "aaa" is not in the service area');
});
