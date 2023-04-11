const statusDisplay = document.querySelector(".game-status");
const scoreDisplay = document.querySelector(".game-score");
const gameContainer = document.getElementsByClassName("game-container")[0];
const gameVsText = document.getElementById("game-vstext");
const restartButton = document.querySelector(".game-restart");
const resetButton = document.querySelector(".game-reset");
const startButton = document.getElementById("game-start");
const singlePlayButton = document.getElementById("game-start-single");
const multiplePlayButton = document.getElementById("game-start-multiple");
const nameEntry = document.getElementById("name-entry");
const nameEntryPlayer = document.getElementById("name-entry-player");
const nameEntryOpponent = document.getElementById("name-entry-opponent");
const modeSelect = document.getElementById("mode-select");
const cells = document.getElementsByClassName("cell");
const playerKanji = "翔";
const opponentKanji = "平";
const playerNamePlaceholder = "翔側";
const opponetNamePlaceholder = "平側";
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

let gameActive = true;
let playerScore = 0;
let opponentScore = 0;
let currentPlayer = playerKanji;
let currentGameState = new Array(9).fill("");
let singlePlayMode = true;
let playerName = "";
let opponentName = "";
let currentPlayerName = "";

// Messages for user
const winningMessage = () => `${currentPlayer}の勝ち！`;
const drawMessage = () => `引き分け!`;
const currentPlayerTurn = () => {
    return currentPlayerName === "" ? 
        `${currentPlayer}の番` :
        `${currentPlayer}(${currentPlayerName})の番`;
};
const scoreMessage = () => `${playerScore} - ${opponentScore}`;

handleResetGame();

function handlePlayerEntry() {
    singlePlayButton.style.display = "none";
    multiplePlayButton.style.display = "none";
    nameEntry.style.display = "block";
    startButton.style.display = "inline-block";

    if (singlePlayMode) {
        nameEntryOpponent.style.display = "none";
    }
    else {
        nameEntryOpponent.style.display = "inline-block";
        nameEntryOpponent.value = "";
        nameEntryOpponent.placeholder = opponetNamePlaceholder;
    }

    nameEntryPlayer.value = "";
    nameEntryPlayer.placeholder = playerNamePlaceholder;
}

function handleStartGame() {
    nameEntry.style.display = "none";
    startButton.style.display = "none";
    modeSelect.style.display = "none";

    gameContainer.style.display = "grid";
    gameVsText.style.display = "block";
    scoreDisplay.style.display = "block";
    statusDisplay.style.display = "block";
    restartButton.style.display = "inline-block";
    resetButton.style.display = "inline-block";

    playerName = nameEntryPlayer.value;
    opponentName = nameEntryOpponent.value;
    currentPlayerName = playerName;
}

function handleStartSinglePlayMode() {
    singlePlayMode = true;
    handlePlayerEntry();
}

function handleStartMultiplePlayMode() {
    singlePlayMode = false;
    handlePlayerEntry();
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
    currentGameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === playerKanji ? opponentKanji : playerKanji;
    currentPlayerName = currentPlayerName === playerName ? opponentName : playerName;
    statusDisplay.innerHTML = currentPlayerTurn();
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let cellConditions = ["", "", ""];
        for (let j = 0; j < winCondition.length; j++) {
            cellConditions[j] = currentGameState[winCondition[j]];
        }

        if (cellConditions.includes("")) {
            continue;
        }
        else if (cellConditions.every(cell => cell === playerKanji)) {
            roundWon = true;
            break;
        }
        else if (cellConditions.every(cell => cell === opponentKanji)) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        if (currentPlayer === playerKanji) {            
            playerScore++;
        }
        else {
            opponentScore++;
        }

        scoreDisplay.innerHTML = scoreMessage();
        gameActive = false;
        return;
    }

    let roundDraw = !currentGameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    handlePlayerChange();
    if (currentPlayer === opponentKanji) {
        computerPlay();
    }
}

function computerPlay() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let cellConditions = new Array(3).fill("");
        for (let j = 0; j < winCondition.length; j++) {
            let cellCondition = currentGameState[winCondition[j]];
            cellConditions[j] = cellCondition === "" ? "-" : cellCondition;
        }

        let firstCond = (cellConditions[0] === playerKanji && 
                        cellConditions[1] === playerKanji);
        let secondCond = (cellConditions[1] === playerKanji &&
                        cellConditions[2] === playerKanji);
        if (firstCond) {
            currentGameState[winCondition[j]] = currentPlayer;
            cells[winCondition[j]].innerHTML = currentPlayer;
        }
        else if (secondCond) {

        }

    }

    handlePlayerChange();
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(
        clickedCell.getAttribute("data-cell-index")
    );
    if (currentGameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = playerKanji;
    currentGameState.fill("");
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll(".cell").forEach(
        cell => cell.innerHTML = ""
    );
    gameVsText.innerHTML = `${playerKanji} vs ${opponentKanji}`;
}

function handleResetGame() {
    playerScore = 0;
    opponentScore = 0;
    scoreDisplay.innerHTML = scoreMessage();

    gameContainer.style.display = "none";
    gameVsText.style.display = "none";
    scoreDisplay.style.display = "none";
    statusDisplay.style.display = "none";
    restartButton.style.display = "none";
    resetButton.style.display = "none";
    nameEntry.style.display = "none";
    startButton.style.display = "none";

    modeSelect.style.display = "block";
    singlePlayButton.style.display = "inline-block";
    multiplePlayButton.style.display = "inline-block";

    handleRestartGame();
}

// Attach click event
document.querySelectorAll(".cell").forEach(
    cell => cell.addEventListener("click", handleCellClick)
);
restartButton.addEventListener("click", handleRestartGame);
singlePlayButton.addEventListener("click", handleStartSinglePlayMode);
multiplePlayButton.addEventListener("click", handleStartMultiplePlayMode);
startButton.addEventListener("click", handleStartGame);
resetButton.addEventListener("click", handleResetGame);