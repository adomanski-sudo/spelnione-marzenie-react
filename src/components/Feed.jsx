import React from 'react';

export default function Feed() {
  // Przykładowe dane (później podepniemy tu prawdziwe z bazy)
  const activities = [
    { id: 1, type: 'success', text: 'Tomek spełnił marzenie: Buty biegowe!', time: '5 min temu' },
    { id: 2, type: 'new', text: 'Basia dodała marzenie: Mikser', time: '1 godz. temu' },
    { id: 3, type: 'new', text: 'Alex dodała marzenie: Gitara', time: '3 godz. temu' },
    { id: 4, type: 'success', text: 'Marek spełnił marzenie: Rower', time: '1 dzień temu' },
  ];

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-fit">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        Ostatnie aktywności
      </h3>
      
      <div className="space-y-4">
        {activities.map((item) => (
          <div key={item.id} className="flex gap-3 items-start pb-3 border-b border-gray-50 last:border-0">
            <div className="mt-1">
              {item.type === 'success' ? '🏆' : '✨'}
            </div>
            <div>
              <p className="text-sm text-gray-700 leading-tight">
                {item.text}
              </p>
              <span className="text-xs text-gray-400">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}