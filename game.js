let generatedRandomNumbers = [];
let level = 0;
let firstNumbers;
let userInputNumbers = [];
let inputTimeout;
let timevar;
let gameInProgress = false; // Flag to track game state

$(document).ready(function () {
    // Start the game when the user presses the Enter key
    $(document).one("keypress", function (e) {
        if (e.which === 13) {
            startGame();
        }
    });
});

function startGame() {
    level = 0;
    gameInProgress = true; // Mark game as in progress
    nextLevel();
}

function nextLevel() {
    userInputNumbers = [];
    level++;
    $("#level-title").text("Level " + level);
    genRandomNumbers();
    round1(level);
}

function genRandomNumbers() {
    firstNumbers = 6 + level;
    generatedRandomNumbers = []; // Clear previous numbers
    for (let i = 0; i < 6; i++) {
        let n = Math.random();
        generatedRandomNumbers.push(Math.floor(n * firstNumbers + 1));
    }
    $(".random-number").each(function (index) {
        $(this).text(generatedRandomNumbers[index]);
    });
    generatedRandomNumbers.sort((a, b) => a - b); // Sort the numbers in ascending order
    $("div").addClass("div-text");
}

function round1(timevar1) {
    timevar = timevar1 * 20; // Slow down the time reduction
    $(".random-number").show();
    setTimeout(function () {
        $(".random-number").text("");
        round2(timevar);
    }, 6000 - timevar);
}

function round2(timevar1) {
    $(".input-number").remove(); // Remove previous input fields
    for (let i = 0; i < 6; i++) {
        $(`#div${i}`).html(
            `<input type='number' class='input-number' id='input-number${i}' placeholder='Enter No.'>`
        );
    }

    // Add event listener for the input fields to submit the answer when user presses Enter
    $(".input-number").keypress(function (e) {
        if (e.which == 13) {
            // Enter key pressed
            checkAnswer();
        }
    });

    // Set a timeout for n seconds to automatically check the answer if the user does not input anything
    inputTimeout = setTimeout(function () {
        checkAnswer(timevar1);
    }, 16000 - timevar1);
}

function checkAnswer(timevar1) {
    clearTimeout(inputTimeout); // Clear the timeout if the user submits within the time limit

    userInputNumbers = [];
    for (let i = 0; i < 6; i++) {
        let value = parseInt($(`#input-number${i}`).val(), 10);
        if (!isNaN(value)) {
            userInputNumbers.push(value);
        } else {
            userInputNumbers.push(null); // Handle empty or invalid inputs
        }
    }

    let sortedUserNumbers = [...userInputNumbers].sort((a, b) => a - b);

    if (sortedUserNumbers.toString() === generatedRandomNumbers.toString()) {
        console.log("Success");
        var audio = new Audio("./sounds/success.mp3");
        audio.play();
        $("body").addClass("round-success");
        setTimeout(function () {
            $("body").removeClass("round-success");
            if (gameInProgress) { // Check if game is still in progress
                nextLevel();
            }
        }, 2000 + timevar1); // Delay by 2 seconds after the success sound
    } else {
        console.log("Wrong");
        var audio = new Audio("./sounds/wrong.mp3");
        audio.play();
        $("body").addClass("game-over");
        setTimeout(function () {
            $("body").removeClass("game-over");
        }, 400);
        $("#level-title").text("Game Over, Press Enter to Restart");
        gameInProgress = false; // Mark game as ended
        setTimeout(startOver, 1000); // Restart the game after 1 second 
    }
}

function startOver() {
    level = 0;
    generatedRandomNumbers = [];
    userInputNumbers = [];
    $(".input-number").remove(); // Remove previous input fields
    for (let i = 0; i < 6; i++) {
        $(`#div${i}`).text(""); // Clear the divs
    }
    $("#level-title").text("Press Enter to Start");
    $(document).one("keypress", function (e) {
        if (e.which === 13) {
            startGame();
        }
    });
}

startOver(); // Initialize game on page load
