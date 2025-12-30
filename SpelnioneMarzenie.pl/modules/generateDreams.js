// generateDreams.js

export function generateDreams(dreams) {
    const container = document.getElementById("dreams");
    container.style.display = "grid";
    let htmlCode = "";

    if (dreams.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Brak marzeń... jeszcze! ✨</p>';
        return;
    }

    dreams.forEach((dream) => {
        // Klasa dla spełnionego marzenia (tylko wizualna, np. zielona ramka)
        const fulfilledClass = dream.is_fulfilled ? 'fulfilled' : '';
        
        htmlCode += `
        <div class="dream ${fulfilledClass}" 
             id="${dream.dream_id}" 
             style="background-image: url('${dream.image}'); cursor: pointer;"
             onclick="window.triggerDetails('${dream.dream_id}')">
            
            ${dream.is_fulfilled ? '<div style="position:absolute; top:10px; right:10px; background:#27ae60; color:white; padding:5px 10px; border-radius:10px; font-size:12px; font-weight:bold;">SPEŁNIONE</div>' : ''}

            <div class="dream-top-bar">
                <span class="icon">${dream.icon}</span> ${dream.category}
            </div>
            
            <div class="dream-content">
                ${dream.title}
            </div>

            <button class="dream-btn" onclick="window.triggerDetails('${dream.dream_id}')">
                ${dream.is_fulfilled ? 'Zobacz' : 'Spełnij'}
            </button>
            
            </div>
        `;
    });

    container.innerHTML = htmlCode;
}