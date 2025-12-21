import React from 'react';
import './SearchSection.css'; // <--- RECYKLING STYLÓW! 😎

export default function FriendsSection({ friends }) {
  return (
    <div className="search-container fade-in">
      
      {/* Używamy tej samej siatki co w wyszukiwarce */}
      <div className="users-grid">
         {friends.map(user => (
            <div 
              key={user.id} 
              className="user-search-card"
              style={{ cursor: 'pointer' }}
              onClick={() => console.log("Otwórz profil:", user.id)}
            >
               <img src={user.image} alt="Avatar" className="user-search-avatar" />
               
               <div className="user-search-info">
                  <h4 className="user-search-name">{user.first_name} {user.last_name}</h4>
                  <p className="user-search-desc">
                      {user.description ? user.description.substring(0, 100) + '...' : 'Brak opisu'}
                  </p>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}