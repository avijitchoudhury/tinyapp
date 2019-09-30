const express = require("express");
const app = express();
const PORT = 8080;

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => { //prints the initial message Hello when opening the browser
  res.send("Hello!");
});

app.listen(PORT, () => { //when turning on the server to recieve requests. the console will print out message
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => { //prints the urlDatabase in the browser
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n"); //should see Hello World w/ world in BOLD
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});