// Znajdujemy formularz (musimy dodać id="login-form" w HTML!)
const form = document.querySelector('form');
const msgBox = document.createElement('div'); // Małe pudełko na komunikaty błędów
msgBox.style.marginTop = "15px";
msgBox.style.textAlign = "center";
msgBox.style.fontSize = "14px";
form.appendChild(msgBox); // Dodajemy je pod przyciskiem

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Pobieramy dane z inputów
    const emailInput = form.querySelector('input[type="email"]');
    const passInput = form.querySelector('input[type="password"]');

    const email = emailInput.value;
    const password = passInput.value;

    msgBox.style.color = "gray";
    msgBox.innerText = "Logowanie...";

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            msgBox.style.color = "green";
            msgBox.innerText = "Sukces! Witaj " + data.user.first_name;

            // Zapisujemy dane użytkownika w pamięci przeglądarki
            localStorage.setItem('loggedUser', JSON.stringify(data.user));

            // Przekierowanie na stronę główną po 1 sekundzie
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);

        } else {
            msgBox.style.color = "red";
            msgBox.innerText = data.error || "Błąd logowania";
        }

    } catch (err) {
        console.error(err);
        msgBox.style.color = "red";
        msgBox.innerText = "Błąd połączenia.";
    }
});