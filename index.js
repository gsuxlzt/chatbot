var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");
var moment = require("moment");

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 5000));

// Server index page
app.get("/", function (req, res) {
    res.send("Deployed!");
});

app.post("/user_info", function (req, res) {
	console.log('test')
	if (!req.body.id) {
		res.send("User needs an id");
	}
	else {
		createUser(req.body.id)
		res.sendStatus(200)
	}

});



// Facebook Webhook
// used for verification
app.get("/webhook", function (req, res) {
	console.log(req.query)
    if (req.query["hub.verify_token"] === "this_is_my_token") {
        console.log("Verified webhook");
        res.status(200).send(req.query["hub.challenge"]);
    } else {
        console.error("Verification failed. The tokens do not match");
        res.sendStatus(403);
    }
});

// All callbacks for Messenger will be POST-ed here
app.post("/webhook", function (req, res) {
  // Make sure this is a page subscription
  if (req.body.object == "page") {
    // Iterate over each entry
    // There may be multiple entries if batched
    req.body.entry.forEach(function(entry) {
      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.postback) {
          processPostback(event);
        }
      });
    });

    res.sendStatus(200);
  }
});

function processPostback(event) {
  var senderId = event.sender.id;
  var payload = event.postback.payload;

  if (payload === "Greeting") {
    // Get user's first name from the User Profile API
    // and include it in the greeting
    request({
      url: "https://graph.facebook.com/v2.11/" + senderId,
      qs: {
        access_token: process.env.PAGE_ACCESS_TOKEN,
        fields: "first_name"
      },
      method: "GET"
    }, function(error, response, body) {
      var greeting = "";
      if (error) {
        console.log("Error getting user's name: " +  error);
      } else {
        var bodyObj = JSON.parse(body);
        name = bodyObj.first_name;
        greeting = "Hi " + name + ". ";
      }
      var message = greeting;
      createUser(senderId);
      sendMessage(senderId, {text: message});
    });
}

// sends message to user
function sendMessage(recipientId, message) {
  request({
    url: "https://graph.facebook.com/v2.11/me/messages",
    qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
    method: "POST",
    json: {
      recipient: {id: recipientId},
      message: message,
    }
  }, function(error, response, body) {
    if (error) {
      console.log("Error sending message: " + response.error);
    }
  });
}

function createUser(id) {
	let user = {}
	let rand_year = Math.floor(Math.random()*13) + 1;
	let rand_work = Math.floor(Math.random()*5);
	let rand_educ = Math.floor(Math.random()*3);
	let bool = Math.floor(Math.random()*2) === 0;
	user.user_profile_creation_date = moment().subtract(rand_year,'years');
	user.user_profile_id = id;
	let user_background = {};
	user_background.work = getWorkStatus(rand_work);
	user_background.education = getEducation(rand_educ);
	user_background.age = bool ? 24 : 26;
	user_background.family = bool
	user.user_background = user_background
	}

	console.log('user created');
}

function getWorkStatus (num) {
	switch (num) {
		case 0:
			return 'UNEMPLOYED'
		case 1:
			return 'OTHER_MICRO_VENDOR'
		case 2:
			return 'SARI_SARI_VENDOR'
		case 3:
			return 'MARKET_VENDOR'
		case 4:
			return 'EMPLOYEE'
	}
}

function getEducation (num) {
	switch (num) {
		case 0:
			return 'NONE'
		case 1:
			return 'HIGH_SCHOOL'
		case 2:
			return 'COLLEGE'
	}
}