/**
 * Bestimmung der Browsersprache des Besuchenden
 * @type {string}
 */
const userLanguage = navigator.language || navigator.languages[0];

/**
 * Liste der Sprachen die RTL (Right to left) verwenden
 * @type {string[]}
 */
const rtlLanguages = ['ar', 'he', 'fa', 'ur']; // Liste der RTL-Sprachen

/**
 * Prüft, ob die Browsersprache des Benutzers eine RTL-Sprache ist
 * @type {boolean}
 */
const isRTL = rtlLanguages.includes(userLanguage.split('-')[0]);

/**
 *Navigiert zur datenschutz.html Seite
 */
function wechsel_zu_datenschutz(){
    window.location.href="datenschutz.html";
}

/**
 * Navigiert zur impressum.html Seite
 */
function wechsel_zu_impressum(){
    window.location.href="impressum.html";
}

/**
 * Verarbeitet die Seitenausrichtung basierend auf der Browsersprache des Benutzers
 * Fügt Event-Listener für die Datenschutz- und Impressum-Buttons hinzu
 */
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

// Lädt JSON-Daten und erstellt eine Tabelle für jeden Container
loadJsonAndGenerateTable('../resources/statistic1.json', 'table-container1');
loadJsonAndGenerateTable('../resources/statistic2.json', 'table-container2');

/**
 * Lädt JSON-Daten und generiert eine Tabelle in eime spezifischen Container
 * @param {string} data - Pfad zur JSON-Datei
 * @param {string} elementId - ID des HTML-Elements, welches in die Tabelle eingefügt werden soll
 */
async function loadJsonAndGenerateTable(data, elementId) {
    let jsonData = await loadJson(data)
    const container = document.getElementById(elementId);
    container.classList.add('flex', 'flex-col', 'w-full', 'space-y-2', 'items-center')

    appendTableWithFilter(jsonData, elementId);
    container.appendChild(generateTable(jsonData, elementId));
}

/**
 * Lädt eine JSOn-Datei asynchron
 * @param {string} dataPath - Pfad zur JSON-Datei
 * @returns {Promise<Object[]>} - Promise, das die JSON-Datei als Array von Objekten zurückgibt
 * @throws {error} - Wirft einen Fehler, wenn die Datei nicht geladen werden kann
 */
async function loadJson(dataPath) {
    try {
        const response = await fetch(dataPath);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();

    } catch (error) {
        console.error('Fehler beim Laden der JSON-Datei:', error);
    }
}

/**
 * Fügt ein Eingabefeld zur Filterung der Tabellendaten hinzu
 * @param {Object[]} jsonData - JSON-Daten, aus denen die Tabelle erstellt wird
 * @param {string} elementId - ID des HTML-Elements, in das die Tabelle eingefügt wird
 */
function appendTableWithFilter(jsonData, elementId) {
    const container = document.getElementById(elementId);
    const filterInput = document.createElement('input');

    filterInput.classList.add('w-auto', 'mt-4', 'placeholder-gray-500', 'p-2');
    filterInput.setAttribute('placeholder', 'Filter nach ' + jsonData[0][0]);
    filterInput.addEventListener("input", (event) => {regenerateTable(jsonData, elementId, filterInput.value)});
    container.appendChild(filterInput);
}

/**
 * Erstellt die Tabelle basierend auf den Sortier- und Filterkriterien neu
 * @param {Object[]} jsonData - JSON-Daten, aus denen die Tabelle ersellt wird
 * @param {string} elementId - ID des HTML-Elements, in das die Tabelle eingefügt wird
 * @param [filteredData=''] - Filtertext, nach dem die Tabelle gefiltert werden soll
 * @param [sorted=undefined] - Die Richtung der Sortierung ('asc', 'desc')
 * @param [columnIndex=0] - Die Spalte, nach der sortiert werden soll
 */
function regenerateTable(jsonData, elementId, filteredData = '', sorted = undefined, columnIndex = 0) {
    const container = document.getElementById(elementId);
    const existingTable = container.querySelector('table');
    const noResultsMessage = document.getElementById("noResultsP" + elementId);

    if (existingTable) {
        existingTable.remove();
    }
    if (noResultsMessage) {
        noResultsMessage.remove();
    }

    const newTable = generateTable(jsonData, elementId, sorted, filteredData, columnIndex);
    container.appendChild(newTable);
}

/**
 * Sortiert die Daten in aufsteigender Reihenfolge
 * @param {Array} a - Das erste Element zum Vergleich
 * @param {Array} b - Das zweite Element zum Vergleich
 * @param {number} columnIndex - Die Spalte, nach der sortiert werden soll
 * @returns {number} - Ein negativer Wert, wenn `a` kleiner als `b` ist; ein positiver Wert, wenn `a` größer als `b` ist; 0, wenn sie gleich sind
 */
