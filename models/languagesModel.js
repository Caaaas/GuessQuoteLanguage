const axios = require('axios');

class Language {
    constructor(language, name) {
        this.language = language;
        this.name = name;
        this.correct = null; // Used in vue
        this.incorrect = null; // Used in vue
    }
}

let getLanguages = async function () {
    const url = "https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=" + process.env.API_KEY + "&ui=en";
    return new Promise(async (resolve, reject) => {
        await axios.get(url)
            .then(function (response) {
                var languages = [];

                for (key in response.data.langs) {
                    let language = new Language(key, response.data.langs[key])

                    languages.push(language);
                }

                return resolve(languages);
            })
            .catch(function (error) {
                return resolve(error);
            });
    });
}

exports.LanguagesModel = {
    getLanguages,
};