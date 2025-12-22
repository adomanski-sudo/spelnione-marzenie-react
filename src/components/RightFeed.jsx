import React, { useState, useEffect } from 'react';
import './RightFeed.css'; // Zakładam, że masz ten plik, albo użyjemy stylów inline/globalnych

export default function RightFeed() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetch('/api/feed')
      .then(res => res.json())
      .then(data => setActivities(data))
      .catch(err => console.error("Błąd feedu:", err));
  }, []);

  // Funkcja pomocnicza do liczenia czasu ("X minut temu")
  const timeAgo = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const seconds = Math.floor((now - date) / 1000);
      
      // Obsługa dat z przyszłości (Twoja baza ma losowe daty 2026)
      // Jeśli data jest w przyszłości, traktujemy to jako "przed chwilą"
      if (seconds < 0) return "przed chwilą";

      let interval = seconds / 31536000;
      if (interval > 1) return Math.floor(interval) + " lat temu";
      interval = seconds / 2592000;
      if (interval > 1) return Math.floor(interval) + " mies. temu";
      interval = seconds / 86400;
      if (interval > 1) return Math.floor(interval) + " dni temu";
      interval = seconds / 3600;
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
          <div key={item.id} className="feed-item">
            {/* Awatar */}
            <img 
                src={item.userImage} 
                alt="Avatar" 
                className="feed-avatar" 
            />
            
            <div className="feed-content">
              <p className="feed-text">
                <strong>{item.first_name} {item.last_name && item.last_name[0]}.</strong>
                {' '}
                {/* Logika tekstu zależna od statusu */}
                {item.is_fulfilled ? (
                    <span style={{color: '#10b981', fontWeight: 600}}>spełnił(a) marzenie:</span>
                ) : (
                    <span style={{color: '#64748b'}}>dodał(a) marzenie:</span>
                )}
              </p>
              
              <p className="feed-dream-title">
                {item.title}
              </p>

              <span className="feed-time">
                 {timeAgo(item.date)}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Opcjonalny przycisk zachęty */}
      <div className="feed-footer">
          <p>Zainspiruj innych swoim sukcesem!</p>
          <button className="btn-small">+ Dodaj sukces</button>
      </div>

    </aside>
  );
}