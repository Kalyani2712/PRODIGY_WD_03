let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let playerVsPlayerBtn = document.querySelector("#player-vs-player");
let playerVsAiBtn = document.querySelector("#player-vs-ai");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let status = document.querySelector("#status");
let turnStatus = document.querySelector("#turn-status");

let turnO = true; // playerO
let count = 0; // To Track Draw
let isAiMode = false; // Flag to check if AI mode is enabled

const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

const resetGame = () => {
    turnO = true;
    count = 0;
    enableBoxes();
    msgContainer.classList.add("hide");
    turnStatus.innerText = ""; // Clear turn status
};

const updateTurnStatus = () => {
    turnStatus.innerText = turnO ? "Player O's Turn" : "Player X's Turn";
};

const makeAIMove = () => {
    const availableBoxes = [...boxes].filter(box => box.innerText === "");
    if (availableBoxes.length > 0) {
        const randomBox = availableBoxes[Math.floor(Math.random() * availableBoxes.length)];
        randomBox.innerText = "X";
        randomBox.disabled = true;
        count++;
        if (checkWinner()) return;
        turnO = true; // Switch back to player O's turn
        updateTurnStatus();
    }
};

const handlePlayerMove = (box) => {
    if (box.innerText !== "") return; // Prevent clicking on filled boxes

    box.innerText = turnO ? "O" : "X";
    box.disabled = true;
    count++;

    if (checkWinner()) return;

    if (isAiMode && count < 9) {
        turnO = false; // Switch to AI's turn
        updateTurnStatus();
        setTimeout(makeAIMove, 500); // AI makes its move after a brief delay
    } else {
        if (count >= 9) {
            gameDraw();
        } else {
            turnO = !turnO; // Switch turns between players
            updateTurnStatus();
        }
    }
};

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        handlePlayerMove(box);
    });
});

const gameDraw = () => {
    msg.innerText = "Game was a Draw.";
    msgContainer.classList.remove("hide");
    disableBoxes();
};

const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};

const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
    }
};

const showWinner = (winner) => {
    msg.innerText = `Congratulations, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();
};

const checkWinner = () => {
    for (let pattern of winPatterns) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if (pos1Val !== "" && pos1Val === pos2Val && pos1Val === pos3Val) {
            showWinner(pos1Val);
            return true;
        }
    }
    return false;
};

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);

playerVsPlayerBtn.addEventListener("click", () => {
    isAiMode = false;
    resetGame();
    status.innerText = "Player vs Player Mode";
});

playerVsAiBtn.addEventListener("click", () => {
    isAiMode = true;
    resetGame();
    status.innerText = "Player vs AI Mode";
    updateTurnStatus(); // Update turn status to reflect AI's turn
});
