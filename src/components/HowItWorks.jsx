import React from 'react';
import './HowItWorks.css';
import { PenTool, HeartHandshake, Trophy, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  return (
    <section className="how-it-works">
      <h3 className="hiw-title">SpelnioneMarzenie.pl
      </h3>

        <div className="description">Też masz zawsze ten problem? Co dać w przencie? Urodziny, święta i inne okazje. A może Tobie też kiedyś zdażył się nietrafiony prezent? Twoi bliscy nie wiedzą, czego naprawdę potrzebujesz? Nic dziwnego, niełatwo jest mówić o tym wprost. Mamy na to proste rozwiązanie!</div>
      
      <div className="hiw-steps">

        <div className="hiw-step">
          <div className="step-icon-box">
            <PenTool size={24} />
          </div>
          <span className="step-label">1. Stwórz swoją listę marzeń</span>
          <p className="step-desc">Opisz swoje marzenie, dodaj zdjęcie i określ, czego potrzebujesz.</p>
        </div>

        <ArrowRight className="step-arrow" size={20} />

        <div className="hiw-step">
          <div className="step-icon-box">
            <HeartHandshake size={24} />
          </div>
          <span className="step-label">2. Udostępnij ją rodzinie i znajomym</span>
          <p className="step-desc">Niech każdy wie, przecież okazji jest tak wiele.</p>
        </div>

        <ArrowRight className="step-arrow" size={20} />

        <div className="hiw-step">
          <div className="step-icon-box">
            <Trophy size={24} />
          </div>
          <span className="step-label">3. Ciesz się spełnionymi marzeniami</span>
          <p className="step-desc">Nigdy więcej nietrafionych prezentów!</p>
        </div>

      </div>

        <div className="description">Dzięki systemowi rezerwacji, nadal niespodzianka, nie dubliją się i tak dalej...</div>
    </section>
  );
}