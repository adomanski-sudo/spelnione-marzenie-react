import React, { useState } from 'react';
import './MyProfile.css';
import DreamCard from './DreamCard'; 
import EditProfile from './EditProfile'; 
import AddDreamForm from './AddDreamForm'; 
import EditDreamForm from './EditDreamForm';
import axios from "axios";
import { Edit3, Plus, ArrowLeft, Trash2, Edit } from 'lucide-react'; 
import DreamModal from './DreamModal'; //

// Dodajemy onUpdateUser do propsów
export default function MyProfile({ dreams, setDreams, userData, onUpdateUser }) {

  const myDreams = dreams 
    ? dreams.filter(d => d.userId === userData?.id) 
    : [];
  
  const [activeDream, setActiveDream] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Czy edytujemy?
  const [isAdding, setIsAdding] = useState(false); // Czy dodajemy marzenie?
  const [isEditingDream, setIsEditingDream] = useState(false); // Edycja marzenia

  // --- ODSWIEŻANIE (Lokalne) ---
  const refreshDreams = () => {
    axios.get('/api/dreams', { withCredentials: true })
      .then((res) => {
        const data = res.data;
        const formatted = data.map((item) => {
          // Zabezpieczenie daty
          let safeDate = item.date;
          if (safeDate && safeDate.includes('T')) {
             safeDate = safeDate.replace('T', ' ').split('.')[0];
          }

          return {
            id: item.id,
            userId: item.idUser,
            title: item.title,
            description: item.description,
            image: item.image,
            date: safeDate,
            type: item.type,
            price_min: item.price_min,
            price_max: item.price_max,
            is_public: item.is_public,
            
            // Dane autora
            first_name: item.first_name,
            last_name: item.last_name,
            userImage: item.user_avatar
          };
        });

        setDreams(formatted); 
      })
      .catch((err) => {
        console.error("Błąd odświeżania listy:", err);
      });
  };

  // Prosta funkcja sukcesu
const handleSuccess = () => {
    setIsAdding(false); // Zamknij modal
    refreshDreams();    // Odśwież listę (masz tę funkcję w linii 18)
};

  const handleDelete = async (id) => {
    if (!window.confirm("Czy na pewno chcesz usunąć to marzenie?")) return;

    try {
      // AXIOS z obsługą ciasteczek
      await axios.delete(`http://localhost:3000/api/dreams/${id}`, {
        withCredentials: true // <--- KLUCZ
      });

      // Aktualizujemy stan lokalnie
      setDreams((prev) => prev.filter((d) => d.id !== id));
      setActiveDream(null); // Jeśli usunięto aktywne marzenie, czyścimy podgląd
      alert("Marzenie usunięte!");

    } catch (err) {
      console.error("Błąd usuwania:", err);
      // Obsługa błędów
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          alert("Sesja wygasła. Zaloguj się ponownie.");
      } else {
          alert("Nie udało się usunąć marzenia.");
      }
    }
  };

  const handleEditClick = (dream) => {
      //  Przełącza widok na formularz edycji
      setIsEditing(true);
      // Modal sam zniknie, bo w renderowaniu warunkowym EditForm ma priorytet
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
            <div className="form-container fade-in">
                <AddDreamForm 
                    onAdd={() => { setIsAdding(false); refreshDreams(); }} 
                    onCancel={() => setIsAdding(false)} 
                />
            </div>

        /* SCENARIUSZ 2: EDYCJA PROFILU */
        ) : 
        isEditing && activeDream ? (
            <div className="form-container fade-in">
                <EditDreamForm 
                    dream={activeDream}
                    onUpdate={() => { 
                        setIsEditing(false); 
                        // Nie czyścimy activeDream, żeby wrócić do widoku szczegółów (opcjonalnie)
                        // Ale dla bezpieczeństwa wróćmy do listy lub odświeżmy szczegóły:
                        setActiveDream(null); 
                        refreshDreams(); 
                    }}
                    onCancel={() => setIsEditing(false)}
                />
            </div>

        ) : isEditingDream && activeDream ? (
         <EditDreamForm 
            dream={activeDream}
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
            onUpdate={() => {
                 refreshDreams();      // 1. Pobierz nowe dane z serwera
                 setIsEditing(false);  // 2. Zamknij formularz edycji!
                setActiveDream(null);
             }}
         />

        /* SCENARIUSZ 3: SZCZEGÓŁY MARZENIA */
        ) : activeDream ? (
            <div className="form-container fade-in">
                 <DreamModal 
                    dream={activeDream}
                    onClose={() => setActiveDream(null)}
                    isOwner={true}
                    onEdit={handleEditClick}
                    onDelete={handleDelete}
                    isInline={true}
                    showAuthor={false}
                 />
            </div>

        /* SCENARIUSZ 4: LISTA MARZEŃ */
        ) : (
          <>
                <div className="dreams-grid-compact fade-in">
                    {myDreams && myDreams.length > 0 ? (
                        myDreams.map((dream) => (
                            <div 
                                key={dream.id} 
                                onClick={() => setActiveDream(dream)} 
                                style={{ cursor: 'pointer', height: '100%' }}
                            >
                            <DreamCard 
                              dream={dream} 
                              showAuthor={false} 
                                />
                            </div>
                        ))
                    ) : (
                        <p className="empty-state">Nie masz jeszcze żadnych marzeń.</p>
                    )}
                </div>
            </>
        )}

      </main>

    </div>
  );
}