import React, { useState } from 'react';
import './MyProfile.css';
import DreamCard from './DreamCard'; 
import EditProfile from './EditProfile'; // <--- IMPORTUJEMY TUTAJ
import AddDreamForm from './AddDreamForm'; // Nowy komponent
import avatarImg from '../assets/avatar.jpg'; 
import { Edit3, Plus, ArrowLeft, Trash2, Edit } from 'lucide-react'; 

// Dodajemy onUpdateUser do propsów
export default function MyProfile({ dreams, setDreams, userData, onUpdateUser }) {
  
  const [activeDream, setActiveDream] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // <--- NOWY STAN: Czy edytujemy?
  const [isAdding, setIsAdding] = useState(false); // Czy dodajemy marzenie?

  const refreshDreams = () => {
    fetch('/api/dreams')
    .then(res => res.json())
    .then(data => {
        // Formatujemy dane tak jak w App.jsx
        const formatted = data.map(item => ({
            id: item.id,
            userId: item.idUser, // Ważne do filtrowania!
            title: item.title,
            description: item.description,
            category: item.category,
            date: new Date(item.date).toLocaleDateString(),
            image: item.image,
            price: item.price
        }));

        // Filtrujemy, żeby pokazać tylko MOJE marzenia
        if (userData) {
            const myOnly = formatted.filter(d => d.userId === userData.id);
            setDreams(myOnly);
        }
    });
};

  const handleDelete = (id) => {
    if (!window.confirm("Czy na pewno chcesz usunąć to marzenie?")) return;

    const storedUser = localStorage.getItem('loggedUser');
    const token = storedUser ? JSON.parse(storedUser).token : null;

    if (!token) { alert("Błąd: Brak tokena."); return; }

    fetch(`/api/dreams/${id}`, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': token }
    })
    .then(res => {
        if (!res.ok) throw new Error("Błąd usuwania");
        return res.json();
    })
    .then(() => {
        setDreams(prev => prev.filter(d => d.id !== id));
        setActiveDream(null); 
        alert("Marzenie usunięte!");
    })
    .catch(err => alert(err.message));
  };

  return (
    <div className="profile-split-view fade-in">
      
      {/* --- LEWA KOLUMNA (BIO) --- */}
      <aside className="bio-column">
        <div className="bio-card">
          <div className="avatar-wrapper">
            
            {/* PRZYCISK EDYTUJ - Teraz włącza tryb edycji! */}
            <button 
                className="circle-action-btn edit-btn"
                onClick={() => {
                    setIsEditing(true);   // Włącz edycję
                    setActiveDream(null); // Wyłącz szczegóły marzenia (jeśli były otwarte)
                }}
            >
              <Edit3 size={18} />
              <span className="btn-label">Edytuj</span>
            </button>

            <img src={userData?.image || avatarImg} alt="Profil" className="bio-avatar" />
            
            <button className="circle-action-btn add-btn"
            onClick={() => {
              setIsAdding(true);      // Włączamy dodawanie
              setIsEditing(false);    // Wyłączamy edycję profilu
              setActiveDream(null);   // Wyłączamy szczegóły marzenia
              }}>
               <Plus size={22} />
               <span className="btn-label">Dodaj</span>
            </button>
          </div>
          
          <h2 className="bio-name">
            {userData ? `${userData.first_name} ${userData.last_name}` : "Ładowanie..."}
          </h2>
          <div className="bio-content-wrapper">
            <p className="bio-text">
              {userData ? userData.description : "Wczytywanie profilu..."}
            </p>
          </div>
        </div>
      </aside>

      {/* --- PRAWA KOLUMNA (Dynamiczna zawartość) --- */}
      {/* ... wewnątrz return ... */}
      <main className="dreams-column">

      {/* SCENARIUSZ 1: DODAWANIE MARZENIA (Priorytet) */}
      {isAdding ? (
        <AddDreamForm 
            onCancel={() => setIsAdding(false)} 
            onSuccess={() => {
                refreshDreams();    // Odśwież listę
                setIsAdding(false); // Wróć do listy
            }}
        />

      /* SCENARIUSZ 2: EDYCJA PROFILU */
      ) : isEditing ? (
        <div className="fade-in">
            <button className="btn-back" onClick={() => setIsEditing(false)} style={{marginBottom: '15px'}}>
                <ArrowLeft size={20} /> Anuluj edycję
            </button>
            <EditProfile 
                currentUser={userData} 
                onUpdateUser={(updatedData) => {
                    onUpdateUser(updatedData);
                    setIsEditing(false);
                }}
            />
        </div>

      /* SCENARIUSZ 3: SZCZEGÓŁY MARZENIA */
      ) : activeDream ? (
         /* ... (Twój stary kod szczegółów bez zmian) ... */
         <div className="dream-detail-view fade-in">
            {/* ... kod szczegółów ... */}
         </div>

      /* SCENARIUSZ 4: LISTA MARZEŃ (Domyślny) */
      ) : (
         <div className="dreams-grid-compact fade-in">
             {dreams && dreams.length > 0 ? (
                dreams.map(dream => (
                  <div 
                    key={dream.id} 
                    onClick={() => setActiveDream(dream)}
                    style={{ cursor: 'pointer' }}
                  >
                      <DreamCard dream={dream} showAuthor={false} />
                  </div>
                ))
             ) : (
                <div style={{textAlign: 'center', padding: '40px', color: '#94a3b8'}}>
                   <p>Nie masz jeszcze marzeń na liście.</p>
                   <p>Kliknij "+" żeby dodać pierwsze!</p>
                </div>
             )}
          </div>
        )}

      </main>

    </div>
  );
}