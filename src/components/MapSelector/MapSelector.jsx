import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "./MapSelector.css";
const MapSelector = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        onLocationSelect(e.latlng);
      },
    });
    return null;
  };

  return (
    <div style={{ height: "400px", marginBottom: "1rem" }}>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <MapEvents />
        {position && <Marker position={position} />}
      </MapContainer>
      <p>Click on the map to select your location.</p>
    </div>
  );
};

export default MapSelector;
