import React from 'react';
import './DesktopSidebar.css'; // <--- Import stylu
import { Home, Search, Bell, Heart, Settings, LogOut } from 'lucide-react'; // <--- Biblioteka z ikonami SVG

import profilImg from '../assets/avatar.jpg';

export default function DesktopSidebar({ setView, activeView }) {
const menuItems = [
    { id: 'home', label: 'Strona Główna', icon: <Home size={24} /> },
    { id: 'search', label: 'Szukaj', icon: <Search size={24} /> },
    { id: 'notifications', label: 'Powiadomienia', icon: <Bell size={24} /> },
    { id: 'friends', label: 'Znajomi', icon: <Heart size={24} /> },
    { id: 'settings', label: 'Ustawienia', icon: <Settings size={24} /> },
    { id: 'logOut', label: 'Wyloguj', icon: <LogOut size={24} /> },
  ];

  return (
    <aside className="sidebar">

      <nav className="sidebar-nav">

        <div className="myProfile">
            <button 
                key="myProfil" 
                onClick={() => setView('myProfil')}
                // Dodajemy klasę active, jeśli widok to 'myProfil'
                className={`menu-btn ${activeView === 'myProfil' ? 'active' : ''}`}
            >
                <img src={profilImg} className="profilImg" alt="Profil" />
                <span>Adrian Domański</span>
            </button>
        </div>

      <div className='menuList'>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            // Używamy logicznej klasy .active
            className={`menu-btn ${activeView === item.id ? 'active' : ''}`}
          >
            <span className="icon-wrapper">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      </nav>

    </aside>
  );
}