import { fetchDreams, fetchUser } from './api.js';
import { generateProfil } from './modules/generateProfil.js';
import { generateDreams } from './modules/generateDreams.js';
import { showDreamDetails } from './modules/showDreamDetails.js';

let isOwner = false;

// Stan aplikacji
let appState = {
    user: null,
    dreams: []
};

async function initApp() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        let id = urlParams.get('id');

        // Sprawdzamy, kto jest zalogowany
        const storedUser = localStorage.getItem('loggedUser');
        const loggedUser = storedUser ? JSON.parse(storedUser) : null;

        // Jeśli w URL nie ma ID, a jesteśmy zalogowani -> idź do mojego profilu
        if (!id && loggedUser) {
            id = loggedUser.id;
        }
        
        // --- DETEKCJA WŁAŚCICIELA ---
        // Czy ID profilu == ID zalogowanego?
        if (loggedUser && id == loggedUser.id) {
            isOwner = true;
            // Pokaż przycisk "Dodaj Marzenie"
            document.getElementById('add-dream-btn-container').style.display = 'block';
        }
        // -----------------------------

        // Pobieranie danych
        appState.user = await fetchUser(id); // Przekazujemy ID!
        appState.dreams = await fetchDreams(id); // Przekazujemy ID!

        // Generowanie widoku
        generateProfil(appState.user);
        
        // Przekazujemy flagę isOwner do generatora marzeń!
        generateDreams(appState.dreams, isOwner); 

    } catch (error) {
        console.error(error);
    }
}

// ---------------------------------------------------------
// MOSTY DLA HTML (Globalne funkcje)
// ---------------------------------------------------------

// HTML (onclick) nie widzi modułów.
// Przypinamy funkcję do obieku window. 
// Diabli wiedzą, dlaczego i jak to działa.

window.triggerDetails = (id) => {
    // Przekazujemy ID i całą tablicę marzeń do funkcji szczegółów
    showDreamDetails(id, appState.dreams);
};

// Eksportujemy do window, żeby HTML to widział
window.openDreamModal = () => {
    document.getElementById('dream-modal').style.display = 'flex';
    document.getElementById('modal-title').innerText = "Dodaj Marzenie";
    document.getElementById('dream-form').reset(); // Wyczyść formularz
};

window.closeDreamModal = () => {
    document.getElementById('dream-modal').style.display = 'none';
};

// Placeholder na przyszłe funkcje (żeby nie było błędów w konsoli po kliknięciu)
window.deleteDream = (id) => {
    if(confirm("Czy na pewno chcesz usunąć to marzenie?")) {
        console.log("Usuwam ID:", id);
        // Tu będzie fetch DELETE
    }
};

window.toggleDreamStatus = (id, currentStatus) => {
    console.log("Zmieniam status ID:", id, "na", !currentStatus);
    // Tu będzie fetch UPDATE
};

window.editDream = (id) => {
    console.log("Edytuję ID:", id);
    // Tu otworzymy modal z danymi
};

// Start - pobieranie danych i budowanie obu widoków.
initApp();