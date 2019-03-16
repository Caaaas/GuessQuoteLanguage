const dotenv = require('dotenv');
const dotenvParseVariables = require('dotenv-parse-variables');
const env = dotenv.config({});
if (env.error)
    throw env.error;
process.env = dotenvParseVariables(env.parsed);

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

let mongoDB = require.main.require('./utils/database');

// Middlewares
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')))

const translate = require('./routes/api/translate');
app.use('/api/translate', translate);

app.get("/", function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

// Initialize connection
mongoDB.connect(function () {
    // Start the application after the database connection is ready
    const port = process.env.PORT_SERVER || 5000;

    app.listen(port, function () {
        console.log("SERVER started on port " + port);
    });
});