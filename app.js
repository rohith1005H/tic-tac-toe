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

const Game = (() => {
    let players = [];
    let playerindx;
    let gameover;

    const base = (player1, player2) => {
        players = [
            Player(player1, 'X'), Player(player2, 'O')
        ];
        playerindx = 0;
        gameover = false;
        gameBoard.resetBoard();
    };

    const getCurrentPlayer = () => players[playerindx];

    const switchPlayer = () => {
        playerindx = 1 - playerindx;
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

    const playTurn = (indx) => {
        if(gameover) return "Game over";

        const player = getCurrentPlayer();
        if(gameBoard.move(indx, player.symbol)){
            if(checkWin()){
                gameover = true;
                return `${player.name} won`;
            } else if(gameBoard.isFull()){
                gameover = true;
                return "It's a draw";
            } else{
                switchPlayer();
                return `${player.name}'s turn`;
            }
        }
        return "Move invalid, try again";
    };

    const getGamestat = () => {
        return {
            board : gameBoard.getBoard(),
            currentPlayer : getCurrentPlayer().name,
            gameOver : gameover
        };
    };
    return {base, playTurn, getGamestat};
})();

Game.base("Rohith", "Some other bitch");