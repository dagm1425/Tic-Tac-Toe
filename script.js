
const player = (name, sign) => {
    let score = 0;

    const getName = () => name;
    const getSign = () => sign;
    const incrementScore = () => score++;
    const getScore = () => score;
    const resetScore = () => score = 0;

    return {getName,
            getSign,
            incrementScore,
            getScore,
            resetScore}
};

const init = (() => {
    const p1field = document.getElementById('p1name');
    const p2field = document.getElementById('p2name');
    const aiRadio = document.getElementById('pvai');
    let pOneName;
    let pTwoName;
    
    function inputFields() {
      document.querySelector('.names').style.display = 'block';
      const difficultySelector = document.querySelector('.diffculty-selector');
      
      if(aiRadio.checked) {
        p2field.disabled = true;  
        p1field.value = 'playerOne';          
        p2field.value = 'Ai';    
        pOneName = p1field.value;
        pTwoName = p2field.value;  
        difficultySelector.style.display = 'block';
      }
  
      else {
        p2field.disabled  = false; 
        p1field.value = 'playerOne';      
        p2field.value = 'PlayerTwo';        
        pOneName = p1field.value;
        pTwoName = p2field.value; 
        difficultySelector.style.display = 'none';
      }
      
      document.getElementById("playBtn").addEventListener("click", (event) => {
        event.preventDefault();
        document.querySelector('.menu').style.display = 'none';
        document.querySelector('.play-area').style.display = 'block';     
        gameBoard.startGame();
      })    
    }
    
    function updateNames() {
      pOneName = p1field.value;
      pTwoName = p2field.value;
    }
    
    function getP1Name() {
      return pOneName;
    } 
    
     function getP2Name() {
      return pTwoName;
    } 
    
    return {inputFields,
            updateNames,
            getP1Name,
            getP2Name,
           };
  })();
  
const gameBoard = (() => {
    const cells = document.querySelectorAll('.cell');
    const roundCounter = document.getElementById('roundCounter');
    const modal = document.getElementById('modal');
    const modalBtn = modal.querySelector('button');
    const overlay = document.getElementById('overlay');

    let gameboard;
    let playerOne;
    let playerTwo;
    let currentPlayer;
    let currentIndex;
    let currentSign;
    let winScore;
    let rounds = 1;
    let endRound = false;
    let newGame = true;
    let isGameWon;


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

    function startGame () {
        if(newGame) {
            initPlayers();
            displayController.clearBoard();
            endRound = true;
            newGame = false;      
        }

        gameboard = new Array(9);
        if(isGameWon) displayController.clearBoard();
        closeModal(); 
        isGameWon = false;
    
        cells.forEach(cell => {
          cell.addEventListener('click', turn, false);
        }) 
    
        if(endRound) {
          resetCounts();
          endRound = false;
        }   
    }

    function initPlayers() {
        playerOne = player(init.getP1Name(), 'X');
        playerTwo = player(init.getP2Name(), 'O');
        currentPlayer = playerOne; 
        displayController.initPlayerNames(); 
    }

    function resetCounts() {
        rounds = 1;
        displayController.resetBoardScore();
        displayController.resetBoardRound(roundCounter);
        playerOne.resetScore();
        playerTwo.resetScore();
    }

    function turn() {
        if(typeof gameboard[event.target.id] == 'number') render(event.target.id);
      }
    
    function render(index) {
        currentIndex = index;
        currentSign = currentPlayer.getSign(); 
        gameboard[currentIndex] = currentSign;
        displayController.fillCell(currentIndex, currentSign);
        let roundWin = checkWin(gameboard, currentSign);
        if(roundWin) renderWin(roundWin);
        if(checkTie()) dispTie();
        switchTurns();
    }

    function switchTurns() {
        currentPlayer = (currentPlayer == playerOne) ? playerTwo : playerOne;
    }
    
    function checkWin(board, playerSign) {
        let roundWon = null 
        const moves = board.reduce((a, e, i) => {
          return (e === playerSign) ? a.concat(i) : a
        }, []);
          
          for(let [index, combo] of winCombos.entries()) { 
            if(combo.every(position => moves.indexOf(position) != -1)) {
              roundWon = {index: index};
              break;
            }        
          }
            return roundWon;
        }
      
    function renderWin(roundWin) {
        let winCombo = winCombos[roundWin.index];

        cells.forEach(cell => cell.removeEventListener('click', turn, false));

        currentPlayer.incrementScore();
        winScore = currentPlayer.getScore();
    
        displayController.renderScore(winScore, currentSign);      

        rounds++;

        if(rounds <= 3) {
            setTimeout(displayController.incrementRound, 3500, roundCounter);
            setTimeout(startGame, 2000);
        }
        else dispWinner();

        isGameWon = true;
    }

    function dispWinner() {
        modalBtn.innerText = 'Replay';
        determineWinner();
        openModal();
        endRound = true; 
      }
  
    function determineWinner() {
        const result = modal.querySelector('[data-result');
        result.innerText = (playerOne.getScore() > playerTwo.getScore()) ? `${playerOne.getName()} Wins!` : (playerOne.getScore() < playerTwo.getScore()) ? `${playerTwo.getName()} Wins!` : "It's a tie";
      }
  
    function openModal() {
        if(modal == null) return;
        modal.classList.add('active');
        overlay.classList.add('active');
      }
  
    function closeModal() {
        if(modal == null) return;
        modal.classList.remove('active');
        overlay.classList.remove('active');
       }
  
      return {startGame, closeModal};
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

    const initPlayerNames = () => {
        const p1Name = document.getElementById('playerOne');
        const p2Name = document.getElementById('playerTwo');
         
        p1Name.innerText = init.getP1Name();
        p2Name.innerText = init.getP2Name();  
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
    return {clearBoard,
            initPlayerNames,
            fillCell, 
            renderScore, 
            incrementRound, 
            resetBoardScore, 
            resetBoardRound}
})();

gameBoard.startGame()

// function updateScore(roundWinner) {
//     document.getElementById('roundWinner.player').innerText = 
// }







