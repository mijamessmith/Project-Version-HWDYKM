const express = require("express");
const router = express.Router();
const db = require("../controller/db");

router.get("/postgame", (req, res, next) => {
    res.render("pages/postgame", { title: "postgame" });
});

module.exports = router;