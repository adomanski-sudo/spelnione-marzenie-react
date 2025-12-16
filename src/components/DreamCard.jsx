import React from 'react';
import './DreamCard.css';

// Komponent przyjmuje "props" o nazwie dream (to będzie obiekt z danymi)
export default function DreamCard({ dream }) {
  return (
    <div className="dream-card">
      {/* Obrazek marzenia */}
      <img src={dream.image} alt={dream.title} className="card-image" />
      
      <div className="card-content">
        {/* Kto dodał? */}
        <div className="card-header">
          <img src={dream.userAvatar} alt="User" className="user-avatar" />
          <span className="user-name">{dream.userName}</span>
        </div>

        {/* Co to za marzenie? */}
        <h3 className="card-title">{dream.title}</h3>
        <p className="card-desc">{dream.description}</p>

        {/* Akcje */}
        <div className="card-footer">
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{dream.date}</span>
            <button className="btn-fulfill">Spełnij to! ✨</button>
        </div>
      </div>
    </div>
  );
}