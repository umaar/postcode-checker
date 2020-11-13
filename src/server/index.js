import express from 'express';
import config from 'config';

import appConfig from './config/main-config.js';
import routeConfig from './config/route-config.js';
import errorConfig from './config/error-config.js';

const app = express();
const port = process.env.PORT || config.get('port');

appConfig(app, express);
routeConfig(app);
errorConfig(app);

const server = app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});

export default server;
