const readyPlay = document.querySelector("#readyPlay");


readyPlay.addEventListener("click", function (event) {
    event.preventDefault()
    console.log("Home Button has been clicked")
    var searchedEmail = document.querySelector("#emailToSearch").value
    let ajaxReq; //sometimes declaring and initializing has issues
    ajaxReq = $.ajax({
        url: '/getPerson?email=' + searchedEmail, //name of the route. If we want more params we use & to separate. 
        type: 'GET',
        datatype: "json",
        data: "" //we're not sending
    });
    ajaxReq.done(function (data) {
        //change car color in front end with the data
        if (data) {
            console.log(data)
            return;
        }
    });
});

/*
$(readyPlay).click((event) => {
    event.preventDefault();
    alert("I've been clicked")
    var searchedEmail = document.querySelector("#emailToSearch").value
    let ajaxReq; //sometimes declaring and initializing has issues
    ajaxReq = $.ajax({
        url: '/getPerson?email='+searchedEmail, //name of the route. If we want more params we use & to separate. 
        type: 'GET',
        datatype: "json",
        data: "" //we're not sending
    });
})
*/
