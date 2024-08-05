// build.js
const fs = require('fs');
const path = require('path');

const apiKey = process.env.GOOGLE_API_KEY;

const questionPath = path.join(__dirname, 'question.html');
const indexPath = path.join(__dirname, 'index.html');
const scriptPath = path.join(__dirname, 'script.js');
const setupPath = path.join(__dirname, 'setup.html');
const setupScriptPath = path.join(__dirname, 'setup.js');

const replaceApiKey = (filePath) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const updatedContent = content.replace('YOUR_GOOGLE_API_KEY', apiKey);
    fs.writeFileSync(filePath, updatedContent);
};

replaceApiKey(questionPath);
replaceApiKey(indexPath);
replaceApiKey(scriptPath);
replaceApiKey(setupPath);
replaceApiKey(setupScriptPath);
