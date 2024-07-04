const gameBoard = (() => {
    let board = Array(9).fill(null);

    const getBoard = () => [...board];
    const resetBoard = () => board = Array(9).fill(null);
    const move = (index, symbol) => {
        if(board[index] === null){
            board[index] = symbol;
            return true;
        } else {
            return false;
        }
    };
    const isFull = () => !board.includes(null);
    return {getBoard, resetBoard, move, isFull};
})();

const Player = (name, symbol) => {
    return {name, symbol};
}

const DisplayController = (() => {
    const renderBoard = () => {
      const board = gameBoard.getBoard();
      const cells = document.querySelectorAll('.cell');
      cells.forEach((cell, index) => {
        cell.textContent = board[index] || '';
      });
    };
  
    const updateStatus = (message) => {
      const statusElement = document.getElementById('status');
      statusElement.textContent = message;
    };
  
    const mainDisplay = () => {
      const gameContainer = document.getElementById('game-container');
      gameContainer.innerHTML = '';

      for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', () => {
          const result = Game.playTurn(i);
          updateStatus(result);
          renderBoard();
        });
        gameContainer.appendChild(cell);
      }
  
      renderBoard();
      updateStatus(`${Game.getGameStatus().currentPlayer}'s turn`);
    };
  
    return { mainDisplay, renderBoard, updateStatus };
})();

const Game = (() => {
    let players = [];
    let playerIndex;
    let gameOver;

    const base = (player1 = "Player 1", player2 = "Player 2") => {
        players = [
            Player(player1, 'X'), Player(player2, 'O')
        ];
        playerIndex = 0;
        gameOver = false;
        gameBoard.resetBoard();
        DisplayController.mainDisplay();
    };

    const getCurrentPlayer = () => players[playerIndex];

    const switchPlayer = () => {
        playerIndex = 1 - playerIndex;
    };

    const checkWin = () => {
        const winPatterns = [
            [0,1,2], [3,4,5], [6,7,8], 
            [0,3,6], [1,4,7], [2,5,8],
            [0,4,8], [2,4,6]
        ];

        return winPatterns.some((pattern) => {
            const [a,b,c] = pattern;
            const board = gameBoard.getBoard();
            return board[a] && board[a] === board[b] && board[a] === board[c];
        });
    };

    const playTurn = (index) => {
        if(gameOver) return "Game over";

        const player = getCurrentPlayer();
        if(gameBoard.move(index, player.symbol)){
            if(checkWin()){
                gameOver = true;
                return `${player.name} won`;
            } else if(gameBoard.isFull()){
                gameOver = true;
                return "It's a draw";
            } else{
                switchPlayer();
                return `${getCurrentPlayer().name}'s turn`;
            }
        }
        return "Move invalid, try again";
    };

    const getGameStatus = () => {
        return {
            board : gameBoard.getBoard(),
            currentPlayer : getCurrentPlayer().name,
            gameOver : gameOver
        };
    };
    return {base, playTurn, getGameStatus};
})();

Game.base("Player 1", "Player 2");

document.getElementById('reset-button').addEventListener('click', () => {
    Game.base("Player 1", "Player 2");
});