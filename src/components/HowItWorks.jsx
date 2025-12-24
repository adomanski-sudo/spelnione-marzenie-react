import React from 'react';
import './HowItWorks.css';
import { PenTool, ArrowRight, MessageCircleHeart, Gift, Cake, HeartHandshake, Sparkles } from 'lucide-react';


export default function HowItWorks() {
  return (
    <section className="how-it-works">
      <div className="brand-logo-container fade-in">
        <Sparkles className="brand-icon" size={32} />
        <h1 className="brand-text">SpelnioneMarzenie.pl</h1>
      </div>

        <span className="up-note"><p>Nie wiesz co dać w prezencie?</p>
        <p>Masz dość nietrafionych nispodzianek?</p>
         <p>SpelnioneMarzenie.pl rozwiązuje ten problem w prosty sposób:</p></span>

      
      <div className="hiw-steps">

        <div className="hiw-step">
          <div className="step-icon-box">
            <PenTool size={24} />
          </div>
          <span className="step-label">1. Tworzysz listę swoich marzeń</span>
          <p className="step-desc">Dodajesz rzeczy, doświadczenia i pomysły — od przedmiotów po wspólne chwile.</p>
        </div>

        <ArrowRight className="step-arrow" size={20} />

        <div className="hiw-step">
          <div className="step-icon-box">
            <MessageCircleHeart size={24} />
          </div>
          <span className="step-label">2. Bliscy zaglądają na Twój profil</span>
          <p className="step-desc">Gdy ktoś szuka prezentu, widzi dokładnie to, czego pragniesz.</p>
        </div>

        <ArrowRight className="step-arrow" size={20} />

        <div className="hiw-step">
          <div className="step-icon-box">
            <Cake size={24} />
          </div>
          <span className="step-label">3. Rezerwacja bez zdradzania niespodzianki</span>
          <p className="step-desc">Rezerwują marzenie — Ty o tym nie wiesz,
          ale inni widzą ostrzeżenie, że prezent jest już zajęty.</p>
        </div>

        <ArrowRight className="step-arrow" size={20} />

        <div className="hiw-step">
          <div className="step-icon-box">
            <HeartHandshake  ft size={24} />
          </div>
          <span className="step-label">4. Zrzutka na większe marzenia</span>
          <p className="step-desc">Kilka osób może wspólnie spełnić jedno marzenie — nawet jeśli się nie znają.</p>
        </div>

        <ArrowRight className="step-arrow" size={20} />

        <div className="hiw-step">
          <div className="step-icon-box">
            <Gift  ft size={24} />
          </div>
          <span className="step-label"><p>5. Zero dubli.</p>
          <p>Zero nietrafionych prezentów.</p></span>
          <p className="step-desc">Tylko spełnione marzenia.</p>
        </div>

      </div>
    </section>
  );
}