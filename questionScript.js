let timer;
let timeLeft = 25 * 60;

function initClient() {
    gapi.client.init({
        apiKey: 'YOUR_GOOGLE_API_KEY',
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    }).then(function () {
        loadQuestions();
        startTimer();
    }, function(error) {
        console.error("Error initializing Google Sheets API: ", error);
    });
}

function loadQuestions() {
    const params = {
        spreadsheetId: '1LIzHl56mbSOb6HW30PDNAve_ONXTfYkLuDlL13p-Nwc',
        range: 'Sheet2!A2:E3'
    };

    gapi.client.sheets.spreadsheets.values.get(params).then((response) => {
        const questions = response.result.values;
        displayQuestions(questions);
    }, (error) => {
        console.error("Error: ", error);
    });
}

function displayQuestions(questions) {
    const question1 = questions[0];
    const question2 = questions[1];

    document.getElementById('question1').innerText = question1[1];
    document.getElementById('question2').innerText = question2[1];

    const answers1 = document.getElementById('answers1');
    const answers2 = document.getElementById('answers2');

    for (let i = 2; i < question1.length; i++) {
        const li = document.createElement('li');
        li.innerText = question1[i];
        answers1.appendChild(li);
    }

    for (let i = 2; i < question2.length; i++) {
        const li = document.createElement('li');
        li.innerText = question2[i];
        answers2.appendChild(li);
    }
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('time-left').innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert("Die Zeit ist abgelaufen!");
        }
    }, 1000);
}

gapi.load('client', initClient);
