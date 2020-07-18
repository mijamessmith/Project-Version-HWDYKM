//Requirements
const express = require("express");
const expressLayouts = require('express-ejs-layouts');// ejs view engine
var bodyParser = require('body-parser');
const path = require("path");
const uuid = require('uuid');
var session = require('express-session'); //must be above app
const util = require('util');
const app = express(); //last thing calledS

//template engine set
app.set("view engine", "ejs");
app.use(expressLayouts);

//grabbing data from the body of requests using bodyParser

app.use(bodyParser.json()); //ensure that the body data is in json
app.use(bodyParser.urlencoded({ extended: false }));

//setting up session
app.use(session({
    genid: (req) => { //generate id
        console.log('Inside session middleware genid function')
        console.log('Request object sessionID from client: ' + req.sessionID);
        var new_sid = uuid.v4(); //method of uuid version 4
        console.log('New session id generated: ' + new_sid);
        return new_sid; // use UUIDs for session IDs
    },
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))

//a test route for sessions
app.get('/try', function (req, res, next) {
    if (req.session.views) {
        req.session.views++ //incrementing view
        res.setHeader('Content-Type', 'text/html')
        res.write('<p>views: ' + req.session.views + '</p>')
        res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
        res.end()
    } else {
        req.session.views = 1
        res.end('welcome to the session demo. refresh!')
    }
})

app.get('/tryagain', (req, res, next) => {
    //in here, try and save some data
    res.send(`${ req.session.views }`)
})

//setting up rendering of all pages
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/views/pages"));
app.use(express.static(__dirname + "/views/css"));
app.use(express.static(__dirname + "/views/images"));
app.use(express.static(__dirname + "/views/partials"));
app.use(express.static(__dirname + "/views/pages/scripts"));


//import routes
const loginRoute = require("./js/routes/login");
const homeRoute = require("./js/routes/home");
const aboutRoute = require("./js/routes/about");
const welcomeRoute = require("./js/routes/welcome")
const pregame = require("./js/routes/pregame")
const playGame = require("./js/routes/playGame")
const postgame = require("./js/routes/postgame")
const landing = require("./js/routes/landing");
const logout = require("./js/routes/logout");
const summary = require("./js/routes/summary");


//
app.use("/", loginRoute);
app.use("/", homeRoute);
app.use("/", aboutRoute);
app.use("/", welcomeRoute);
app.use("/", pregame);
app.use("/", playGame);
app.use("/", postgame);
app.use("/", landing);
app.use("/", logout);
app.use("/", summary);

//server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));