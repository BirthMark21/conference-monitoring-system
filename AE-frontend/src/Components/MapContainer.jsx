import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = () => {
  useEffect(() => {
    // Create a map instance and specify the coordinates and zoom level
    const map = L.map("map", {
      center: [51.505, -0.09], // Replace with your desired coordinates
      zoom: 13, // Adjust the zoom level as needed
    });

    // Add a tile layer (usually from a mapping provider like OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
  }, []);

  return <div id="map" style={{ width: "100%", height: "400px" }}></div>;
};

export default MapComponent;
