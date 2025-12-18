import React, { useState } from 'react'
import "./App.css"; // Globalne
import DesktopSidebar from "./components/DesktopSidebar";
import RightFeed from "./components/RightFeed";
import MobileHeader from "./components/MobileHeader";
import MobileNav from "./components/MobileNav";
import DreamCard from "./components/DreamCard";

function App() {
  const [activeView, setActiveView] = useState('home');

  // --- MOCK DATA (Udajemy bazę danych) ---
  const dreams = [
    {
      id: 1,
      title: "Podróż kamperem po Norwegii",
      description: "Marzę o tym, żeby wynająć kampera i przejechać trasę atlantycką. Chcę zobaczyć fiordy o wschodzie słońca.",
      image: "https://plus.unsplash.com/premium_photo-1661964372184-73651adc2f78?q=80&w=1012&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      userName: "Tomek Podróżnik",
      date: "2 godz. temu"
    },
    {
      id: 2,
      title: "Profesjonalny kurs baristyczny",
      description: "Uwielbiam kawę i chciałabym nauczyć się robić idealne latte art. Szukam sponsora na kurs I stopnia.",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80",
      userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
      userName: "Anna Coffee",
      date: "5 godz. temu"
    },
    {
      id: 3,
      title: "Gitara elektryczna Fender",
      description: "Moja stara gitara już nie stroi. Marzę o Fenderze Stratocasterze, żeby założyć zespół rockowy z kumplami.",
      image: "https://images.unsplash.com/photo-1520166012956-add9ba0835cb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      userAvatar: "https://randomuser.me/api/portraits/men/85.jpg",
      userName: "Rockowy Marek",
      date: "1 dzień temu"
    },
     {
      id: 4,
      title: "Skok ze spadochronem",
      description: "Chcę przełamać swój lęk wysokości. To moje największe marzenie od dzieciństwa!",
      image: "https://plus.unsplash.com/premium_photo-1664391672112-70a2ad8cccb0?q=80&w=1036&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      userAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
      userName: "Odważna Jola",
      date: "2 dni temu"
    }
  ];

  return (
    <div className="app-layout">
      
      <DesktopSidebar setView={setActiveView} activeView={activeView} />

      <div className="main-content">
        <MobileHeader setView={setActiveView} />
        
        {/* --- TUTAJ ZMIANA: Wyświetlamy listę lub widok --- */}
        <div className="content-container">
           
           <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
             {activeView === 'home' ? 'Najnowsze Marzenia ✨' : activeView}
           </h2>

           {/* LOGIKA WYŚWIETLANIA */}
           {activeView === 'home' ? (
             // Jeśli jesteśmy na HOME -> Wyświetl Grid z kartami
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {dreams.map((dream) => (
                  <DreamCard key={dream.id} dream={dream} />
                ))}
             </div>
           ) : (
             // Jeśli inny widok -> Wyświetl pustą kartę
             <div className="content-card">
               <p>Widok: {activeView} (w budowie)</p>
             </div>
           )}

        </div>

        <MobileNav setView={setActiveView} />
      </div>

      <RightFeed />

    </div>
  )
}

export default App