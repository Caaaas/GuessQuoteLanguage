const express = require('express');
const axios = require('axios');
const router = express.Router();
const QuoteModel = require.main.require('./models/quoteModel').QuoteModel;

const azuerAxios = axios.create({
    headers: {
        'Ocp-Apim-Subscription-Key': process.env.API_KEY
    }
})

let languages = [];

let getLanguages = async function () {
    return new Promise(async (resolve, reject) => {
        await azuerAxios.get('https://api.cognitive.microsofttranslator.com/languages?api-version=3.0&scope=translation')
            .then(function (response) {
                for (key in response.data.translation) {
                    var value = response.data.translation[key];
                    value.language = key;
                    value.correct = null; // Used in vue
                    value.incorrect = null; // Used in vue
                    languages.push(value);
                }
                return resolve(response.data);
            })
            .catch(function (error) {
                return resolve(error);
            });
    });
}
getLanguages();

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
        translatedText: await translatedText[0].text,
    });
});

let translate = async function (from, to, text) {
    var postData = [{
        'Text': text
    }]
    return new Promise(async (resolve, reject) => {
        await azuerAxios.post('https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=' + from + '&to=' + to,
                postData
            )
            .then(function (response) {
                return resolve(response.data[0].translations);
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