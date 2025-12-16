import React from 'react';
import './DesktopSidebar.css'; // <--- Import stylu

export default function DesktopSidebar({ setView, activeView }) {
  const menuItems = [
    { id: 'home', label: 'Strona Główna', icon: '🏠' },
    { id: 'search', label: 'Szukaj', icon: '🔍' },
    { id: 'notifications', label: 'Powiadomienia', icon: '🔔' },
    { id: 'friends', label: 'Znajomi', icon: '❤️' },
    { id: 'profile', label: 'Mój Profil', icon: '👤' },
  ];

  return (
    <aside className="sidebar">
      <div style={{ padding: '20px', fontSize: '24px', fontWeight: 'bold' }}>
        Spelnione<br/>Marzenie.pl
      </div>

      <nav style={{ flex: 1 }}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            // Używamy logicznej klasy .active
            className={`menu-btn ${activeView === item.id ? 'active' : ''}`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="menu-btn" style={{ background: '#334155', color: 'white', justifyContent: 'center' }}>
        Spełnij Marzenie +
      </button>
    </aside>
  );
}