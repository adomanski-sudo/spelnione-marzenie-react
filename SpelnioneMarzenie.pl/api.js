// 

export async function fetchUser() {
    // Pobieramy parametry z paska adresu (np. profil.html?id=1)
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    // Jeśli jest ID, pytamy o konkretnego usera. Jak nie ma, backend domyślnie da id = 1
    const apiUrl = id ? `/api/user?id=${id}` : '/api/user';

    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Błąd pobierania profilu');
    return await response.json();
}

export async function fetchDreams() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    const apiUrl = id ? `/api/dreams?id=${id}` : '/api/dreams';

    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Błąd pobierania marzeń');
    return await response.json();
}