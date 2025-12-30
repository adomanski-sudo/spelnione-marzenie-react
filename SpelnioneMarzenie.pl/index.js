import jwt from 'jsonwebtoken';
// Bardzo tajne hasło
const SECRET_KEY = process.env.JWT_SECRET;


let appState = {
    users: [], // Pobieramy tylko userów do lewego panelu
    feedQueue: [] // Tu będziemy trzymać pobraną paczkę marzeń
};

async function init() {
    try {
         // 0. Sprawdzenie zalogowania
        checkLoginState();

        // 1. Pobieramy TYLKO listę użytkowników
        const usersRes = await fetch('/api/users');
        
        if (!usersRes.ok) throw new Error("Błąd API");

        appState.users = await usersRes.json();

        // 2. Renderujemy lewą stronę
        renderUserList(appState.users);

        // 3. Uruchamiamy Live Feed (Pytanie serwera co jakiś czas)
        startLiveFeed();

        // 4. Obsługa wyszukiwarki
        document.getElementById('user-search').addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filteredUsers = appState.users.filter(u => 
                u.first_name.toLowerCase().includes(term) || 
                u.last_name.toLowerCase().includes(term)
            );
            renderUserList(filteredUsers);
        });

    } catch (error) {
        console.error(error);
    }
}

// --- FUNKCJA LEWA STRONA ---
function renderUserList(users) {
    const container = document.getElementById('users-list');
    if (users.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#999">Nie znaleziono nikogo :(</p>';
        return;
    }
    let html = '';
    users.forEach(user => {
        html += `
            <a href="profil.html?id=${user.id}" class="user-card">
                <img src="${user.image}" alt="${user.first_name}" class="user-avatar">
                <div class="user-info">
                    <div class="name">${user.first_name} ${user.last_name}</div>
                </div>
            </a>
        `;
    });
    container.innerHTML = html;
}

// --- FUNKCJA PRAWA STRONA: Live Feed ---
function startLiveFeed() {
    // Od razu próbujemy wyświetlić pierwsze marzenie
    processFeedQueue();

    // Ustawiamy interwał co losowy czas
    scheduleNextFeedItem();
}

function scheduleNextFeedItem() {
    const randomTime = Math.floor(Math.random() * 4001) + 2000;
    
    setTimeout(() => {
        processFeedQueue();
        scheduleNextFeedItem(); // Rekurencja (nieskończona pętla)
    }, randomTime);
}

// Główna funkcja zarządzająca kolejką
async function processFeedQueue() {
    // A. Jeśli kolejka jest pusta -> idź do serwera po nową paczkę
    if (appState.feedQueue.length === 0) {
        console.log("Kolejka pusta, pobieram nową paczkę z serwera...");
        await fetchNewBatch();
    }

    // B. Jeśli (nadal) mamy coś w kolejce -> weź pierwsze i wyświetl
    if (appState.feedQueue.length > 0) {
        // .shift() wyciąga pierwszy element z tablicy i go usuwa (jak zdjęcie karty z góry talii)
        const nextDream = appState.feedQueue.shift();
        addFeedItemToDOM(nextDream);
    }
}

// Funkcja pobierająca paczkę z API
async function fetchNewBatch() {
    try {
        const res = await fetch('/api/feed');
        if (!res.ok) return;
        
        const newBatch = await res.json();
        
        // Mieszamy (opcjonalnie, choć SQL RAND() już to zrobił)
        // i dodajemy do naszej kolejki
        appState.feedQueue = newBatch;
        
    } catch (err) {
        console.error("Błąd pobierania paczki:", err);
    }
}

function addFeedItemToDOM(data) {
    const container = document.getElementById('live-feed-list');

    const item = document.createElement('div');
    item.className = 'feed-item'; // Pamiętaj o CSS animacji slideIn!
    item.innerHTML = `
        <img src="${data.user_image}" class="feed-avatar">
        <div class="feed-content">
            <div><strong>${data.first_name}</strong> spełnił(a) marzenie:</div>
            <div class="feed-dream-title">${data.icon || '✨'} ${data.title}</div>
        </div>
        <div class="time-ago">przed chwilą</div>
    `;

    container.prepend(item);

    if (container.children.length > 7) {
        container.removeChild(container.lastChild);
    }
}

function checkLoginState() {
    const container = document.getElementById('auth-container');
    const storedUser = localStorage.getItem('loggedUser');

    if (storedUser) {
        // SCENARIUSZ 1: Użytkownik ZALOGOWANY
        const user = JSON.parse(storedUser);
        
        // ZMIANA: Zamiast <span> z imieniem, tworzymy <a> (link) wyglądający jak przycisk
        container.innerHTML = `
            <a href="profil.html?id=${user.id}" class="auth-btn" style="margin-right: 10px;">
                Moje marzenia
            </a>
            <button id="logout-btn" class="auth-btn">Wyloguj</button>
        `;

        // Obsługa wylogowania
        document.getElementById('logout-btn').addEventListener('click', () => {
            localStorage.removeItem('loggedUser');
            window.location.reload();
        });

    } else {
        // SCENARIUSZ 2: GOŚĆ
        container.innerHTML = `
            <a href="login.html" class="auth-btn">Zaloguj</a>
        `;
    }
}

init();