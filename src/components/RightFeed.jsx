import React, { useState, useEffect, useRef } from 'react';
import './RightFeed.css';
import { EyeOff } from 'lucide-react';

export default function RightFeed() {

  // Wyłączam na chwilę, bo sypie błędami.
  return (
    <div className="dreams-column">
       <div style={{padding: '20px', textAlign: 'center', color: '#cbd5e1'}}>
          🚧 Przebudowa systemu...
       </div>
    </div>
  );





  const [activities, setActivities] = useState([]);
  const [dataPool, setDataPool] = useState([]); // Pula wszystkich pobranych marzeń/użytkowników
  
  // Ref potrzebny, aby setTimeout widział aktualny stan
  const activitiesRef = useRef([]);
  activitiesRef.current = activities;

  // 1. Pobieramy dane na start (to nasza baza do losowania)
  useEffect(() => {
    fetch('/api/feed')
      .then(res => {
          if (!res.ok) {
              throw new Error("Błąd serwera"); // Rzucamy błąd, jeśli status to 500
          }
          return res.json();
      })
      .then(data => {
          // DODATKOWE ZABEZPIECZENIE:
          // Upewniamy się, że to co przyszło, to faktycznie tablica
          if (Array.isArray(data)) {
              setDataPool(data);
              setActivities(data);
          } else {
              console.error("RightFeed otrzymał dziwne dane:", data);
              setActivities([]); // Jak śmieci, to czyścimy
              setDataPool([]);
          }
      })
      .catch(err => {
          console.error("Błąd pobierania feedu:", err);
          setActivities([]); // W razie błędu - pusta lista, a nie crash
          setDataPool([]);
      });
  }, []);

  // 2. Generator Zdarzeń (Pętla nieskończona)
  useEffect(() => {
    let timeoutId;

    const scheduleNextEvent = () => {
      // Losowy czas: od 2s do 6s
      const randomTime = Math.random() * (6000 - 2000) + 2000;
      
      timeoutId = setTimeout(() => {
        addRandomEvent();
        scheduleNextEvent(); // Zaplanuj kolejne
      }, randomTime);
    };

    // Startujemy pętlę tylko jeśli mamy z czego losować
    if (dataPool.length > 0) {
      scheduleNextEvent();
    }

    return () => clearTimeout(timeoutId);
  }, [dataPool]); 

  // --- LOGIKA MIESZANA ---
  const addRandomEvent = () => {
    if (dataPool.length === 0) return;

    // 1. Wybieramy losowy element z bazy (marzenie + user)
    const randomItem = dataPool[Math.floor(Math.random() * dataPool.length)];
    
    // 2. Rzut monetą: Czy to tajne zdarzenie (40%), czy zwykłe (60%)?
    const isSecretEvent = Math.random() > 0.6; 

    let newEvent = {
        id: Date.now() + Math.random(), // Unikalne ID
        first_name: randomItem.first_name,
        last_name: randomItem.last_name,
        userImage: randomItem.userImage,
        date: new Date().toISOString(), // Data: TERAZ
    };

    if (isSecretEvent) {
        // --- SCENARIUSZ A: TAJEMNICA ---
        const secretTypes = [
            { text: "zarezerwował(a) marzenie", icon: "🤫" },
            { text: "zaproponował(a) zrzutkę", icon: "💰" },
            { text: "dołączył(a) do zrzutki", icon: "🤝" }
        ];
        const randomType = secretTypes[Math.floor(Math.random() * secretTypes.length)];
        
        newEvent.is_secret = true;
        newEvent.secret_text = randomType.text;
        newEvent.secret_icon = randomType.icon;
        
    } else {
        // --- SCENARIUSZ B: RECYKLING MARZENIA (Dodał/Spełnił) ---
        // Udajemy, że to marzenie z bazy zostało dodane/spełnione w tej sekundzie
        newEvent.is_secret = false;
        newEvent.title = randomItem.title;
        newEvent.is_fulfilled = randomItem.is_fulfilled;
    }

    // Dodajemy na górę listy i trzymamy max 10 elementów
    setActivities(prev => [newEvent, ...prev].slice(0, 10));
  };

  const timeAgo = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const seconds = Math.floor((now - date) / 1000);
      
      if (seconds < 5) return "teraz";
      if (seconds < 60) return seconds + " s temu";
      
      let interval = seconds / 3600;
      if (interval > 1) return Math.floor(interval) + " godz. temu";
      interval = seconds / 60;
      if (interval > 1) return Math.floor(interval) + " min temu";
      return "przed chwilą";
  };

  return (
    <aside className="right-feed fade-in">
      <h3 className="feed-header">TO SIĘ DZIEJE TERAZ</h3>
      {activities.length > 0 ? (
      <div className="feed-list">
        {activities.map(item => (
          <div key={item.id} className={`feed-item ${item.is_secret ? 'secret-item' : ''}`}>
            
            <img 
                src={item.userImage} 
                alt="Avatar" 
                className="feed-avatar" 
            />
            
            <div className="feed-content">
              {/* --- RENDEROWANIE TAJNE --- */}
              {item.is_secret ? (
                  <>
                    <p className="feed-text">
                        <strong>{item.first_name} {item.last_name && item.last_name[0]}.</strong>
                        {' '}
                        <span style={{color: '#8b5cf6', fontWeight: 600}}>
                            {item.secret_text}
                        </span>
                    </p>
                    <div className="secret-badge">
                        <EyeOff size={14} style={{marginRight: '5px'}}/> 
                        To niespodzianka... {item.secret_icon}
                    </div>
                  </>
              ) : (
              /* --- RENDEROWANIE ZWYKŁE --- */
                  <>
                    <p className="feed-text">
                        <strong>{item.first_name} {item.last_name && item.last_name[0]}.</strong>
                        {' '}
                        {item.is_fulfilled ? (
                            <span style={{color: '#10b981', fontWeight: 600}}>spełnił(a) marzenie:</span>
                        ) : (
                            <span style={{color: '#64748b'}}>dodał(a) marzenie:</span>
                        )}
                    </p>
                    <p className="feed-dream-title">{item.title}</p>
                  </>
              )}

              <span className="feed-time">
                 {timeAgo(item.date)}
              </span>
            </div>
          </div>
        ))}
      </div>
      ) : (
        <p style={{padding: '20px', color: '#94a3b8', textAlign: 'center'}}>
                  Na razie cisza... 🍃
              </p>
          )}

    </aside>
  );
}