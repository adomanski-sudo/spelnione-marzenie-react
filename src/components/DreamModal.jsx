import React, { useState } from 'react';
import { X, Calendar, Tag, Edit, Trash2 } from 'lucide-react';
import EditDreamForm from './EditDreamForm'; // <--- Importujemy gotowca!
import './DreamModal.css'; // Zakładam, że masz tu style modala

export default function DreamModal({ dream, onClose, currentUser, onUpdateDream, onDeleteDream }) {
  
  // Lokalny stan: Czy jesteśmy w trybie edycji?
  const [isEditing, setIsEditing] = useState(false);
  
  // Lokalny stan danych (żeby po edycji od razu widzieć zmiany bez zamykania okna)
  const [currentDream, setCurrentDream] = useState(dream);

  // Sprawdzamy, czy to marzenie należy do zalogowanego użytkownika
  const isOwner = currentUser && currentUser.id === currentDream.userId; 
  // (Upewnij się, że w bazie masz userId lub idUser - dostosuj tę linię do swojego API)

  const handleSuccess = (updatedData) => {
      setCurrentDream(updatedData); // Aktualizujemy widok w modalu
      setIsEditing(false);          // Wracamy do widoku
      if (onUpdateDream) onUpdateDream(updatedData); // Odświeżamy listę pod spodem (np. w Feedzie)
  };

  return (
    <div className="modal-overlay fade-in" onClick={onClose}>
      {/* Kliknięcie w tło zamyka, ale kliknięcie w okno (stopPropagation) nie */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Przycisk Zamknij (X) - Zawsze widoczny */}
        <button className="close-modal-btn" onClick={onClose}>
            <X size={24} />
        </button>

        {/* --- TRYB 1: EDYCJA --- */}
        {isEditing ? (
            <div style={{padding: '20px'}}>
                <EditDreamForm 
                    dreamData={currentDream}
                    onCancel={() => setIsEditing(false)}
                    onSuccess={handleSuccess}
                />
            </div>

        /* --- TRYB 2: WIDOK (Skarpetki) --- */
        ) : (
            <>
                <div className="modal-image-wrapper">
                    <img src={currentDream.image} alt={currentDream.title} />
                    {currentDream.category && (
                        <span className="modal-category-badge">
                            {currentDream.category}
                        </span>
                    )}
                </div>

                <div className="modal-body">
                    <h2 className="modal-title">{currentDream.title}</h2>
                    
                    <div className="modal-meta">
                        {currentDream.category && (
                            <div className="meta-item">
                                <Tag size={16} /> <span>{currentDream.category}</span>
                            </div>
                        )}
                        <div className="meta-item">
                            <Calendar size={16} /> 
                            <span>
                                {/* Jeśli data jest już sformatowana (ma kropki), wyświetl ją. Jeśli nie - sformatuj */}
                                {currentDream.date && currentDream.date.includes('.') 
                                    ? currentDream.date 
                                    : new Date(currentDream.date).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    <p className="modal-description">
                        {currentDream.description}
                    </p>
                    
                    {currentDream.price && (
                        <div className="modal-price">
                            Koszt: <strong>{currentDream.price}</strong>
                        </div>
                    )}

                    {/* PRZYCISKI AKCJI (Tylko dla właściciela!) */}
                    {isOwner && (
                        <div className="modal-actions">
                            <button 
                                className="action-btn edit" 
                                onClick={() => setIsEditing(true)} // <--- TU WŁĄCZAMY EDYCJĘ
                            >
                                <Edit size={18} /> Edytuj
                            </button>
                            
                            <button 
                                className="action-btn delete"
                                onClick={() => {
                                    if(window.confirm("Usunąć to marzenie?")) {
                                        if(onDeleteDream) onDeleteDream(currentDream.id);
                                        onClose();
                                    }
                                }}
                            >
                                <Trash2 size={18} /> Usuń
                            </button>
                        </div>
                    )}
                </div>
            </>
        )}
      </div>
    </div>
  );
}