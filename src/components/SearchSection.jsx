import React, { useState, useEffect } from 'react';
import './SearchSection.css';
import DreamCard from './DreamCard';
import DreamModal from './DreamModal';
import { Search, User, Sparkles } from 'lucide-react';

export default function SearchSection({ onProfileClick, currentUser }) {
  // --- STANY (Zostawiamy tylko jeden zestaw) ---
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('users'); // 'users' lub 'dreams'
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDream, setSelectedDream] = useState(null); // Do modala

  // 1. Czyszczenie przy zmianie zakładki
  useEffect(() => {
    setResults([]); 
    // Opcjonalnie: setQuery(''); // Jeśli chcesz czyścić tekst przy zmianie
  }, [searchType]);

  // 2. Pobieranie danych (Fetch)
  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
        fetch(`/api/search?q=${query}&type=${searchType}`)
          .then(res => res.json())
          .then(data => {
            
            if (searchType === 'dreams') {
               // Formatowanie dla marzeń - MUSI BYĆ TAKIE SAMO JAK W App.jsx!
               const formatted = data.map(item => ({
                  id: item.id,
                  title: item.title,
                  description: item.description,
                  category: item.category,
                  date: item.date ? new Date(item.date).toLocaleDateString('pl-PL') : '',
                  image: item.image,
                  
                  // --- NAPRAWA AWATARÓW ---
                  userId: item.idUser, 
                  // DreamCard oczekuje 'userAvatar', a nie 'userImage'!
                  userAvatar: item.userImage, 
                  // DreamCard oczekuje też gotowego 'userName'
                  userName: `${item.first_name} ${item.last_name}`
               }));
               setResults(formatted);
            } else {
               // Użytkownicy wchodzą "sauté"
               setResults(data);
            }
            setIsLoading(false);
          })
          .catch(err => {
             console.error(err);
             setIsLoading(false);
          });
          
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchType]);

  return (
    <div className="search-container fade-in">
      
      {/* --- NAGŁÓWEK (Przełączniki i Input) --- */}
      <div className="search-header">
        <div className="search-toggle">
           <button 
             className={`toggle-btn ${searchType === 'users' ? 'active' : ''}`}
             onClick={() => setSearchType('users')}
           >
             <User size={16} /> Użytkownicy
           </button>
           <button 
             className={`toggle-btn ${searchType === 'dreams' ? 'active' : ''}`}
             onClick={() => setSearchType('dreams')}
           >
             <Sparkles size={16} /> Marzenia
           </button>
        </div>

        <div className="search-input-wrapper">
           <Search className="search-icon" size={20} />
           <input 
             type="text" 
             placeholder={searchType === 'dreams' ? "Szukaj marzeń..." : "Szukaj ludzi..."}
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             className="search-input"
             autoFocus
           />
        </div>
      </div>

      {/* --- WYNIKI WYSZUKIWANIA --- */}
      <div className="search-results-area">
         
         {isLoading && results.length === 0 && <p className="loading-text">Ładowanie...</p>}
         
         {!isLoading && results.length === 0 && (
             <div className="no-results">
                <p>Brak wyników.</p>
             </div>
         )}

         {/* 1. WIDOK MARZEŃ */}
         {searchType === 'dreams' && results.length > 0 && (
            <div className="dreams-grid-compact">
               {results.map(dream => (
                  <div 
                    key={dream.id} 
                    style={{cursor: 'pointer'}}
                    onClick={() => setSelectedDream(dream)} // <--- OTWIERANIE MODALA
                  >
                     <DreamCard dream={dream} showAuthor={true} />
                  </div>
               ))}
            </div>
         )}

         {/* 2. WIDOK UŻYTKOWNIKÓW */}
         {searchType === 'users' && results.length > 0 && (
            <div className="users-grid">
               {results.map(user => (
                  <div 
                    key={user.id} 
                    className="user-search-card"
                    onClick={() => onProfileClick(user.id)}
                    style={{ cursor: 'pointer' }}
                  >
                     <img src={user.image} alt="Avatar" className="user-search-avatar" />
                     
                     <div className="user-search-info">
                        <h4 className="user-search-name">{user.first_name} {user.last_name}</h4>
                        <p className="user-search-desc">
                            {user.description ? user.description.substring(0, 120) + (user.description.length > 120 ? '...' : '') : 'Brak opisu'}
                        </p>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>

      {/* --- MODAL (Jeden wspólny na dole) --- */}
      {selectedDream && (
        <DreamModal 
            dream={selectedDream}
            currentUser={currentUser}
            onClose={() => setSelectedDream(null)}
            onUpdateDream={(updatedDream) => {
                // Aktualizujemy listę wyników po edycji (żeby np. zmienił się tytuł na liście)
                setResults(prev => prev.map(item => item.id === updatedDream.id ? { ...item, ...updatedDream } : item));
            }}
            // Obsługa usuwania w wyszukiwarce też się przyda
            onDeleteDream={(id) => {
                setResults(prev => prev.filter(item => item.id !== id));
            }}
        />
      )}

    </div>
  );
}