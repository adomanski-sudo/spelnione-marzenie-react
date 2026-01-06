import React, { useState } from 'react';
import { Gift, Clock, Smile, Link as LinkIcon, Image as ImageIcon, Globe, Lock, Compass, MousePointerClick} from 'lucide-react';
import './AuthForm.css'; // Używamy stylów auth, bo są ładne, albo własnych
import './AddDreamForm.css';

const PRICE_RANGES = [
  { label: 'Wybierz zakres...', min: null, max: null },
  { label: 'do 100 zł', min: 0, max: 100 },
  { label: '100 – 300 zł', min: 100, max: 300 },
  { label: '300 – 700 zł', min: 300, max: 700 },
  { label: '700 – 1500 zł', min: 700, max: 1500 },
  { label: 'powyżej 1500 zł', min: 1500, max: null } // Max null oznacza brak górnej granicy
];

export default function AddDreamForm({ onAdd, onCancel }) {
  
  // Stan dla wariantu prezentu (Pomysł vs Konkret)
  const [giftVariant, setGiftVariant] = useState('idea'); 

  // Główny stan formularza
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price_min: '',
    price_max: '',
    type: 'time',   // Domyślnie prezent
    image: '',
    is_public: true
  });

  // Funkcja obsługująca zmianę Selecta z ceną
  const handlePriceChange = (e) => {
    // e.target.value zwróci np. "100-300" (musimy to sparsować) lub indeks tablicy
    // Najbezpieczniej użyć indeksu tablicy PRICE_RANGES
    const index = e.target.selectedIndex;
    const selectedRange = PRICE_RANGES[index];

    setFormData({
      ...formData,
      price_min: selectedRange.min,
      price_max: selectedRange.max
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Upewniamy się, że wysyłamy odpowiedni typ
    onAdd(formData);
  };

  // --- FUNKCJA STERUJĄCA POLAMI ---
  const renderFields = () => {
    
    // 1. SCENARIUSZ: PREZENT - POMYSŁ 💡
    if (formData.type === 'gift') {
        return (
            <div className="fade-in">
                <div className="form-group">
                    <label>
                        {giftVariant === 'model' ? 'Tytuł' : 'Tytuł'}
                    </label>
                    <input 
                        type="text" name="title" 
                        placeholder={giftVariant === 'model' ? "np. słuchawki Sony WH-1000XM5" : "np. farby olejne lub wełniany sweter?"} 
                        value={formData.title} onChange={handleChange} required 
                    />
                </div>

                <div className="form-group">
                    <label>Zdjęcie (URL)</label>
                    <div className="input-with-icon">
                        <ImageIcon size={16} />
                        <input 
                            type="text" name="image" placeholder="Wklej link do zdjęcia..." 
                            value={formData.image} onChange={handleChange} 
                        />
                    </div>
                </div>

                {/* --- SELECT Z WIDEŁKAMI --- */}
                {/* --- Model - lista, Pomysł - przybliżona cena --- */}
                {giftVariant === 'model' ? 
                <div className="form-group">
                    <label>Przedział cenowy</label>
                    <select 
                        onChange={handlePriceChange}
                        className="price-select"
                    >
                         {PRICE_RANGES.map((range, index) => (
                            <option key={index} value={index}>
                                {range.label}
                            </option>
                        ))}
                    </select>
                </div> 
                : 
                <div className="form-group">
                    <label>Przybliżona cena</label>
                        <div className="form-group">
                        <input 
                            type="number" name="price" placeholder="np. 100 zł" 
                            value={formData.price} onChange={handleChange} 
                        />
                    </div>
                </div>
                }


                <div className="form-group">
                    <label>Opis</label>
                    <textarea 
                        name="description" placeholder="Dlaczego właśnie to chcesz dostać w prezenicu?" rows="5"
                        value={formData.description} onChange={handleChange}
                    />
                </div>
            </div>
        );
    }

    // 3. SCENARIUSZ: WSPÓLNY CZAS 🕰️
    if (formData.type === 'time') {
        return (
            <div className="fade-in">
                <div className="form-group">
                    <label>Tytuł</label>
                    <input 
                        type="text" name="title" placeholder="np. wycieczka wgóry, wspólne jam session albo wyjście na koncert." 
                        value={formData.title} onChange={handleChange} required 
                    />
                    {/* DODANY INPUT ZDJĘCIA */}
                <div className="form-group">
                    <label>Zdjęcie (URL)</label>
                    <div className="input-with-icon">
                        <ImageIcon size={16} />
                        <input 
                            type="text" name="image" placeholder="Wklej link do zdjęcia..." 
                            value={formData.image} onChange={handleChange} 
                        />
                    </div>
                </div>
                </div>
                <div className="form-group">
                    <label>Opis</label>
                    <textarea 
                        name="description" placeholder="Gdzie, kiedy, co trzeba zabrać?..." rows="4"
                        value={formData.description} onChange={handleChange}
                    />
                </div>
            </div>
        );
    }

    // 4. SCENARIUSZ: UŚMIECH 😊
    if (formData.type === 'smile') {
        return (
            <div className="fade-in">
                <div className="form-group">
                    <label>Tytuł</label>
                    <input 
                        type="text" name="title" placeholder="np. ulubiona czekolada, kwiaty bez okazji" 
                        value={formData.title} onChange={handleChange} required 
                    />
                </div>
                {/* DODANY INPUT ZDJĘCIA */}
                <div className="form-group">
                    <label>Zdjęcie (URL)</label>
                    <div className="input-with-icon">
                        <ImageIcon size={16} />
                        <input 
                            type="text" name="image" placeholder="Wklej link do zdjęcia..." 
                            value={formData.image} onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>Opis (opcjonalne)</label>
                    <textarea 
                        name="description" placeholder="Np. gorzka z orzechami..." rows="2"
                        value={formData.description} onChange={handleChange}
                    />
                </div>
            </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-dream-form fade-in">
      
      {/* --- 1. WYBÓR TYPU (IKONY) --- */}
      <div className="type-selector-container" style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>

        <button
          type="button"
          onClick={() => setFormData({...formData, type: 'time', price: ''})}
          className={`type-btn ${formData.type === 'time' ? 'active' : ''}`}
        >
          <Clock size={20} /> <span>Czas</span>
        </button>

        <button
          type="button"
          onClick={() => setFormData({...formData, type: 'gift'})}
          className={`type-btn ${formData.type === 'gift' ? 'active' : ''}`}
        >
          <Gift size={20} /> <span>Prezent</span>
        </button>

        

        <button
          type="button"
          onClick={() => setFormData({...formData, type: 'smile', price: ''})}
          className={`type-btn ${formData.type === 'smile' ? 'active' : ''}`}
        >
          <Smile size={20} /> <span>Uśmiech</span>
        </button>
      </div>

      {/* --- 2. PODTYTUŁ / SWITCH (Zależne od typu) --- */}
      <div className="type-selector-content" style={{marginBottom: '15px', minHeight: '30px'}}>
        
        {formData.type === 'time' && (
            <div className="info-text fade-in">
                Wspólny czas,doświadczenia, tworzenie wspomnień, aktywności.
            </div>
        )}

        {formData.type === 'smile' && (
            <div className="info-text fade-in">
                Zawsze mile widziane. Drobnostki, które sprawiają, że się uśmiechasz.
            </div>
        )}

        {formData.type === 'gift' && (
            <div className="gift-switch-container fade-in">
                <button
                    type="button"
                    onClick={() => setGiftVariant('idea')}
                    className={giftVariant === 'idea' ? 'active' : ''}
                    style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}
                >
                    <Compass /> Pomysł
                </button>
                <button
                    type="button"
                    onClick={() => setGiftVariant('model')}
                    className={giftVariant === 'model' ? 'active' : ''}
                    style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}
                >
                    <MousePointerClick /> Konkret
                </button>
            </div>
        )}
      </div>

      {/* --- 3. ZMIENNA ZAWARTOŚĆ FORMULARZA --- */}
      <div className="form-content">
          {renderFields()}
      </div>

      {/* --- PRZEŁĄCZNIK PRYWATNOŚCI --- */}
      <div className="form-group" style={{marginTop: '10px'}}>
        
        <div className="gift-switch-container" style={{maxWidth: '100%'}}>
            {/* Opcja: PUBLICZNE */}
            <button
                type="button"
                onClick={() => setFormData({...formData, is_public: true})}
                className={formData.is_public ? 'active' : ''}
                style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}
            >
                <Globe size={16} />
                <span>Publiczne</span>
            </button>

            {/* Opcja: PRYWATNE (Dla znajomych) */}
            <button
                type="button"
                onClick={() => setFormData({...formData, is_public: false})}
                className={!formData.is_public ? 'active' : ''} // Active gdy is_public jest false
                style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}
            >
                <Lock size={16} />
                <span>Tylko znajomi</span>
            </button>
        </div>
        
        {/* Mały opis pod spodem dla jasności */}
        <div style={{textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', marginTop: '5px'}}>
            {formData.is_public 
                ? 'Widoczne dla wszystkich odwiedzających Twój profil.' 
                : 'Widoczne tylko dla osób, które masz w znajomych.'}
        </div>
      </div>

      {/* --- 4. PRZYCISKI AKCJI --- */}
      <div className="form-actions" style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
        <button type="button" onClick={onCancel} className="btn-secondary" style={{flex: 1}}>
          Anuluj
        </button>
        <button type="submit" className="btn-primary" style={{flex: 1}}>
          Dodaj marzenie
        </button>
      </div>

    </form>
  );
}