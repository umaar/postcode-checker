import express from 'express';
import config from 'config';
import getPort from 'get-port';

import appConfig from './config/main-config.js';
import routeConfig from './config/route-config.js';
import errorConfig from './config/error-config.js';

async function start() {
	const app = express();

	appConfig(app, express);
	routeConfig(app);
	errorConfig(app);

	const desiredPort = config.get('port');

	const port = process.env.PORT || await getPort({
		port: desiredPort
	});

	return app.listen(port, () => {
		console.log(`Server started: http://localhost:${port}`);
	});
}

export default start();
