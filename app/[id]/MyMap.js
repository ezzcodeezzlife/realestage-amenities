"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MyMap(props) {
  const { position, pointsOfInterest, zoom } = props;

  return (
    <MapContainer
      style={{ height: "600px", width: "600px" }}
      center={position}
      zoom={zoom}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      {pointsOfInterest?.map((poi, index) => (
        <Marker key={index} position={[poi.lat, poi.lon]}>
          <Popup>
            {poi.tags.name} <br />{" "}
            {poi.tags.amenity ||
              poi.tags.shop ||
              poi.tags.leisure ||
              poi.tags.railway}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
