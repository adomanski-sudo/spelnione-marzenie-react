import { useState } from "react";
import axios from "axios";
import { Gift, Clock, Smile, ImageIcon, Globe, Lock, Compass, MousePointerClick } from 'lucide-react';
import './AuthForm.css';
import './AddDreamForm.css';

// Te same widełki co w EditDreamForm (ważne, żeby były identyczne!)
const PRICE_RANGES = [
  { label: 'Do 100 zł', min: 0, max: 100 },
  { label: '100 - 300 zł', min: 100, max: 300 },
  { label: '300 - 500 zł', min: 300, max: 500 },
  { label: '500 - 1000 zł', min: 500, max: 1000 },
  { label: 'Powyżej 1000 zł', min: 1000, max: null },
];

export default function AddDreamForm({ onAdd, onCancel }) {
  // Stan wariantu prezentu (Pomysł vs Konkret)
  const [giftVariant, setGiftVariant] = useState('idea');
  const [error, setError] = useState(null);

  // Główny stan formularza (prosty, bez min/max)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',       // Tu trzymamy cenę LUB index widełek
    type: 'time',    // Domyślnie czas
    image: '',
    is_public: true
  });

  // Uniwersalna obsługa zmian
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // --- WYSYŁKA (TU DZIEJE SIĘ MAGIA OBLICZEŃ) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // 1. Budujemy czysty obiekt do wysyłki
    let payload = {
        title: formData.title,
        description: formData.description,
        image: formData.image,
        type: formData.type,
        is_public: formData.is_public ? 1 : 0,
        price_min: null,
        price_max: null
    };

    // 2. Logika Cenowa (Identyczna jak w EditDreamForm)
    if (formData.type === 'gift') {
        if (giftVariant === 'model') {
            // Jeśli wybrano widełki, formData.price to INDEX tablicy
            const index = parseInt(formData.price);
            
            // Sprawdzamy czy index jest poprawny i bierzemy dane z tablicy stałych
            if (!isNaN(index) && PRICE_RANGES[index]) {
                payload.price_min = PRICE_RANGES[index].min;
                payload.price_max = PRICE_RANGES[index].max;
            }
        } else {
            // Jeśli wybrano konkret, formData.price to KWOTA
            if (formData.price) {
                payload.price_min = formData.price;
                payload.price_max = formData.price;
            }
        }
    }

    console.log("🚀 Wysyłam payload:", payload);

    try {
      await axios.post("http://localhost:3000/api/dreams", payload, {
          withCredentials: true 
      });

      // Sukces!
      if (onAdd) onAdd(); 
      
      // Reset formularza (opcjonalne, bo modal i tak się zamknie)
      setFormData({
        title: '', description: '', price: '', type: 'gift', image: '', is_public: true
      });

    } catch (err) {
      console.error("❌ Błąd wysyłki:", err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
         setError("Sesja wygasła. Zaloguj się ponownie.");
      } else {
         setError("Błąd serwera. Spróbuj ponownie.");
      }
    }
  };

  // --- RENDEROWANIE PÓL (To samo co w EditDreamForm) ---
  const renderFields = () => {
    
    // 1. PREZENT 💡
    if (formData.type === 'gift') {
        return (
            <div className="fade-in">
                <div className="form-group">
                    <label>Tytuł</label>
                    <input 
                        type="text" name="title" 
                        placeholder={giftVariant === 'model' ? "np. Słuchawki Sony" : "np. Wełniany sweter"} 
                        value={formData.title} onChange={handleChange} required 
                    />
                </div>

                <div className="form-group">
                    <label>Zdjęcie (URL)</label>
                    <div className="input-with-icon">
                        <ImageIcon size={16} />
                        <input type="text" name="image" placeholder="Wklej link do zdjęcia..." value={formData.image} onChange={handleChange} />
                    </div>
                </div>

                {/* LOGIKA WIDOKU CENY */}
                {giftVariant === 'model' ? (
                <div className="form-group">
                    <label>Przedział cenowy</label>
                    {/* Zwykły select z handleChange - zapisuje index do formData.price */}
                    <select name="price" value={formData.price} onChange={handleChange} className="price-select">
                         <option value="">Wybierz widełki...</option>
                         {PRICE_RANGES.map((range, index) => (
                            <option key={index} value={index}>{range.label}</option>
                        ))}
                    </select>
                </div> 
                ) : (
                <div className="form-group">
                    <label>Przybliżona cena</label>
                    <input type="number" name="price" placeholder="np. 100" value={formData.price} onChange={handleChange} />
                </div>
                )}

                <div className="form-group">
                    <label>Opis</label>
                    <textarea name="description" placeholder="Dlaczego to marzenie jest ważne?" rows="4" value={formData.description} onChange={handleChange} />
                </div>
            </div>
        );
    }

    // 2. CZAS 🕰️ i 3. UŚMIECH 😊 (Uproszczone)
    return (
        <div className="fade-in">
            <div className="form-group">
                <label>Tytuł</label>
                <input type="text" name="title" placeholder="Tytuł marzenia..." value={formData.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Zdjęcie (URL)</label>
                <div className="input-with-icon">
                    <ImageIcon size={16} />
                    <input type="text" name="image" placeholder="Link do zdjęcia..." value={formData.image} onChange={handleChange} />
                </div>
            </div>
            <div className="form-group">
                <label>Opis</label>
                <textarea name="description" placeholder="Opis..." rows="4" value={formData.description} onChange={handleChange} />
            </div>
        </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="add-dream-form fade-in">
      
      {/* WYBÓR TYPU */}
      <div className="type-selector-container" style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
        <button type="button" onClick={() => setFormData({...formData, type: 'time'})} className={`type-btn ${formData.type === 'time' ? 'active' : ''}`}><Clock size={20}/> Czas</button>
        <button type="button" onClick={() => setFormData({...formData, type: 'gift'})} className={`type-btn ${formData.type === 'gift' ? 'active' : ''}`}><Gift size={20}/> Prezent</button>
        <button type="button" onClick={() => setFormData({...formData, type: 'smile'})} className={`type-btn ${formData.type === 'smile' ? 'active' : ''}`}><Smile size={20}/> Uśmiech</button>
      </div>

      {formData.type === 'time' && (
            <div className="info-text fade-in">
                Wspólny czas, doświadczenia, tworzenie wspomnień, aktywności.
            </div>
        )}

        {formData.type === 'smile' && (
            <div className="info-text fade-in">
                Zawsze mile widziane. Drobnostki, które sprawiają, że się uśmiechasz.
            </div>
        )}


      {/* SWITCH IDEA/MODEL (Tylko Prezent) */}
      {formData.type === 'gift' && (
        <div className="gift-switch-container fade-in" style={{marginBottom: '15px'}}>
             <button 
             type="button" 
             onClick={() => setGiftVariant('idea')} 
             className={giftVariant === 'idea' ? 'active' : ''} 
             style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}><Compass size={16}/> Pomysł</button>
             <button 
             type="button" 
             onClick={() => setGiftVariant('model')} 
             className={giftVariant === 'model' ? 'active' : ''} 
             style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}><MousePointerClick size={16}/> Konkret</button>
        </div>
      )}

      {/* ZAWARTOŚĆ */}
      <div className="form-content">{renderFields()}</div>

      {/* PUBLICZNE/PRYWATNE */}
      <div className="gift-switch-container" style={{marginTop: '15px'}}>
            <button type="button" onClick={() => setFormData({...formData, is_public: true})} className={formData.is_public ? 'active' : ''} style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}><Globe size={16}/> Publiczne</button>
            <button type="button" onClick={() => setFormData({...formData, is_public: false})} className={!formData.is_public ? 'active' : ''} style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}><Lock size={16}/> Prywatne</button>
      </div>

      {error && <p className="error-text" style={{color: 'red', textAlign:'center', marginTop:'10px'}}>{error}</p>}

      <div className="form-actions" style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
        <button type="button" onClick={onCancel} className="btn-secondary" style={{flex: 1}}>Anuluj</button>
        <button type="submit" className="btn-primary" style={{flex: 1}}>Dodaj marzenie</button>
      </div>
    </form>
  );
}