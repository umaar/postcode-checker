import path from 'path';
import bodyParser from 'body-parser';
import nunjucks from 'nunjucks';
import config from 'config';
import compression from 'compression';

function init(app, express) {
	const viewFolders = [
		path.join(process.cwd(), 'src', 'server', 'views')
	];

	nunjucks.configure(viewFolders, {
		express: app,
		autoescape: true,
		noCache: true
	});

	app.locals.config = {
		productName: config.get('productName'),
		postcodeValidationMaxLength: config.get('postcodeValidationMaxLength'),
		postcodeValidationMinLength: config.get('postcodeValidationMinLength')
	};

	app.set('view engine', 'html');

	app.use(compression());

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: false
	}));

	app.use(express.static(path.join(process.cwd(), 'src', 'client'), {
		maxAge: '1y'
	}));
}

export default init;
