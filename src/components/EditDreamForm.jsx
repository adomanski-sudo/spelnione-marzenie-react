import { useState, useEffect } from "react";
import axios from "axios";
import { Gift, Clock, Smile, ImageIcon, Globe, Lock, Compass, MousePointerClick } from 'lucide-react';
import './AuthForm.css';
import './AddDreamForm.css';

const PRICE_RANGES = [
  { label: 'Do 100 zł', min: 0, max: 100 },
  { label: '100 - 300 zł', min: 100, max: 300 },
  { label: '300 - 500 zł', min: 300, max: 500 },
  { label: '500 - 1000 zł', min: 500, max: 1000 },
  { label: 'Powyżej 1000 zł', min: 1000, max: null },
];

export default function EditDreamForm({ dream, onUpdate, onCancel }) {
  // 1. Inicjalizacja stanu (domyślne wartości)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',       
    type: 'time',
    image: '',
    is_public: true
  });

  const [giftVariant, setGiftVariant] = useState('idea');
  const [error, setError] = useState(null);

  // 2. WCZYTYWANIE DANYCH
  // --- 1. WCZYTYWANIE DANYCH (Poprawiona logika dla "Powyżej 1000") ---
  useEffect(() => {
    if (dream) {
      let initialPrice = '';
      let initialVariant = 'idea';

      const pMin = parseFloat(dream.price_min);
      const pMax = parseFloat(dream.price_max);

      // 1. Najpierw sprawdzamy, czy te liczby pasują do któregoś z naszych PRZEDZIAŁÓW (Model)
      const foundIndex = PRICE_RANGES.findIndex(range => {
          // Przypadek A: Zwykły przedział zamknięty (np. 100-300)
          if (range.max !== null) {
              return range.min == pMin && range.max == pMax;
          }
          // Przypadek B: Przedział otwarty (np. Powyżej 1000) - TU BYŁ PIES POGRZEBANY 🐕
          // Sprawdzamy czy min się zgadza ORAZ czy max w bazie jest nullem
          else {
              return range.min == pMin && (dream.price_max === null);
          }
      });

      if (foundIndex !== -1) {
          // ZNALEZIONO PASUJĄCY PRZEDZIAŁ!
          initialVariant = 'model';
          initialPrice = foundIndex.toString();
      } 
      // 2. Jeśli nie pasuje do żadnego przedziału, ale ma cenę -> to "Pomysł"
      else if (!isNaN(pMin)) {
          initialVariant = 'idea';
          initialPrice = pMin;
      }

      // Ustawiamy stany
      setGiftVariant(initialVariant);
      setFormData({
        title: dream.title || '',
        description: dream.description || '',
        image: dream.image || '',
        type: dream.type || 'time',
        is_public: (dream.is_public == 1 || dream.is_public === true),
        price: initialPrice 
      });
    }
  }, [dream]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Budujemy obiekt do wysyłki
    let payload = {
        title: formData.title,
        description: formData.description,
        image: formData.image,
        type: formData.type,
        is_public: formData.is_public ? 1 : 0,
        price_min: null,
        price_max: null
    };

    // Logika Cenowa (Tłumaczymy formularz na bazę)
    if (formData.type === 'gift') {
        if (giftVariant === 'model') {
            // formData.price to INDEX tablicy
            const index = parseInt(formData.price);
            if (!isNaN(index) && PRICE_RANGES[index]) {
                payload.price_min = PRICE_RANGES[index].min;
                payload.price_max = PRICE_RANGES[index].max;
            }
        } else {
            // formData.price to KWOTA
            if (formData.price) {
                payload.price_min = formData.price;
                payload.price_max = formData.price;
            }
        }
    }
    
    // Usuwamy pole pomocnicze
    delete payload.price;

    try {
      await axios.put(`http://localhost:3000/api/dreams/${dream.id}`, payload, {
          withCredentials: true 
      });
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Błąd edycji:", err);
      // Sprawdzamy czy to problem z tokenem
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setError("Sesja wygasła. Zaloguj się ponownie.");
      } else {
          setError("Nie udało się zaktualizować marzenia.");
      }
    }
  };

  // Jeśli brak danych, nie pokazuj formularza
  if (!dream) return <div className="loading">Ładowanie danych marzenia...</div>;

  // --- RENDERY (Skrócone dla czytelności kodu, są OK w Twoim pliku) ---
  // ... (Tu możesz wkleić swoje ify renderFields, albo użyć kodu poniżej) ...
  
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
                        <input type="text" name="image" placeholder="Wklej link..." value={formData.image} onChange={handleChange} />
                    </div>
                </div>

                {/* Sekcja Ceny */}
                {giftVariant === 'model' ? (
                <div className="form-group">
                    <label>Przedział cenowy</label>
                    <select name="price" value={formData.price} onChange={handleChange} className="price-select">
                         <option value="">Wybierz widełki...</option>
                         {PRICE_RANGES.map((range, i) => (
                            <option key={i} value={i}>{range.label}</option>
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
                    <textarea name="description" placeholder="Opis..." rows="4" value={formData.description} onChange={handleChange} />
                </div>
            </div>
        );
    }
    // 2. CZAS 🕰️ i 3. UŚMIECH 😊 (Używają podobnych pól)
    return (
        <div className="fade-in">
            <div className="form-group">
                <label>Tytuł</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Zdjęcie (URL)</label>
                <div className="input-with-icon">
                    <ImageIcon size={16} />
                    <input type="text" name="image" value={formData.image} onChange={handleChange} />
                </div>
            </div>
            <div className="form-group">
                <label>Opis</label>
                <textarea name="description" rows="4" value={formData.description} onChange={handleChange} />
            </div>
        </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="add-dream-form fade-in">
      {/* NAGŁÓWEK TYPU */}
      <div className="type-selector-container" style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
        <button type="button" onClick={() => setFormData({...formData, type: 'time'})} className={`type-btn ${formData.type === 'time' ? 'active' : ''}`}><Clock size={20}/> Czas</button>
        <button type="button" onClick={() => setFormData({...formData, type: 'gift'})} className={`type-btn ${formData.type === 'gift' ? 'active' : ''}`}><Gift size={20}/> Prezent</button>
        <button type="button" onClick={() => setFormData({...formData, type: 'smile'})} className={`type-btn ${formData.type === 'smile' ? 'active' : ''}`}><Smile size={20}/> Uśmiech</button>
      </div>

      {/* SWITCH IDEA/MODEL (Tylko dla Prezentu) */}
      {formData.type === 'gift' && (
        <div className="gift-switch-container fade-in" style={{marginBottom: '15px'}}>
             <button type="button" onClick={() => setGiftVariant('idea')} className={giftVariant === 'idea' ? 'active' : ''} style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}><Compass size={16}/> Pomysł</button>
             <button type="button" onClick={() => setGiftVariant('model')} className={giftVariant === 'model' ? 'active' : ''} style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}><MousePointerClick size={16}/> Konkret</button>
        </div>
      )}

      {/* ZAWARTOŚĆ */}
      <div className="form-content">{renderFields()}</div>

      {/* PUBLICZNE */}
      <div className="gift-switch-container" style={{marginTop: '15px'}}>
            <button type="button" onClick={() => setFormData({...formData, is_public: true})} className={formData.is_public ? 'active' : ''} style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}><Globe size={16}/> Publiczne</button>
            <button type="button" onClick={() => setFormData({...formData, is_public: false})} className={!formData.is_public ? 'active' : ''} style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}><Lock size={16}/> Prywatne</button>
      </div>

      {error && <p className="error-text" style={{color: 'red', textAlign:'center', marginTop:'10px'}}>{error}</p>}

      <div className="form-actions" style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
        <button type="button" onClick={onCancel} className="btn-secondary" style={{flex: 1}}>Anuluj</button>
        <button type="submit" className="btn-primary" style={{flex: 1}}>Zapisz zmiany</button>
      </div>
    </form>
  );
}