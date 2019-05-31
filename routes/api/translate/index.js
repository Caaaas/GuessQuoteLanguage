const express = require('express');
const axios = require('axios');
const router = express.Router();
const QuoteModel = require.main.require('./models/quoteModel').QuoteModel;
const LanguagesModel = require.main.require('./models/languagesModel').LanguagesModel;

let languages = [];

LanguagesModel.getLanguages().then((resolve) => {
    languages = resolve;
});

// GET
router.get('/', async (req, res) => {
    let randomLanguages = await getRandomFromArray(languages, 5);
    let translateTo = await getRandomFromArray(randomLanguages, 1);

    let randomQuote = await QuoteModel.getRandomQuote();
    let textToTranslate = randomQuote.quote;

    let translatedText = await translate("en", translateTo[0].language, textToTranslate)
        .catch(function (error) {
            res.status(500).send();
        });

    res.send({
        languages: await randomLanguages,
        newLanguage: await translateTo[0],
        quote: await randomQuote,
        translatedText: await translatedText,
    });
});

let translate = async function (from, to, text) {
    var url = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=" + process.env.API_KEY + "&text=" + text + "&lang=" + from + "-" + to;
    return new Promise(async (resolve, reject) => {
        await axios.get(url)
            .then(function (response) {
                return resolve(response.data.text[0]);
            })
            .catch(function (error) {
                return resolve(error);
            });
    })
}

let getRandomFromArray = function (array, randomAmount) {
    let arrayCopy = [...array];
    var randomItems = [];

    for (var i = 0; i < randomAmount; i++) {
        var random = Math.floor(Math.random() * arrayCopy.length);
        randomItems.push(arrayCopy[random]);
        arrayCopy.splice(random, 1);
    }

    return randomItems;
}

module.exports = router;