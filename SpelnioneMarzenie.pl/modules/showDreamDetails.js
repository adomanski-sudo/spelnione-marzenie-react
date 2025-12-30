// showDreamDetails.js

export function showDreamDetails(dreamId, allDreams) {
    const dream = allDreams.find(d => d.dream_id === dreamId || d.id == dreamId);

    if (!dream) return;

    const container = document.getElementById("dreams");
    
    // Sprawdzanie właściciela
    const storedUser = localStorage.getItem('loggedUser');
    const loggedUser = storedUser ? JSON.parse(storedUser) : null;
    const isOwner = loggedUser && loggedUser.id == dream.idUser;


    // --- BUDOWANIE PRZYCISKÓW ---
    let ownerActions = '';
    let guestActions = '';

    if (isOwner) {
        // Przyciski Właściciela - Na górze po prawej (ikony)
        const statusIcon = dream.is_fulfilled ? "↩️" : "✔️";
        const statusTitle = dream.is_fulfilled ? "Oznacz jako niespełnione" : "Oznacz jako spełnione";
        
        ownerActions = `
            <div class="owner-actions-top">
                <button class="action-btn btn-check" onclick="window.toggleDreamStatus(${dream.id}, ${dream.is_fulfilled})" title="${statusTitle}">${statusIcon}</button>
                <button class="action-btn btn-edit" onclick="window.editDream(${dream.id})" title="Edytuj">✏️</button>
                <button class="action-btn btn-delete" onclick="window.deleteDream(${dream.id})" title="Usuń">🗑️</button>
            </div>
        `;
    } else {
        // Przyciski spełnienia 
        if (!dream.is_fulfilled) {
            guestActions = `
                <div class="guest-actions-bottom">
                    <button class="dream-btn-spelnij" onclick="alert('Spełnij...')">Spełnij</button>
                    <button class="dream-btn-zrzutka" onclick="alert('Zrzutka...')">Zaproponuj zrzutkę</button>
                </div>
            `;
        } else {
            guestActions = `
                <div class="fulfilled-badge-large">
                    To marzenie zostało już spełnione!
                </div>
            `;
        }
    }

    // --- GENEROWANIE WIDOKU (Split Layout) ---
    container.style.display = "block"; // Wyłączamy Grid kafelków
    
    container.innerHTML = `
        <div class="details-wrapper">
            <button class="back-link" onclick="window.location.reload()">← Wróć do listy</button>
            
            <div class="dream-super-card">
                <div class="card-left">
                    <img src="${dream.image}" alt="${dream.title}">
                </div>

                <div class="card-right">
                    ${ownerActions}
                    ${guestActions}

                    <div class="dream-meta">
                        <span class="category-pill">${dream.icon} ${dream.category}</span>
                        ${dream.is_fulfilled ? '<span class="status-pill">Spełnione</span>' : ''}
                    </div>

                    <h2>${dream.title}</h2>
                    
                    <div class="dream-description">
                        ${dream.description}
                    </div>

                    <p class="dream-price">Przybliżona cena: <strong style = "color: #ff5e00ff;">${dream.price}</strong></p>

                </div>
            </div>
        </div>
    `;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}