function initClient() {
    gapi.client.init({
        apiKey: 'YOUR_GOOGLE_API_KEY',
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    }).then(function () {
        document.getElementById('start-form').addEventListener('submit', handleFormSubmit);
    }, function(error) {
        console.error("Error initializing Google Sheets API: ", error);
    });
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const groupName = document.getElementById('group-name').value;
    const direction = document.getElementById('direction').value;
    
    saveGroupData(groupName, direction);
}

function saveGroupData(groupName, direction) {
    const params = {
        spreadsheetId: '1LIzHl56mbSOb6HW30PDNAve_ONXTfYkLuDlL13p-Nwc',
        range: 'Sheet1!A1:B1',
        valueInputOption: 'RAW'
    };

    const valueRangeBody = {
        "values": [
            [groupName, direction]
        ]
    };

    gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody).then((response) => {
        console.log(response.result);
        // Weiterleitung zur Question Seite
        window.location.href = "question.html";
    }, (error) => {
        console.error("Error: ", error);
    });
}

gapi.load('client', initClient);
