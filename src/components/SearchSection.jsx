import React, { useState, useEffect } from 'react';
import './SearchSection.css';
import DreamCard from './DreamCard';
import { Search, User, Sparkles } from 'lucide-react';

export default function SearchSection() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('users'); 
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. EFEKT: Zmiana zakładki = Wyczyść wyniki natychmiast!
  // To naprawia błąd "użytkownicy formatowani jak karty marzeń"
  useEffect(() => {
    setResults([]); // Czyścimy stół przed podaniem nowego dania
    setQuery('');   // Opcjonalnie: czyścimy pole wyszukiwania przy zmianie kategorii
  }, [searchType]);

  // 2. EFEKT: Pobieranie danych (Debounce)
  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
        // Usunęliśmy warunek if (query.length > 2) - teraz pobiera zawsze!
        fetch(`/api/search?q=${query}&type=${searchType}`)
          .then(res => res.json())
          .then(data => {
            
            if (searchType === 'dreams') {
               // Formatowanie marzeń (tak jak w App.jsx)
               const formatted = data.map(item => ({
                  id: item.id,
                  title: item.title,
                  description: item.description,
                  category: item.category,
                  // Zabezpieczenie na wypadek null w dacie
                  date: item.date ? new Date(item.date).toLocaleDateString('pl-PL') : '',
                  image: item.image,
                  userName: `${item.first_name} ${item.last_name}`,
                  userAvatar: item.userImage
               }));
               setResults(formatted);
            } else {
               // Użytkownicy wchodzą bez zmian
               setResults(data);
            }
            setIsLoading(false);
          })
          .catch(err => {
             console.error(err);
             setIsLoading(false);
          });
          
    }, 300); // Zmniejszyłem czas oczekiwania na 300ms, żeby działało szybciej

    return () => clearTimeout(timer);
  }, [query, searchType]);

  return (
    <div className="search-container fade-in">
      
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
             // Placeholder zmienia się zależnie od trybu
             placeholder={searchType === 'dreams' ? "Szukaj marzeń..." : "Szukaj ludzi..."}
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             className="search-input"
             autoFocus
           />
        </div>
      </div>

      <div className="search-results-area">
         
         {/* Loader tylko gdy faktycznie nie ma jeszcze danych */}
         {isLoading && results.length === 0 && <p className="loading-text">Ładowanie...</p>}
         
         {!isLoading && results.length === 0 && (
             <div className="no-results">
                <p>Brak wyników.</p>
             </div>
         )}

         {/* --- WIDOK MARZEŃ (GRID) --- */}
         {searchType === 'dreams' && results.length > 0 && (
            <div className="dreams-grid-compact">
               {results.map(dream => (
                  // Dodajemy klucz i onClick (jeśli chcesz otwierać modal)
                  <div key={dream.id} style={{cursor: 'pointer'}}>
                     <DreamCard dream={dream} showAuthor={true} />
                  </div>
               ))}
            </div>
         )}

         {/* --- WIDOK UŻYTKOWNIKÓW (LISTA KAFELKÓW) --- */}
         {/* Aby to wyglądało ładnie jak na Twoim screenie, używamy GRID */}
         {/* --- WIDOK UŻYTKOWNIKÓW --- */}
         {searchType === 'users' && results.length > 0 && (
            <div className="users-grid">
               {results.map(user => (
                  <div 
                    key={user.id} 
                    className="user-search-card"
                    /* CAŁY KAFEL JEST TERAZ PRZYCISKIEM */
                    onClick={() => onProfileClick(user.id)}
                    /* Dodajemy style inline lub w CSS, żeby kursor był łapką */
                    style={{ cursor: 'pointer' }}
                  >
                     <img src={user.image} alt="Avatar" className="user-search-avatar" />
                     
                     <div className="user-search-info">
                        <h4 className="user-search-name">{user.first_name} {user.last_name}</h4>
                        
                        {/* WIĘCEJ MIEJSCA NA TEKST: Zwiększamy substring do np. 120 znaków */}
                        <p className="user-search-desc">
                            {user.description ? user.description.substring(0, 120) + (user.description.length > 120 ? '...' : '') : 'Brak opisu'}
                        </p>
                     </div>
                     
                     {/* PRZYCISK USUNIĘTY - zyskujemy miejsce na dole */}
                  </div>
               ))}
            </div>
         )}
      </div>

    </div>
  );
}