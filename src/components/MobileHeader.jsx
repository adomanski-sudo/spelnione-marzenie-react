import React from 'react';
import './MobileHeader.css'; // <--- Import stylu


export default function MobileHeader({ setView }) {
  return (
    <header className="mobile-header">
      <div style={{ fontWeight: 'bold' }} onClick={() => setView('home')}>
        SpelnioneMarzenie.pl
      </div>
      <button onClick={() => setView('profile')}>Profil</button>
    </header>
  );
}