function sortAsc(a, b, columnIndex) {
    if (typeof a[columnIndex] === 'string' && typeof b[columnIndex] === 'string') {
        return a[columnIndex].localeCompare(b[columnIndex]);
    } else {
        return a[columnIndex] - b[columnIndex];
    }
}

/**
 * Sortiert die Daten in absteigender Reihenfolge
 * @param {Array} a - Das erste Element zum Vergleich
 * @param {Array} b - Das zweite Element zum Vergleich
 * @param {number} columnIndex - Die Spalte, nach der sortiert werden soll
 * @returns {number} - Ein negativer Wert, wenn `a` größer als `b` ist; ein positiver Wert, wenn `a` kleiner als `b` ist; 0, wenn sie gleich sind
 */
function sortDesc(a, b, columnIndex) {
    if (typeof a[columnIndex] === 'string' && typeof b[columnIndex] === 'string') {
        return b[columnIndex].localeCompare(a[columnIndex]);
    } else {
        return b[columnIndex] - a[columnIndex];
    }
}

/**
 * Erstellt die Tabelle basierend auf den JSON-Daten
 * @param {Object[]} jsonData - Die JSON-Daten, aus denen die Tabelle erstellt wird
 * @param {string} elementId - Die ID des HTML-Elements, in das die Tabelle eingefügt wird
 * @param {string} [sorted=undefined] - Die Richtung der Sortierung ('asc', 'desc')
 * @param {string} [filteredData=''] - Der Filtertext, nach dem die Tabelle gefiltert werden soll
 * @param {number} [columnIndex=0] - Die Spalte, nach der sortiert werden soll
 * @returns {HTMLElement} - Das generierte Tabellen-Element
 */
function generateTable(jsonData, elementId, sorted = undefined, filteredData = '', columnIndex = 0) {
    const table = document.createElement('table');
    table.classList.add('border', 'border-collapse', 'w-3/4', 'table-fixed');

    // Kopfzeile erstellen
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // Erstelle die Header-Zeile basierend auf der ersten Zeile der JSON-Daten
    const headers = jsonData[0];
    Object.keys(headers).forEach((key, index) => {
        const th = document.createElement('th');
        th.appendChild(document.createTextNode(headers[index]));
        th.classList.add('border', 'border-black', 'p-2');

        let sortButton = document.createElement('button');
        sortButton.id = elementId + 'sortButton' + index;
        sortButton.classList.add('pl-3');

        if (sorted === 'asc' && columnIndex === index) {
            sortButton.textContent = "↑";
            sortButton.addEventListener("click", () => regenerateTable(jsonData, elementId, filteredData, 'desc', index));
        } else if (sorted === 'desc' && columnIndex === index) {
            sortButton.textContent = "↓";
            sortButton.addEventListener("click", () => regenerateTable(jsonData, elementId, filteredData, 'none', index));
        } else {
            sortButton.textContent = "⇅";
            sortButton.addEventListener("click", () => regenerateTable(jsonData, elementId, filteredData, 'asc', index));
        }
        th.appendChild(sortButton);
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Tabelleninhalt erstellen
    const tbody = document.createElement('tbody');

    // Entfernen der Kopfzeile aus den Daten
    let sortedData = jsonData.slice(1);

    // Sortiert die Daten nach der angegebenen Richtung und Spalte
    if (sorted === 'asc') {
        sortedData.sort((a, b) => sortAsc(a, b, columnIndex));
    } else if (sorted === 'desc') {
        sortedData.sort((a, b) => sortDesc(a, b, columnIndex));
    }

    // Filtern und Befüllen des Inhalts
    sortedData.forEach(item => {
        if (typeof item[columnIndex] === 'string' && item[columnIndex].toLowerCase().includes(filteredData.toLowerCase())) {
            const row = document.createElement('tr');
            Object.values(item).forEach(value => {
                const cell = document.createElement('td');
                cell.appendChild(document.createTextNode(value));
                cell.classList.add('border', 'border-black', 'p-2', 'text-center');
                row.appendChild(cell);
            });
            tbody.appendChild(row);
        } else if (typeof item[columnIndex] === 'number' && item[columnIndex].toString().includes(filteredData)) {
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

    // Wenn der Tabellenkörper leer ist, wird eine Meldung "Keine Ergebnisse gefunden" erstellt und zurückgegeben
    if (tbody.children.length === 0) {
        let noResultsMessage = document.createElement('p');
        noResultsMessage.textContent = "Es wurden keine Ergebnisse gefunden!";
        noResultsMessage.id = "noResultsP" + elementId;
        return noResultsMessage;
    }

    table.appendChild(tbody);

    return table;
}
