import React from 'react';
import './DreamCard.css';
import { Lock, Gift } from 'lucide-react';

// --- FUNKCJA FORMATOWANIA CENY (Bez zmian) ---
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

// --- NOWA FUNKCJA: ETYKIETA KATEGORII ---
const getCategoryLabel = (dream) => {
  if (dream.type === 'time') return 'Czas';
  if (dream.type === 'smile') return 'Uśmiech';
  
  if (dream.type === 'gift') {
      const pMin = parseFloat(dream.price_min);
      const pMax = parseFloat(dream.price_max);
      
      // Jeśli min == max (i są liczbami), to "Pomysł" (konkretna cena)
      if (!isNaN(pMin) && !isNaN(pMax) && pMin === pMax) {
          return 'Pomysł';
      }
      // W przeciwnym razie (widełki, brak max itp.) to "Konkret"
      return 'Konkret';
  }
  return '';
};

export default function DreamCard({ dream, showAuthor = true }) {
  if (!dream) return null;

  return (
    <div className="dream-card fade-in">
      {/* Obrazek */}
      <div className="card-image-wrapper">
        {dream.image ? (
            <img src={dream.image} alt={dream.title} className="card-image" onError={(e) => e.target.style.display = 'none'} />
        ) : (
            <div className="card-image-placeholder"><Gift /></div> 
        )}
      </div>

      <div className="card-content">
        {/* Autor */}
        {showAuthor && dream.first_name && (
          <div className="card-header">
            <img 
                src={dream.userImage || `https://ui-avatars.com/api/?name=${dream.first_name}+${dream.last_name}&background=random`} 
                alt="User" 
                className="user-avatar" 
            />
            <span className="user-name">{dream.first_name} {dream.last_name}</span>
          </div>
        )}

        {/* Treść */}
        <h3 className="card-title">{dream.title}</h3>
        <p className="card-desc">{dream.description}</p>

        {/* Cena (Tylko dla Prezentu) */}
        {dream.type === 'gift' && (
          <div className="dream-price" style={{ color: '#64748b', fontWeight: '600', marginTop: '10px' }}>
            {formatPrice(dream.price_min, dream.price_max)}
          </div>
        )}

        {/* --- STOPKA Z KATEGORIĄ --- */}
        <div className="card-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '15px' }}>
          
          {/* LEWA STRONA: Kategoria */}
          <span className="card-category" style={{ 
              fontWeight: 'bold', 
              fontSize: '0.8rem', 
              textTransform: 'uppercase', 
              color: '#83828f', // Niebieski kolor dla wyróżnienia
              marginRight: 'auto' // Wypycha datę na prawo
          }}>
              {getCategoryLabel(dream)}
          </span>

          {/* PRAWA STRONA: Data i Kłódka */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span className="card-date" style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  {dream.date}
              </span>
              {!dream.is_public && <span title="Prywatne"><Lock /></span>}
          </div>

        </div>
      </div>
    </div>
  );
}