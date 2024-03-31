"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import Link from "next/link";
import {
  LocationMarkerIcon,
  InformationCircleIcon,
  GlobeAltIcon,
} from "@heroicons/react/solid";
import { RefreshIcon } from "@heroicons/react/outline";

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
  const [inputValue, setInputValue] = useState<string>("");
  const [results, setResults] = useState<Result[]>([]);
  const [isCentered, setIsCentered] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchClicked, setSearchClicked] = useState<boolean>(false);

  useEffect(() => {
    const savedInputValue = localStorage.getItem("inputValue");
    if (savedInputValue) {
      setInputValue(savedInputValue);
    }
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    localStorage.setItem("inputValue", event.target.value);
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setSearchClicked(true); // Add this line
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        inputValue
      )}&format=jsonv2`
    );
    const data: Result[] = await response.json();
    setResults(data?.sort((a, b) => a.importance - b.importance));
    setIsCentered(false);
    setIsLoading(false);
  };

  return (
    <main className="bg-green-500 min-h-screen flex flex-col justify-center items-center pb-12 text-black p-2">
      {results.length === 0 && (
        <span className=" text-4xl font-bold text-green-100">
          <div className="flex items-center justify-center">
            <GlobeAltIcon className="  h-12 w-12 min-w-12 text-green-100 mr-2" />
            LocalLens
          </div>
        </span>
      )}

      <div
        className={`bg-white w-full max-w-md rounded mt-4 p-6  ${
          isCentered ? "mt-0" : "mt-10"
        }`}
      >
        <input
          type="text"
          value={inputValue}
          placeholder="Search for an address..."
          onChange={handleInputChange}
          className="w-full  px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-black hover:border-black hover:border"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <button
          onClick={handleSearch}
          className="bg-green-600 flex items-center justify-center text-white mt-4 w-full p-2 rounded hover:bg-green-700 transition"
        >
          {isLoading ? (
            <RefreshIcon className="animate-spin h-5 w-5 mr-3 " />
          ) : null}
          Search
        </button>
      </div>

      <div className="flex flex-col items-center justify-center w-full max-w-md">
        {results.map((result: Result, index: number) => (
          <div
            key={index}
            className="bg-green-100 border  border-white text-black rounded-lg p-6 mt-4 w-full animate shadow-lg flex flex-col hover:border-black hover:border border-in hover:cursor-pointer hover:underline"
          >
            <div className="w-full  md:pl-4 mt-4 md:mt-0">
              <Link href={`/${result.osm_id}`} className="">
                <h2 className="text-2xl font-semibold mb-2 flex items-center">
                  <LocationMarkerIcon className="h-12 w-12 min-w-12 text-green-500 mr-4 " />
                  {result.display_name}
                </h2>
              </Link>
              <p>
                <span className="font-semibold">Category:</span>{" "}
                {result.category.charAt(0).toUpperCase() +
                  result.category.slice(1)}
              </p>
            </div>
          </div>
        ))}
       
        {results.length === 0 &&  searchClicked && (
          <div className="bg-green-100 border border-white text-black rounded-lg p-6 mt-4 w-full animate shadow-lg flex flex-col hover:border-black hover:border border-in ">
            <div className="w-full  md:pl-4 mt-4 md:mt-0">
              <h2 className="text-2xl font-bold mb-2 flex items-center">
                <InformationCircleIcon className="h-12 w-12 min-w-12 text-green-500 mr-2" />
                No results found
              </h2>
              <p>
                <span className="font-bold">Try:</span> Searching for a different
                address
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
