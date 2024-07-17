function startGame() {
    const groupName = document.getElementById('group-name').value;
    const direction = document.getElementById('direction').value;

    if (groupName) {
        localStorage.setItem('groupName', groupName);
        localStorage.setItem('direction', direction);
        window.location.href = 'question.html';
    } else {
        alert('Bitte geben Sie einen Gruppennamen ein.');
    }
}

function loadQuestions() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1LIzHl56mbSOb6HW30PDNAve_ONXTfYkLuDlL13p-Nwc',
        range: 'HSU Campusrallye!A2:J10',
    }).then(function(response) {
        questionsData = response.result.values;
        displayQuestion();
        startTimer();
    }, function(response) {
        console.log('Error: ' + response.result.error.message);
    });
}

function displayQuestion() {
    if (currentQuestionIndex < questionsData.length) {
        const question = questionsData[currentQuestionIndex];
        document.getElementById('question').innerText = question[1];
        const answers = question.slice(2, 7);
        shuffleArray(answers);
        const answersContainer = document.getElementById('answers');
        answersContainer.innerHTML = '';
        answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.innerText = answer;
            button.onclick = () => checkAnswer(index === 0);
            answersContainer.appendChild(button);
        });
    } else {
        endGame();
    }
}

function checkAnswer(isCorrect) {
    if (isCorrect) {
        score++;
    }
    currentQuestionIndex++;
    displayQuestion();
}

function submitAnswers() {
    alert('Antworten eingereicht');
}

function startTimer() {
    let timeRemaining = 25 * 60;
    timer = setInterval(() => {
        if (timeRemaining <= 0) {
            clearInterval(timer);
            endGame();
        } else {
            timeRemaining--;
            document.getElementById('timer').innerText = `Verbleibende Zeit: ${Math.floor(timeRemaining / 60)}:${('0' + timeRemaining % 60).slice(-2)}`;
        }
    }, 1000);
}

function endGame() {
    alert(`Spiel beendet! Ihre Punktzahl: ${score}`);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function setupSheets() {
    // Setup code to create and initialize the Google Sheets structure
    alert('Google Sheets eingerichtet');
}

// Google API initialization
gapi.load('client', () => {
    gapi.client.init({
        apiKey: 'AIzaSyAU8dBB-H49p1YHV0Y5_01AXZiO2gjATFE',
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    }).then(() => {
        if (window.location.pathname.endsWith('question.html')) {
            loadQuestions();
        }
    });
});

