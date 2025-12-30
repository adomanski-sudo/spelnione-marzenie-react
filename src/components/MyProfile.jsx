import React, { useState } from 'react';
import './MyProfile.css';
import DreamCard from './DreamCard'; 
import avatarImg from '../assets/avatar.jpg'; 
import { Edit3, Plus, ArrowLeft, Trash2, Edit } from 'lucide-react'; 

// Aby wysłać

// Dodajemy setDreams do propsów, żeby móc aktualizować listę
export default function MyProfile({ dreams, setDreams, userData }) {
  
  const [activeDream, setActiveDream] = useState(null);

  // Funkcja musi być W ŚRODKU komponentu, żeby mieć dostęp do 'setDreams'
  const handleDelete = (id) => {
    if (!window.confirm("Czy na pewno chcesz usunąć to marzenie?")) return;

    fetch(`/api/dreams/${id}`, { method: 'DELETE' })
        .then(() => {
            // Aktualizujemy listę w App.jsx
            setDreams(prev => prev.filter(d => d.id !== id));
            // Wracamy do widoku listy
            setActiveDream(null); 
        })
        .catch(err => console.error(err));
  };

  const deleteDream = (id) => {
    if (!window.confirm("Czy na pewno chcesz usunąć to marzenie?")) return;

    // 1. POBIERAMY TOKEN BEZPOŚREDNIO Z LOCAL STORAGE
    // To najbezpieczniejsza metoda w tym momencie
    const storedUser = localStorage.getItem('loggedUser');
    const token = storedUser ? JSON.parse(storedUser).token : null;

    if (!token) {
        alert("Błąd: Nie jesteś zalogowany (brak tokena).");
        return;
    }

    // 2. WYSYŁAMY ŻĄDANIE Z NAGŁÓWKIEM
    fetch(`/api/dreams/${id}`, { 
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token  // <--- Tutaj wkładamy "paszport"
        }
    })
    .then(res => {
        if (res.status === 401) {
            throw new Error("Brak autoryzacji (401). Token nie dotarł.");
        }
        if (res.status === 403) {
            throw new Error("Brak uprawnień (403). To nie Twoje marzenie.");
        }
        if (!res.ok) {
            throw new Error("Wystąpił błąd podczas usuwania.");
        }
        return res.json();
    })
    .then(data => {
        // Sukces - usuwamy z listy na ekranie
        setDreams(prev => prev.filter(d => d.id !== id));
        // Jeśli usunięte marzenie było otwarte w modalu, zamknij je (opcjonalnie)
        // setActiveDream(null); 
        alert("Marzenie usunięte!");
    })
    .catch(err => {
        console.error(err);
        alert(err.message);
    });
};

  return (
    <div className="profile-split-view fade-in">
      
      {/* --- LEWA KOLUMNA (BIO) --- */}
      <aside className="bio-column">
        <div className="bio-card">
          <div className="avatar-wrapper">
            <button className="circle-action-btn edit-btn">
              <Edit3 size={18} />
              <span className="btn-label">Edytuj</span>
            </button>
            <img src={avatarImg} alt="Profil" className="bio-avatar" />
            
            {/* Przycisk dodawania tylko u mnie */}
            <button className="circle-action-btn add-btn">
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

      {/* --- PRAWA KOLUMNA --- */}
      <main className="dreams-column">
        
        {!activeDream ? (
          /* WIDOK LISTY */
          <div className="dreams-grid-compact fade-in">
              {dreams.map(dream => (
                  <div 
                    key={dream.id} 
                    onClick={() => setActiveDream(dream)}
                    style={{ cursor: 'pointer' }}
                  >
                      <DreamCard dream={dream} showAuthor={false} />
                  </div>
              ))}
          </div>
        ) : (
          /* WIDOK SZCZEGÓŁÓW (Twoja nowa wersja) */
          <div className="dream-detail-view fade-in">
            
            <button className="btn-back" onClick={() => setActiveDream(null)}>
              <ArrowLeft size={20} /> Wróć do listy
            </button>

            <div className="detail-card">
               <img src={activeDream.image} alt={activeDream.title} className="detail-image" />
               
               <div className="detail-content">
                  <div className="detail-header">
                      <span className="detail-category">{activeDream.category}</span>
                      <span className="detail-date">{activeDream.date}</span>
                  </div>

                  <h1 className="detail-title">{activeDream.title}</h1>
                  <p className="detail-desc">{activeDream.description}</p>
                  
                  {/* PRZYCISKI WŁAŚCICIELA */}
                  <div className="detail-footer">
                    <button className="btn-primary-large" style={{background: '#f1f5f9', color: '#334155'}}>
                      <Edit size={20} style={{marginRight: '8px'}}/> Edytuj
                    </button>
                    <button 
                        className="btn-primary-large2" 
                        style={{background: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca'}}
                        onClick={() => handleDelete(activeDream.id)}
                    >
                      <Trash2 size={20} style={{marginRight: '8px'}}/> Usuń
                    </button>
                  </div>
               </div>
            </div>

          </div>
        )}

      </main>

    </div>
  );
}