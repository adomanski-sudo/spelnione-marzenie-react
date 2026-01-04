import React from 'react';
import './MobileNav.css'; // Upewnij się, że masz ten plik stylów
import { Search, Bell, Heart, LogIn, UserPlus } from 'lucide-react';

export default function MobileNav({ 
    activeView, 
    setActiveView, 
    currentUser, 
    onOpenLogin, 
    onOpenRegister 
}) {
  
  return (
    <nav className="mobile-nav">
      
      {/* --- WERSJA DLA ZALOGOWANYCH --- */}
      {currentUser ? (
        <>
          {/* 1. POWIADOMIENIA */}
          <button 
            className={`nav-item ${activeView === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveView('notifications')}
          >
            <Bell size={24} />
            {/* <span className="nav-label">Powiadomienia</span> */}
          </button>

          {/* 2. SZUKAJ (Środek) */}
          <button 
            className={`nav-item ${activeView === 'search' ? 'active' : ''}`}
            onClick={() => setActiveView('search')}
          >
            <Search size={24} />
            {/* <span className="nav-label">Szukaj</span> */}
          </button>

          {/* 3. ZNAJOMI */}
          <button 
            className={`nav-item ${activeView === 'friends' ? 'active' : ''}`}
            onClick={() => setActiveView('friends')}
          >
            <Heart size={24} />
            {/* <span className="nav-label">Znajomi</span> */}
          </button>
        </>

      ) : (
        
      /* --- WERSJA DLA NIEZALOGOWANYCH (GOŚCI) --- */
        <>
          {/* 1. ZALOGUJ (Otwiera Modal) */}
          <button 
            className="nav-item"
            onClick={onOpenLogin}
          >
            <LogIn size={24} />
            {/* <span className="nav-label">Zaloguj</span> */}
          </button>

          {/* 2. SZUKAJ (Działa normalnie) */}
          <button 
            className={`nav-item ${activeView === 'search' ? 'active' : ''}`}
            onClick={() => setActiveView('search')}
          >
            <Search size={24} />
            {/* <span className="nav-label">Szukaj</span> */}
          </button>

          {/* 3. ZAREJESTRUJ (Otwiera Modal) */}
          <button 
            className="nav-item"
            onClick={onOpenRegister}
          >
            <UserPlus size={24} />
            {/* <span className="nav-label">Dołącz</span> */}
          </button>
        </>
      )}

    </nav>
  );
}