"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("./MyMap"), { ssr: false });

export default function Page({ params }) {
  const [data, setData] = useState(null);
  const [dataType, setDataType] = useState("");
  const [pointsOfInterest, setPointsOfInterest] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const responses = await Promise.all([
        fetch(
          `https://nominatim.openstreetmap.org/lookup?osm_ids=N${params.id}&format=jsonv2`
        ),
        fetch(
          `https://nominatim.openstreetmap.org/lookup?osm_ids=W${params.id}&format=jsonv2`
        ),
        fetch(
          `https://nominatim.openstreetmap.org/lookup?osm_ids=R${params.id}&format=jsonv2`
        ),
      ]);

      const data = await Promise.all(
        responses.map((response) => response.json())
      );

      if (data[0].length > 0) {
        setData(data[0]);
        setDataType("Node");
      } else if (data[1].length > 0) {
        setData(data[1]);
        setDataType("Way");
      } else if (data[2].length > 0) {
        setData(data[2]);
        setDataType("Relation");
      }

      const lat = data[0][0]?.lat || data[1][0]?.lat || data[2][0]?.lat || 0;
      const lon = data[0][0]?.lon || data[1][0]?.lon || data[2][0]?.lon || 0;

      const overpassResponse = await fetch(
        `https://overpass-api.de/api/interpreter?data=[out:json];(node[shop=supermarket](around:3000,${lat},${lon});node[leisure=park](around:3000,${lat},${lon});node[railway=station](around:3000,${lat},${lon});node[amenity=restaurant](around:3000,${lat},${lon}););out;`
      );
      const overpassData = await overpassResponse.json();
      setPointsOfInterest(overpassData.elements);
    };

    fetchData();
  }, [params.id]);

  if (!data) {
    return <div>Loading...</div>;
  }

  const position = [
    parseFloat(data[0]?.lat || 0),
    parseFloat(data[0]?.lon || 0),
  ];

  return (
    <div className="bg-gray-700">
      <div style={{ height: "500px", width: "100%" }}>
        <DynamicMap
          position={position}
          pointsOfInterest={pointsOfInterest}
          zoom={13}
        />
      </div>
      <h1>My Post: {params.id}</h1>
      <h2>{dataType} Data</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>

      {/*
            <h2>Points of Interest within 10km</h2>
            <pre>{JSON.stringify(pointsOfInterest, null, 2)}</pre>
*/}
    </div>
  );
}
