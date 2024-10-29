import { boardRows, boardCols, gameState } from './globals.js';
import { computerTurn, end } from './index.js';

function drawBoard(player) {
    const grid = document.querySelector(`#${player.team}-board-grid`);
    grid.replaceChildren(); // wipe grid

    for (let row = 0; row < boardRows; row++) {
        for (let col = 0; col < boardCols; col++) {
            const cell = document.createElement("div");
            cell.id = `cell${row}${col}${player.team}`;
            cell.className = 'cell';

            if (player.team === 'r' && player.gameboard.board[row][col] === 's') {
                cell.classList.add('cell-ship');
                if (gameState.turn === 'setup') {
                    // make player's cells drag/droppable
                    cell.setAttribute("draggable", "true");
                    cell.addEventListener("dragstart", shipDragStart.bind(null, player));
                    cell.addEventListener("dragover", shipDragOver);
                    cell.addEventListener("drop", shipDrop.bind(null, player));
                }
            } else if (player.gameboard.board[row][col] === 'x') {
                cell.classList.add('cell-hit');
                cell.textContent = '•';
            } else if (player.gameboard.board[row][col] === 'm') {
                cell.classList.add('cell-miss');
                cell.textContent = '•';
            } else if (player.gameboard.board[row][col] === 'sunk') {
                cell.classList.remove('cell-hit');
                cell.classList.add('cell-sunk')
                cell.textContent = '✕';
            } else if (player.gameboard.board[row][col] === '') {
                if (gameState.turn === 'setup' && player.team === 'r') {
                    cell.addEventListener("dragover", shipDragOver);
                    cell.addEventListener("drop", shipDrop.bind(null, player));
                }
            }

            // make the cells of the computer's board clickable
            if (player.team === 'c') {
                cell.addEventListener("click", () => {
                    if (gameState.turn === 'r') {
                        handleAttack(player, row, col);
                    }
                });
            }

            grid.appendChild(cell); 
        }
    }
}

// draggable event handlers
function shipDragStart(player, e) {
    const fromCellId = e.target.id;
    const row = parseInt(fromCellId.slice(-3, -2));
    const col = parseInt(fromCellId.slice(-2, -1));
    const ship = player.gameboard.shipAt(row, col);
    // only send the cellId if the cell is a ship
    if (ship !== null) {
        e.dataTransfer.setData("text/plain", fromCellId);
    }
}

function shipDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
}

function shipDrop(player, e) {
    e.preventDefault();
    const fromCellId = e.dataTransfer.getData("text");

    if (!fromCellId) { // if dragstart listener was on non-ship cell, do nothing
        return;
    }
   
    const fromRow = parseInt(fromCellId.slice(-3, -2));
    const fromCol = parseInt(fromCellId.slice(-2, -1));
    const ship = player.gameboard.shipAt(fromRow, fromCol);
    
    const toCellId = e.target.id;
    const toRow = parseInt(toCellId.slice(-3, -2));
    const toCol = parseInt(toCellId.slice(-2, -1));

    // place the ship if valid
    if (player.gameboard.validateMove(ship, toRow, toCol, ship.orientation)) {
        player.gameboard.placeShip(ship, toRow, toCol, ship.orientation);
        drawBoard(player);
    }
}

function handleAttack(player, row, col) {
    const didHit = player.gameboard.receiveAttack(row, col);
    drawBoard(player);

    const hitAnimationBg = document.querySelector("#hit-animation-bg");
    const statusText = document.querySelector("#status-text");
    const computerBoardModal = document.querySelector("#computer-board-modal");
    
    if (!didHit) {
        gameState.turn = (gameState.turn === 'r') ? 'c' : 'r';
        statusText.textContent = "Opponent's turn."; // Indicate it's the opponent's turn

        // hide the play button in the modal
        const playButton = document.querySelector("#play-button");
        playButton.style.display = "none";
        computerBoardModal.show();

        computerTurn(() => {
            computerBoardModal.close();
            playButton.style.display = "block";
            statusText.textContent = "Your turn."
        })

        return;
    }
    
    statusText.textContent = "Hit! Take another shot."; 
    hitAnimationBg.classList.toggle("hit");
    setTimeout(() => {
        hitAnimationBg.classList.toggle("hit")
    }, 1500);
    
    // CASE: player wins 
    if (player.gameboard.allShipsSunk()) {
        end('r');
    }
}

export { drawBoard };