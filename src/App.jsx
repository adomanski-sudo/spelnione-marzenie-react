import { useState, useEffect } from 'react'; // <--- Dodaj useEffect
import "./App.css"; // Globalne
import DesktopSidebar from "./components/DesktopSidebar";
import RightFeed from "./components/RightFeed";
import MobileHeader from "./components/MobileHeader";
import MobileNav from "./components/MobileNav";
import DreamCard from "./components/DreamCard";
import HowItWorks from './components/HowItWorks';
import MyProfile from "./components/MyProfile";
import DreamModal from "./components/DreamModal";

const activUser = 2;

function App() {
  const [activeView, setActiveView] = useState('home');
  const [selectedDream, setSelectedDream] = useState(null);

  const [dreams, setDreams] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const myDreams = dreams.filter(dream => dream.userId === activUser);

  const userDescription = '';
  const setDescription = [activUser, userDescription];

  useEffect(() => {
    fetch('http://localhost:8081/dreams')
      .then(res => res.json())
      .then(data => {
        const formattedDreams = data.map(item => ({
          id: item.id,
          userId: item.idUser,
          title: item.title,
          description: item.description,
          category: item.category,
          
          date: new Date(item.date).toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          
          userName: `${item.first_name} ${item.last_name}`,
          
          userAvatar: item.userImage, 
          image: item.image
        }));

        setDreams(formattedDreams);
      })
      .catch(err => console.error("Błąd pobierania marzeń:", err));
  }, []); 

  useEffect(() => {
    fetch('http://localhost:8081/user')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
            setCurrentUser(data[0]);
        }
      })
      .catch(err => console.error("Błąd pobierania użytkownika:", err));
  }, []);

  return (
    <div className="app-layout">
      
      <DesktopSidebar setView={setActiveView} activeView={activeView} />

      <div className="main-content">
        <MobileHeader setView={setActiveView} />
        
        {/* --- TUTAJ ZMIANA: Wyświetlamy listę lub widok --- */}
        <div className="content-container">
           
           {/* LOGIKA WYŚWIETLANIA */}
           {activeView === 'home' ? (
            <> {/* Pusty fragment (React Fragment), bo zwracamy dwa elementy obok siebie */}
                
                {/* TUTAJ WSTAWIAMY SEKCJE POWITALNĄ */}
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

           /* Mój Profil */
          : activeView === 'myProfil' ? (
            <MyProfile 
            dreams={myDreams}  /* <--- PRZEKAZUJEMY PRAWDZIWE DANE */
            userData={currentUser}  /* <--- PRZEKAZUJEMY DANE */
            />
          )
           
           : (
             // Jeśli inny widok -> Wyświetl pustą kartę
             <div className="content-card">
               <p>Widok: {activeView} (w budowie)</p>
             </div>
           )}

        </div>

        <MobileNav setView={setActiveView} />
      </div>

      <RightFeed />

      {selectedDream && (
        <DreamModal 
          dream={selectedDream} 
          onClose={() => setSelectedDream(null)} 
        />
      )}

    </div>
  )
}

export default App