const express = require("express");
const router = express.Router();
const db = require("../controller/db")

router.get("/summary", (req, res, next) => {
    res.render("pages/summary", { title: "summary" });
});

module.exports = router;