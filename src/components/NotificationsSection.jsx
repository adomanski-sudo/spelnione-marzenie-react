import React, { useState, useEffect } from 'react';
import './NotificationsSection.css';
import { Heart, UserPlus, Gift, Sparkles, Check, Trash2 } from 'lucide-react';

export default function NotificationsSection() {
  const [notifications, setNotifications] = useState([]);

  // Symulacja pobierania powiadomień
  useEffect(() => {
    // Generujemy przykładowe dane
    const mockNotifications = [
      { id: 1, type: 'donation', user: 'Anna Nowak', text: 'wpłaciła 50 PLN na Twoje marzenie "Podróż do Japonii"', time: '2 min temu', read: false },
      { id: 2, type: 'follow', user: 'Marek Z.', text: 'zaczął Cię obserwować', time: '15 min temu', read: false },
      { id: 3, type: 'like', user: 'Kasia Koduje', text: 'polubiła Twój profil', time: '1 godz. temu', read: true },
      { id: 4, type: 'fulfill', user: 'Tomek Dev', text: 'spełnił marzenie, które obserwujesz: "Własna gra"', time: '3 godz. temu', read: true },
      { id: 5, type: 'system', user: 'Zespół SpelnioneMarzenie.pl', text: 'Witaj w społeczności! Uzupełnij swój profil.', time: '1 dzień temu', read: true },
    ];
    
    setNotifications(mockNotifications);
  }, []);

  // Funkcja oznaczająca wszystkie jako przeczytane
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Funkcja usuwania pojedynczego powiadomienia
  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Helper do ikony zależnie od typu
  const getIcon = (type) => {
    switch (type) {
      case 'like': return <Heart size={20} className="notif-icon icon-like" />;
      case 'follow': return <UserPlus size={20} className="notif-icon icon-follow" />;
      case 'donation': return <Gift size={20} className="notif-icon icon-donation" />;
      case 'fulfill': return <Sparkles size={20} className="notif-icon icon-fulfill" />;
      default: return <Check size={20} className="notif-icon icon-system" />;
    }
  };

  // Dzielimy na nowe i starsze
  const newNotifs = notifications.filter(n => !n.read);
  const oldNotifs = notifications.filter(n => n.read);

  return (
    <div className="notifications-container fade-in">
      <div className="notif-header">
        <h2>Powiadomienia</h2>
        {newNotifs.length > 0 && (
          <button className="btn-mark-read" onClick={markAllAsRead}>
            Oznacz wszystkie jako przeczytane
          </button>
        )}
      </div>

      <div className="notif-list">
        
        {/* SEKCJA NOWE */}
        {newNotifs.length > 0 && (
            <>
                <h3 className="section-label">Nowe</h3>
                {newNotifs.map(item => (
                    <NotificationItem 
                        key={item.id} 
                        item={item} 
                        getIcon={getIcon} 
                        onDelete={deleteNotification}
                    />
                ))}
            </>
        )}

        {/* SEKCJA WCZEŚNIEJSZE */}
        {oldNotifs.length > 0 && (
            <>
                <h3 className="section-label">Wcześniejsze</h3>
                {oldNotifs.map(item => (
                    <NotificationItem 
                        key={item.id} 
                        item={item} 
                        getIcon={getIcon} 
                        onDelete={deleteNotification}
                    />
                ))}
            </>
        )}

        {notifications.length === 0 && (
            <div className="empty-state">
                <p>Wszystko wyczyszczone! Brak nowych powiadomień.</p>
            </div>
        )}
      </div>
    </div>
  );
}

// Podkomponent pojedynczego wiersza (dla czystości kodu)
function NotificationItem({ item, getIcon, onDelete }) {
    return (
        <div className={`notif-item ${!item.read ? 'unread' : ''}`}>
            <div className="notif-icon-wrapper">
                {getIcon(item.type)}
            </div>
            <div className="notif-content">
                <p>
                    <strong>{item.user}</strong> {item.text}
                </p>
                <span className="notif-time">{item.time}</span>
            </div>
            <button className="btn-delete" onClick={() => onDelete(item.id)} title="Usuń">
                <Trash2 size={16} />
            </button>
        </div>
    );
}