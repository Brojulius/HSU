const fs = require('fs');
const path = require('path');

const apiKey = process.env.GOOGLE_API_KEY;

const questionPath = path.join(__dirname, 'question.html');

const replaceApiKey = (filePath) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const updatedContent = content.replace('YOUR_GOOGLE_API_KEY', apiKey);
    fs.writeFileSync(filePath, updatedContent);
};

replaceApiKey(questionPath);
