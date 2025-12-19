import React from 'react';
import './MyProfile.css';
import DreamCard from './DreamCard'; 
import avatarImg from '../assets/avatar.jpg'; 
import { Edit3, Plus } from 'lucide-react';

export default function MyProfile() {
  
  // MOCK DATA (bez zmian)
  const myDreams = [
    {
      id: 101,
      category: "Nauka",
      title: "Własna aplikacja webowa",
      description: "Chcę stworzyć portal SpelnioneMarzenie.pl. Potrzebuję wsparcia merytorycznego.",
      image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=600&q=80",
      userAvatar: avatarImg,
      userName: "Adrian Domański",
      date: "Dodano wczoraj"
    },
    {
      id: 102,
      category: "Relaks",
      title: "Wyjazd w Bieszczady",
      description: "Tydzień w drewnianej chacie bez zasięgu. Potrzebuję tylko dobrej książki i ciszy.",
      image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80",
      userAvatar: avatarImg,
      userName: "Adrian Domański",
      date: "Dodano tydzień temu"
    },
    {
        id: 103,
        title: "Kurs Stolarki",
        category: "Nauka",
        description: "Chciałbym nauczyć się robić proste meble. Może ktoś zna dobrego mistrza w okolicy?",
        image: "https://images.unsplash.com/photo-1610555356070-d0efb6505f81?auto=format&fit=crop&w=600&q=80",
        userAvatar: avatarImg,
        userName: "Adrian Domański",
        date: "Dodano miesiąc temu"
      }
  ];

  return (
    <div className="profile-split-view">
      
      {/* LEWA KOLUMNA: WIZYTÓWKA */}
      <aside className="bio-column">
        <div className="bio-card">
          
          {/* GÓRA: Awatar i przyciski */}
          <div className="avatar-wrapper">
            
            {/* LEWY PRZYCISK (Edytuj) */}
            <button className="circle-action-btn edit-btn">
              <Edit3 size={22} />
              <span className="btn-label">Edytuj profil</span>
            </button>

            {/* AWATAR */}
            <img src={avatarImg} alt="Profil" className="bio-avatar" />
            
            {/* PRAWY PRZYCISK (Dodaj) */}
            <button className="circle-action-btn add-btn">
               <Plus size={22} />
               <span className="btn-label">Dodaj marzenie</span>
            </button>

          </div>
          
          <h2 className="bio-name">Adrian Domański</h2>
          
          {/* ŚRODEK: Opis wycentrowany w pionie */}
          <div className="bio-content-wrapper">
            <p className="bio-text">
                Lubię proste rzeczy i sensowne marzenia — czasem są to przedmioty, a czasem chwile, które dobrze zapadają w pamięć.
                Ta lista to zbiór pomysłów na rzeczy, które chciałbym zrobić, przeżyć albo po prostu sprawdzić, czy rzeczywiście są tak dobre, jak mi się wydaje.

                Jeśli trafiłeś tu, bo szukasz prezentu — jesteś w dobrym miejscu.
                Jeśli z ciekawości — też okej.
                A jeśli któreś z tych marzeń kiedyś się spełni, to znak, że ten pomysł naprawdę działa.
            </p>
          </div>

        </div>
      </aside>

      {/* PRAWA KOLUMNA: LISTA MARZEŃ */}
      <main className="dreams-column">
        <div className="dreams-grid-compact">
            {myDreams.map(dream => (
                <DreamCard 
                key={dream.id} 
                dream={dream} 
                showAuthor={false}
                />
            ))}
        </div>
      </main>

    </div>
  );
}