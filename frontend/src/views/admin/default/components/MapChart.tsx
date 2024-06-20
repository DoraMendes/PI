'use client';

import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

const geoUrl =
  "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

const MapChart = () => {
  return (
    <MapContainer center={[51.505, -0.09]} zoom={13}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>

  );
};

export default MapChart;
