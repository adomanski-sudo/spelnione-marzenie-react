import React from 'react';
import './DreamCard.css';

// Dodajemy prop 'showAuthor' z wartością domyślną true
export default function DreamCard({ dream, showAuthor = true }) {
  return (
    <div className="dream-card">
      {/* Obrazek marzenia */}
      <div className="card-image-wrapper">
         <img src={dream.image} alt={dream.title} className="card-image" />
      </div>
      
      <div className="card-content">
        
        {/* WARUNEK: Wyświetl nagłówek TYLKO jeśli showAuthor jest true */}
        {showAuthor && (
          <div className="card-header">
            <img src={dream.userAvatar} alt="User" className="user-avatar" />
            <span className="user-name">{dream.userName}</span>
          </div>
        )}

        {/* Treść */}
        <h3 className="card-title">{dream.title}</h3>
        <p className="card-desc">{dream.description}</p>

        {/* --- CENA (Tylko dla typu 'gift') --- */}
        {dream.type === 'gift' && dream.price && (
          <div className="dream-price" style={{color: '#64748b', fontSize: '0.9rem', margin: '10px 0'}}>
              💰 {dream.price}
          </div>
        )}

        {/* Stopka (teraz tylko z datą, bez przycisku) */}
        <div className="card-footer">
            <span className="card-date">{dream.date}</span>
        </div>
      </div>
    </div>
  );
}