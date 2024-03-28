"use client";

import React, { useState, ChangeEvent } from 'react';

interface Result {
  place_id: number;
  display_name: string;
}

export default function Home() {
  const [inputValue, setInputValue] = useState<string>('');
  const [results, setResults] = useState<Result[]>([]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSearch = async () => {
    const response = await fetch(`https://nominatim.openstreetmap.org/search.php?q=${encodeURIComponent(inputValue)}&format=jsonv2`);
    const data: Result[] = await response.json();
    setResults(data);
  };

  return (
    <main>
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <button onClick={handleSearch}>Search</button>
      {results.map((result: Result, index: number) => (
        <div key={index}>
          <p>{result.place_id}</p>
        </div>
      ))}
    </main>
  );
}