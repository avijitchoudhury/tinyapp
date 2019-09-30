const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs"); //this tells express app to use EJS as it's templating engine

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

app.get("/urls", (req, res) => { //passing the URL data to our template
  let templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars)
})

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL, longURL: "http://www.lighthouselabs.ca" };
    res.render("urls_show", templateVars)
})

// app.get("/set", (req, res) => {
//   const a = 1;
//   res.send(`a = ${a}`);
// });

// app.get("/fetch", (req, res) => {
//   res.send(`a = ${a}`);
// });