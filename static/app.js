const htmlBoard = document.querySelector('#board')
const form = document.querySelector('form')
const $inputData = $('input')
const $guess = $inputData.val()

//Creating HTML boggle board
function makeHtmlBoard() {
//creating squares for board
    for (let y = 0; y < 5; y++) {
        const tr = document.createElement('tr');
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
    for (let y = 0; y < 5; y ++) {
        for(let x = 0; x < 5; x++ ){
            const sq = document.getElementById(`${y}-${x}`)
            sq.innerText = board[y][x]
        }
    }
}


//Getting the guess that was submitted
// function getInputData() {
//     const guess = $inputData.val()
//     console.log('input data', guess);
// }

//Sending data to the server
async function sendInputData() {
    const res = await axios.post('/submit',{
        data: $inputData.val()
    })
    .then((res) => {
    console.log('guess', $inputData.val());
    console.log('res', res);
    });
}


console.log(board);
makeHtmlBoard();
putCharInBoard();

form.addEventListener('submit', function(e){
    e.preventDefault();
    sendInputData();
})
