import React, { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Feed from './components/Feed'

function App() {
  // Stan, który pamięta, którą stronę oglądamy (domyślnie 'home')
  const [activeView, setActiveView] = useState('home');

  return (
    // GLÓWNY KONTENER (flex-row układa Sidebar i resztę OBOK siebie)
    <div className="flex min-h-screen bg-brand-light">
      
      {/* 1. LEWA STRONA: Sidebar (Menu) */}
      <Sidebar setView={setActiveView} />

      {/* 2. PRAWY OBSZAR: Cała reszta strony */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* Header na górze sekcji środkowej */}
        <Header />

        {/* WNĘTRZE (Treść + Feed) */}
        <main className="p-6">
          
          {/* Grid: Na dużych ekranach (lg) dzieli się na 3 kolumny (2 dla treści, 1 dla Feeda) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEWA CZĘŚĆ ŚRODKA (Aktywna sekcja) - zajmuje 2 kolumny */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Tutaj wyświetlamy treść w zależności od klikniętego menu */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[300px]">
                <h1 className="text-3xl font-bold text-brand-dark mb-4">
                  {activeView === 'home' && "Witaj na Stronie Głównej! 👋"}
                  {activeView === 'profile' && "Mój Profil 👤"}
                  {activeView === 'search' && "Wyszukiwarka Marzeń 🔍"}
                  {activeView === 'about' && "O Nas ✨"}
                  {activeView === 'contact' && "Kontakt 📞"}
                </h1>
                <p className="text-gray-600">
                  To jest dynamiczny widok. Wybrałeś z menu: <span className="font-bold text-brand-primary uppercase">{activeView}</span>.
                  <br /><br />
                  Tutaj wkrótce pojawią się kafelki marzeń!
                </p>
              </div>

            </div>

            {/* PRAWA CZĘŚĆ ŚRODKA (Feed) - zajmuje 1 kolumnę */}
            <div className="lg:col-span-1">
              <Feed />
              
              {/* Miejsce na coś jeszcze, np. reklamę albo cytat dnia */}
              <div className="mt-6 bg-brand-primary text-white p-6 rounded-xl shadow-lg">
                <p className="italic">"Marzenia się nie spełniają, marzenia się spełnia."</p>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

export default App