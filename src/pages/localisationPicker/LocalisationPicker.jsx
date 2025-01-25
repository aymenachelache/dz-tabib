import PropTypes from 'prop-types'; // Importer PropTypes
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from 'react';

const LocationPicker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState([36.752887, 3.042048]); // Default (Algiers)

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        onLocationSelect(lat, lng); // Appel de la fonction avec la position
      },
    });

    return position === null ? null : <Marker position={position} />;
  };

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      className="w-full h-64 rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker />
    </MapContainer>
  );
};

// Validation des props avec PropTypes
LocationPicker.propTypes = {
  onLocationSelect: PropTypes.func.isRequired, // Déclare que onLocationSelect est une fonction obligatoire
};

export default LocationPicker;
