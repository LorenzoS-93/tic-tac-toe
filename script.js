/* script.js */

/* 
** The gameboard rappresent the state of the board
** each slot of the array holds a cell
*/
function gameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    /* 
    ** Create a 2D array that rappresent the state of the game board
    ** Row 0 rappresent the top row
    ** Column 0 rappresent the left-most column
    ** The loop will fill the board array with #row cell
    ** Each cell is an array of length equal to #column
    */
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(cell());
        }
    }

    /* 
    ** Method for getting the entire board. 
    ** This method will return the array.
    */
    const getBoard = () => board;

    /* 
    ** Method for setting a token
    ** this will let each player to occupy a cell with their symbol
    */
    const setToken = (row, column, player) => {
        /* 
        ** First I need to be sure that the choosen cell is empty
        ** If is not empty, the move is invalid.
        ** If the move is invalid return false to get the problem.
        */
        if (board[row][column].getValue() !== "") {
            return false;
        }
        /* Else add the tocken */
        board[row][column].addToken(player);
    };

    /* Method for printing the board */
    const printBoard = () => {
        const boardWithTokens = board.map((row) => row.map((cell) => cell.getValue()));
    };

    /* Return the necessary method so that the application can interact with the board */
    return {getBoard, setToken, printBoard};
}

/*
** A cell rappresent one square of the board
** 0: no token in the cell
** 1: player1 token in the square
** 2: player2 token in the square
*/
function cell() {
    let value = "";

    /* Method for accepting a player token to modify the value of the cell */
    const addToken = (player) => {
        value = player;
    };

    /* Method for getting the value of the cell */
    const getValue = () => value;

    /* Return the necessary method so that the application can interact with the cell */
    return {addToken, getValue};
}

/*
** The gameManager will be responsible of the game flow,
** state of the game's turns
** and whether anybody wins
*/
function gameManager(playerOneName = "Player One", playerTwoName = "Player Two") {
    /* Initialize the board, will be empty */
    const board = gameBoard();
    /* 
    ** Initialize the two players
    ** Each player will have a name and a token
    */
    const players = [
        {
            name: playerOneName,
            token: "X"
        },
        {
            name: playerTwoName,
            token: "O"
        }
    ];
    /* Initialize the active player, the game will start with Player One */
    let activePlayer = players[0];
    let result = "";

    const checkResult = (row, column, activePlayer) => {
        let i = 0;
        /* Check for tris on the row where the token is inserted */
        
        for(const cell of board.getBoard()[row]) {
            if (cell.getValue() === activePlayer.token) {
                i++;
            }
        }
        if(i === 3) return activePlayer.name;
        /* Check for tris on the column where the token is inserted */
        i = 0;
        for (const row of board.getBoard()) {
            if (row[column].getValue() === activePlayer.token) {
                i++;
            }
        }
        if(i === 3) return activePlayer.name;
        /* Check the main diagonal only if column and row are there */
        i = 0;
        if(column === row) {
            for (let j = 0; j < 3; j++) {
                if(board.getBoard()[j][j].getValue() === activePlayer.token) {
                    i++;
                }
            }
            if (i === 3) return activePlayer.name;
        }
        /* Check the anti-diagonal */
        i = 0;
        if(row  == 2-column) {
            for (let h = 0; h < 3; h++) {
                if(board.getBoard()[h][2-h].getValue() === activePlayer.token) {
                    i++;
                }
            }
            if (i === 3) return activePlayer.name;
        }
        i = 0;
        /* Check for Draw */
        for(r = 0; r < 3; r++) {
            for (c = 0; c < 3; c++) {
                if(board.getBoard()[r][c].getValue() !== "") {
                    i++;
                }
            }
        }
        if(i === 9) return "draw";
        
        return "";
    };

    /* 
    ** Method for switching active player 
    ** Will be used at the end of every turn
    */
    const switchActivePlayer = () => {
        if (activePlayer === players[0]) {
            activePlayer = players[1];
        }
        else {
            activePlayer = players[0];
        }
    };

    /* Method for getting the active player */
    const getActivePlayer = () => activePlayer;

    const getResult = () => result;

    /* Method for printing the state of the board at the beginning of each round */
    const printNewTurn = () => {
        board.printBoard();
    };

    /* 
    ** Logic for each round
    ** The active player will choose a cell and set a token
    ** If the token get added the turn will pass to the other payer
    */
    const playTurn = (row, column) => {
        /* 
        ** Play the move choosen by the player
        ** if the move is invalid the turn will not pass to the other player
        */
        if(board.setToken(row, column, getActivePlayer().token) !== false) {
            result = checkResult(row, column, getActivePlayer());
            switchActivePlayer();
        }
        
        printNewTurn();
    };

    printNewTurn();

    return {playTurn, getActivePlayer, getResult, getBoard: board.getBoard};
}

/* 
** screenManager will manage what will be show to the final user
*/
function screenManager() {
    /* Initialize the game */
    const game = gameManager();
    /* Select the two div in the html file to append the child */
    const turnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");
    const resultDiv = document.querySelector(".result");

    /* This pattern will update the board at the end of each round */
    const screenUpdate = () => {
        /* Clear the board */
        boardDiv.textContent = "";
        /* Get the updated board with the last move and the active player */
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        /* Display the player turn */
        turnDiv.textContent = `${activePlayer.name}'s turn`;
        /* Render each board cell */
        for(const row of board) {
            for(const cell of row) {
                /* Create a button for each cell */
                const cellButton = document.createElement("element");
                cellButton.setAttribute("class", "cell");
                /* Create a data attribute to identify the row and the column */
                cellButton.dataset.row = board.indexOf(row);
                cellButton.dataset.column = row.indexOf(cell);
                /* Set the value of the cell */
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            }
        }
        resultDiv.textContent = game.getResult();
    };
    /* Add event listener to the board */
    function boardClickHandler(e) {
        console.log(game.getResult());
        if(game.getResult() === "") {
            const selectedRow = e.target.dataset.row;
            if(!selectedRow) return;
            const selectedColumn = e.target.dataset.column;
            if(!selectedColumn) return;

            /* Play the turn */
            game.playTurn(selectedRow, selectedColumn);
        }
        
        screenUpdate();
    }
    boardDiv.addEventListener("click", boardClickHandler);

    /* Initial render */
    screenUpdate();
}

screenManager();