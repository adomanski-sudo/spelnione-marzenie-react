import React from 'react';
import './MobileNav.css'; // <--- Import stylu
import { Search, Bell, Heart } from 'lucide-react'; // <--- Biblioteka z ikonami SVG


export default function MobileNav({ setView }) {
  return (
    <nav className="mobile-nav">
      <span onClick={() => setView('search')}><Search size={24} /></span>
      <span onClick={() => setView('notifications')}><Bell size={24} /></span>
      <span onClick={() => setView('friends')}><Heart size={24} /></span>
    </nav>
  );
}