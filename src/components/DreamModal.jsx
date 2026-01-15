import React from 'react';
import './DreamModal.css';
import './DreamCard.css';
import { X, Edit, Trash2, CheckCircle, Lock } from 'lucide-react';

// --- (Funkcje pomocnicze: formatPrice, getCategoryLabel, getFooterClass) ---
const formatPrice = (min, max) => {
  const pMin = parseFloat(min);
  const pMax = parseFloat(max);
  if (!isNaN(pMin) && !isNaN(pMax) && pMin === pMax) return `${pMin} zł`;
  if ((isNaN(pMin) || pMin === 0) && !isNaN(pMax)) return `Do ${pMax} zł`;
  if (!isNaN(pMin) && isNaN(pMax)) return `Powyżej ${pMin} zł`;
  if (!isNaN(pMin) && !isNaN(pMax)) return `${pMin} - ${pMax} zł`;
  return null;
};

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

export default function DreamModal({ dream, onClose, isOwner, onEdit, onDelete, isInline = false, showAuthor = true, onAuthorClick }) {
  if (!dream) return null;

  const handleAuthorContainerClick = () => {
      if (!isInline && onAuthorClick && dream.userId) {
          onClose(); // Zamykamy modal
          onAuthorClick(dream.userId); // Wołamy funkcję z App.jsx
      }
  };

  const priceLabel = dream.type === 'gift' ? formatPrice(dream.price_min, dream.price_max) : null;
  const footerClass = getFooterClass(dream);
  const isPrivate = !dream.is_public;
  const avatarSrc = dream.userImage || `https://ui-avatars.com/api/?name=${dream.first_name || 'U'}+${dream.last_name || 'D'}&background=random`;

  // Wnętrze karty
  const modalContent = (
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* 1. OBRAZ */}
        <div className="modal-image-section">
            
            {/* ZMIANA: Usunęliśmy warunek !isInline. X wyświetla się ZAWSZE. */}
            <button className="close-btn" onClick={onClose}>
                <X size={20} />
            </button>
            
            {dream.image ? (
               <img src={dream.image} alt={dream.title} className="modal-image" onError={(e) => e.target.style.display = 'none'} />
            ) : (
               <div className="card-image-placeholder" style={{fontSize: '5rem'}}>🎁</div>
            )}

            {isPrivate && (
                <div className="private-badge" style={{top: '15px', left: '15px', right: 'auto'}}>
                    <Lock size={16} color="white" />
                </div>
            )}
        </div>

        {/* 2. TREŚĆ (Bez zmian) */}
        <div className="modal-body">
            {/* Warunkowe wyświetlanie autora + obrazek */}
            {showAuthor && (
                <div className="modal-user-info clickable-author"
                onClick={handleAuthorContainerClick}
                title="Przejdź do profilu użytkownika">
                     <img 
                        src={avatarSrc} 
                        alt="User" 
                        className="modal-avatar"
                        onError={(e) => { e.target.onerror = null; e.target.src=`https://ui-avatars.com/api/?name=${dream.first_name}+${dream.last_name}&background=random` }}
                     />
                     <div>
                        <div className="modal-username">{dream.first_name || 'Użytkownik'} {dream.last_name}</div>
                        <div style={{fontSize: '0.8rem', color: '#94a3b8'}}>Autor marzenia</div>
                     </div>
                </div>
            )}

            <div className="modal-header-row">
                <div className="modal-title-group">
                    <h2 className="modal-title">{dream.title}</h2>
                    {priceLabel && <span className="modal-price-tag">{priceLabel}</span>}
                </div>
            </div>

            <p className="modal-description">
                {dream.description || "Brak opisu."}
            </p>
        </div>

        {/* 3. STOPKA (Bez zmian) */}
        <div className={`modal-footer-section ${footerClass}`}>
            <div className="modal-footer-info">
                <span>{getCategoryLabel(dream)}</span>
                <span>{dream.date ? dream.date.split(' ')[0] : ''}</span>
            </div>
            <div className="modal-footer-actions">
                {isOwner ? (
                    <>
                        <button className="btn-action btn-edit" onClick={() => onEdit(dream)}>
                            <Edit size={18} /> Edytuj
                        </button>
                        <button className="btn-action btn-delete" onClick={() => onDelete(dream.id)}>
                            <Trash2 size={18} /> Usuń
                        </button>
                    </>
                ) : (
                    <button className="btn-action btn-fulfill" onClick={() => alert("Wkrótce!")}>
                        <CheckCircle size={18} /> Spełnij
                    </button>
                )}
            </div>
        </div>
    </div>
  );

  // ZMIANA: Usunęliśmy przycisk "Wróć do listy" z widoku Inline
  if (isInline) {
      return (
          <div className="dream-inline-view">
              {modalContent}
          </div>
      );
  }

  // Domyślny Overlay
  return (
    <div className="modal-overlay" onClick={onClose}>
      {modalContent}
    </div>
  );
}