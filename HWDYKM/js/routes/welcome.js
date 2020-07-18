const express = require("express");
const router = express.Router();
const db = require("../controller/db")

// appFunctions = require("../controller/appFunctions");

router.get("/welcome", (req, res, next) => {
    res.render("pages/welcome", { title: "welcome" });
});

router.post("/welcomeData", (req, res, next) => {
    return db.pool.query(`UPDATE user_data SET 
address1 = "${req.body.streetAddress}",
city = "${req.body.city}",
state = "${req.body.state}",
zipcode = "${req.body.zipcode}",
country = "${req.body.country}",
sex = "${req.body.sex}",
birthdate = "${req.body.birthdate}"
WHERE userId = ${req.session.currentUserId}`, (err, result) => {
        if (err) throw err;
        else res.redirect("/home");
    });
});



module.exports = router;