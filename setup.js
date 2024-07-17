// setup.js

const API_KEY = 'YOUR_GOOGLE_API_KEY';
const SPREADSHEET_ID = '1LIzHl56mbSOb6HW30PDNAve_ONXTfYkLuDlL13p-Nwc';

async function prepareSheet() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate?key=${API_KEY}`;
    const data = {
        requests: [
            {
                addSheet: {
                    properties: {
                        title: 'Sheet2',
                        gridProperties: {
                            rowCount: 100,
                            columnCount: 10
                        }
                    }
                }
            },
            {
                addSheet: {
                    properties: {
                        title: 'Sheet3',
                        gridProperties: {
                            rowCount: 100,
                            columnCount: 10
                        }
                    }
                }
            },
            {
                updateCells: {
                    start: {
                        sheetId: 0,
                        rowIndex: 0,
                        columnIndex: 0
                    },
                    rows: [
                        {
                            values: [
                                { userEnteredValue: { stringValue: "Gruppenname" } },
                                { userEnteredValue: { stringValue: "Laufrichtung" } },
                                { userEnteredValue: { stringValue: "Gesamtpunkte" } },
                                { userEnteredValue: { stringValue: "Startzeit" } },
                                { userEnteredValue: { stringValue: "Endzeit" } }
                            ]
                        }
                    ],
                    fields: "userEnteredValue"
                }
            }
        ]
    };

    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const statusDiv = document.getElementById('status');
    if (response.ok) {
        statusDiv.innerText = 'Google Sheet wurde erfolgreich vorbereitet!';
    } else {
        statusDiv.innerText = 'Fehler beim Vorbereiten des Google Sheets.';
    }
}
