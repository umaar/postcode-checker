import express from 'express';

import appConfig from './config/main-config.js';
import routeConfig from './config/route-config.js';
import errorConfig from './config/error-config.js';

const app = express();
const port = 3000;

appConfig(app, express);
routeConfig(app);
errorConfig(app);

const server = app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});

export default server;
