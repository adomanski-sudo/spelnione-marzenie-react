import { useState, useEffect } from 'react';
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

function App() {
  // 1. STAN APLIKACJI
  const [activeView, setActiveView] = useState(() => {
      return localStorage.getItem('savedActiveView') || 'home';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('loggedUser');
    return savedUser ? JSON.parse(savedUser) : null;
    });

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedDream, setSelectedDream] = useState(null);
  const [dreams, setDreams] = useState([]);
  const [friendsList, setFriendsList] = useState([]);

  // 2. FUNKCJE LOGIKI (To czego brakowało!)
  
  // Funkcja logowania przekazywana do Sidebara
  const handleLogin = (userData) => {
    console.log("Zalogowano użytkownika:", userData);
    setCurrentUser(userData); // Zapisujemy dane z backendu
    setActiveView('home');    // Przenosimy na stronę główną
    // Zapis do Local Storage
    localStorage.setItem('loggedUser', JSON.stringify(userData));
  };

  const handleOpenProfile = (id) => {
    // Jeśli kliknęliśmy siebie (sprawdzamy ID zalogowanego), idź do MyProfile
    if (currentUser && id === currentUser.id) { 
        setActiveView('myProfil');
    } else {
        setSelectedUserId(id);
        setActiveView('userProfile');
    }
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

  // Pobieranie wszystkich marzeń (Feed na środku)
  useEffect(() => {
    fetch('/api/dreams')
      .then(res => res.json())
      .then(data => {
        const formattedDreams = data.map(item => ({
          id: item.id,
          userId: item.idUser,
          title: item.title,
          description: item.description,
          category: item.category,
          date: new Date(item.date).toLocaleDateString('pl-PL', {
            year: 'numeric', month: 'long', day: 'numeric'
          }),
          userName: `${item.first_name} ${item.last_name}`,
          userAvatar: item.userImage, 
          image: item.image
        }));
        setDreams(formattedDreams);
      })
      .catch(err => console.error("Błąd pobierania marzeń:", err));
  }, []); 

  // Pobieranie znajomych (dla sekcji Friends)
  useEffect(() => {
    fetch('/api/friends')
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
        <MobileHeader setView={setActiveView} />
        
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
                        <DreamCard dream={dream} showAuthor={true} />
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
             />
           )

           /* 3. WYSZUKIWARKA */
           : activeView === 'search' ? (
             <SearchSection onProfileClick={handleOpenProfile} />
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
               userId={selectedUserId} 
               onBack={() => setActiveView('home')}
             />
           )
           : (
             <div className="content-card">
               <p>Widok: {activeView} (w budowie)</p>
             </div>
           )}
        </div>

        <MobileNav setView={setActiveView} />
      </div>

      {/* PRAWY PASEK (FEED) */}
      <RightFeed />

      {/* MODAL SZCZEGÓŁÓW MARZENIA */}
      {selectedDream && (
        <DreamModal 
          dream={selectedDream} 
          onClose={() => setSelectedDream(null)} 
          // Sprawdzamy, czy to marzenie zalogowanego usera, żeby pokazać edycję
          isOwner={currentUser && selectedDream.userId === currentUser.id}
        />
      )}

    </div>
  );
}

export default App;