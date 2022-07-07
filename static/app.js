class BoggleGame {
    constructor(time) {
        this.timeleft = time;
        this.score = 0;
        this.gamePlayed;
        this.bestScore;
        this.config = { headers: { 'Content-Type': 'application/json' }};
        this.words = []
    }

    //Creating HTML boggle board
    makeHtmlBoard() {
        //diplaying game container
        $('#game-container').show();
        //creating squares for board
        for (let y = 0; y < 5; y++) {
            const tr = document.createElement('tr');
            const htmlBoard = document.querySelector('#board')
            htmlBoard.append(tr)

            for (let x = 0; x < 5; x++) {
                const td = document.createElement('td');
                td.setAttribute('id', `${y}-${x}`);
                tr.append(td);
            }
        }
        this.putCharInBoard();
    }

    //Putting each character in squares
    putCharInBoard() {
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                const sq = document.getElementById(`${y}-${x}`)
                sq.innerText = board[y][x]
            }
        }
        this.getData();
    }

    //Display stats
    async handleStats() {
        if (document.querySelector('#best-score')) {
            $('#best-score').text(`Your Best Score: ${this.bestScore}`);
        } else {
            $('#score-container').append($(`<p id="best-score">Your Best Score: ${this.bestScore}</p>`));
        }

        if (document.querySelector('#game-played')) {
            $('#game-played').text(`Game Played: ${this.gamePlayed}`);
        } else {
            $('#score-container').append($(`<p id="game_played">Game Played: ${this.gamePlayed}</p>`));
        }
        this.displayTime();
    }

    //Retrieving data from the server side
    async getData() {
        const data = {
            score: this.score,
            best_score: this.bestScore
        }
        //first, get/send data to the server side
        const res = await axios.post('/stats', data, this.config);
        console.log('1st data sent from getData()', res.data)
        this.gamePlayed = res.data['game_played']
        this.bestScore = res.data['best_score']

        //this function is here in order to retrieve gamePlayed and bestScore first to display.
        this.handleStats();
    }

    //Displaying different messages depending on the result.
    displayResult(word, result) {
        //if there's message displayed already, erase it.
        let msg;
        if ($('#message')) {
            $('#message').text('');
        }
        if (result == 'not-on-board') {
            msg = "This word is not on the board."
        } else if (result == 'not-word') {
            msg = "This word doesn't exist."
        } else if (result == 'ok' && this.words.indexOf(`${word}`) !== -1) {
            msg = "You have submitted this word already."
        } else if (result == 'ok' && this.words.indexOf(`${word}`) === -1 ){
            this.words.push(`${word}`);
            msg = "Great!"
        }
        $('#msg-container').append($(`<p id="message"></p>`))
        return $('#message').text(`${msg}`)
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
            console.log(this.score);
            this.score += 1;
        }
        console.log(this.score);
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            console.log('updated bestScore!', this.bestScore)
        }

        if (document.querySelector('#score')) {
            $('#score').text(`Your Current Score: ${this.score}`);
        } else {
            $('#score-container').append($(`<p id="score">Your Current Score: ${this.score}</p>`));
        }
    }

    //Sending the input data to the server
    async sendInputData() {
        //couldn't use "resquest.get.data," so changed it to json
        const word = $('input').val();
        const inputData = {
            word: word
        }
        const res = await axios.post('/check-word', inputData, this.config);

        //recieving result from check-word
        console.log('from sendInputData()', res.data)
        const result = res.data.result
        // this.gamePlayed = res.data.gamePlayed
        // console.log('gamePlayed from sendInputData', this.gamePlayed);
        
        if (result == 'ok' && this.words.indexOf(`${word}`) === -1) {
            console.log('handleScore')
            this.handleScore(word)
        }
        this.displayResult(word, result);
    }


    //Display remaining time
    displayTime() {
        $('#msg-container').append($('<p>Remaining time: <span id="time"></span> seconds</p>'));
        console.log('timeleft', this.timeleft);
        //this.timeleft cannot be accessed from timer variable, so we set it to time here.
        let time = this.timeleft;


        const timer = setInterval(() => {
            if (time <= 0) {
                clearInterval(timer);
                $('#message').text("Time's Up!");
                $('#form-container').hide();

                this.timeUp();

            }
            $('#time').text(`${time}`);
            time--
        }, 1000);

        timer;
    }

    //When time is up hide the submit button, display the Play Again button, and send data to the server side.
    timeUp() {
        $('#message').text("Time's Up!");
        $('#form-container').hide();
        $('#game-container').append($('<button id="play-again-btn">Play Again</button>'));
        // this.gamePlayed += 1;
        // console.log('gamePlayed', this.gamePlayed)

        $('#game-container').on('click', $('#play-again-btn'), () => {
            this.gamePlayed += 1;
            console.log('was it updated?', this.gamePlayed)
            this.sendStats();
            location.reload()
        });
    }

    // Send stats to the server at the end of the game
    async sendStats() {
        const data = {
            best_score: this.bestScore,
            game_played: this.gamePlayed
        }
        console.log('data in sendStats', data)
        const res = await axios.post('/get-stats', data, this.config);
        // console.log('data from sendStats()', res.data)
        // console.log('res from sendStats', res);
    }

}

const boggle = new BoggleGame(60);
boggle.makeHtmlBoard();

// makeHtmlBoard();
// putCharInBoard();
// getData();
// displayTime();
console.log(board);

document.querySelector('form').addEventListener('submit', async function (e) {
    e.preventDefault()
    //empty the input field after sending data
    await boggle.sendInputData();
    $('input').val('');
})