"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons yang rusak di Next.js
// Next.js tidak bundle asset leaflet secara otomatis, sehingga URL marker
// perlu di-override ke CDN.
function fixLeafletIcons() {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
}

// Sub-component: tangkap event klik peta
interface MapClickHandlerProps {
  onChange: (lat: number, lng: number) => void;
}

function MapClickHandler({ onChange }: MapClickHandlerProps) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Sub-component: pindahkan viewport peta ke koordinat baru
interface RecenterMapProps {
  lat: number;
  lng: number;
}

function RecenterMap({ lat, lng }: RecenterMapProps) {
  const map = useMap();
  useEffect(() => {
    if (lat !== 0 && lng !== 0) {
      map.setView([lat, lng], map.getZoom());
    }
  }, [lat, lng, map]);
  return null;
}

// Props utama MapPicker
export interface MapPickerProps {
  /** Latitude posisi marker saat ini */
  lat: number;
  /** Longitude posisi marker saat ini */
  lng: number;
  /** Callback dipanggil saat user klik peta */
  onChange: (lat: number, lng: number) => void;
  /** Tinggi container peta (default: "300px") */
  height?: string;
  /** Zoom level awal (default: 13) */
  zoom?: number;
}

// Default center Indonesia: Jakarta
const DEFAULT_CENTER: [number, number] = [-6.2088, 106.8456];

export default function MapPicker({
  lat,
  lng,
  onChange,
  height = "300px",
  zoom = 13,
}: MapPickerProps) {
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  const hasPosition = lat !== 0 && lng !== 0;
  const center: [number, number] = hasPosition ? [lat, lng] : DEFAULT_CENTER;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height, width: "100%" }}
      // z-0 agar tidak overlap elemen lain di admin dashboard
      className="z-0 rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Handler klik peta */}
      <MapClickHandler onChange={onChange} />

      {/* Marker & recenter hanya ditampilkan jika posisi sudah dipilih */}
      {hasPosition && (
        <>
          <Marker position={[lat, lng]} />
          <RecenterMap lat={lat} lng={lng} />
        </>
      )}
    </MapContainer>
  );
}
