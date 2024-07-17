let timer;
let currentQuestionIndex = 0;
let score = 0;
let questionsData = [];
const apiKey = 'AIzaSyAU8dBB-H49p1YHV0Y5_01AXZiO2gjATFE';
const spreadsheetId = '1LIzHl56mbSOb6HW30PDNAve_ONXTfYkLuDlL13p-Nwc';

// Google Sheets API initialisieren
function initClient() {
    gapi.client.init({
        apiKey: apiKey,
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    }).then(() => {
        console.log('GAPI client loaded for API');
    }, (error) => {
        console.error('Error loading GAPI client for API', error);
    });
}

function startGame() {
    const groupName = document.getElementById('group-name').value;
    const direction = document.getElementById('direction').value;

    if (groupName) {
        localStorage.setItem('groupName', groupName);
        localStorage.setItem('direction', direction);
        saveGroupData(groupName, direction);
        window.location.href = 'question.html';
    } else {
        alert('Bitte geben Sie einen Gruppennamen ein.');
    }
}

function saveGroupData(groupName, direction) {
    gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: 'Blatt1!A1:B1',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
            values: [
                [groupName, direction]
            ],
        },
    }).then((response) => {
        console.log('Group data saved:', response);
    }, (error) => {
        console.error('Error saving group data:', error);
    });
}

function loadQuestions() {
    const direction = localStorage.getItem('direction');
    const range = direction === 'forward' ? 'Blatt2!A2:J10' : 'Blatt3!A2:J10';

    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: range,
    }).then((response) => {
        questionsData = response.result.values;
        displayQuestion();
        startTimer();
    }, (response) => {
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

function initializeSheet() {
    gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: 'Blatt1!A1:Z1',
        valueInputOption: 'RAW',
        resource: {
            values: [
                ['Gruppenname', 'Laufrichtung', 'Punkte', 'Frage1', 'Frage2', 'Frage3', 'Frage4']
            ],
        },
    }).then((response) => {
        console.log('Sheet initialized:', response);
        alert('Das Google Sheet wurde erfolgreich initialisiert!');
    }, (error) => {
        console.error('Error initializing sheet:', error);
    });
}

gapi.load('client', initClient);


