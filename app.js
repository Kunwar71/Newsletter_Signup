require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const client = require("@mailchimp/mailchimp_marketing");

const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;

const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Configure Mailchimp client
client.setConfig({
  apiKey: MAILCHIMP_API_KEY,
  server: MAILCHIMP_SERVER_PREFIX,
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", async function (req, res) {
  const { fName, lName, email } = req.body;

  // Validate required fields
  if (!fName || !lName || !email) {
    console.log("Missing fields");
    return res.sendFile(__dirname + "/failure.html"); // Prevent further execution
  }

  try {
    const response = await client.lists.addListMember(MAILCHIMP_LIST_ID, {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fName,
        LNAME: lName,
      },
    });

    // Log the full response to understand the structure
    console.log("Mailchimp API Response:", response);

    // Check if response has the necessary success criteria
    if (response.status === "subscribed") {
      console.log("Success: Member added successfully!");
      return res.sendFile(__dirname + "/success.html");
    } else {
      console.log("Failure: Member not added, status: " + response.status);
      return res.sendFile(__dirname + "/failure.html");
    }
  } catch (error) {
    console.error("Mailchimp Error:", error.response?.body || error.message);
    return res.sendFile(__dirname + "/failure.html"); // Handle API error
  }
});

app.post("/failure", function (req, res) {
  res.redirect("/"); // Ensure proper redirection after failure
});

app.listen(port, function () {
  console.log(`Server is running on port: ${port}`);
});
