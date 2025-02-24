// Memory Card Game with 2-Minute Timer

const cards = [
    '🌸', '🌸',
    '🌺', '🌺',
    '🌷', '🌷',
    '🌻', '🌻',
    '🍁', '🍁',
    '🪷', '🪷',
    '🪻', '🪻',
    '💐', '💐'
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let timerInterval;
let timeLeft = 120; // 2 minutes in seconds
let isPaused = false; // Track if timer is paused

// Shuffle function
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Create the game board
function createBoard() {
    const gameBoard = document.querySelector('.game-board');
    gameBoard.innerHTML = ''; // Clear existing cards
    shuffle(cards);
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.icon = card;
        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">${card}</div>
            </div>`;
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

// Handle card flip
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

// Check if two flipped cards match
function checkForMatch() {
    let isMatch = firstCard.dataset.icon === secondCard.dataset.icon;
    isMatch ? disableCards() : unflipCards();
}

// Disable matched cards
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
    checkWinCondition();
}

// Unflip unmatched cards
function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1500);
}

// Reset board state after a pair is handled
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

// Check if all cards are matched
function checkWinCondition() {
    const flippedCards = document.querySelectorAll('.flipped');
    if (flippedCards.length === cards.length) {
        stopTimer();
        setTimeout(() => {
            alert("🎉 Congratulations! You matched all cards in time! 🎉");
        }, 500);
    }
}

// Start the 2-minute timer
function startTimer() {
    stopTimer(); // Clear any existing timer
    timeLeft = 120; // Reset time
    isPaused = false;
    updateTimerDisplay(timeLeft);
    runTimer();
}

// Run the timer
function runTimer() {
    if (isPaused) {
        isPaused = false;
        timerInterval = setInterval(countdown, 1000);
    }
}

// Stop/Pause the timer
function stopTimer() {
    clearInterval(timerInterval);
    isPaused = true;
}

// Countdown function
function countdown() {
    if (!isPaused) {
        timeLeft--;
        updateTimerDisplay(timeLeft);

        if (timeLeft <= 0) {
            stopTimer();
            alert("⏳ Time's up! Try again.");
            resetGame();
        }
    }
}

// Update timer display in "mm:ss" format
function updateTimerDisplay(seconds) {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    document.getElementById('timer').textContent = `Time Left: ${minutes}:${secs}`;
}

// Reset the entire game
function resetGame() {
    stopTimer();
    createBoard();
    startTimer();
}

// Event listeners
document.getElementById('reset-button').addEventListener('click', resetGame);
document.getElementById('pause-button').addEventListener('click', stopTimer);
document.getElementById('resume-button').addEventListener('click', runTimer);

// Initialize the game board and timer when the script loads
window.onload = () => {
    createBoard();
    startTimer();
};

