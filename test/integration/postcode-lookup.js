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
			mocked.replyWithError('Expected network failure as part of a unit test!');
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

test('Postcode within a service area', async t => {
	const message = await t.context.testPostcode({
		postcode: 'ABCD',
		mockResponse: mockResponses.matchingServiceArea
	});

	t.is(message, 'The postcode "ABCD" is in the service area');
});

test('Postcode outside of a service error', async t => {
	const message = await t.context.testPostcode({
		postcode: 'ABCD',
		mockResponse: mockResponses.outsideServiceArea
	});

	t.is(message, 'The postcode "ABCD" is not in the service area');
});

test('Third-party postcode lookup service is down', async t => {
	const message = await t.context.testPostcode({
		postcode: 'ABCD',
		error: true
	});

	t.is(message, 'Sorry, something went wrong');
});

