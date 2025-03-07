const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const https = require("https");
const path = require("path");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});
// app.post("/", function (req, res) {
//   const fName = req.body.firstName;
//   const lName = req.body.lastName;
//   const email = req.body.email;
//   const client = require("@mailchimp/mailchimp_marketing");

//   client.setConfig({
//     apiKey: "4c34cf1fcb0786d1dfbc7fb216640abc-us16",
//     server: "us16",
//   });

//   const run = async () => {
//     const response = await client.lists.batchListMembers("1eb70b975c", {
//       members: [
//         {
//           email_address: email,
//           status: "subscribed",
//           merge_fields: {
//             FNAME: fName,
//             LNAME: lName,
//           },
//         },
//       ],
//     });
//     console.log(response);
//   };

//   run();
// });

// API key
// 4c34cf1fcb0786d1dfbc7fb216640abc-us16

// List ID
// 1eb70b975c

app.post("/", function (req, res) {
  const fName = req.body.firstName;
  const lName = req.body.lastName;
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us16.api.mailchimp.com/3.0/lists/1eb70b975c";
  const options = {
    method: "POST",
    auth: "suraj:14c34cf1fcb0786d1dfbc7fb216640abc-us16",
  };
  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is up and running at port: 3000!");
});
