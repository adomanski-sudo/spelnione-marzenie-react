import React, { useState } from 'react';
import './EditProfile.css'; // Użyjemy tych samych stylów co przy edycji profilu!
import { Save, ArrowLeft, Type, Tag, DollarSign, Image as ImageIcon, FileText, Gift, Clock, Smile } from 'lucide-react';

export default function AddDreamForm({ onCancel, onSuccess }) {
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Inne',
    price: '',
    type: 'gift', // <--- Domyślnie prezent
    image: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const storedUser = localStorage.getItem('loggedUser');
    const token = storedUser ? JSON.parse(storedUser).token : null;

    fetch('/api/dreams', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(formData)
    })
    .then(res => {
        if (!res.ok) throw new Error("Błąd dodawania");
        return res.json();
    })
    .then(() => {
        alert("Marzenie dodane! 🌠");
        onSuccess(); // Odśwież listę i wróć
    })
    .catch(err => alert("Błąd: " + err.message));
  };

  return (
    <div className="edit-profile-container fade-in" style={{height: '100%', width: '100%'}}>
      
      {/* Przycisk powrotu */}
      <button className="btn-back" onClick={onCancel} style={{marginBottom: '20px'}}>
        <ArrowLeft size={20} /> Anuluj dodawanie
      </button>

      <h2 className="section-title">Nowe Marzenie</h2>
      
      <form onSubmit={handleSubmit} className="edit-form">

        <div className="type-selector-container" style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>

        {/* Opcja 1: WSPÓLNY CZAS */}
        <button
          type="button"
          onClick={() => setFormData({...formData, type: 'time', price: ''})} // Czyścimy cenę!
          className={`type-btn ${formData.type === 'time' ? 'active' : ''}`}
          style={{
            flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0',
            background: formData.type === 'time' ? '#eff6ff' : 'white',
            borderColor: formData.type === 'time' ? '#2563eb' : '#e2e8f0',
            cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px'
          }}
        >
          <Clock size={20} color={formData.type === 'time' ? '#2563eb' : '#64748b'} />
          <span style={{fontSize: '12px', fontWeight: 600, color: formData.type === 'time' ? '#2563eb' : '#64748b'}}>Wspólny czas</span>
        </button>
        
        {/* Opcja 2: PREZENT */}
        <button
          type="button" // Ważne: żeby nie wysyłało formularza!
          onClick={() => setFormData({...formData, type: 'gift'})}
          className={`type-btn ${formData.type === 'gift' ? 'active' : ''}`}
          style={{
            flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0',
            background: formData.type === 'gift' ? '#eff6ff' : 'white',
            borderColor: formData.type === 'gift' ? '#2563eb' : '#e2e8f0',
            cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px'
          }}
        >
          <Gift size={20} color={formData.type === 'gift' ? '#2563eb' : '#64748b'} />
          <span style={{fontSize: '12px', fontWeight: 600, color: formData.type === 'gift' ? '#2563eb' : '#64748b'}}>Prezent</span>
        </button>

        {/* Opcja 3: UŚMIECH */}
        <button
          type="button"
          onClick={() => setFormData({...formData, type: 'smile', price: ''})} // Czyścimy cenę!
          className={`type-btn ${formData.type === 'smile' ? 'active' : ''}`}
          style={{
            flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0',
            background: formData.type === 'smile' ? '#eff6ff' : 'white',
            borderColor: formData.type === 'smile' ? '#2563eb' : '#e2e8f0',
            cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px'
          }}
        >
          <Smile size={20} color={formData.type === 'smile' ? '#2563eb' : '#64748b'} />
          <span style={{fontSize: '12px', fontWeight: 600, color: formData.type === 'smile' ? '#2563eb' : '#64748b'}}>Uśmiech</span>
        </button>
      </div>
        
        {/* TYTUŁ */}
        <div className="form-group">
            <label><Type size={16}/> Tytuł</label>
            <input 
                type="text" name="title" placeholder="O czym marzysz?" required 
                value={formData.title} onChange={handleChange}
            />
        </div>

        {/* KATEGORIA I CENA (Obok siebie) */}
        <div className="form-row">
            {/* <div className="form-group">
                <label><Tag size={16}/> Kategoria</label>
                <select name="category" value={formData.category} onChange={handleChange} 
                        style={{padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0'}}>
                    <option value="Inne">Inne</option>
                    <option value="Podróże">Podróże ✈️</option>
                    <option value="Elektronika">Elektronika 💻</option>
                    <option value="Sport">Sport ⚽</option>
                    <option value="Sztuka">Sztuka 🎨</option>
                    <option value="Motoryzacja">Motoryzacja 🚗</option>
                    <option value="Dom">Dom 🏠</option>
                </select>
            </div> */}
            <div className="form-group">
          <label>Przybliżona cena / Zakres</label>
          <input 
            type="text" 
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="np. 100-200 zł"
          />
        </div>
        </div>

        {/* LINK DO ZDJĘCIA */}
        <div className="form-group">
            <label><ImageIcon size={16}/> Link do zdjęcia</label>
            <input 
                type="text" name="image" placeholder="https://..." 
                value={formData.image} onChange={handleChange}
            />
            {formData.image && (
                <div className="avatar-preview" style={{borderRadius: '10px'}}>
                    <img src={formData.image} alt="Podgląd" style={{width: '100%', height: '150px', borderRadius: '10px'}} onError={(e) => e.target.style.display='none'}/>
                </div>
            )}
        </div>

        {/* OPIS */}
        <div className="form-group">
            <label><FileText size={16}/> Opis</label>
            <textarea 
                name="description" rows="5" placeholder="Opisz to marzenie..."
                value={formData.description} onChange={handleChange}
            />
        </div>

        <button type="submit" className="btn-save" style={{marginTop: '10px'}}>
            <Save size={20} /> Dodaj do listy
        </button>

      </form>
    </div>
  );
}