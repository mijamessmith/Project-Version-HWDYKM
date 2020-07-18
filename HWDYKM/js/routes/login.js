const express = require("express");
const router = express.Router();
const db = require("../controller/db")

var currentUser = {};

router.get("/login", (req, res, next) => {
    var message = req.message;
    res.render("pages/login", { title: "login" });
});


router.post("/logUserIn", async (req, res, next) => {
    var message;
    console.log(`Sent in a post using email: ${req.body.email} and password: ${req.body.password}.`)
    try {
            if (!req.body.email || !req.body.password) { // I want this to change the h5 in on the page to read the message
                message = "Please enter an email and password";
                console.log(`Missing email and/or password`)
                res.render("pages/login", {message: message}) //should we be returing?
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

router.post("/register", (req, res, next) => {
    console.log(`at least this works in /register`)
    //first check that the email doesn't exist by selecting it from the db
    db.pool.query(`SELECT email FROM user_data WHERE email = "${req.body.email}"`, (error, result) => {
        console.log(`Here are the results ${result}`);
        if (error) {
            console.log(error)
        } if (result.length > 0) {
            console.log("that email isn't unique")
             return res.render("pages/login", { message: `${req.body.email} has already been registered` });
        }  else if (req.body.password !== req.body.confirmPassword) {
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
                    res.render("pages/welcome", {message: "registered"});
                })           
        })
    })
})

module.exports = router;




//examples
/*
router.post("/googleSearch", (req, res, next) => {
    var valueToSearchFor = req.query.valueToSearchFor; //grabs the data in the paran stored
    return db.pool.query(`INSERT INTO search_history (search_value) VALUES ("${valueToSearchFor}")`, function (err, result) {
        if (err) throw err;
        else res.send(JSON.stringify(result));
    });
})

router.post("/submit", (req, res, next) => {
    console.log(req.body);
    res.render("index", {
        title: "Data Saved",
        message: "Data Saved Successfully"
    })
})
*/