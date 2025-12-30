export function generateProfil(user) {
    const imageEl = document.getElementById('profil-image');
    const nameEl = document.getElementById('profil-name');
    const descEl = document.getElementById('profil-descript');

    // Ustawiamy zdjęcie (style inline, tak jak w kafelkach)
    // Jeśli w CSS masz background-image, nadpiszemy go tutaj
    imageEl.style.backgroundImage = `url('${user.image}')`;

    // Ustawiamy Imię i Nazwisko (z łamaniem linii <br>)
    nameEl.innerHTML = `${user.first_name} <br> ${user.last_name}`;

    // Ustawiamy opis
    descEl.innerText = user.description;
}