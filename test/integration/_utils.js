import cheerio from 'cheerio';
import fetch from 'node-fetch';
import nock from 'nock';

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
		error = false,
	}) {
		const mocked = nock('https://postcodes.io')
			.get(`/postcodes/${postcode}`);

		if (error) {
			mocked.replyWithError('This error is expected - a network failure as part of a unit test!');
		} else {
			mocked.reply(200, mockResponse);
		}

		const url = getPostcodeURL({
			postcode,
			baseURL,
		});
		const html = await getHTMLFromURL(url);
		const message = getMessageFromHTML(html);
		return message;
	};
}

export default testPostcodeWithURL;
