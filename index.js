const fs = require("fs");
const express = require("express");
const app = express();
const port = 3000;
const session = require("express-session");
const { json } = require("express/lib/response");

app.use(express.urlencoded({ extended: false })); // this is used to parse form data just like we parse the json data in case of form this method is sued to parse form data

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  if (req.session.is_logged_in === true) res.redirect("/user");
  res.sendFile(__dirname + "/public/home/index.html");
});

app.get("/login", (req, res) => {
  if (req.session.is_logged_in === true) {
    res.redirect("/user");
    return;
  }
  res.sendFile(`${__dirname}/public/home/login/index.html`);
});

app.get("/logout", (req, res) => {
  req.session.is_logged_in = false;
  res.redirect("/");
});

app.get("/user", (req, res) => {
  if (req.session.is_logged_in === true) {
    res.sendFile(__dirname + "/public/home/landing/index.html");
    return;
  }
  res.redirect("/");
});

app.get("/signup", (req, res) => {
  if (req.session.is_logged_in === true) res.redirect("/user");
  res.sendFile(__dirname + "/public/home/signup/index.html");
});

app.listen(port, () => {
  console.log(`Port is Listening at ${port}`);
});

// saving the data inside a file
app.post("/login", (req, res) => {
  console.log(req.body);
  //reading file
  fs.readFile("data.txt", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    let filedata = [];
    if (data.length > 0) filedata = JSON.parse(data);

    let element = filedata.filter((el) => {
      if (
        req.body.username === el.username &&
        req.body.password === el.password
      )
        return true;
    });

    if (element.length > 0) {
      req.session.is_logged_in = true;
      res.redirect("/user");
    } else res.send("Either Username or Password ia incorect!");
  });
});

// verifying data from the file
app.post("/signup", (req, res) => {
  //reading data from the file first
  console.log(req.body);
  fs.readFile("data.txt", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    let filedata = [];
    if (data.length > 0) filedata = JSON.parse(data);
    else {
      // writing int the file
      req.session.is_logged_in = true;
      filedata.push(req.body);
      fs.writeFile("data.txt", JSON.stringify(filedata), (err) => {
        res.redirect("/user");
      });
      return;
    }
    let element = filedata.filter((el) => {
      if (req.body.username === el.username) return true;
    });

    if (element.length > 0) {
      res.send("Username Already Taken!");
      return;
    }
    //else
    req.session.is_logged_in = true;
    filedata.push(req.body);
    // writing int the file
    fs.writeFile("data.txt", JSON.stringify(filedata), (err) => {
      res.redirect("/user");
    });
  });
});
