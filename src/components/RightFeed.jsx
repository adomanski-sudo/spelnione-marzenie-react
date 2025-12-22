import React, { useState, useEffect, useRef } from 'react';
import './RightFeed.css';
import { EyeOff } from 'lucide-react'; // Ikona "tajemnicy"

export default function RightFeed() {
  const [activities, setActivities] = useState([]);
  const [userPool, setUserPool] = useState([]); // Pula "aktorów" (prawdziwi userzy)
  
  // Ref, żeby mieć dostęp do aktualnego stanu wewnątrz timeoutu
  const activitiesRef = useRef([]);
  activitiesRef.current = activities;

  // 1. Pobieramy prawdziwe dane na start (żeby mieć bazę aktorów i marzeń)
  useEffect(() => {
    fetch('/api/feed')
      .then(res => res.json())
      .then(data => {
        setActivities(data);
        setUserPool(data); // Zapisujemy ich jako dostępnych aktorów
      })
      .catch(err => console.error("Błąd feedu:", err));
  }, []);

  // 2. Generator Zdarzeń (Symulacja Live)
  useEffect(() => {
    let timeoutId;

    const scheduleNextEvent = () => {
      // Losowy czas: od 2000ms (2s) do 6000ms (6s)
      const randomTime = Math.random() * (6000 - 2000) + 2000;
      
      timeoutId = setTimeout(() => {
        addRandomEvent();
        scheduleNextEvent(); // Rekurencja - zaplanuj kolejne
      }, randomTime);
    };

    // Startujemy pętlę tylko jeśli mamy "aktorów"
    if (userPool.length > 0) {
      scheduleNextEvent();
    }

    return () => clearTimeout(timeoutId);
  }, [userPool]); // Uruchom, gdy pobierzemy userów

  // Funkcja generująca losowe zdarzenie
  const addRandomEvent = () => {
    if (userPool.length === 0) return;

    // Losujemy aktora z puli
    const actor = userPool[Math.floor(Math.random() * userPool.length)];
    
    // Typy zdarzeń "Tajemniczych"
    const secretTypes = [
        { text: "zarezerwował(a) marzenie", icon: "🤫" },
        { text: "zaproponował(a) zrzutkę", icon: "💰" },
        { text: "dołączył(a) do zrzutki", icon: "🤝" }
    ];

    const randomType = secretTypes[Math.floor(Math.random() * secretTypes.length)];

    const newEvent = {
      id: Date.now(), // Unikalne ID
      first_name: actor.first_name,
      last_name: actor.last_name,
      userImage: actor.userImage, // Używamy prawdziwego zdjęcia
      is_secret: true, // Flaga: to jest tajne zdarzenie
      secret_text: randomType.text,
      secret_icon: randomType.icon,
      date: new Date().toISOString() // Czas: teraz
    };

    // Dodajemy nowe zdarzenie na górę listy i ucinamy, żeby nie zapchać pamięci (max 10)
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
      
      <div className="feed-list">
        {activities.map(item => (
          <div key={item.id} className={`feed-item ${item.is_secret ? 'secret-item' : ''}`}>
            
            <img 
                src={item.userImage} 
                alt="Avatar" 
                className="feed-avatar" 
            />
            
            <div className="feed-content">
              {/* --- LOGIKA DLA TAJNYCH ZDARZEŃ --- */}
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
              /* --- LOGIKA DLA NORMALNYCH ZDARZEŃ (z Bazy) --- */
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
      
      <div className="feed-footer">
          <p>Zainspiruj innych!</p>
          <button className="btn-small">+ Dodaj marzenie</button>
      </div>

    </aside>
  );
}