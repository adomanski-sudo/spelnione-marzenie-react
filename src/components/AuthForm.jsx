import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Chrome } from 'lucide-react';
import './AuthForm.css'; // Zaraz stworzymy ten CSS

export default function AuthForm({ onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' lub 'register'
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '', // Dodatkowe pole do weryfikacji
    first_name: '',
    last_name: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Szybka walidacja hasła przy rejestracji
    if (mode === 'register') {
        if (formData.password !== formData.confirmPassword) {
            setError("Hasła muszą być identyczne!");
            return;
        }
    }

    setLoading(true);
    const endpoint = mode === 'register' ? '/api/register' : '/api/login';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data);

      if (mode === 'register') {
        setMode('login');
        setError('Konto gotowe! Zaloguj się.');
        // Czyścimy formularz
        setFormData({ ...formData, password: '', confirmPassword: '' });
      } else {
        onLoginSuccess(data);
      }
    } catch (err) {
      setError(typeof err === 'object' ? err.message || "Błąd serwera" : err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-sidebar-container fade-in">
      
      {/* Przełącznik Logowanie / Rejestracja */}
      <div className="auth-tabs">
          <button 
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => {setMode('login'); setError('')}}
          >
            Logowanie
          </button>
          <button 
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => {setMode('register'); setError('')}}
          >
            Rejestracja
          </button>
      </div>

      {error && <div className="auth-error-mini">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form-compact">
        
        {/* POLA TYLKO DLA REJESTRACJI (Imię/Nazwisko wymagane przez bazę) */}
        {mode === 'register' && (
            <div className="auth-row-compact">
                <input type="text" name="first_name" placeholder="Imię" className="input-compact" onChange={handleChange} required />
                <input type="text" name="last_name" placeholder="Nazwisko" className="input-compact" onChange={handleChange} required />
            </div>
        )}

        {/* E-MAIL (Zawsze) */}
        <div className="input-icon-wrapper">
          <Mail size={14} className="field-icon" />
          <input type="email" name="email" placeholder="E-mail" className="input-compact" onChange={handleChange} required />
        </div>

        {/* HASŁO (Zawsze) */}
        <div className="input-icon-wrapper">
          <Lock size={14} className="field-icon" />
          <input type="password" name="password" placeholder="Hasło" className="input-compact" onChange={handleChange} required />
        </div>

        {/* POWTÓRZ HASŁO (Tylko rejestracja) */}
        {mode === 'register' && (
            <div className="input-icon-wrapper">
                <Lock size={14} className="field-icon" />
                <input type="password" name="confirmPassword" placeholder="Powtórz hasło" className="input-compact" onChange={handleChange} required />
            </div>
        )}

        <button type="submit" className="btn-submit-compact" disabled={loading}>
          {loading ? "..." : (mode === 'login' ? "Wejdź" : "Załóż konto")}
          {!loading && <ArrowRight size={14} />}
        </button>

        {/* PRZYCISK GOOGLE */}
        <button type="button" className="btn-google-compact" onClick={() => alert("Integracja z Google wkrótce!")}>
            <Chrome size={14} /> 
            <span>{mode === 'login' ? "Zaloguj przez Google" : "Dołącz przez Google"}</span>
        </button>

      </form>
    </div>
  );
}