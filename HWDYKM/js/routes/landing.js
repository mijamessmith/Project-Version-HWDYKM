const express = require("express");
const router = express.Router();
const db = require("../controller/db");

router.get("/", (req, res, next) => {
    res.render("pages/landing", { title: "landing" });
});


router.get("/getUserData", (req, res, next) => {   
    return db.pool.query(`SELECT * FROM user_data`, (err, result) => {
        if (err) throw err;
        else console.log(result);
    });
});






module.exports = router;