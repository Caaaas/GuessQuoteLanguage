const mongoose = require('mongoose');
const url = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@cluster0-t1i4j.mongodb.net/" + process.env.DB_NAME;

let db;
exports.connect = function (callback) {
    mongoose.connect(url, {
        poolSize: 4,
        useNewUrlParser: true,
        auto_reconnect: true,
        keepAlive: 1
    }, function (err) {
        if (err) {
            console.log("Could not connect to DB. Not calling back. Not starting server.");
            console.log(err);
        } else {
            callback();
        }
    });
}