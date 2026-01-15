import React from 'react';
import './DreamCard.css';
import { Lock } from 'lucide-react';

// --- Formatowanie Ceny (Bez zmian) ---
const formatPrice = (min, max) => {
  const pMin = parseFloat(min);
  const pMax = parseFloat(max);
  if (!isNaN(pMin) && !isNaN(pMax) && pMin === pMax) return `${pMin} zł`;
  if ((isNaN(pMin) || pMin === 0) && !isNaN(pMax)) return `Do ${pMax} zł`;
  if (!isNaN(pMin) && isNaN(pMax)) return `Powyżej ${pMin} zł`;
  if (!isNaN(pMin) && !isNaN(pMax)) return `${pMin} - ${pMax} zł`;
  return null;
};

// --- Etykiety i Kolory (Bez zmian) ---
const getCategoryLabel = (dream) => {
  if (dream.type === 'time') return 'Czas';
  if (dream.type === 'smile') return 'Uśmiech';
  if (dream.type === 'gift') {
      const pMin = parseFloat(dream.price_min);
      const pMax = parseFloat(dream.price_max);
      if (!isNaN(pMin) && !isNaN(pMax) && pMin === pMax) return 'Pomysł';
      return 'Konkret';
  }
  return '';
};

const getFooterClass = (dream) => {
  if (dream.type === 'time') return 'footer-time';
  if (dream.type === 'smile') return 'footer-smile';
  if (dream.type === 'gift') {
      const pMin = parseFloat(dream.price_min);
      const pMax = parseFloat(dream.price_max);
      if (!isNaN(pMin) && !isNaN(pMax) && pMin === pMax) return 'footer-idea';
      return 'footer-model';
  }
  return '';
};

// 👇 ZMIANA 1: Dodajemy 'showAuthor' do propsów
export default function DreamCard({ dream, showAuthor = true, onAuthorClick }) {
  if (!dream) return null;

  const priceLabel = dream.type === 'gift' ? formatPrice(dream.price_min, dream.price_max) : null;
  const isPrivate = !dream.is_public;
  const footerColorClass = getFooterClass(dream);

  // Generowanie linku do avatara (Logic from Modal)
  const avatarSrc = dream.userImage || `https://ui-avatars.com/api/?name=${dream.first_name || 'U'}+${dream.last_name || 'D'}&background=random`;

  return (
    <div className="dream-card fade-in">
      
      {/* SEKCJA 1: GRAFIKA */}
      <div className="card-image-section">
        {dream.image ? (
            <img 
              src={dream.image} 
              alt={dream.title} 
              className="card-image" 
              onError={(e) => e.target.style.display = 'none'} 
            />
        ) : (
            <div className="card-image-placeholder">🎁</div> 
        )}
        
        {isPrivate && (
            <div className="private-badge" title="Tylko dla znajomych">
                <Lock size={14} color="white" />
            </div>
        )}
      </div>

      {/* SEKCJA 2: KONTENT */}
      <div className="card-content-section">
        
        {/* 👇 ZMIANA 2: Wyświetlanie Autora (jeśli showAuthor=true i mamy imię) */}
        {showAuthor && dream.first_name && (
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <img 
                    src={avatarSrc} 
                    alt="Author" 
                    style={{ width: '20px', height: '20px', borderRadius: '50%', marginRight: '8px', objectFit: 'cover' }}
                    onError={(e) => { e.target.onerror = null; e.target.src=`https://ui-avatars.com/api/?name=${dream.first_name}+${dream.last_name}&background=random` }}
                />
                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>
                    {dream.first_name} {dream.last_name}
                </span>
            </div>
        )}

        <div className="title-price-row">
            <h3 className="card-title" title={dream.title}>{dream.title}</h3>
            {priceLabel && (
                <span className="card-price-tag">
                    {priceLabel}
                </span>
            )}
        </div>

        {dream.description && (
            <p className="card-description">
                {dream.description}
            </p>
        )}
      </div>

      {/* SEKCJA 3: STOPKA */}
      <div className={`card-footer-section ${footerColorClass}`}>
          <span className="footer-category">
              {getCategoryLabel(dream)}
          </span>
          <span className="footer-date">
              {dream.date.split(' ')[0]}
          </span>
      </div>

    </div>
  );
}