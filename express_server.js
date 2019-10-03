const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

let cookieParser = require('cookie-parser')
const PORT = 8080;
app.use(cookieParser())

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

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

function checkEmail(email) {
  for(let item in users){

    if (email === users[item].email) {
      return users[item];
    } 
  } return false
};

app.get("/", (req, res) => { //prints the initial message Hello when opening the browser
  res.send("Hello!");
});

app.listen(PORT, () => { //when turning on the server to recieve requests. the console will print out message
});

app.get("/urls.json", (req, res) => { //prints the urlDatabase in the browser
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n"); //should see Hello World w/ world in BOLD
});

app.get("/urls", (req, res) => { //passing the URL data to our template
  let userID = req.cookies["user_id"];
  let user = users[userID];
  let templateVars = {
    urls: [],
    user: user,
    user_id: userID
  };
  res.render('urls_index', templateVars)
})

app.get("/urls/new", (req, res) => { //saving cookies for adding new URL
  let userID = req.cookies["user_id"];
  let user = users[userID];
  let templateVars = {
    urls: [],
    user: user
  };
  res.render("urls_new", templateVars)
})

app.get("/urls/:shortURL", (req, res) => {
  let userID = req.cookies["user_id"];
  let user = users[userID];
  let templateVars = {
    shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: user };
    res.render("urls_show", templateVars)
})

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString(6);
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
})

app.get("/register", (req, res) => {
  let userID = req.cookies["user_id"];
  let user = users[userID];
  let templateVars = {
    urls: [],
    user: user
  };
  res.render("register", templateVars)
})

app.post("/register", (req, res) => { //object for all the registration
  if (req.body.email === '' || req.body.password === '') {
    res.status(404).send("Invalid Email address or Password entry")
  } else if (checkEmail(req.body.email)) {
    res.status(404).send("Email already exists")
  } else {
    let userRandomID = generateRandomString(6);
    users[userRandomID] = {
      id: userRandomID,
      email: req.body.email,
      password: req.body.password
    };

    res.cookie('user_id', userRandomID).redirect("/urls/")
  };
});

app.get("/login-user", (req, res) => {
  let userID = req.cookies["user_id"];
  let user = users[userID];
  let templateVars = {
    urls: [],
    user: user
  };
  res.render("login-user", templateVars)
})

//POST for log-in to to check if the user is already registered
app.post("/login-user", (req, res) => {
  let currentUser = checkEmail(req.body.email);
  if (currentUser && (currentUser.password === req.body.password)) {
    res.cookie("user_id", currentUser.id).redirect("/urls/")
  } else {
    res.status(404).send("Nope!");
  }
})

app.get("/logout", (req, res) => {
  res.clearCookie("user_id").redirect("/urls/")
})

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls/")
})

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL
  res.redirect("/urls/" + req.params.shortURL)
})

app.post("/logout", (req, res) => {
  res.clearCookie("user_id").redirect("/urls/")
})

// app.post("/login", (req, res) => {
//   let userID = req.cookies["user_id"];
//   let user = users[userID];
//   let templateVars = {
//     urls: [],
//     user: user
//   };
//   res.cookie("user_id", templateVars).redirect("/urls")
// })


