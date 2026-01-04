import React, { useState } from 'react';
import './MobileHeader.css';
import { LogIn, LogOut, Settings, User, Gift } from 'lucide-react'; 

export default function MobileHeader({ setView, currentUser, onLoginClick, onLogout }) {
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = (viewName) => {
      setView(viewName);
      setIsMenuOpen(false); // Zamknij menu po kliknięciu
  };

  const handleLogoutClick = () => {
      setIsMenuOpen(false);
      onLogout();
  };

  return (
    <header className="mobile-header">
      {/* LOGO */}
      <div className="logo-section" onClick={() => setView('home')}>
         <span className="logo-text">SpełnioneMarzenie.pl</span>
          <div className="m-brand-icon">
            <Gift className="brand-icon" size={32} />
          </div>
      </div>

      {/* PRAWA STRONA (User lub Login) */}
      <div className="user-section">
        {currentUser ? (
          <div className="mobile-user-container">
            {/* AWATAR (Kliknięcie otwiera menu) */}
            <img 
                src={currentUser.image} 
                alt="Profil" 
                className="mobile-avatar"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            />

            {/* ROZWIJANE MENU */}
            {isMenuOpen && (
                <div className="mobile-dropdown fade-in">
                    <div className="dropdown-header">
                        Cześć, {currentUser.first_name}!
                    </div>
                    
                    <button onClick={() => handleMenuClick('myProfil')}>
                        <User size={16} /> Mój Profil
                    </button>
                    
                    <button onClick={() => handleMenuClick('settings')}>
                        <Settings size={16} /> Ustawienia
                    </button>
                    
                    <div className="dropdown-divider"></div>
                    
                    <button className="btn-logout" onClick={handleLogoutClick}>
                        <LogOut size={16} /> Wyloguj
                    </button>
                </div>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
    </header>
  );
}