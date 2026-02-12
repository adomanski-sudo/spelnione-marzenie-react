import { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css"; 

// Importy Komponentów
import DesktopSidebar from "./components/DesktopSidebar";
import RightFeed from "./components/RightFeed";
import MobileHeader from "./components/MobileHeader";
import MobileNav from "./components/MobileNav";
import DreamCard from "./components/DreamCard";
import HowItWorks from './components/HowItWorks';
import MyProfile from "./components/MyProfile";
import DreamModal from "./components/DreamModal";
import SearchSection from './components/SearchSection';
import FriendsSection from './components/FriendsSection';
import NotificationsSection from './components/NotificationsSection';
import UserProfile from './components/UserProfile';
import AuthForm from "./components/AuthForm";
import { X } from 'lucide-react'; // Ikona krzyżyka do zamykania

function App() {
  // 1. STAN APLIKACJI
  const [activeView, setActiveView] = useState(() => {
      return localStorage.getItem('savedActiveView') || 'home';
  });

  const [showMobileLogin, setShowMobileLogin] = useState(false);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('loggedUser');
    return savedUser ? JSON.parse(savedUser) : null;
    });

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedDream, setSelectedDream] = useState(null);
  const [dreams, setDreams] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [visitingUserId, setVisitingUserId] = useState(null);

  // Funkcja obsługująca kliknięcie w autora (nawigacja)
  const handleOpenProfile = (userId) => {
    console.log("Przechodzę do profilu użytkownika ID:", userId);
    
    // Jeśli klikam w siebie -> idź do mojego profilu
    if (currentUser && userId === currentUser.id) {
        setActiveView('myProfile');
    } else {
        // Jeśli w kogoś innego -> ustaw ID i zmień widok
        setVisitingUserId(userId);
        setActiveView('userProfile');
    }
  };

  // 2. FUNKCJE LOGIKI 
  
  // Funkcja logowania przekazywana do Sidebara
  const handleLogin = (userData) => {
    console.log("Zalogowano użytkownika:", userData);
    setCurrentUser(userData); // Zapisujemy dane z backendu
    setActiveView('home');    // Przenosimy na stronę główną
    // Zapis do Local Storage
    localStorage.setItem('loggedUser', JSON.stringify(userData));
  };

  // Ta funkcja zaktualizuje dane w locie, po zapisaniu formularza
  const handleUpdateUser = (updatedData) => {
    console.log("Aktualizacja usera:", updatedData);
    setCurrentUser(updatedData);
    // Nadpisujemy też localStorage, żeby po F5 było nowe info
    localStorage.setItem('loggedUser', JSON.stringify(updatedData));

    // Opcjonalnie: wróć do profilu po zapisaniu
    // setActiveView('myProfil'); 
};

  // Wylogowanie
  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView('home');
    // Czyścimy pamięć
    localStorage.removeItem('loggedUser'); 
    };

  // Filtrowanie marzeń dla "Mojego Profilu" (tylko jeśli jesteśmy zalogowani)
  const myDreams = currentUser 
    ? dreams.filter(dream => dream.userId === currentUser.id) 
    : [];

  // 3. EFEKTY (Pobieranie danych)

  // Zapisywanie widoku w pamięci przeglądarki
  useEffect(() => {
      localStorage.setItem('savedActiveView', activeView);
  }, [activeView]);
  
  // POBIERANIE ZALOGOWANEGO UŻYTKOWNIKA
  useEffect(() => {
    // Najpierw sprawdzamy, czy mamy zapisany token w przeglądarce
    const storedUser = localStorage.getItem('loggedUser');
    const token = storedUser ? JSON.parse(storedUser).token : null;

    if (token) {
        // Jeśli jest token, wysyłamy go do serwera
        fetch('/api/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token 
            }
        })
        .then(res => res.json())
        .then(data => {
            // Serwer odsyła nam dane konkretnie tego użytkownika, do którego należy token
            if (data && data.length > 0) {
                setCurrentUser(data[0]); 
            }
        })
        .catch(err => console.error("Błąd weryfikacji sesji:", err));
    }
  }, []); // Pusta tablica [] oznacza: wykonaj tylko raz po odświeżeniu strony
  



  // 👇 2. Próbuję z AXIOS bo był problem z tokenami i ciastkami.
  const fetchDreams = () => {
    // Używam axios z flagą withCredentials, żeby wysłać ciasteczko
    axios.get('/api/dreams', { withCredentials: true })
      .then((res) => {
        const data = res.data;

        const formatted = data.map(item => {
           let safeDate = item.date;
           if (safeDate && safeDate.includes('T')) {
               safeDate = safeDate.replace('T', ' ').split('.')[0];
           }
           return {
             id: item.id,
             userId: item.idUser,
             title: item.title,
             description: item.description,
             image: item.image,
             date: safeDate,
             type: item.type,
             price_min: item.price_min,
             price_max: item.price_max,
             is_public: item.is_public,
             
             // Autor
             first_name: item.first_name,
             last_name: item.last_name,
             userImage: item.user_avatar 
           };
        });
        setDreams(formatted);
      })
      .catch((err) => {
        // Obsługa błędów - teraz aplikacja nie wybuchnie przy 401
        console.error("Błąd pobierania marzeń:", err);
        if (err.response && err.response.status === 401) {
            console.warn("Użytkownik niezalogowany - widok publiczny ograniczony");
            // Opcjonalnie: setDreams([]) lub przekierowanie do logowania
        }
      });
  };

  // 2. useEffect wywołuje fetchDreams TYLKO RAZ
  useEffect(() => {
    fetchDreams();
  }, []);

  // Pobieranie znajomych (dla sekcji Friends)
  useEffect(() => {
    const storedUser = localStorage.getItem('loggedUser');
    const token = storedUser ? JSON.parse(storedUser).token : null;
    
    // Tutaj też dodajemy nagłówek, jeśli user jest zalogowany
    fetch('/api/friends', {
        headers: token ? { 'Authorization': token } : {} 
    })
      .then(res => res.json())
      .then(data => setFriendsList(data))
      .catch(err => console.error(err));
  }, []);

  // 4. WIDOK (Renderowanie)
  return (
    <div className="app-layout">
      
      {/* LEWY PASEK */}
      <DesktopSidebar 
        activeView={activeView}
        setActiveView={setActiveView}
        currentUser={currentUser}  // Przekazujemy stan (null lub obiekt)
        onLogin={handleLogin}      // Przekazujemy funkcję naprawiającą błąd!
        onLogout={handleLogout}
      />

      {/* ŚRODKOWA KOLUMNA */}
      <div className="main-content">
        <MobileHeader 
          setView={setActiveView} 
          currentUser={currentUser}
          onLoginClick={() => setShowMobileLogin(true)}
          onOpenFeed={() => setActiveView('feed')}
          onLogout={() => {
            setCurrentUser(null);
            localStorage.removeItem('loggedUser');
            setActiveView('home');
            window.location.reload();
          }}
          
        />
        
        <div className="content-container">
           
           {/* LOGIKA WYŚWIETLANIA WIDOKÓW */}
           
           
           {/* 1. STRONA GŁÓWNA */}
           {activeView === 'home' ? (
             <>
                <HowItWorks />
                
                <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
                  Najnowsze Marzenia 
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {dreams.map((dream) => (
                    <div key={dream.id} onClick={() => setSelectedDream(dream)}>
                        <DreamCard 
                        dream={dream} 
                        showAuthor={true} 
                        onAuthorClick={handleOpenProfile} />
                    </div>
                  ))}
                </div>
             </>
           ) 

           /* 2. MÓJ PROFIL */
           : activeView === 'myProfil' ? (
             <MyProfile 
               dreams={myDreams} 
               setDreams={setDreams}
               userData={currentUser}
               onUpdateUser={handleUpdateUser}
             />
           )

           /* 3. WYSZUKIWARKA */
           : activeView === 'search' ? (
             <SearchSection 
             currentUser={currentUser}
             onProfileClick={handleOpenProfile} />
           )

           /* 4. ZNAJOMI */
           : activeView === 'friends' ? (
             <FriendsSection friends={friendsList} onProfileClick={handleOpenProfile} />
           )

           /* 5. POWIADOMIENIA */
           : activeView === 'notifications' ? (
             <NotificationsSection />
           )

           /* 6. PROFIL INNEGO UŻYTKOWNIKA */
           : activeView === 'userProfile' ? (
             <UserProfile 
              //  userId={selectedUserId} 
               userId={visitingUserId}
               currentUser={currentUser}
               friends={friendsList}
               onBack={() => setActiveView('home')}
             />
           )

           : activeView === 'myProfile' ? (
            <MyProfile 
                dreams={dreams} // Przekazujemy wszystkie marzenia (MyProfile sam sobie przefiltruje po currentUser.id)
                setDreams={setDreams}
                userData={currentUser}
                onUpdateUser={(updated) => {
                    // Tutaj Twoja logika aktualizacji usera, np:
                    setCurrentUser(updated);
                    localStorage.setItem('loggedUser', JSON.stringify(updated));
                }}
            />
            )
           
           : activeView === 'feed' ? (
              <div className="mobile-feed-wrapper fade-in">
              <h2 className="feed-mobile-text">
                  TO SIĘ DZIEJE TERAZ:
              </h2>
              <RightFeed />
              </div>
            )

           : (
             <div className="content-card">
               <p>Widok: {activeView} (w budowie)</p>
             </div>
           )}
        </div>

        <MobileNav 
        setView={setActiveView}
        setActiveView={setActiveView}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)} 
        />
      </div>

      {/* PRAWY PASEK (FEED) */}
      <div className="desktop-feed-wrapper">
      <RightFeed />
      </div>

      {/* MODAL SZCZEGÓŁÓW MARZENIA */}
      {selectedDream && (
        <DreamModal 
          dream={selectedDream} 
          onClose={() => setSelectedDream(null)}
          currentUser={currentUser}  // Żeby wiedział, czy pokazać przyciski
          isOwner={currentUser && selectedDream.userId === currentUser.id}
          onAuthorClick={handleOpenProfile}
          onUpdateDream={(updated) => {
             // Tu opcjonalnie odświeżamy listę główną w App/Feed
             // np. setDreams(prev => prev.map(d => d.id === updated.id ? updated : d));
            
          }}
        />
      )}

      {showMobileLogin && !currentUser && (
        <div className="mobile-auth-overlay fade-in">
          <div className="mobile-auth-container">
        <button className="close-auth-btn" onClick={() => setShowMobileLogin(false)}>
          <X size={24} />
       </button>

        {/* Gotowy formularz */}
        <AuthForm onLoginSuccess={(data) => {
           handleLogin(data);       // Logujemy
           setShowMobileLogin(false); // Zamykamy okno
        }} />
          </div>
        </div>
      )}

      {/* --- MODAL LOGOWANIA --- */}
      {isLoginOpen && (
          <div className="modal-overlay fade-in" onClick={() => setIsLoginOpen(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()} style={{padding: 0}}>
                  <button className="close-modal-btn" onClick={() => setIsLoginOpen(false)}>
                      <X size={24} />
                  </button>
                  
                  <AuthForm 
                      initialMode="login" // <--- Wysyłamy tryb startowy
                      onLoginSuccess={(user) => {
                          handleLogin(user);
                          setIsLoginOpen(false);
                      }}
                  />
              </div>
          </div>
      )}

      {/* --- MODAL REJESTRACJI --- */}
      {isRegisterOpen && (
          <div className="modal-overlay fade-in" onClick={() => setIsRegisterOpen(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()} style={{padding: 0}}>
                  <button className="close-modal-btn" onClick={() => setIsRegisterOpen(false)}>
                      <X size={24} />
                  </button>
                  
                  <AuthForm 
                      initialMode="register" // <--- Wysyłamy tryb startowy
                      onLoginSuccess={(user) => { 
                          handleLogin(user);
                          setIsRegisterOpen(false);
                      }}
                  />
              </div>
          </div>
      )}

    </div>
  );
}

export default App;