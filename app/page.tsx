"use client"

import React, { useState, ChangeEvent } from 'react';
import Link from 'next/link';

interface Result {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  category: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: string[];
}

export default function Home() {
  const [inputValue, setInputValue] = useState<string>('');
  const [results, setResults] = useState<Result[]>([]);
  const [isCentered, setIsCentered] = useState<boolean>(true);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSearch = async () => {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(inputValue)}&format=jsonv2`);
    const data: Result[] = await response.json();
    setResults(data);
    setIsCentered(false);
  };

  return (
    <main className="bg-green-500 min-h-screen flex flex-col justify-center items-center pb-12 text-black" >
      <div className={`bg-white w-full max-w-md rounded p-6 ${isCentered ? 'mt-0' : 'mt-10'}`} >
        <input 
          type="text" 
          value={inputValue} 
          onChange={handleInputChange} 
          className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-black"
        />
        <button 
          onClick={handleSearch} 
          className="bg-green-600 text-white mt-4 w-full p-2 rounded hover:bg-green-700 transition"
        >
          Search
        </button>
      </div>

      <div className="flex flex-col items-center justify-center w-full max-w-md">
        {results.map((result: Result, index: number) => (
          <div key={index} className="bg-white text-black rounded p-6 mt-4 w-full animate">
            <hr className="border-green-300"></hr>
            <Link href={`/${result.place_id}`} className="cursor-pointer hover:underline">
              <p>Place ID: {result.place_id}</p>
              <p>Display Name: {result.display_name}</p>
              <p>Latitude: {result.lat}</p>
              <p>Longitude: {result.lon}</p>
              <p>Type: {result.type}</p>
              <p>Place Rank: {result.place_rank}</p>
              <p>Bounding Box: {result.boundingbox.join(', ')}</p>
            </Link>
            <hr className="border-green-300"></hr>
          </div>
        ))}
      </div>
    </main>
  );
};