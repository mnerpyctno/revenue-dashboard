'use client';

import Link from 'next/link';

export default function Home() {
  const cards = [
    {
      title: 'Планы продаж',
      description: 'Управление планами продаж, просмотр и редактирование основных и дополнительных планов',
      href: '/plans'
    },
    {
      title: 'Справочник',
      description: 'Справочник торговых объектов, управление информацией о магазинах',
      href: '/directory'
    }
  ];

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Добро пожаловать в систему учета выручки
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {card.title}
              </h2>
              <p className="text-gray-600">
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
} 