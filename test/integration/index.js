import config from 'config';
import cheerio from 'cheerio';
import assert from 'assert';
import nock from 'nock';
import fetch from 'node-fetch';

import server from '../../src/server/index.js';

const port = config.get('port');
const baseLocalURL = `http://localhost:${port}`;

function getPostcodeURL(postcode) {
	const parameters = new URLSearchParams();
	parameters.append('postcode', postcode);

	return `${baseLocalURL}?${parameters.toString()}`;
}

function getMessageFromHTML(html) {
	const $ = cheerio.load(html);
	return $('.message').text();
}

async function getHTMLFromURL(url) {
	const response = await fetch(url);
	return response.text();
}

async function testPostcode({
	postcode,
	expectedMessage,
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

	const url = getPostcodeURL(postcode);
	const html = await getHTMLFromURL(url);
	const message = getMessageFromHTML(html);
	assert.strictEqual(message, expectedMessage);
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

function setup() {
	// A failsafe with nock. Ensure no third-party requests are ever
	// made as part of this integration test
	nock.disableNetConnect();
	nock.enableNetConnect('localhost');
}

function cleanup() {
	nock.cleanAll();
	nock.enableNetConnect();

	server.close();
}

async function test() {
	setup();

	await testPostcode({
		postcode: 'abcd',
		expectedMessage: 'The postcode "abcd" is in the service area',
		mockResponse: mockResponses.matchingServiceArea
	});

	await testPostcode({
		postcode: 'abcd',
		expectedMessage: 'The postcode "abcd" is not in the service area',
		mockResponse: mockResponses.outsideServiceArea
	});

	await testPostcode({
		postcode: 'abcd',
		expectedMessage: 'Sorry, something went wrong',
		error: true
	});

	cleanup();
}

test();

