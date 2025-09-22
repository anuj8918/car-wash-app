import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

 
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query, onSearch]);

  return (
    
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaSearch className="text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search by customer, car make, or model..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full input-style pl-10" 
      />
    </div>
  );
};

export default SearchBar;