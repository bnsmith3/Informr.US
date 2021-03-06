if (!process.env.OPEN_STATES_API_KEY) {
	require('dotenv').config();
}

const express = require('express');
const heroku = require('heroku-ping');

const geolookup = require('./server/controllers/geolookup.js');

var app = express();
//Redirect to https site
app.use(function(req,res,next) {
	if (process.env.PORT && req.headers['x-forwarded-proto'] !== 'https') {
		//needed for heroku redirects
		res.redirect('https://informr.us'+req.url);
	} else {
		next();
	}
});
app.use(express.static('src'));
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.render('index.html');
});

app.get('/geolookup/:lat/:lon', geolookup);

app.listen(process.env.PORT || 3002, () => {
	/* eslint-disable no-console */
	console.log(`Server started at ${process.env.PORT || 3002}`);
});

//ONLY do this on prod
if (process.env.PORT) {
	heroku.ping({
		interval: 300000,     // milliseconds, defaults to 30 minutes
		silent: false,       // logging (default: false)
		apps: [{
			name: 'inform-r-us', // heroku app name - required
			secure: true      // requires https (defaults: false)
		}]
	});
}
