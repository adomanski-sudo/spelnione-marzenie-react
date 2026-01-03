import React, { useState } from 'react';
import './EditProfile.css';
import { Save, Lock, User, FileText, Image as ImageIcon } from 'lucide-react';

export default function EditProfile({ currentUser, onUpdateUser }) {
  
  const [formData, setFormData] = useState({
    first_name: currentUser?.first_name || '',
    last_name: currentUser?.last_name || '',
    description: currentUser?.description || '',
    image: currentUser?.image || '',
    password: '',
    confirmPassword: '' // <--- NOWE POLE
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Walidacja haseł (Sprawdzamy tylko, jeśli użytkownik wpisał cokolwiek w hasło)
    if (formData.password && formData.password !== formData.confirmPassword) {
        alert("Błąd: Hasła nie są takie same! Sprawdź literówki.");
        return; // Zatrzymujemy wysyłanie
    }

    // Pobierz token
    const storedUser = localStorage.getItem('loggedUser');
    const token = storedUser ? JSON.parse(storedUser).token : null;

    fetch('/api/user', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        // Backend ignoruje pole confirmPassword, więc możemy wysłać całość
        body: JSON.stringify(formData) 
    })
    .then(res => {
        if (!res.ok) throw new Error("Błąd aktualizacji");
        return res.json();
    })
    .then(updatedUser => {
        alert("Profil zaktualizowany!");
        onUpdateUser(updatedUser);
    })
    .catch(err => {
        console.error(err);
        alert("Coś poszło nie tak.");
    });
  };

  return (
    <div className="edit-profile-container fade-in">
      <h2 className="section-title">Edytuj Profil</h2>
      
      <form onSubmit={handleSubmit} className="edit-form">
        
        {/* IMIĘ I NAZWISKO */}
        <div className="form-row">
            <div className="form-group">
                <label><User size={16}/> Imię</label>
                <input 
                    type="text" name="first_name" 
                    value={formData.first_name} onChange={handleChange} 
                />
            </div>
            <div className="form-group">
                <label>Nazwisko</label>
                <input 
                    type="text" name="last_name" 
                    value={formData.last_name} onChange={handleChange} 
                />
            </div>
        </div>

        {/* OPIS */}
        <div className="form-group">
            <label><FileText size={16}/> O mnie (Opis)</label>
            <textarea 
                name="description" rows="4"
                value={formData.description} onChange={handleChange}
                placeholder="Napisz coś o sobie..."
            />
        </div>

        {/* AWATAR (LINK) */}
        <div className="form-group">
            <label><ImageIcon size={16}/> Link do zdjęcia (Avatar)</label>
            <input 
                type="text" name="image" 
                value={formData.image} onChange={handleChange} 
                placeholder="https://..."
            />
            {formData.image && (
                <div className="avatar-preview">
                    <img src={formData.image} alt="Podgląd" onError={(e) => e.target.style.display='none'}/>
                    <span>Podgląd zdjęcia</span>
                </div>
            )}
        </div>

        {/* SEKCJJA ZMIANY HASŁA */}
        <div className="form-row">
            <div className="form-group password-group">
                <label><Lock size={16}/> Nowe hasło</label>
                <input 
                    type="password" name="password" 
                    value={formData.password} onChange={handleChange} 
                    placeholder="••••••••"
                />
            </div>
            
            {/* Pole pojawia się tylko, gdy zaczniemy pisać hasło (opcjonalny bajer UI) 
                lub jest zawsze widoczne. Zróbmy, że jest zawsze dla czytelności. */}
            <div className="form-group password-group">
                <label><Lock size={16}/> Powtórz hasło</label>
                <input 
                    type="password" name="confirmPassword" 
                    value={formData.confirmPassword} onChange={handleChange} 
                    placeholder="••••••••"
                    disabled={!formData.password} // Zablokowane, dopóki nie wpiszesz hasła
                    style={!formData.password ? {backgroundColor: '#f1f5f9', cursor: 'not-allowed'} : {}}
                />
            </div>
        </div>
        <p style={{fontSize: '0.8rem', color: '#94a3b8', marginTop: '-15px'}}>
            * Zostaw pola hasła puste, jeśli nie chcesz go zmieniać.
        </p>

        <button type="submit" className="btn-save">
            <Save size={20} /> Zapisz Zmiany
        </button>

      </form>
    </div>
  );
}