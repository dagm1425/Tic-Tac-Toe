


const player = (name, sign) => {
    let score = 0;

    const getName = () => name;
    const getSign = () => sign;
    const incrementScore = () => score++;
    const getScore = () => score;
    const resetScore = () => score = 0;

    return {getName, getSign, incrementScore, getScore, resetScore}
}


const gameBoard = (() => {
    const cells = document.querySelectorAll('.cell');
    const roundCounter = document.getElementById('roundCounter');
    const p1score = document.getElementById('X');
    const p2score = document.getElementById('O');

    const playerOne = player('tempName', 'X')
    const playerTwo = player('tempName2', 'O')

    let currentPlayer = playerOne;
    let gameboard;
    let currentIndex;
    let currentSign;
    let winScore;
    let rounds = 1;
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

    const startGame = () => {
        gameboard = new Array(9);
        displayController.clearBoard()
        let endRound = false;

        cells.forEach(cell => {
            cell.addEventListener('click', render, false);

        }) 

        if(endRound == true) {
            displayController.resetBoardScore()
            displayController.resetBoardRound(roundCounter)
            rounds = 1
            playerOne.resetScore()
            playerTwo.resetScore()
        }   
    }

    function render(event) {
        currentIndex = event.target.id;
        currentSign = currentPlayer.getSign(); // created these vars for use in displaycontroller b/c it couldn't access currentPlayer.getSign()

        gameboard[currentIndex] = currentSign;
        displayController.fillCell(currentIndex, currentSign)
        checkWin(currentPlayer)
        switchTurns()
    }
    
    function switchTurns() {
        if(currentPlayer == playerOne) {
            return currentPlayer = playerTwo;
        }
        else {
            return currentPlayer = playerOne;
        }
    }
    
    function checkWin(currentPlayer) {
     const moves = gameboard.reduce((a, e, i) => {
        return (e === currentSign) ? a.concat(i) : a
     }, []);
    
     winCombos.forEach((combo) => {
        if(combo.every(position => moves.indexOf(position) != -1)) {
    
            for(let i = 0; i < combo.length; i++) {
                document.getElementById(`${combo[i]}`).style.backgroundColor = 
                currentPlayer == playerOne ? 'lightblue' : 'red';         
            }
            cells.forEach(cell => cell.removeEventListener('click', render, false)) 
            
            currentPlayer.incrementScore()
            winScore = currentPlayer.getScore()
            displayController.renderScore(winScore, currentSign)
            

            checkRound(rounds)
            displayController.incrementRound(roundCounter)
            rounds++
            setTimeout(startGame, 1500)
            // return roundWinner
        }
     })
    }

    function checkRound(rounds) {
        if(rounds == 3) alert ('gameover')
        endRound = true;
    }

    return {startGame, currentPlayer};
})();

const displayController = (() => {
    const cells = document.querySelectorAll('.cell');
    const clearBoard = () => {
        cells.forEach(cell => {
            cell.innerText = '';
            cell.style.backgroundColor = "transparent";
            // cell.style.cssText = "animation: fade-out 0.3s ease forwards;";
            // cell.addEventListener("animationend", () => {
            //         square.innerHTML = "";
        }) 
    }

    const fillCell = (currentIndex, currentSign) => { //notice here u don't need to put gameBoard.
        document.getElementById(currentIndex).innerText = currentSign;
    }
    const renderScore = (winScore, currentSign) => document.getElementById(currentSign).innerText = ' ' + winScore;
    const incrementRound = (roundCounter) => roundCounter.innerText = parseInt(roundCounter.innerText) + 1;
    const resetBoardScore = () => {
        document.getElementById('X').innerText = 0;
        document.getElementById('O').innerText = 0;      
    }
    const resetBoardRound = (roundCounter) => roundCounter.innerText = 0
    return {clearBoard, fillCell, renderScore, incrementRound, resetBoardScore, resetBoardRound}
})();

gameBoard.startGame()

// function updateScore(roundWinner) {
//     document.getElementById('roundWinner.player').innerText = 
// }







