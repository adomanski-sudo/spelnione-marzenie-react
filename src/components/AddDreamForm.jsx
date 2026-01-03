import React, { useState } from 'react';
import './EditProfile.css'; // Użyjemy tych samych stylów co przy edycji profilu!
import { Save, ArrowLeft, Type, Tag, DollarSign, Image as ImageIcon, FileText } from 'lucide-react';

export default function AddDreamForm({ onCancel, onSuccess }) {
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Inne',
    price: '',
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
            <div className="form-group">
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
            </div>
            <div className="form-group">
                <label><DollarSign size={16}/> Cena (opcjonalne)</label>
                <input 
                    type="text" name="price" placeholder="np. 500 zł" 
                    value={formData.price} onChange={handleChange}
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