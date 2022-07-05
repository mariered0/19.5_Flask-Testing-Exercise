const form = document.querySelector('form')
const $msgContainer = $('#msg-container')
let score = 0;
let gamePlayed;
let bestScore;
let timeleft = 60;

//Creating HTML boggle board
function makeHtmlBoard() {
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
}

//Putting each character in squares
function putCharInBoard() {
    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
            const sq = document.getElementById(`${y}-${x}`)
            sq.innerText = board[y][x]
        }
    }
}


//Displaying different messages depending on the result.
function displayResult(result) {
    //if there's message displayed already, erase it.
    if ($('#message')) {
        $('#message').text('');
    }
    if (result == 'not-on-board') {
        msg = "This word is not on the board."
    } else if (result == 'not-word') {
        msg = "This word doesn't exist."
    } else if (result == 'ok') {
        msg = "Great!"
    }
    $msgContainer.append($(`<p id="message"></p>`))
    return $('#message').text(`${msg}`)
}

function handleScore(word) {
    console.log('word length', word.length)
    if (word.length >= 8) {
        score += 11;
    } else if (word.length >= 7) {
        score += 5;
    } else if (word.length >= 6) {
        score += 3;
    } else if (word.length >= 5) {
        score += 2;
    } else if (word.length >= 3) {
        console.log('3letters')
        console.log(score);
        score += 1;
    }
    console.log(score);
    if (score > bestScore){
        bestScore = score;
        console.log('updated bestScore!', bestScore)
    }

    if (document.querySelector('#score')) {
        $('#score').text(`Your Current Score: ${score}`);
    } else {
        $('#score-container').append($(`<p id="score">Your Current Score: ${score}</p>`));
    }
}


async function handleStats(){
    if (document.querySelector('#best-score')){
        $('#best-score').text(`Your Best Score: ${bestScore}`);
    } else {
        console.log('hit', bestScore)
        $('#score-container').append($(`<p id="best-score">Your Best Score: ${bestScore}</p>`));
    
    }

    if (document.querySelector('#game-played')){
        $('#game-played').text(`Game Played: ${gamePlayed}`);
    } else {
        console.log('hit', gamePlayed)
        $('#score-container').append($(`<p id="game_played">Game Played: ${gamePlayed}</p>`));
    }
}

async function getData() {
    customConfig = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    data = {
        score: score,
        game_played: gamePlayed,
        best_score: bestScore
    }
    //first, get/send data to the server side
    const res = await axios.post('/stats', data, customConfig);
    console.log('data sent from getData()', res.data)
    gamePlayed = res.data['gamePlayed']
    bestScore = res.data['bestScore']

    //this function is here in order to retrieve gamePlayed and bestScore first to display.
    handleStats();
}





//Sending the input data to the server
async function sendInputData() {
    //couldn't use "resquest.get.data," so changed it to json
    const $inputData = $('input')
    const customConfig = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const inputData = {
        word: $inputData.val(),
    }
    const res = await axios.post('/check-word', inputData, customConfig);

    //recieving result from check-word
    console.log('from sendInputData()',res.data)
    const result = res.data.result
    // gamePlayed = res.data.gamePlayed
    // console.log(gamePlayed);
    displayResult(result)
    if (result == 'ok') {
        handleScore($inputData.val())
    }
    
    
}

function displayTime() {
    $msgContainer.append($('<p>Remaining time: <span id="time"></span> seconds</p>'));
    timer
}

const timer = setInterval(function () {
    if (timeleft <= 0) {
        clearInterval(timer);
        $('#message').text("Time's Up!");
        $('#form-container').hide();
        timeUp();
    }
    $('#time').text(`${timeleft}`);
    timeleft--;
}, 1000);

//When time is up hide the submit button, display the Play Again button, and send data to the server side.
function timeUp() {
    $('#message').text("Time's Up!");
    $('#form-container').hide();
    $('#game-container').append($('<button id="play-again-btn">Play Again</button>'));
    // gamePlayed += 1;
    console.log('gamePlayed right before sending', gamePlayed);
    $('#game-container').on('click', $('#play-again-btn'),function(){
        console.log('clicked!')
        sendStats();
        location.reload()
    });
}

// Send stats to the server at the end of the game
async function sendStats(){
    const customConfig = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const data = {
        best_score: bestScore
    }
    // const json = JSON.stringify(data);
    const res = await axios.post('/get-stats', data, customConfig);
    console.log('data from sendStats()', res.data)
    console.log('bestScore from sendStats', res);
}


makeHtmlBoard();
putCharInBoard();
getData();
// sendStats();
displayTime();
console.log(board);

form.addEventListener('submit', async function (e) {
    e.preventDefault()
        //empty the input field after sending data
        await sendInputData();
        $inputData.val('');
})