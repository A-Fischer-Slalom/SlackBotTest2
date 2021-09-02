const { App, ExpressReceiver } = require('@slack/bolt');
const express = require("express");
const path = require("path");

// PWAs want HTTPS!
function checkHttps(request, response, next) {
  // Check the protocol — if http, redirect to https.
  if (request.get("X-Forwarded-Proto").indexOf("https") != -1) {
    return next();
  } else {
    response.redirect("https://" + request.hostname + request.url);
  }
}

// Create a Bolt Receiver
const receiver = new ExpressReceiver({ signingSecret: process.env.SLACK_SIGNING_SECRET });

// Create the Bolt App, using the receiver
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver
});

receiver.router.all("*", checkHttps);

// A test route to make sure the server is up.
receiver.router.get("/api/ping", (request, response) => {
  console.log("❇️ Received GET request to /api/ping");
  response.send("pong!");
});

receiver.router.use(express.static("public"));

receiver.router.use(express.static(path.join(__dirname, 'build')));

// Express port-switching logic
let port;
console.log("❇️ NODE_ENV is", process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  port = process.env.PORT || 8080;
  receiver.router.use(express.static(path.join(__dirname, "../build")));
  receiver.router.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "../build", "index.html"));
  });
} else {
  port = 8080;
  console.log("⚠️ Not seeing your changes as you develop?");
  console.log(
    "⚠️ Do you need to set 'start': 'npm run development' in package.json?"
  );
}



app.message('hello', async ({ message, say }) => {
    await say({
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `👋 Hello there <@${message.user}>`
                },
                "accessory": {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Click Me",
                        "emoji": true
                    },
                    "action_id": "click_me_button"
                }
            }
        ]
    });
});

// Action listener function called when an interactive component with action_id of “click_me_button” is triggered
app.action('click_me_button', async ({ ack, body, client, say }) => {
    // Acknowledge action request before anything else
    await ack();
    let channelID = body.channel.id
    let userID = body.user.id
    // Respond to action with an ephemeral message
    await client.chat.postEphemeral({
    channel: channelID,
    user: userID,
    text: `<@${userID}> clicked the button! 🎉 `
  });
});

app.start(port);
console.log('app is running');