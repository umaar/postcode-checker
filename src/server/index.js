import express from 'express';
import config from 'config';
import getPort from 'get-port';
import { initializeDatabase } from './utils/database.js'; // Import the initializeDatabase function

import appConfig from './config/main-config.js';
import routeConfig from './config/route-config.js';
import errorConfig from './config/error-config.js';

async function startServer(app) {
	const desiredPort = config.get('port');

	const port = process.env.PORT || await getPort({
		port: desiredPort,
	});

	return new Promise(resolve => {
		const server = app.listen(port, () => {
			console.log(`Server started: http://localhost:${port}`);
			resolve(server);
		});
	});
}

async function start() {
	const app = express();

	appConfig(app, express);
	routeConfig(app);
	errorConfig(app);

	await initializeDatabase(); // Ensure the database is initialized

	return startServer(app);
}

export default start();
