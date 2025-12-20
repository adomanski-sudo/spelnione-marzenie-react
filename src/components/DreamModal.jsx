import React from 'react';
import './DreamModal.css';
import { X, Sparkles, User } from 'lucide-react'; // Ikony

export default function DreamModal({ dream, onClose }) {
  // Jeśli nie ma marzenia, nie wyświetlaj nic (zabezpieczenie)
  if (!dream) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* onClick na overlay zamyka modal... */}
      
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* ...ale kliknięcie w sam środek (content) NIE powinno zamykać (stopPropagation) */}
        
        <button className="btn-close-icon" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-body">
          <img src={dream.image} alt={dream.title} className="modal-image" />
          
          <div className="modal-details">
            {dream.category && <span className="modal-category">{dream.category}</span>}
            
            <h2 className="modal-title">{dream.title}</h2>
            
            {/* Informacja o autorze wewnątrz szczegółów */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <img src={dream.userAvatar} alt="User" style={{ width: 24, height: 24, borderRadius: '50%' }} />
                <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
                    {dream.userName}
                </span>
            </div>

            <p className="modal-desc">{dream.description}</p>
            
            {/* Tu można dodać więcej sekcji, np. komentarze, pasek postępu zbiórki itp. */}
            <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '10px', fontSize: '14px', color: '#475569' }}>
                💡 <strong>Jak możesz pomóc?</strong><br/>
            </div>
          </div>
        </div>

        <div className="modal-footer">
           <span style={{ fontSize: '13px', color: '#94a3b8' }}>
              Dodano: {dream.date}
           </span>
           
           <button className="btn-primary" onClick={() => alert("Tu podepniemy funkcję backendu!")}>
              Spełnij Marzenie 
           </button>
            <button className="btn-primary2" onClick={() => alert("Tu podepniemy funkcję backendu!")}>
              Zaproponuj zrzutkę
           </button>
        </div>

      </div>
    </div>
  );
}