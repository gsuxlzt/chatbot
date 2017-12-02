'use strict';

const
	express = require('express'),
	bodyParser = require('body-parser'),
	app = express().use(bodyParser.json());


app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

app.post('/webhook', (req, res) => {
	let body = req.body;

	if (body.object === 'page') {
		body.entry.forEach(function(entry) {
			let webhookEvent = entry.messaging[0];
			console.log(webhookEvent);
		});
		res.status(200).send('Event_received');
	} else {
		res.sendStatus(404);
	}
})

app.get('/webhook', (req, res) => {
	let VERIFY_TOKEN = "<YOUR_VERIFY_TOKEN>"

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