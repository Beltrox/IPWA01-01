const userLanguage = navigator.language || navigator.languages[0];

const rtlLanguages = ['ar', 'he', 'fa', 'ur']; // Liste der RTL-Sprachen

const isRTL = rtlLanguages.includes(userLanguage.split('-')[0]);

function wechsel_zu_datenschutz(){
    window.location.href="datenschutz.html";
}
function wechsel_zu_impressum(){
    window.location.href="impressum.html";
}

document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('menu');
    const datenschutzButton = document.getElementById("datenschutzButton");
    const impressumButton = document.getElementById("impressumButton");

    datenschutzButton.addEventListener("click", () => wechsel_zu_datenschutz());
    impressumButton.addEventListener("click", () => wechsel_zu_impressum());
    if (isRTL) {
        menu.classList.add('justify-end');
        menu.classList.remove('justify-start');
    } else {
        menu.classList.add('justify-start');
        menu.classList.remove('justify-end');
    }
});
loadJsonAndGenerateTable('../resources/statistic1.json', 'table-container1');
loadJsonAndGenerateTable('../resources/statistic2.json', 'table-container2');

async function loadJsonAndGenerateTable(data, elementId) {
    try {
        const response = await fetch(data);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const dataJson = await response.json();
        const container = document.getElementById(elementId);
        container.appendChild(generateTable(dataJson));
    } catch (error) {
        console.error('Fehler beim Laden der JSON-Datei:', error);
    }
}

function generateTable(data) {
    console.log(data);
    const table = document.createElement('table');
    table.classList.add('border', 'border-colapse', 'w-3/4', 'table-fixed');

    // Kopfzeile erstellen
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    Object.keys(data[0]).forEach(key => {
        const th = document.createElement('th');
        th.appendChild(document.createTextNode(data[0][key]));
        th.classList.add('border', 'border-black', 'p-2');
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Tabelleninhalt erstellen
    const tbody = document.createElement('tbody');
    data.forEach(item => {
        if(item != data[0]){
            const row = document.createElement('tr');
            Object.values(item).forEach(value => {
                const cell = document.createElement('td');
                cell.appendChild(document.createTextNode(value));
                cell.classList.add('border', 'border-black', 'p-2', 'text-center');
                row.appendChild(cell);
            });
            tbody.appendChild(row);
        }
    });
    table.appendChild(tbody);

    return table;
}

