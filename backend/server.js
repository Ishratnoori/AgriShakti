const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");
const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Serve the 'media' folder publicly
app.use("/media", express.static("media"));

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// POST endpoint for incoming WhatsApp messages
app.post("/whatsapp", async (req, res) => {
  const from = req.body.From;
  const body = req.body.Body || "";
  const numMedia = parseInt(req.body.NumMedia) || 0;

  console.log(`Incoming from ${from}: ${body}, Media count: ${numMedia}`);

  const twiml = new twilio.twiml.MessagingResponse();

  if (numMedia > 0) {
    try {
      // Download first media file
      const mediaUrl = req.body.MediaUrl0;
      const mediaType = req.body.MediaContentType0;

      console.log("Received media URL:", mediaUrl, "Type:", mediaType);

      const auth = {
        username: accountSid,
        password: authToken
      };

      const response = await axios({
        url: mediaUrl,
        method: "GET",
        responseType: "arraybuffer",
        auth: auth
      });

      // Save to 'media' folder
      const localFile = "media/crop_input.jpg";
      fs.writeFileSync(localFile, response.data);
      console.log("Media downloaded:", localFile);

      // Result URL served via Express + Ngrok
      const ngrokUrl = process.env.NGROK_URL; // e.g., https://a9faffb2ae88.ngrok-free.app
      const resultMediaUrl = `https://a9faffb2ae88.ngrok-free.app/media/crop_input.jpg`; // public URL

      // Respond back to WhatsApp
      const msg = twiml.message();
      msg.body("Here is the health analysis of your crop!");
      msg.media(resultMediaUrl);

    } catch (err) {
      console.error("Error downloading media:", err);
      twiml.message("Sorry, could not process your image.");
    }
  } else {
       try {
    // Call your FastAPI GET endpoint
    const fastApiUrl = `http://127.0.0.1:8000/query?user_query=${encodeURIComponent(body)}`;
    const response = await axios.get(fastApiUrl);

    // Extract response data
    const replyText = response.data; // adjust this if your FastAPI returns { key: value }

    // Send back to WhatsApp
    const msg = twiml.message();
    msg.body(`Response from FastAPI: ${JSON.stringify(replyText)}`);

  } catch (err) {
    console.error("Error calling FastAPI:", err);
    twiml.message("Sorry, could not process your query.");
  }
  }

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

// Optional: send proactive message
app.get("/send", async (req, res) => {
  try {
    const message = await client.messages.create({
      from: "whatsapp:+14155238886",
      to: "whatsapp:+91XXXXXXXXXX",
      body: "Hello from MERN + Twilio!"
    });
    res.send(message.sid);
  } catch (err) {
    res.send(err);
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));




