import React from 'react';
import logoImg from './img/logo.png'; 

export default function Header() {
  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-brand-light shadow-sm px-6 py-3">
      <div className="flex justify-between items-center h-10">
        
        {/* LEWA STRONA */}
        <div className="flex items-center gap-4">
          
          {/* Przycisk Hamburgera (Tylko Mobile) */}
          <button className="md:hidden text-gray-500 hover:text-brand-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {/* Nazwa widoku lub powitanie */}
          <h2 className="text-xl font-bold text-brand-dark tracking-tight hidden md:block">
            Panel Użytkownika
          </h2>
          
          {/* Na mobile pokazujemy nazwę apki, bo Sidebar jest ukryty */}
          <h2 className="text-lg font-bold text-brand-dark tracking-tight md:hidden">
            SpelnioneMarzenie.pl
          </h2>
        </div>

        {/* PRAWA STRONA (Profil, Logo, Akcje) */}
        <div className="flex items-center gap-4">
          
          {/* Przykładowa ikonka powiadomień */}
          <button className="text-gray-400 hover:text-brand-gold transition-colors relative">
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
          </button>

          {/* Rozdzielacz */}
          <div className="h-6 w-px bg-gray-200"></div>

          {/* User + Logo */}
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-brand-dark leading-none">Twój Profil</p>
              <p className="text-xs text-gray-500">Wyloguj</p>
            </div>
            <img 
              src={logoImg} 
              alt="Logo" 
              className="w-10 h-10 rounded-full object-cover border-2 border-brand-gold shadow-sm"
            />
          </div>

        </div>

      </div>
    </header>
  );
}