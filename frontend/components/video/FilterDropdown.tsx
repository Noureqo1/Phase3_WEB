'use client';

import { useState } from 'react';

interface FilterDropdownProps {
  onFilterChange: (filter: string) => void;
  currentFilter: string;
}

export default function FilterDropdown({ onFilterChange, currentFilter }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const filters = [
    { value: 'newest', label: 'Newest' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'viewed', label: 'Most Viewed' },
    { value: 'rated', label: 'Top Rated' }
  ];

  const handleFilterSelect = (filterValue: string) => {
    onFilterChange(filterValue);
    setIsOpen(false);
  };

  const getCurrentLabel = () => {
    const filter = filters.find(f => f.value === currentFilter);
    return filter ? filter.label : 'Sort by';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-600"
      >
        <span className="text-gray-700">{getCurrentLabel()}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleFilterSelect(filter.value)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                currentFilter === filter.value ? 'bg-purple-50 text-purple-600 font-medium' : 'text-gray-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
