'use client';

import { useState } from 'react';

interface VideoSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function VideoSearch({ onSearch, placeholder = "Search videos..." }: VideoSearchProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700 transition"
        >
          🔍
        </button>
      </div>
    </form>
  );
}
