const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const nodemailer = require("nodemailer");
const fetch = require("isomorphic-fetch");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

async function mailWrapper(name, email, message) {
  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `${name} <${email}>`,
    to: process.env.TARGET_MAIL,
    subject: "Message from endreujvari.com!",
    text: `${message} \n\nReply to: ${email}`
  });
}

// Home
app.get("/", function(req, res) {
  res.render("home");
});

app.post("/", function(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;
  // Checking if the sender is a bot with google reCAPTCHA v3
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${req.body.output}`;
  fetch(url, {
    method: "post"
  }).then((response) => response.json()).then((google_response) => {
    if(google_response.success) {
      if (google_response.score >= 0.5) {
        mailWrapper(name, email, message).catch(console.error);
        console.log("email has been sent");
      } else {
        console.log("Warning, you have been banned for suspicious behavior, please try again later.");
      }
    } else {
      console.log("Error with Google reCAPTCHA response");
    }
  }).catch((error) => {
    return res.json({
      error
    });
  });
  res.redirect("message_sent");
});

// About

app.get("/about", function(req, res) {
  res.render("about");
});

// Portfolio

app.get("/portfolio", function(req, res) {
  res.render("portfolio");
});

// Contact

app.get("/contact", function(req, res) {
  res.render("contact");
});

// Message sent

app.get("/message_sent", function(req, res) {
  res.render("message_sent");
});

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
  console.log(`portfolio: listening on port ${port}`);
});
