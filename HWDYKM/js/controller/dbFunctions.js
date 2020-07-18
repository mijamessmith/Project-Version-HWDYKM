//for now, don't use until we understand mysql promises - we're sending a function result before getting the data

const db = require("./db")

exports.getUser = function () {
    return db.pool.query("SELECT * FROM users", function (error, results, fields) {
        if (error) {
            return error;
        }
        else {
            return JSON.stringify(results);
        }
    })
};