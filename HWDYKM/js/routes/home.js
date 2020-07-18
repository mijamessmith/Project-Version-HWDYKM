const express = require("express");
const router = express.Router();
const db = require("../controller/db");
//const users = //where can we get this in the db
//how do we check the id against a request


router.get("/home", (req, res, next) => {
    res.render("pages/home", { title: "home" });
});


router.get("/home/:id", (req, res) => {
    //find if id exists
    const found = users.some(user => user.id === parseInt(req.params.id));
    if (!found) {
        res.status(400).json({ msg: `id ${req.params.id} not found` });
    }

    //ideally we'd like to grab the fullName from the db and send a hello message to the page
    res.json(users.filter(member => member.id === parseInt)(req.params.id));
})

router.get("/getPerson", (req, res) => {
    console.log(req.query.email); //what's this
    return db.pool.query(`SELECT userId FROM user_data WHERE email = "${req.query.email}"`, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
           var targetPerson = result[0].userId;
            req.session.targetPerson = targetPerson;
            res.render("pages/playGame", { message: "Starting Game" });
            res.end();
        } else
            res.render("pages/home", { message: "Not a registered email" })
    })
})



router.get("/googleSearch", (req, res, next) => {
    var valueToSearchFor = req.query.valueToSearchFor; //grabs the data in the paran stored
    if (valueToSearchFor === "google") {
        res.send("http://google.com")
    } else res.send("http://apple.com")
})

router.post("/googleSearch", (req, res, next) => {
    var valueToSearchFor = req.query.valueToSearchFor; //grabs the data in the paran stored
    return db.pool.query(`INSERT INTO search_history (search_value) VALUES ("${valueToSearchFor}")`, function (err, result) {
        if (err) throw err;
        else res.send(JSON.stringify(result));
    });
})



module.exports = router;