import React, { useState } from 'react'; // Dodajemy useState
import './MyProfile.css';
import DreamCard from './DreamCard'; 
import avatarImg from '../assets/avatar.jpg'; 
import { Edit3, Plus, ArrowLeft, Sparkles } from 'lucide-react'; // Ikona strzałki powrotu

export default function MyProfile({ dreams, userData }) {
  
  // 1. STAN LOKALNY: Które marzenie oglądamy? (null = widok listy)
  const [activeDream, setActiveDream] = useState(null);

  return (
    <div className="profile-split-view">
      
      {/* LEWA KOLUMNA (BIO) - Zawsze widoczna */}
      <aside className="bio-column">
        <div className="bio-card">
          <div className="avatar-wrapper">
            <button className="circle-action-btn edit-btn">
              <Edit3 size={18} />
              <span className="btn-label">Edytuj</span>
            </button>
            <img src={avatarImg} alt="Profil" className="bio-avatar" />
            <button className="circle-action-btn add-btn">
               <Plus size={22} />
               <span className="btn-label">Dodaj marzenie</span>
            </button>
          </div>
          
          <h2 className="bio-name">
            {userData ? `${userData.first_name} ${userData.last_name}` : "Ładowanie..."}
          </h2>
          <div className="bio-content-wrapper">
            <p className="bio-text">
              {userData ? (
                `${userData.description}`
              ) : (
                "Wczytywanie profilu..."
              )}
            </p>
          </div>
        </div>
      </aside>

      {/* PRAWA KOLUMNA - ZMIENNA TREŚĆ */}
      <main className="dreams-column">
        
        {/* WARUNEK: Jeśli NIE MA wybranego marzenia -> Pokaż siatkę (LISTA) */}
        {!activeDream ? (
          <div className="dreams-grid-compact fade-in">
              {dreams.map(dream => (
                  <div 
                    key={dream.id} 
                    onClick={() => setActiveDream(dream)} // Kliknięcie wchodzi w szczegóły
                    style={{ cursor: 'pointer' }}
                  >
                      <DreamCard dream={dream} showAuthor={false} />
                  </div>
              ))}
          </div>
        ) : (
          
          /* WARUNEK: Jeśli JEST wybrane marzenie -> Pokaż SZCZEGÓŁY */
          <div className="dream-detail-view fade-in">
            
            {/* Przycisk powrotu */}
            <button className="btn-back" onClick={() => setActiveDream(null)}>
              <ArrowLeft size={20} /> Wróć do listy
            </button>

            {/* Karta szczegółów (Wielki kafel) */}
            <div className="detail-card">
               <img src={activeDream.image} alt={activeDream.title} className="detail-image" />
               
               <div className="detail-content">
                  <div className="detail-header">
                     <span className="detail-category">{activeDream.category}</span>
                     <span className="detail-date">{activeDream.date}</span>
                  </div>

                  <h1 className="detail-title">{activeDream.title}</h1>
                  <p className="detail-desc">{activeDream.description}</p>
                  
                  <div className="detail-footer">
                    <button className="btn-primary-large">
                      Zarezerwuj
                    </button>
                    <button className="btn-primary-large2">
                      Zaproponuj zrzutkę 
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