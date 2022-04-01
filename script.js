
let playerOne = 'X';
let playerTwo = 'O';

const cells = document.querySelectorAll('.cell');
const roundCounter = document.getElementById('roundCounter');
const p1score = document.getElementById('X');
const p2score = document.getElementById('O');

let gameBoard;
let player = playerOne;

const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

startGame()
function startGame() {
    cells.forEach(cell => {
        cell.innerText = '';
        cell.style.backgroundColor = "transparent";
        gameBoard = new Array(9);
        cell.addEventListener('click', render, false)
    }) 

}

function render(event) {
    event.target.innerText = player;
    gameBoard[event.target.id] = player;
    checkWin(player)
    switchTurns()
}

function checkWin(player) {
 const moves = gameBoard.reduce((a, e, i) => {
    return (e === player) ? a.concat(i) : a
 }, []);

 winCombos.forEach((combo) => {
    if(combo.every(position => moves.indexOf(position) != -1)) {
        let roundWinner = {player: player};

        for(let i = 0; i < combo.length; i++) {
            document.getElementById(`${combo[i]}`).style.backgroundColor = 
            player == playerOne ? 'lightblue' : 'red';         
        }
        cells.forEach(cell => cell.removeEventListener('click', render, false))
        setTimeout(incrementRound, 3000)
        setTimeout(startGame, 3000)

        // updateScore()
        // checkRound()
        // return roundWinner
    }
 })
}

// function updateScore(roundWinner) {
//     document.getElementById('roundWinner.player').innerText = 
// }

function incrementRound() {
    roundCounter.innerText = parseInt(roundCounter.innerText) + 1;
}

function switchTurns() {
    if(player == playerOne) {
        return player = playerTwo;
    }
    else {
        return player = playerOne;
    }
}




