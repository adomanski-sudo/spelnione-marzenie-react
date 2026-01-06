import React, { useState, useEffect } from 'react';
import './MyProfile.css'; // Używamy tych samych stylów layoutu
import DreamCard from './DreamCard'; 
import { ArrowLeft, Heart, Lock, PiggyBank } from 'lucide-react'; 

export default function UserProfile({ userId, currentUser, friends }) {
  const [userData, setUserData] = useState(null);
  const [dreams, setDreams] = useState([]);
  const [activeDream, setActiveDream] = useState(null);
  const isAlreadyFriend = friends?.some(friend => friend.id == userId);
  const isMe = currentUser?.id == userId;

  // --- HELPER DO ROZPOZNAWANIA TYPU MARZENIA ---
  const getDreamTypeInfo = (dream) => {
    switch (dream.type) {
      case 'time':
        return { label: 'Wspólny czas', color: '#3b82f6', icon: '⏳' }; // Niebieski
      
      case 'smile':
        return { label: 'Zawsze wywołuje uśmiech', color: '#eab308', icon: '😊' }; // Żółty/Złoty
      
      case 'gift':
        // Jeśli nie ma określonej ceny lub jest przedział -> to raczej Pomysł
        if (!dream.price_min && !dream.price_max) {
             return { label: 'Pomysł na prezent', color: '#a855f7', icon: '💡' }; // Fiolet
        }
        // Jeśli jest link do zdjęcia/sklepu ALBO konkretna cena -> Konkret
        return { label: 'Konkretny prezent', color: '#ec4899', icon: '🎁' }; // Różowy

      default:
        return { label: 'Marzenie', color: '#64748b', icon: '✨' }; // Szary
    }
  };

  // Funkcja pomocnicza do formatowania ceny
    const formatPrice = (min, max) => {
        if (min === null && max === null) return null;
        if (min !== null && max === null) return `powyżej ${min} zł`;
        if (min === 0 && max !== null) return `do ${max} zł`;
        if (min === max) return `${min} zł`; // Jeśli konkretna cena
        return `${min} – ${max} zł`;
    };

  // Pobieranie danych usera
  useEffect(() => {
    fetch(`/api/users/${userId}/full`)
      .then(res => res.json())
      .then(data => {
        setUserData(data.user);
        // Formatowanie daty
        const formatted = data.dreams.map(d => ({
            ...d,
            date: new Date(d.date).toLocaleDateString('pl-PL')
        }));
        setDreams(formatted);
      })
      .catch(err => console.error(err));
  }, [userId]);

  if (!userData) return <div style={{padding: '40px', textAlign: 'center'}}>Ładowanie profilu...</div>;

  return (
    <div className="profile-split-view fade-in">
      
      {/* --- LEWA KOLUMNA (BIO - GOŚĆ) --- */}
      <aside className="bio-column">
        <div className="bio-card">
          <div className="avatar-wrapper">
             {/* BRAK PRZYCISKÓW EDYCJI */}
            <img src={userData.image} alt="Profil" className="bio-avatar" />
          </div>
          
          <h2 className="bio-name">
            {userData.first_name} {userData.last_name}
          </h2>
          <div className="bio-content-wrapper">
            <p className="bio-text">
              {userData.description || "Użytkownik nie dodał jeszcze opisu."}
            </p>
          </div>
          
          {/* Przycisk obserwowania */}
          {!isMe && !isAlreadyFriend && (
          <button className="btn-primary-large" style={{marginTop: '20px', width: '100%'}}>
             Zaproś do znajomych <Heart size={20} style={{marginRight: '8px'}}/>
          </button>
          )}
        </div>
      </aside>

      {/* --- PRAWA KOLUMNA --- */}
      <main className="dreams-column">
        
        {!activeDream ? (
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
          <div className="dream-detail-view fade-in">
            
            <button className="btn-back" onClick={() => setActiveDream(null)}>
              <ArrowLeft size={20} /> Wróć do listy marzeń
            </button>

            <div className="detail-card">
               <img src={activeDream.image} alt={activeDream.title} className="detail-image" />
               
               <div className="detail-content">
                  <div className="detail-header">
                      {(() => {
                          const typeInfo = getDreamTypeInfo(activeDream);
                          return (
                              <span 
                                  className="detail-category"
                                  style={{
                                      background: typeInfo.color,
                                      color: 'white',
                                      padding: '5px 12px',
                                      borderRadius: '20px',
                                      fontSize: '0.85rem',
                                      fontWeight: '600',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                  }}
                              >
                                  <span>{typeInfo.icon}</span>
                                  {typeInfo.label}
                              </span>
                          );
                      })()}

                      {/* POPRAWKA: Używamy activeDream zamiast dream */}
                      {activeDream.type === 'gift' && (
                          <div className="dream-price" style={{color: '#64748b', fontSize: '0.9rem', margin: '10px 0'}}>
                              {/* Tu też activeDream! */}
                              {formatPrice(activeDream.price_min, activeDream.price_max)}
                          </div>
                      )}

                      <span className="detail-date">{activeDream.date}</span>
                  </div>

                  <h1 className="detail-title">{activeDream.title}</h1>
                  <p className="detail-desc">{activeDream.description}</p>
                  
                  {/* PRZYCISKI GOŚCIA */}
                  <div className="detail-footer">
                    <button className="btn-primary-large" style={{background: '#e0f2fe', color: '#0284c7'}}>
                      <Lock size={20} style={{marginRight: '8px'}}/> Zarezerwuj
                    </button>
                    <button className="btn-primary-large2" style={{background: '#dcfce7', color: '#16a34a'}}>
                      <PiggyBank size={20} style={{marginRight: '8px'}}/> Zrzutka
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