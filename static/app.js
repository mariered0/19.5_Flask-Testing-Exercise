class BoggleGame {
    constructor(time) {
        this.timeleft = time;
        this.score = 0;
        this.words = []
    }

    //Display remaining time
    displayTime() {
        let time = this.timeleft;
        const timer = setInterval(() => {
            if (time <= 0) {
                clearInterval(timer);
                $('#message').text("Time's Up!");
                $('#form-container').hide();

                this.timeUp();

            }
            $('#time').text(time);
            time--
        }, 1000);

        timer;
    }

    //When time is up hide the submit button, display the Play Again button, and send data to the server side.
    timeUp() {
        $('#msg').text("Time's Up!");
        $('#form-container').hide();
        $('#game-container').append($('<button id="play-again-btn">Play Again</button>'));

        $('#game-container').on('click', $('#play-again-btn'), async () => {
            await axios.post('/get-stats', {score: this.score});
            location.reload();
        });
    }

    //Displaying different messages depending on the result.
    displayResult(word, result) {
        let msg;
        if (result == 'not-on-board') {
            msg = "This word is not on the board."
        } else if (result == 'not-word') {
            msg = "This word doesn't exist."
        } else if (result == 'ok' && this.words.indexOf(`${word}`) !== -1) {
            msg = "You have submitted this word already."
        } else if (result == 'ok' && this.words.indexOf(`${word}`) === -1) {
            this.words.push(`${word}`);
            msg = "Great!"
        }
        return $('#msg').text(msg), $('#score').text(this.score);
    }

    //Handle score and display the current score.
    handleScore(word) {
        console.log('word length', word.length)
        if (word.length >= 8) {
            this.score += 11;
        } else if (word.length >= 7) {
            this.score += 5;
        } else if (word.length >= 6) {
            this.score += 3;
        } else if (word.length >= 5) {
            this.score += 2;
        } else if (word.length >= 3) {
            console.log('3letters')
            console.log('score before adding', this.score);
            this.score += 1;
        }
    }

    //Sending the input data to the server
    async sendInputData() {
        const word = $('input').val();
        let res;
        if (word) {
            res = await axios.get('/check-word', {params: {word: word}})
        }else{
            return $('#msg').text('Please enter a word!')
        };

        //recieving result from check-word
        console.log('from sendInputData()', res.data)
        const result = res.data.result

        if (result == 'ok' && this.words.indexOf(`${word}`) === -1) {
            this.handleScore(word)
        }
        this.displayResult(word, result);
    }
}

const boggle = new BoggleGame(60);

boggle.displayTime();

document.querySelector('form').addEventListener('submit', async function (e) {
    e.preventDefault()
    console.log('clicked')
    //empty the input field after sending data
    await boggle.sendInputData();
    $('input').val('');
})