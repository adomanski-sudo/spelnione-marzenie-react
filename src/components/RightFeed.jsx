import React from 'react';
import './RightFeed.css'; // <--- Import stylu

export default function RightFeed() {
  return (
    <aside className="feed">
      <h3 style={{ textTransform: 'uppercase', fontSize: '12px', color: '#94a3b8', letterSpacing: '1px' }}>
        Co się dzieje teraz?
      </h3>
      
      {/* Przykładowa lista */}
      <div style={{ marginTop: '20px' }}>
        <p style={{ fontSize: '14px' }}>Kasia spełniła marzenie...</p>
        <p style={{ fontSize: '14px', marginTop: '10px' }}>Marek dodał cel...</p>
      </div>
    </aside>
  );
}