import React from 'react';
import './MobileNav.css'; // <--- Import stylu


export default function MobileNav({ setView }) {
  return (
    <nav className="mobile-nav">
      <span onClick={() => setView('search')}>🔍</span>
      <span onClick={() => setView('notifications')}>🔔</span>
      <span onClick={() => setView('friends')}>❤️</span>
    </nav>
  );
}