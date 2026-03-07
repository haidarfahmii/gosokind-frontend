"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapPickerProps {
    lat: number;
    lng: number;
    onChange: (lat: number, lng: number) => void;
}

// Komponen baru untuk menggeser peta otomatis
const MapUpdater = ({ lat, lng }: { lat: number; lng: number }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            map.flyTo([lat, lng], 16); // Geser animasi ke lokasi baru dengan zoom 16
        }
    }, [lat, lng, map]);
    return null;
};

const LocationMarker = ({ lat, lng, onChange }: MapPickerProps) => {
    useMapEvents({
        click(e) {
            onChange(e.latlng.lat, e.latlng.lng);
        },
    });
    return <Marker position={[lat, lng]} />;
};

export default function MapPicker({ lat, lng, onChange }: MapPickerProps) {
    const defaultLat = lat || -6.200000;
    const defaultLng = lng || 106.816666;

    return (
        <MapContainer
            center={[defaultLat, defaultLng]}
            zoom={13}
            style={{ height: "300px", width: "100%", borderRadius: "0.75rem", zIndex: 10 }}
        >
            <TileLayer
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                maxZoom={20}
            />
            <MapUpdater lat={defaultLat} lng={defaultLng} />
            <LocationMarker lat={defaultLat} lng={defaultLng} onChange={onChange} />
        </MapContainer>
    );
}