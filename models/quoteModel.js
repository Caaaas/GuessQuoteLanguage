const mongoose = require("mongoose");

let schema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    category: {
        type: String,
        trim: true,
    },
    quote: {
        type: String,
        trim: true,
    },
});

let model = mongoose.model("quotes", schema);

let getRandomQuote = async function () {
    return new Promise(async (resolve, reject) => {
        await model.aggregate([{
            "$sample": {
                "size": 1
            }
        }], function(err, quote) {
            if (err)
                return reject(err);
            else
                return resolve(quote[0]);
        });
    })
}

let addQuote = async function (name, category, quote) {
    console.log("quoteModel.addQuote")

    let newQuote = await new model({
        name: name,
        category: category,
        quote: quote,
    });

    return new Promise(async (resolve, reject) => {
        await newQuote.save(function (err, quote) {
            if (err)
                return reject(err);
            else
                return resolve(quote);
        });
    })
}

exports.QuoteModel = {
    getRandomQuote,
    addQuote
};