document.addEventListener('DOMContentLoaded', loadQuestions);

function loadQuestions() {
    const apiKey = 'YOUR_GOOGLE_API_KEY'; // Replace with your actual API key
    const sheetId = '1LIzHl56mbSOb6HW30PDNAve_ONXTfYkLuDlL13p-Nwc';
    const range = 'Sheet1!A1:J10';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data); // Debugging to check the fetched data
            displayQuestions(data.values);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayQuestions(questions) {
    const questionContainer = document.getElementById('questions');
    questionContainer.innerHTML = '';

    questions.forEach((question, index) => {
        if (index === 0) return; // Skip header row

        const questionElement = document.createElement('div');
        questionElement.className = 'question';

        const questionText = document.createElement('p');
        questionText.innerText = `Question ${question[0]}: ${question[1]}`;
        questionElement.appendChild(questionText);

        for (let i = 2; i <= 6; i++) {
            const answer = question[i];
            if (answer) {
                const answerElement = document.createElement('button');
                answerElement.innerText = answer;
                questionElement.appendChild(answerElement);
            }
        }

        questionContainer.appendChild(questionElement);
    });
}
