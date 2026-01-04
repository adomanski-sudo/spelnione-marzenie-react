import React, { useState } from 'react';
import './MyProfile.css';
import DreamCard from './DreamCard'; 
import EditProfile from './EditProfile'; 
import AddDreamForm from './AddDreamForm'; 
import EditDreamForm from './EditDreamForm';
import avatarImg from '../assets/avatar.jpg'; 
import { Edit3, Plus, ArrowLeft, Trash2, Edit } from 'lucide-react'; 

// Dodajemy onUpdateUser do propsów
export default function MyProfile({ dreams, setDreams, userData, onUpdateUser }) {
  
  const [activeDream, setActiveDream] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Czy edytujemy?
  const [isAdding, setIsAdding] = useState(false); // Czy dodajemy marzenie?
  const [isEditingDream, setIsEditingDream] = useState(false); // Edycja marzenia

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
            price: item.price,
            type: item.type
        }));

        // Filtrujemy, żeby pokazać tylko MOJE marzenia
        if (userData) {
            const myOnly = formatted.filter(d => d.userId === userData.id);
            setDreams(myOnly);
        }
    });
};

  // --- POPRAWIONA FUNKCJA (Z TOKENEM) ---
  const handleAddDream = (newDreamData) => {
    
    // 1. POBIERZ TOKEN (Tego brakowało!)
    const storedUser = localStorage.getItem('loggedUser');
    const token = storedUser ? JSON.parse(storedUser).token : null;

    if (!token) {
        alert("Błąd: Nie jesteś zalogowany (brak tokena).");
        return;
    }

    fetch('/api/dreams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 👇 TEJ LINIJKI BRAKUJE U CIEBIE:
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(newDreamData),
    })
    .then(res => {
      if (!res.ok) {
        if (res.status === 401) throw new Error("Brak autoryzacji (401)");
        throw new Error("Błąd serwera");
      }
      return res.json();
    })
    .then(data => {
      console.log("Sukces!", data);
      refreshDreams(); 
      setIsAdding(false); 
    })
    .catch(err => {
      console.error("Błąd:", err);
      alert("Nie udało się dodać marzenia. Sprawdź konsolę.");
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
      <main className="dreams-column">
        
        {/* SCENARIUSZ 1: DODAWANIE MARZENIA */}
        {isAdding ? (
            <AddDreamForm 
                onAdd={handleAddDream}
                onCancel={() => setIsAdding(false)} 
                onSuccess={() => {
                    refreshDreams();    
                    setIsAdding(false); 
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

        ) : isEditingDream && activeDream ? (
         <EditDreamForm 
            dreamData={activeDream}
            onCancel={() => setIsEditingDream(false)} // Powrót do szczegółów
            onSuccess={(updatedDream) => {
                // 1. Aktualizujemy widok szczegółów (activeDream)
                setActiveDream(updatedDream);
                // 2. Aktualizujemy listę w tle (dreams)
                setDreams(prev => prev.map(d => d.id === updatedDream.id ? updatedDream : d));
                // 3. Zamykamy formularz
                setIsEditingDream(false);
            }}
         />

        /* SCENARIUSZ 3: SZCZEGÓŁY MARZENIA */
        ) : activeDream ? (
          
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
                  
                  {/* --- CENA (Tylko dla typu 'gift') --- */}



                  <div className="detail-footer">
                    <button 
                      className="btn-primary-large" 
                      style={{background: '#f1f5f9', color: '#334155'}}
                      onClick={() => setIsEditingDream(true)}
                    >
                      <Edit size={20} style={{marginRight: '8px'}}/> Edytuj
                    </button>
                    
                    {/* Przycisk Usuń */}
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

        /* SCENARIUSZ 4: LISTA MARZEŃ */
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