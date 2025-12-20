import React from 'react';
import './RightFeed.css';

export default function RightFeed() {
  
  // MOCK DATA - Dane testowe dla panelu aktywności
  const activities = [
    {
      id: 1,
      user: "Kasia K.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      type: "success", // Typ: sukces
      text: "spełniła marzenie:",
      target: "Lot Balonem nad Mazurami",
      time: "2 min temu"
    },
    {
      id: 2,
      user: "Marek Z.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      type: "new",
      text: "dodał marzenie:",
      target: "Nauka gry na pianinie",
      time: "15 min temu"
    },
    {
      id: 3,
      user: "Anna Nowak",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      type: "new",
      text: "dodała marzenie:",
      target: "Zestaw wędkarski",
      time: "1 godz. temu"
    },
    {
      id: 4,
      user: "Tomek Dev",
      avatar: "https://randomuser.me/api/portraits/men/86.jpg",
      type: "success",
      text: "spełnił marzenie:",
      target: "Stworzenie własnej gry",
      time: "3 godz. temu"
    },
    {
      id: 5,
      user: "Jola B.",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg",
      type: "new",
      text: "dodała marzenie:",
      target: "Podróż do Japonii",
      time: "5 godz. temu"
    }
  ];

  return (
    <aside className="feed">
      <div className="feed-header">
        To się dzieje teraz
      </div>
      
      <div>
        {activities.map((item) => (
          <div key={item.id} className="feed-item">
            
            {/* Awatar z ikonką statusu */}
            <div className="avatar-container">
              <img src={item.avatar} alt={item.user} className="feed-avatar" />
              <div className="status-icon">
                {item.type === 'success' ? '🏆' : '✨'}
              </div>
            </div>

            {/* Treść */}
            <div className="feed-content">
              <span className="feed-user">{item.user}</span>{' '}
              <span className="feed-action">{item.text}</span>
              
              {/* Jeśli sukces -> zielony kolor, jeśli nowe -> zwykły */}
              <span className={`feed-target ${item.type === 'success' ? 'success' : ''}`}>
                {item.target}
              </span>
              
              <span className="feed-time">{item.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Dodatek na dole - np. zachęta */}
      <div style={{ marginTop: 'auto', padding: '15px', background: '#f1f5f9', borderRadius: '12px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
          Zainspiruj innych!
        </p>
        <button style={{ 
          background: '#fff', 
          border: '1px solid #cbd5e1', 
          padding: '6px 12px', 
          borderRadius: '20px', 
          fontSize: '12px', 
          fontWeight: 'bold', 
          cursor: 'pointer',
          color: '#475569'
        }}>
          + Dodaj marzenie
        </button>
      </div>
    </aside>
  );
}