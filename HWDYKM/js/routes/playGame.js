const express = require("express");
const router = express.Router();
const db = require("../controller/db")

router.get("/playGame", (req, res, next) => {
    req.session.targetPerson = 3//delete me later
    res.render("pages/playGame", { message: "Got the answers" })



    //if (!req.session.targetPerson) {
    //    console.log("Need a target Player");
    //    req.session.targetPerson = 1; //for testing purposes
    //    res.render("pages/playGame", { message: "No target user" });
    //} else
    //db.pool.query(`SELECT * FROM questionaire WHERE userId = ${req.session.targetPerson}`, (err, result) => {
    //    if (err) {
    //        throw err;
    //    } req.session.targetAnswers = result[0]; //includes property userId = whatever
    //    console.log(result[0]);
    //    res.render("pages/playGame", {message: "Got the answers"})
    //    //this route will conflict with questionaire's which is loaded of a document.ready
    //})
})

/* WHY IS THIS ROUTE HERE? I SEE IT IN PREGAME.JS
router.post("/questionaire", (req, res, next) => {
    
    return db.pool.query(`INSERT INTO quiz_data (firstName, lastName, email, password) 
    VALUES ("${req.body.firstName}", "${req.body.lastName}", "${req.body.email}", "${req.body.password}")`, (err, result) => {
        if (err) throw err;
        else res.render("pages/postgame");
    });
});
*/

router.get("/getFirstQuestionOptions", (req, res, next) => {
    //testing modified
    if (!req.session.targetPerson) {
        req.session.targetPerson = 2
    }
    //modified from creating an object to send to passing data into req.session.quiz
    return db.pool.query(`SELECT * FROM incorrect_answers WHERE questionNum = 1`, (err, result) => {
        if (err) {
            throw err;
        } else req.session.quiz = {};
          req.session.quiz.questionNum = 0; //setting up to pass along, notice it will be incremented after
            req.session.quiz.incorrectAnswers = result //should this be changed to req.session.incorrectAnswers?
        return db.pool.query(`SELECT * FROM questionaire WHERE userId = ${req.session.targetPerson}`, (err, result) => {
            if (err) {
                throw err;
            } else req.session.quiz.correctAnswer = result;
            req.session.quiz.questionNum++; //incriment the question hmm not here
            console.log(req.session.quiz) //why is this logging undefined in bash but has values in chrome?
            res.send(req.session.quiz)
        })
    });
});

//get questions after the first question
router.get("/nextQuestion", (req, res, next) => {
    req.session.quiz.questionNum++; //do before we get next current question
    console.log(req.session.quiz.questionNum) //check current question

    //check if questionNum is less than 11
    if (req.session.quiz.questionNum > 10) {
        //find a way to store score in session

        //go to the summary page
        res.redirect("/summary")
    } else 

    //modified from creating an object to send to passing data into req.session.quiz
    return db.pool.query(`SELECT * FROM incorrect_answers WHERE questionNum = ${req.session.quiz.questionNum}`, (err, result) => {
        if (err) {
            throw err;
        }
        req.session.quiz.incorrectAnswers = result //should this be changed to req.session.incorrectAnswers
        console.log(req.session.quiz) //why is this logging undefined in bash but has values in chrome?
        res.send(req.session.quiz);
    });
});



module.exports = router;
