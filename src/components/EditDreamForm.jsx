import React, { useState } from 'react';
import './EditProfile.css'; // Używamy tych samych stylów
import { Save, ArrowLeft, Type, Tag, DollarSign, Image as ImageIcon, FileText } from 'lucide-react';

export default function EditDreamForm({ dreamData, onCancel, onSuccess }) {
  
  // Wypełniamy formularz danymi startowymi (z activeDream)
  const [formData, setFormData] = useState({
    title: dreamData.title || '',
    description: dreamData.description || '',
    category: dreamData.category || 'Inne',
    price: dreamData.price || '',
    image: dreamData.image || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const storedUser = localStorage.getItem('loggedUser');
    const token = storedUser ? JSON.parse(storedUser).token : null;

    // Wysyłamy PUT na konkretne ID
    fetch(`/api/dreams/${dreamData.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(formData)
    })
    .then(res => {
        if (!res.ok) throw new Error("Błąd aktualizacji");
        return res.json();
    })
    .then(() => {
        alert("Marzenie zaktualizowane! ✨");
        // Odsyłamy zaktualizowane dane wyżej, żeby odświeżyć widok szczegółów
        onSuccess({ ...dreamData, ...formData }); 
    })
    .catch(err => alert("Błąd: " + err.message));
  };

  return (
    <div className="edit-profile-container fade-in" style={{height: '100%', width: '100%'}}>
      
      {/* Przycisk powrotu (Wraca do szczegółów, nie do listy) */}
      <button className="btn-back" onClick={onCancel} style={{marginBottom: '20px'}}>
        <ArrowLeft size={20} /> Anuluj edycję
      </button>

      <h2 className="section-title">Edytuj Marzenie</h2>
      
      <form onSubmit={handleSubmit} className="edit-form">
        
        {/* TYTUŁ */}
        <div className="form-group">
            <label><Type size={16}/> Tytuł</label>
            <input 
                type="text" name="title" required 
                value={formData.title} onChange={handleChange}
            />
        </div>

        {/* KATEGORIA I CENA */}
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
                <label><DollarSign size={16}/> Cena</label>
                <input 
                    type="text" name="price" 
                    value={formData.price} onChange={handleChange}
                />
            </div>
        </div>

        {/* LINK DO ZDJĘCIA */}
        <div className="form-group">
            <label><ImageIcon size={16}/> Link do zdjęcia</label>
            <input 
                type="text" name="image" 
                value={formData.image} onChange={handleChange}
            />
        </div>

        {/* OPIS */}
        <div className="form-group">
            <label><FileText size={16}/> Opis</label>
            <textarea 
                name="description" rows="5"
                value={formData.description} onChange={handleChange}
            />
        </div>

        <button type="submit" className="btn-save" style={{marginTop: '10px'}}>
            <Save size={20} /> Zapisz Zmiany
        </button>

      </form>
    </div>
  );
}