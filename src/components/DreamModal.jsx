import React from 'react';
import './DreamModal.css';
import { X, Calendar, Tag, Trash2, Edit, PiggyBank, Lock } from 'lucide-react';

// Dodajemy propsy: isOwner oraz onDelete
export default function DreamModal({ dream, onClose, isOwner, onDelete }) {
  if (!dream) return null;

  const handleDelete = () => {
    if (window.confirm("Czy na pewno chcesz usunąć to marzenie?")) {
        onDelete(dream.id);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content fade-in" onClick={(e) => e.stopPropagation()}>
        
        {/* Przycisk Zamknięcia */}
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-body">
            {/* Lewa kolumna: Obrazek */}
            <div className="modal-image-container">
                <img src={dream.image} alt={dream.title} className="modal-image" />
                <div className={`status-badge ${dream.is_fulfilled ? 'fulfilled' : 'pending'}`}>
                    {dream.is_fulfilled ? 'Spełnione ✨' : 'Do spełnienia im waiting...'}
                </div>
            </div>

            {/* Prawa kolumna: Treść */}
            <div className="modal-info">
                <h2 className="modal-title">{dream.title}</h2>
                
                <div className="modal-meta">
                    <span className="meta-item">
                        <Tag size={16} /> {dream.category}
                    </span>
                    <span className="meta-item">
                        <Calendar size={16} /> {dream.date}
                    </span>
                </div>

                <p className="modal-desc">{dream.description}</p>

                {/* --- SEKCJA PRZYCISKÓW (ZALEŻNA OD WŁAŚCICIELA) --- */}
                <div className="modal-actions">
                    
                    {isOwner ? (
                        // WIDOK WŁAŚCICIELA (JA)
                        <>
                            <button className="action-btn btn-edit">
                                <Edit size={18} /> Edytuj
                            </button>
                            <button className="action-btn btn-delete" onClick={handleDelete}>
                                <Trash2 size={18} /> Usuń
                            </button>
                        </>
                    ) : (
                        // WIDOK GOŚCIA (INNI)
                        <>
                           <button className="action-btn btn-reserve">
                                <Lock size={18} /> Zarezerwuj
                           </button>
                           <button className="action-btn btn-fund">
                                <PiggyBank size={18} /> Zrzutka
                           </button>
                        </>
                    )}

                </div>
            </div>
        </div>
      </div>
    </div>
  );
}