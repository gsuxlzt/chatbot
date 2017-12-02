const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 5000));

const Applicant = require('./classes/Applicant/Applicant').default;

let steps = [];

// Server index page
app.get('/', (req, res) => {
  res.send("Deployed!");
});

app.post("/user_info", function (req, res) {
  console.log('test');

  if (!req.body.id) {
    res.send("User needs an id");
  }
  else {
    const user = new Applicant(id);

    res.sendStatus(200);
  }
});

// Facebook Webhook
// used for verification
app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === 'this_is_my_token') {
      console.log("Verified webhook");

      res.status(200).send(req.query['hub.challenge']);
  } else {
      console.error("Verification failed. The tokens do not match");

      res.sendStatus(403);
  }
});

// All callbacks for Messenger will be POST-ed here
app.post('/webhook', (req, res) => {
  // Make sure this is a page subscription
  if (req.body.object === 'page') {
    // Iterate over each entry
    // There may be multiple entries if batched
    req.body.entry.forEach(entry => {
      // Iterate over each messaging event
      entry.messaging.forEach(event => {
        if (event.postback) {
          processPostback(event);
        } else if (event.message) {
          processMessage(event);
        }
      });
    });

    res.sendStatus(200);
  }
});

function processPostback(event) {
  const senderId = event.sender.id;
  const payload = event.postback.payload;

  if (payload === 'Greeting') {
    // Get user's first name from the User Profile API
    // and include it in the greeting
    request({
      url: `https://graph.facebook.com/v2.6/${senderId}`,
      qs: {
        access_token: process.env.PAGE_ACCESS_TOKEN,
        fields: 'first_name'
      },
      method: 'GET'
    }, (error, response, body) => {
      let greeting = "";

      if (error) {
        console.log(`Error getting user's name: ${error}`);
      } else {
        const bodyObj = JSON.parse(body);

        greeting = `Hi ${bodyObj.first_name}.`;
      }
      
      greeting = `${greeting} I am Inclusy, your intelligent loan officer bot. I can help you with loan and mortgage-related matters.`;

      sendMessage(senderId, {text: greeting});
    });
  }
}

// sends message to user
function sendMessage(recipientId, message) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
    method: 'POST',
    json: {
      recipient: {id: recipientId},
      message: message
    }
  }, (error, response, body) => {
    if (error) {
      console.log(`Error sending message: ${response.error}`);
    }
  });
}

function processMessage(event) {
  if (!event.message.is_echo) {
    const message = event.message;
    const senderId = event.sender.id;

    console.log(`Received message from senderId: ${senderId}`);
    console.log(`Message is: ${JSON.stringify(message)}`);

    if (message.text) {
      let text;

      const formattedMsg = message.text.toLowerCase().trim();

      if (steps.length) {
        let len = steps.length;

        if (len === 2) {
          text = isNaN(Number(formattedMsg)) ?
              'I need to know how much you need.' :
              'Got it! For further information, please proceed to your local branch.';
        }
        else if (len === 1) {
          if (formattedMsg.includes('yes')) {
            text = 'May I ask how much';

            steps.push(true);
          }
          else {
            text = "I'm sorry, but I can only assist you with loan-related matters.";
          }
        }
      }
      else if (hasKeyword(formattedMsg)) {
        text = "May I clarify that you're asking for a loan? Please reply 'Yes' to proceed.";

        steps.push(true);
      }
      else {
        text = "I don't understand what you said.";
      }

      sendMessage(senderId, {text})
    }
  }
}

function hasKeyword(message) {
    const keywords = [
        'loan',
        'mortgage',
        'borrow',
        'business',
        'peso'
    ];

    return keywords.some(keyword => message.includes(keyword));
}
