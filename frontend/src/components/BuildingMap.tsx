/**
 * Simple site map — Pune campus pin for context (Leaflet).
 * No API key required (OSM tiles).
 */
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons in Vite
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const SITES: Record<string, { name: string; lat: number; lng: number }> = {
  "bldg-aspiria-01": { name: "Aspiria Campus — Building A", lat: 18.5912, lng: 73.7389 },
  "bldg-capgemini-pune": { name: "Capgemini Pune Campus", lat: 18.5679, lng: 73.7712 },
};

interface Props {
  buildingId: string | null;
  height?: string;
}

export const BuildingMap: React.FC<Props> = ({ buildingId, height = "220px" }) => {
  const site = (buildingId && SITES[buildingId]) || SITES["bldg-aspiria-01"];
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200" style={{ height }}>
      <MapContainer
        center={[site.lat, site.lng]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[site.lat, site.lng]} icon={icon}>
          <Popup>{site.name}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
