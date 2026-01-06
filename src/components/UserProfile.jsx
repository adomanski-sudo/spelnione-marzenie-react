import React, { useState, useEffect } from 'react';
import './MyProfile.css'; // Używamy tych samych stylów layoutu
import DreamCard from './DreamCard'; 
import { ArrowLeft, Heart, Lock, PiggyBank, Calendar, Users } from 'lucide-react'; 

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

                      <span className="detail-date">{activeDream.date}</span>
                  </div>

                  <h1 className="detail-title">{activeDream.title}</h1>
                  <p className="detail-desc">{activeDream.description}</p>
                  
                  {/* PRZYCISKI GOŚCIA */}
                  {/* --- FOOTER (PRZYCISKI AKCJI) --- */}
                    <div className="detail-footer" style={{
                        marginTop: 'auto',
                        padding: '20px 25px',
                        borderTop: '1px solid #f1f5f9',
                        background: '#f8fafc'
                    }}>
                        
                        {/* SCENARIUSZ 1: WŁAŚCICIEL (Widzi Edycję) */}
                        {isMe ? (
                            <div style={{display: 'flex', gap: '10px'}}>
                                <button 
                                    className="btn-secondary" 
                                    onClick={() => setEditingDream(activeDream)} 
                                    style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}
                                >
                                    <Edit size={18} /> Edytuj
                                </button>
                                <button 
                                    className="btn-secondary" 
                                    style={{flex: 0.4, background: '#fee2e2', color: '#ef4444', borderColor: '#fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                                    onClick={() => handleDelete(activeDream.id)}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ) : (
                            
                        /* SCENARIUSZ 2: GOŚĆ (Widzi przyciski zależne od TYPU) */
                        /* Używamy switcha wewnątrz JSX dla czytelności */
                        (() => {
                            switch (activeDream.type) {
                                
                                // PRZYPADEK A: WSPÓLNY CZAS ⏳
            case 'time':
                return (
                    <div style={{display: 'flex', gap: '10px'}}>
                        <button className="btn-secondary" style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                            <Calendar size={18} /> Rezerwacja
                        </button>
                        <button className="btn-primary" style={{flex: 1, background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                            <Users size={18} /> Ekipa
                        </button>
                    </div>
                );

            // PRZYPADEK B: UŚMIECH 😊
            case 'smile':
                return (
                    <div style={{textAlign: 'center', color: '#eab308', fontWeight: '600', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                        <Smile size={24} />
                        <span>Zawsze mile widziane!</span>
                    </div>
                );

            // PRZYPADEK C: PREZENTY (Pomysł lub Konkret) 🎁
            case 'gift':
            default:
                const isConcrete = activeDream.price_min || activeDream.price_max;
                
                return (
                    <div style={{
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'space-between', // Rozstrzelenie na boki
                        width: '100%',                  // <--- KLUCZ DO SUKCESU! 🔑
                        gap: '10px'
                    }}>
                        
                        {/* LEWA STRONA: CENA */}
                        <div style={{textAlign: 'left'}}> 
                            <div style={{
                                fontSize: '0.7rem', 
                                color: '#64748b', 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.5px',
                                marginBottom: '4px' // Odstęp między etykietą a ceną
                            }}>
                                {isConcrete ? 'Szacowany budżet' : 'Przybliżony koszt'}
                            </div>
                            
                            {/* CENA w nowej linii (div to blok, więc sam spada, ale wymusimy stylami) */}
                            <div style={{
                                fontSize: '1.2rem', 
                                fontWeight: '700', 
                                color: '#0f172a', 
                                lineHeight: '1.1'
                            }}>
                                {isConcrete ? (
                                    formatPrice(activeDream.price_min, activeDream.price_max)
                                ) : (
                                    activeDream.price ? `${activeDream.price} zł` : 'Dowolny'
                                )}
                            </div>
                        </div>

                        {/* PRAWA STRONA: PRZYCISKI */}
                        <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                            <button className="btn-secondary" style={{
                                padding: '8px 16px', 
                                display: 'flex', alignItems: 'center', gap: '6px', 
                                fontSize: '0.9rem', whiteSpace: 'nowrap' // Żeby tekst nie spadał
                            }}>
                                <Lock size={16} /> 
                                <span className="hide-on-very-small">Zarezerwuj</span>
                            </button>
                            
                            <button className="btn-primary" style={{
                                padding: '8px 16px', 
                                background: '#ec4899', 
                                display: 'flex', alignItems: 'center', gap: '6px', 
                                fontSize: '0.9rem', whiteSpace: 'nowrap'
                            }}>
                                <PiggyBank size={16} /> 
                                <span className="hide-on-very-small">Zrzutka</span>
                            </button>
                        </div>
                    </div>
                );
                            }
                        })()
                        )}
                    </div>
               </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}