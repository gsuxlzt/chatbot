'use strict';

const
	express = require('express'),
	request = require('request'),
	bodyParser = require('body-parser'),
	app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 5000));

app.get("/", (req, res) => {
	res.send("Deployed");
})

app.get('/webhook', (req, res) => {
	let VERIFY_TOKEN = "this_is_my_token"

	let mode = req.query['hub.mode'];
	let token = req.query['hub.verify_token'];
	let challenge = req.query['hub.challenge'];

	if (mode && token) {
		if (mode === 'subscribe' && token === VERIFY_TOKEN) {
			console.log('webhook verified');
			res.status(200).send(challenge);
		} else {
			res.sendStatus(403);
		}
	}
});