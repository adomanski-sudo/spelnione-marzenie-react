import React from 'react';

export default function Sidebar({ setView }) {
  const menuItems = [
    { id: 'home', label: 'Strona Główna', icon: '🏠' },
    { id: 'profile', label: 'Mój Profil', icon: '👤' },
    { id: 'search', label: 'Szukaj', icon: '🔍' },
    { id: 'about', label: 'O nas', icon: '✨' },
    { id: 'contact', label: 'Kontakt', icon: '📞' },
  ];

  return (
    // Ukrywamy na telefonach (hidden), pokazujemy na ekranach md+ (md:flex)
    <aside className="hidden md:flex flex-col w-64 h-screen bg-brand-dark text-white sticky top-0 overflow-y-auto shadow-xl">
      
      {/* Logo / Nazwa w Sidebarze */}
      <div className="p-6 border-b border-indigo-900">
        <h2 className="text-2xl font-bold text-brand-gold">Menu</h2>
      </div>

      {/* Lista linków */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button 
                onClick={() => setView(item.id)} // Tu zmieniamy widok!
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-brand-primary transition-colors text-left"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Stopka Sidebara */}
      <div className="p-4 border-t border-indigo-900 text-xs text-indigo-400 text-center">
        &copy; 2025 SpelnioneMarzenie.pl
      </div>
    </aside>
  );
}