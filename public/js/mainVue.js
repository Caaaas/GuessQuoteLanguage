var app = new Vue({
    el: '#mainAppWrapper',
    data: {
        languages: null,
        newLanguage: null,
        translatedText: null,
        quote: null,
        correctStreak: 0,
        correctTotal: 0,
        totalGuesses: 0,
        guessThisRound: false,
        gettingNewData: false
    },
    async created() {
        this.getNewTranslation();
    },
    methods: {
        getNewTranslation: function () {
            if (!this.gettingNewData) {
                this.gettingNewData = true;
                axios.get('api/translate').then((res) => {
                    this.languages = res.data.languages;
                    this.newLanguage = res.data.newLanguage;
                    this.translatedText = res.data.translatedText;
                    this.quote = res.data.quote;
                    this.guessThisRound = false;
                }).finally(() => {
                    this.gettingNewData = false;
                });
            }
        },
        guess: function (guess, language) {
            if (!this.guessThisRound) {
                this.guessThisRound = true;
                if (guess === this.newLanguage.language) {
                    this.correctStreak++;
                    this.correctTotal++;

                    language.correct = true;
                } else {
                    this.correctStreak = 0;

                    language.incorrect = true;
                }

                this.totalGuesses++;
            }
        }
    }
})