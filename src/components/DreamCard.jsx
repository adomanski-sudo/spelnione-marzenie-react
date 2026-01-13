import React from 'react';
import './DreamCard.css';
import { Lock, Gift } from 'lucide-react';

// --- (formatPrice bez zmian) ---
const formatPrice = (min, max) => {
  const pMin = parseFloat(min);
  const pMax = parseFloat(max);
  const hasMin = !isNaN(pMin);
  const hasMax = !isNaN(pMax);

  if (!hasMin && !hasMax) return null;
  if (hasMin && hasMax && pMin === pMax) return `${pMin} zł`;
  if ((!hasMin || pMin === 0) && hasMax) return `Do ${pMax} zł`;
  if (hasMin && !hasMax) return `Powyżej ${pMin} zł`;
  if (hasMin && hasMax) return `${pMin} - ${pMax} zł`;
  return null;
};

// --- (getCategoryLabel bez zmian) ---
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

// --- NOWA FUNKCJA: DOBIERANIE KOLORU TŁA ---
const getFooterClass = (dream) => {
  if (dream.type === 'time') return 'footer-time';   // Błękit
  if (dream.type === 'smile') return 'footer-smile'; // Kremowy
  
  if (dream.type === 'gift') {
      const pMin = parseFloat(dream.price_min);
      const pMax = parseFloat(dream.price_max);
      
      // Jeśli konkretna cena -> Pomysł (Lawenda)
      if (!isNaN(pMin) && !isNaN(pMax) && pMin === pMax) return 'footer-idea';
      
      // Jeśli widełki -> Konkret (Mięta)
      return 'footer-model';
  }
  return '';
};

export default function DreamCard({ dream }) {
  if (!dream) return null;

  const priceLabel = dream.type === 'gift' ? formatPrice(dream.price_min, dream.price_max) : null;
  const isPrivate = !dream.is_public;

  // Pobieramy odpowiednią klasę koloru
  const footerColorClass = getFooterClass(dream);

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
            <div className="card-image-placeholder"><Gift /></div> 
        )}
        
        {isPrivate && (
            <div className="private-badge" title="Tylko dla znajomych">
                <Lock size={14} color="white" />
            </div>
        )}
      </div>

      {/* SEKCJA 2: KONTENT */}
      <div className="card-content-section">
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

      {/* SEKCJA 3: STOPKA (Z KOLOREM) */}
      {/* Dodajemy zmienną footerColorClass do listy klas */}
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