import React from 'react';
import './MobileHeader.css'; // <--- Import stylu
import {Settings, LogOut, Gift} from 'lucide-react'; // <--- Biblioteka z ikonami SVG

import profilImg from '../assets/avatar.jpg';


export default function MobileHeader({ setView }) {
  return (
    <header className="mobile-header">
      <div onClick={() => setView('home')}>
        <div className="brand-logo-container fade-in">
        <h1 className="brand-text">SpelnioneMarzenie.pl</h1>
        <Gift className="brand-icon" size={32} />
        </div>
      </div>
      <div className='btn'>
        {/* Profil */}
        <button className='menu-btn' onClick={() => setView('myProfil')}><img src={profilImg} className="profilImg" alt="Profil" /></button>
        {/* Ustawienia */}
        <button className='menu-btn' onClick={() => setView('settings')}><Settings size={24} /></button>
        {/* Wyloguj */}
        <button className='menu-btn' onClick={() => setView('logOut')}><LogOut size={24} /></button>
      </div>
    </header>
  );
}
