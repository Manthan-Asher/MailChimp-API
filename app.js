const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
require("dotenv").config();

const app = express();
app.use(express.static("static"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  var jsonData = JSON.stringify(data);

  var options = {
    url: "https://us8.api.mailchimp.com/3.0/lists/c19f8e1fdd",
    method: "POST",
    headers: {
      Authorization: process.env.AUTHORIZATION,
    },
    // body:jsonData
  };

  request(options, function (error, response, body) {
    //since request is deprecated you can use http.request() method
    //see the documentation of express
    if (error) {
      res.sendFile(__dirname + "/failure.html");
    } else if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  });
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
