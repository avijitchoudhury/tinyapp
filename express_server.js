const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const { getUserByEmail } = require("./helpers");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: "avi",
  keys: ['avi']
}));

const PORT = 8080;


app.set("view engine", "ejs"); //this tells express app to use EJS as it's templating engine

const generateRandomString = function(length) {
  let result = '';
  let character = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let stringLength = character.length;
  for (let i = 0; i < length; i++) {
    result += character.charAt(Math.floor(Math.random() * stringLength));
  }
  return result;
};


const urlDatabase = {};

const users = {};


const urlForUsers = function(id) { //helper function for the specific users URL
  let shortURLs = Object.keys(urlDatabase);
  let specificURL = {};
  for (let shortURL of shortURLs) {
    if (urlDatabase[shortURL].userID === id) {
      specificURL[shortURL] = urlDatabase[shortURL];
    }
  } return specificURL;
};
app.listen(PORT, () => { //when turning on the server to recieve requests. the console will print out message
  console.log(`App listening on port ${PORT}`);
});

app.get("/urls.json", (req, res) => { //prints the urlDatabase in the browser
  res.json(urlDatabase);
});


app.get("/", (req, res) => { //prints the initial message Hello when opening the browser
  if (!users[req.session.user_id]) {
    res.redirect("login-user");
  } else {
    res.redirect("/urls");
  }
});

app.post("/urls", (req, res) => { //routing towards the tiny urls page where it creates new URL
  let shortURL = generateRandomString(6);
  let userID = req.session.user_id;
  urlDatabase[shortURL] = {longURL: req.body.longURL, userID};
  console.log("urldatabase: ", urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});

app.get("/urls", (req, res) => { //passing the URL data to our template
  // let user = users[req.cookies.user_id]
  let templateVars = {
    urls: urlForUsers(req.session.user_id),
    user: users[req.session.user_id]
  };
  console.log("templvars: ",templateVars);
  if (!templateVars.user) {
    res.render('login-user', templateVars);
  } else {
    res.render('urls_index', templateVars);
  }
});


app.get("/urls/new", (req, res) => { //saving cookies for adding new URL
  // let user = users[req.cookies.user_id]
  let templateVars = {
    user: users[req.session.user_id]
  };
  if (!templateVars.user) {
    res.redirect("login-user");
  } else {
    res.render('urls_new', templateVars);
  }
});


app.post("/urls/:shortURL", (req, res) => { //allowing us to edit existing URL
  urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  res.redirect("/urls/" + req.params.shortURL);
});

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

app.get("/register", (req, res) => {
  // let user = users[req.cookies.user_id]
  let templateVars = {
    user: users[req.session.user_id]
  };
  res.render("register", templateVars);
});

app.get("/urls/:shortURL", (req, res) => { //displays the shortURL
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.session.user_id] };

  if (templateVars.user) {
    res.render("urls_show", templateVars);
  } else {
    res.render("login-user", templateVars);
  }
});

app.post("/register", (req, res) => { //object for all the registration
  if (req.body.email === '' || req.body.password === '') {
    res.status(404).send("Invalid Email address or Password entry");
  } else if (getUserByEmail(req.body.email, users)) {
    res.status(404).send("Email already exists");
  } else {
    let userRandomID = generateRandomString(6);
    users[userRandomID] = {
      id: userRandomID,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    };
    req.session.user_id = userRandomID;
    res.redirect("/urls/");
  }
});

app.get("/login-user", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  if (templateVars.user) {
    res.redirect("urls");
  } else {
    res.render("login-user", templateVars);
  }
});

//POST for log-in to to check if the user is already registered
app.post("/login-user", (req, res) => {
  let currentUser = getUserByEmail(req.body.email, users);
  if (currentUser && bcrypt.compareSync(req.body.password, currentUser.password)) {
    res.session.user_id = currentUser.id;
    res.redirect("/urls/");
  } else {
    res.status(404).send("Nope!");
  }
});

app.post('/logout', (req, res) => {
  console.log("the user has logged out. Thank you!");
  res.session = null;
  res.redirect('/urls');
});

app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls/");
});




