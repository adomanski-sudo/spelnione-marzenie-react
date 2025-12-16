import React, { useState } from 'react'
import './App.css' // <--- Gółwny styl strony
import DesktopSidebar from './components/DesktopSidebar'
import RightFeed from './components/RightFeed'
import MobileHeader from './components/MobileHeader'
import MobileNav from './components/MobileNav'

function App() {
  const [activeView, setActiveView] = useState('home');

  return (
    <div className="app-layout">
      
      {/* Lewy Panel */}
      <DesktopSidebar setView={setActiveView} activeView={activeView} />

      {/* Środek */}
      <div className="main-content">
        <MobileHeader setView={setActiveView} />
        
        <div className="content-card">
          <h2>Widok: {activeView}</h2>
          <p>Tu będzie treść. Oczy już nie bolą?</p>
        </div>

        <MobileNav setView={setActiveView} />
      </div>

      {/* Prawy Panel */}
      <RightFeed />

    </div>
  )
}

export default App