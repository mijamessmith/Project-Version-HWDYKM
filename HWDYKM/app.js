//Requirements
const express = require("express");
const expressLayouts = require('express-ejs-layouts');// ejs view engine
const bodyParser = require('body-parser');
const path = require("path");
const bcrypt = require("bcrypt");
//const json = require('json');
const flash = require("express-flash");
const passport = require("passport");
const uuid = require('uuid');
var session = require('express-session'); //must be above app
const util = require('util');
require('dotenv').config();
const app = express(); //last thing called

//included files
const db = require("./js/controller/db");
const LocalStrategy = require("passport-local").Strategy;

//passport initialzie function

function getUserByEmail(email) {
    return db.pool.query(`SELECT * FROM user_data WHERE email = "${email}"`, (error, result) => {
        if (error) {
            console.log(error)
        } else if (result.length > 0) {
            return result;
        }
    })
}

function getUserByID(id) {
    return db.pool.query(`SELECT * FROM user_data WHERE userId = "${id}"`, (error, result) => {
        if (error) {
            console.log(error);
            return null;
        } else if (result.length > 0) {
            return result;
        } 
    })
}

passport.serializeUser((user, done) => {
    console.log(`I'm in serialize + ${user.email}`)
    done(null, user)
})

passport.deserializeUser((obj, done) => {
    console.log(`I'm in deserialize + ${obj.email}`)
    done(null, obj)
})

passport.use(new LocalStrategy(
    function () {
        console.log('trying this shit')
        console.log(email, password)
        /*
        const user = new Promise(getUserByEmail(email));
        user.then((data) => {
            var user = data[0];
            if (!user) {
                return done(null, false, { message: "no user with that email" });
            }
            return done(null, user);

        })
        */
        var user = {}
        user.email = 'mysad@gmail.com'
        user.password = '12345'
        return user
    }
));

    
/*
function initializePassport(passport, getUserByEmail, getUserById) {
    var authenticateUser = async (email, password, done) => {
        const user = await getUserByEmail(email);
        console.log(user);
        if (user.length == 0) {
            return done(null, false, { message: "no user with that email" });
        }
        /*try {
            if (await bcrypt.compare(password, user.password)) { //think I need to alter this
                return done(null, user);
            } *//*else {
                return done(null, user);
            }
        //} catch (err) {
        //    return done(err);
        //}
    }
    passport.use(new LocalStrategy(authenticateUser)) //setting user name to email overrides default that relies on a username
}
    */



//set up passport
//const initilaizePassport = require("./js/config/passport-config");


//initializePassport(passport, getUserByEmail, getUserByID) 
//still need to finish this

//template engine set
app.set("view engine", "ejs");
app.use(expressLayouts);

//grabbing data from the body of requests using bodyParser and using flash messages

app.use(bodyParser.json()); //ensure that the body data is in json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());

//setting up session with a uuid
app.use(session({
    genid: (req) => { //generate id
        console.log('Inside session middleware genid function')
        console.log('Request object sessionID from client: ' + req.sessionID);
        var new_sid = uuid.v4(); //method of uuid version 4
        console.log('New session id generated: ' + new_sid);
        return new_sid; // use UUIDs for session IDs
    },
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))

//const initilaizePassport = require("./js/config/passport-config");
app.use(passport.initialize());
app.use(passport.session());


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
//const loginRoute = require("./js/routes/login");
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
//app.use("/", loginRoute);
app.use("/", homeRoute);
app.use("/", aboutRoute);
app.use("/", welcomeRoute);
app.use("/", pregame);
app.use("/", playGame);
app.use("/", postgame);
app.use("/", landing);
app.use("/", logout);
app.use("/", summary);

//Login/register routes

//login routes

app.get("/login", (req, res, next) => {
    var message = req.message;
    res.render("pages/login", { title: "login" });
});
app.post("/TestlogUserIn", passport.authenticate('local'), (req, res, next) => {
    res.send(req.user)
})

app.post("/logUserIn", passport.authenticate('local'), (req, res, next) => {
    var message;
    console.log(`Sent in a post using email: ${req.body.email} and password: ${req.body.password}.`)
    try {
        if (!req.body.email || !req.body.password) { // I want this to change the h5 in on the page to read the message
            message = "Please enter an email and password";
            console.log(`Missing email and/or password`)
            res.render("pages/login", { message: message }) //should we be returing?
        } else
            db.pool.query(`SELECT * FROM user_data WHERE email = "${req.body.email}" AND password = "${req.body.password}"`, (error, results) => {
                if (error) {
                    console.log(error);
                } else if (results.length === 0) {
                    message = { message: "The email or password is incorrect" }
                    console.log(message);
                    res.status(401).render("pages/login", message)
                } else if (results.length > 0) {
                    var message = { message: `Logged in under ${req.body.email}` }
                    req.session.currentUser = results;
                    req.session.currentUserId = results[0].userId;
                    console.log(req.session.currentUser, req.session.currentUserId)
                    res.render("pages/home", message);
                }
            })
    } catch (error) {
        console.log(error)
    }
})


//Register Routes

app.post("/register", async (req, res, next) => {

    //const hashedPassword = await bcrypt.hash(req.body.password, 10); 
    console.log(hashedPassword);
    //first check that the email doesn't exist by selecting it from the db
    db.pool.query(`SELECT email FROM user_data WHERE email = "${req.body.email}"`, (error, result) => {
        console.log(`Here are the results ${result}`);
        if (error) {
            console.log(error)
        } if (result.length > 0) {
            console.log("that email isn't unique")
            return res.render("pages/login", { message: `${req.body.email} has already been registered` });
        } else if (req.body.password !== req.body.confirmPassword) {
            return res.render("pages/login", { message: `Passwords do not match` })
        } else return db.pool.query(`INSERT INTO user_data (firstName, lastName, email, password) 
            VALUES ("${req.body.firstName}", "${req.body.lastName}", "${req.body.email}", "${req.body.password}")`, (err, results) => {
            if (err) {
                throw err;
            } else db.pool.query(`SELECT * FROM user_data WHERE email = "${req.body.email}"`, (error, result) => {
                if (error) {
                    console.log(error)
                }
                req.session.currentUser = result[0];
                req.session.currentUserId = result[0].userId
                res.render("pages/welcome", { message: "registered" });
            })
        })
    })
})

//server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));