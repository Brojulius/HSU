// script.js

const API_KEY = 'YOUR_GOOGLE_API_KEY';
const SPREADSHEET_ID = '1LIzHl56mbSOb6HW30PDNAve_ONXTfYkLuDlL13p-Nwc';
const SHEET_NAME_FORWARD = 'Sheet2';
const SHEET_NAME_BACKWARD = 'Sheet3';

document.addEventListener('DOMContentLoaded', () => {
    const startForm = document.getElementById('start-form');
    if (startForm) {
        startForm.addEventListener('submit', startGame);
    } else {
        loadQuestion();
        startTimer();
    }
});

async function startGame(event) {
    event.preventDefault();
    const groupName = document.getElementById('group-name').value;
    const direction = document.getElementById('direction').value;
    const startTime = new Date().getTime();

    localStorage.setItem('groupName', groupName);
    localStorage.setItem('direction', direction);
    localStorage.setItem('startTime', startTime);
    localStorage.setItem('currentQuestion', 1);

    const sheetName = direction === 'forward' ? SHEET_NAME_FORWARD : SHEET_NAME_BACKWARD;

    // Save initial data to Google Sheets (direction and groupName)
    await saveInitialData(groupName, direction, startTime);

    window.location.href = `question.html?key=secret123`;
}

async function saveInitialData(groupName, direction, startTime) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME_FORWARD}!A1:D1:append?valueInputOption=RAW&key=${API_KEY}`;
    const data = {
        values: [[groupName, direction, 0, startTime, '']]
    };

    await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

async function loadQuestion() {
    const currentQuestion = parseInt(localStorage.getItem('currentQuestion'));
    const direction = localStorage.getItem('direction');
    const sheetName = direction === 'forward' ? SHEET_NAME_FORWARD : SHEET_NAME_BACKWARD;

    const data = await fetchSheetData(sheetName);
    const questionData = data.find(row => parseInt(row[0]) === currentQuestion);

    if (!questionData) {
        alert('Fehler beim Laden der Frage. Bitte versuchen Sie es später erneut.');
        return;
    }

    const [questionNum, question1, ...answers1, hintForward, hintBackward, question2, ...answers2] = questionData;
    const correctAnswer1 = answers1[0];
    const correctAnswer2 = answers2[0];
    shuffleArray(answers1);
    shuffleArray(answers2);

    document.getElementById('question1-text').innerText = question1;
    const answersContainer1 = document.getElementById('answers1');
    answersContainer1.innerHTML = '';
    answers1.forEach(answer => {
        const answerElement = document.createElement('div');
        answerElement.innerHTML = `<input type="radio" name="answer1" value="${answer}"> ${answer}`;
        answersContainer1.appendChild(answerElement);
    });

    document.getElementById('question2-text').innerText = question2;
    const answersContainer2 = document.getElementById('answers2');
    answersContainer2.innerHTML = '';
    answers2.forEach(answer => {
        const answerElement = document.createElement('div');
        answerElement.innerHTML = `<input type="radio" name="answer2" value="${answer}"> ${answer}`;
        answersContainer2.appendChild(answerElement);
    });

    document.getElementById('correct-answer1').value = correctAnswer1;
    document.getElementById('correct-answer2').value = correctAnswer2;

    const directionHint = direction === 'forward' ? hintForward : hintBackward;
    document.getElementById('hint').innerText = directionHint;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function submitAnswers() {
    const groupName = localStorage.getItem('groupName');
    const currentQuestion = parseInt(localStorage.getItem('currentQuestion'));
    const selectedAnswer1 = document.querySelector('input[name="answer1"]:checked').value;
    const selectedAnswer2 = document.querySelector('input[name="answer2"]:checked').value;
    const correctAnswer1 = document.getElementById('correct-answer1').value;
    const correctAnswer2 = document.getElementById('correct-answer2').value;

    const isCorrect1 = selectedAnswer1 === correctAnswer1 ? 1 : 0;
    const isCorrect2 = selectedAnswer2 === correctAnswer2 ? 1 : 0;
    const totalPoints = isCorrect1 + isCorrect2;

    // Save points to Google Sheets
    savePointsToSheet(groupName, currentQuestion, totalPoints);

    // Update current question
    const nextQuestion = currentQuestion + 1;
    localStorage.setItem('currentQuestion', nextQuestion);

    // Redirect to the next question
    setTimeout(() => {
        window.location.href = `question.html?key=secret123`;
    }, 2000);
}

async function savePointsToSheet(groupName, questionNumber, points) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME_FORWARD}!A${questionNumber + 1}:append?valueInputOption=RAW&key=${API_KEY}`;
    const data = {
        values: [[groupName, points]]
    };

    await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

async function fetchSheetData(sheetName) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}?key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.values;
}

function startTimer() {
    const startTime = parseInt(localStorage.getItem('startTime'));
    const endTime = startTime + 25 * 60 * 1000;

    const interval = setInterval(() => {
        const currentTime = new Date().getTime();
        const remainingTime = endTime - currentTime;

        if (remainingTime <= 0) {
            clearInterval(interval);
            saveEndTime();
            alert('Zeit abgelaufen! Das Spiel ist beendet.');
            window.location.href = 'index.html';
        } else {
            const minutes = Math.floor(remainingTime / (1000 * 60));
            const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
            document.getElementById('timer').innerText = `Verbleibende Zeit: ${minutes} Minuten und ${seconds} Sekunden`;
        }
    }, 1000);
}

async function saveEndTime() {
    const groupName = localStorage.getItem('groupName');
    const endTime = new Date().getTime();

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME_FORWARD}!A1:E1:append?valueInputOption=RAW&key=${API_KEY}`;
    const data = {
        values: [[groupName, endTime]]
    };

    await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }

function prepareGoogleSheet() {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:J1:append?valueInputOption=RAW`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            values: [
                ["Fragennummer", "Frage", "Antwort 1 (richtig)", "Antwort 2", "Antwort 3", "Antwort 4", "Antwort 5", "Hinweis auf nächsten QR-Code (vorwärts)", "Hinweis auf nächsten QR-Code (rückwärts)"]
            ]
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.updates) {
            alert('Google Sheet wurde erfolgreich vorbereitet!');
        } else {
            throw new Error('Fehler beim Vorbereiten des Google Sheets.');
        }
    })
    .catch(error => {
        document.getElementById('error').textContent = error.message;
    });
}
