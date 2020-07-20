const express = require("express");
const router = express.Router();
const db = require("../controller/db")

router.get("/logout", (req, res, next) => {

    req.session.destroy(); //Kill Session
    console.log(req.session)
    res.render("pages/logout", { title: "logout" });
});

module.exports = router;