document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Zatrzymaj przeładowanie strony!

    // Zbieramy dane z pól
    const firstName = document.getElementById('fname').value;
    const lastName = document.getElementById('lname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('pass').value;
    
    const msgBox = document.getElementById('message');
    msgBox.style.color = 'gray';
    msgBox.innerText = 'Przetwarzanie...';

    try {
        // Wysłanie do API api/register.js
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password
            })
        });

        const data = await res.json();

        // Obsługa odpowiedzi
        if (res.ok) {
            msgBox.style.color = 'green';
            msgBox.innerText = 'Sukces! Przekierowanie do logowania...';
            
            // Czekamy 2 sekundy i przenosimy do logowania
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            // Np. "Taki użytkownik już istnieje"
            msgBox.style.color = 'red';
            msgBox.innerText = data.error || 'Wystąpił błąd.';
        }

    } catch (err) {
        console.error(err);
        msgBox.style.color = 'red';
        msgBox.innerText = 'Błąd połączenia z serwerem.';
    }
});