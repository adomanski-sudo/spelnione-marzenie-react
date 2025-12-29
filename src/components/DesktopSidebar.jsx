import React from 'react';
import { Home, Search, LogOut, Settings, Bell, User, Heart } from 'lucide-react';
import './DesktopSidebar.css';
import AuthForm from './AuthForm'; // Import nowego formularza

export default function DesktopSidebar({ activeView, setActiveView, currentUser, onLogin }) {

  return (
    <aside className="sidebar fade-in">
      <div className="sidebar-header">
         {/* Jeśli zalogowany -> Pokaż Avatar */}
         {currentUser ? (
             <div className="user-mini-profile fade-in" 
             onClick={() => setActiveView('myProfil')}>
                <img src={currentUser.image} className="mini-avatar" alt="User" />
                <div className="mini-info">
                    <span className="mini-name">{currentUser.first_name}</span>
                    <span className="mini-role">{currentUser.last_name}</span>
                </div>
             </div>
         ) : (
             /* Jeśli NIE zalogowany -> Tylko Logo (tekst) */
             <div className="guest-header">
                <h3>Dołącz do nas!</h3>
                <p>Odkryj marzenia znajomych</p>
             </div>
         )}
      </div>

      <nav className="sidebar-nav">
        {/* --- PRZYCISKI DOSTĘPNE DLA KAŻDEGO --- */}
        <button 
            className={`nav-item ${activeView === 'home' ? 'active' : ''}`}
            onClick={() => setActiveView('home')}
        >
            <Home size={20} /> Strona Główna
        </button>

        <button 
            className={`nav-item ${activeView === 'search' ? 'active' : ''}`}
            onClick={() => setActiveView('search')}
        >
            <Search size={20} /> Szukaj
        </button>

        {/* --- PRZYCISKI TYLKO DLA ZALOGOWANYCH --- */}
        {currentUser && (
            <>
                <button 
                    className={`nav-item ${activeView === 'notifications' ? 'active' : ''}`}
                    onClick={() => setActiveView('notifications')}
                >
                    <Bell size={20} /> Powiadomienia
                </button>
                <button 
                    className={`nav-item ${activeView === 'friends' ? 'active' : ''}`}
                    onClick={() => setActiveView('friends')}
                >
                    <Heart size={20} /> Znajomi
                </button>
                <button 
                    className={`nav-item ${activeView === 'myProfil' ? 'active' : ''}`}
                    onClick={() => setActiveView('myProfil')}
                >
                    <User size={20} /> Mój Profil
                </button>
                 <button 
                    className={`nav-item ${activeView === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveView('settings')}
                >
                    <Settings size={20} /> Ustawienia
                </button>
            </>
        )}
      </nav>

      {/* --- FORMULARZ NA DOLE (DLA NIEZALOGOWANYCH) --- */}
      {!currentUser && (
          <div className="sidebar-footer-auth">
              <AuthForm onLoginSuccess={onLogin} />
          </div>
      )}

      {/* --- PRZYCISK WYLOGUJ (DLA ZALOGOWANYCH) --- */}
      {currentUser && (
        <div className="sidebar-footer">
            <button className="nav-item logout-btn" onClick={() => window.location.reload()}>
                <LogOut size={20} /> Wyloguj
            </button>
        </div>
      )}
    </aside>
  );
}