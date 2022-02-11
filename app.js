const displayController = (() => {
    const setContainer = () => {
        const container = document.createElement('div');
        container.classList.toggle('container')
        document.body.append(container)
    }

    const setControlBtns = () => {
        const container = document.querySelector('.container')
        const controlBtns = document.createElement('div')
        const newGameBtn = document.createElement('button')

        controlBtns.classList.toggle('controlBtns')
        newGameBtn.classList.toggle('newGameBtn')

        newGameBtn.textContent = 'New Game'
        listenFor(newGameBtn, 'click', resetGame)

        controlBtns.append(newGameBtn)
        container.append(controlBtns)
    }

    const setScoreUI = () => {
        const container = document.querySelector('.container')
        const ui = document.createElement('div')
        ui.classList.toggle('scoreUI')
        const h1 = document.createElement('h1')
        h1.classList.toggle('score')
        h1.innerHTML = `Player ${getDisplayMarker()}, make your move..`
        ui.append(h1)
        container.append(ui)
    }

    const updateScoreUI = () => {
        const score = document.querySelector('.score')
        score.innerHTML = `Player ${getDisplayMarker()}, make your move..`
    }

    const updateDisplay = (message) => {
        const score = document.querySelector('.score')
        score.innerHTML = message
    }

    const setBoard = () => {
        const container = document.querySelector('.container')
        const board = document.createElement('div')
        board.classList.toggle('board')

        for (let i = 0; i < 9; i++) {
            const tileBtn = document.createElement('button')
            tileBtn.classList.toggle('tile')
            tileBtn.setAttribute('tile-index', i)
            listenFor(tileBtn, 'click', playerMove)
            board.append(tileBtn)
        }

        container.append(board)
        document.body.append(container)
    }

    const resetGame = () => {
        gameBoard.clearBoard()

        const tiles = Array.from(document.querySelectorAll('.tile'))
        for (let i = 0; i < tiles.length; i++) {
            if (tiles[i].childElementCount > 0) {
                tiles[i].removeChild(tiles[i].firstChild)
            }
        }
        gameFlow.resetWinner()
        gameBoard.setBoard()
        gameFlow.setPlayers()
        displayController.updateScoreUI()

    }

    const getDisplayMarker = () => {
        const currentPlayerMarker = gameFlow.getCurrentPlayer().getMarker()
        return currentPlayerMarker == 'X' ? '<span class="material-icons playerTwo">close</span>' : '<span class="material-icons playerOne">radio_button_unchecked</span>'
    }

    const playerMove = (event) => {
        const index = event.currentTarget.getAttribute('tile-index')
        gameFlow.getCurrentPlayer().makeMove(index, event)
    }

    const listenFor = (element, type, func) => {
        element.addEventListener(type, func)
    }

    return { setBoard, setControlBtns, setScoreUI, updateScoreUI, updateDisplay, getDisplayMarker, resetGame, setContainer }
})();

const gameBoard = (() => {
    let board = []

    const setBoard = () => {
        for (let i = 0; i < 9; i++) {
            board.push(
                { id: i, marker: '', player: {} }
            )
        }
    };

    const getBoard = () => {
        return { board }
    };

    const clearBoard = () => {
        board = []
    }

    const setTile = (tile, event) => {
        if (board[tile].marker == '' && gameFlow.getWinner() == null) {
            const player = gameFlow.getCurrentPlayer()
            board[tile].player = player
            board[tile].marker = player.getMarker()
            event.target.innerHTML = displayController.getDisplayMarker()

            gameFlow.checkWinCondition(board)

            if (gameFlow.getWinner() == null) {
                gameFlow.toggleCurrentPlayer()
                displayController.updateScoreUI()
            } else {
                displayController.updateDisplay(`Player ${displayController.getDisplayMarker()} wins!`);
                return
            }

        } else {

            displayController.updateDisplay('Illegal move, try again!')

            return
        }
    }

    return { getBoard, setBoard, setTile, clearBoard }

})();

const gameFlow = (() => {
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    let players = [];
    let currentPlayer = {}
    let winner = null

    const checkWinCondition = (board) => {
        let tileCount = 0;
        for (let i = 0; i < winningConditions.length; i++) {
            for (let j = 0; j < winningConditions[i].length; j++) {
                if (board[winningConditions[i][j]].player == currentPlayer) {
                    tileCount++
                }
            }
            if (tileCount >= 3) {
                winner = currentPlayer
            } else {
                tileCount = 0;
            }
        }
    };

    const getWinner = () => {
        return winner != null ? winner : null
    }

    const resetWinner = () => {
        winner = null
    }

    const setPlayers = () => {
        players = []
        const P1 = Player('X');
        const P2 = Player('O');
        players.push(P1)
        players.push(P2)
        currentPlayer = players[0]
    }

    const getCurrentPlayer = () => currentPlayer;

    const toggleCurrentPlayer = () => {
        currentPlayer = currentPlayer == players[0] ? players[1] : players[0];

    };

    const newGame = () => {
        gameBoard.setBoard()
        setPlayers()
        displayController.setContainer()
        displayController.setScoreUI()
        displayController.setControlBtns()
        displayController.setBoard()
    };

    return { newGame, checkWinCondition, getCurrentPlayer, toggleCurrentPlayer, getWinner, resetWinner, setPlayers }

})();

const Player = (marker) => {
    const getMarker = () => marker;

    const makeMove = (tile, event) => {
        gameBoard.setTile(tile, event)
    }

    return { getMarker, makeMove }
}

gameFlow.newGame()




