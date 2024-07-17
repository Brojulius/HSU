function initClient() {
    gapi.client.init({
        apiKey: 'YOUR_GOOGLE_API_KEY',
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    }).then(function () {
        document.getElementById('setup-form').addEventListener('submit', handleSetup);
    }, function(error) {
        console.error("Error initializing Google Sheets API: ", error);
    });
}

function handleSetup(event) {
    event.preventDefault();
    
    const requests = [{
        updateSpreadsheetProperties: {
            properties: {
                title: 'HSU Campusrallye'
            },
            fields: 'title'
        }
    }, {
        addSheet: {
            properties: {
                title: 'Sheet1',
                gridProperties: {
                    rowCount: 100,
                    columnCount: 26
                }
            }
        }
    }, {
        addSheet: {
            properties: {
                title: 'Sheet2',
                gridProperties: {
                    rowCount: 100,
                    columnCount: 26
                }
            }
        }
    }, {
        addSheet: {
            properties: {
                title: 'Sheet3',
                gridProperties: {
                    rowCount: 100,
                    columnCount: 26
                }
            }
        }
    }];
    
    const batchUpdateRequest = { requests };

    gapi.client.sheets.spreadsheets.batchUpdate({
        spreadsheetId: '1LIzHl56mbSOb6HW30PDNAve_ONXTfYkLuDlL13p-Nwc',
        resource: batchUpdateRequest
    }).then((response) => {
        console.log(response.result);
        alert("Google Sheet wurde erfolgreich eingerichtet.");
    }, (error) => {
        console.error("Error: ", error);
    });
}

gapi.load('client', initClient);
