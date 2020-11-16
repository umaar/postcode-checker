import nock from 'nock';
import test from 'ava';

import testPostcodeWithURL from './_utils.js';

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

	t.is(message, 'Sorry, something went wrong', 'Message informs of a backend error');
});

