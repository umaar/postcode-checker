import cheerio from 'cheerio';
import nock from 'nock';
import fetch from 'node-fetch';
import test from 'ava';

function getPostcodeURL({postcode, baseURL}) {
	const parameters = new URLSearchParams();
	parameters.append('postcode', postcode);

	return `${baseURL}?${parameters.toString()}`;
}

function getMessageFromHTML(html) {
	const $ = cheerio.load(html);
	return $('.message').text();
}

async function getHTMLFromURL(url) {
	const response = await fetch(url);
	return response.text();
}

function testPostcodeWithURL(baseURL) {
	return async function ({
		postcode,
		mockResponse,
		error = false
	}) {
		const mocked = nock('https://postcodes.io')
			.get(`/postcodes/${postcode}`);

		if (error) {
			mocked.replyWithError('Noooooooo');
		} else {
			mocked.reply(200, mockResponse);
		}

		const url = getPostcodeURL({
			postcode,
			baseURL
		});
		const html = await getHTMLFromURL(url);
		const message = getMessageFromHTML(html);
		return message;
	};
}

const mockResponses = {
	matchingServiceArea: {
		result: {
			lsoa: 'Lambeth'
		}
	},
	outsideServiceArea: {
		result: {
			lsoa: 'AABBCCDD'
		}
	}
};

test.beforeEach(async t => {
	// A failsafe with nock. Ensure no third-party requests are ever
	// made as part of this integration test
	nock.disableNetConnect();
	nock.enableNetConnect('localhost');

	// eslint-disable-next-line node/no-unsupported-features/es-syntax
	const {default: serverPromise} = await import('../../src/server/index.js');
	const server = await serverPromise;
	const baseLocalURL = `http://localhost:${server.address().port}`;
	t.context.testPostcode = testPostcodeWithURL(baseLocalURL);
	t.context.server = server;
});

test.afterEach(t => {
	nock.cleanAll();
	nock.enableNetConnect();
	t.context.server.close();
});

test('postcode 1', async t => {
	const message = await t.context.testPostcode({
		postcode: 'abcd',
		mockResponse: mockResponses.matchingServiceArea
	});

	t.is(message, 'The postcode "abcd" is in the service area');
});

test('postcode 2', async t => {
	const message = await t.context.testPostcode({
		postcode: 'abcd',
		mockResponse: mockResponses.outsideServiceArea
	});

	t.is(message, 'The postcode "abcd" is not in the service area');
});

test('postcode 3', async t => {
	const message = await t.context.testPostcode({
		postcode: 'abcd',
		error: true
	});

	t.is(message, 'Sorry, something went wrong');
});

