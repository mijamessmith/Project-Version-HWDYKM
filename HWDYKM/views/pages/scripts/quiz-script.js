
//grab necessary nodes
const nextQ = document.querySelector("#nextQ");
const reset = document.querySelector("#reset");
const questionNum = document.querySelector("#questionNumber");

//initialize questionNumber
var questionNumber = 1;

var questionOptions; //to be set to db set later

//grab the spans in each div btn
const btn1 = document.querySelector("#quiz-answer-1")
const btn2 = document.querySelector("#quiz-answer-2")
const btn3 = document.querySelector("#quiz-answer-3")
const btn4 = document.querySelector("#quiz-answer-4")

const btns = document.querySelectorAll(".q-option");

//function for creating text content for each question
const displayQuestionOptions = function (data, questionNumber) {
    //get a random num array
    var arr = [];
    while (arr.length < 4) {
        var r = Math.floor(Math.random() * 4);
        if (arr.indexOf(r) === -1) arr.push(r);
    }

    //combine a list of answers from data
    let options = []
    for (let i = 0; i < data.incorrectAnswers.length; i++) {
        options.push(data.incorrectAnswers[i].incorrectAnswer)
    }
    //push on correct answer
    options.push(data.correctAnswer[0][data.questionNum]); 


    for (i = 0; i < btns.length; i++) {
        btns[i].textContent = options[arr[i]]
    }
}


//Once the document is ready, calls jquery function
$(document).ready(() => {

    let ajaxReq; //sometimes declaring and initializing has issues
    ajaxReq = $.ajax({
        url: "/getFirstQuestionOptions", //name of the route
        type: 'GET',
        datatype: "json",
        data: "" //we're not sending
    });

    ajaxReq.done(function (data) {
        //change car color in front end with the data
        if (data) {
            console.log(data)
            displayQuestionOptions(data);
            return;
        }
    });
})

//Next Question Click Event
$(nextQ).click(() => {
    alert("ok it was clicked");
    let ajaxReq; //sometimes declaring and initializing has issues
    ajaxReq = $.ajax({
        url: "/nextQuestion", //name of the route
        type: 'GET',
        datatype: "json",
        data: "" //we're not sending
    });

    ajaxReq.done(function (data) {
        //change car color in front end with the data
        if (data) {
            console.log(data)
            displayQuestionOptions(data);
            return;
        }
    });



});

//event for reset button

reset.addEventListener("click", () => {
    //reset questionNum
    questionNumber = 1;
    //reset quiz questions by calling function displayQuestionOptions

})

//start at 0
const generateRandomNumber = function (num) {
    return Math.floor(Math.random() * num)
}



//when you click a button, it needs to have a click event that compares the answer to text, 
//btn.textContent = 