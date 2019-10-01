const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const PORT = 8080;

app.set("view engine", "ejs"); //this tells express app to use EJS as it's templating engine

function generateRandomString(length) {
  var result = '';
  var character = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var stringLength = character.length;
  for (let i = 0; i < length; i++) {
    result += character.charAt(Math.floor(Math.random() * stringLength));
  }
  return result;
}


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

app.get("/urls/new", (req, res) => {
  res.render("urls_new")
})

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
    res.render("urls_show", templateVars)
})

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString(6);
  urlDatabase[shortURL] = req.body.longURL;
  console.log('result', urlDatabase)
  res.redirect(`/urls/${shortURL}`);
});

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  // console.log(longURL);
  res.redirect(longURL);
})

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls/")
})