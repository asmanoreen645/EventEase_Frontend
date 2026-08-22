import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIconRetina from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
});

const DEFAULT_LAT = 32.5742;
const DEFAULT_LNG = 73.4851;

// Helper component jo map ki tiles ko auto-adjust aur re-render karta hai
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 300);
    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

const VendorMap = ({ latitude = DEFAULT_LAT, longitude = DEFAULT_LNG }) => {
  return (
    <div style={{ height: "300px", width: "100%", borderRadius: "10px", overflow: "hidden" }}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <MapResizer />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]}>
          <Popup>Vendor Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default VendorMap;